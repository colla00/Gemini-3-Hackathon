import { AlertTriangle } from 'lucide-react';

export const ResearchBanner = () => {
  return (
    <div className="w-full bg-warning/15 border-b border-warning/30 py-1.5 px-4">
      <div className="flex items-center justify-center gap-2 text-[11px]">
        <AlertTriangle className="w-3.5 h-3.5 text-warning" />
        <span className="text-warning font-semibold uppercase tracking-wide">
          Research Prototype — Synthetic Data Only
        </span>
        <span className="text-warning/70 hidden sm:inline">
          • Not for clinical use
        </span>
        <AlertTriangle className="w-3.5 h-3.5 text-warning" />
      </div>
    </div>
  );
};
