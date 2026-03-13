import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

function generateTempPassword(): string {
  const bytes = new Uint8Array(18)
  crypto.getRandomValues(bytes)
  const base64 = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, 'A')
    .replace(/\//g, 'B')
    .replace(/=/g, '')
  const specials = '!@#$%&*'
  const extraBytes = new Uint8Array(2)
  crypto.getRandomValues(extraBytes)
  return base64.substring(0, 16) + specials[extraBytes[0] % specials.length] + String(extraBytes[1] % 10)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify the calling user is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const anonClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!)
    const { data: { user: callingUser }, error: authError } = await anonClient.auth.getUser(token)

    if (authError || !callingUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', callingUser.id)
      .eq('role', 'admin')
      .single()

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { requestId, action } = await req.json()

    if (!requestId || !['approved', 'denied'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'requestId and action (approved/denied) are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch the request
    const { data: request, error: fetchError } = await supabase
      .from('walkthrough_access_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !request) {
      return new Response(
        JSON.stringify({ error: 'Request not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update request status
    const { error: updateError } = await supabase
      .from('walkthrough_access_requests')
      .update({
        status: action,
        reviewed_at: new Date().toISOString(),
        reviewed_by: callingUser.id,
      })
      .eq('id', requestId)

    if (updateError) {
      throw new Error(`Failed to update request: ${updateError.message}`)
    }

    if (action === 'approved') {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(
        (u: any) => u.email?.toLowerCase() === request.email.toLowerCase()
      )

      let tempPassword: string | null = null
      let accountCreated = false

      if (!existingUser) {
        tempPassword = generateTempPassword()
        const { error: createError } = await supabase.auth.admin.createUser({
          email: request.email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { full_name: request.name },
        })

        if (createError) {
          console.error('Failed to create user:', createError)
          throw new Error(`Failed to create user account: ${createError.message}`)
        }
        accountCreated = true
      } else {
        tempPassword = generateTempPassword()
        const { error: updatePwError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { password: tempPassword }
        )
        if (updatePwError) {
          console.error('Failed to update password:', updatePwError)
          tempPassword = null
        }
      }

      // Send approval email via queue
      const { error: emailError } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          template: 'demo-approved',
          to: request.email,
          data: {
            name: request.name,
            email: request.email,
            tempPassword,
            accountCreated,
          },
        },
      })

      if (emailError) {
        console.error('Failed to queue approval email:', emailError)
      }

      return new Response(
        JSON.stringify({ success: true, accountCreated, emailSent: !emailError }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle denial
    if (action === 'denied') {
      const { error: emailError } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          template: 'demo-denied',
          to: request.email,
          data: { name: request.name },
        },
      })

      if (emailError) {
        console.error('Failed to queue denial email:', emailError)
      }

      return new Response(
        JSON.stringify({ success: true, emailSent: !emailError }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in approve-demo-access:', error)
    return new Response(
      JSON.stringify({ error: 'An internal error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
