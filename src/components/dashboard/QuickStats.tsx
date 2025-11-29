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

export const QuickStats = ({ total, high, medium, trending }: QuickStatsProps) => {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <StatPill
          icon={<Users className="w-3.5 h-3.5" />}
          value={total}
          label="Patients"
          tooltip="Total patients currently monitored"
        />
        <div className="w-px h-5 bg-border/40 hidden sm:block" />
        <StatPill
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          value={high}
          label="Urgent"
          color="high"
          pulse={high > 0}
          tooltip="High-risk patients requiring clinician review"
        />
        <StatPill
          icon={<Activity className="w-3.5 h-3.5" />}
          value={medium}
          label="Elevated"
          color="medium"
          tooltip="Patients with elevated risk trajectory"
        />
        <StatPill
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          value={trending}
          label="Rising"
          color="warning"
          tooltip="Patients with increasing risk trends"
        />
      </div>
    </TooltipProvider>
  );
};

interface StatPillProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color?: 'high' | 'medium' | 'warning';
  pulse?: boolean;
  tooltip: string;
}

const StatPill = ({ icon, value, label, color, pulse, tooltip }: StatPillProps) => {
  const colorStyles = {
    high: 'text-risk-high',
    medium: 'text-risk-medium',
    warning: 'text-warning',
  };

  const bgStyles = {
    high: 'bg-risk-high/5 border-risk-high/20',
    medium: 'bg-risk-medium/5 border-risk-medium/20',
    warning: 'bg-warning/5 border-warning/20',
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 cursor-default",
          color ? bgStyles[color] : "bg-card/50 border-border/20",
          pulse && "animate-pulse-subtle"
        )}>
          <span className={cn("text-muted-foreground", color && colorStyles[color])}>
            {icon}
          </span>
          <span className={cn("text-sm font-bold tabular-nums", color ? colorStyles[color] : "text-foreground")}>
            {value}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
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
