import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Clock, Award, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForecastPoint {
  horizon: string;
  hours: number;
  risk: number;
  confidence: [number, number];
  trajectory: 'stable' | 'improving' | 'deteriorating' | 'volatile';
}

interface PatientForecast {
  patientId: string;
  currentRisk: number;
  forecasts: ForecastPoint[];
  inflectionPoint?: string;
  keyDriver: string;
}

const mockForecasts: PatientForecast[] = [
  {
    patientId: '849201',
    currentRisk: 68,
    keyDriver: 'Sedation effects expected to diminish',
    inflectionPoint: '12h',
    forecasts: [
      { horizon: '4h', hours: 4, risk: 65, confidence: [58, 72], trajectory: 'improving' },
      { horizon: '12h', hours: 12, risk: 52, confidence: [44, 60], trajectory: 'improving' },
      { horizon: '24h', hours: 24, risk: 45, confidence: [35, 55], trajectory: 'stable' },
      { horizon: '48h', hours: 48, risk: 42, confidence: [30, 54], trajectory: 'stable' },
    ]
  },
  {
    patientId: '847203',
    currentRisk: 72,
    keyDriver: 'Mobility protocol impact pending',
    forecasts: [
      { horizon: '4h', hours: 4, risk: 70, confidence: [64, 76], trajectory: 'stable' },
      { horizon: '12h', hours: 12, risk: 68, confidence: [58, 78], trajectory: 'stable' },
      { horizon: '24h', hours: 24, risk: 58, confidence: [45, 71], trajectory: 'improving' },
      { horizon: '48h', hours: 48, risk: 48, confidence: [32, 64], trajectory: 'improving' },
    ]
  },
];

const TrajectoryBadge = ({ trajectory }: { trajectory: ForecastPoint['trajectory'] }) => {
  const config = {
    stable: { icon: Minus, color: 'text-muted-foreground', bg: 'bg-muted/30' },
    improving: { icon: TrendingDown, color: 'text-risk-low', bg: 'bg-risk-low/20' },
    deteriorating: { icon: TrendingUp, color: 'text-risk-high', bg: 'bg-risk-high/20' },
    volatile: { icon: Activity, color: 'text-risk-medium', bg: 'bg-risk-medium/20' },
  };
  const { icon: Icon, color, bg } = config[trajectory];
  
  return (
    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium", bg, color)}>
      <Icon className="w-3 h-3" />
      {trajectory}
    </span>
  );
};

const ForecastChart = ({ forecast, index }: { forecast: PatientForecast; index: number }) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  const maxRisk = 100;
  const chartHeight = 80;

  return (
    <div 
      className="glass-card rounded-lg p-4 opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm font-semibold text-foreground">{forecast.patientId}</span>
          <span className="text-[10px] text-muted-foreground ml-2">Current: {forecast.currentRisk}%</span>
        </div>
        {forecast.inflectionPoint && (
          <span className="text-[10px] text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/30">
            Inflection @ {forecast.inflectionPoint}
          </span>
        )}
      </div>

      {/* Chart Area */}
      <div className="relative h-20 mb-3">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 25, 50, 75, 100].reverse().map((val) => (
            <div key={val} className="flex items-center">
              <span className="text-[8px] text-muted-foreground w-6 text-right pr-1">{val}</span>
              <div className="flex-1 border-t border-border/20" />
            </div>
          ))}
        </div>

        {/* Confidence Band */}
        <svg className="absolute left-6 right-0 top-0 bottom-0 overflow-visible">
          <defs>
            <linearGradient id={`confidence-${forecast.patientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Confidence area */}
          <path
            d={animated ? `
              M 0 ${chartHeight - (forecast.currentRisk / maxRisk) * chartHeight}
              ${forecast.forecasts.map((f, i) => {
                const x = ((i + 1) / forecast.forecasts.length) * 100 + '%';
                const yTop = chartHeight - (f.confidence[1] / maxRisk) * chartHeight;
                return `L ${x} ${yTop}`;
              }).join(' ')}
              ${[...forecast.forecasts].reverse().map((f, i) => {
                const x = ((forecast.forecasts.length - i) / forecast.forecasts.length) * 100 + '%';
                const yBottom = chartHeight - (f.confidence[0] / maxRisk) * chartHeight;
                return `L ${x} ${yBottom}`;
              }).join(' ')}
              Z
            ` : ''}
            fill={`url(#confidence-${forecast.patientId})`}
            className="transition-all duration-1000"
          />

          {/* Main line */}
          <polyline
            points={animated ? `
              0,${chartHeight - (forecast.currentRisk / maxRisk) * chartHeight}
              ${forecast.forecasts.map((f, i) => {
                const x = ((i + 1) / forecast.forecasts.length) * 100;
                const y = chartHeight - (f.risk / maxRisk) * chartHeight;
                return `${x}%,${y}`;
              }).join(' ')}
            ` : `0,${chartHeight / 2}`}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            className="transition-all duration-1000"
          />

          {/* Data points */}
          {animated && forecast.forecasts.map((f, i) => (
            <circle
              key={i}
              cx={`${((i + 1) / forecast.forecasts.length) * 100}%`}
              cy={chartHeight - (f.risk / maxRisk) * chartHeight}
              r="4"
              fill="hsl(var(--background))"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      {/* Horizon Labels */}
      <div className="flex justify-between pl-6 mb-3">
        <span className="text-[9px] text-muted-foreground">Now</span>
        {forecast.forecasts.map((f) => (
          <div key={f.horizon} className="text-center">
            <span className="text-[9px] text-muted-foreground block">{f.horizon}</span>
            <span className="text-[10px] font-medium text-foreground">{f.risk}%</span>
            <TrajectoryBadge trajectory={f.trajectory} />
          </div>
        ))}
      </div>

      {/* Key Driver */}
      <div className="p-2 rounded bg-secondary/30 border border-border/20 text-[10px]">
        <span className="text-muted-foreground">Key trajectory driver: </span>
        <span className="text-foreground">{forecast.keyDriver}</span>
      </div>
    </div>
  );
};

export const TemporalForecasting = ({ compact = false }: { compact?: boolean }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/20">
        <Clock className="w-3 h-3 text-primary" />
        <span className="text-[10px] text-primary font-medium">4-48h Forecasts</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Multi-Horizon Temporal Forecasting
          </h3>
          <p className="text-[10px] text-muted-foreground">Risk trajectories at 4h, 12h, 24h, and 48h horizons</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/10 border border-accent/30">
            <Award className="w-3 h-3 text-accent" />
            <span className="text-[9px] text-accent font-medium">Patent Claim 5</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-primary" />
          <span>Predicted Risk</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary/20" />
          <span>Confidence Interval</span>
        </div>
        <TrajectoryBadge trajectory="improving" />
        <TrajectoryBadge trajectory="stable" />
        <TrajectoryBadge trajectory="deteriorating" />
      </div>

      {/* Forecast Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockForecasts.map((forecast, index) => (
          <ForecastChart key={forecast.patientId} forecast={forecast} index={index} />
        ))}
      </div>

      {/* Patent Note */}
      <div className="p-3 rounded bg-accent/10 border border-accent/30 text-[10px]">
        <div className="flex items-start gap-2">
          <Award className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-accent">Novel Innovation:</span>
            <span className="text-muted-foreground ml-1">
              Multi-horizon forecasting with trajectory classification and inflection point detection 
              enables proactive intervention before clinical deterioration.
            </span>
            <p className="text-accent mt-1">U.S. Patent Filed</p>
          </div>
        </div>
      </div>
    </div>
  );
};
