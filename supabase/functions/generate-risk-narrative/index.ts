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
    // Soft auth - allow demo access
    const authHeader = req.headers.get("Authorization");
    let userId = "demo-user";
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: authHeader } } }
        );
        const token = authHeader.replace("Bearer ", "");
        const { data: claimsData } = await supabase.auth.getClaims(token);
        if (claimsData?.claims?.sub) userId = claimsData.claims.sub;
      } catch { /* proceed as demo user */ }
    }
    console.log("[Auth] User:", userId);

    const { riskScore, topFeatures, patientInfo } = await req.json();

    if (typeof riskScore !== "number" || !topFeatures || !Array.isArray(topFeatures)) {
      return new Response(
        JSON.stringify({ error: "riskScore and topFeatures array are required" }),
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

    console.log("[Gemini 3] Generating risk narrative for score:", riskScore);

    const systemPrompt = `You are a clinical AI assistant that converts technical ML risk predictions into clear, actionable explanations for nurses. 

Your explanations should:
- Be written in plain clinical language nurses understand
- Focus on what the data means for patient care
- Highlight the most important risk factors
- Suggest what to monitor
- Be concise (under 100 words)
- Never provide diagnoses, only highlight patterns
- Always remind that clinical judgment is essential

IMPORTANT: This is a decision-support tool. All interpretations require clinical verification.`;

    const featuresDescription = topFeatures
      .map((f: { name: string; importance: number; value: unknown }, i: number) => 
        `${i + 1}. ${f.name}: importance=${(f.importance * 100).toFixed(1)}%, current value=${f.value}`
      )
      .join("\n");

    const userPrompt = `Convert this ML risk prediction into a clear clinical narrative:

RISK SCORE: ${(riskScore * 100).toFixed(0)}% probability of deterioration in next 12 hours

TOP CONTRIBUTING FACTORS (SHAP values):
${featuresDescription}

${patientInfo ? `PATIENT INFO:
${JSON.stringify(patientInfo, null, 2)}` : ""}

Write a concise narrative (under 100 words) explaining what this means clinically and what to watch for.`;

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
        temperature: 0.4,
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
        JSON.stringify({ error: "Narrative generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const narrative = data.choices?.[0]?.message?.content?.trim();

    console.log("[Gemini 3] Narrative generated successfully");

    return new Response(
      JSON.stringify({
        success: true,
        narrative,
        riskScore,
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
