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

    const patientData = await req.json();

    if (!patientData) {
      return new Response(
        JSON.stringify({ error: "Patient data is required" }),
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

    console.log("[Gemini 3] Assessing patient risk for user:", userId, "patient:", patientData.patientId || "unknown");

    const prompt = `
Analyze this patient's EHR data for multiple risk factors:

Patient Profile:
- Age: ${patientData.age || "Unknown"}, Gender: ${patientData.gender || "Unknown"}
- Medications: ${patientData.medications || "None listed"}
- Vitals: HR ${patientData.heartRate || "N/A"}, BP ${patientData.bloodPressure || "N/A"}, O2 Sat ${patientData.o2Sat || "N/A"}, Temp ${patientData.temperature || "N/A"}
- Mobility: ${patientData.mobilityStatus || "Unknown"}
- Recent Procedures: ${patientData.procedures || "None"}
- Lab Results: ${patientData.labs || "Pending"}
- Catheter Status: ${patientData.catheterStatus || "None"}
- Braden Score Components: ${patientData.bradenComponents || "Not assessed"}
- Days Since Admission: ${patientData.daysSinceAdmission || "Unknown"}

Assess risks for:
1. Falls (consider sedation, mobility, vitals, medications)
2. Pressure injuries (Braden score factors, mobility, nutrition)
3. CAUTI (catheter duration, risk factors, fever)

Return a valid JSON object with this exact structure:
{
  "overallRisk": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "priorityRanking": ["Falls", "Pressure Injury", "CAUTI"],
  "assessments": {
    "falls": {
      "riskLevel": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
      "score": 0-100,
      "keyFactors": ["factor1", "factor2"],
      "interventions": ["intervention1", "intervention2"],
      "rationale": "Brief clinical reasoning"
    },
    "pressureInjury": {
      "riskLevel": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
      "score": 0-100,
      "keyFactors": ["factor1", "factor2"],
      "interventions": ["intervention1", "intervention2"],
      "rationale": "Brief clinical reasoning"
    },
    "cauti": {
      "riskLevel": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
      "score": 0-100,
      "keyFactors": ["factor1", "factor2"],
      "interventions": ["intervention1", "intervention2"],
      "rationale": "Brief clinical reasoning"
    }
  },
  "immediateActions": ["Most urgent action 1", "Action 2"],
  "monitoringFrequency": "Recommended assessment frequency",
  "escalationTriggers": ["Condition that requires escalation"]
}`;

    const systemPrompt = `You are an expert clinical decision support AI specializing in nursing-sensitive outcomes prediction. Your assessments are based on evidence-based protocols including:
- Morse Fall Scale criteria
- Braden Scale for pressure injury risk
- CAUTI prevention bundles (CDC guidelines)

IMPORTANT DISCLAIMER: These are AI-generated risk assessments to support clinical decision-making. All recommendations must be reviewed and validated by qualified healthcare professionals. This is NOT a substitute for clinical judgment.

Always return valid JSON. Be specific and actionable in your interventions.`;

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
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
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
        JSON.stringify({ error: "Risk assessment failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("[Gemini 3] Risk assessment completed");

    // Parse JSON from response
    let assessment;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      assessment = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("[Gemini 3] JSON parse error:", parseError);
      assessment = {
        overallRisk: "MODERATE",
        priorityRanking: ["Falls", "Pressure Injury", "CAUTI"],
        assessments: {
          falls: { riskLevel: "MODERATE", score: 50, keyFactors: [], interventions: [], rationale: "Unable to parse detailed assessment" },
          pressureInjury: { riskLevel: "MODERATE", score: 50, keyFactors: [], interventions: [], rationale: "Unable to parse detailed assessment" },
          cauti: { riskLevel: "LOW", score: 30, keyFactors: [], interventions: [], rationale: "Unable to parse detailed assessment" }
        },
        immediateActions: ["Review patient chart manually"],
        monitoringFrequency: "Per clinical judgment",
        escalationTriggers: ["Clinical deterioration"],
        rawResponse: content
      };
    }

    console.log("[Gemini 3] Overall risk:", assessment.overallRisk);

    return new Response(
      JSON.stringify({
        success: true,
        assessment,
        model: "google/gemini-3-pro-preview",
        timestamp: new Date().toISOString(),
        patientId: patientData.patientId
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
