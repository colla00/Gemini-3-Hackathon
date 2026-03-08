import { SiteLayout } from "@/components/layout/SiteLayout";

export const PrivacyPolicy = () => {
  return (
    <SiteLayout title="Privacy Policy | VitaSignal" description="Privacy Policy for vitasignal.ai.">
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">Effective Date: March 1, 2026</p>

          <div className="space-y-6 text-muted-foreground">
            <div>
              <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
              <p>
                We may collect contact form submissions (name, email, organization) and anonymous
                usage data via cookies.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">2. How We Use It</h2>
              <p>
                To respond to licensing inquiries, improve the site, and analyze aggregate usage patterns.
                We do not sell your data.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">3. Cookies</h2>
              <p>
                We use analytics cookies only. No advertising trackers. You may reject non-essential
                cookies via the cookie banner.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">4. Third-Party Services</h2>
              <p>
                We may use Lovable Cloud for form data storage. Data is stored securely and not shared
                with third parties.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">5. Data Retention</h2>
              <p>
                Contact form data is retained for up to 2 years or until you request deletion.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">6. Your Rights</h2>
              <p>
                You may request deletion of your data at any time by emailing privacy@vitasignal.ai.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
              <p>privacy@vitasignal.ai</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-6 border-t border-border">
            Last Updated: March 1, 2026 · © 2025–2026 VitaSignal LLC
          </p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default PrivacyPolicy;
