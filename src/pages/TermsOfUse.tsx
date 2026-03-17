import { SiteLayout } from "@/components/layout/SiteLayout";

export default function TermsOfUse() {
  return (
    <SiteLayout title="Terms of Service | VitaSignal" description="Terms of Service for vitasignal.ai — governing your use of the VitaSignal platform.">
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground">Effective Date: March 1, 2026 · Last Updated: March 17, 2026</p>

          <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">

            {/* 1. Acceptance */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing or using vitasignal.ai (the "Website"), you agree to be bound by these Terms of Service ("Terms").
                If you do not agree, you must discontinue use of the Website immediately. These Terms constitute a legally
                binding agreement between you and VitaSignal LLC ("Company," "we," "us," or "our").
              </p>
            </div>

            {/* 2. Informational Use */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">2. Informational Use Only</h2>
              <p>
                This Website provides general information about VitaSignal LLC's research and technology portfolio.
                Nothing on this Website constitutes medical advice, clinical guidance, a diagnosis, treatment recommendation,
                or a substitute for professional medical judgment. You should not rely on any information on this Website
                for clinical decision-making.
              </p>
            </div>

            {/* 3. Pre-Market Disclaimer */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">3. Pre-Market Disclaimer</h2>
              <p>
                VitaSignal systems are pre-market, patent-pending technologies classified as Non-Device Clinical Decision
                Support under §520(o)(1)(E) of the 21st Century Cures Act. They are:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li><strong>NOT</strong> cleared, approved, or authorized by the U.S. Food and Drug Administration (FDA).</li>
                <li><strong>NOT</strong> medical devices under applicable regulations.</li>
                <li><strong>NOT</strong> intended for clinical use, patient care, or diagnostic purposes.</li>
              </ul>
              <p className="mt-2">
                All data displayed on the technology demonstration dashboard is simulated and synthetic. Any performance
                metrics shown represent research results from retrospective analyses and are not validated for prospective
                clinical application.
              </p>
            </div>

            {/* 4. Intellectual Property */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">4. Intellectual Property</h2>
              <p>
                All content, technology, software, designs, logos, trademarks, trade secrets, and other intellectual property
                on this Website are the exclusive property of VitaSignal LLC unless otherwise indicated.
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li>VitaSignal LLC has filed 11 U.S. provisional patent applications with the USPTO.</li>
                <li>VitaSignal™, ChartMinder™, Documentation Burden Score™, and IDI™ are trademarks of VitaSignal LLC.</li>
                <li>All patent claims, algorithms, and methodologies are proprietary and confidential.</li>
              </ul>
              <p className="mt-2">
                You may not copy, reproduce, modify, distribute, transmit, display, sell, license, or create derivative works
                from any content on this Website without prior written consent from VitaSignal LLC.
              </p>
            </div>

            {/* 5. Permitted Use */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">5. Permitted & Prohibited Use</h2>
              <p className="mb-2">You may use this Website for lawful, informational purposes. You may <strong>not</strong>:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Attempt to reverse-engineer, decompile, or extract algorithms or methodologies from the technology demos.</li>
                <li>Use any content for competitive intelligence, patent filing, or prior art purposes.</li>
                <li>Circumvent authentication, access controls, or rate limiting mechanisms.</li>
                <li>Introduce malicious code, bots, or automated scraping tools.</li>
                <li>Misrepresent your affiliation or identity when submitting inquiries.</li>
                <li>Use the Website in any manner that could damage, disable, or impair its functionality.</li>
              </ul>
            </div>

            {/* 6. User Accounts */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">6. User Accounts & Access</h2>
              <p>
                Access to the technology demonstration dashboard requires approved credentials provisioned by VitaSignal LLC.
                Public registration is not available. You are responsible for maintaining the confidentiality of your
                account credentials and for all activity under your account. You must notify us immediately of any unauthorized
                access at <strong>info@vitasignal.ai</strong>.
              </p>
            </div>

            {/* 7. Warranty Disclaimer */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">7. Disclaimer of Warranties</h2>
              <p>
                THE WEBSITE AND ALL CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, COMPLETENESS, NON-INFRINGEMENT, OR TITLE.
              </p>
              <p className="mt-2">
                We do not warrant that the Website will be uninterrupted, error-free, secure, or free of viruses or
                other harmful components. Research results and performance metrics are based on retrospective analyses
                of historical datasets and may not be representative of prospective performance.
              </p>
            </div>

            {/* 8. Limitation of Liability */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">8. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VITASIGNAL LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES,
                AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION
                WITH YOUR USE OF THE WEBSITE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE),
                STRICT LIABILITY, OR ANY OTHER LEGAL THEORY.
              </p>
              <p className="mt-2">
                Our total aggregate liability for all claims arising from your use of the Website shall not exceed
                one hundred U.S. dollars ($100).
              </p>
            </div>

            {/* 9. Indemnification */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">9. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless VitaSignal LLC and its officers, directors, employees,
                and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including
                reasonable attorneys' fees) arising from: (a) your use of the Website; (b) your violation of these Terms;
                (c) your violation of any third-party rights; or (d) any content you submit to us.
              </p>
            </div>

            {/* 10. DMCA */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">10. Intellectual Property Infringement</h2>
              <p>
                If you believe that content on this Website infringes your intellectual property rights, please send a
                written notice to <strong>legal@vitasignal.ai</strong> including: (a) identification of the copyrighted work;
                (b) identification of the infringing material; (c) your contact information; (d) a statement of good faith
                belief; and (e) a statement under penalty of perjury that the information is accurate and you are authorized
                to act on behalf of the rights owner.
              </p>
            </div>

            {/* 11. Third-Party Links */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">11. Third-Party Links</h2>
              <p>
                This Website may contain links to third-party websites or services. We are not responsible for the content,
                privacy practices, or availability of external sites. Your use of third-party websites is at your own risk
                and subject to their respective terms and policies.
              </p>
            </div>

            {/* 12. Dispute Resolution */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">12. Dispute Resolution</h2>
              <p>
                Any dispute arising from these Terms or your use of the Website shall be resolved through binding
                arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules.
                The arbitration shall take place in the United States. You agree to waive any right to participate in
                a class action or class-wide arbitration.
              </p>
              <p className="mt-2">
                Notwithstanding the above, either party may seek injunctive or equitable relief in any court of competent
                jurisdiction for matters involving intellectual property rights.
              </p>
            </div>

            {/* 13. Governing Law */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">13. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States and applicable
                state law, without regard to conflict of law principles.
              </p>
            </div>

            {/* 14. Modifications */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">14. Modifications</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated
                "Last Updated" date. Material changes will be communicated via a prominent notice on the Website. Your continued
                use of the Website after modifications constitutes acceptance of the revised Terms.
              </p>
            </div>

            {/* 15. Severability */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">15. Severability</h2>
              <p>
                If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent
                jurisdiction, the remaining provisions shall remain in full force and effect. The invalid provision shall
                be modified to the minimum extent necessary to make it valid and enforceable.
              </p>
            </div>

            {/* 16. Entire Agreement */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">16. Entire Agreement</h2>
              <p>
                These Terms, together with the <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> and
                the <a href="/conflict-of-interest" className="text-primary hover:underline">Conflict of Interest Policy</a>,
                constitute the entire agreement between you and VitaSignal LLC regarding your use of the Website and
                supersede all prior agreements and understandings.
              </p>
            </div>

            {/* 17. Contact */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">17. Contact</h2>
              <p>For questions about these Terms:</p>
              <div className="mt-2 p-4 rounded-lg bg-muted/50 border border-border/30">
                <p><strong>VitaSignal LLC</strong></p>
                <p>Email: <a href="mailto:legal@vitasignal.ai" className="text-primary hover:underline">legal@vitasignal.ai</a></p>
                <p>General: <a href="mailto:info@vitasignal.ai" className="text-primary hover:underline">info@vitasignal.ai</a></p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-6 border-t border-border">
            Last Updated: March 17, 2026 · © 2025–2026 VitaSignal LLC. All Rights Reserved.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
