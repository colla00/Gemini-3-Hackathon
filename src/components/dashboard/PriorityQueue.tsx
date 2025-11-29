import { AlertTriangle, TrendingUp, TrendingDown, Minus, Info, ChevronRight, Star, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Patient } from '@/data/patients';
import { RiskTrendChart } from './RiskTrendChart';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PriorityQueueProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
  displayTime: (minutes: number) => string;
}

export const PriorityQueue = ({ patients, onSelect, displayTime }: PriorityQueueProps) => {
  const topPatients = patients.slice(0, 3);

  return (
    <TooltipProvider>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-risk-high/10">
              <Activity className="w-4 h-4 text-risk-high" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Priority Queue
              </h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Risk trajectory requiring clinician review
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {topPatients.map((patient, index) => (
            <PriorityCard
              key={patient.id}
              patient={patient}
              rank={index + 1}
              onClick={() => onSelect(patient)}
              displayTime={displayTime(patient.lastUpdatedMinutes)}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

interface PriorityCardProps {
  patient: Patient;
  rank: number;
  onClick: () => void;
  displayTime: string;
}

const PriorityCard = ({ patient, rank, onClick, displayTime }: PriorityCardProps) => {
  const TrendIcon = patient.trend === 'up' ? TrendingUp : patient.trend === 'down' ? TrendingDown : Minus;
  
  const riskStyles = {
    HIGH: {
      border: 'border-l-risk-high',
      badge: 'bg-risk-high/10 text-risk-high',
      score: 'text-risk-high',
      pulse: 'animate-pulse-subtle',
    },
    MEDIUM: {
      border: 'border-l-risk-medium',
      badge: 'bg-risk-medium/10 text-risk-medium',
      score: 'text-risk-medium',
      pulse: '',
    },
    LOW: {
      border: 'border-l-risk-low',
      badge: 'bg-risk-low/10 text-risk-low',
      score: 'text-risk-low',
      pulse: '',
    },
  }[patient.riskLevel];

  const trendStyles = {
    up: { color: 'text-risk-high', label: 'Rising' },
    down: { color: 'text-risk-low', label: 'Falling' },
    stable: { color: 'text-muted-foreground', label: 'Stable' },
  }[patient.trend];

  // Get top 3 contributing factors for hover reveal
  const topFactors = [...patient.riskFactors]
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    .slice(0, 3);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "relative w-full text-left rounded-xl bg-card border border-border/30",
            "border-l-[3px]",
            riskStyles.border,
            "hover:border-primary/40 hover:shadow-glow transition-all duration-300",
            "hover:-translate-y-1",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
            "group"
          )}
        >
          {/* Rank indicator */}
          <div className={cn(
            "absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-card border-2 border-border/50 flex items-center justify-center",
            patient.riskLevel === 'HIGH' && riskStyles.pulse
          )}>
            <span className="text-[10px] font-bold text-foreground">#{rank}</span>
          </div>

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {patient.id}
                  </span>
                  {patient.isDemo && (
                    <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground font-medium">{patient.riskType}</span>
              </div>
              
              <span className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide",
                riskStyles.badge
              )}>
                {patient.riskLevel}
              </span>
            </div>

            {/* Score & Trend */}
            <div className="flex items-end justify-between mb-4">
              <div className="flex items-baseline gap-1">
                <span className={cn("text-4xl font-extrabold tracking-tight", riskStyles.score)}>
                  {patient.riskScore}
                </span>
                <span className={cn("text-lg font-semibold", riskStyles.score)}>%</span>
              </div>
              
              <div className={cn("flex items-center gap-1.5 text-xs font-medium", trendStyles.color)}>
                <TrendIcon className="w-4 h-4" />
                <span>{trendStyles.label}</span>
              </div>
            </div>

            {/* Risk Trajectory Mini Chart */}
            <RiskTrendChart 
              currentScore={patient.riskScore} 
              trend={patient.trend}
              className="mb-4 -mx-1"
            />

            {/* Human-readable explanation */}
            <div className="p-3 rounded-lg bg-secondary/40 border border-border/20">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {patient.riskSummary}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/20">
              <span className="text-[10px] text-muted-foreground font-medium">{displayTime}</span>
              <div className="flex items-center gap-1 text-[11px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-semibold">View Analysis</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs p-3">
        <p className="text-xs font-semibold text-foreground mb-2">Top Contributing Factors</p>
        <div className="space-y-1">
          {topFactors.map(factor => (
            <div key={factor.name} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{factor.name}</span>
              <span className={cn(
                "font-mono font-medium",
                factor.contribution >= 0 ? "text-risk-high" : "text-risk-low"
              )}>
                {factor.contribution >= 0 ? '+' : ''}{factor.contribution.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
