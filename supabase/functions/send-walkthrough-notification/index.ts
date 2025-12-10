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
  type?: 'new_request' | 'approved' | 'denied';
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
    const notificationType = data.type || 'new_request';
    console.log(`Processing ${notificationType} notification for:`, escapeHtml(data.email));

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

    const adminEmail = "info@alexiscollier.com";
    const dashboardUrl = "https://nso-quality-dashboard.lovable.app";

    // Handle approval notification
    if (notificationType === 'approved') {
      const approvalEmailResponse = await resend.emails.send({
        from: "NSO Quality Dashboard <info@alexiscollier.com>",
        to: [data.email],
        subject: "Your Walkthrough Access Has Been Approved! 🎉",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Welcome to the NSO Quality Dashboard!</h2>
            <p>Hi ${safeName},</p>
            <p>Great news! Your request to access the 45-minute NSO Quality Dashboard walkthrough has been <strong style="color: #10b981;">approved</strong>.</p>
            <p>You now have full access to:</p>
            <ul>
              <li>Complete 45-minute interactive walkthrough</li>
              <li>All dashboard features and demonstrations</li>
              <li>Clinical workflow simulations</li>
              <li>AI-powered analysis tools</li>
            </ul>
            <div style="margin: 30px 0;">
              <a href="${dashboardUrl}/presentation" 
                 style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Access the Walkthrough
              </a>
            </div>
            <p>If you have any questions, feel free to reply to this email.</p>
            <p style="margin-top: 30px;">Best regards,<br>Alexis Collier<br>NSO Quality Dashboard</p>
          </div>
        `,
      });

      console.log("Approval email sent:", approvalEmailResponse);

      return new Response(
        JSON.stringify({ success: true, approvalEmail: approvalEmailResponse }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Handle denial notification
    if (notificationType === 'denied') {
      const denialEmailResponse = await resend.emails.send({
        from: "NSO Quality Dashboard <info@alexiscollier.com>",
        to: [data.email],
        subject: "Update on Your Walkthrough Access Request",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>NSO Quality Dashboard</h2>
            <p>Hi ${safeName},</p>
            <p>Thank you for your interest in the NSO Quality Dashboard walkthrough.</p>
            <p>After reviewing your request, we're unable to grant access at this time. This may be due to limited availability or eligibility requirements for the current phase of the research prototype.</p>
            <p>If you believe this was in error or would like to provide additional information, please reply to this email and we'll be happy to reconsider your request.</p>
            <p style="margin-top: 30px;">Best regards,<br>Alexis Collier<br>NSO Quality Dashboard</p>
          </div>
        `,
      });

      console.log("Denial email sent:", denialEmailResponse);

      return new Response(
        JSON.stringify({ success: true, denialEmail: denialEmailResponse }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Default: Handle new request notification
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
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
