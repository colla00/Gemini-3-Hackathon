import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const PATENT_ATTORNEY_EMAIL = Deno.env.get("PATENT_ATTORNEY_EMAIL") || "info@alexiscollier.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AttestationNotificationRequest {
  witnessName: string;
  witnessTitle: string;
  organization: string | null;
  claimsCount: number;
  attestedAt: string;
}

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

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
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { 
      witnessName, 
      witnessTitle, 
      organization, 
      claimsCount, 
      attestedAt
    }: AttestationNotificationRequest = await req.json();
    
    const recipientEmail = PATENT_ATTORNEY_EMAIL;

    console.log("Sending attestation notification to:", recipientEmail);

    const formattedDate = new Date(attestedAt).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const safeWitnessName = escapeHtml(witnessName || '');
    const safeWitnessTitle = escapeHtml(witnessTitle || '');
    const safeOrganization = organization ? escapeHtml(organization) : null;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
          .footer { background: #1e293b; color: #94a3b8; padding: 20px; border-radius: 0 0 8px 8px; font-size: 12px; }
          .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
          .detail-label { font-weight: 600; color: #64748b; width: 140px; }
          .detail-value { color: #1e293b; }
          .badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Patent Attestation Recorded</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">A new witness attestation has been submitted</p>
          </div>
          <div class="content">
            <p><span class="badge">New Attestation</span></p>
            
            <div style="margin-top: 20px;">
              <div class="detail-row">
                <span class="detail-label">Witness Name:</span>
                <span class="detail-value">${safeWitnessName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Title:</span>
                <span class="detail-value">${safeWitnessTitle}</span>
              </div>
              ${safeOrganization ? `
              <div class="detail-row">
                <span class="detail-label">Organization:</span>
                <span class="detail-value">${safeOrganization}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Claims Attested:</span>
                <span class="detail-value">${Number(claimsCount) || 0} patent claims</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date &amp; Time:</span>
                <span class="detail-value">${escapeHtml(formattedDate)}</span>
              </div>
            </div>

            <p style="margin-top: 24px; padding: 16px; background: #fef3c7; border-radius: 8px; color: #92400e;">
              <strong>Action Required:</strong> Please review this attestation record for your files. 
              The attestation has been cryptographically signed and stored in the system.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;">This is an automated notification from the Patent Evidence Documentation System.</p>
            <p style="margin: 8px 0 0;">&copy; ${new Date().getFullYear()} Patent Documentation System. All rights reserved.</p>
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
        from: "Patent System <cs@ezlearning.center>",
        to: [recipientEmail],
        subject: `New Patent Attestation Recorded - ${safeWitnessName}`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending attestation notification:", error);
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
