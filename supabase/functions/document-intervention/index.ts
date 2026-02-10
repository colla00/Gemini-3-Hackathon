import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_OBSERVATIONS_LENGTH = 10000; // 10KB limit

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - missing or invalid authorization header" }),
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
      console.error("[Auth] Token validation failed:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;
    console.log("[Auth] Authenticated user:", userId);

    const { interventionData } = await req.json();

    if (!interventionData || !interventionData.type) {
      return new Response(
        JSON.stringify({ error: "Intervention data with type is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input length validation
    if (interventionData.observations && interventionData.observations.length > MAX_OBSERVATIONS_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Observations exceed maximum length of ${MAX_OBSERVATIONS_LENGTH} characters` }),
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

    console.log("[Gemini 3] Generating intervention documentation for user:", userId, "type:", interventionData.type);

    const systemPrompt = `You are an expert clinical documentation assistant helping nurses create accurate, compliant nursing notes. Your documentation should:

- Follow SBAR (Situation, Background, Assessment, Recommendation) format when appropriate
- Use objective, measurable language
- Include all relevant clinical details
- Be concise but complete
- Meet regulatory documentation standards (Joint Commission, CMS)
- Avoid subjective opinions or judgments
- Use appropriate medical terminology
- Include time stamps and staff identifiers

IMPORTANT: This is AI-assisted documentation. All notes must be reviewed and signed by the responsible nurse before becoming part of the official medical record.

Return a valid JSON object with the structured documentation.`;

    const userPrompt = `Generate clinical nursing documentation for this intervention:

INTERVENTION DETAILS:
- Patient ID: ${interventionData.patientId || "Not specified"}
- Room: ${interventionData.room || "Not specified"}
- Intervention Type: ${interventionData.type}
- Timestamp: ${interventionData.timestamp || new Date().toISOString()}
- Staff ID: ${interventionData.staffId || "Not specified"}
- Staff Name: ${interventionData.staffName || "RN"}

CLINICAL OBSERVATIONS:
${interventionData.observations || "No observations provided"}

${interventionData.vitalSigns ? `VITAL SIGNS:
${JSON.stringify(interventionData.vitalSigns, null, 2)}` : ""}

${interventionData.patientResponse ? `PATIENT RESPONSE:
${interventionData.patientResponse}` : ""}

${interventionData.riskContext ? `RISK CONTEXT:
${JSON.stringify(interventionData.riskContext, null, 2)}` : ""}

Generate comprehensive nursing documentation in this JSON format:
{
  "documentationType": "Nursing Intervention Note",
  "narrative": {
    "situation": "Brief description of why intervention was needed",
    "background": "Relevant patient history/context",
    "assessment": "Clinical findings before/during intervention",
    "recommendation": "Plan and follow-up actions"
  },
  "structuredNote": {
    "dateTime": "ISO timestamp",
    "interventionCategory": "Category classification",
    "interventionDescription": "Detailed description of what was done",
    "patientResponse": "How patient responded",
    "outcomeMeasures": ["Measurable outcomes observed"],
    "followUpRequired": true | false,
    "followUpActions": ["Specific follow-up actions if needed"],
    "escalationNeeded": true | false
  },
  "complianceChecklist": {
    "patientIdentified": true,
    "timeDocumented": true,
    "staffCredentialed": true,
    "interventionSpecific": true,
    "outcomeRecorded": true
  },
  "icdCodes": ["Relevant ICD-10 codes if applicable"],
  "carePlanUpdate": "Any updates needed to care plan",
  "readyForReview": true,
  "suggestedSignature": "Signature line format"
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
        temperature: 0.2, // Lower temperature for more consistent documentation
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
        JSON.stringify({ error: "Documentation generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("[Gemini 3] Documentation generated");

    // Parse JSON from response
    let documentation;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      documentation = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("[Gemini 3] JSON parse error:", parseError);
      // Fallback documentation structure
      documentation = {
        documentationType: "Nursing Intervention Note",
        narrative: {
          situation: `${interventionData.type} intervention performed`,
          background: "See patient chart for full history",
          assessment: interventionData.observations || "Assessment pending",
          recommendation: "Continue monitoring per protocol"
        },
        structuredNote: {
          dateTime: interventionData.timestamp || new Date().toISOString(),
          interventionCategory: interventionData.type,
          interventionDescription: "Intervention documented - see narrative",
          patientResponse: interventionData.patientResponse || "Response pending assessment",
          outcomeMeasures: [],
          followUpRequired: true,
          followUpActions: ["Review and complete documentation"],
          escalationNeeded: false
        },
        complianceChecklist: {
          patientIdentified: !!interventionData.patientId,
          timeDocumented: true,
          staffCredentialed: !!interventionData.staffId,
          interventionSpecific: true,
          outcomeRecorded: false
        },
        readyForReview: false,
        rawResponse: content
      };
    }

    console.log("[Gemini 3] Documentation type:", documentation.documentationType);

    return new Response(
      JSON.stringify({
        success: true,
        documentation,
        model: "google/gemini-3-flash-preview",
        timestamp: new Date().toISOString(),
        interventionType: interventionData.type,
        patientId: interventionData.patientId,
        requiresReview: true,
        disclaimer: "AI-generated documentation requires nurse review and signature before becoming part of official medical record."
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
