import { AlertTriangle, FileText, Award, Database } from 'lucide-react';

export const ResearchBanner = () => {
  return (
    <div className="w-full bg-warning/15 border-b border-warning/30 py-1.5 px-4">
      <div className="flex items-center justify-center gap-3 text-[11px] flex-wrap">
        <AlertTriangle className="w-3.5 h-3.5 text-warning animate-pulse" />
        <span className="text-warning font-semibold uppercase tracking-wide">
          Research Prototype — U.S. Provisional Patent App. No. 63/932,953
        </span>
        <span className="text-warning/70 hidden sm:inline">
          • Synthetic Data Only
        </span>
        <span className="text-warning/70 hidden md:inline">
          • Not for clinical use
        </span>
        <div className="hidden lg:flex items-center gap-2 text-warning/70">
          <Database className="w-3 h-3" />
          <span>AUROC 0.89 • Sens 0.87 • Spec 0.86</span>
        </div>
        <div className="hidden xl:flex items-center gap-2 text-warning/70">
          <FileText className="w-3 h-3" />
          <span>IRB Planned</span>
        </div>
        <div className="hidden xl:flex items-center gap-2 text-warning/70">
          <Award className="w-3 h-3" />
          <span>Patent Pending</span>
        </div>
        <AlertTriangle className="w-3.5 h-3.5 text-warning animate-pulse" />
      </div>
    </div>
  );
};