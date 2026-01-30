import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuditLogRequest {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get IP address from various headers (Cloudflare, standard proxies, direct)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    
    // Priority: CF > X-Real-IP > X-Forwarded-For (first IP) > unknown
    let ipAddress = 'unknown';
    if (cfConnectingIp) {
      ipAddress = cfConnectingIp;
    } else if (realIp) {
      ipAddress = realIp;
    } else if (forwardedFor) {
      // X-Forwarded-For can contain multiple IPs, take the first (client)
      ipAddress = forwardedFor.split(',')[0].trim();
    }

    console.log(`[log-audit] Request from IP: ${ipAddress}`);

    // Get authorization header for user context
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[log-audit] No authorization header');
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Client for getting user info
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    
    if (userError || !user) {
      console.error('[log-audit] User auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[log-audit] User: ${user.email} (${user.id})`);

    // Parse request body
    const body: AuditLogRequest = await req.json();
    
    if (!body.action || !body.resource_type) {
      console.error('[log-audit] Missing required fields');
      return new Response(
        JSON.stringify({ error: 'action and resource_type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role client to insert (bypasses RLS for staff users)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Insert audit log with IP address
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        user_id: user.id,
        user_email: user.email,
        action: body.action,
        resource_type: body.resource_type,
        resource_id: body.resource_id || null,
        details: body.details || null,
        ip_address: ipAddress,
      })
      .select()
      .single();

    if (error) {
      console.error('[log-audit] Insert error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to log audit entry', code: 'INSERT_ERROR' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[log-audit] Audit log created: ${data.id}`);

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[log-audit] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
