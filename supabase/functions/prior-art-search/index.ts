import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth check: require valid JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabaseAuth = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { claimText, patentTitle, patentShortName } = await req.json();

    if (!claimText || typeof claimText !== "string" || claimText.length > 10000) {
      return new Response(JSON.stringify({ error: "Invalid claim text" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a patent prior art analyst specializing in healthcare IT, clinical decision support, nursing informatics, and machine learning for EHR data. 

Given a patent claim, analyze it against known prior art in the field. Return your response using the suggest_prior_art tool.

Consider these areas:
- Clinical decision support systems (CDSS)
- EHR timestamp/documentation pattern analysis
- ICU mortality prediction models
- Trust-based alert systems
- Nursing workload prediction
- FHIR-based integrations
- SHAP/explainability in clinical AI
- Documentation burden scoring

Focus on what makes the submitted claim NOVEL compared to existing art.`;

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
          { role: "user", content: `Patent: ${patentShortName} - ${patentTitle}\n\nClaim text to analyze:\n${claimText}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_prior_art",
              description: "Return prior art analysis results",
              parameters: {
                type: "object",
                properties: {
                  analysis: {
                    type: "string",
                    description: "2-3 paragraph summary of the novelty assessment",
                  },
                  results: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Name or identifier of the prior art reference" },
                        relevance: { type: "string", enum: ["high", "medium", "low"] },
                        type: { type: "string", enum: ["US Patent", "Publication", "Standard", "Open Source", "Conference Paper"] },
                        summary: { type: "string", description: "Brief description of how this prior art relates to the claim" },
                        differentiators: {
                          type: "array",
                          items: { type: "string" },
                          description: "Key ways the submitted claim differs from this prior art",
                        },
                      },
                      required: ["title", "relevance", "type", "summary", "differentiators"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["analysis", "results"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_prior_art" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "No structured response from AI" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Prior art search error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
