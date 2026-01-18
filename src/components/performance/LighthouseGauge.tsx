import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface LighthouseGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const LighthouseGauge = ({
  score,
  size = 'md',
  showLabel = true,
  label = 'Performance',
  className,
}: LighthouseGaugeProps) => {
  const dimensions = useMemo(() => {
    switch (size) {
      case 'sm':
        return { size: 60, stroke: 4, fontSize: 14, labelSize: 8 };
      case 'lg':
        return { size: 120, stroke: 8, fontSize: 28, labelSize: 12 };
      default:
        return { size: 80, stroke: 6, fontSize: 20, labelSize: 10 };
    }
  }, [size]);

  const radius = (dimensions.size - dimensions.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const rating = useMemo(() => {
    if (score >= 90) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  }, [score]);

  const color = useMemo(() => {
    switch (rating) {
      case 'good':
        return { stroke: '#0cce6b', bg: '#0cce6b20' };
      case 'needs-improvement':
        return { stroke: '#ffa400', bg: '#ffa40020' };
      case 'poor':
        return { stroke: '#ff4e42', bg: '#ff4e4220' };
    }
  }, [rating]);

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: dimensions.size, height: dimensions.size }}>
        {/* Background circle */}
        <svg
          className="transform -rotate-90"
          width={dimensions.size}
          height={dimensions.size}
        >
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            fill="none"
            stroke={color.bg}
            strokeWidth={dimensions.stroke}
          />
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        
        {/* Score text */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: color.stroke }}
        >
          <span 
            className="font-bold"
            style={{ fontSize: dimensions.fontSize }}
          >
            {Math.round(score)}
          </span>
        </div>
      </div>
      
      {showLabel && (
        <span 
          className="text-muted-foreground font-medium"
          style={{ fontSize: dimensions.labelSize }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

interface LighthouseScoreBarProps {
  score: number;
  label: string;
  value: string;
  className?: string;
}

export const LighthouseScoreBar = ({
  score,
  label,
  value,
  className,
}: LighthouseScoreBarProps) => {
  const rating = useMemo(() => {
    if (score >= 90) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  }, [score]);

  const color = useMemo(() => {
    switch (rating) {
      case 'good':
        return 'bg-emerald-500';
      case 'needs-improvement':
        return 'bg-amber-500';
      case 'poor':
        return 'bg-red-500';
    }
  }, [rating]);

  const dotColor = useMemo(() => {
    switch (rating) {
      case 'good':
        return 'bg-emerald-500';
      case 'needs-improvement':
        return 'bg-amber-500';
      case 'poor':
        return 'bg-red-500';
    }
  }, [rating]);

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", dotColor)} />
          <span className="text-xs font-medium">{label}</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{value}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
