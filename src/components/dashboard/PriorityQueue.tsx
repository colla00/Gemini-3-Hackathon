import { AlertTriangle, TrendingUp, TrendingDown, Minus, Info, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Patient } from '@/data/patients';
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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-risk-high" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Priority Queue
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Highest risk patients requiring attention
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
      badge: 'bg-risk-high/10 text-risk-high border-risk-high/20',
      score: 'text-risk-high',
      glow: 'shadow-[0_0_20px_rgba(220,38,38,0.1)]',
    },
    MEDIUM: {
      border: 'border-l-risk-medium',
      badge: 'bg-risk-medium/10 text-risk-medium border-risk-medium/20',
      score: 'text-risk-medium',
      glow: '',
    },
    LOW: {
      border: 'border-l-risk-low',
      badge: 'bg-risk-low/10 text-risk-low border-risk-low/20',
      score: 'text-risk-low',
      glow: '',
    },
  }[patient.riskLevel];

  const trendStyles = {
    up: { color: 'text-risk-high', label: 'Rising' },
    down: { color: 'text-risk-low', label: 'Falling' },
    stable: { color: 'text-muted-foreground', label: 'Stable' },
  }[patient.trend];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full text-left rounded-xl bg-card border border-border/30",
        "border-l-[3px]",
        riskStyles.border,
        riskStyles.glow,
        "hover:border-primary/40 hover:shadow-glow transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
        "group"
      )}
    >
      {/* Rank indicator */}
      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-card border border-border/50 flex items-center justify-center">
        <span className="text-[10px] font-bold text-muted-foreground">#{rank}</span>
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {patient.id}
              </span>
              {patient.isDemo && (
                <Star className="w-3 h-3 text-warning fill-warning" />
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">{patient.riskType}</span>
          </div>
          
          <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
            riskStyles.badge
          )}>
            {patient.riskLevel}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-end justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span className={cn("text-3xl font-extrabold tracking-tight", riskStyles.score)}>
              {patient.riskScore}
            </span>
            <span className={cn("text-sm font-semibold", riskStyles.score)}>%</span>
          </div>
          
          <div className={cn("flex items-center gap-1 text-xs", trendStyles.color)}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span className="font-medium">{trendStyles.label}</span>
          </div>
        </div>

        {/* Explanation */}
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/30 border border-border/20">
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="text-xs">Click to view full risk factor analysis and clinical recommendations.</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {patient.riskSummary}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/20">
          <span className="text-[10px] text-muted-foreground">{displayTime}</span>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground group-hover:text-primary transition-colors">
            <span className="font-medium">View Details</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </button>
  );
};
