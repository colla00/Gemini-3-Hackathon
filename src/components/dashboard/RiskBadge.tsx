import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/data/patients';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export const RiskBadge = ({ level, className }: RiskBadgeProps) => {
  const baseStyles = "px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase";
  
  const levelStyles = {
    HIGH: "bg-risk-high text-foreground",
    MEDIUM: "bg-risk-medium text-card",
    LOW: "bg-risk-low text-card",
  };

  return (
    <span className={cn(baseStyles, levelStyles[level], className)}>
      {level}
    </span>
  );
};
