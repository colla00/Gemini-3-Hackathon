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

    // Pull recent blog posts and changelog for content inspiration
    const weekAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

    const [blogs, changelog, patents] = await Promise.all([
      supabaseAdmin.from("blog_posts").select("title, excerpt, category, slug").eq("is_published", true).order("published_at", { ascending: false }).limit(5),
      supabaseAdmin.from("changelog_entries").select("title, description, category").eq("is_published", true).order("published_at", { ascending: false }).limit(5),
      supabaseAdmin.from("patents").select("nickname, status").limit(5),
    ]);

    const context = {
      recent_blogs: blogs.data || [],
      recent_changelog: changelog.data || [],
      patent_milestones: patents.data || [],
    };

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
            content: `You are a LinkedIn content strategist for VitaSignal, a clinical AI startup. Dr. Alexis Collier (DNP, RN, founder) posts from her personal LinkedIn and the company page.

Generate 5 LinkedIn posts for the week. Mix of:
- 1 thought leadership post (clinical AI opinion, industry trend)
- 1 content promotion (link to blog or changelog)
- 1 personal founder story (lessons, wins, challenges)
- 1 data/stat-driven post (clinical outcomes, market data)
- 1 engagement post (question, poll idea, or call-to-action)

Each post should:
- Be 100-200 words
- Include 3-5 relevant hashtags
- Have a hook in the first line
- Feel authentic, not corporate

Respond with ONLY valid JSON:
{
  "title": "Social Media Posts — Week of [date]",
  "posts": [
    { "type": "thought_leadership|content_promo|founder_story|data_driven|engagement", "platform": "linkedin", "content": "Full post text with hashtags", "suggested_day": "Monday|Tuesday|Wednesday|Thursday|Friday" }
  ]
}`,
          },
          {
            role: "user",
            content: `Generate this week's LinkedIn posts. Here's recent content for inspiration:\n${JSON.stringify(context, null, 2)}\n\nCompany: VitaSignal — equipment-independent clinical AI for patient deterioration detection. Founder: Dr. Alexis Collier, DNP, RN. Company LinkedIn: /company/vitasignal`,
          },
        ],
        temperature: 0.8,
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
    const result = JSON.parse(cleaned);

    const { data: draft, error: insertError } = await supabaseAdmin
      .from("weekly_drafts")
      .insert({
        draft_type: "social_posts",
        title: result.title,
        content: result.posts.map((p: any) => `[${p.suggested_day} — ${p.type}]\n\n${p.content}`).join("\n\n---\n\n"),
        metadata: { posts: result.posts },
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
          subject: `📱 5 LinkedIn Posts Ready for Review`,
          html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;"><div style="background:#0f172a;padding:20px 24px;border-radius:8px 8px 0 0;"><h1 style="color:#fff;margin:0;font-size:18px;">Weekly Social Posts Ready</h1></div><div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;"><p style="color:#6b7280;font-size:14px;">5 LinkedIn posts have been drafted for this week:</p><ul style="color:#0f172a;font-size:14px;">${result.posts.map((p: any) => `<li><strong>${p.suggested_day}</strong>: ${p.type.replace(/_/g, " ")}</li>`).join("")}</ul><a href="https://vitasignal.lovable.app/admin" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;margin-top:12px;">Review Posts →</a></div></div>`,
        }),
      }).catch(e => console.error("[SocialPosts] Email failed:", e));
    }

    console.log(`[SocialPosts] Draft created: ${draft.title}`);
    return new Response(JSON.stringify({ success: true, draft }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[SocialPosts] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
