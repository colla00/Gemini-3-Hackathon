import { TrendingUp, TrendingDown, Minus, Clock, Star, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskBadge } from './RiskBadge';
import { RiskTrendChart } from './RiskTrendChart';
import type { Patient } from '@/data/patients';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
  index: number;
  displayTime: string;
  isRefreshing?: boolean;
  showSparkline?: boolean;
}

// Convert numeric risk to categorical signal
const getRiskSignal = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'HIGH': return 'Elevated';
    case 'MEDIUM': return 'Moderate';
    case 'LOW': return 'Low';
    default: return 'Low';
  }
};

// Get qualitative trend label
const getTrendLabel = (trend: string): string => {
  switch (trend) {
    case 'up': return 'Rising';
    case 'down': return 'Declining';
    default: return 'Stable';
  }
};

export const PatientCard = ({ patient, onClick, index, displayTime, isRefreshing, showSparkline = true }: PatientCardProps) => {
  const TrendIcon = patient.trend === 'up' ? TrendingUp : patient.trend === 'down' ? TrendingDown : Minus;
  const trendColor = patient.trend === 'up' ? 'text-risk-high' : patient.trend === 'down' ? 'text-risk-low' : 'text-muted-foreground';
  const trendLabel = getTrendLabel(patient.trend);
  const trendBg = patient.trend === 'up' ? 'bg-risk-high/10' : patient.trend === 'down' ? 'bg-risk-low/10' : 'bg-secondary';

  const riskSignal = getRiskSignal(patient.riskLevel);
  const riskSignalColor = {
    HIGH: 'text-risk-high',
    MEDIUM: 'text-risk-medium',
    LOW: 'text-risk-low',
  }[patient.riskLevel];

  const riskBorderColor = {
    HIGH: 'border-l-risk-high',
    MEDIUM: 'border-l-risk-medium',
    LOW: 'border-l-risk-low',
  }[patient.riskLevel];

  const isHighRisk = patient.riskLevel === 'HIGH';

  return (
    <TooltipProvider>
      <button
        onClick={onClick}
        className={cn(
          "w-full rounded-xl bg-card border border-border/40 shadow-card",
          "border-l-4",
          riskBorderColor,
          "hover:border-primary/50 hover:shadow-glow hover:-translate-y-1 transition-all duration-300",
          "text-left group animate-slide-up",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          "active:scale-[0.98]",
          isHighRisk && "ring-1 ring-risk-high/20"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Header Section */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {patient.id}
                </h3>
                {patient.isDemo && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-warning/20 text-warning">
                        <Star className="w-3 h-3 fill-warning" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Featured demo case</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {patient.riskType}
              </p>
            </div>
            <RiskBadge level={patient.riskLevel} />
          </div>
        </div>

        {/* Risk Signal Section - Categorical */}
        <div className="px-4 pb-2">
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className={cn("text-2xl font-extrabold tracking-tight", riskSignalColor)}>
                {riskSignal}
              </span>
              <span className="text-xs text-muted-foreground">risk signal</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md", trendBg)}>
                  <TrendIcon className={cn("w-3.5 h-3.5", trendColor)} />
                  <span className={cn("text-xs font-semibold", trendColor)}>
                    {trendLabel}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Risk trend over recent observations</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Sparkline Trend Chart */}
        {showSparkline && (
          <div className="px-4 pb-2">
            <RiskTrendChart 
              currentScore={patient.riskScore} 
              trend={patient.trend}
              className="h-14"
              showConfidenceBands={false}
              showHorizons={false}
            />
          </div>
        )}

        {/* Micro-explanation */}
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {patient.riskSummary}
          </p>
        </div>

        {/* Footer Section */}
        <div className="px-4 py-3 border-t border-border/30 bg-secondary/20 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className={cn("w-3 h-3", isRefreshing && "animate-pulse")} />
              <span className="text-xs">{displayTime}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
              <span className="text-xs font-medium">Details</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </button>
    </TooltipProvider>
  );
};
