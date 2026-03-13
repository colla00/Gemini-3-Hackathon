/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Button, Container, Section, Text, Hr, Img } from 'npm:@react-email/components@0.0.22'

interface WitnessInvitationProps {
  witnessName: string
  invitedBy: string
  inviteLink: string
  documentHash: string
  expiresFormatted: string
  siteUrl: string
}

const LOGO_URL = 'https://itgnlmhypwufwrgguvav.supabase.co/storage/v1/object/public/email-assets/vitasignal-logo.png'

export default function WitnessInvitation({ witnessName, invitedBy, inviteLink, documentHash, expiresFormatted, siteUrl }: WitnessInvitationProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={LOGO_URL} alt="VitaSignal" height="32" style={logo} />
          </Section>
          <Section style={content}>
            <Text style={h1}>Witness Attestation Request</Text>
            <Text style={text}>Dear {witnessName},</Text>
            <Text style={text}>
              You have been invited by <strong>{invitedBy}</strong> to provide a witness attestation for the Clinical Risk Intelligence System patent documentation.
            </Text>
            <Section style={infoBox}>
              <Text style={infoLabel}>What you'll be attesting to:</Text>
              <Text style={text}>• Review of 20 patent claims and their working implementations</Text>
              <Text style={text}>• Verification that the described functionality exists in the software</Text>
              <Text style={text}>• Your attestation will be permanently recorded with a timestamp</Text>
            </Section>
            <Section style={btnWrap}>
              <Button style={button} href={inviteLink}>Review & Attest</Button>
            </Section>
            <Text style={hashLabel}>Document Hash:</Text>
            <Text style={hashBox}>{documentHash}</Text>
            <Section style={warnBox}>
              <Text style={warnText}>
                <strong>⏰ This invitation expires on {expiresFormatted}</strong><br />
                Please complete your attestation before this date.
              </Text>
            </Section>
          </Section>
          <Hr style={hr} />
          <Section style={footerWrap}>
            <Text style={footer}>Patent Evidence Documentation System</Text>
            <Text style={disc}>VitaSignal™ systems are pre-market. Not FDA-cleared. Patent-pending.<br />© 2025–2026 VitaSignal LLC</Text>
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
const infoBox: React.CSSProperties = { backgroundColor: '#eff6ff', borderRadius: '8px', padding: '20px 24px', margin: '0 0 20px', border: '1px solid #bfdbfe' }
const infoLabel: React.CSSProperties = { fontSize: '14px', fontWeight: '700', color: 'hsl(222,47%,11%)', margin: '0 0 8px' }
const btnWrap: React.CSSProperties = { textAlign: 'center' as const, padding: '8px 0 16px' }
const button: React.CSSProperties = { backgroundColor: 'hsl(173,58%,29%)', color: '#fff', fontSize: '15px', fontWeight: '600', borderRadius: '8px', padding: '14px 28px', textDecoration: 'none', display: 'inline-block' }
const hashLabel: React.CSSProperties = { fontSize: '14px', fontWeight: '600', color: 'hsl(222,47%,11%)', margin: '16px 0 4px' }
const hashBox: React.CSSProperties = { backgroundColor: 'hsl(222,47%,11%)', color: 'hsl(173,58%,29%)', fontFamily: 'monospace', fontSize: '13px', padding: '12px', borderRadius: '8px', textAlign: 'center' as const, wordBreak: 'break-all' as const, margin: '0 0 16px' }
const warnBox: React.CSSProperties = { backgroundColor: '#fef3c7', borderRadius: '8px', padding: '12px 16px', border: '1px solid #fcd34d' }
const warnText: React.CSSProperties = { fontSize: '13px', color: '#92400e', margin: '0', lineHeight: '1.5' }
const hr: React.CSSProperties = { borderColor: '#e5e7eb', margin: '0' }
const footerWrap: React.CSSProperties = { padding: '20px 40px 28px' }
const footer: React.CSSProperties = { fontSize: '12px', color: 'hsl(220,9%,40%)', margin: '0 0 12px', lineHeight: '1.5' }
const disc: React.CSSProperties = { fontSize: '11px', color: '#9ca3af', margin: '0', lineHeight: '1.5' }
