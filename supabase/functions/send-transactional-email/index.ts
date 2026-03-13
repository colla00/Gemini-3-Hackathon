import { createClient } from 'npm:@supabase/supabase-js@2'
import { render } from 'npm:@react-email/render@0.0.12'
import ContactConfirmation from '../_shared/email-templates/contact-confirmation.tsx'
import Welcome from '../_shared/email-templates/welcome.tsx'
import BookingConfirmation from '../_shared/email-templates/booking-confirmation.tsx'
import LicensingConfirmation from '../_shared/email-templates/licensing-confirmation.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SENDER_DOMAIN = 'notify.www.vitasignal.ai'
const FROM_ADDRESS = `VitaSignal <info@${SENDER_DOMAIN}>`
const SITE_URL = 'https://vitasignal.ai'

type TemplateName = 'contact-confirmation' | 'welcome' | 'booking-confirmation' | 'licensing-confirmation'

interface EmailRequest {
  template: TemplateName
  to: string
  data?: Record<string, unknown>
}

function renderTemplate(template: TemplateName, data: Record<string, unknown>): { subject: string; html: string } {
  switch (template) {
    case 'contact-confirmation': {
      const html = render(ContactConfirmation({
        name: (data.name as string) || '',
        inquiryType: (data.inquiryType as string) || 'general',
        siteUrl: SITE_URL,
      }))
      return { subject: 'VitaSignal — We\'ve received your inquiry', html }
    }
    case 'welcome': {
      const html = render(Welcome({
        name: (data.name as string) || '',
        siteUrl: SITE_URL,
      }))
      return { subject: 'Welcome to VitaSignal', html }
    }
    case 'booking-confirmation': {
      const html = render(BookingConfirmation({
        name: (data.name as string) || '',
        bookingDate: (data.bookingDate as string) || '',
        bookingTime: (data.bookingTime as string) || '',
        bookingType: (data.bookingType as string) || 'consultation',
        siteUrl: SITE_URL,
      }))
      return { subject: 'VitaSignal — Booking Confirmed', html }
    }
    case 'licensing-confirmation': {
      const html = render(LicensingConfirmation({
        contactName: (data.contactName as string) || '',
        organizationName: (data.organizationName as string) || '',
        organizationType: (data.organizationType as string) || '',
        siteUrl: SITE_URL,
      }))
      return { subject: `VitaSignal — Licensing Inquiry Received`, html }
    }
    default:
      throw new Error(`Unknown template: ${template}`)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body: EmailRequest = await req.json()
    const { template, to, data = {} } = body

    if (!template || !to) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: template, to' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check suppression list
    const { data: suppressed } = await supabase
      .from('suppressed_emails')
      .select('id')
      .eq('email', to.toLowerCase())
      .maybeSingle()

    if (suppressed) {
      // Log suppression
      await supabase.from('email_send_log').insert({
        message_id: crypto.randomUUID(),
        template_name: template,
        recipient_email: to,
        status: 'suppressed',
        error_message: 'Recipient is on suppression list',
      })
      return new Response(
        JSON.stringify({ success: true, suppressed: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate unsubscribe token
    let unsubscribeToken: string
    const { data: existingToken } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', to.toLowerCase())
      .maybeSingle()

    if (existingToken) {
      unsubscribeToken = existingToken.token
    } else {
      unsubscribeToken = crypto.randomUUID()
      await supabase.from('email_unsubscribe_tokens').insert({
        email: to.toLowerCase(),
        token: unsubscribeToken,
      })
    }

    const unsubscribeUrl = `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${unsubscribeToken}`

    // Render template
    const { subject, html: rawHtml } = renderTemplate(template, data)
    // Replace unsubscribe placeholder
    const html = rawHtml.replace(/\{\{\{unsubscribeUrl\}\}\}/g, unsubscribeUrl)

    const messageId = crypto.randomUUID()

    // Enqueue to transactional_emails queue
    const { error: enqueueError } = await supabase.rpc('enqueue_email', {
      queue_name: 'transactional_emails',
      payload: {
        message_id: messageId,
        to: to,
        from: FROM_ADDRESS,
        sender_domain: SENDER_DOMAIN,
        subject,
        html,
        purpose: 'transactional',
        label: template,
        idempotency_key: `${template}-${to}-${Date.now()}`,
        unsubscribe_token: unsubscribeToken,
        queued_at: new Date().toISOString(),
      },
    })

    if (enqueueError) {
      throw new Error(`Failed to enqueue email: ${enqueueError.message}`)
    }

    // Log pending
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: template,
      recipient_email: to,
      status: 'pending',
    })

    return new Response(
      JSON.stringify({ success: true, message_id: messageId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Transactional email error:', msg)
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
