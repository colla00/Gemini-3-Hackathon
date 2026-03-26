import { AlertTriangle } from 'lucide-react';

export const GlobalDisclaimer = () => (
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-muted/95 backdrop-blur-sm border-t border-border/40 py-2 px-4 text-center">
    <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
      <AlertTriangle className="w-3 h-3 text-warning flex-shrink-0" />
      <span>
        <strong className="font-semibold uppercase tracking-wider">Pre-Market Research Prototype</strong>
        <span className="mx-1.5">·</span>
        Not FDA cleared or approved. Not a medical device. Not for clinical use. Simulated data only.
        <span className="mx-1.5">·</span>
        © 2025–2026 VitaSignal LLC. All rights reserved.
      </span>
      <AlertTriangle className="w-3 h-3 text-warning flex-shrink-0 hidden sm:block" />
    </div>
  </div>
);
