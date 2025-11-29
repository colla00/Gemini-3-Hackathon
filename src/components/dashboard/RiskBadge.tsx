import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/data/patients';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showIcon?: boolean;
}

export const RiskBadge = ({ level, className, showIcon = true }: RiskBadgeProps) => {
  const baseStyles = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase";
  
  const levelStyles = {
    HIGH: "bg-risk-high/15 text-risk-high border border-risk-high/30",
    MEDIUM: "bg-risk-medium/15 text-risk-medium border border-risk-medium/30",
    LOW: "bg-risk-low/15 text-risk-low border border-risk-low/30",
  };

  const Icon = {
    HIGH: AlertTriangle,
    MEDIUM: AlertCircle,
    LOW: CheckCircle,
  }[level];

  return (
    <span className={cn(baseStyles, levelStyles[level], className)}>
      {showIcon && <Icon className="w-3 h-3" />}
      {level}
    </span>
  );
};
