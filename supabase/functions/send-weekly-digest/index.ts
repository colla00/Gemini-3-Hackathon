import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escapeHtml = (str: string): string =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const envRecipient = Deno.env.get("PATENT_ATTORNEY_EMAIL");
    const RECIPIENT = envRecipient && envRecipient.includes("@") ? envRecipient : "info@alexiscollier.com";
    console.log("[Digest] Sending to:", RECIPIENT);

    // Get archives from the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: archives, error: archiveError } = await supabaseAdmin
      .from("site_archives")
      .select("id, page_url, page_title, captured_at, content_hash, trigger_type, metadata")
      .gte("captured_at", sevenDaysAgo)
      .order("page_url", { ascending: true })
      .order("captured_at", { ascending: true });

    if (archiveError) {
      throw new Error(`Failed to fetch archives: ${archiveError.message}`);
    }

    if (!archives || archives.length === 0) {
      console.log("[Digest] No archives captured in the last 7 days, skipping email.");
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "no_archives" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Group by page_url and detect changes
    const pageGroups: Record<string, typeof archives> = {};
    for (const a of archives) {
      const url = a.page_url;
      if (!pageGroups[url]) pageGroups[url] = [];
      pageGroups[url].push(a);
    }

    // For each page, also fetch the last snapshot BEFORE the 7-day window to detect the first change
    const pageSummaries: {
      url: string;
      title: string;
      captures: number;
      changes: number;
      firstCapture: string;
      lastCapture: string;
    }[] = [];

    for (const [url, snapshots] of Object.entries(pageGroups)) {
      // Get the most recent snapshot before the window for baseline comparison
      const { data: baseline } = await supabaseAdmin
        .from("site_archives")
        .select("content_hash")
        .eq("page_url", url)
        .lt("captured_at", sevenDaysAgo)
        .order("captured_at", { ascending: false })
        .limit(1);

      let changes = 0;
      let prevHash = baseline?.[0]?.content_hash || null;

      for (const snap of snapshots) {
        if (prevHash && snap.content_hash !== prevHash) {
          changes++;
        }
        prevHash = snap.content_hash;
      }

      pageSummaries.push({
        url,
        title: snapshots[snapshots.length - 1].page_title || url,
        captures: snapshots.length,
        changes,
        firstCapture: snapshots[0].captured_at,
        lastCapture: snapshots[snapshots.length - 1].captured_at,
      });
    }

    const totalCaptures = archives.length;
    const totalChanges = pageSummaries.reduce((s, p) => s + p.changes, 0);
    const pagesWithChanges = pageSummaries.filter((p) => p.changes > 0);
    const weekStart = new Date(sevenDaysAgo).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const weekEnd = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const subject = totalChanges > 0
      ? `📊 Weekly Digest: ${totalChanges} content change${totalChanges > 1 ? "s" : ""} detected (${weekStart} – ${weekEnd})`
      : `📊 Weekly Digest: No content changes (${weekStart} – ${weekEnd})`;

    const pageRowsHtml = pageSummaries
      .sort((a, b) => b.changes - a.changes)
      .map(
        (p) => `
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid #e5e7eb;">
            <strong>${escapeHtml(p.title)}</strong>
            <br><span style="color:#6b7280; font-size:12px;">${escapeHtml(p.url)}</span>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid #e5e7eb; text-align:center;">${p.captures}</td>
          <td style="padding:10px 12px; border-bottom:1px solid #e5e7eb; text-align:center;">
            <span style="color:${p.changes > 0 ? "#dc2626" : "#16a34a"}; font-weight:600;">${p.changes}</span>
          </td>
        </tr>`
      )
      .join("");

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; max-width:640px; margin:0 auto; background:#ffffff;">
        <div style="background:#0f172a; padding:24px 32px;">
          <h1 style="color:#ffffff; margin:0; font-size:20px;">VitaSignal™ Site Archive Digest</h1>
          <p style="color:#94a3b8; margin:6px 0 0; font-size:14px;">${weekStart} – ${weekEnd}</p>
        </div>

        <div style="padding:24px 32px;">
          <div style="display:flex; gap:16px; margin-bottom:24px;">
            <div style="background:#f0f9ff; border-radius:8px; padding:16px; flex:1; text-align:center;">
              <div style="font-size:28px; font-weight:700; color:#0f172a;">${totalCaptures}</div>
              <div style="font-size:12px; color:#6b7280;">Snapshots</div>
            </div>
            <div style="background:${totalChanges > 0 ? "#fef2f2" : "#f0fdf4"}; border-radius:8px; padding:16px; flex:1; text-align:center;">
              <div style="font-size:28px; font-weight:700; color:${totalChanges > 0 ? "#dc2626" : "#16a34a"};">${totalChanges}</div>
              <div style="font-size:12px; color:#6b7280;">Content Changes</div>
            </div>
            <div style="background:#f0f9ff; border-radius:8px; padding:16px; flex:1; text-align:center;">
              <div style="font-size:28px; font-weight:700; color:#0f172a;">${pageSummaries.length}</div>
              <div style="font-size:12px; color:#6b7280;">Pages Monitored</div>
            </div>
          </div>

          ${pagesWithChanges.length > 0 ? `
          <div style="background:#fef2f2; border-left:4px solid #dc2626; padding:12px 16px; margin-bottom:20px; border-radius:0 8px 8px 0;">
            <strong style="color:#dc2626;">⚠ Content drift detected</strong>
            <p style="margin:4px 0 0; color:#6b7280; font-size:13px;">
              ${pagesWithChanges.length} page${pagesWithChanges.length > 1 ? "s" : ""} had content changes this week. Review in the Admin panel → Site Archives → Changelog.
            </p>
          </div>` : `
          <div style="background:#f0fdf4; border-left:4px solid #16a34a; padding:12px 16px; margin-bottom:20px; border-radius:0 8px 8px 0;">
            <strong style="color:#16a34a;">✓ No content drift</strong>
            <p style="margin:4px 0 0; color:#6b7280; font-size:13px;">All monitored pages remained unchanged this week.</p>
          </div>`}

          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <thead>
              <tr style="background:#f8fafc;">
                <th style="padding:10px 12px; text-align:left; border-bottom:2px solid #e5e7eb; color:#374151;">Page</th>
                <th style="padding:10px 12px; text-align:center; border-bottom:2px solid #e5e7eb; color:#374151;">Captures</th>
                <th style="padding:10px 12px; text-align:center; border-bottom:2px solid #e5e7eb; color:#374151;">Changes</th>
              </tr>
            </thead>
            <tbody>
              ${pageRowsHtml}
            </tbody>
          </table>

          <p style="color:#9ca3af; font-size:11px; margin-top:32px; text-align:center;">
            Automated weekly digest from VitaSignal™ Site Archive System.<br>
            Generated ${new Date().toISOString()}
          </p>
        </div>
      </div>
    `;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VitaSignal Archives <notifications@resend.dev>",
        to: [RECIPIENT],
        subject,
        html,
      }),
    });

    const emailResult = await emailRes.json();

    if (!emailRes.ok) {
      console.error("[Digest] Resend API error:", emailResult);
      throw new Error(`Resend API error: ${JSON.stringify(emailResult)}`);
    }

    console.log("[Digest] Email sent successfully:", emailResult.id);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: emailResult.id,
        summary: { totalCaptures, totalChanges, pagesMonitored: pageSummaries.length },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Digest] Error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
