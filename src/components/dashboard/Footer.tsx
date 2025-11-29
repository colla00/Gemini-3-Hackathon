import { AlertTriangle, FlaskConical } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full py-4 px-8 border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2 text-risk-medium">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-wide">
            Research Prototype — Not for Clinical Use
          </span>
        </div>
        
        <span className="hidden sm:inline text-muted-foreground">|</span>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <FlaskConical className="w-4 h-4" />
          <span className="text-sm">
            Synthetic demonstration data only
          </span>
        </div>
        
        <span className="hidden sm:inline text-muted-foreground">|</span>
        
        <span className="text-sm text-muted-foreground">
          For educational purposes at Stanford AI+HEALTH 2025
        </span>
      </div>
    </footer>
  );
};
