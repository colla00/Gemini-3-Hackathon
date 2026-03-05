import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

serve(async (req: Request) => {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), { status: 500 });
  }

  const resend = new Resend(resendKey);
  const deckUrl = "https://clinicaldashboard.lovable.app/vitasignal-investor-deck.pdf";

  const { data, error } = await resend.emails.send({
    from: "VitaSignal <cs@ezlearning.center>",
    to: ["info@alexiscollier.com"],
    subject: "VitaSignal Vendor Deck — Executive Financial & Clinical Summary",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #10b981;">VitaSignal — Vendor Deck</h2>
        <p>Here is the latest VitaSignal Executive Financial &amp; Clinical Summary deck for your records.</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
          <a href="${deckUrl}" style="background-color: #10b981; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Download Vendor Deck (PDF)
          </a>
        </div>
        <p style="color: #888; font-size: 12px;">Sent from VitaSignal platform</p>
      </div>
    `,
  });

  if (error) {
    console.error("Email error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, id: data?.id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
