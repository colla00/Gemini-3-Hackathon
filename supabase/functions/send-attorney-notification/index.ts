import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const PATENT_ATTORNEY_EMAIL = Deno.env.get("PATENT_ATTORNEY_EMAIL") || "info@alexiscollier.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: AttorneyNotificationRequest = await req.json();
    console.log("Sending attorney notification type:", payload.notificationType);

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

    const safeWitnessName = escapeHtml(payload.witnessName || '');
    const safeWitnessTitle = escapeHtml(payload.witnessTitle || '');
    const safeOrganization = payload.organization ? escapeHtml(payload.organization) : null;
    const safeDocumentHash = escapeHtml(payload.documentHash || '');
    const safeGroupId = escapeHtml(payload.groupId || '');

    switch (payload.notificationType) {
      case 'new_attestation':
        subject = `New Patent Attestation - ${safeWitnessName}`;
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
                <div class="detail-row"><strong>Witness:</strong> ${safeWitnessName}</div>
                <div class="detail-row"><strong>Title:</strong> ${safeWitnessTitle}</div>
                ${safeOrganization ? `<div class="detail-row"><strong>Organization:</strong> ${safeOrganization}</div>` : ''}
                <div class="detail-row"><strong>Claims Attested:</strong> ${Number(payload.claimsCount) || 0}</div>
                <div class="detail-row"><strong>Date:</strong> ${escapeHtml(formattedDate)}</div>
                <div class="detail-row"><strong>Document Hash:</strong> <code>${safeDocumentHash}</code></div>
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
        subject = `Multi-Witness Attestation Complete - ${Number(payload.witnessCount) || 0} Witnesses`;
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
                <h1 style="margin: 0;">&#10003; Multi-Witness Attestation Complete</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">All required witnesses have signed</p>
              </div>
              <div class="content">
                <p><span class="badge">Complete</span></p>
                <p>A multi-witness attestation has been completed with <strong>${Number(payload.witnessCount) || 0} witnesses</strong>.</p>
                <div class="detail-row"><strong>Group ID:</strong> <code>${safeGroupId}</code></div>
                <div class="detail-row"><strong>Document Hash:</strong> <code>${safeDocumentHash}</code></div>
                <div class="detail-row"><strong>Completed:</strong> ${escapeHtml(formattedDate)}</div>
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
        subject = `New Evidence Screenshot - Claim ${Number(payload.claimNumber) || 0}`;
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
                <p style="margin: 10px 0 0; opacity: 0.9;">Claim ${Number(payload.claimNumber) || 0}</p>
              </div>
              <div class="content">
                <p><span class="badge">Screenshot</span></p>
                <p>A new screenshot has been uploaded for <strong>Claim ${Number(payload.claimNumber) || 0}</strong>.</p>
                <div class="detail-row"><strong>Total Screenshots for Claim:</strong> ${Number(payload.screenshotCount) || 0}</div>
                <div class="detail-row"><strong>Document Hash:</strong> <code>${safeDocumentHash}</code></div>
                <div class="detail-row"><strong>Uploaded:</strong> ${escapeHtml(formattedDate)}</div>
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

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Patent System <cs@ezlearning.center>",
        to: [PATENT_ATTORNEY_EMAIL],
        subject,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      throw new Error("Failed to send email");
    }

    console.log("Attorney notification sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending attorney notification:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
