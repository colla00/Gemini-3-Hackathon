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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: WalkthroughRequestData = await req.json();
    console.log("Received walkthrough request notification:", data);

    // Send notification email to admin
    const adminEmail = "admin@example.com"; // You can change this to your actual admin email
    
    const adminEmailResponse = await resend.emails.send({
      from: "NSO Quality Dashboard <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `New Walkthrough Access Request from ${data.name}`,
      html: `
        <h2>New Walkthrough Access Request</h2>
        <p>A new request for the 45-minute walkthrough has been submitted:</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.email}</td>
          </tr>
          ${data.organization ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Organization:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.organization}</td>
          </tr>
          ` : ''}
          ${data.role ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Role:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.role}</td>
          </tr>
          ` : ''}
          ${data.reason ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Reason:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.reason}</td>
          </tr>
          ` : ''}
        </table>
        <p style="margin-top: 20px;">
          <a href="https://your-app.lovable.app/admin" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Review in Admin Panel
          </a>
        </p>
      `,
    });

    console.log("Admin notification sent:", adminEmailResponse);

    // Send confirmation email to requester
    const confirmationResponse = await resend.emails.send({
      from: "NSO Quality Dashboard <onboarding@resend.dev>",
      to: [data.email],
      subject: "Your Walkthrough Request Has Been Received",
      html: `
        <h2>Thank You for Your Interest!</h2>
        <p>Hi ${data.name},</p>
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
