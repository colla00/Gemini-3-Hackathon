import { TrendingDown, CheckCircle2, Activity, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EfficacyBadgeProps {
  interventionType: string;
  beforeScore: number;
  afterScore: number;
  className?: string;
}

export const EfficacyBadge = ({ interventionType, beforeScore, afterScore, className }: EfficacyBadgeProps) => {
  const reduction = beforeScore - afterScore;
  const isEffective = reduction > 0;
  
  // Convert to qualitative label
  const getEffectLabel = () => {
    if (reduction <= 0) return 'Monitoring';
    if (reduction > 20) return 'Strong';
    if (reduction > 10) return 'Moderate';
    return 'Mild';
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium transition-all",
            isEffective 
              ? "bg-risk-low/10 border-risk-low/30 text-risk-low" 
              : "bg-risk-medium/10 border-risk-medium/30 text-risk-medium",
            className
          )}>
            {isEffective ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Activity className="w-3 h-3" />
            )}
            <span>{getEffectLabel()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">Intervention Effect</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {interventionType}: {getEffectLabel()} impact observed
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Summary component for multiple interventions
interface EfficacySummaryProps {
  patientId: string;
  className?: string;
}

export const EfficacySummary = ({ patientId, className }: EfficacySummaryProps) => {
  // Simulated efficacy data
  const efficacyData = [
    { type: 'Bed Alarm Activation', before: 78, after: 52 },
    { type: 'Hourly Rounding', before: 65, after: 48 },
    { type: 'Medication Timing', before: 72, after: 58 },
  ];
  
  const effectiveCount = efficacyData.filter(d => d.before > d.after).length;
  
  return (
    <div className={cn("bg-card rounded-xl border border-border/50 p-4 shadow-card", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Intervention Effects
          </h4>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-risk-low/10 border border-risk-low/30">
          <TrendingDown className="w-3 h-3 text-risk-low" />
          <span className="text-xs font-medium text-risk-low">
            {effectiveCount === efficacyData.length ? 'All Effective' : `${effectiveCount} Effective`}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        {efficacyData.map((data, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded bg-secondary/30">
            <span className="text-xs text-foreground">{data.type}</span>
            <EfficacyBadge 
              interventionType={data.type}
              beforeScore={data.before}
              afterScore={data.after}
            />
          </div>
        ))}
      </div>
      
      <p className="text-[9px] text-muted-foreground mt-3 italic flex items-center gap-1">
        <CheckCircle2 className="w-2.5 h-2.5" />
        Closed-loop effect tracking · U.S. Patent Application Filed
      </p>
    </div>
  );
};