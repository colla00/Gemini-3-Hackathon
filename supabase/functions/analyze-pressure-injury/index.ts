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
    const { imageData, mimeType, clinicalNotes, previousAssessment, patientInfo } = await req.json();

    if (!imageData) {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
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

    console.log("[Gemini 3 Vision] Analyzing pressure injury image");

    const systemPrompt = `You are an expert wound care specialist AI assistant trained in pressure injury assessment following NPUAP/EPUAP guidelines.

Your analysis should include:
- Accurate staging based on tissue involvement
- Objective severity metrics
- Evidence-based treatment recommendations
- Healing trajectory assessment when comparative data is available

IMPORTANT DISCLAIMER: This is an AI-assisted assessment tool to support clinical decision-making. All staging and treatment recommendations must be verified by qualified wound care professionals. This is NOT a substitute for clinical examination.

Return your analysis as valid JSON.`;

    const userPrompt = `Analyze this pressure injury image and provide a comprehensive assessment.

${clinicalNotes ? `CLINICAL NOTES:\n${clinicalNotes}\n` : ""}
${patientInfo ? `PATIENT CONTEXT:\n${JSON.stringify(patientInfo, null, 2)}\n` : ""}
${previousAssessment ? `PREVIOUS ASSESSMENT (for comparison):\n${JSON.stringify(previousAssessment, null, 2)}\n` : ""}

Provide your assessment in this JSON format:
{
  "stage": {
    "classification": "Stage 1" | "Stage 2" | "Stage 3" | "Stage 4" | "Unstageable" | "Deep Tissue Injury",
    "confidence": "HIGH" | "MODERATE" | "LOW",
    "rationale": "Explanation for staging classification"
  },
  "severity": {
    "level": "MILD" | "MODERATE" | "SEVERE" | "CRITICAL",
    "score": 0-100,
    "indicators": ["indicator1", "indicator2"]
  },
  "woundCharacteristics": {
    "estimatedSize": "length x width in cm (if visible)",
    "depth": "superficial" | "partial thickness" | "full thickness",
    "tissueType": ["granulation", "slough", "eschar", "epithelial", etc.],
    "exudate": "none" | "minimal" | "moderate" | "heavy",
    "periwoundCondition": "description of surrounding tissue",
    "signsOfInfection": ["sign1"] | "None observed"
  },
  "healingProgress": {
    "trajectory": "IMPROVING" | "STABLE" | "DETERIORATING" | "UNABLE TO ASSESS",
    "comparison": "Comparison to previous assessment if available",
    "estimatedHealingTime": "Weeks/months if applicable"
  },
  "treatmentRecommendations": {
    "immediate": ["Action 1", "Action 2"],
    "dressingType": "Recommended dressing category",
    "offloadingStrategy": "Pressure relief recommendations",
    "nutritionalConsiderations": "Protein/calorie recommendations",
    "followUp": "Recommended reassessment timeline"
  },
  "escalationNeeded": true | false,
  "escalationReason": "Reason if escalation is needed",
  "clinicalPearls": ["Key observation or teaching point"]
}`;

    // Construct multimodal message with image
    const imageUrl = `data:${mimeType || 'image/jpeg'};base64,${imageData}`;
    
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
          { 
            role: "user", 
            content: [
              { type: "text", text: userPrompt },
              { 
                type: "image_url", 
                image_url: { url: imageUrl }
              }
            ]
          }
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
      console.error("[Gemini 3 Vision] API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Wound analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("[Gemini 3 Vision] Analysis completed");

    // Parse JSON from response
    let analysis;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("[Gemini 3 Vision] JSON parse error:", parseError);
      analysis = {
        stage: { classification: "Unable to determine", confidence: "LOW", rationale: content },
        severity: { level: "MODERATE", score: 50, indicators: [] },
        woundCharacteristics: {},
        healingProgress: { trajectory: "UNABLE TO ASSESS" },
        treatmentRecommendations: { immediate: ["Consult wound care specialist"] },
        escalationNeeded: true,
        escalationReason: "AI analysis incomplete - requires manual assessment",
        rawResponse: content
      };
    }

    console.log("[Gemini 3 Vision] Stage:", analysis.stage?.classification, "Severity:", analysis.severity?.level);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        model: "google/gemini-3-pro-preview",
        timestamp: new Date().toISOString(),
        disclaimer: "AI-assisted assessment. Requires clinical verification."
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Gemini 3 Vision] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
