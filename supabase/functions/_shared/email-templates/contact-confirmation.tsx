/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Hr, Img } from 'npm:@react-email/components@0.0.22'

interface ContactConfirmationProps {
  name: string
  inquiryType: string
  siteUrl: string
}

export default function ContactConfirmation({ name, inquiryType, siteUrl }: ContactConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={logoText}>VitaSignal™</Text>
          </Section>
          <Section style={contentSection}>
            <Text style={heading}>We've received your inquiry</Text>
            <Text style={paragraph}>
              Dear {name || 'there'},
            </Text>
            <Text style={paragraph}>
              Thank you for reaching out to VitaSignal. We've received your {inquiryType || 'general'} inquiry and our team will review it promptly.
            </Text>
            <Text style={paragraph}>
              You can expect a response within <strong>2 business days</strong>. If your inquiry requires immediate attention, please reply to this email or contact us at info@vitasignal.ai.
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footerSection}>
            <Text style={footer}>
              Best regards,<br />VitaSignal LLC
            </Text>
            <Text style={disclaimer}>
              VitaSignal™ systems are pre-market. Not FDA-cleared. Patent-pending.
            </Text>
            <Text style={unsubscribeText}>
              <a href="{{{unsubscribeUrl}}}" style={unsubscribeLink}>Unsubscribe</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main: React.CSSProperties = {
  backgroundColor: '#f7f8fa',
  fontFamily: "'Inter', 'Source Sans 3', Arial, sans-serif",
  padding: '40px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  maxWidth: '600px',
  margin: '0 auto',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
}

const headerSection: React.CSSProperties = {
  backgroundColor: 'hsl(173, 58%, 29%)',
  borderRadius: '8px 8px 0 0',
  padding: '24px 40px',
}

const logoText: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0',
  letterSpacing: '-0.3px',
}

const contentSection: React.CSSProperties = {
  padding: '32px 40px 24px',
}

const heading: React.CSSProperties = {
  color: 'hsl(222, 47%, 11%)',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 20px',
  lineHeight: '1.3',
}

const paragraph: React.CSSProperties = {
  color: 'hsl(220, 9%, 40%)',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 14px',
}

const hr: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '0',
}

const footerSection: React.CSSProperties = {
  padding: '20px 40px 28px',
}

const footer: React.CSSProperties = {
  color: 'hsl(222, 47%, 11%)',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 12px',
}

const disclaimer: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '11px',
  margin: '0 0 8px',
}

const unsubscribeText: React.CSSProperties = {
  margin: '0',
}

const unsubscribeLink: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '11px',
  textDecoration: 'underline',
}
