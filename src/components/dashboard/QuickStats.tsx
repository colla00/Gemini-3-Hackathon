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
      <div className="flex items-center gap-2 mb-5">
        <StatPill
          icon={<Users className="w-3.5 h-3.5" />}
          value={total}
          label="Total"
          tooltip="Total patients in unit"
        />
        <div className="w-px h-4 bg-border/30" />
        <StatPill
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          value={high}
          label="Urgent"
          color="high"
          tooltip="Patients requiring immediate attention"
        />
        <StatPill
          icon={<Activity className="w-3.5 h-3.5" />}
          value={medium}
          label="Elevated"
          color="medium"
          tooltip="Patients with elevated risk levels"
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
  tooltip: string;
}

const StatPill = ({ icon, value, label, color, tooltip }: StatPillProps) => {
  const colorStyles = {
    high: 'text-risk-high',
    medium: 'text-risk-medium',
    warning: 'text-warning',
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border/20 cursor-default">
          <span className={cn("text-muted-foreground", color && colorStyles[color])}>
            {icon}
          </span>
          <span className={cn("text-sm font-bold", color ? colorStyles[color] : "text-foreground")}>
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
