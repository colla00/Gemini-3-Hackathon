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

    // Gather real data for the update
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [inquiries, pilots, patents, blogPosts] = await Promise.all([
      supabaseAdmin.from("contact_inquiries").select("id, inquiry_type, organization, created_at").gte("created_at", weekAgo),
      supabaseAdmin.from("pilot_engagements").select("id, organization_name, status, updated_at").order("updated_at", { ascending: false }).limit(5),
      supabaseAdmin.from("patents").select("id, nickname, status, np_deadline").order("np_deadline", { ascending: true }).limit(10),
      supabaseAdmin.from("blog_posts").select("id, title, is_published").gte("created_at", weekAgo),
    ]);

    const contextData = {
      new_inquiries: inquiries.data?.length || 0,
      inquiry_types: inquiries.data?.map(i => i.inquiry_type) || [],
      organizations_interested: inquiries.data?.map(i => i.organization).filter(Boolean) || [],
      active_pilots: pilots.data?.filter(p => p.status === 'active') || [],
      patent_portfolio_size: patents.data?.length || 0,
      upcoming_deadlines: patents.data?.filter(p => {
        const deadline = new Date(p.np_deadline);
        const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return deadline <= thirtyDays;
      }) || [],
      blog_drafts_created: blogPosts.data?.length || 0,
    };

    console.log("[InvestorUpdate] Context:", JSON.stringify(contextData));

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
            content: `You are the founder of VitaSignal, a clinical AI startup building an equipment-independent patient deterioration detection platform. Write a concise weekly investor update email in the standard format:

1. **TL;DR** (1-2 sentences)
2. **Key Metrics This Week** (bullet points with numbers)
3. **Wins** (2-3 bullet points)
4. **Challenges** (1-2 bullet points, be honest)
5. **Next Week's Focus** (2-3 bullet points)
6. **Ask** (1 specific ask for investors)

Tone: confident but transparent. Data-driven. No fluff. Under 400 words.

Respond with ONLY valid JSON:
{
  "title": "Weekly Update: [date range] — [one-line hook]",
  "content": "Full email body text with sections using ** for bold headers. Use double newlines between sections."
}`,
          },
          {
            role: "user",
            content: `Generate this week's investor update using this real data from our platform:\n${JSON.stringify(contextData, null, 2)}\n\nToday's date: ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI API error (${aiResponse.status}): ${errText}`);
    }

    const aiResult = await aiResponse.json();
    const rawContent = aiResult.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("No content returned from AI");

    const cleaned = rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const article = JSON.parse(cleaned);

    const { data: draft, error: insertError } = await supabaseAdmin
      .from("weekly_drafts")
      .insert({
        draft_type: "investor_update",
        title: article.title,
        content: article.content,
        metadata: contextData,
      })
      .select("id, title")
      .single();

    if (insertError) throw new Error(`Insert failed: ${insertError.message}`);

    // Send notification
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const RECIPIENT = Deno.env.get("PATENT_ATTORNEY_EMAIL") || "info@vitasignal.ai";
    if (RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "VitaSignal <notifications@resend.dev>",
          to: [RECIPIENT],
          subject: `📊 Investor Update Draft Ready: ${article.title}`,
          html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;"><div style="background:#0f172a;padding:20px 24px;border-radius:8px 8px 0 0;"><h1 style="color:#fff;margin:0;font-size:18px;">Investor Update Draft Ready</h1></div><div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;"><h2 style="margin:0 0 16px;font-size:18px;">${article.title}</h2><p style="color:#6b7280;font-size:14px;">Review and send to your investor list.</p><a href="https://vitasignal.lovable.app/admin" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;">Review Draft →</a></div></div>`,
        }),
      }).catch(e => console.error("[InvestorUpdate] Email failed:", e));
    }

    console.log(`[InvestorUpdate] Draft created: ${draft.title}`);
    return new Response(JSON.stringify({ success: true, draft }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[InvestorUpdate] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
