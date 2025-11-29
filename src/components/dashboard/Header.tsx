import { Activity, Shield } from 'lucide-react';
import { LiveBadge } from './LiveBadge';
import { InfoModal } from './InfoModal';

export const Header = () => {
  return (
    <header className="w-full py-4 px-4 md:px-8 border-b border-border/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/15 border border-primary/20">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
              Clinical Risk Monitor
            </h1>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">
              Research Prototype
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 border border-border/30">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">
              Stanford AI+HEALTH 2025
            </span>
          </div>
          
          <InfoModal />
          
          <LiveBadge />
        </div>
      </div>
    </header>
  );
};
