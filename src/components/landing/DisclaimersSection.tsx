import { Shield } from 'lucide-react';

export const DisclaimersSection = () => (
  <section className="py-12 px-6 bg-risk-high/5 border-t border-risk-high/20">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <Shield className="w-5 h-5 text-risk-high" aria-hidden="true" />
        <h3 className="text-lg font-bold text-foreground">Important Legal Disclaimers</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-xs text-muted-foreground">
        <div className="p-4 rounded-lg bg-card border border-border/50">
          <p className="font-semibold text-foreground mb-2">RESEARCH PROTOTYPE STATUS</p>
          <p className="mb-2">
            VitaSignal™ systems are research prototypes for demonstration and validation purposes only.
          </p>
          <ul className="space-y-1">
            <li>• NOT FDA cleared, approved, or authorized</li>
            <li>• NOT medical devices</li>
            <li>• NOT for clinical decision-making</li>
            <li>• NOT validated for actual patient care</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg bg-card border border-border/50">
          <p className="font-semibold text-foreground mb-2">Performance Data</p>
          <p>
            All metrics are from retrospective research studies using de-identified datasets.
            Results do not represent prospective clinical trial outcomes.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-card border border-border/50">
          <p className="font-semibold text-foreground mb-2">IP Status</p>
          <p>
            All patents are provisional applications subject to USPTO examination.
            Final patent grants are not guaranteed.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-card border border-border/50">
          <p className="font-semibold text-foreground mb-2">Government Rights</p>
          <p>
            Research supported by NIH grants K12 HL138039-06 and 1OT2OD032581.
            The U.S. Government retains certain non-commercial use rights under the Bayh-Dole Act.
          </p>
        </div>
      </div>
    </div>
  </section>
);
