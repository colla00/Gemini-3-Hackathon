import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const competitors = [
      { name: "Epic Systems", product: "Epic Sepsis Model / Deterioration Index", focus: "EHR-integrated predictive scores" },
      { name: "CLEW Medical", product: "CLEW ICU", focus: "ICU predictive analytics, ventilator management" },
      { name: "Philips", product: "IntelliVue Guardian / PERS", focus: "Hardware-dependent monitoring, early warning scores" },
      { name: "Cerner (Oracle Health)", product: "St. John Sepsis Agent", focus: "EHR-based sepsis screening rules" },
      { name: "General Electric (GE HealthCare)", product: "MURAL / Carestation", focus: "Multimodal patient monitoring" },
      { name: "Nihon Kohden", product: "Early Warning Scoring algorithms", focus: "Bedside monitor-integrated alerts" },
    ];

    const now = new Date();

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a competitive intelligence analyst for VitaSignal, a clinical AI startup building equipment-independent patient deterioration detection. Generate a weekly competitor intelligence brief.

For each competitor, analyze potential recent developments across these axes:
- FDA regulatory activity (510(k), De Novo, PMA submissions or clearances)
- Product launches or feature updates
- Partnerships or hospital deployments
- Funding, M&A, or leadership changes
- Published research or clinical validation studies

Then provide:
1. **Executive Summary** (3-4 sentences on the competitive landscape this week)
2. **Competitor Updates** (one section per competitor with bullet points)
3. **Threats to Watch** (1-2 items that could impact VitaSignal)
4. **Opportunities** (1-2 gaps VitaSignal can exploit)
5. **Recommended Actions** (2-3 specific steps)

Be analytical, not speculative. If no developments are known, note "No significant public activity detected" for that competitor.

Respond with ONLY valid JSON:
{
  "title": "Competitor Intelligence Brief — [date]",
  "content": "Full brief with ** for bold section headers. Double newlines between sections."
}`,
          },
          {
            role: "user",
            content: `Generate this week's competitor intelligence brief. Competitors to monitor:\n${JSON.stringify(competitors, null, 2)}\n\nDate: ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}\n\nVitaSignal differentiators: equipment-independent (no proprietary hardware), equity-centered bias testing, nurse-designed workflows, FDA De Novo pathway.`,
          },
        ],
        temperature: 0.6,
        max_tokens: 3000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI API error (${aiResponse.status}): ${errText}`);
    }

    const aiResult = await aiResponse.json();
    const rawContent = aiResult.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("No content from AI");

    const cleaned = rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const brief = JSON.parse(cleaned);

    const { data: draft, error: insertError } = await supabaseAdmin
      .from("weekly_drafts")
      .insert({
        draft_type: "competitor_brief",
        title: brief.title,
        content: brief.content,
        metadata: { competitors: competitors.map(c => c.name) },
      })
      .select("id, title")
      .single();

    if (insertError) throw new Error(`Insert failed: ${insertError.message}`);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const RECIPIENT = Deno.env.get("PATENT_ATTORNEY_EMAIL") || "info@vitasignal.ai";
    if (RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "VitaSignal <notifications@resend.dev>",
          to: [RECIPIENT],
          subject: `🔍 Competitor Brief Ready: ${brief.title}`,
          html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;"><div style="background:#0f172a;padding:20px 24px;border-radius:8px 8px 0 0;"><h1 style="color:#fff;margin:0;font-size:18px;">Competitor Intelligence Brief</h1></div><div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;"><h2 style="margin:0 0 16px;font-size:18px;">${brief.title}</h2><p style="color:#6b7280;font-size:14px;">Your weekly competitive landscape analysis is ready for review.</p><a href="https://vitasignal.lovable.app/admin" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;">Review Brief →</a></div></div>`,
        }),
      }).catch(e => console.error("[CompetitorBrief] Email failed:", e));
    }

    console.log(`[CompetitorBrief] Draft created: ${draft.title}`);
    return new Response(JSON.stringify({ success: true, draft }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[CompetitorBrief] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
