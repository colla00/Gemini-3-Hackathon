import { TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskBadge } from './RiskBadge';
import type { Patient } from '@/data/patients';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
  index: number;
}

export const PatientCard = ({ patient, onClick, index }: PatientCardProps) => {
  const TrendIcon = patient.trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = patient.trend === 'up' ? 'text-risk-high' : 'text-risk-low';

  const riskScoreColor = {
    HIGH: 'text-risk-high',
    MEDIUM: 'text-risk-medium',
    LOW: 'text-risk-low',
  }[patient.riskLevel];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-6 rounded-xl bg-card border border-border/50 shadow-card",
        "hover:border-primary/50 hover:shadow-glow transition-all duration-300",
        "text-left group animate-slide-up",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <AlertCircle className={cn("w-5 h-5", riskScoreColor)} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {patient.id}
            </h3>
            <p className="text-sm text-muted-foreground">
              {patient.riskType}
            </p>
          </div>
        </div>
        <RiskBadge level={patient.riskLevel} />
      </div>

      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className={cn("text-4xl font-extrabold", riskScoreColor)}>
            {patient.riskScore}%
          </span>
          <div className={cn("flex items-center gap-1", trendColor)}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">
              {patient.trend === 'up' ? 'Rising' : 'Falling'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{patient.lastUpdated}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex flex-wrap gap-2">
          {patient.riskFactors.slice(0, 3).map((factor) => (
            <span
              key={factor.name}
              className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground"
            >
              {factor.icon} {factor.name.split(' ')[0]}
            </span>
          ))}
          {patient.riskFactors.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
              +{patient.riskFactors.length - 3} more
            </span>
          )}
        </div>
      </div>
    </button>
  );
};
