import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TOPICS = [
  {
    category: "Clinical AI",
    prompts: [
      "early warning score systems and how AI improves them in hospital settings",
      "how machine learning reduces alarm fatigue in ICU environments",
      "AI-driven sepsis detection: current evidence and clinical outcomes",
      "the role of continuous monitoring AI in reducing code blue events",
      "bias in clinical AI algorithms and strategies for equitable patient outcomes",
      "FDA regulatory pathways for clinical decision support software",
      "how predictive analytics can reduce nurse burnout through smarter staffing",
      "real-world validation of AI deterioration models vs traditional MEWS/NEWS scores",
    ],
  },
  {
    category: "Regulatory",
    prompts: [
      "understanding FDA De Novo classification for novel AI medical devices",
      "HIPAA compliance requirements for cloud-based clinical AI platforms",
      "the evolving FDA framework for AI/ML-based Software as a Medical Device",
      "state-level regulations impacting AI adoption in US hospitals",
      "EU MDR vs FDA 510(k): navigating international regulatory pathways for clinical AI",
      "cybersecurity requirements for FDA-cleared medical AI software",
    ],
  },
  {
    category: "Nursing Informatics",
    prompts: [
      "how nursing informatics bridges the gap between clinical AI and bedside care",
      "the impact of smart alert systems on nursing workflow efficiency",
      "training nurses to work alongside AI: best practices for clinical adoption",
      "electronic health record integration challenges for AI monitoring tools",
      "the future of nursing: how informatics-driven AI supports clinical decision making",
      "patient safety culture and the role of technology in reducing medical errors",
    ],
  },
  {
    category: "Company News",
    prompts: [
      "milestones in building a clinical AI startup: from concept to FDA submission",
      "why equity-centered design matters in healthcare AI development",
      "lessons learned from pilot deployments of AI monitoring in community hospitals",
      "building a patent portfolio for clinical AI innovation",
      "the importance of clinical validation studies before commercial launch",
    ],
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80);
}

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
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Pick a random category and topic
    const categoryGroup = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const topicPrompt =
      categoryGroup.prompts[Math.floor(Math.random() * categoryGroup.prompts.length)];
    const category = categoryGroup.category;

    console.log(`[BlogDraft] Generating draft for category: ${category}, topic: ${topicPrompt}`);

    // Generate the blog post using Lovable AI
    const aiResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
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
            content: `You are a medical technology content writer for VitaSignal, a clinical AI company building an equipment-independent patient deterioration detection platform. Write in a professional, authoritative tone suitable for hospital executives, clinical informaticists, and healthcare investors. Avoid marketing fluff — focus on evidence, clinical relevance, and actionable insights.

Respond with ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "Article title (50-70 chars, SEO-friendly)",
  "excerpt": "2-3 sentence summary for the blog listing page (under 160 chars)",
  "meta_description": "SEO meta description (under 155 chars)",
  "content": "Full article body (800-1200 words). Use double newlines between paragraphs. No HTML or markdown formatting.",
  "read_time_minutes": 5
}`,
          },
          {
            role: "user",
            content: `Write a blog article about: ${topicPrompt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI API error (${aiResponse.status}): ${errText}`);
    }

    const aiResult = await aiResponse.json();
    const rawContent = aiResult.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("No content returned from AI");
    }

    // Parse the JSON response (strip markdown code fences if present)
    const cleaned = rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const article = JSON.parse(cleaned);

    // Generate a unique slug with date prefix
    const datePrefix = new Date().toISOString().slice(0, 10);
    const slug = `${datePrefix}-${slugify(article.title)}`;

    // Check for duplicate slug
    const { data: existing } = await supabaseAdmin
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      console.log("[BlogDraft] Duplicate slug detected, skipping.");
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "duplicate_slug" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert as unpublished draft
    const { data: post, error: insertError } = await supabaseAdmin
      .from("blog_posts")
      .insert({
        title: article.title,
        slug,
        excerpt: article.excerpt,
        content: article.content,
        category,
        read_time_minutes: article.read_time_minutes || 5,
        meta_description: article.meta_description,
        author_name: "Dr. Alexis Collier",
        is_published: false,
        published_at: null,
      })
      .select("id, title, slug, category")
      .single();

    if (insertError) {
      throw new Error(`Failed to insert draft: ${insertError.message}`);
    }

    console.log(`[BlogDraft] Draft created: ${post.title} (${post.id})`);

    // Send notification email
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const RECIPIENT = Deno.env.get("PATENT_ATTORNEY_EMAIL") || "info@vitasignal.ai";

    if (RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "VitaSignal Blog <notifications@resend.dev>",
            to: [RECIPIENT],
            subject: `📝 New Blog Draft: ${post.title}`,
            html: `
              <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;">
                <div style="background:#0f172a;padding:20px 24px;border-radius:8px 8px 0 0;">
                  <h1 style="color:#fff;margin:0;font-size:18px;">New Blog Draft Ready for Review</h1>
                </div>
                <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
                  <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Category: <strong style="color:#0f172a;">${post.category}</strong></p>
                  <h2 style="margin:0 0 16px;font-size:20px;color:#0f172a;">${post.title}</h2>
                  <p style="margin:0 0 20px;font-size:14px;color:#6b7280;">A new AI-generated blog draft is waiting for your review. Log into the admin panel to edit and publish.</p>
                  <a href="https://vitasignal.lovable.app/admin" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Review Draft →</a>
                  <p style="margin:24px 0 0;font-size:11px;color:#9ca3af;">Automated weekly blog draft from VitaSignal™</p>
                </div>
              </div>`,
          }),
        });
        console.log("[BlogDraft] Notification email sent.");
      } catch (emailErr) {
        console.error("[BlogDraft] Email notification failed:", emailErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        draft: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          category: post.category,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[BlogDraft] Error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
