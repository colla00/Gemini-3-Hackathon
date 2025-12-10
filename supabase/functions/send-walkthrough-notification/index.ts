import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WalkthroughRequestData {
  name: string;
  email: string;
  organization?: string;
  role?: string;
  reason?: string;
}

// HTML escape function to prevent XSS/HTML injection
const escapeHtml = (str: string | undefined): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Input validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const validateTextField = (text: string | undefined, maxLength: number): boolean => {
  if (!text) return true;
  return text.length <= maxLength;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: WalkthroughRequestData = await req.json();
    console.log("Received walkthrough request notification for:", escapeHtml(data.email));

    // Validate inputs
    if (!data.name || !data.email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateEmail(data.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateTextField(data.name, 100) || 
        !validateTextField(data.organization, 200) || 
        !validateTextField(data.role, 100) || 
        !validateTextField(data.reason, 1000)) {
      return new Response(
        JSON.stringify({ error: "Input exceeds maximum length" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Escape all user inputs for HTML
    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeOrganization = escapeHtml(data.organization);
    const safeRole = escapeHtml(data.role);
    const safeReason = escapeHtml(data.reason);

    // Send notification email to admin
    const adminEmail = "info@alexiscollier.com";
    
    const adminEmailResponse = await resend.emails.send({
      from: "NSO Quality Dashboard <info@alexiscollier.com>",
      to: [adminEmail],
      subject: `New Walkthrough Access Request from ${safeName}`,
      html: `
        <h2>New Walkthrough Access Request</h2>
        <p>A new request for the 45-minute walkthrough has been submitted:</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${safeEmail}</td>
          </tr>
          ${safeOrganization ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Organization:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${safeOrganization}</td>
          </tr>
          ` : ''}
          ${safeRole ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Role:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${safeRole}</td>
          </tr>
          ` : ''}
          ${safeReason ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Reason:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${safeReason}</td>
          </tr>
          ` : ''}
        </table>
        <p style="margin-top: 20px;">
          Log in to the admin panel to review this request.
        </p>
      `,
    });

    console.log("Admin notification sent:", adminEmailResponse);

    // Send confirmation email to requester (use original email for sending, escaped for display)
    const confirmationResponse = await resend.emails.send({
      from: "NSO Quality Dashboard <info@alexiscollier.com>",
      to: [data.email],
      subject: "Your Walkthrough Request Has Been Received",
      html: `
        <h2>Thank You for Your Interest!</h2>
        <p>Hi ${safeName},</p>
        <p>We've received your request to access the 45-minute NSO Quality Dashboard walkthrough.</p>
        <p>Our team will review your request and get back to you shortly with access details.</p>
        <p>In the meantime, feel free to explore our landing page for more information about the dashboard.</p>
        <p style="margin-top: 30px;">Best regards,<br>The NSO Quality Dashboard Team</p>
      `,
    });

    console.log("Confirmation email sent:", confirmationResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse,
        confirmationEmail: confirmationResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-walkthrough-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
