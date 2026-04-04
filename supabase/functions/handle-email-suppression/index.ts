import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

/**
 * handle-email-suppression
 *
 * Webhook receiver for email delivery events (bounced, complained, delivered).
 * Called by the Lovable email infrastructure (Go API) when the downstream
 * provider reports a delivery event.
 *
 * - Bounces & complaints → upsert into suppressed_emails + update email_send_log
 * - Delivered events → update email_send_log status to 'delivered'
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const body = await req.json()
    const { event_type, email, message_id, reason, metadata } = body as {
      event_type: string
      email?: string
      message_id?: string
      reason?: string
      metadata?: Record<string, unknown>
    }

    if (!event_type) {
      return new Response(
        JSON.stringify({ error: 'Missing event_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Email suppression event received', { event_type, email, message_id, reason })

    // Map event types to email_send_log statuses
    const statusMap: Record<string, string> = {
      bounced: 'bounced',
      complained: 'complained',
      delivered: 'delivered',
      failed: 'failed',
    }

    const logStatus = statusMap[event_type]

    // Update email_send_log if we have a message_id
    if (message_id && logStatus) {
      await supabase.from('email_send_log').insert({
        message_id,
        template_name: 'delivery-event',
        recipient_email: email || 'unknown',
        status: logStatus,
        error_message: reason || null,
        metadata: metadata || null,
      })
    }

    // For bounces and complaints, also add to suppression list
    if ((event_type === 'bounced' || event_type === 'complained') && email) {
      const { error: suppressError } = await supabase
        .from('suppressed_emails')
        .upsert(
          {
            email,
            reason: event_type,
            metadata: { message_id, reason, received_at: new Date().toISOString(), ...metadata },
          },
          { onConflict: 'email' }
        )

      if (suppressError) {
        console.error('Failed to upsert suppressed email', { email, error: suppressError })
      }
    }

    return new Response(
      JSON.stringify({ success: true, event_type }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('handle-email-suppression error', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
