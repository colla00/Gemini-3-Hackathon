import { createClient } from 'npm:@supabase/supabase-js@2'

const PATENT_ATTORNEY_EMAIL = Deno.env.get('PATENT_ATTORNEY_EMAIL') || 'info@vitasignal.ai'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface AttorneyNotificationRequest {
  notificationType: 'new_attestation' | 'multi_witness_complete' | 'screenshot_upload'
  witnessName?: string
  witnessTitle?: string
  organization?: string | null
  claimsCount?: number
  attestedAt?: string
  groupId?: string
  witnessCount?: number
  claimNumber?: number
  screenshotCount?: number
  documentHash: string
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
    const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
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

    const payload: AttorneyNotificationRequest = await req.json()

    const formattedDate = payload.attestedAt
      ? new Date(payload.attestedAt).toLocaleString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
        })
      : new Date().toLocaleString()

    // Use the centralized transactional email system
    const serviceClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { data, error } = await serviceClient.functions.invoke('send-transactional-email', {
      body: {
        template: 'attorney-notification',
        to: PATENT_ATTORNEY_EMAIL,
        data: {
          notificationType: payload.notificationType,
          witnessName: payload.witnessName,
          witnessTitle: payload.witnessTitle,
          organization: payload.organization,
          claimsCount: payload.claimsCount,
          formattedDate,
          documentHash: payload.documentHash,
          groupId: payload.groupId,
          witnessCount: payload.witnessCount,
          claimNumber: payload.claimNumber,
          screenshotCount: payload.screenshotCount,
        },
      },
    })

    if (error) {
      console.error('Failed to send attorney notification via queue:', error)
      throw new Error('Failed to send email')
    }

    console.log('Attorney notification queued successfully:', data)

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error sending attorney notification:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
