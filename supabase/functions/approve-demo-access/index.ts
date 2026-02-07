import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Generate a secure temporary password
function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const specials = "!@#$%&*";
  let password = "";
  const array = new Uint8Array(10);
  crypto.getRandomValues(array);
  for (let i = 0; i < 10; i++) {
    password += chars[array[i] % chars.length];
  }
  // Add a special char and digit to satisfy password policies
  const specialArray = new Uint8Array(2);
  crypto.getRandomValues(specialArray);
  password += specials[specialArray[0] % specials.length];
  password += String(specialArray[1] % 10);
  return password;
}

const escapeHtml = (str: string | undefined): string => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the calling user is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user: callingUser }, error: authError } = await anonClient.auth.getUser(token);

    if (authError || !callingUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", callingUser.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { requestId, action } = await req.json();

    if (!requestId || !["approved", "denied"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "requestId and action (approved/denied) are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch the request
    const { data: request, error: fetchError } = await supabase
      .from("walkthrough_access_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !request) {
      return new Response(
        JSON.stringify({ error: "Request not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update request status
    const { error: updateError } = await supabase
      .from("walkthrough_access_requests")
      .update({
        status: action,
        reviewed_at: new Date().toISOString(),
        reviewed_by: callingUser.id,
      })
      .eq("id", requestId);

    if (updateError) {
      throw new Error(`Failed to update request: ${updateError.message}`);
    }

    const safeName = escapeHtml(request.name);
    const dashboardUrl = "https://clinicaldashboard.lovable.app";

    if (action === "approved") {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(
        (u: any) => u.email?.toLowerCase() === request.email.toLowerCase()
      );

      let tempPassword: string | null = null;
      let accountCreated = false;

      if (!existingUser) {
        // Create new user account with auto-generated password
        tempPassword = generateTempPassword();
        const { error: createError } = await supabase.auth.admin.createUser({
          email: request.email,
          password: tempPassword,
          email_confirm: true, // Skip email verification since admin approved
          user_metadata: { full_name: request.name },
        });

        if (createError) {
          console.error("Failed to create user:", createError);
          throw new Error(`Failed to create user account: ${createError.message}`);
        }
        accountCreated = true;
        console.log(`User account created for ${request.email}`);
      } else {
        // User already has an account, just generate a new temp password
        tempPassword = generateTempPassword();
        const { error: updatePwError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { password: tempPassword }
        );

        if (updatePwError) {
          console.error("Failed to update password:", updatePwError);
          // Still send approval email without credentials
          tempPassword = null;
        } else {
          console.log(`Password reset for existing user ${request.email}`);
        }
      }

      // Send approval email with credentials
      const credentialsBlock = tempPassword
        ? `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #166534; margin: 0 0 12px 0;">Your Login Credentials</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #333;">Email:</td>
                  <td style="padding: 6px 0; color: #333;">${escapeHtml(request.email)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #333;">Temporary Password:</td>
                  <td style="padding: 6px 0; font-family: monospace; font-size: 16px; color: #166534; font-weight: bold;">${escapeHtml(tempPassword)}</td>
                </tr>
              </table>
              <p style="color: #666; font-size: 13px; margin: 12px 0 0 0;">Please change your password after your first login.</p>
            </div>
          `
        : `<p style="color: #666;">You can log in with your existing account credentials.</p>`;

      const emailResponse = await resend.emails.send({
        from: "VitaSignal <cs@ezlearning.center>",
        to: [request.email],
        subject: "Your VitaSignal Demo Access Has Been Approved",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #10b981; margin: 0;">Welcome to VitaSignal</h2>
              <p style="color: #666; margin-top: 4px;">Clinical Intelligence Platform</p>
            </div>
            
            <p>Hi ${safeName},</p>
            <p>Your request to access the VitaSignal technology demonstration has been <strong style="color: #10b981;">approved</strong>.</p>
            
            ${credentialsBlock}
            
            <p>You now have access to:</p>
            <ul style="color: #333; line-height: 1.8;">
              <li>Interactive clinical intelligence dashboard</li>
              <li>Patent-protected AI risk analysis</li>
              <li>Clinical workflow simulations</li>
              <li>Real-time predictive analytics</li>
            </ul>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${dashboardUrl}/auth" 
                 style="background-color: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Sign In to Demo Dashboard
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">If the button above doesn't work, copy and paste this link:<br>
              <a href="${dashboardUrl}/auth" style="color: #10b981;">${dashboardUrl}/auth</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="color: #999; font-size: 12px;">
              This is a research prototype demonstration. Not FDA cleared. Not for clinical use. 
              Questions? Contact <a href="mailto:info@alexiscollier.com" style="color: #10b981;">info@alexiscollier.com</a>
            </p>
          </div>
        `,
      });

      console.log("Approval email with credentials sent:", emailResponse);

      return new Response(
        JSON.stringify({
          success: true,
          accountCreated,
          emailSent: true,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Handle denial
    if (action === "denied") {
      const emailResponse = await resend.emails.send({
        from: "VitaSignal <cs@ezlearning.center>",
        to: [request.email],
        subject: "Update on Your Demo Access Request",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h2>VitaSignal</h2>
            <p>Hi ${safeName},</p>
            <p>Thank you for your interest in VitaSignal's technology demonstration.</p>
            <p>After reviewing your request, we're unable to grant access at this time.</p>
            <p>If you have questions, please contact us at <a href="mailto:info@alexiscollier.com">info@alexiscollier.com</a>.</p>
            <p style="margin-top: 30px;">Best regards,<br>Dr. Alexis Collier<br>VitaSignal</p>
          </div>
        `,
      });

      console.log("Denial email sent:", emailResponse);

      return new Response(
        JSON.stringify({ success: true, emailSent: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in approve-demo-access:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
