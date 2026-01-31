import { useState, useEffect } from 'react';
import { Sliders, Award, Info, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ThresholdData {
  patient: string;
  baselineLevel: 'Low' | 'Moderate' | 'Elevated';
  currentLevel: 'Low' | 'Moderate' | 'Elevated';
  volatility: 'Stable' | 'Variable' | 'Fluctuating';
  adaptationStrength: 'Strong' | 'Moderate' | 'Mild';
  alertPrevented: boolean;
  trend: 'Rising' | 'Stable' | 'Declining';
}

const mockThresholds: ThresholdData[] = [
  { patient: '849201', baselineLevel: 'Low', currentLevel: 'Moderate', volatility: 'Variable', adaptationStrength: 'Moderate', alertPrevented: false, trend: 'Rising' },
  { patient: '847203', baselineLevel: 'Moderate', currentLevel: 'Elevated', volatility: 'Fluctuating', adaptationStrength: 'Strong', alertPrevented: true, trend: 'Rising' },
  { patient: '845892', baselineLevel: 'Elevated', currentLevel: 'Elevated', volatility: 'Stable', adaptationStrength: 'Mild', alertPrevented: true, trend: 'Stable' },
  { patient: '850124', baselineLevel: 'Low', currentLevel: 'Elevated', volatility: 'Fluctuating', adaptationStrength: 'Strong', alertPrevented: false, trend: 'Rising' },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Elevated': return 'text-risk-high bg-risk-high/20';
    case 'Moderate': return 'text-risk-medium bg-risk-medium/20';
    case 'Low': return 'text-risk-low bg-risk-low/20';
    default: return 'text-muted-foreground bg-muted/20';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'Rising': return <ArrowUp className="w-3 h-3 text-risk-high" />;
    case 'Declining': return <ArrowDown className="w-3 h-3 text-risk-low" />;
    default: return <Minus className="w-3 h-3 text-muted-foreground" />;
  }
};

export const AdaptiveThresholds = ({ compact = false }: { compact?: boolean }) => {
  const [animatedBars, setAnimatedBars] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedBars(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const alertsPrevented = mockThresholds.filter(t => t.alertPrevented).length;

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/10 border border-accent/20 cursor-help">
              <Sliders className="w-3 h-3 text-accent" />
              <span className="text-[10px] text-accent font-medium">Adaptive Thresholds</span>
              <span className="text-[9px] text-accent/70">Reduced alerts</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs p-3">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <Award className="w-3 h-3 text-accent" />
                Patent-Pending Technology
              </div>
              <p className="text-[10px] text-muted-foreground">
                Patient-specific alert thresholds based on individual baseline patterns and historical variability. 
                Signals suggest substantial reduction in unnecessary alerts compared to fixed thresholds.
              </p>
              <div className="text-[9px] text-accent">
                U.S. Patent Filed
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="glass-card rounded-lg p-4 border border-accent/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sliders className="w-4 h-4 text-accent" />
            Patient-Adaptive Alert Thresholds
          </h3>
          <p className="text-[10px] text-muted-foreground">Personalized thresholds reduce alert fatigue</p>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/10 border border-accent/30">
          <Award className="w-3 h-3 text-accent" />
          <span className="text-[9px] text-accent font-medium">U.S. Patent Filed</span>
        </div>
      </div>

      {/* Alert Reduction Stats - Qualitative */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded bg-risk-low/10 border border-risk-low/30 text-center">
          <span className="text-lg font-bold text-risk-low">
            {alertsPrevented > 2 ? 'Several' : alertsPrevented > 0 ? 'Some' : 'Few'}
          </span>
          <p className="text-[10px] text-muted-foreground">Unnecessary Alerts Prevented</p>
        </div>
        <div className="p-3 rounded bg-secondary border border-border/30 text-center">
          <span className="text-lg font-bold text-foreground">Substantial</span>
          <p className="text-[10px] text-muted-foreground">Alert Reduction</p>
        </div>
      </div>

      {/* Threshold Comparison - Qualitative */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Patient Threshold Comparison</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-muted-foreground/50" />
              <span>Population</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-accent" />
              <span>Personalized</span>
            </div>
          </div>
        </div>

        {mockThresholds.map((data, index) => (
          <div 
            key={data.patient}
            className="p-2 rounded bg-secondary/30 border border-border/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">{data.patient}</span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-muted-foreground">
                  Baseline: {data.baselineLevel} • Variability: {data.volatility}
                </span>
                {data.alertPrevented && (
                  <span className="px-1.5 py-0.5 rounded bg-risk-low/20 text-risk-low text-[9px] font-medium">
                    Alert Prevented
                  </span>
                )}
              </div>
            </div>
            
            {/* Qualitative Status Display */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getLevelColor(data.currentLevel))}>
                  {data.currentLevel}
                </span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(data.trend)}
                  <span className="text-[10px] text-muted-foreground">{data.trend}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-muted-foreground">Adaptation:</span>
                <span className={cn(
                  "font-medium",
                  data.adaptationStrength === 'Strong' ? 'text-accent' :
                  data.adaptationStrength === 'Moderate' ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {data.adaptationStrength}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formula Note - Qualitative */}
      <div className="mt-4 p-3 rounded bg-muted/20 border border-border/30 text-[10px]">
        <div className="flex items-start gap-2">
          <Info className="w-3 h-3 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-foreground">Adaptive Threshold Approach:</span>
            <p className="text-muted-foreground mt-1">
              Thresholds adjust based on individual patient baseline patterns and historical variability, 
              reducing unnecessary alerts while preserving clinically meaningful signals.
            </p>
            <p className="text-accent mt-1">
              U.S. Patent Filed
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border/30 text-center">
        <p className="text-[9px] text-muted-foreground">
          NSO Quality Dashboard – 4 U.S. Patents Filed
        </p>
      </div>
    </div>
  );
};
