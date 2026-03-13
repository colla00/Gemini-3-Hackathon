import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const token = url.searchParams.get('token')

    if (!token) {
      return new Response(html('Invalid unsubscribe link.', false), {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Look up the token
    const { data: tokenRecord } = await supabase
      .from('email_unsubscribe_tokens')
      .select('email, used_at')
      .eq('token', token)
      .maybeSingle()

    if (!tokenRecord) {
      return new Response(html('Invalid or expired unsubscribe link.', false), {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      })
    }

    if (tokenRecord.used_at) {
      return new Response(html('You have already been unsubscribed.', true), {
        headers: { 'Content-Type': 'text/html' },
      })
    }

    // Mark token as used
    await supabase
      .from('email_unsubscribe_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token)

    // Add to suppression list
    await supabase.from('suppressed_emails').insert({
      email: tokenRecord.email.toLowerCase(),
      reason: 'unsubscribe',
      metadata: { token, unsubscribed_at: new Date().toISOString() },
    })

    return new Response(html('You have been successfully unsubscribed from VitaSignal emails.', true), {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return new Response(html('An error occurred. Please try again later.', false), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    })
  }
})

function html(message: string, success: boolean): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Unsubscribe — VitaSignal</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #f7f8fa; margin: 0; padding: 40px 20px; }
    .card { background: #fff; max-width: 480px; margin: 0 auto; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); text-align: center; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { color: hsl(222, 47%, 11%); font-size: 20px; margin: 0 0 12px; }
    p { color: hsl(220, 9%, 40%); font-size: 15px; line-height: 1.6; margin: 0; }
    .brand { color: hsl(173, 58%, 29%); font-weight: 700; margin-top: 24px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? '✓' : '⚠️'}</div>
    <h1>${success ? 'Unsubscribed' : 'Error'}</h1>
    <p>${message}</p>
    <p class="brand">VitaSignal™</p>
  </div>
</body>
</html>`
}
