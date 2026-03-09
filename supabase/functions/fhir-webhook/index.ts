import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-fhir-signature, x-fhir-vendor, x-api-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const VALID_RESOURCE_TYPES = new Set([
  'Patient', 'Observation', 'Encounter', 'Condition', 'Procedure',
  'DiagnosticReport', 'MedicationRequest', 'AllergyIntolerance',
  'DocumentReference', 'RiskAssessment', 'ClinicalImpression',
  'Bundle', 'OperationOutcome',
]);

const VALID_VENDORS = new Set(['epic', 'cerner', 'meditech', 'allscripts']);

const MAX_PAYLOAD_SIZE = 500 * 1024;

// ── Rate Limiting ──────────────────────────────────
// In-memory sliding window (per-isolate; resets on cold start)
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 120; // 120 req/min per IP

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, retryAfter: 0 };
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, retryAfter: 0 };
}

// Periodic cleanup of stale entries
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (now - val.windowStart > RATE_LIMIT_WINDOW_MS * 2) rateLimitMap.delete(key);
  }
}, 120_000);

// ── API Key Validation ─────────────────────────────
function validateApiKey(req: Request): { valid: boolean; vendorId?: string } {
  const apiKey = req.headers.get('x-api-key');
  // If no sandbox keys configured, skip API key check (backwards compatible)
  const sandboxKeys = Deno.env.get('FHIR_SANDBOX_API_KEYS');
  if (!sandboxKeys) return { valid: true, vendorId: undefined };
  
  if (!apiKey) return { valid: false };
  
  try {
    // Format: JSON object { "key": "vendor_id", ... }
    const keys = JSON.parse(sandboxKeys) as Record<string, string>;
    if (keys[apiKey]) return { valid: true, vendorId: keys[apiKey] };
  } catch {
    // Fallback: single key
    if (apiKey === sandboxKeys) return { valid: true };
  }
  
  return { valid: false };
}

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

  const sourceIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // ── Rate Limit Check ────────────────────────
  const rl = checkRateLimit(sourceIp);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({
        resourceType: 'OperationOutcome',
        issue: [{ severity: 'error', code: 'throttled', diagnostics: `Rate limit exceeded. Retry after ${rl.retryAfter}s. Limit: ${RATE_LIMIT_MAX} req/min.` }],
      }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/fhir+json',
          'Retry-After': String(rl.retryAfter),
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // ── API Key Validation ───────────────────────
  const apiKeyResult = validateApiKey(req);
  if (!apiKeyResult.valid) {
    return new Response(
      JSON.stringify({ resourceType: 'OperationOutcome', issue: [{ severity: 'error', code: 'security', diagnostics: 'Invalid or missing API key. Provide x-api-key header.' }] }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/fhir+json' } }
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

    // Vendor from API key, header, or payload
    const vendorHeader = req.headers.get('x-fhir-vendor')?.toLowerCase() || null;
    const vendor = apiKeyResult.vendorId || (vendorHeader && VALID_VENDORS.has(vendorHeader) ? vendorHeader : null);

    // Signature verification
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
      {
        status: 201,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/fhir+json',
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': String(rl.remaining),
        },
      }
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
  if (payload.resourceType === 'Patient' && typeof payload.id === 'string') {
    return payload.id.slice(0, 128);
  }
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
  const meta = payload.meta as Record<string, unknown> | undefined;
  if (meta?.tag && Array.isArray(meta.tag)) {
    const eventTag = meta.tag.find((t: Record<string, unknown>) => t.system === 'https://vitasignal.ai/fhir/event-type');
    if (eventTag && typeof eventTag.code === 'string') return eventTag.code;
  }
  return 'resource-received';
}
