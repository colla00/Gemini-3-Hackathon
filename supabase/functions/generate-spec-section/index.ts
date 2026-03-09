import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { systemTitle, claimsText, sectionType } = await req.json();

    if (!systemTitle || !claimsText) {
      return new Response(JSON.stringify({ error: "System title and claims are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sectionPrompts: Record<string, string> = {
      background: `Generate the "BACKGROUND OF THE INVENTION" section for a U.S. nonprovisional patent application. Include:
1. Field of the Invention (1 paragraph)
2. Description of Related Art (3-5 paragraphs covering existing approaches, their limitations, and the unmet need)

Reference existing clinical scoring systems (MEWS, NEWS, APACHE), EHR documentation practices, and equipment-dependent monitoring approaches as appropriate prior art. Highlight the gap this invention addresses.`,
      summary: `Generate the "SUMMARY OF THE INVENTION" section. Include:
1. Brief summary of the technical problem solved
2. High-level description of the solution
3. Key advantages over prior art (equipment-independent, no additional hardware, uses existing EHR data)
4. Brief mention of embodiments (method, system, computer-readable medium)`,
      detailed: `Generate the "DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS" section. Include:
1. Overview of the system architecture
2. Data ingestion and preprocessing (EHR timestamp extraction)
3. Feature engineering (temporal features, documentation patterns)
4. Model architecture and training approach
5. Output generation and clinical decision support integration
6. Alternative embodiments and variations

Use reference numerals (e.g., "system 100", "processor 102", "EHR interface 104") and reference figures (e.g., "as shown in FIG. 1").`,
      abstract: `Generate the "ABSTRACT" for this patent application. Must be:
- A single paragraph
- 150 words or fewer
- Summarize the technical disclosure
- Not use phrases like "this invention" or "the present invention"
- Be technically precise`,
    };

    const systemPrompt = `You are an expert patent specification writer for U.S. nonprovisional patent applications in the healthcare informatics and clinical AI domain. Write in formal patent prose following USPTO MPEP guidelines. Use precise technical language. Do not include claim numbers or claim text in specifications.`;

    const userPrompt = `Write the specification section for the following patent:

**System Title:** ${systemTitle}

**Claims (for reference — do not reproduce in the specification):**
${claimsText}

${sectionPrompts[sectionType] || sectionPrompts.summary}

Output ONLY the specification text. No meta-commentary.`;

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
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("spec-generator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
