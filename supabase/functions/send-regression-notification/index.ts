import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

interface RegressionAlert {
  metric: string;
  baseline: number;
  current: number;
  degradation: number;
  severity: 'warning' | 'critical';
  timestamp: number;
}

interface NotificationRequest {
  alerts: RegressionAlert[];
  projectName?: string;
  dashboardUrl?: string;
  notifyEmail?: string;
  notifySlack?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - missing or invalid authorization header" }),
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
      console.error("[Auth] Token validation failed:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;
    console.log("[Auth] Authenticated user:", userId);

    const { alerts, projectName, dashboardUrl, notifyEmail, notifySlack }: NotificationRequest = await req.json();

    if (!alerts || alerts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No alerts provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    const warningAlerts = alerts.filter(a => a.severity === 'warning');
    
    const results: { email?: boolean; slack?: boolean } = {};

    // Format alert message
    const formatAlerts = (alerts: RegressionAlert[]): string => {
      return alerts.map(a => {
        const formatValue = (v: number) => a.metric === 'Memory Usage' 
          ? `${(v / 1024 / 1024).toFixed(1)}MB`
          : `${v.toFixed(2)}ms`;
        return `• ${escapeHtml(a.metric)}: ${formatValue(a.baseline)} → ${formatValue(a.current)} (+${a.degradation.toFixed(1)}%)`;
      }).join('\n');
    };

    // Build notification content
    const safeProjectName = projectName ? escapeHtml(projectName) : '';
    const subject = criticalAlerts.length > 0
      ? `🚨 Critical Performance Regression${safeProjectName ? ` - ${safeProjectName}` : ''}`
      : `⚠️ Performance Warning${safeProjectName ? ` - ${safeProjectName}` : ''}`;

    const body = `
Performance Regression Detected
===============================

${criticalAlerts.length > 0 ? `
CRITICAL (${criticalAlerts.length}):
${formatAlerts(criticalAlerts)}
` : ''}
${warningAlerts.length > 0 ? `
WARNINGS (${warningAlerts.length}):
${formatAlerts(warningAlerts)}
` : ''}

Time: ${new Date().toISOString()}
${dashboardUrl ? `Dashboard: ${dashboardUrl}` : ''}

---
This is an automated notification from the Performance Monitoring System.
    `.trim();

    // Send email notification (using Resend if available)
    if (notifyEmail) {
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      
      if (RESEND_API_KEY) {
        try {
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Performance Monitor <notifications@resend.dev>",
              to: [notifyEmail],
              subject,
              text: body,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: ${criticalAlerts.length > 0 ? '#dc2626' : '#d97706'};">
                    ${subject}
                  </h2>
                  
                  ${criticalAlerts.length > 0 ? `
                  <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px 16px; margin: 16px 0;">
                    <strong style="color: #dc2626;">Critical Regressions (${criticalAlerts.length})</strong>
                    <ul style="margin: 8px 0; padding-left: 20px;">
                      ${criticalAlerts.map(a => `
                        <li style="margin: 4px 0;">
                          <strong>${escapeHtml(a.metric)}</strong>: 
                          ${a.metric === 'Memory Usage' ? `${(a.baseline / 1024 / 1024).toFixed(1)}MB → ${(a.current / 1024 / 1024).toFixed(1)}MB` : `${a.baseline.toFixed(2)}ms → ${a.current.toFixed(2)}ms`}
                          <span style="color: #dc2626;">(+${a.degradation.toFixed(1)}%)</span>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                  ` : ''}
                  
                  ${warningAlerts.length > 0 ? `
                  <div style="background: #fffbeb; border-left: 4px solid #d97706; padding: 12px 16px; margin: 16px 0;">
                    <strong style="color: #d97706;">Warnings (${warningAlerts.length})</strong>
                    <ul style="margin: 8px 0; padding-left: 20px;">
                      ${warningAlerts.map(a => `
                        <li style="margin: 4px 0;">
                          <strong>${escapeHtml(a.metric)}</strong>: 
                          ${a.metric === 'Memory Usage' ? `${(a.baseline / 1024 / 1024).toFixed(1)}MB → ${(a.current / 1024 / 1024).toFixed(1)}MB` : `${a.baseline.toFixed(2)}ms → ${a.current.toFixed(2)}ms`}
                          <span style="color: #d97706;">(+${a.degradation.toFixed(1)}%)</span>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                  ` : ''}
                  
                  <p style="color: #666; font-size: 12px; margin-top: 24px;">
                    Detected at ${new Date().toLocaleString()}
                    ${dashboardUrl ? `<br><a href="${dashboardUrl}" style="color: #2563eb;">View Dashboard →</a>` : ''}
                  </p>
                </div>
              `,
            }),
          });

          results.email = emailResponse.ok;
        } catch (error) {
          console.error("Email notification failed:", error);
          results.email = false;
        }
      } else {
        console.warn("RESEND_API_KEY not configured, skipping email notification");
        results.email = false;
      }
    }

    // Send Slack notification
    if (notifySlack) {
      try {
        const slackResponse = await fetch(notifySlack, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: subject,
            blocks: [
              {
                type: "header",
                text: {
                  type: "plain_text",
                  text: subject,
                  emoji: true,
                },
              },
              ...(criticalAlerts.length > 0 ? [{
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*🚨 Critical Regressions (${criticalAlerts.length})*\n${criticalAlerts.map(a => 
                    `• *${a.metric}*: \`${a.baseline.toFixed(2)}ms\` → \`${a.current.toFixed(2)}ms\` (+${a.degradation.toFixed(1)}%)`
                  ).join('\n')}`,
                },
              }] : []),
              ...(warningAlerts.length > 0 ? [{
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*⚠️ Warnings (${warningAlerts.length})*\n${warningAlerts.map(a => 
                    `• *${a.metric}*: \`${a.baseline.toFixed(2)}ms\` → \`${a.current.toFixed(2)}ms\` (+${a.degradation.toFixed(1)}%)`
                  ).join('\n')}`,
                },
              }] : []),
              {
                type: "context",
                elements: [
                  {
                    type: "mrkdwn",
                    text: `Detected at ${new Date().toLocaleString()}${dashboardUrl ? ` | <${dashboardUrl}|View Dashboard>` : ''}`,
                  },
                ],
              },
            ],
          }),
        });

        results.slack = slackResponse.ok;
      } catch (error) {
        console.error("Slack notification failed:", error);
        results.slack = false;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        alertsSent: {
          critical: criticalAlerts.length,
          warning: warningAlerts.length,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Notification error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
