import { ArrowRight, Info, HelpCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shapFactors, patients, getRiskLevelColor, type ShapFactor } from '@/data/nursingOutcomes';

const ShapBar = ({ factor, maxContribution }: { factor: ShapFactor; maxContribution: number }) => {
  const isPositive = factor.contribution > 0;
  const isBase = factor.type === 'base';
  const width = Math.abs(factor.contribution) / maxContribution * 100;
  
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0">
      {/* Factor Label */}
      <div className="w-24 shrink-0">
        <span className="text-xs font-medium text-foreground">{factor.factor}</span>
      </div>
      
      {/* Bar Visualization */}
      <div className="flex-1 relative">
        <div className="h-7 bg-muted/20 rounded relative overflow-hidden">
          {!isBase && (
            <div
              className={cn(
                "absolute top-0 h-full rounded transition-all duration-500",
                isPositive ? "bg-risk-high left-0" : "bg-risk-low right-0"
              )}
              style={{ width: `${width}%` }}
            />
          )}
          {isBase && (
            <div
              className="absolute top-0 left-0 h-full bg-primary/50 rounded"
              style={{ width: `${width}%` }}
            />
          )}
          
          {/* Value Inside Bar */}
          <div className="absolute inset-0 flex items-center px-2">
            <span className={cn(
              "text-[11px] font-bold",
              isBase ? "text-primary" : isPositive ? "text-risk-high" : "text-risk-low"
            )}>
              {isBase ? factor.contribution : isPositive ? '+' : ''}{factor.contribution} pts
            </span>
          </div>
        </div>
      </div>
      
      {/* Cumulative */}
      <div className="flex items-center gap-1.5 w-20 shrink-0">
        <ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-sm font-bold text-foreground">{factor.cumulative}%</span>
      </div>
    </div>
  );
};

const FactorCard = ({ factor }: { factor: ShapFactor }) => (
  <div className={cn(
    "p-3 rounded-lg text-center",
    factor.type === 'base' ? 'bg-primary/10 border border-primary/30' :
    factor.type === 'risk' ? 'bg-risk-high/10 border border-risk-high/30' :
    'bg-risk-low/10 border border-risk-low/30'
  )}>
    <span className="text-[10px] text-muted-foreground block mb-1">{factor.factor}</span>
    <span className={cn(
      "text-xl font-bold",
      factor.type === 'base' ? 'text-primary' :
      factor.type === 'risk' ? 'text-risk-high' : 'text-risk-low'
    )}>
      {factor.type === 'base' ? '' : factor.contribution > 0 ? '+' : ''}{factor.contribution}
    </span>
    <span className="text-[10px] text-muted-foreground"> pts</span>
  </div>
);

export const ShapExplainability = () => {
  const maxContribution = Math.max(...shapFactors.map(f => Math.abs(f.contribution)));
  const finalScore = shapFactors[shapFactors.length - 1].cumulative;
  const selectedPatient = patients[0]; // High-risk patient for demo
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">SHAP Risk Attribution</h2>
          <p className="text-[11px] text-muted-foreground">Feature contribution analysis for risk score calculation</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">Viewing:</span>
          <span className="text-xs font-medium text-primary">{selectedPatient.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main SHAP Chart */}
        <div className="lg:col-span-2 glass-card rounded-lg p-4">
          {/* Info Banner - Compact */}
          <div className="flex items-start gap-2 p-2.5 rounded bg-primary/10 border border-primary/30 mb-4">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-primary">How to Read</span>
              <p className="text-[10px] text-muted-foreground">
                Red bars increase risk, green bars decrease it. Cumulative score shown on right.
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-3 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-primary/50" />
              <span className="text-muted-foreground">Base Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-risk-high" />
              <span className="text-muted-foreground">Risk Factor (+)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-risk-low" />
              <span className="text-muted-foreground">Protective (-)</span>
            </div>
          </div>

          {/* SHAP Bars */}
          <div className="border-t border-border/30 pt-3">
            {shapFactors.map((factor, index) => (
              <ShapBar key={index} factor={factor} maxContribution={maxContribution} />
            ))}
          </div>

          {/* Final Score */}
          <div className="mt-4 p-4 rounded-lg bg-secondary/30 border border-border/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground block">Final Calculated Risk</span>
              <span className="text-xs text-muted-foreground">After all factor adjustments</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-4xl font-bold text-risk-high">{finalScore}</span>
              <span className="text-xl font-semibold text-muted-foreground">%</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Patient Context */}
          <div className="glass-card rounded-lg p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3">Patient Context</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Patient</span>
                <span className="text-foreground font-medium">{selectedPatient.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Unit/Room</span>
                <span className="text-foreground font-medium">{selectedPatient.unit} / {selectedPatient.bed}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Falls Risk Level</span>
                <span className={cn("font-semibold", getRiskLevelColor(selectedPatient.fallsLevel))}>
                  {selectedPatient.fallsLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Factor Summary */}
          <div className="glass-card rounded-lg p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3">Factor Breakdown</h3>
            <div className="grid grid-cols-2 gap-2">
              {shapFactors.map((factor, index) => (
                <FactorCard key={index} factor={factor} />
              ))}
            </div>
          </div>

          {/* Clinical Note */}
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold text-warning block">Clinical Note</span>
                <p className="text-[10px] text-warning/80">
                  SHAP values quantify factor contributions. Clinicians must verify to mitigate false positives/negatives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
