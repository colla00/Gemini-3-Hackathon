import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Configuration
const ALERT_THRESHOLD_TOTAL = 50; // Total violations in time window
const ALERT_THRESHOLD_PER_IP = 10; // Violations per IP to flag as abuse
const ALERT_WINDOW_HOURS = 1; // Time window for checking
const ADMIN_EMAIL = "info@alexiscollier.com";
const DASHBOARD_URL = "https://nso-quality-dashboard.lovable.app";

interface ViolationStats {
  total_violations: number;
  unique_keys: number;
  unique_ips: number;
  by_endpoint: Record<string, number> | null;
  top_offenders: Array<{ ip_address: string; total_violations: number }> | null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Running abuse alert check...");

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get violation stats for the alert window
    const { data: stats, error: statsError } = await supabase.rpc('get_rate_limit_stats', {
      p_hours: ALERT_WINDOW_HOURS
    });

    if (statsError) {
      console.error('Error fetching stats:', statsError);
      throw new Error('Failed to fetch violation stats');
    }

    const violationStats = stats as unknown as ViolationStats;
    console.log('Violation stats:', JSON.stringify(violationStats));

    // Check if we need to send an alert
    const shouldAlert = violationStats.total_violations >= ALERT_THRESHOLD_TOTAL;
    const severeOffenders = violationStats.top_offenders?.filter(
      o => o.total_violations >= ALERT_THRESHOLD_PER_IP
    ) || [];
    const hasSevereOffenders = severeOffenders.length > 0;

    if (!shouldAlert && !hasSevereOffenders) {
      console.log('No alert needed. Total violations:', violationStats.total_violations);
      return new Response(
        JSON.stringify({ 
          alert_sent: false, 
          reason: 'Below threshold',
          total_violations: violationStats.total_violations
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Build alert email
    const alertLevel = violationStats.total_violations >= ALERT_THRESHOLD_TOTAL * 2 ? 'CRITICAL' : 'WARNING';
    const timestamp = new Date().toISOString();

    const endpointBreakdown = violationStats.by_endpoint 
      ? Object.entries(violationStats.by_endpoint)
          .map(([endpoint, count]) => `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">${endpoint}</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${count}</td></tr>`)
          .join('')
      : '<tr><td colspan="2" style="padding: 8px; color: #888;">No endpoint data</td></tr>';

    const offendersList = severeOffenders.length > 0
      ? severeOffenders
          .slice(0, 10)
          .map((o, i) => `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">#${i + 1}</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><code>${o.ip_address || 'Unknown'}</code></td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #dc2626;">${o.total_violations}</td></tr>`)
          .join('')
      : '<tr><td colspan="3" style="padding: 8px; color: #888;">No severe offenders</td></tr>';

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${alertLevel === 'CRITICAL' ? '#dc2626' : '#f59e0b'}; color: white; padding: 16px 24px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🚨 ${alertLevel}: Rate Limit Abuse Detected</h1>
        </div>
        
        <div style="background-color: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 16px 0; color: #374151;">
            Unusual rate limit activity has been detected on the NSO Quality Dashboard.
          </p>
          
          <div style="background-color: white; border-radius: 8px; padding: 16px; margin-bottom: 16px; border: 1px solid #e5e7eb;">
            <h3 style="margin: 0 0 12px 0; color: #111827;">Summary (Last ${ALERT_WINDOW_HOURS} hour${ALERT_WINDOW_HOURS > 1 ? 's' : ''})</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Total Violations:</td>
                <td style="padding: 8px 0; text-align: right; font-size: 24px; font-weight: bold; color: #dc2626;">${violationStats.total_violations}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Unique IPs:</td>
                <td style="padding: 8px 0; text-align: right; font-size: 18px; font-weight: bold;">${violationStats.unique_ips}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Severe Offenders:</td>
                <td style="padding: 8px 0; text-align: right; font-size: 18px; font-weight: bold; color: ${severeOffenders.length > 0 ? '#dc2626' : '#10b981'};">${severeOffenders.length}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: white; border-radius: 8px; padding: 16px; margin-bottom: 16px; border: 1px solid #e5e7eb;">
            <h3 style="margin: 0 0 12px 0; color: #111827;">Violations by Endpoint</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${endpointBreakdown}
            </table>
          </div>

          ${severeOffenders.length > 0 ? `
          <div style="background-color: white; border-radius: 8px; padding: 16px; margin-bottom: 16px; border: 1px solid #e5e7eb;">
            <h3 style="margin: 0 0 12px 0; color: #dc2626;">⚠️ Severe Offenders (${ALERT_THRESHOLD_PER_IP}+ violations)</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f9fafb;">
                  <th style="padding: 8px; text-align: left; font-size: 12px; color: #6b7280;">Rank</th>
                  <th style="padding: 8px; text-align: left; font-size: 12px; color: #6b7280;">IP Address</th>
                  <th style="padding: 8px; text-align: right; font-size: 12px; color: #6b7280;">Violations</th>
                </tr>
              </thead>
              <tbody>
                ${offendersList}
              </tbody>
            </table>
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 24px;">
            <a href="${DASHBOARD_URL}/admin" 
               style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              View Admin Dashboard
            </a>
          </div>

          <p style="margin: 24px 0 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
            Alert generated at ${timestamp}<br>
            NSO Quality Dashboard - Automated Security Monitoring
          </p>
        </div>
      </div>
    `;

    // Send alert email
    const emailResponse = await resend.emails.send({
      from: "NSO Quality Dashboard <cs@ezlearning.center>",
      to: [ADMIN_EMAIL],
      subject: `🚨 ${alertLevel}: Rate Limit Abuse Detected - ${violationStats.total_violations} violations`,
      html: emailHtml,
    });

    console.log("Alert email sent:", emailResponse);

    return new Response(
      JSON.stringify({ 
        alert_sent: true, 
        alert_level: alertLevel,
        total_violations: violationStats.total_violations,
        severe_offenders: severeOffenders.length,
        email_response: emailResponse
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in check-abuse-alerts:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", code: "INTERNAL_ERROR" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);