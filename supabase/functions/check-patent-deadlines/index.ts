import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAuth = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const attorneyEmail = Deno.env.get("PATENT_ATTORNEY_EMAIL");

    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch all office actions with pending status and approaching deadlines
    const { data: officeActions, error: oaError } = await supabase
      .from("office_actions")
      .select("*, patents(nickname, patent_number)")
      .in("status", ["pending", "in_progress"])
      .not("response_deadline", "is", null);

    if (oaError) throw oaError;

    // Fetch patents with approaching NP deadlines
    const { data: patents, error: pError } = await supabase
      .from("patents")
      .select("*")
      .eq("status", "active");

    if (pError) throw pError;

    const now = new Date();
    const alerts: { type: string; title: string; deadline: string; daysLeft: number; urgency: string }[] = [];

    // Check office action deadlines
    for (const oa of officeActions || []) {
      if (!oa.response_deadline) continue;
      const deadline = new Date(oa.response_deadline);
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 30) {
        const patentName = (oa.patents as any)?.nickname || oa.patent_id;
        alerts.push({
          type: "office_action",
          title: `${patentName}: ${oa.action_type}`,
          deadline: oa.response_deadline,
          daysLeft,
          urgency: daysLeft <= 0 ? "OVERDUE" : daysLeft <= 14 ? "CRITICAL" : "WARNING",
        });
      }
    }

    // Check NP conversion deadlines
    for (const p of patents || []) {
      if (!p.np_deadline) continue;
      const deadline = new Date(p.np_deadline);
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 90) {
        alerts.push({
          type: "np_deadline",
          title: `${p.nickname}: Nonprovisional Conversion`,
          deadline: p.np_deadline,
          daysLeft,
          urgency: daysLeft <= 0 ? "OVERDUE" : daysLeft <= 30 ? "CRITICAL" : daysLeft <= 60 ? "WARNING" : "NOTICE",
        });
      }
    }

    // Send email if there are alerts and Resend is configured
    if (alerts.length > 0 && resendKey && attorneyEmail) {
      const criticalCount = alerts.filter(a => a.urgency === "CRITICAL" || a.urgency === "OVERDUE").length;
      const subject = criticalCount > 0
        ? `⚠️ ${criticalCount} CRITICAL Patent Deadline Alert(s)`
        : `Patent Deadline Report: ${alerts.length} upcoming deadline(s)`;

      const html = `
        <h2>VitaSignal Patent Deadline Alerts</h2>
        <p>The following deadlines require attention:</p>
        <table style="border-collapse:collapse;width:100%">
          <tr style="background:#f0f0f0">
            <th style="padding:8px;text-align:left;border:1px solid #ddd">Type</th>
            <th style="padding:8px;text-align:left;border:1px solid #ddd">Patent / Action</th>
            <th style="padding:8px;text-align:left;border:1px solid #ddd">Deadline</th>
            <th style="padding:8px;text-align:left;border:1px solid #ddd">Days Left</th>
            <th style="padding:8px;text-align:left;border:1px solid #ddd">Urgency</th>
          </tr>
          ${alerts
            .sort((a, b) => a.daysLeft - b.daysLeft)
            .map(a => `
              <tr>
                <td style="padding:8px;border:1px solid #ddd">${a.type === 'office_action' ? 'Office Action' : 'NP Conversion'}</td>
                <td style="padding:8px;border:1px solid #ddd">${a.title}</td>
                <td style="padding:8px;border:1px solid #ddd">${a.deadline}</td>
                <td style="padding:8px;border:1px solid #ddd;color:${a.daysLeft <= 0 ? 'red' : a.daysLeft <= 14 ? 'orange' : 'inherit'}">${a.daysLeft <= 0 ? 'OVERDUE' : a.daysLeft + 'd'}</td>
                <td style="padding:8px;border:1px solid #ddd;font-weight:bold;color:${a.urgency === 'OVERDUE' ? 'red' : a.urgency === 'CRITICAL' ? 'orange' : 'inherit'}">${a.urgency}</td>
              </tr>
            `).join('')}
        </table>
        <p style="margin-top:16px;color:#666;font-size:12px">Generated by VitaSignal Patent Management System</p>
      `;

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "VitaSignal Patents <patents@vitasignal.com>",
          to: [attorneyEmail],
          subject,
          html,
        }),
      });

      if (!emailRes.ok) {
        console.error("Email send failed:", await emailRes.text());
      }
    }

    return new Response(JSON.stringify({
      alerts_count: alerts.length,
      alerts,
      email_sent: alerts.length > 0 && !!resendKey && !!attorneyEmail,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Deadline check error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
