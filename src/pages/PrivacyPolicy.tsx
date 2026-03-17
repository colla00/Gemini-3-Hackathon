import { SiteLayout } from "@/components/layout/SiteLayout";

export const PrivacyPolicy = () => {
  return (
    <SiteLayout title="Privacy Policy | VitaSignal" description="Privacy Policy for vitasignal.ai — how we collect, use, and protect your data.">
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">Effective Date: March 1, 2026 · Last Updated: March 17, 2026</p>

          <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">

            {/* 1. Overview */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">1. Overview</h2>
              <p>
                VitaSignal LLC ("we," "us," or "our") operates vitasignal.ai. This Privacy Policy describes how we collect,
                use, disclose, and protect your personal information when you visit our website or interact with our services.
                By using vitasignal.ai, you agree to the practices described in this Policy.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">2. Information We Collect</h2>
              <p className="mb-2">We collect the following categories of information:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><strong>Contact information:</strong> Name, email address, organization, role, and message content submitted via contact forms, licensing inquiries, or demo access requests.</li>
                <li><strong>Account data:</strong> Email address and authentication credentials for authorized dashboard users.</li>
                <li><strong>Usage data:</strong> Pages visited, referral sources, browser user agent, timestamps, and approximate geographic region (country-level) collected automatically via server-side analytics.</li>
                <li><strong>Cookie preferences:</strong> Your cookie consent choices (necessary, analytics, functional).</li>
                <li><strong>Device information:</strong> Browser type, device type, screen resolution, and operating system.</li>
              </ul>
              <p className="mt-2">
                We do <strong>not</strong> collect protected health information (PHI), Social Security numbers, financial data,
                or biometric identifiers. All data displayed on the technology demonstration dashboard is simulated and synthetic.
              </p>
            </div>

            {/* 3. How We Use Your Information */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>To respond to inquiries, licensing requests, and demo access requests.</li>
                <li>To provide and maintain authorized dashboard access.</li>
                <li>To analyze aggregate usage patterns and improve the website.</li>
                <li>To enforce our Terms of Service and protect intellectual property.</li>
                <li>To comply with legal obligations.</li>
              </ul>
              <p className="mt-2">We do <strong>not</strong> sell, rent, or trade your personal information to third parties.</p>
            </div>

            {/* 4. Cookies & Tracking */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">4. Cookies & Tracking Technologies</h2>
              <p className="mb-2">We use the following categories of cookies:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><strong>Necessary cookies:</strong> Required for authentication, session management, and core functionality. Cannot be disabled.</li>
                <li><strong>Analytics cookies:</strong> Help us understand site usage patterns. Opt-in only.</li>
                <li><strong>Functional cookies:</strong> Enable enhanced features such as theme preferences and cookie consent memory. Opt-in only.</li>
              </ul>
              <p className="mt-2">
                We do <strong>not</strong> use advertising trackers, pixel tags, or third-party ad networks.
                You can manage your cookie preferences at any time via the cookie consent banner that appears on your first visit.
              </p>
            </div>

            {/* 5. Data Sharing */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">5. Data Sharing & Third-Party Services</h2>
              <p>We may share limited information with the following categories of service providers, solely to operate our services:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li><strong>Infrastructure providers:</strong> Cloud hosting and database services for secure data storage.</li>
                <li><strong>Authentication services:</strong> For secure user login and session management.</li>
                <li><strong>Email services:</strong> To deliver transactional notifications (e.g., inquiry confirmations).</li>
              </ul>
              <p className="mt-2">
                We do not share your personal information with advertisers, data brokers, or unaffiliated third parties.
                All service providers are contractually bound to protect your data.
              </p>
            </div>

            {/* 6. Data Retention */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">6. Data Retention</h2>
              <p>
                Contact form submissions and licensing inquiries are retained for up to two (2) years or until you request deletion.
                Usage analytics are retained in aggregate form. Authentication session data is cleared automatically upon expiration.
                Client-side storage items (e.g., session tokens, preferences) are subject to automated TTL-based expiration.
              </p>
            </div>

            {/* 7. Data Security */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">7. Data Security</h2>
              <p>We implement industry-standard security measures including:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li>Encryption in transit (TLS/HTTPS) and at rest for sensitive data.</li>
                <li>Row-Level Security (RLS) policies to restrict database access.</li>
                <li>IP-based rate limiting to prevent abuse.</li>
                <li>Leaked password protection (HIBP checks) for user accounts.</li>
                <li>PII encryption for sensitive fields using cryptographic functions.</li>
                <li>Immutable audit logs for security-critical operations.</li>
              </ul>
              <p className="mt-2">
                No method of electronic transmission or storage is 100% secure. While we strive to protect your information,
                we cannot guarantee absolute security.
              </p>
            </div>

            {/* 8. Data Breach Notification */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">8. Data Breach Notification</h2>
              <p>
                In the event of a data breach that compromises your personal information, we will notify affected individuals
                within seventy-two (72) hours of discovery, in accordance with applicable federal and state notification requirements.
                Notification will be provided via email to the address on file and, where required, via public disclosure on this website.
              </p>
            </div>

            {/* 9. Your Rights */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">9. Your Rights</h2>
              <p className="mb-2">Depending on your jurisdiction, you may have the following rights:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information.</li>
                <li><strong>Portability:</strong> Request a machine-readable copy of your data.</li>
                <li><strong>Opt-out:</strong> Opt out of non-essential cookies via the cookie consent banner.</li>
                <li><strong>Do Not Sell:</strong> We do not sell personal information. No opt-out action is required.</li>
              </ul>
              <p className="mt-2">To exercise any of these rights, email <strong>privacy@vitasignal.ai</strong>. We will respond within 30 days.</p>
            </div>

            {/* 10. CCPA */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">10. California Privacy Rights (CCPA/CPRA)</h2>
              <p>
                If you are a California resident, you have the right under the California Consumer Privacy Act (CCPA), as amended
                by the California Privacy Rights Act (CPRA), to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li>Know what personal information we collect and how it is used.</li>
                <li>Request deletion of your personal information.</li>
                <li>Opt out of the sale or sharing of personal information. <strong>We do not sell or share personal information.</strong></li>
                <li>Non-discrimination for exercising your privacy rights.</li>
              </ul>
              <p className="mt-2">To submit a verifiable consumer request, contact <strong>privacy@vitasignal.ai</strong>.</p>
            </div>

            {/* 11. International Users */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">11. International Data Transfers</h2>
              <p>
                VitaSignal LLC is based in the United States. If you access this website from outside the United States,
                please be aware that your information may be transferred to, stored, and processed in the United States,
                where data protection laws may differ from those in your jurisdiction. By using this website, you consent
                to the transfer of your information to the United States.
              </p>
              <p className="mt-2">
                For users in the European Economic Area (EEA) or United Kingdom, we process personal data under lawful bases
                including consent and legitimate interests. You may withdraw consent at any time by contacting us.
              </p>
            </div>

            {/* 12. Children's Privacy */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">12. Children's Privacy (COPPA)</h2>
              <p>
                This website is not directed at individuals under the age of 13. We do not knowingly collect personal information
                from children under 13. If we become aware that we have inadvertently collected such information, we will take
                immediate steps to delete it. If you believe a child under 13 has provided us with personal information, please
                contact <strong>privacy@vitasignal.ai</strong>.
              </p>
            </div>

            {/* 13. Changes */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">13. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated
                "Last Updated" date. Material changes will be communicated via a notice on the website. Your continued
                use of the website after changes constitutes acceptance of the revised Policy.
              </p>
            </div>

            {/* 14. Governance & Ethical Standards */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">14. Governance & Ethical Standards</h2>
              <p>
                VitaSignal maintains organizational governance policies that complement this Privacy Policy, including:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li><strong>Conflict of Interest Policy:</strong> Establishes disclosure requirements and recusal procedures for employees, contractors, and affiliates involved in clinical AI research, patent prosecution, and commercial partnerships. See our <a href="/conflict-of-interest" className="text-primary hover:underline">Conflict of Interest Policy</a>.</li>
                <li><strong>Data Governance:</strong> All personal data processing activities are subject to internal review, documented in our Privacy Impact Assessment, and aligned with NIST SP 800-122 guidelines.</li>
                <li><strong>Responsible AI:</strong> Model development follows fairness-preserving principles, with SHAP-based explainability and demographic subgroup performance monitoring planned for clinical deployment.</li>
                <li><strong>Regulatory Alignment:</strong> Our data practices are designed for compatibility with HIPAA, FDA SaMD guidance, and applicable state privacy laws.</li>
              </ul>
            </div>

            {/* 15. Contact */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">15. Contact Us</h2>
              <p>For privacy-related inquiries, requests, or complaints:</p>
              <div className="mt-2 p-4 rounded-lg bg-muted/50 border border-border/30">
                <p><strong>VitaSignal LLC</strong></p>
                <p>Email: <a href="mailto:privacy@vitasignal.ai" className="text-primary hover:underline">privacy@vitasignal.ai</a></p>
                <p>General: <a href="mailto:info@vitasignal.ai" className="text-primary hover:underline">info@vitasignal.ai</a></p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-6 border-t border-border">
            Last Updated: March 9, 2026 · © 2025–2026 VitaSignal LLC. All Rights Reserved.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default PrivacyPolicy;
