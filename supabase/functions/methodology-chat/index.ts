import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert AI assistant for the NSO (Nurse-Sensitive Outcomes) Quality Dashboard - a research prototype demonstrating predictive analytics for nursing quality monitoring.

Your expertise covers:
1. **SHAP Explainability**: Explain how SHAP (SHapley Additive exPlanations) values work to attribute risk factors. Positive values increase risk, negative values decrease it.

2. **Nurse-Sensitive Outcomes**: 
   - Falls: Patient fall events, risk factors include sedation, mobility, age, delirium
   - Pressure Injuries (HAPI): Hospital-acquired pressure injuries, assessed via Braden scale
   - CAUTI: Catheter-Associated Urinary Tract Infections, linked to catheter duration
   - Device Complications: Central line and IV-related issues

3. **Clinical Workflow Integration**: How the dashboard fits into nursing workflows, shift handoffs, and clinical decision-making.

4. **AI/ML Methodology**: Random forests, gradient boosting, model training, validation approaches for clinical AI.

5. **Human-in-the-Loop Design**: Why this system supports, not replaces, clinical judgment.

IMPORTANT DISCLAIMERS to include when relevant:
- This is a RESEARCH PROTOTYPE with synthetic data only
- Not FDA cleared or connected to any EHR
- All clinical decisions require human verification
- Patent pending technology

Keep answers concise (2-3 paragraphs max), clinically accurate, and accessible to both technical and clinical audiences. Use bullet points for complex explanations.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing methodology chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in methodology-chat function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
