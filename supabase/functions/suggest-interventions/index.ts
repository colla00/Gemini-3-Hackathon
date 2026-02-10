import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Strict authentication
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
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log("[Auth] Authenticated user:", userId);

    const { riskProfile, vitalSigns, trends, patientInfo } = await req.json();

    if (!riskProfile) {
      return new Response(
        JSON.stringify({ error: "Risk profile is required" }),
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

    console.log("[Gemini 3] Generating intervention suggestions for user:", userId, "risk:", riskProfile.riskType);

    const systemPrompt = `You are a clinical nurse expert AI providing evidence-based nursing intervention suggestions. Your recommendations should be:

- Specific and actionable
- Based on established nursing practice guidelines
- Prioritized by urgency
- Include rationale for each intervention
- Focus on monitoring and early intervention
- Appropriate for the identified risk category

IMPORTANT DISCLAIMER: These are AI-generated suggestions to support clinical decision-making. All interventions must be reviewed and approved by qualified healthcare professionals. This is NOT a substitute for clinical judgment.

Return a valid JSON object with this structure:
{
  "interventions": [
    {
      "id": 1,
      "intervention": "Specific action to take",
      "priority": "urgent" | "high" | "medium",
      "rationale": "Clinical reasoning for this intervention",
      "expectedOutcome": "What this should achieve",
      "timeframe": "When to implement/reassess",
      "evidenceBasis": "Brief reference to guideline or evidence"
    }
  ],
  "escalationCriteria": "When to escalate to rapid response or physician",
  "monitoringFrequency": "Recommended vital sign check frequency",
  "riskSummary": "Brief summary of identified risks"
}`;

    const userPrompt = `Suggest evidence-based nursing interventions for this patient:

RISK PROFILE:
- Risk Type: ${riskProfile.riskType}
- Risk Score: ${(riskProfile.riskScore * 100).toFixed(0)}%
- Risk Level: ${riskProfile.riskLevel}
${riskProfile.primaryConcerns ? `- Primary Concerns: ${riskProfile.primaryConcerns.join(", ")}` : ""}

${vitalSigns ? `CURRENT VITAL SIGNS:
${JSON.stringify(vitalSigns, null, 2)}` : ""}

${trends ? `TRENDS:
${JSON.stringify(trends, null, 2)}` : ""}

${patientInfo ? `PATIENT INFO:
${JSON.stringify(patientInfo, null, 2)}` : ""}

Provide 3-5 prioritized interventions with rationale. Return as JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-preview",
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
          JSON.stringify({ error: "Rate limit exceeded. Please try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("[Gemini 3] API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Intervention suggestion failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("[Gemini 3] Interventions generated");

    // Parse JSON from response
    let suggestions;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      suggestions = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("[Gemini 3] JSON parse error:", parseError);
      suggestions = {
        interventions: [],
        escalationCriteria: "Unable to parse structured response",
        monitoringFrequency: "Per clinical judgment",
        riskSummary: content,
      };
    }

    console.log("[Gemini 3] Generated", suggestions.interventions?.length || 0, "interventions");

    return new Response(
      JSON.stringify({
        success: true,
        suggestions,
        model: "google/gemini-3-pro-preview",
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
