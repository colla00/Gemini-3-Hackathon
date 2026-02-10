import { Shield, Award } from 'lucide-react';
import { PATENT_PORTFOLIO } from '@/constants/patent';

export const Footer = () => {
  const filedCount = PATENT_PORTFOLIO.filter(p => p.status === 'filed').length;
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 py-3 px-4 bg-background/95 backdrop-blur-md border-t border-border/30 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-primary/60" />
          <span className="font-semibold text-foreground/80">
            Copyright © Dr. Alexis Collier | NSO Quality Dashboard
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] flex-wrap justify-center opacity-60">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Award className="w-2.5 h-2.5" />
            <span>{filedCount} Patent Applications Filed</span>
          </div>
          <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" />
          <span className="text-muted-foreground/80">
            Protected Design
          </span>
        </div>
      </div>
    </footer>
  );
};
