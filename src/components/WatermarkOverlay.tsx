import { Shield, AlertTriangle } from 'lucide-react';
import { PATENT_PORTFOLIO } from '@/constants/patent';

export const WatermarkOverlay = () => {
  const filedCount = PATENT_PORTFOLIO.filter(p => p.status === 'filed').length;
  const watermarkText = `RESEARCH PROTOTYPE – NO CLINICAL VALIDATION – © Dr. Alexis Collier – ${filedCount} U.S. Patents Filed`;
  
  // Create a grid of watermarks
  const rows = 8;
  const cols = 4;
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none print:block"
      aria-hidden="true"
    >
      {/* Diagonal repeating watermark pattern */}
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-y-32">
        {Array.from({ length: rows * cols }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-foreground/[0.04] dark:text-foreground/[0.06] -rotate-[25deg] whitespace-nowrap"
            style={{
              width: `${100 / cols}%`,
              paddingLeft: index % 2 === 0 ? '5%' : '15%',
            }}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-semibold tracking-wide">
              {watermarkText}
            </span>
          </div>
        ))}
      </div>
      
      {/* Research Prototype badge - top right */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 text-warning/30 dark:text-warning/40">
        <AlertTriangle className="w-3 h-3" />
        <span className="text-[10px] font-bold tracking-wider uppercase">
          Research Prototype
        </span>
      </div>
      
      {/* No Clinical Validation badge - bottom left */}
      <div className="absolute bottom-16 left-4 flex items-center gap-1.5 text-warning/30 dark:text-warning/40">
        <AlertTriangle className="w-3 h-3" />
        <span className="text-[10px] font-bold tracking-wider uppercase">
          No Clinical Validation
        </span>
      </div>
      
      {/* Patent protection badge - bottom right */}
      <div className="absolute bottom-16 right-4 flex items-center gap-1.5 text-foreground/[0.08] dark:text-foreground/[0.1]">
        <Shield className="w-3 h-3" />
        <span className="text-[10px] font-medium tracking-wider uppercase">
          Protected Design – Do Not Copy
        </span>
      </div>

    </div>
  );
};
