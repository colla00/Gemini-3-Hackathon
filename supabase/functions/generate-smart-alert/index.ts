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

    const { riskData, alertPreferences } = await req.json();

    if (!riskData || !riskData.type) {
      return new Response(
        JSON.stringify({ error: "Risk data with type is required" }),
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

    console.log("[Gemini 3] Generating smart alert for:", riskData.type, "Patient:", riskData.patientId);

    const systemPrompt = `You are an expert clinical alerting system designed to generate clear, concise, and actionable alerts for nursing staff. Your alerts should:

- Be immediately actionable (no vague language)
- Include specific timeframes
- Prioritize patient safety
- Follow nursing communication best practices (SBAR-style when appropriate)
- Be scannable in high-pressure environments

IMPORTANT: Alerts must be brief but complete. Nurses should understand priority and action within 3 seconds of reading.

Return a valid JSON object.`;

    const userPrompt = `Generate a smart clinical alert based on this risk data:

RISK INFORMATION:
- Risk Type: ${riskData.type}
- Patient ID: ${riskData.patientId || "Unknown"}
- Room: ${riskData.room || "Not specified"}
- Risk Level: ${riskData.level || "MODERATE"}
- Risk Score: ${riskData.score || "N/A"}%
- Contributing Factors: ${Array.isArray(riskData.factors) ? riskData.factors.join(", ") : riskData.factors || "Not specified"}
- Current Vitals: ${riskData.vitals ? JSON.stringify(riskData.vitals) : "Not available"}
- Time Since Last Assessment: ${riskData.timeSinceAssessment || "Unknown"}
- Shift: ${riskData.shift || "Not specified"}

${alertPreferences ? `ALERT PREFERENCES:\n${JSON.stringify(alertPreferences, null, 2)}` : ""}

Generate an alert in this JSON format:
{
  "priority": "CRITICAL" | "URGENT" | "HIGH" | "ROUTINE",
  "priorityColor": "red" | "orange" | "yellow" | "blue",
  "headline": "Short 5-8 word headline",
  "patientIdentifier": "Patient ID/Room for quick identification",
  "situation": "Brief 1-sentence situation summary",
  "action": {
    "primary": "Most important action to take NOW",
    "secondary": ["Additional action 1", "Additional action 2"],
    "timeframe": "Within X minutes/hours"
  },
  "escalation": {
    "needed": true | false,
    "trigger": "When to escalate",
    "escalateTo": "Who to contact"
  },
  "documentation": "What to document after intervention",
  "quickReference": {
    "protocol": "Relevant protocol name/number",
    "resources": ["Equipment or resource needed"]
  },
  "expiresIn": "Alert validity duration (e.g., '4 hours')",
  "soundAlert": true | false,
  "repeatInterval": "When to re-alert if unacknowledged"
}`;

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
        JSON.stringify({ error: "Alert generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("[Gemini 3] Smart alert generated");

    // Parse JSON from response
    let alert;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      alert = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("[Gemini 3] JSON parse error:", parseError);
      // Fallback alert structure
      alert = {
        priority: riskData.level === "HIGH" || riskData.level === "CRITICAL" ? "URGENT" : "HIGH",
        priorityColor: riskData.level === "HIGH" ? "orange" : "yellow",
        headline: `${riskData.type} Alert - Room ${riskData.room || "TBD"}`,
        patientIdentifier: `${riskData.patientId || "Unknown"} / Room ${riskData.room || "N/A"}`,
        situation: `Elevated ${riskData.type} risk detected`,
        action: {
          primary: "Assess patient immediately",
          secondary: ["Review contributing factors", "Document findings"],
          timeframe: "Within 30 minutes"
        },
        escalation: { needed: false },
        documentation: "Document assessment and interventions",
        soundAlert: riskData.level === "HIGH" || riskData.level === "CRITICAL",
        rawResponse: content
      };
    }

    console.log("[Gemini 3] Alert priority:", alert.priority);

    return new Response(
      JSON.stringify({
        success: true,
        alert,
        model: "google/gemini-3-flash-preview",
        timestamp: new Date().toISOString(),
        riskType: riskData.type,
        patientId: riskData.patientId
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
