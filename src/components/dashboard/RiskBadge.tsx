import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/data/patients';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showIcon?: boolean;
}

// Map internal levels to clinical display labels
const levelLabels: Record<RiskLevel, string> = {
  HIGH: 'Elevated',
  MEDIUM: 'Moderate', 
  LOW: 'Low',
};

// Accessibility descriptions for screen readers
const levelDescriptions: Record<RiskLevel, string> = {
  HIGH: 'Elevated risk level requiring priority attention',
  MEDIUM: 'Moderate risk level requiring monitoring',
  LOW: 'Low risk level with stable indicators',
};

export const RiskBadge = ({ level, className, showIcon = true }: RiskBadgeProps) => {
  const baseStyles = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide";
  
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
    <span 
      className={cn(baseStyles, levelStyles[level], className)}
      role="status"
      aria-label={levelDescriptions[level]}
      tabIndex={0}
    >
      {showIcon && <Icon className="w-3 h-3" aria-hidden="true" />}
      <span aria-hidden="true">{levelLabels[level]}</span>
    </span>
  );
};
