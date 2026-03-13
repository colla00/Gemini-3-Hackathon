/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Hr, Img } from 'npm:@react-email/components@0.0.22'

interface PilotRequestConfirmationProps {
  name: string
  organization: string
  siteUrl: string
}

const LOGO_URL = 'https://itgnlmhypwufwrgguvav.supabase.co/storage/v1/object/public/email-assets/vitasignal-logo.png'

export default function PilotRequestConfirmation({ name, organization, siteUrl }: PilotRequestConfirmationProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={LOGO_URL} alt="VitaSignal" height="32" style={logo} />
          </Section>
          <Section style={content}>
            <Text style={h1}>Pilot Request Received</Text>
            <Text style={text}>Dear {name || 'there'},</Text>
            <Text style={text}>
              Thank you for submitting a pilot request{organization ? ` on behalf of ${organization}` : ''}. Our clinical partnerships team will review your submission and reach out within <strong>2 business days</strong> to discuss next steps.
            </Text>
            <Section style={detailsBox}>
              <Text style={detailLabel}>What happens next</Text>
              <Text style={text}>1. Our team reviews your facility's requirements</Text>
              <Text style={text}>2. We schedule a technical scoping call</Text>
              <Text style={text}>3. We prepare a customized pilot proposal</Text>
            </Section>
            <Text style={text}>
              For urgent inquiries, contact us directly at info@vitasignal.ai.
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footerWrap}>
            <Text style={footer}>Best regards,<br />VitaSignal Clinical Partnerships</Text>
            <Text style={disc}>VitaSignal™ systems are pre-market. Not FDA-cleared. Patent-pending.<br />© 2025–2026 VitaSignal LLC</Text>
            <Text style={{ margin: '0' }}><a href="{{{unsubscribeUrl}}}" style={unsub}>Unsubscribe</a></Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main: React.CSSProperties = { backgroundColor: '#f7f8fa', fontFamily: "'Inter', 'Source Sans 3', Arial, sans-serif", padding: '40px 0' }
const container: React.CSSProperties = { backgroundColor: '#fff', borderRadius: '8px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
const header: React.CSSProperties = { backgroundColor: 'hsl(173,58%,29%)', borderRadius: '8px 8px 0 0', padding: '24px 40px' }
const logo: React.CSSProperties = { display: 'block' }
const content: React.CSSProperties = { padding: '32px 40px 24px' }
const h1: React.CSSProperties = { fontSize: '22px', fontWeight: '700', color: 'hsl(222,47%,11%)', margin: '0 0 20px', lineHeight: '1.3' }
const text: React.CSSProperties = { fontSize: '15px', color: 'hsl(220,9%,40%)', lineHeight: '1.6', margin: '0 0 14px' }
const detailsBox: React.CSSProperties = { backgroundColor: '#f7f8fa', borderRadius: '8px', padding: '20px 24px', margin: '0 0 20px', border: '1px solid #e5e7eb' }
const detailLabel: React.CSSProperties = { color: 'hsl(220,9%,40%)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '0 0 8px' }
const hr: React.CSSProperties = { borderColor: '#e5e7eb', margin: '0' }
const footerWrap: React.CSSProperties = { padding: '20px 40px 28px' }
const footer: React.CSSProperties = { fontSize: '14px', color: 'hsl(222,47%,11%)', margin: '0 0 12px', lineHeight: '1.5' }
const disc: React.CSSProperties = { fontSize: '11px', color: '#9ca3af', margin: '0 0 8px', lineHeight: '1.5' }
const unsub: React.CSSProperties = { color: '#9ca3af', fontSize: '11px', textDecoration: 'underline' }
