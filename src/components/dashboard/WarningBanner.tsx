import { AlertTriangle } from 'lucide-react';

export const WarningBanner = () => {
  return (
    <div className="w-full bg-warning/20 border-b border-warning/40 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <AlertTriangle className="w-5 h-5 text-warning animate-pulse" />
        <span className="text-warning font-semibold text-sm tracking-wide">
          ⚠️ Synthetic Demonstration — Not Real Patient Data
        </span>
        <AlertTriangle className="w-5 h-5 text-warning animate-pulse" />
      </div>
    </div>
  );
};
