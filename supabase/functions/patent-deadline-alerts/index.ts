import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Patent Deadline Alert System
 * 
 * Runs via cron to check 12-month nonprovisional conversion deadlines.
 * Sends email alerts at 90, 60, 30, 14, and 7 days before deadline.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const attorneyEmail = Deno.env.get("PATENT_ATTORNEY_EMAIL");
  const supabase = createClient(supabaseUrl, supabaseKey);

  const ALERT_THRESHOLDS_DAYS = [90, 60, 30, 14, 7, 3, 1];

  try {
    // Fetch all active patents with deadlines
    const { data: patents, error } = await supabase
      .from("patents")
      .select("*")
      .eq("status", "active")
      .order("np_deadline", { ascending: true });

    if (error) {
      console.error("[Deadline] Fetch error:", error.message);
      return new Response(
        JSON.stringify({ error: "Failed to fetch patents" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!patents || patents.length === 0) {
      return new Response(
        JSON.stringify({ checked: 0, alerts: 0, message: "No active patents" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const now = new Date();
    const alerts: Array<{ patent: string; deadline: string; daysRemaining: number; urgency: string }> = [];

    for (const patent of patents) {
      const deadline = new Date(patent.np_deadline);
      const diffMs = deadline.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      // Check if we're at an alert threshold
      const matchedThreshold = ALERT_THRESHOLDS_DAYS.find(t => daysRemaining === t);
      
      if (matchedThreshold || daysRemaining <= 0) {
        const urgency = daysRemaining <= 0 ? "EXPIRED" :
                       daysRemaining <= 7 ? "CRITICAL" :
                       daysRemaining <= 30 ? "URGENT" : "WARNING";
        
        alerts.push({
          patent: `${patent.nickname} (${patent.patent_number})`,
          deadline: patent.np_deadline,
          daysRemaining,
          urgency,
        });
      }
    }

    // Send email if there are alerts and Resend is configured
    if (alerts.length > 0 && resendApiKey) {
      const criticalCount = alerts.filter(a => a.urgency === "CRITICAL" || a.urgency === "EXPIRED").length;
      const urgentCount = alerts.filter(a => a.urgency === "URGENT").length;
      
      const subject = criticalCount > 0
        ? `🚨 CRITICAL: ${criticalCount} Patent Deadline(s) Imminent`
        : urgentCount > 0
        ? `⚠️ URGENT: ${urgentCount} Patent Deadline(s) Approaching`
        : `📋 Patent Deadline Reminder: ${alerts.length} upcoming`;

      const alertRows = alerts.map(a => 
        `<tr style="border-bottom:1px solid #e5e7eb">
          <td style="padding:8px;font-weight:600">${a.patent}</td>
          <td style="padding:8px">${a.deadline}</td>
          <td style="padding:8px;color:${
            a.urgency === 'EXPIRED' ? '#dc2626' :
            a.urgency === 'CRITICAL' ? '#dc2626' :
            a.urgency === 'URGENT' ? '#d97706' : '#2563eb'
          };font-weight:700">${a.daysRemaining <= 0 ? 'EXPIRED' : `${a.daysRemaining} days`}</td>
          <td style="padding:8px">
            <span style="padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;background:${
              a.urgency === 'EXPIRED' ? '#fee2e2' :
              a.urgency === 'CRITICAL' ? '#fee2e2' :
              a.urgency === 'URGENT' ? '#fef3c7' : '#dbeafe'
            };color:${
              a.urgency === 'EXPIRED' ? '#991b1b' :
              a.urgency === 'CRITICAL' ? '#991b1b' :
              a.urgency === 'URGENT' ? '#92400e' : '#1e40af'
            }">${a.urgency}</span>
          </td>
        </tr>`
      ).join("");

      const htmlBody = `
        <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px;margin:0 auto">
          <div style="background:#0f172a;color:white;padding:24px;border-radius:8px 8px 0 0">
            <h1 style="margin:0;font-size:20px">VitaSignal™ Patent Portfolio</h1>
            <p style="margin:4px 0 0;opacity:0.8;font-size:14px">Nonprovisional Conversion Deadline Alert</p>
          </div>
          <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <thead>
                <tr style="border-bottom:2px solid #e5e7eb">
                  <th style="padding:8px;text-align:left">Patent</th>
                  <th style="padding:8px;text-align:left">Deadline</th>
                  <th style="padding:8px;text-align:left">Remaining</th>
                  <th style="padding:8px;text-align:left">Status</th>
                </tr>
              </thead>
              <tbody>${alertRows}</tbody>
            </table>
            <p style="margin-top:20px;font-size:12px;color:#6b7280">
              This is an automated alert from the VitaSignal patent management system.
              12-month nonprovisional conversion deadlines are calculated from provisional filing dates.
            </p>
          </div>
        </div>
      `;

      const recipients = [attorneyEmail, "alexis@vitasignal.ai"].filter(Boolean);
      
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "VitaSignal Patents <patents@vitasignal.ai>",
            to: recipients,
            subject,
            html: htmlBody,
          }),
        });

        if (emailResponse.ok) {
          console.log(`[Deadline] Sent ${alerts.length} alerts to ${recipients.length} recipients`);
        } else {
          const errText = await emailResponse.text();
          console.error("[Deadline] Email send error:", errText);
        }
      } catch (emailErr) {
        console.error("[Deadline] Email error:", emailErr);
      }
    }

    // Build summary for all patents
    const summary = patents.map(p => {
      const deadline = new Date(p.np_deadline);
      const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        nickname: p.nickname,
        patent_number: p.patent_number,
        np_deadline: p.np_deadline,
        days_remaining: daysRemaining,
        status: daysRemaining <= 0 ? "expired" : daysRemaining <= 30 ? "urgent" : daysRemaining <= 90 ? "warning" : "ok",
        attorney_assigned: p.attorney_assigned,
      };
    });

    return new Response(
      JSON.stringify({
        checked: patents.length,
        alerts_sent: alerts.length,
        summary,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Deadline] Error:", error);
    return new Response(
      JSON.stringify({ error: "Deadline check failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
