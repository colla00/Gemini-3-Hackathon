import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { RiskType } from '@/data/patients';

interface InterventionTimerProps {
  riskType: RiskType;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  className?: string;
}

interface ScheduledIntervention {
  id: string;
  label: string;
  intervalMinutes: number;
  lastPerformed: number; // minutes ago
  icon: typeof Clock;
}

const getInterventionsForRiskType = (riskType: RiskType): ScheduledIntervention[] => {
  const interventions: Record<RiskType, ScheduledIntervention[]> = {
    'Falls': [
      { id: 'hourly-round', label: 'Hourly Rounding', intervalMinutes: 60, lastPerformed: 45, icon: Clock },
      { id: 'bed-alarm', label: 'Bed Alarm Check', intervalMinutes: 120, lastPerformed: 90, icon: AlertTriangle },
    ],
    'Pressure Injury': [
      { id: 'reposition', label: 'Repositioning', intervalMinutes: 120, lastPerformed: 85, icon: Timer },
      { id: 'skin-check', label: 'Skin Assessment', intervalMinutes: 240, lastPerformed: 180, icon: CheckCircle2 },
    ],
    'CAUTI': [
      { id: 'catheter-review', label: 'Catheter Necessity', intervalMinutes: 1440, lastPerformed: 720, icon: Clock },
      { id: 'bag-empty', label: 'Drainage Bag Check', intervalMinutes: 480, lastPerformed: 420, icon: Timer },
    ],
    'Device Complication': [
      { id: 'site-inspect', label: 'Site Inspection', intervalMinutes: 480, lastPerformed: 360, icon: AlertTriangle },
      { id: 'dressing-change', label: 'Dressing Change', intervalMinutes: 1440, lastPerformed: 1200, icon: Timer },
    ],
  };
  
  return interventions[riskType] || [];
};

const formatTimeRemaining = (minutes: number): string => {
  if (minutes <= 0) return 'Due now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const InterventionTimer = ({ riskType, riskLevel, className }: InterventionTimerProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const interventions = getInterventionsForRiskType(riskType);
  
  // Simulate time progression for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
      <div className={cn("bg-card rounded-xl border border-border/50 p-4 shadow-card", className)}>
        <div className="flex items-center gap-2 mb-3">
          <Timer className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Intervention Schedule
          </h4>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary ml-auto">
            U.S. Patent Application Filed
          </span>
        </div>
        
        <div className="space-y-2">
          {interventions.map((intervention) => {
            const timeRemaining = intervention.intervalMinutes - intervention.lastPerformed - currentTime;
            const isOverdue = timeRemaining <= 0;
            const isUrgent = timeRemaining > 0 && timeRemaining <= 15;
            const progress = Math.min(100, ((intervention.lastPerformed + currentTime) / intervention.intervalMinutes) * 100);
            
            return (
              <Tooltip key={intervention.id}>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "relative p-2 rounded-lg border transition-all",
                    isOverdue && "bg-risk-high/10 border-risk-high/30",
                    isUrgent && !isOverdue && "bg-risk-medium/10 border-risk-medium/30",
                    !isOverdue && !isUrgent && "bg-secondary/30 border-border/30"
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <intervention.icon className={cn(
                          "w-3 h-3",
                          isOverdue && "text-risk-high animate-pulse",
                          isUrgent && !isOverdue && "text-risk-medium",
                          !isOverdue && !isUrgent && "text-muted-foreground"
                        )} />
                        <span className="text-xs font-medium text-foreground">
                          {intervention.label}
                        </span>
                      </div>
                      <span className={cn(
                        "text-xs font-bold",
                        isOverdue && "text-risk-high",
                        isUrgent && !isOverdue && "text-risk-medium",
                        !isOverdue && !isUrgent && "text-muted-foreground"
                      )}>
                        {formatTimeRemaining(timeRemaining)}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-1 bg-secondary/50 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isOverdue && "bg-risk-high",
                          isUrgent && !isOverdue && "bg-risk-medium",
                          !isOverdue && !isUrgent && "bg-primary/50"
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p className="font-medium">{intervention.label}</p>
                    <p className="text-muted-foreground">
                      Interval: {formatTimeRemaining(intervention.intervalMinutes)}
                    </p>
                    <p className="text-muted-foreground">
                      Last: {formatTimeRemaining(intervention.lastPerformed)} ago
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        
        <p className="text-[9px] text-muted-foreground mt-3 italic">
          AI-guided intervention scheduling • Efficacy tracking enabled
        </p>
      </div>
    </TooltipProvider>
  );
};