import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limit: 5 attestations per hour per IP
const MAX_ATTESTATIONS_PER_HOUR = 5;
const WINDOW_SECONDS = 3600; // 1 hour

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get IP address from various headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    
    let ipAddress = 'unknown';
    if (cfConnectingIp) {
      ipAddress = cfConnectingIp;
    } else if (realIp) {
      ipAddress = realIp;
    } else if (forwardedFor) {
      ipAddress = forwardedFor.split(',')[0].trim();
    }

    console.log(`[check-attestation-rate-limit] Request from IP: ${ipAddress}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Use the existing rate limit function
    const rateLimitKey = `attestation:${ipAddress}`;
    
    const { data: rateLimitResult, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        p_key: rateLimitKey,
        p_max_requests: MAX_ATTESTATIONS_PER_HOUR,
        p_window_seconds: WINDOW_SECONDS
      });

    if (rateLimitError) {
      console.error('[check-attestation-rate-limit] Rate limit check failed:', rateLimitError);
      // On error, allow the request but log it
      return new Response(
        JSON.stringify({ allowed: true, remaining: MAX_ATTESTATIONS_PER_HOUR - 1 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = rateLimitResult as { allowed: boolean; remaining: number; reset_at: number };
    
    if (!result.allowed) {
      console.log(`[check-attestation-rate-limit] Rate limit exceeded for IP: ${ipAddress}`);
      
      // Log the violation
      await supabase.rpc('log_rate_limit_violation', {
        p_key: rateLimitKey,
        p_ip_address: ipAddress,
        p_endpoint: 'attestation'
      });

      return new Response(
        JSON.stringify({
          allowed: false,
          remaining: 0,
          reset_at: result.reset_at,
          message: 'Too many attestation attempts. Please try again later.'
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[check-attestation-rate-limit] Allowed. Remaining: ${result.remaining}`);

    return new Response(
      JSON.stringify({
        allowed: true,
        remaining: result.remaining,
        reset_at: result.reset_at
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[check-attestation-rate-limit] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
