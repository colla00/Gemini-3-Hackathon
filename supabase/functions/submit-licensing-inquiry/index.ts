import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { organization_name, contact_name, email, phone, organization_type, systems_of_interest, message, nda_agreed } = body;

    if (!organization_name || !contact_name || !email || !organization_type) {
      throw new Error("Required fields missing");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Insert inquiry
    const { error: insertError } = await supabaseAdmin
      .from("licensing_inquiries")
      .insert({
        organization_name,
        contact_name,
        email,
        phone: phone || null,
        organization_type,
        systems_of_interest: systems_of_interest || [],
        message: message || null,
        nda_agreed: nda_agreed || false,
      });

    if (insertError) throw new Error(`Database error: ${insertError.message}`);

    // Send notification email to admin
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "VitaSignal Licensing <licensing@vitasignal.ai>",
            to: ["licensing@vitasignal.ai"],
            subject: `New Licensing Inquiry — ${organization_name} (${organization_type})`,
            html: `
              <h2>New Licensing Inquiry</h2>
              <p><strong>Organization:</strong> ${organization_name}</p>
              <p><strong>Contact:</strong> ${contact_name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Type:</strong> ${organization_type}</p>
              <p><strong>Systems:</strong> ${(systems_of_interest || []).join(', ')}</p>
              <p><strong>NDA Agreed:</strong> ${nda_agreed ? 'Yes' : 'No'}</p>
              <p><strong>Message:</strong> ${message || 'N/A'}</p>
            `,
          }),
        });

        // Send confirmation to user
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "VitaSignal <info@vitasignal.ai>",
            to: [email],
            subject: "VitaSignal Licensing Inquiry Received",
            html: `
              <h2>Thank you for your interest in VitaSignal™</h2>
              <p>Dear ${contact_name},</p>
              <p>We have received your licensing inquiry from ${organization_name}. Our team will review your request and respond within 2 business days.</p>
              <p>If your inquiry requires immediate attention, please reply to this email or contact us at info@vitasignal.ai.</p>
              <br/>
              <p>Best regards,<br/>VitaSignal LLC</p>
              <hr/>
              <p style="font-size:11px;color:#888;">VitaSignal™ systems are pre-market. Not FDA-cleared. Patent-pending.</p>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
