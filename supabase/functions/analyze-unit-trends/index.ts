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
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user?.id) userId = user.id;
      } catch { /* proceed as demo user */ }
    }
    console.log("[Auth] User:", userId);

    const { unitData, unitName, timeRange, shiftInfo } = await req.json();

    if (!unitData) {
      return new Response(
        JSON.stringify({ error: "Unit data is required" }),
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

    console.log("[Gemini 3] Analyzing unit trends for:", unitName || "Unknown Unit");

    const systemPrompt = `You are a healthcare analytics AI specializing in nursing unit performance analysis and population health trends. Your analysis should:

- Identify actionable patterns from aggregate data
- Highlight staffing and resource implications
- Detect time-based vulnerability windows
- Evaluate intervention effectiveness across the unit
- Provide evidence-based recommendations for the incoming shift

Focus on practical, implementable insights that charge nurses and nurse managers can act upon immediately.

IMPORTANT: This analysis is for decision support. All operational changes should follow institutional protocols and clinical judgment.

Return your analysis as valid JSON.`;

    const userPrompt = `Analyze 24-hour trends for ${unitName || "the nursing unit"}:

UNIT DATA:
${JSON.stringify(unitData, null, 2)}

${timeRange ? `TIME RANGE: ${timeRange}` : "TIME RANGE: Last 24 hours"}

${shiftInfo ? `CURRENT SHIFT INFO:\n${JSON.stringify(shiftInfo, null, 2)}` : ""}

Provide comprehensive unit trend analysis in this JSON format:
{
  "unitSnapshot": {
    "totalPatients": number,
    "averageAcuity": "LOW" | "MODERATE" | "HIGH",
    "riskDistribution": {
      "high": number,
      "moderate": number,
      "low": number
    },
    "overallTrend": "IMPROVING" | "STABLE" | "CONCERNING"
  },
  "emergingPatterns": [
    {
      "pattern": "Description of pattern",
      "affectedPatients": number,
      "riskImplication": "What this means for patient safety",
      "timeframe": "When this pattern emerged"
    }
  ],
  "vulnerabilityWindows": [
    {
      "timeWindow": "e.g., 0200-0400",
      "riskType": "Falls | Pressure Injury | CAUTI | All",
      "reason": "Why this time is high-risk",
      "mitigation": "Recommended action"
    }
  ],
  "staffingAnalysis": {
    "adequacy": "ADEQUATE" | "BORDERLINE" | "INADEQUATE",
    "concerns": ["Concern 1", "Concern 2"],
    "recommendations": ["Recommendation 1"]
  },
  "interventionEffectiveness": {
    "successful": [
      {
        "intervention": "Intervention name",
        "patientsAffected": number,
        "outcome": "Positive outcome observed"
      }
    ],
    "needsReview": [
      {
        "intervention": "Intervention name",
        "issue": "Why it needs review",
        "suggestion": "Alternative approach"
      }
    ]
  },
  "shiftHandoff": {
    "priorityPatients": ["Patient ID 1", "Patient ID 2"],
    "criticalActions": ["Action 1", "Action 2"],
    "watchList": ["Thing to monitor 1", "Thing to monitor 2"],
    "resourceNeeds": ["Resource 1", "Resource 2"]
  },
  "predictiveInsights": {
    "next4Hours": "What to expect in immediate future",
    "potentialEscalations": ["Patient/situation that may escalate"],
    "preventiveOpportunities": ["Opportunity to prevent adverse event"]
  },
  "qualityMetrics": {
    "fallsInPeriod": number,
    "newPressureInjuries": number,
    "cautiDays": number,
    "averageResponseTime": "minutes"
  },
  "recommendations": [
    {
      "priority": "IMMEDIATE" | "HIGH" | "ROUTINE",
      "action": "Specific recommendation",
      "rationale": "Why this is important",
      "owner": "Who should do this"
    }
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 1500,
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
        JSON.stringify({ error: "Unit trend analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("[Gemini 3] Unit trend analysis completed");

    // Parse JSON from response
    let analysis;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("[Gemini 3] JSON parse error:", parseError);
      analysis = {
        unitSnapshot: {
          overallTrend: "STABLE",
          averageAcuity: "MODERATE"
        },
        emergingPatterns: [],
        vulnerabilityWindows: [],
        staffingAnalysis: { adequacy: "BORDERLINE", concerns: ["Unable to fully analyze"], recommendations: [] },
        shiftHandoff: { priorityPatients: [], criticalActions: ["Review unit data manually"], watchList: [] },
        recommendations: [{ priority: "IMMEDIATE", action: "Manual review required", rationale: "AI analysis incomplete" }],
        rawResponse: content
      };
    }

    console.log("[Gemini 3] Unit trend:", analysis.unitSnapshot?.overallTrend);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        model: "google/gemini-2.5-flash",
        timestamp: new Date().toISOString(),
        unitName: unitName || "Unknown Unit",
        timeRange: timeRange || "24 hours"
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
