import { FlaskConical, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResearchDisclaimerProps {
  variant?: 'banner' | 'watermark';
  className?: string;
}

export const ResearchDisclaimer = ({ variant = 'banner', className }: ResearchDisclaimerProps) => {
  if (variant === 'watermark') {
    return (
      <div className={cn(
        "fixed bottom-4 right-4 z-40 pointer-events-none select-none opacity-60",
        className
      )}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm">
          <FlaskConical className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            Research Prototype
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full bg-amber-500/10 border-b border-amber-500/30 py-2 px-4",
      className
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium text-center">
          <span className="font-bold uppercase tracking-wider">Research Prototype</span>
          <span className="mx-2">·</span>
          <span>Not FDA cleared. Not for clinical use. Synthetic demonstration data only.</span>
        </p>
      </div>
    </div>
  );
};