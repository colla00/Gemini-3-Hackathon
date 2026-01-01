import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const PATENT_ATTORNEY_EMAIL = Deno.env.get("PATENT_ATTORNEY_EMAIL") || "info@alexiscollier.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AttorneyNotificationRequest {
  notificationType: 'new_attestation' | 'multi_witness_complete' | 'screenshot_upload';
  witnessName?: string;
  witnessTitle?: string;
  organization?: string | null;
  claimsCount?: number;
  attestedAt?: string;
  groupId?: string;
  witnessCount?: number;
  claimNumber?: number;
  screenshotCount?: number;
  documentHash: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: AttorneyNotificationRequest = await req.json();
    
    console.log("Sending attorney notification:", payload);

    let subject = "";
    let emailHtml = "";

    const formattedDate = payload.attestedAt 
      ? new Date(payload.attestedAt).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        })
      : new Date().toLocaleString();

    switch (payload.notificationType) {
      case 'new_attestation':
        subject = `New Patent Attestation - ${payload.witnessName}`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
              .footer { background: #1e293b; color: #94a3b8; padding: 20px; border-radius: 0 0 8px 8px; font-size: 12px; }
              .detail-row { padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
              .badge { display: inline-block; background: #7c3aed; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">New Attestation Recorded</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Patent Evidence Documentation</p>
              </div>
              <div class="content">
                <p><span class="badge">Attestation</span></p>
                <div class="detail-row"><strong>Witness:</strong> ${payload.witnessName}</div>
                <div class="detail-row"><strong>Title:</strong> ${payload.witnessTitle}</div>
                ${payload.organization ? `<div class="detail-row"><strong>Organization:</strong> ${payload.organization}</div>` : ''}
                <div class="detail-row"><strong>Claims Attested:</strong> ${payload.claimsCount}</div>
                <div class="detail-row"><strong>Date:</strong> ${formattedDate}</div>
                <div class="detail-row"><strong>Document Hash:</strong> <code>${payload.documentHash}</code></div>
              </div>
              <div class="footer">
                <p>Patent Evidence Documentation System</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case 'multi_witness_complete':
        subject = `Multi-Witness Attestation Complete - ${payload.witnessCount} Witnesses`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
              .footer { background: #1e293b; color: #94a3b8; padding: 20px; border-radius: 0 0 8px 8px; font-size: 12px; }
              .badge { display: inline-block; background: #059669; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">✓ Multi-Witness Attestation Complete</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">All required witnesses have signed</p>
              </div>
              <div class="content">
                <p><span class="badge">Complete</span></p>
                <p>A multi-witness attestation has been completed with <strong>${payload.witnessCount} witnesses</strong>.</p>
                <div class="detail-row"><strong>Group ID:</strong> <code>${payload.groupId}</code></div>
                <div class="detail-row"><strong>Document Hash:</strong> <code>${payload.documentHash}</code></div>
                <div class="detail-row"><strong>Completed:</strong> ${formattedDate}</div>
              </div>
              <div class="footer">
                <p>Patent Evidence Documentation System</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case 'screenshot_upload':
        subject = `New Evidence Screenshot - Claim ${payload.claimNumber}`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0891b2, #06b6d4); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
              .footer { background: #1e293b; color: #94a3b8; padding: 20px; border-radius: 0 0 8px 8px; font-size: 12px; }
              .badge { display: inline-block; background: #0891b2; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">New Screenshot Evidence</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Claim ${payload.claimNumber}</p>
              </div>
              <div class="content">
                <p><span class="badge">Screenshot</span></p>
                <p>A new screenshot has been uploaded for <strong>Claim ${payload.claimNumber}</strong>.</p>
                <div class="detail-row"><strong>Total Screenshots for Claim:</strong> ${payload.screenshotCount}</div>
                <div class="detail-row"><strong>Document Hash:</strong> <code>${payload.documentHash}</code></div>
                <div class="detail-row"><strong>Uploaded:</strong> ${formattedDate}</div>
              </div>
              <div class="footer">
                <p>Patent Evidence Documentation System</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
    }

    // Send email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Patent System <onboarding@resend.dev>",
        to: [PATENT_ATTORNEY_EMAIL],
        subject,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("Attorney notification sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending attorney notification:", error);
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
