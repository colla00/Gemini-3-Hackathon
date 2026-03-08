import { SiteLayout } from "@/components/layout/SiteLayout";

export default function TermsOfUse() {
  return (
    <SiteLayout title="Terms of Service | VitaSignal" description="Terms of Service for vitasignal.ai.">
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground">Effective Date: March 1, 2026</p>

          <div className="space-y-6 text-muted-foreground">
            <div>
              <h2 className="text-lg font-semibold text-foreground">1. Acceptance</h2>
              <p>By accessing vitasignal.ai, you agree to these Terms.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">2. Informational Use Only</h2>
              <p>
                This site provides general information about VitaSignal LLC research and technology.
                Nothing on this site constitutes medical advice, clinical guidance, or a substitute
                for professional medical judgment.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">3. Pre-Market Disclaimer</h2>
              <p>
                VitaSignal systems are pre-market, patent-pending technologies. They are NOT FDA-cleared,
                NOT approved medical devices, and are NOT intended for clinical use.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">4. Intellectual Property</h2>
              <p>
                VitaSignal LLC has filed 11 provisional patent applications with the USPTO.
                VitaSignal™, Documentation Burden Score™, and IDI™ are trademarks of VitaSignal LLC.
                All rights reserved.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">5. Limitation of Liability</h2>
              <p>
                VitaSignal LLC is not liable for any damages arising from use of this website or reliance
                on its content.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">6. Governing Law</h2>
              <p>These Terms are governed by applicable U.S. federal and state law.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
              <p>legal@vitasignal.ai</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-6 border-t border-border">
            Last Updated: March 1, 2026 · © 2025–2026 VitaSignal LLC
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
