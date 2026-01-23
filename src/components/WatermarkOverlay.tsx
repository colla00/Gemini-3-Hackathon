import { Shield } from 'lucide-react';
import { PATENT_NUMBER } from '@/constants/patent';

export const WatermarkOverlay = () => {
  const watermarkText = `© Dr. Alexis Collier – U.S. Patent ${PATENT_NUMBER} Pending | info@alexiscollier.com`;
  
  // Create a grid of watermarks
  const rows = 8;
  const cols = 4;
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
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
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-semibold tracking-wide">
              {watermarkText}
            </span>
          </div>
        ))}
      </div>
      
      {/* Corner badges for additional protection */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 text-foreground/[0.08] dark:text-foreground/[0.1]">
        <Shield className="w-3 h-3" />
        <span className="text-[10px] font-medium tracking-wider uppercase">
          Protected Design
        </span>
      </div>
      
      <div className="absolute bottom-16 left-4 flex items-center gap-1.5 text-foreground/[0.08] dark:text-foreground/[0.1]">
        <Shield className="w-3 h-3" />
        <span className="text-[10px] font-medium tracking-wider uppercase">
          Do Not Copy
        </span>
      </div>

    </div>
  );
};
