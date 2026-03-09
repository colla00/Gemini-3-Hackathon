import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-fhir-signature, x-fhir-vendor, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Supported FHIR R4 resource types
const VALID_RESOURCE_TYPES = new Set([
  'Patient', 'Observation', 'Encounter', 'Condition', 'Procedure',
  'DiagnosticReport', 'MedicationRequest', 'AllergyIntolerance',
  'DocumentReference', 'RiskAssessment', 'ClinicalImpression',
  'Bundle', 'OperationOutcome',
]);

const VALID_VENDORS = new Set(['epic', 'cerner', 'meditech', 'allscripts']);

// Max payload size: 500KB
const MAX_PAYLOAD_SIZE = 500 * 1024;

// HMAC-SHA256 signature verification
async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const computed = Array.from(new Uint8Array(sig))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return computed === signature.replace('sha256=', '');
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ resourceType: 'OperationOutcome', issue: [{ severity: 'error', code: 'not-supported', diagnostics: 'Only POST is supported' }] }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/fhir+json' } }
    );
  }

  try {
    // Check payload size
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_PAYLOAD_SIZE) {
      return new Response(
        JSON.stringify({ resourceType: 'OperationOutcome', issue: [{ severity: 'error', code: 'too-costly', diagnostics: 'Payload exceeds maximum size' }] }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/fhir+json' } }
      );
    }

    const rawBody = await req.text();
    if (rawBody.length > MAX_PAYLOAD_SIZE) {
      return new Response(
        JSON.stringify({ resourceType: 'OperationOutcome', issue: [{ severity: 'error', code: 'too-costly', diagnostics: 'Payload exceeds maximum size' }] }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/fhir+json' } }
      );
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response(
        JSON.stringify({ resourceType: 'OperationOutcome', issue: [{ severity: 'error', code: 'invalid', diagnostics: 'Invalid JSON payload' }] }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/fhir+json' } }
      );
    }

    // Validate resource type
    const resourceType = typeof payload.resourceType === 'string' ? payload.resourceType : null;
    if (!resourceType || !VALID_RESOURCE_TYPES.has(resourceType)) {
      return new Response(
        JSON.stringify({ resourceType: 'OperationOutcome', issue: [{ severity: 'error', code: 'not-supported', diagnostics: `Unsupported resource type: ${resourceType}` }] }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/fhir+json' } }
      );
    }

    // Vendor from header or payload
    const vendorHeader = req.headers.get('x-fhir-vendor')?.toLowerCase() || null;
    const vendor = vendorHeader && VALID_VENDORS.has(vendorHeader) ? vendorHeader : null;

    // Signature verification (optional but flagged)
    const signature = req.headers.get('x-fhir-signature') || '';
    const webhookSecret = Deno.env.get('FHIR_WEBHOOK_SECRET');
    let signatureValid = false;
    if (signature && webhookSecret) {
      signatureValid = await verifySignature(rawBody, signature, webhookSecret);
    }

    // Extract key fields
    const resourceId = typeof payload.id === 'string' ? payload.id.slice(0, 128) : null;
    const patientId = extractPatientId(payload);
    const eventType = determineEventType(payload);

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const sourceIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    const { data, error } = await supabase.from('fhir_events').insert({
      event_type: eventType,
      resource_type: resourceType,
      resource_id: resourceId,
      vendor,
      patient_id: patientId,
      payload,
      signature_valid: signatureValid,
      source_ip: sourceIp,
    }).select('id, created_at').single();

    if (error) {
      console.error('Database insert error:', error.message);
      return new Response(
        JSON.stringify({ resourceType: 'OperationOutcome', issue: [{ severity: 'error', code: 'exception', diagnostics: 'Failed to process event' }] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/fhir+json' } }
      );
    }

    return new Response(
      JSON.stringify({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'information',
          code: 'informational',
          diagnostics: `Event ${data.id} received and processed successfully`,
        }],
        meta: {
          eventId: data.id,
          processedAt: data.created_at,
          signatureVerified: signatureValid,
          vendor: vendor || 'unspecified',
        },
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/fhir+json' } }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ resourceType: 'OperationOutcome', issue: [{ severity: 'error', code: 'exception', diagnostics: 'Internal processing error' }] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/fhir+json' } }
    );
  }
});

function extractPatientId(payload: Record<string, unknown>): string | null {
  // Direct Patient resource
  if (payload.resourceType === 'Patient' && typeof payload.id === 'string') {
    return payload.id.slice(0, 128);
  }
  // Subject reference (most FHIR resources)
  const subject = payload.subject as Record<string, unknown> | undefined;
  if (subject && typeof subject.reference === 'string') {
    const match = subject.reference.match(/Patient\/(.+)/);
    return match ? match[1].slice(0, 128) : null;
  }
  return null;
}

function determineEventType(payload: Record<string, unknown>): string {
  if (payload.resourceType === 'Bundle') {
    const bundleType = typeof payload.type === 'string' ? payload.type : 'unknown';
    return `bundle-${bundleType}`;
  }
  // Check for meta.tag for event hints
  const meta = payload.meta as Record<string, unknown> | undefined;
  if (meta?.tag && Array.isArray(meta.tag)) {
    const eventTag = meta.tag.find((t: Record<string, unknown>) => t.system === 'https://vitasignal.ai/fhir/event-type');
    if (eventTag && typeof eventTag.code === 'string') return eventTag.code;
  }
  return 'resource-received';
}
