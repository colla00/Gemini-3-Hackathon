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

    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const sixtyDays = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();
    const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();

    // Pull real deadline data
    const [patents, officeActions, fdaDocs, trainingDue] = await Promise.all([
      supabaseAdmin.from("patents").select("id, nickname, patent_number, status, np_deadline, filing_date, priority_level").order("np_deadline", { ascending: true }),
      supabaseAdmin.from("office_actions").select("id, patent_id, action_type, response_deadline, status, mailing_date").eq("status", "pending").order("response_deadline", { ascending: true }),
      supabaseAdmin.from("fda_presub_documents").select("id, title, document_type, status, updated_at").order("updated_at", { ascending: false }).limit(10),
      supabaseAdmin.from("hipaa_training_completions").select("id, module_id, expires_at, user_id").order("expires_at", { ascending: true }).limit(20),
    ]);

    const deadlineData = {
      patents: (patents.data || []).map(p => ({
        ...p,
        urgency: new Date(p.np_deadline) <= new Date(thirtyDays) ? "critical" :
                 new Date(p.np_deadline) <= new Date(sixtyDays) ? "high" :
                 new Date(p.np_deadline) <= new Date(ninetyDays) ? "medium" : "low",
        days_remaining: Math.ceil((new Date(p.np_deadline).getTime() - now.getTime()) / (24 * 60 * 60 * 1000)),
      })),
      pending_office_actions: officeActions.data || [],
      fda_documents: fdaDocs.data || [],
      expiring_training: (trainingDue.data || []).filter(t => new Date(t.expires_at) <= new Date(ninetyDays)),
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
            content: `You are VitaSignal's regulatory affairs coordinator. Generate a weekly regulatory deadline digest.

Structure:
1. **🚨 Critical (Next 30 Days)** — Items requiring immediate action
2. **⚠️ High Priority (30-60 Days)** — Items to prepare for
3. **📋 Medium Priority (60-90 Days)** — Items on the horizon
4. **FDA Submission Status** — Current status of Pre-Sub documents
5. **Compliance Training** — Expiring HIPAA certifications
6. **Recommended Actions This Week** — 3-5 specific to-do items with owners

For each deadline, include:
- What it is (patent name/number, document type)
- Exact deadline date
- Days remaining
- Required action
- Estimated cost if applicable

Respond with ONLY valid JSON:
{
  "title": "Regulatory Deadline Digest — [date]",
  "content": "Full digest with ** for bold headers. Double newlines between sections.",
  "critical_count": 0,
  "high_count": 0
}`,
          },
          {
            role: "user",
            content: `Generate this week's regulatory deadline digest using this real data:\n${JSON.stringify(deadlineData, null, 2)}\n\nToday: ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
          },
        ],
        temperature: 0.4,
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
    const digest = JSON.parse(cleaned);

    const { data: draft, error: insertError } = await supabaseAdmin
      .from("weekly_drafts")
      .insert({
        draft_type: "regulatory_digest",
        title: digest.title,
        content: digest.content,
        metadata: {
          critical_count: digest.critical_count,
          high_count: digest.high_count,
          patents_tracked: deadlineData.patents.length,
          pending_office_actions: deadlineData.pending_office_actions.length,
        },
      })
      .select("id, title")
      .single();

    if (insertError) throw new Error(`Insert failed: ${insertError.message}`);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const RECIPIENT = Deno.env.get("PATENT_ATTORNEY_EMAIL") || "info@vitasignal.ai";
    if (RESEND_API_KEY) {
      const urgencyColor = digest.critical_count > 0 ? "#dc2626" : "#16a34a";
      const urgencyText = digest.critical_count > 0
        ? `${digest.critical_count} critical deadline${digest.critical_count > 1 ? "s" : ""} in the next 30 days`
        : "No critical deadlines — all clear";

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "VitaSignal <notifications@resend.dev>",
          to: [RECIPIENT],
          subject: `⚖️ Regulatory Digest: ${digest.critical_count > 0 ? `${digest.critical_count} Critical` : "All Clear"} — ${digest.title}`,
          html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;"><div style="background:#0f172a;padding:20px 24px;border-radius:8px 8px 0 0;"><h1 style="color:#fff;margin:0;font-size:18px;">Regulatory Deadline Digest</h1></div><div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;"><div style="background:${urgencyColor}10;border-left:4px solid ${urgencyColor};padding:12px 16px;margin-bottom:20px;border-radius:0 8px 8px 0;"><strong style="color:${urgencyColor};">${urgencyText}</strong></div><h2 style="margin:0 0 16px;font-size:18px;">${digest.title}</h2><p style="color:#6b7280;font-size:14px;">Review deadlines, compliance items, and recommended actions.</p><a href="https://vitasignal.lovable.app/admin" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;margin-top:12px;">Review Digest →</a></div></div>`,
        }),
      }).catch(e => console.error("[RegulatoryDigest] Email failed:", e));
    }

    console.log(`[RegulatoryDigest] Draft created: ${draft.title}`);
    return new Response(JSON.stringify({ success: true, draft }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[RegulatoryDigest] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
