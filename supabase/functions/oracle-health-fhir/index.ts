/**
 * Oracle Health (Cerner) FHIR R4 Proxy
 * 
 * Handles OAuth2 client_credentials flow and proxies FHIR R4 requests
 * to Oracle Health / Cerner Millennium API.
 * 
 * Application Type: System (Confidential, Offline, SMART v2)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Oracle Health (Cerner) FHIR R4 endpoints
const CERNER_TOKEN_URL = "https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/protocols/oauth2/profiles/smart-v1/token";
const CERNER_FHIR_BASE = "https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d";

// In-memory token cache (edge functions are short-lived, so this is per-invocation)
let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && cachedToken.expires_at > Date.now() + 60_000) {
    return cachedToken.access_token;
  }

  const clientId = Deno.env.get("ORACLE_HEALTH_CLIENT_ID");
  const clientSecret = Deno.env.get("ORACLE_HEALTH_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("Oracle Health credentials not configured");
  }

  const response = await fetch(CERNER_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "system/Patient.read system/Observation.read system/Condition.read system/Encounter.read system/MedicationRequest.read",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[Oracle Health] Token error:", response.status, errorBody);
    throw new Error(`OAuth token request failed: ${response.status}`);
  }

  const tokenData = await response.json();
  cachedToken = {
    access_token: tokenData.access_token,
    expires_at: Date.now() + (tokenData.expires_in || 300) * 1000,
  };

  return cachedToken.access_token;
}

async function fhirRequest(path: string, token: string): Promise<any> {
  const url = `${CERNER_FHIR_BASE}/${path}`;
  console.log(`[Oracle Health] FHIR request: ${url}`);

  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/fhir+json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Oracle Health] FHIR error ${response.status}:`, errorBody);
    throw new Error(`FHIR request failed: ${response.status}`);
  }

  return response.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "status";

    // ── Connection Status Check ──────────────────
    if (action === "status") {
      try {
        const token = await getAccessToken();
        // Quick metadata check
        const metadata = await fhirRequest("metadata", token);
        return new Response(JSON.stringify({
          connected: true,
          vendor: "Oracle Health (Cerner)",
          fhirVersion: metadata.fhirVersion || "R4",
          serverSoftware: metadata.software?.name || "Cerner Millennium",
          serverVersion: metadata.software?.version || "unknown",
          status: "active",
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({
          connected: false,
          vendor: "Oracle Health (Cerner)",
          error: err instanceof Error ? err.message : "Connection failed",
          status: "disconnected",
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── Search Patients ──────────────────────────
    if (action === "search-patients") {
      const token = await getAccessToken();
      const count = url.searchParams.get("count") || "10";
      const name = url.searchParams.get("name");
      
      let searchPath = `Patient?_count=${count}`;
      if (name) searchPath += `&name=${encodeURIComponent(name)}`;
      
      const bundle = await fhirRequest(searchPath, token);
      return new Response(JSON.stringify(bundle), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Get Patient ──────────────────────────────
    if (action === "get-patient") {
      const patientId = url.searchParams.get("patientId");
      if (!patientId) {
        return new Response(JSON.stringify({ error: "patientId required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const token = await getAccessToken();
      const patient = await fhirRequest(`Patient/${patientId}`, token);
      return new Response(JSON.stringify(patient), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Get Observations ─────────────────────────
    if (action === "get-observations") {
      const patientId = url.searchParams.get("patientId");
      if (!patientId) {
        return new Response(JSON.stringify({ error: "patientId required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const token = await getAccessToken();
      const category = url.searchParams.get("category") || "vital-signs";
      const bundle = await fhirRequest(
        `Observation?patient=${patientId}&category=${category}&_count=20&_sort=-date`, token
      );
      return new Response(JSON.stringify(bundle), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Generic FHIR Proxy ───────────────────────
    if (action === "fhir-proxy") {
      const path = url.searchParams.get("path");
      if (!path) {
        return new Response(JSON.stringify({ error: "path parameter required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const token = await getAccessToken();
      const result = await fhirRequest(path, token);

      // Audit log
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("audit_logs").insert({
        user_id: "00000000-0000-0000-0000-000000000000",
        action: "oracle_health_fhir_query",
        resource_type: "fhir_resource",
        resource_id: path.split("/")[0] || "unknown",
        details: { path, vendor: "oracle_health" },
      });

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      error: "Unknown action",
      available: ["status", "search-patients", "get-patient", "get-observations", "fhir-proxy"],
    }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[Oracle Health] Error:", error);
    return new Response(JSON.stringify({
      error: "Oracle Health FHIR error",
      message: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
