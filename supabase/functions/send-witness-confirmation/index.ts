import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WitnessConfirmationRequest {
  witnessName: string;
  witnessTitle: string;
  witnessEmail: string;
  organization: string | null;
  claimsCount: number;
  attestedAt: string;
  documentHash: string;
  attestationId?: string;
  confirmationToken?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      witnessName, 
      witnessTitle,
      witnessEmail,
      organization, 
      claimsCount, 
      attestedAt,
      documentHash,
      attestationId,
      confirmationToken
    }: WitnessConfirmationRequest = await req.json();

    console.log("Sending witness confirmation to:", witnessEmail);

    // Update attestation with email and confirmation token if provided
    if (attestationId && confirmationToken) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      await supabase
        .from('patent_attestations')
        .update({
          witness_email: witnessEmail,
          confirmation_token: confirmationToken,
          confirmation_sent_at: new Date().toISOString()
        })
        .eq('id', attestationId);
    }

    // Generate confirmation link
    const confirmLink = confirmationToken 
      ? `${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app')}/patent-evidence?key=patent2025&confirm=${confirmationToken}`
      : null;

    const formattedDate = new Date(attestedAt).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
          .footer { background: #1e293b; color: #94a3b8; padding: 20px; border-radius: 0 0 8px 8px; font-size: 12px; }
          .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
          .detail-label { font-weight: 600; color: #64748b; width: 140px; }
          .detail-value { color: #1e293b; }
          .badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .badge-pending { background: #f59e0b; }
          .hash-box { background: #1e293b; color: #10b981; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 14px; word-break: break-all; }
          .button { display: inline-block; background: #059669; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Attestation Confirmation</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Your witness attestation has been recorded</p>
          </div>
          <div class="content">
            <p><span class="badge${confirmLink ? ' badge-pending' : ''}">
              ${confirmLink ? 'Email Verification Required' : 'Confirmed'}
            </span></p>
            
            <p style="margin-top: 16px;">Dear ${witnessName},</p>
            
            <p>Thank you for providing your witness attestation for the Clinical Risk Intelligence System patent documentation. Your attestation has been ${confirmLink ? 'recorded and requires email verification' : 'permanently recorded and cryptographically signed'}.</p>
            
            ${confirmLink ? `
            <p style="text-align: center;">
              <a href="${confirmLink}" class="button">Verify Email Address</a>
            </p>
            <p style="font-size: 13px; color: #64748b; text-align: center;">
              Click the button above to verify your email and complete the attestation.
            </p>
            ` : ''}
            
            <div style="margin-top: 20px;">
              <div class="detail-row">
                <span class="detail-label">Witness Name:</span>
                <span class="detail-value">${witnessName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Title:</span>
                <span class="detail-value">${witnessTitle}</span>
              </div>
              ${organization ? `
              <div class="detail-row">
                <span class="detail-label">Organization:</span>
                <span class="detail-value">${organization}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Claims Attested:</span>
                <span class="detail-value">${claimsCount} patent claims</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date & Time:</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
            </div>

            <p style="margin-top: 24px; font-weight: 600;">Document Hash (for verification):</p>
            <div class="hash-box">${documentHash}</div>

            <p style="margin-top: 24px; padding: 16px; background: #dbeafe; border-radius: 8px; color: #1e40af;">
              <strong>Important:</strong> Please retain this email for your records. 
              The document hash above can be used to verify the integrity of the patent documentation you attested to.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;">This is an automated confirmation from the Patent Evidence Documentation System.</p>
            <p style="margin: 8px 0 0;">© ${new Date().getFullYear()} Clinical Risk Intelligence System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Patent System <onboarding@resend.dev>",
        to: [witnessEmail],
        subject: `Attestation Confirmation - Patent Evidence Documentation`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("Witness confirmation email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending witness confirmation:", error);
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
