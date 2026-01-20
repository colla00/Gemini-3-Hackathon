import { Users, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface QuickStatsProps {
  total: number;
  high: number;
  medium: number;
  trending: number;
}

// Convert counts to qualitative indicators
const getQualitativeLabel = (count: number, type: 'patients' | 'elevated' | 'rising') => {
  if (type === 'patients') {
    return count === 0 ? 'None' : count === 1 ? 'One' : count <= 3 ? 'Few' : 'Several';
  }
  if (count === 0) return 'None';
  if (count === 1) return 'One';
  if (count <= 2) return 'Some';
  return 'Multiple';
};

export const QuickStats = ({ total, high, medium, trending }: QuickStatsProps) => {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2.5 mb-6">
        <StatPill
          icon={<Users className="w-3.5 h-3.5" />}
          label="Patients"
          qualitative={getQualitativeLabel(total, 'patients')}
          tooltip="Patients currently monitored"
        />
        <div className="w-px h-6 bg-border/40 hidden sm:block" />
        <StatPill
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          label="Elevated"
          qualitative={getQualitativeLabel(high, 'elevated')}
          color="high"
          pulse={high > 0}
          tooltip="Patients with elevated signals requiring review"
        />
        <StatPill
          icon={<Activity className="w-3.5 h-3.5" />}
          label="Moderate"
          qualitative={getQualitativeLabel(medium, 'elevated')}
          color="medium"
          tooltip="Patients with moderate signal levels"
        />
        <StatPill
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          label="Rising"
          qualitative={getQualitativeLabel(trending, 'rising')}
          color="warning"
          tooltip="Patients with rising trajectory"
        />
      </div>
    </TooltipProvider>
  );
};

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  qualitative: string;
  color?: 'high' | 'medium' | 'warning';
  pulse?: boolean;
  tooltip: string;
}

const StatPill = ({ icon, label, qualitative, color, pulse, tooltip }: StatPillProps) => {
  const colorStyles = {
    high: 'text-risk-high',
    medium: 'text-risk-medium',
    warning: 'text-warning',
  };

  const bgStyles = {
    high: 'bg-risk-high/10 border-risk-high/25',
    medium: 'bg-risk-medium/10 border-risk-medium/25',
    warning: 'bg-warning/10 border-warning/25',
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-300 cursor-default shadow-sm hover:shadow-md",
          color ? bgStyles[color] : "bg-card/60 border-border/30",
          pulse && "animate-pulse-subtle"
        )}>
          <span className={cn("text-muted-foreground", color && colorStyles[color])}>
            {icon}
          </span>
          <span className={cn("text-sm font-bold", color ? colorStyles[color] : "text-foreground")}>
            {qualitative}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            {label}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
