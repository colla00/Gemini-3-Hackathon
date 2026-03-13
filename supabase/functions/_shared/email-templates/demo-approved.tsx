/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Button, Container, Section, Text, Hr, Img } from 'npm:@react-email/components@0.0.22'

interface DemoApprovedProps {
  name: string
  email: string
  tempPassword: string | null
  accountCreated: boolean
  siteUrl: string
}

const LOGO_URL = 'https://itgnlmhypwufwrgguvav.supabase.co/storage/v1/object/public/email-assets/vitasignal-logo.png'

export default function DemoApproved({ name, email, tempPassword, accountCreated, siteUrl }: DemoApprovedProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={LOGO_URL} alt="VitaSignal" height="32" style={logo} />
          </Section>
          <Section style={content}>
            <Text style={h1}>Your Demo Access Has Been Approved</Text>
            <Text style={text}>Hi {name || 'there'},</Text>
            <Text style={text}>
              Your request to access the VitaSignal technology demonstration has been <strong style={{ color: 'hsl(173,58%,29%)' }}>approved</strong>.
            </Text>
            {tempPassword ? (
              <Section style={credBox}>
                <Text style={credLabel}>Your Login Credentials</Text>
                <Text style={credRow}><strong>Email:</strong> {email}</Text>
                <Text style={credRow}><strong>Temporary Password:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'hsl(173,58%,29%)' }}>{tempPassword}</span></Text>
                <Text style={credNote}>Please change your password after your first login.</Text>
              </Section>
            ) : (
              <Text style={text}>You can log in with your existing account credentials.</Text>
            )}
            <Text style={text}>You now have access to:</Text>
            <Text style={text}>• Interactive clinical intelligence dashboard</Text>
            <Text style={text}>• Patent-protected AI risk analysis</Text>
            <Text style={text}>• Clinical workflow simulations</Text>
            <Text style={text}>• Real-time predictive analytics</Text>
            <Section style={btnWrap}>
              <Button style={button} href={`${siteUrl}/auth`}>Sign In to Demo Dashboard</Button>
            </Section>
          </Section>
          <Hr style={hr} />
          <Section style={footerWrap}>
            <Text style={footer}>
              Questions? Contact <a href="mailto:info@vitasignal.ai" style={{ color: 'hsl(173,58%,29%)' }}>info@vitasignal.ai</a>
            </Text>
            <Text style={disc}>VitaSignal™ systems are pre-market. Not FDA-cleared. Patent-pending.<br />© 2025–2026 VitaSignal LLC</Text>
            <Text style={{ margin: '0' }}><a href="{{{unsubscribeUrl}}}" style={unsubStyle}>Unsubscribe</a></Text>
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
const credBox: React.CSSProperties = { backgroundColor: '#f0fdf4', borderRadius: '8px', padding: '20px 24px', margin: '0 0 20px', border: '1px solid #bbf7d0' }
const credLabel: React.CSSProperties = { fontSize: '14px', fontWeight: '700', color: '#166534', margin: '0 0 12px' }
const credRow: React.CSSProperties = { fontSize: '14px', color: 'hsl(222,47%,11%)', margin: '0 0 6px', lineHeight: '1.5' }
const credNote: React.CSSProperties = { fontSize: '13px', color: '#666', margin: '12px 0 0' }
const btnWrap: React.CSSProperties = { textAlign: 'center' as const, padding: '8px 0' }
const button: React.CSSProperties = { backgroundColor: 'hsl(173,58%,29%)', color: '#fff', fontSize: '15px', fontWeight: '600', borderRadius: '8px', padding: '12px 28px', textDecoration: 'none', display: 'inline-block' }
const hr: React.CSSProperties = { borderColor: '#e5e7eb', margin: '0' }
const footerWrap: React.CSSProperties = { padding: '20px 40px 28px' }
const footer: React.CSSProperties = { fontSize: '12px', color: 'hsl(220,9%,40%)', margin: '0 0 12px', lineHeight: '1.5' }
const disc: React.CSSProperties = { fontSize: '11px', color: '#9ca3af', margin: '0 0 8px', lineHeight: '1.5' }
const unsubStyle: React.CSSProperties = { color: '#9ca3af', fontSize: '11px', textDecoration: 'underline' }
