import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Trash2, Mail, List, Globe, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SiteLayout } from '@/components/layout/SiteLayout';
import heroBg from '@/assets/hero-bg.jpg';

const sections = [
  { id: 'overview', title: '1. Overview', icon: Shield },
  { id: 'data-collection', title: '2. Data We Collect', icon: Database },
  { id: 'how-we-use', title: '3. How We Use Your Data', icon: Eye },
  { id: 'data-sharing', title: '4. Data Sharing', icon: Globe },
  { id: 'data-retention', title: '5. Data Retention', icon: Clock },
  { id: 'your-rights', title: '6. Your Rights (GDPR/CCPA)', icon: Lock },
  { id: 'data-deletion', title: '7. Data Deletion Requests', icon: Trash2 },
  { id: 'cookies', title: '8. Cookies & Tracking', icon: Eye },
  { id: 'security', title: '9. Security Measures', icon: Shield },
  { id: 'contact', title: '10. Contact Us', icon: Mail },
];

export const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('');
  const [showToc, setShowToc] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id)
      }));

      for (const section of sectionElements.reverse()) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <SiteLayout title="Privacy Policy" description="Privacy Policy for VitaSignal™ Clinical Intelligence Platform.">
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-24 md:pb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-4 leading-[1.05]">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-sm opacity-60">Last Updated: February 2026</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowToc(!showToc)}
            className="mt-4 lg:hidden text-primary-foreground/70 hover:text-primary-foreground"
          >
            <List className="w-4 h-4 mr-2" />
            Table of Contents
          </Button>
        </div>
      </section>

      {/* Mobile TOC */}
      {showToc && (
        <div className="lg:hidden bg-background border-b border-border p-4">
          <nav className="max-w-4xl mx-auto grid grid-cols-2 gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  scrollToSection(section.id);
                  setShowToc(false);
                }}
                className={cn(
                  "text-left px-3 py-2 text-xs rounded-lg transition-colors",
                  activeSection === section.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12 flex gap-8">
        {/* Table of Contents - Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-2">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <List className="w-4 h-4" />
              Table of Contents
            </h2>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                    activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
            
            {/* Overview */}
            <section id="overview" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Shield className="w-5 h-5 text-primary" />
                1. Overview
              </h2>
              <p className="text-muted-foreground">
                This Privacy Policy explains how VitaSignal™ ("we", "us", or "our") collects, 
                uses, and protects your personal information when you use our research prototype software.
              </p>
              <p className="text-muted-foreground">
                We are committed to protecting your privacy and complying with applicable data protection laws, 
                including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
              </p>
            </section>

            {/* Data Collection */}
            <section id="data-collection" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Database className="w-5 h-5 text-primary" />
                2. Data We Collect
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground">Account Information</h3>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Email address (for authentication)</li>
                    <li>Name (if provided)</li>
                    <li>Organization/affiliation (optional)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Usage Data</h3>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Pages viewed and features used</li>
                    <li>Session duration and timestamps</li>
                    <li>Device information (browser, screen resolution, timezone)</li>
                    <li>IP address (for security and analytics)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Patent Documentation Data</h3>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Attestation signatures and timestamps</li>
                    <li>Witness information for patent evidence</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Data */}
            <section id="how-we-use" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Eye className="w-5 h-5 text-primary" />
                3. How We Use Your Data
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Authentication:</strong> To verify your identity and provide access</li>
                <li><strong>Security:</strong> To protect against unauthorized access and abuse</li>
                <li><strong>Research:</strong> To understand usage patterns and improve the prototype</li>
                <li><strong>Patent Documentation:</strong> To maintain evidence of invention dates and usage</li>
                <li><strong>Communication:</strong> To send important notifications about your account</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section id="data-sharing" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Globe className="w-5 h-5 text-primary" />
                4. Data Sharing
              </h2>
              <p className="text-muted-foreground">We do not sell your personal information. We may share data only in these circumstances:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
                <li><strong>Service Providers:</strong> With trusted third parties who help operate our service (e.g., email delivery)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Patent Proceedings:</strong> Attestation data may be used in patent applications and proceedings</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section id="data-retention" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Clock className="w-5 h-5 text-primary" />
                5. Data Retention
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Account Data:</strong> Retained while your account is active, plus 30 days after deletion request</li>
                <li><strong>Usage Logs:</strong> Retained for 90 days for security purposes</li>
                <li><strong>Patent Attestations:</strong> Retained permanently as legal evidence (cannot be deleted)</li>
                <li><strong>Audit Logs:</strong> Retained for 7 years for compliance purposes</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section id="your-rights" className="scroll-mt-24 p-6 rounded-xl bg-primary/5 border border-primary/30">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Lock className="w-5 h-5 text-primary" />
                6. Your Rights (GDPR/CCPA)
              </h2>
              <p className="text-muted-foreground">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data (with exceptions)</li>
                <li><strong>Right to Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                <strong>California Residents (CCPA):</strong> You have the right to know what personal information 
                is collected, request deletion, and opt-out of the sale of personal information (we do not sell data).
              </p>
            </section>

            {/* Data Deletion */}
            <section id="data-deletion" className="scroll-mt-24 p-6 rounded-xl bg-destructive/5 border border-destructive/30">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Trash2 className="w-5 h-5 text-destructive" />
                7. Data Deletion Requests
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>To request deletion of your personal data, please email us at{' '}
                  <a href="mailto:info@alexiscollier.com" className="text-primary hover:underline">info@alexiscollier.com</a>{' '}
                  with the subject line "Data Deletion Request".
                </p>
                <p><strong>What can be deleted:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Account information and profile data</li>
                  <li>Usage analytics and session data</li>
                  <li>Cookie preferences</li>
                </ul>
                <p className="font-medium text-foreground"><strong>What cannot be deleted:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Patent attestation records (legal evidence)</li>
                  <li>Audit logs required for compliance</li>
                  <li>Data required to fulfill legal obligations</li>
                </ul>
                <p>We will respond to deletion requests within 30 days (GDPR) or 45 days (CCPA).</p>
              </div>
            </section>

            {/* Cookies */}
            <section id="cookies" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Eye className="w-5 h-5 text-primary" />
                8. Cookies & Tracking
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We use the following types of cookies:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Necessary Cookies:</strong> Required for authentication and security (cannot be disabled)</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use the site (optional)</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences (optional)</li>
                </ul>
                <p>You can manage your cookie preferences using our cookie consent banner or by adjusting your browser settings.</p>
              </div>
            </section>

            {/* Security */}
            <section id="security" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Shield className="w-5 h-5 text-primary" />
                9. Security Measures
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Encryption of data in transit (TLS/HTTPS)</li>
                <li>Row-level security on all database tables</li>
                <li>Rate limiting to prevent abuse</li>
                <li>Session timeout for inactive users</li>
                <li>Audit logging of all significant actions</li>
                <li>Regular security reviews and updates</li>
              </ul>
            </section>

            {/* Contact */}
            <section id="contact" className="scroll-mt-24 p-6 rounded-xl bg-secondary/50 border border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Mail className="w-5 h-5 text-primary" />
                10. Contact Us
              </h2>
              <div className="text-muted-foreground">
                <p>For privacy-related inquiries or to exercise your data rights:</p>
                <p className="mt-4">
                  <strong>Data Controller:</strong><br />
                  Dr. Alexis M. Collier, DHA<br />
                  Email: <a href="mailto:info@alexiscollier.com" className="text-primary hover:underline">info@alexiscollier.com</a>
                </p>
              </div>
            </section>

            {/* Links */}
            <div className="flex gap-4 text-sm">
              <Link to="/terms" className="text-primary hover:underline">Terms of Use</Link>
            </div>
          </div>
        </main>
      </div>
    </SiteLayout>
  );
};
