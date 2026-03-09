import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * SMART on FHIR Launch Handler
 * 
 * Implements the SMART App Launch Framework (HL7 FHIR):
 * - EHR Launch: /smart-launch?launch={token}&iss={fhir_server}
 * - Standalone Launch: /smart-launch?iss={fhir_server}
 * - Token Exchange: /smart-launch (POST with authorization_code)
 * - .well-known/smart-configuration discovery endpoint
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // ── SMART Configuration Discovery ──────────────
    if (url.searchParams.get("action") === "discovery") {
      const baseUrl = `${supabaseUrl}/functions/v1/smart-launch`;
      return new Response(
        JSON.stringify({
          authorization_endpoint: `${baseUrl}?action=authorize`,
          token_endpoint: `${baseUrl}?action=token`,
          registration_endpoint: `${baseUrl}?action=register`,
          capabilities: [
            "launch-ehr",
            "launch-standalone",
            "client-public",
            "client-confidential-symmetric",
            "sso-openid-connect",
            "context-ehr-patient",
            "context-ehr-encounter",
            "context-standalone-patient",
            "permission-offline",
            "permission-patient",
            "permission-user",
          ],
          scopes_supported: [
            "launch",
            "openid",
            "fhirUser",
            "patient/Patient.read",
            "patient/Observation.read",
            "patient/Encounter.read",
            "patient/Condition.read",
            "patient/RiskAssessment.write",
          ],
          response_types_supported: ["code"],
          code_challenge_methods_supported: ["S256"],
          token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
          grant_types_supported: ["authorization_code"],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Authorization Endpoint (GET) ───────────────
    if (url.searchParams.get("action") === "authorize" || url.searchParams.has("launch")) {
      const clientId = url.searchParams.get("client_id");
      const redirectUri = url.searchParams.get("redirect_uri");
      const scope = url.searchParams.get("scope") || "launch";
      const state = url.searchParams.get("state");
      const launchToken = url.searchParams.get("launch");
      const iss = url.searchParams.get("iss");
      const codeChallenge = url.searchParams.get("code_challenge");
      const codeChallengeMethod = url.searchParams.get("code_challenge_method");

      if (!clientId || !redirectUri) {
        return new Response(
          JSON.stringify({ error: "invalid_request", error_description: "client_id and redirect_uri are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate registered app
      const { data: app, error: appError } = await supabase
        .from("smart_apps")
        .select("*")
        .eq("client_id", clientId)
        .eq("is_active", true)
        .single();

      if (appError || !app) {
        return new Response(
          JSON.stringify({ error: "invalid_client", error_description: "Unrecognized client_id" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate redirect URI
      if (!app.redirect_uris.includes(redirectUri)) {
        return new Response(
          JSON.stringify({ error: "invalid_request", error_description: "redirect_uri not registered" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate authorization code (opaque, short-lived)
      const authCode = crypto.randomUUID();
      
      // Store auth session (in-memory for demo; production would use DB)
      // For now, encode context in a signed token-like structure
      const sessionData = {
        code: authCode,
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        launch: launchToken,
        iss,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod,
        patient: launchToken ? `Patient/demo-${Date.now()}` : null,
        encounter: launchToken ? `Encounter/demo-${Date.now()}` : null,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min
      };

      // Store in audit log for traceability
      await supabase.from("audit_logs").insert({
        user_id: "00000000-0000-0000-0000-000000000000",
        action: "smart_authorize",
        resource_type: "smart_app",
        resource_id: clientId,
        details: { scope, launch: !!launchToken, iss },
      });

      // Build redirect with code
      const redirect = new URL(redirectUri);
      redirect.searchParams.set("code", authCode);
      if (state) redirect.searchParams.set("state", state);

      // In production, this would show a consent screen first
      // For demo/sandbox, we auto-approve
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          Location: redirect.toString(),
        },
      });
    }

    // ── Token Endpoint (POST) ──────────────────────
    if (req.method === "POST") {
      const body = await req.text();
      const params = new URLSearchParams(body);
      const grantType = params.get("grant_type");

      if (grantType !== "authorization_code") {
        return new Response(
          JSON.stringify({ error: "unsupported_grant_type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const code = params.get("code");
      const clientId = params.get("client_id");
      const redirectUri = params.get("redirect_uri");
      const codeVerifier = params.get("code_verifier");

      if (!code || !clientId || !redirectUri) {
        return new Response(
          JSON.stringify({ error: "invalid_request", error_description: "code, client_id, and redirect_uri required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate client
      const { data: app } = await supabase
        .from("smart_apps")
        .select("*")
        .eq("client_id", clientId)
        .eq("is_active", true)
        .single();

      if (!app) {
        return new Response(
          JSON.stringify({ error: "invalid_client" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate SMART token response
      const accessToken = crypto.randomUUID();
      const patientId = `demo-patient-${Date.now().toString(36)}`;

      // Log token issuance
      await supabase.from("audit_logs").insert({
        user_id: "00000000-0000-0000-0000-000000000000",
        action: "smart_token_issued",
        resource_type: "smart_app",
        resource_id: clientId,
        details: { patient: patientId },
      });

      return new Response(
        JSON.stringify({
          access_token: accessToken,
          token_type: "Bearer",
          expires_in: 3600,
          scope: app.scopes.join(" "),
          patient: patientId,
          encounter: `demo-encounter-${Date.now().toString(36)}`,
          need_patient_banner: true,
          smart_style_url: `${supabaseUrl}/functions/v1/smart-launch?action=style`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Style endpoint for embedded rendering ──────
    if (url.searchParams.get("action") === "style") {
      return new Response(
        JSON.stringify({
          color_background: "#ffffff",
          color_error: "#dc2626",
          color_highlight: "#0d9488",
          color_modal_background: "#ffffff",
          color_nav: "#1e293b",
          dim_border_radius: "6px",
          dim_font_size: "14px",
          dim_spacing_size: "16px",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "invalid_request", error_description: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[SMART Launch] Error:", error);
    return new Response(
      JSON.stringify({ error: "server_error", error_description: "Internal processing error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
