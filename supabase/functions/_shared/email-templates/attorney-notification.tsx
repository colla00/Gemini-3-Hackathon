/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Hr, Img } from 'npm:@react-email/components@0.0.22'

interface AttorneyNotificationProps {
  notificationType: 'new_attestation' | 'multi_witness_complete' | 'screenshot_upload'
  witnessName?: string
  witnessTitle?: string
  organization?: string | null
  claimsCount?: number
  formattedDate: string
  documentHash: string
  groupId?: string
  witnessCount?: number
  claimNumber?: number
  screenshotCount?: number
  siteUrl: string
}

const LOGO_URL = 'https://itgnlmhypwufwrgguvav.supabase.co/storage/v1/object/public/email-assets/vitasignal-logo.png'

export default function AttorneyNotification(props: AttorneyNotificationProps) {
  const { notificationType, witnessName, witnessTitle, organization, claimsCount, formattedDate, documentHash, groupId, witnessCount, claimNumber, screenshotCount } = props

  let title = ''
  let badge = ''
  let badgeColor = 'hsl(173,58%,29%)'

  switch (notificationType) {
    case 'new_attestation':
      title = 'New Attestation Recorded'
      badge = 'Attestation'
      break
    case 'multi_witness_complete':
      title = '✓ Multi-Witness Attestation Complete'
      badge = 'Complete'
      badgeColor = '#059669'
      break
    case 'screenshot_upload':
      title = 'New Screenshot Evidence'
      badge = 'Screenshot'
      badgeColor = '#0891b2'
      break
  }

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={LOGO_URL} alt="VitaSignal" height="32" style={logo} />
          </Section>
          <Section style={content}>
            <Text style={h1}>{title}</Text>
            <Text style={{ ...badgeStyle, backgroundColor: badgeColor }}>{badge}</Text>

            {notificationType === 'new_attestation' && (
              <Section style={detailsBox}>
                <Text style={row}><strong>Witness:</strong> {witnessName}</Text>
                <Text style={row}><strong>Title:</strong> {witnessTitle}</Text>
                {organization && <Text style={row}><strong>Organization:</strong> {organization}</Text>}
                <Text style={row}><strong>Claims Attested:</strong> {claimsCount || 0}</Text>
                <Text style={row}><strong>Date:</strong> {formattedDate}</Text>
                <Text style={row}><strong>Document Hash:</strong> <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{documentHash}</span></Text>
              </Section>
            )}

            {notificationType === 'multi_witness_complete' && (
              <Section style={detailsBox}>
                <Text style={text}>A multi-witness attestation has been completed with <strong>{witnessCount || 0} witnesses</strong>.</Text>
                <Text style={row}><strong>Group ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{groupId}</span></Text>
                <Text style={row}><strong>Document Hash:</strong> <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{documentHash}</span></Text>
                <Text style={row}><strong>Completed:</strong> {formattedDate}</Text>
              </Section>
            )}

            {notificationType === 'screenshot_upload' && (
              <Section style={detailsBox}>
                <Text style={text}>A new screenshot has been uploaded for <strong>Claim {claimNumber || 0}</strong>.</Text>
                <Text style={row}><strong>Total Screenshots for Claim:</strong> {screenshotCount || 0}</Text>
                <Text style={row}><strong>Document Hash:</strong> <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{documentHash}</span></Text>
                <Text style={row}><strong>Uploaded:</strong> {formattedDate}</Text>
              </Section>
            )}
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
const badgeStyle: React.CSSProperties = { display: 'inline-block', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', margin: '0 0 16px' }
const detailsBox: React.CSSProperties = { backgroundColor: '#f7f8fa', borderRadius: '8px', padding: '20px 24px', margin: '0 0 20px', border: '1px solid #e5e7eb' }
const row: React.CSSProperties = { fontSize: '14px', color: 'hsl(222,47%,11%)', margin: '0 0 8px', lineHeight: '1.5', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }
const hr: React.CSSProperties = { borderColor: '#e5e7eb', margin: '0' }
const footerWrap: React.CSSProperties = { padding: '20px 40px 28px' }
const footer: React.CSSProperties = { fontSize: '12px', color: 'hsl(220,9%,40%)', margin: '0 0 12px', lineHeight: '1.5' }
const disc: React.CSSProperties = { fontSize: '11px', color: '#9ca3af', margin: '0', lineHeight: '1.5' }
