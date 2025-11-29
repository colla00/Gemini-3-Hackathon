import { AlertTriangle, FlaskConical } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 py-3 px-8 bg-card/95 backdrop-blur-sm border-t border-border/50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
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
      </div>
    </footer>
  );
};
