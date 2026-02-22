import { AlertTriangle } from 'lucide-react';

export const DemoFooterDisclaimer = () => {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/[0.04] p-6 md:p-8">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">Research Prototype Disclaimer</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This demonstration uses simulated/de-identified data for educational purposes only. VitaSignal
            is NOT FDA-cleared, NOT approved for clinical use, and NOT a medical device. All clinical
            decisions require qualified healthcare professionals. Patent #1 (ICU Mortality, n=26,153) and
            Patent #5 (DBS, N=321,719) have completed validation.
          </p>
        </div>
      </div>
    </div>
  );
};