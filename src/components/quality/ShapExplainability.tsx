import { ArrowRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shapFactors, type ShapFactor } from '@/data/nursingOutcomes';

const ShapBar = ({ factor, maxContribution }: { factor: ShapFactor; maxContribution: number }) => {
  const isPositive = factor.contribution > 0;
  const isBase = factor.type === 'base';
  const width = Math.abs(factor.contribution) / maxContribution * 100;
  
  return (
    <div className="flex items-center gap-4 py-3">
      {/* Factor Label */}
      <div className="w-32 flex-shrink-0">
        <span className="text-sm font-medium text-foreground">{factor.factor}</span>
      </div>
      
      {/* Bar Visualization */}
      <div className="flex-1 relative">
        <div className="flex items-center gap-2">
          {/* Contribution Bar */}
          <div className="flex-1 h-10 bg-muted/20 rounded-lg relative overflow-hidden">
            {!isBase && (
              <div
                className={cn(
                  "absolute top-0 h-full rounded-lg transition-all duration-500",
                  isPositive ? "bg-risk-high left-0" : "bg-risk-low right-0"
                )}
                style={{ width: `${width}%` }}
              />
            )}
            {isBase && (
              <div
                className="absolute top-0 left-0 h-full bg-primary/50 rounded-lg"
                style={{ width: `${width}%` }}
              />
            )}
            
            {/* Value Inside Bar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn(
                "text-sm font-bold",
                isBase ? "text-primary" : isPositive ? "text-risk-high" : "text-risk-low"
              )}>
                {isBase ? '' : isPositive ? '+' : ''}{factor.contribution} pts
              </span>
            </div>
          </div>
          
          {/* Arrow and Cumulative */}
          <div className="flex items-center gap-2 w-24">
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-lg font-bold text-foreground">{factor.cumulative}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShapExplainability = () => {
  const maxContribution = Math.max(...shapFactors.map(f => Math.abs(f.contribution)));
  const finalScore = shapFactors[shapFactors.length - 1].cumulative;
  
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          SHAP Feature Attribution
        </h2>
        <p className="text-muted-foreground">
          Waterfall breakdown showing factor contributions to risk score
        </p>
      </div>

      {/* Main Card */}
      <div className="glass-card rounded-[20px] p-8">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30 mb-8">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-primary mb-1">How to Read This Chart</h4>
            <p className="text-xs text-muted-foreground">
              Each bar shows how much a factor increases (red) or decreases (green) the risk score.
              The cumulative score is shown on the right after each factor is applied.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/50" />
            <span className="text-sm text-muted-foreground">Base Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-risk-high" />
            <span className="text-sm text-muted-foreground">Risk Factor (+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-risk-low" />
            <span className="text-sm text-muted-foreground">Protective Factor (-)</span>
          </div>
        </div>

        {/* SHAP Bars */}
        <div className="space-y-2 border-t border-border/30 pt-6">
          {shapFactors.map((factor, index) => (
            <ShapBar key={index} factor={factor} maxContribution={maxContribution} />
          ))}
        </div>

        {/* Final Score */}
        <div className="mt-8 pt-6 border-t border-border/30">
          <div className="flex items-center justify-between p-6 rounded-xl bg-card/50 border border-border/30">
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Final Calculated Risk Score</span>
              <span className="text-xs text-muted-foreground">After applying all contributing factors</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-5xl font-extrabold text-risk-high">{finalScore}</span>
              <span className="text-2xl font-bold text-muted-foreground">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Summary */}
      <div className="glass-card rounded-[20px] p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Calculation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {shapFactors.map((factor, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-xl text-center",
                factor.type === 'base' ? 'bg-primary/10 border border-primary/30' :
                factor.type === 'risk' ? 'bg-risk-high/10 border border-risk-high/30' :
                'bg-risk-low/10 border border-risk-low/30'
              )}
            >
              <span className="text-xs text-muted-foreground block mb-1">{factor.factor}</span>
              <span className={cn(
                "text-2xl font-bold",
                factor.type === 'base' ? 'text-primary' :
                factor.type === 'risk' ? 'text-risk-high' : 'text-risk-low'
              )}>
                {factor.type === 'base' ? '' : factor.contribution > 0 ? '+' : ''}{factor.contribution}
              </span>
              <span className="text-sm text-muted-foreground"> pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
        <p className="text-center text-sm text-warning">
          <strong>SHAP Values:</strong> Feature attribution values quantify individual factor contributions.
          Clinicians must verify signals to mitigate potential false positives or negatives.
        </p>
      </div>
    </div>
  );
};
