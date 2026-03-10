import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth check: require valid authenticated user
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
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { systemTitle, inventionDescription, claimType, priorArtContext, numberOfClaims } = await req.json();

    if (!systemTitle || !inventionDescription) {
      return new Response(JSON.stringify({ error: "System title and invention description are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert U.S. patent claim drafter with deep experience in healthcare informatics, clinical decision support, and AI/ML patent prosecution. You draft claims in proper USPTO format following MPEP guidelines.

Rules:
- Draft claims using proper patent claim language (comprising, wherein, configured to, etc.)
- Each independent claim must be self-contained and define the broadest reasonable scope
- Dependent claims narrow the scope of their parent claim
- Use antecedent basis correctly ("a processor" → "the processor")
- Include method claims, system claims, and computer-readable medium claims as appropriate
- Focus on the novel technical contribution, not obvious features
- Use "at least one" and "one or more" appropriately for flexibility
- Reference EHR timestamp data, documentation patterns, and clinical scoring as relevant
- Never include trade names or trademarks in claim language
- Number claims sequentially starting from 1
- Format: "1. A method comprising: ..." or "1. A system comprising: ..."

Output ONLY the numbered claims. No preamble, no explanation, no commentary.`;

    const userPrompt = `Draft ${numberOfClaims || 5} ${claimType || 'independent and dependent'} patent claims for the following invention:

**System Title:** ${systemTitle}

**Invention Description:**
${inventionDescription}

${priorArtContext ? `**Prior Art Context / Differentiation:**\n${priorArtContext}` : ''}

Draft a mix of method claims, system claims, and at least one computer-readable medium claim. Ensure independent claims are broad yet defensible, and dependent claims add meaningful narrowing features.`;

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
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("claim-drafter error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
