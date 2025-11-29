import { Activity, Shield, Info } from 'lucide-react';
import { LiveBadge } from './LiveBadge';
import { InfoModal } from './InfoModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const Header = () => {
  return (
    <TooltipProvider>
      <header className="w-full py-4 px-4 md:px-8 border-b border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold tracking-tight text-foreground">
                EHR-Driven Quality Dashboard
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wide">
                Nurse-Sensitive Outcome Prediction · Research Prototype
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/30 cursor-default">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-semibold text-primary tracking-wide uppercase">
                    Stanford AI+HEALTH 2025
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Research prototype for academic demonstration</p>
              </TooltipContent>
            </Tooltip>
            
            <InfoModal />
            
            <LiveBadge />
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};
