import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Webhook Retry Processor
 * 
 * Called via cron to retry failed webhook deliveries with exponential backoff.
 * After max_attempts, moves to dead_letter status.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Fetch pending/failed deliveries due for retry
    const { data: pendingDeliveries, error: fetchError } = await supabase
      .from("webhook_delivery_log")
      .select("*, fhir_events(payload, resource_type)")
      .in("status", ["pending", "failed"])
      .lte("next_retry_at", new Date().toISOString())
      .lt("attempt_count", 5) // Below max attempts
      .order("next_retry_at", { ascending: true })
      .limit(50);

    if (fetchError) {
      console.error("[Retry] Fetch error:", fetchError.message);
      return new Response(
        JSON.stringify({ error: "Failed to fetch pending deliveries" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!pendingDeliveries || pendingDeliveries.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, message: "No pending deliveries" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Retry] Processing ${pendingDeliveries.length} deliveries`);

    let delivered = 0;
    let failed = 0;
    let deadLettered = 0;

    for (const delivery of pendingDeliveries) {
      const attemptNum = delivery.attempt_count + 1;
      
      try {
        const payload = delivery.fhir_events?.payload;
        if (!payload) {
          // Mark as dead letter if no payload
          await supabase
            .from("webhook_delivery_log")
            .update({
              status: "dead_letter",
              error_message: "No payload found for event",
              last_attempt_at: new Date().toISOString(),
              attempt_count: attemptNum,
            })
            .eq("id", delivery.id);
          deadLettered++;
          continue;
        }

        // Attempt delivery
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(delivery.target_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/fhir+json",
            "X-Retry-Attempt": String(attemptNum),
            "X-Event-Id": delivery.fhir_event_id,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.ok) {
          await supabase
            .from("webhook_delivery_log")
            .update({
              status: "delivered",
              http_status: response.status,
              delivered_at: new Date().toISOString(),
              last_attempt_at: new Date().toISOString(),
              attempt_count: attemptNum,
            })
            .eq("id", delivery.id);
          delivered++;
        } else {
          const responseBody = await response.text().catch(() => "");
          
          if (attemptNum >= delivery.max_attempts) {
            await supabase
              .from("webhook_delivery_log")
              .update({
                status: "dead_letter",
                http_status: response.status,
                response_body: responseBody.slice(0, 1000),
                error_message: `Failed after ${attemptNum} attempts. Last status: ${response.status}`,
                last_attempt_at: new Date().toISOString(),
                attempt_count: attemptNum,
              })
              .eq("id", delivery.id);
            deadLettered++;
          } else {
            // Exponential backoff: 1min, 5min, 15min, 60min
            const backoffMinutes = [1, 5, 15, 60][Math.min(attemptNum - 1, 3)];
            const nextRetry = new Date(Date.now() + backoffMinutes * 60 * 1000);

            await supabase
              .from("webhook_delivery_log")
              .update({
                status: "failed",
                http_status: response.status,
                response_body: responseBody.slice(0, 1000),
                error_message: `HTTP ${response.status}`,
                last_attempt_at: new Date().toISOString(),
                attempt_count: attemptNum,
                next_retry_at: nextRetry.toISOString(),
              })
              .eq("id", delivery.id);
            failed++;
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        
        if (attemptNum >= delivery.max_attempts) {
          await supabase
            .from("webhook_delivery_log")
            .update({
              status: "dead_letter",
              error_message: `Failed after ${attemptNum} attempts. Error: ${errorMsg}`,
              last_attempt_at: new Date().toISOString(),
              attempt_count: attemptNum,
            })
            .eq("id", delivery.id);
          deadLettered++;
        } else {
          const backoffMinutes = [1, 5, 15, 60][Math.min(attemptNum - 1, 3)];
          const nextRetry = new Date(Date.now() + backoffMinutes * 60 * 1000);

          await supabase
            .from("webhook_delivery_log")
            .update({
              status: "failed",
              error_message: errorMsg,
              last_attempt_at: new Date().toISOString(),
              attempt_count: attemptNum,
              next_retry_at: nextRetry.toISOString(),
            })
            .eq("id", delivery.id);
          failed++;
        }
      }
    }

    console.log(`[Retry] Results: ${delivered} delivered, ${failed} failed, ${deadLettered} dead-lettered`);

    return new Response(
      JSON.stringify({
        processed: pendingDeliveries.length,
        delivered,
        failed,
        dead_lettered: deadLettered,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Retry] Error:", error);
    return new Response(
      JSON.stringify({ error: "Retry processing failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
