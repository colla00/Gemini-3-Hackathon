import { createClient } from 'npm:@supabase/supabase-js@2'
import { render } from 'npm:@react-email/render@0.0.12'
import ContactConfirmation from '../_shared/email-templates/contact-confirmation.tsx'
import Welcome from '../_shared/email-templates/welcome.tsx'
import BookingConfirmation from '../_shared/email-templates/booking-confirmation.tsx'
import LicensingConfirmation from '../_shared/email-templates/licensing-confirmation.tsx'
import PilotRequestConfirmation from '../_shared/email-templates/pilot-request-confirmation.tsx'
import DemoApproved from '../_shared/email-templates/demo-approved.tsx'
import DemoDenied from '../_shared/email-templates/demo-denied.tsx'
import CareerInterest from '../_shared/email-templates/career-interest.tsx'
import WitnessInvitation from '../_shared/email-templates/witness-invitation.tsx'
import AttorneyNotification from '../_shared/email-templates/attorney-notification.tsx'
import AccountStatusUpdate from '../_shared/email-templates/account-status-update.tsx'
import PaymentConfirmation from '../_shared/email-templates/payment-confirmation.tsx'
import ReportReady from '../_shared/email-templates/report-ready.tsx'
import Reminder from '../_shared/email-templates/reminder.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SENDER_DOMAIN = 'notify.vitasignal.ai'
const FROM_ADDRESS = `VitaSignal <info@${SENDER_DOMAIN}>`
const SITE_URL = 'https://vitasignal.ai'

type TemplateName =
  | 'contact-confirmation'
  | 'welcome'
  | 'booking-confirmation'
  | 'licensing-confirmation'
  | 'pilot-request-confirmation'
  | 'demo-approved'
  | 'demo-denied'
  | 'career-interest'
  | 'witness-invitation'
  | 'attorney-notification'
  | 'account-status-update'
  | 'payment-confirmation'
  | 'report-ready'
  | 'reminder'

interface EmailRequest {
  template: TemplateName
  to: string
  data?: Record<string, unknown>
}

function stripHtmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
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
      return { subject: 'VitaSignal — Licensing Inquiry Received', html }
    }
    case 'pilot-request-confirmation': {
      const html = render(PilotRequestConfirmation({
        name: (data.name as string) || '',
        organization: (data.organization as string) || '',
        siteUrl: SITE_URL,
      }))
      return { subject: 'VitaSignal — Pilot Request Received', html }
    }
    case 'demo-approved': {
      const html = render(DemoApproved({
        name: (data.name as string) || '',
        email: (data.email as string) || '',
        tempPassword: (data.tempPassword as string) || null,
        accountCreated: (data.accountCreated as boolean) || false,
        siteUrl: SITE_URL,
      }))
      return { subject: 'Your VitaSignal Demo Access Has Been Approved', html }
    }
    case 'demo-denied': {
      const html = render(DemoDenied({
        name: (data.name as string) || '',
        siteUrl: SITE_URL,
      }))
      return { subject: 'Update on Your Demo Access Request', html }
    }
    case 'career-interest': {
      const html = render(CareerInterest({
        name: (data.name as string) || '',
        role: (data.role as string) || '',
        email: (data.email as string) || '',
        siteUrl: SITE_URL,
      }))
      return { subject: 'VitaSignal — We received your interest', html }
    }
    case 'witness-invitation': {
      const html = render(WitnessInvitation({
        witnessName: (data.witnessName as string) || '',
        invitedBy: (data.invitedBy as string) || '',
        inviteLink: (data.inviteLink as string) || '',
        documentHash: (data.documentHash as string) || '',
        expiresFormatted: (data.expiresFormatted as string) || '',
        siteUrl: SITE_URL,
      }))
      return { subject: 'Witness Attestation Request — Patent Evidence Documentation', html }
    }
    case 'attorney-notification': {
      const notifType = (data.notificationType as string) || 'new_attestation'
      let subject = 'Patent Evidence Notification'
      if (notifType === 'new_attestation') subject = `New Patent Attestation — ${data.witnessName || 'Unknown'}`
      else if (notifType === 'multi_witness_complete') subject = `Multi-Witness Attestation Complete — ${data.witnessCount || 0} Witnesses`
      else if (notifType === 'screenshot_upload') subject = `New Evidence Screenshot — Claim ${data.claimNumber || 0}`

      const html = render(AttorneyNotification({
        notificationType: notifType as 'new_attestation' | 'multi_witness_complete' | 'screenshot_upload',
        witnessName: (data.witnessName as string) || undefined,
        witnessTitle: (data.witnessTitle as string) || undefined,
        organization: (data.organization as string) || null,
        claimsCount: (data.claimsCount as number) || undefined,
        formattedDate: (data.formattedDate as string) || new Date().toLocaleString(),
        documentHash: (data.documentHash as string) || '',
        groupId: (data.groupId as string) || undefined,
        witnessCount: (data.witnessCount as number) || undefined,
        claimNumber: (data.claimNumber as number) || undefined,
        screenshotCount: (data.screenshotCount as number) || undefined,
        siteUrl: SITE_URL,
      }))
      return { subject, html }
    }
    case 'account-status-update': {
      const status = (data.status as string) || 'updated'
      const displayStatus = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      const html = render(AccountStatusUpdate({
        name: (data.name as string) || '',
        status,
        reason: (data.reason as string) || undefined,
        siteUrl: SITE_URL,
      }))
      return { subject: `VitaSignal — Account ${displayStatus}`, html }
    }
    case 'payment-confirmation': {
      const html = render(PaymentConfirmation({
        name: (data.name as string) || '',
        amount: (data.amount as string) || '',
        description: (data.description as string) || '',
        transactionId: (data.transactionId as string) || undefined,
        date: (data.date as string) || undefined,
        siteUrl: SITE_URL,
      }))
      return { subject: 'VitaSignal — Payment Confirmed', html }
    }
    case 'report-ready': {
      const html = render(ReportReady({
        name: (data.name as string) || '',
        reportName: (data.reportName as string) || '',
        downloadUrl: (data.downloadUrl as string) || undefined,
        generatedAt: (data.generatedAt as string) || undefined,
        siteUrl: SITE_URL,
      }))
      return { subject: `VitaSignal — Your Report is Ready`, html }
    }
    case 'reminder': {
      const reminderType = (data.reminderType as string) || 'Event'
      const html = render(Reminder({
        name: (data.name as string) || '',
        reminderType,
        eventName: (data.eventName as string) || '',
        eventDate: (data.eventDate as string) || '',
        eventTime: (data.eventTime as string) || undefined,
        actionUrl: (data.actionUrl as string) || undefined,
        actionLabel: (data.actionLabel as string) || undefined,
        siteUrl: SITE_URL,
      }))
      return { subject: `VitaSignal — Upcoming ${reminderType} Reminder`, html }
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
    const html = rawHtml.replace(/\{\{\{unsubscribeUrl\}\}\}/g, unsubscribeUrl)
    const text = stripHtmlToText(html)

    const messageId = crypto.randomUUID()

    // Enqueue to transactional_emails queue
    const { error: enqueueError } = await supabase.rpc('enqueue_email', {
      queue_name: 'transactional_emails',
      payload: {
        message_id: messageId,
        to,
        from: FROM_ADDRESS,
        sender_domain: SENDER_DOMAIN,
        subject,
        html,
        text,
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
