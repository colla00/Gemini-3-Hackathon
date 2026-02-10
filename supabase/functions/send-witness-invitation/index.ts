import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WitnessInvitationRequest {
  witnessEmail: string;
  witnessName: string;
  invitedBy: string;
  invitationToken: string;
  documentHash: string;
  expiresAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const {
      witnessEmail, 
      witnessName,
      invitedBy,
      invitationToken,
      documentHash,
      expiresAt
    }: WitnessInvitationRequest = await req.json();

    console.log("Sending witness invitation to:", witnessEmail);

    const inviteLink = `${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app')}/patent-evidence?key=patent2025&invite=${invitationToken}`;
    
    const formattedExpiry = new Date(expiresAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
          .footer { background: #1e293b; color: #94a3b8; padding: 20px; border-radius: 0 0 8px 8px; font-size: 12px; text-align: center; }
          .button { display: inline-block; background: #6366f1; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .button:hover { background: #4f46e5; }
          .info-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; margin: 20px 0; }
          .hash-box { background: #1e293b; color: #6366f1; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 14px; word-break: break-all; text-align: center; }
          .warning { background: #fef3c7; border: 1px solid #fcd34d; padding: 12px; border-radius: 8px; color: #92400e; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Witness Attestation Request</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Patent Evidence Documentation</p>
          </div>
          <div class="content">
            <p>Dear ${witnessName},</p>
            
            <p>You have been invited by <strong>${invitedBy}</strong> to provide a witness attestation for the Clinical Risk Intelligence System patent documentation.</p>
            
            <div class="info-box">
              <p style="margin: 0;"><strong>What you'll be attesting to:</strong></p>
              <ul style="margin: 10px 0 0; padding-left: 20px;">
                <li>Review of 20 patent claims and their working implementations</li>
                <li>Verification that the described functionality exists in the software</li>
                <li>Your attestation will be permanently recorded with a timestamp</li>
              </ul>
            </div>

            <p style="text-align: center;">
              <a href="${inviteLink}" class="button">Review & Attest</a>
            </p>

            <p style="font-size: 13px; color: #64748b; text-align: center;">
              Or copy this link: <br/>
              <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 11px;">${inviteLink}</code>
            </p>

            <p style="margin-top: 24px; font-weight: 600;">Document Hash:</p>
            <div class="hash-box">${documentHash}</div>

            <div class="warning" style="margin-top: 20px;">
              <strong>⏰ This invitation expires on ${formattedExpiry}</strong><br/>
              Please complete your attestation before this date.
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0;">This is an automated invitation from the Patent Evidence Documentation System.</p>
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
        from: "Patent System <cs@ezlearning.center>",
        to: [witnessEmail],
        subject: `Witness Attestation Request - Patent Evidence Documentation`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      throw new Error("Failed to send invitation email");
    }

    console.log("Witness invitation email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending witness invitation:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
