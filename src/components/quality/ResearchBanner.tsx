import { AlertTriangle } from 'lucide-react';

export const ResearchBanner = () => {
  return (
    <div className="w-full bg-warning/20 border-b border-warning/40 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap text-center">
        <AlertTriangle className="w-5 h-5 text-warning animate-pulse flex-shrink-0" />
        <span className="text-warning font-bold text-sm tracking-wider uppercase">
          ⚠️ Research Prototype — Synthetic Data Only
        </span>
        <AlertTriangle className="w-5 h-5 text-warning animate-pulse flex-shrink-0" />
      </div>
      <p className="text-center text-warning/80 text-xs mt-1">
        This demonstration uses simulated data for educational purposes. Not for clinical use.
      </p>
    </div>
  );
};
