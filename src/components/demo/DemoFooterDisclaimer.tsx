import { AlertTriangle } from 'lucide-react';

export const DemoFooterDisclaimer = () => {
  return (
    <section className="rounded-xl border border-destructive/20 bg-destructive/[0.04] p-6">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">Research Prototype Disclaimer</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This demonstration uses simulated/de-identified data for educational purposes only. VitaSignal
            is NOT FDA-cleared, NOT approved for clinical use, and NOT a medical device. All clinical
            decisions require qualified healthcare professionals. Only VitaSignal Mortality (Patent #1) has
            completed validation on n=26,153 ICU patients.
          </p>
        </div>
      </div>
    </section>
  );
};
