import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface WitnessInvitationRequest {
  witnessEmail: string
  witnessName: string
  invitedBy: string
  invitationToken: string
  documentHash: string
  expiresAt: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const {
      witnessEmail,
      witnessName,
      invitedBy,
      invitationToken,
      documentHash,
      expiresAt,
    }: WitnessInvitationRequest = await req.json()

    const inviteLink = `https://vitasignal.ai/patent-evidence?key=patent2025&invite=${invitationToken}`

    const formattedExpiry = new Date(expiresAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Use the centralized transactional email system
    const serviceClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { data, error } = await serviceClient.functions.invoke('send-transactional-email', {
      body: {
        template: 'witness-invitation',
        to: witnessEmail,
        data: {
          witnessName,
          invitedBy,
          inviteLink,
          documentHash,
          expiresFormatted: formattedExpiry,
        },
      },
    })

    if (error) {
      console.error('Failed to send witness invitation via queue:', error)
      throw new Error('Failed to send invitation email')
    }

    console.log('Witness invitation queued successfully:', data)

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error sending witness invitation:', error)
    return new Response(
      JSON.stringify({ error: 'An internal error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
