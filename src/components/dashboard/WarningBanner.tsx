import { AlertTriangle } from 'lucide-react';

export const WarningBanner = () => {
  return (
    <div className="w-full bg-warning/10 border-b border-warning/30 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <AlertTriangle className="w-5 h-5 text-warning animate-pulse" />
        <span className="text-warning font-semibold text-base tracking-wide">
          Synthetic demonstration — not real patient data
        </span>
      </div>
    </div>
  );
};
