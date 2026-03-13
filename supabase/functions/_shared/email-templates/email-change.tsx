/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

const LOGO_URL = 'https://itgnlmhypwufwrgguvav.supabase.co/storage/v1/object/public/email-assets/vitasignal-logo.png'

export const EmailChangeEmail = ({ siteName, email, newEmail, confirmationUrl }: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change for VitaSignal</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img src={LOGO_URL} alt="VitaSignal" height="32" style={logo} />
        </Section>
        <Section style={content}>
          <Heading style={h1}>Confirm your email change</Heading>
          <Text style={text}>
            You requested to change your email address for VitaSignal from{' '}
            <Link href={`mailto:${email}`} style={link}>{email}</Link>{' '}
            to <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
          </Text>
          <Section style={btnWrap}>
            <Button style={button} href={confirmationUrl}>Confirm Email Change</Button>
          </Section>
        </Section>
        <Hr style={hr} />
        <Section style={footerWrap}>
          <Text style={footer}>If you didn't request this change, please secure your account immediately.</Text>
          <Text style={disc}>VitaSignal™ systems are pre-market. Not FDA-cleared. Patent-pending.<br/>© 2025–2026 VitaSignal LLC</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main: React.CSSProperties = { backgroundColor: '#f7f8fa', fontFamily: "'Inter', 'Source Sans 3', Arial, sans-serif", padding: '40px 0' }
const container: React.CSSProperties = { backgroundColor: '#fff', borderRadius: '8px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
const header: React.CSSProperties = { backgroundColor: 'hsl(173,58%,29%)', borderRadius: '8px 8px 0 0', padding: '24px 40px' }
const logo: React.CSSProperties = { display: 'block' }
const content: React.CSSProperties = { padding: '32px 40px 24px' }
const h1: React.CSSProperties = { fontSize: '22px', fontWeight: 'bold', color: 'hsl(222,47%,11%)', margin: '0 0 20px', lineHeight: '1.3' }
const text: React.CSSProperties = { fontSize: '15px', color: 'hsl(220,9%,40%)', lineHeight: '1.6', margin: '0 0 14px' }
const link: React.CSSProperties = { color: 'hsl(173,58%,29%)', textDecoration: 'underline' }
const btnWrap: React.CSSProperties = { textAlign: 'center' as const, padding: '8px 0' }
const button: React.CSSProperties = { backgroundColor: 'hsl(173,58%,29%)', color: '#fff', fontSize: '15px', fontWeight: '600', borderRadius: '8px', padding: '12px 28px', textDecoration: 'none', display: 'inline-block' }
const hr: React.CSSProperties = { borderColor: '#e5e7eb', margin: '0' }
const footerWrap: React.CSSProperties = { padding: '20px 40px 28px' }
const footer: React.CSSProperties = { fontSize: '12px', color: 'hsl(220,9%,40%)', margin: '0 0 12px', lineHeight: '1.5' }
const disc: React.CSSProperties = { fontSize: '11px', color: '#9ca3af', margin: '0', lineHeight: '1.5' }
