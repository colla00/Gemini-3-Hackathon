import { useState, useEffect } from 'react';
import { Sliders, TrendingUp, TrendingDown, Award, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ThresholdData {
  patient: string;
  baseline: number;
  current: number;
  volatility: number;
  adaptedThreshold: number;
  staticThreshold: number;
  wouldAlert: boolean;
  shouldAlert: boolean;
}

const mockThresholds: ThresholdData[] = [
  { patient: '849201', baseline: 38, current: 52, volatility: 8.2, adaptedThreshold: 54, staticThreshold: 65, wouldAlert: false, shouldAlert: false },
  { patient: '847203', baseline: 45, current: 68, volatility: 12.1, adaptedThreshold: 69, staticThreshold: 65, wouldAlert: true, shouldAlert: false },
  { patient: '845892', baseline: 72, current: 78, volatility: 4.3, adaptedThreshold: 81, staticThreshold: 65, wouldAlert: true, shouldAlert: false },
  { patient: '850124', baseline: 28, current: 71, volatility: 15.7, adaptedThreshold: 59, staticThreshold: 65, wouldAlert: true, shouldAlert: true },
];

export const AdaptiveThresholds = ({ compact = false }: { compact?: boolean }) => {
  const [animatedBars, setAnimatedBars] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedBars(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const falsePositivesAvoided = mockThresholds.filter(t => t.wouldAlert && !t.shouldAlert).length;
  const truePositives = mockThresholds.filter(t => t.wouldAlert && t.shouldAlert).length;

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/10 border border-accent/20 cursor-help">
              <Sliders className="w-3 h-3 text-accent" />
              <span className="text-[10px] text-accent font-medium">Adaptive Thresholds</span>
              <span className="text-[9px] text-accent/70">-{Math.round((falsePositivesAvoided / mockThresholds.length) * 100)}% alerts</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs p-3">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <Award className="w-3 h-3 text-accent" />
                Patent-Pending Technology
              </div>
              <p className="text-[10px] text-muted-foreground">
                Patient-specific alert thresholds based on individual baseline risk and historical volatility. 
                Reduces false positives by 40-70% compared to fixed thresholds.
              </p>
              <div className="text-[9px] text-accent">
                U.S. Pat. App. 63/932,953 - Claim 6
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
          <span className="text-[9px] text-accent font-medium">Claim 6</span>
        </div>
      </div>

      {/* Alert Reduction Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded bg-risk-low/10 border border-risk-low/30 text-center">
          <span className="text-2xl font-bold text-risk-low">{falsePositivesAvoided}</span>
          <p className="text-[10px] text-muted-foreground">False Alerts Prevented</p>
        </div>
        <div className="p-3 rounded bg-secondary border border-border/30 text-center">
          <span className="text-2xl font-bold text-foreground">
            {Math.round((falsePositivesAvoided / mockThresholds.length) * 100)}%
          </span>
          <p className="text-[10px] text-muted-foreground">Alert Reduction</p>
        </div>
      </div>

      {/* Threshold Comparison */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Patient Threshold Comparison</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-muted-foreground/50" />
              <span>Static (65%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-accent" />
              <span>Adapted</span>
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
                  Baseline: {data.baseline}% • Vol: ±{data.volatility}
                </span>
                {data.wouldAlert && !data.shouldAlert && (
                  <span className="px-1.5 py-0.5 rounded bg-risk-low/20 text-risk-low text-[9px] font-medium">
                    Alert Prevented
                  </span>
                )}
              </div>
            </div>
            
            {/* Visual Bar */}
            <div className="relative h-6 bg-muted/20 rounded overflow-hidden">
              {/* Current Risk */}
              <div 
                className={cn(
                  "absolute top-0 left-0 h-full transition-all duration-700",
                  data.current >= data.staticThreshold ? "bg-risk-high/60" : "bg-primary/40"
                )}
                style={{ width: animatedBars ? `${data.current}%` : '0%' }}
              />
              
              {/* Static Threshold Line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50"
                style={{ left: `${data.staticThreshold}%` }}
              />
              
              {/* Adapted Threshold Line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-accent"
                style={{ left: `${data.adaptedThreshold}%` }}
              />
              
              {/* Labels */}
              <div className="absolute inset-0 flex items-center px-2">
                <span className="text-[10px] font-bold text-foreground">
                  {data.current}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formula Note */}
      <div className="mt-4 p-3 rounded bg-muted/20 border border-border/30 text-[10px]">
        <div className="flex items-start gap-2">
          <Info className="w-3 h-3 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-foreground">Adaptive Threshold Formula:</span>
            <p className="text-muted-foreground mt-1">
              Threshold = Baseline + (k × σ) where k adjusts based on clinical context
            </p>
            <p className="text-accent mt-1">
              U.S. Provisional Patent Application No. 63/932,953
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
