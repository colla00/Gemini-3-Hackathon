/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Button, Hr } from 'npm:@react-email/components@0.0.22'

interface WelcomeProps {
  name: string
  siteUrl: string
}

export default function Welcome({ name, siteUrl }: WelcomeProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={logoText}>VitaSignal™</Text>
          </Section>
          <Section style={contentSection}>
            <Text style={heading}>Welcome to VitaSignal</Text>
            <Text style={paragraph}>
              Hello {name || 'there'},
            </Text>
            <Text style={paragraph}>
              Thank you for joining VitaSignal. We're building the next generation of clinical intelligence — real-time pressure injury prevention powered by AI and continuous monitoring.
            </Text>
            <Text style={paragraph}>
              Your account is now active. Here's what you can explore:
            </Text>
            <Text style={listItem}>• <strong>Clinical Dashboard</strong> — Real-time patient risk monitoring</Text>
            <Text style={listItem}>• <strong>AI Risk Assessment</strong> — Predictive analytics for early intervention</Text>
            <Text style={listItem}>• <strong>Compliance Hub</strong> — HIPAA training, audit logs, and security tools</Text>
            <Section style={buttonSection}>
              <Button style={button} href={siteUrl || 'https://vitasignal.ai'}>
                Get Started
              </Button>
            </Section>
          </Section>
          <Hr style={hr} />
          <Section style={footerSection}>
            <Text style={footer}>
              Best regards,<br />The VitaSignal Team
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

const listItem: React.CSSProperties = {
  color: 'hsl(220, 9%, 40%)',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 6px',
  paddingLeft: '4px',
}

const buttonSection: React.CSSProperties = {
  textAlign: 'center' as const,
  padding: '12px 0 8px',
}

const button: React.CSSProperties = {
  backgroundColor: 'hsl(173, 58%, 29%)',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  padding: '12px 28px',
  textDecoration: 'none',
  display: 'inline-block',
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
