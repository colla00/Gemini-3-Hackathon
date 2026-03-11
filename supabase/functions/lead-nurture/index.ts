import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TEMPLATES: Record<string, { subject: string; heading: string; cta: { label: string; url: string } }> = {
  licensing: {
    subject: "Your VitaSignal Licensing Inquiry — Next Steps",
    heading: "Thank you for your licensing interest",
    cta: { label: "View ROI Calculator", url: "https://vitasignal.lovable.app/roi-calculator" },
  },
  pilot: {
    subject: "VitaSignal Pilot Request Received",
    heading: "We've received your pilot request",
    cta: { label: "Explore Our Demo", url: "https://vitasignal.lovable.app/demo" },
  },
  career: {
    subject: "VitaSignal — Application Received",
    heading: "Thanks for your interest in joining VitaSignal",
    cta: { label: "Learn About Us", url: "https://vitasignal.lovable.app/about" },
  },
  general: {
    subject: "VitaSignal — We Received Your Message",
    heading: "Thanks for reaching out",
    cta: { label: "View Pricing", url: "https://vitasignal.lovable.app/pricing" },
  },
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmail(name: string, inquiryType: string) {
  const safeName = escapeHtml(name.split(" ")[0] || "there");
  const template = TEMPLATES[inquiryType] || TEMPLATES.general;

  return {
    subject: template.subject,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 20px">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e5ea">
  <tr><td style="background:#1a6b5c;padding:28px 32px;text-align:center">
    <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700">VitaSignal™</h1>
  </td></tr>
  <tr><td style="padding:32px">
    <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:22px">${template.heading}</h2>
    <p style="color:#4a4a68;font-size:15px;line-height:1.6;margin:0 0 16px">
      Hi ${safeName}, we've received your inquiry and a member of our team will review it shortly. In the meantime, here's something that might be helpful:
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td>
      <a href="${template.cta.url}" style="display:inline-block;background:#1a6b5c;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">${escapeHtml(template.cta.label)}</a>
    </td></tr></table>
    <p style="color:#4a4a68;font-size:14px;line-height:1.6;margin:0">
      If you need immediate assistance, reply directly to this email or contact us at <a href="mailto:info@vitasignal.ai" style="color:#1a6b5c">info@vitasignal.ai</a>.
    </p>
  </td></tr>
  <tr><td style="padding:20px 32px;background:#f8f9fa;border-top:1px solid #e2e5ea;text-align:center">
    <p style="margin:0;color:#8a8aa3;font-size:11px">© 2025–2026 VitaSignal LLC. All Rights Reserved.</p>
    <p style="margin:4px 0 0;color:#8a8aa3;font-size:11px">11 U.S. Patent Applications Filed</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = await req.json();

    if (!record?.email || !record?.name) {
      return new Response(JSON.stringify({ error: "Missing record data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { subject, html } = buildEmail(record.name, record.inquiry_type || "general");

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VitaSignal <info@vitasignal.ai>",
        to: [record.email],
        subject,
        html,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error("Resend error:", err);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await emailRes.json();
    console.log("Lead nurture email sent:", result.id);

    return new Response(JSON.stringify({ success: true, emailId: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Lead nurture error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
