import { Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 py-3 px-4 bg-background/95 backdrop-blur-md border-t border-border/30 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-primary/60" />
          <span className="font-semibold text-foreground/80">
            Copyright © Dr. Alexis Collier | Clinical Risk Intelligence Dashboard
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            Patent Pending
          </span>
          <span className="opacity-70">
            Protected Design – Do Not Copy
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span className="opacity-60">
            Research prototype using mock, de-identified data
          </span>
        </div>
      </div>
    </footer>
  );
};
