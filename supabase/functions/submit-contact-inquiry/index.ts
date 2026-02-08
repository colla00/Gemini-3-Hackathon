import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactInquiry {
  inquiry_type: string;
  name: string;
  email: string;
  organization?: string;
  role?: string;
  timeline?: string;
  irb_status?: string;
  message: string;
}

const VALID_TYPES = ["licensing", "research", "press", "general"];

const escapeHtml = (str: string | undefined): string => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rate limiting by IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimitKey = `contact_inquiry:${clientIp}`;
    const { data: rateLimitResult } = await supabase.rpc("check_rate_limit", {
      p_key: rateLimitKey,
      p_max_requests: 5,
      p_window_seconds: 3600,
    });

    if (rateLimitResult && !rateLimitResult.allowed) {
      await supabase.rpc("log_rate_limit_violation", {
        p_key: rateLimitKey,
        p_ip_address: clientIp,
        p_endpoint: "submit-contact-inquiry",
      });
      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "3600" } }
      );
    }

    const body: ContactInquiry = await req.json();

    // Validate required fields
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim() || !body.inquiry_type) {
      return new Response(
        JSON.stringify({ error: "Name, email, message, and inquiry type are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!VALID_TYPES.includes(body.inquiry_type)) {
      return new Response(
        JSON.stringify({ error: "Invalid inquiry type." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email.trim())) {
      return new Response(
        JSON.stringify({ error: "Invalid email address." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Length limits
    if (body.name.length > 200 || body.email.length > 255 || body.message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Input exceeds maximum length." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save to database
    const { error: dbError } = await supabase.from("contact_inquiries").insert({
      inquiry_type: body.inquiry_type,
      name: body.name.trim(),
      email: body.email.trim(),
      organization: body.organization?.trim() || null,
      role: body.role?.trim() || null,
      timeline: body.timeline?.trim() || null,
      irb_status: body.irb_status?.trim() || null,
      message: body.message.trim(),
      status: "new",
    });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save inquiry." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email notification
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const resend = new Resend(resendKey);
      const typeLabels: Record<string, string> = {
        licensing: "Licensing Inquiry",
        research: "Research Collaboration",
        press: "Press & Media",
        general: "General Inquiry",
      };

      const optionalFields = [
        body.organization && `<p><strong>Organization:</strong> ${escapeHtml(body.organization)}</p>`,
        body.role && `<p><strong>Role:</strong> ${escapeHtml(body.role)}</p>`,
        body.timeline && `<p><strong>Timeline:</strong> ${escapeHtml(body.timeline)}</p>`,
        body.irb_status && `<p><strong>IRB Status:</strong> ${escapeHtml(body.irb_status)}</p>`,
      ].filter(Boolean).join("\n");

      try {
        await resend.emails.send({
          from: "VitaSignal <cs@ezlearning.center>",
          to: ["info@alexiscollier.com"],
          replyTo: body.email.trim(),
          subject: `[${typeLabels[body.inquiry_type]}] ${body.name.trim()}`,
          html: `
            <h2>New ${typeLabels[body.inquiry_type]}</h2>
            <hr />
            <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
            ${optionalFields}
            <hr />
            <h3>Message</h3>
            <p>${escapeHtml(body.message).replace(/\n/g, "<br />")}</p>
            <hr />
            <p style="color: #888; font-size: 12px;">Submitted via VitaSignal website contact form</p>
          `,
        });
      } catch (emailErr) {
        console.error("Email send failed (inquiry still saved):", emailErr);
      }
    } else {
      console.warn("RESEND_API_KEY not set, skipping email notification");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});