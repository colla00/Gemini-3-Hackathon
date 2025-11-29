import { TrendingUp, TrendingDown, Minus, Clock, AlertCircle, Star, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskBadge } from './RiskBadge';
import type { Patient } from '@/data/patients';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
  index: number;
  displayTime: string;
  isRefreshing?: boolean;
}

export const PatientCard = ({ patient, onClick, index, displayTime, isRefreshing }: PatientCardProps) => {
  const TrendIcon = patient.trend === 'up' ? TrendingUp : patient.trend === 'down' ? TrendingDown : Minus;
  const trendColor = patient.trend === 'up' ? 'text-risk-high' : patient.trend === 'down' ? 'text-risk-low' : 'text-muted-foreground';
  const trendLabel = patient.trend === 'up' ? 'Rising' : patient.trend === 'down' ? 'Falling' : 'Stable';

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
        "hover:border-primary/50 hover:shadow-glow hover:-translate-y-1 transition-all duration-300",
        "text-left group animate-slide-up",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        "active:scale-[0.98]"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <AlertCircle className={cn("w-5 h-5", riskScoreColor)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {patient.id}
              </h3>
              {patient.isDemo && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/20 text-warning text-xs font-semibold">
                  <Star className="w-3 h-3 fill-warning" />
                  Demo
                </span>
              )}
            </div>
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
              {trendLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <RefreshCw className={cn("w-3 h-3", isRefreshing && "animate-spin")} />
          <Clock className="w-3 h-3" />
          <span className="text-xs">{displayTime}</span>
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
