import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { demographicData, dateRange } = await req.json();

    if (!demographicData || !Array.isArray(demographicData)) {
      return new Response(
        JSON.stringify({ error: "Demographic data array is required" }),
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

    console.log("[Gemini 3] Analyzing health equity data for", demographicData.length, "groups");

    const systemPrompt = `You are a health equity analyst examining risk prediction patterns across demographic groups. Your role is to:

1. Identify statistically significant disparities (>10% difference is notable)
2. Analyze potential contributing factors
3. Suggest evidence-based interventions to reduce disparities
4. Focus on actionable quality improvement recommendations

CONTEXT: This analysis ensures AI-powered clinical tools promote health equity rather than perpetuate disparities.

Return a valid JSON object:
{
  "executiveSummary": "2-3 sentence overview of key findings",
  "disparitiesIdentified": [
    {
      "disparity": "Description of the disparity",
      "affectedGroup": "Which group is disadvantaged",
      "magnitude": "Percentage or numeric difference",
      "clinicalSignificance": "high" | "moderate" | "low",
      "potentialCauses": ["cause1", "cause2"]
    }
  ],
  "recommendations": [
    {
      "recommendation": "Specific action to address disparity",
      "targetedGroup": "Which group this helps",
      "expectedImpact": "What improvement to expect",
      "implementationLevel": "unit" | "department" | "system",
      "priority": "immediate" | "short-term" | "long-term"
    }
  ],
  "monitoringMetrics": ["Metrics to track progress"],
  "limitations": "Caveats about the analysis",
  "overallEquityScore": 0.0 to 1.0 (1.0 = perfect equity)
}`;

    const userPrompt = `Analyze this demographic data for health equity disparities:

DEMOGRAPHIC BREAKDOWN:
${JSON.stringify(demographicData, null, 2)}

${dateRange ? `DATE RANGE: ${dateRange.start} to ${dateRange.end}` : ""}

Key metrics to compare:
- Average risk scores
- Alert rates (alerts per patient)
- Time to intervention (minutes)
- Outcome rates if available

Identify any disparities >10% and provide actionable recommendations. Return as JSON.`;

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
        JSON.stringify({ error: "Equity analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("[Gemini 3] Equity analysis complete");

    // Parse JSON from response
    let report;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      report = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("[Gemini 3] JSON parse error:", parseError);
      report = {
        executiveSummary: content,
        disparitiesIdentified: [],
        recommendations: [],
        monitoringMetrics: [],
        limitations: "Unable to parse structured response",
        overallEquityScore: 0.5,
      };
    }

    console.log("[Gemini 3] Found", report.disparitiesIdentified?.length || 0, "disparities");

    return new Response(
      JSON.stringify({
        success: true,
        report,
        model: "google/gemini-3-pro-preview",
        timestamp: new Date().toISOString(),
        dateRange,
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
