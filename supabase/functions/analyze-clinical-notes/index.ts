import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_NOTES_LENGTH = 50000; // 50KB limit for clinical notes

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Strict authentication - require valid JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;
    console.log("[Auth] Authenticated user:", userId);

    const { notes, patientContext } = await req.json();

    if (!notes || notes.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Clinical notes are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input length validation
    if (notes.length > MAX_NOTES_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Clinical notes exceed maximum length of ${MAX_NOTES_LENGTH} characters` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[Gemini 3] Analyzing clinical notes for user:", userId);
    console.log("[Gemini 3] Notes length:", notes.length, "characters");

    const systemPrompt = `You are a clinical AI assistant analyzing nurse observations to detect early warning signs of patient deterioration. Your role is to help nurses identify patterns that may indicate CAUTI (Catheter-Associated Urinary Tract Infection), sepsis, respiratory distress, or other deterioration.

IMPORTANT: You are a decision-support tool, not a diagnostic system. All findings must be verified by clinical staff.

Analyze the clinical notes and extract:
1. Warning signs mentioned (explicit and subtle)
2. Risk level assessment based on patterns
3. Monitoring recommendations
4. Confidence in your analysis

Return a valid JSON object with this exact structure:
{
  "warningSigns": [
    {
      "sign": "description of warning sign",
      "severity": "high" | "medium" | "low",
      "category": "vital_signs" | "symptoms" | "behavioral" | "lab_values" | "other"
    }
  ],
  "riskLevel": "critical" | "high" | "moderate" | "low",
  "riskScore": 0.0 to 1.0,
  "recommendations": [
    {
      "action": "specific monitoring or intervention recommendation",
      "priority": "urgent" | "high" | "routine",
      "rationale": "brief clinical reasoning"
    }
  ],
  "confidence": 0.0 to 1.0,
  "summary": "2-3 sentence clinical summary",
  "clinicalContext": "any relevant patterns or concerns identified"
}`;

    const userPrompt = `Analyze these clinical notes for warning signs of patient deterioration:

CLINICAL NOTES:
${notes}

${patientContext ? `PATIENT CONTEXT:
${JSON.stringify(patientContext, null, 2)}` : ""}

Provide your structured analysis as JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("[Gemini 3] API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("[Gemini 3] Response received");

    // Parse JSON from response
    let analysis;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("[Gemini 3] JSON parse error:", parseError);
      analysis = {
        warningSigns: [],
        riskLevel: "moderate",
        riskScore: 0.5,
        recommendations: [],
        confidence: 0.5,
        summary: content,
        clinicalContext: "Unable to parse structured response",
      };
    }

    console.log("[Gemini 3] Analysis complete - Risk Level:", analysis.riskLevel);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        model: "google/gemini-3-flash-preview",
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Gemini 3] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
