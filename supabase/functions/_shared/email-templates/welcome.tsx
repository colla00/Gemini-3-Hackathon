/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Button, Hr, Img } from 'npm:@react-email/components@0.0.22'

interface WelcomeProps {
  name: string
  siteUrl: string
}

const LOGO_URL = 'https://itgnlmhypwufwrgguvav.supabase.co/storage/v1/object/public/email-assets/vitasignal-logo.png'

export default function Welcome({ name, siteUrl }: WelcomeProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={LOGO_URL} alt="VitaSignal" height="32" style={logo} />
          </Section>
          <Section style={content}>
            <Text style={h1}>Welcome to VitaSignal</Text>
            <Text style={text}>Hello {name || 'there'},</Text>
            <Text style={text}>
              Thank you for joining VitaSignal. We're building the next generation of clinical intelligence — real-time pressure injury prevention powered by AI and continuous monitoring.
            </Text>
            <Text style={text}>Your account is now active. Here's what you can explore:</Text>
            <Text style={listItem}>• <strong>Clinical Dashboard</strong> — Real-time patient risk monitoring</Text>
            <Text style={listItem}>• <strong>AI Risk Assessment</strong> — Predictive analytics for early intervention</Text>
            <Text style={listItem}>• <strong>Compliance Hub</strong> — HIPAA training, audit logs, and security tools</Text>
            <Section style={btnWrap}>
              <Button style={button} href={siteUrl || 'https://vitasignal.ai'}>
                Get Started
              </Button>
            </Section>
          </Section>
          <Hr style={hr} />
          <Section style={footerWrap}>
            <Text style={footer}>Best regards,<br />The VitaSignal Team</Text>
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
const listItem: React.CSSProperties = { fontSize: '15px', color: 'hsl(220,9%,40%)', lineHeight: '1.6', margin: '0 0 6px', paddingLeft: '4px' }
const btnWrap: React.CSSProperties = { textAlign: 'center' as const, padding: '12px 0 8px' }
const button: React.CSSProperties = { backgroundColor: 'hsl(173,58%,29%)', borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: '600', padding: '12px 28px', textDecoration: 'none', display: 'inline-block' }
const hr: React.CSSProperties = { borderColor: '#e5e7eb', margin: '0' }
const footerWrap: React.CSSProperties = { padding: '20px 40px 28px' }
const footer: React.CSSProperties = { fontSize: '14px', color: 'hsl(222,47%,11%)', margin: '0 0 12px', lineHeight: '1.5' }
const disc: React.CSSProperties = { fontSize: '11px', color: '#9ca3af', margin: '0 0 8px', lineHeight: '1.5' }
const unsub: React.CSSProperties = { color: '#9ca3af', fontSize: '11px', textDecoration: 'underline' }
