import { useState, useEffect } from 'react';
import { ArrowRight, Info, HelpCircle, TrendingUp, AlertTriangle, ChevronDown, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shapFactors, patients, getRiskLevelColor, type ShapFactor } from '@/data/nursingOutcomes';
import { ClinicalTooltip, MetricTooltip } from './ClinicalTooltip';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ShapBar = ({ factor, maxContribution, index, cumulativePercent }: { factor: ShapFactor; maxContribution: number; index: number; cumulativePercent: number }) => {
  const [animated, setAnimated] = useState(false);
  const isPositive = factor.contribution > 0;
  const isBase = factor.type === 'base';
  const width = Math.abs(factor.contribution) / maxContribution * 100;
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex items-center gap-3 py-2.5 border-b border-border/20 last:border-0 opacity-0 animate-fade-in cursor-help hover:bg-secondary/20 rounded transition-colors"
            style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
          >
            {/* Factor Label */}
            <div className="w-28 shrink-0">
              <span className="text-xs font-medium text-foreground">{factor.factor}</span>
              {factor.type !== 'base' && (
                <span className={cn(
                  "text-[9px] block",
                  isPositive ? 'text-risk-high' : 'text-risk-low'
                )}>
                  {isPositive ? 'Increases risk' : 'Decreases risk'}
                </span>
              )}
            </div>
            
            {/* Bar Visualization */}
            <div className="flex-1 relative">
              <div className="h-8 bg-muted/20 rounded relative overflow-hidden">
                {/* Center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/50" />
                
                {!isBase && (
                  <div
                    className={cn(
                      "absolute top-1 bottom-1 rounded transition-all duration-700 ease-out",
                      isPositive ? "bg-risk-high" : "bg-risk-low",
                      isPositive ? "left-1/2" : "right-1/2"
                    )}
                    style={{ 
                      width: animated ? `${width / 2}%` : '0%',
                    }}
                  />
                )}
                {isBase && (
                  <div
                    className="absolute top-1 bottom-1 left-0 bg-primary/50 rounded transition-all duration-700 ease-out"
                    style={{ 
                      width: animated ? `${width}%` : '0%',
                    }}
                  />
                )}
                
                {/* Value Inside Bar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn(
                    "text-[11px] font-bold transition-opacity duration-300",
                    animated ? 'opacity-100' : 'opacity-0',
                    isBase ? "text-primary" : isPositive ? "text-risk-high" : "text-risk-low"
                  )}>
                    {isBase ? factor.contribution : isPositive ? '+' : ''}{factor.contribution} pts
                  </span>
                </div>
              </div>
            </div>
            
            {/* Cumulative */}
            <div className="flex items-center gap-1.5 w-24 shrink-0">
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <div className="text-right">
                <span className="text-sm font-bold text-foreground tabular-nums">{factor.cumulative}%</span>
                <div className="w-12 h-1 bg-muted/30 rounded-full overflow-hidden mt-0.5">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      factor.cumulative >= 65 ? 'bg-risk-high' :
                      factor.cumulative >= 35 ? 'bg-risk-medium' : 'bg-risk-low'
                    )}
                    style={{ width: animated ? `${factor.cumulative}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs p-3">
          <div className="space-y-1">
            <div className="font-semibold text-xs">{factor.factor}</div>
            <p className="text-[10px] text-muted-foreground">
              {isBase 
                ? 'Baseline population risk for this patient cohort'
                : isPositive 
                  ? `This factor increases the patient's risk by ${factor.contribution} percentage points`
                  : `This factor decreases the patient's risk by ${Math.abs(factor.contribution)} percentage points`
              }
            </p>
            <div className="text-[9px] text-primary">
              Cumulative risk after this factor: {factor.cumulative}%
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const FactorCard = ({ factor, index }: { factor: ShapFactor; index: number }) => (
  <div 
    className={cn(
      "p-3 rounded-lg text-center opacity-0 animate-scale-in transition-transform hover:scale-105 cursor-help",
      factor.type === 'base' ? 'bg-primary/10 border border-primary/30' :
      factor.type === 'risk' ? 'bg-risk-high/10 border border-risk-high/30' :
      'bg-risk-low/10 border border-risk-low/30'
    )}
    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
  >
    <span className="text-[10px] text-muted-foreground block mb-1">{factor.factor}</span>
    <span className={cn(
      "text-xl font-bold tabular-nums",
      factor.type === 'base' ? 'text-primary' :
      factor.type === 'risk' ? 'text-risk-high' : 'text-risk-low'
    )}>
      {factor.type === 'base' ? '' : factor.contribution > 0 ? '+' : ''}{factor.contribution}
    </span>
    <span className="text-[10px] text-muted-foreground"> pts</span>
  </div>
);

export const ShapExplainability = () => {
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const maxContribution = Math.max(...shapFactors.map(f => Math.abs(f.contribution)));
  const finalScore = shapFactors[shapFactors.length - 1].cumulative;
  const selectedPatient = patients[selectedPatientIndex];

  const riskFactors = shapFactors.filter(f => f.type === 'risk');
  const protectiveFactors = shapFactors.filter(f => f.type === 'protective');
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" />
            <ClinicalTooltip term="SHAP">SHAP Risk Attribution</ClinicalTooltip>
          </h2>
          <p className="text-[11px] text-muted-foreground">Feature contribution analysis for risk score calculation</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">Viewing:</span>
          <select
            value={selectedPatientIndex}
            onChange={(e) => setSelectedPatientIndex(Number(e.target.value))}
            className="text-xs py-1 px-2 rounded bg-secondary border border-border/50 text-primary font-medium cursor-pointer"
          >
            {patients.map((p, i) => (
              <option key={p.id} value={i}>
                {p.mrn} ({p.fallsLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main SHAP Chart */}
        <div className="lg:col-span-2 glass-card rounded-lg p-4">
          {/* Info Banner - Compact */}
          <div className="flex items-start gap-2 p-2.5 rounded bg-primary/10 border border-primary/30 mb-4">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-primary">How to Read This Chart</span>
              <p className="text-[10px] text-muted-foreground">
                Each bar shows how a clinical factor affects the risk score. Red bars increase risk, green bars decrease it. 
                The cumulative column shows the running total after each factor is applied.
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
            <div className="ml-auto text-muted-foreground">
              {riskFactors.length} risk factors • {protectiveFactors.length} protective factors
            </div>
          </div>

          {/* SHAP Bars */}
          <div className="border-t border-border/30 pt-3">
            {shapFactors.map((factor, index) => (
              <ShapBar 
                key={index} 
                factor={factor} 
                maxContribution={maxContribution} 
                index={index}
                cumulativePercent={(factor.cumulative / finalScore) * 100}
              />
            ))}
          </div>

          {/* Final Score */}
          <div className="mt-4 p-4 rounded-lg bg-secondary/30 border border-border/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground block">Final Calculated Risk</span>
              <span className="text-xs text-muted-foreground">After all factor adjustments</span>
            </div>
            <MetricTooltip 
              label="Final Risk Score"
              value={`${finalScore}%`}
              details="Sum of base risk and all contributing factors. This is the model's predicted probability of a fall event within 24 hours."
              trend={finalScore >= 65 ? 'up' : finalScore >= 35 ? 'stable' : 'down'}
            >
              <div className="flex items-center gap-1 cursor-help">
                <span className={cn(
                  "text-4xl font-bold tabular-nums",
                  finalScore >= 65 ? 'text-risk-high' : finalScore >= 35 ? 'text-risk-medium' : 'text-risk-low'
                )}>
                  {finalScore}
                </span>
                <span className="text-xl font-semibold text-muted-foreground">%</span>
              </div>
            </MetricTooltip>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Patient Context */}
          <div className="glass-card rounded-lg p-4 opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <h3 className="text-xs font-semibold text-foreground mb-3">Patient Context</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  <ClinicalTooltip term="MRN" showIcon={false}>Patient</ClinicalTooltip>
                </span>
                <span className="text-foreground font-medium">{selectedPatient.mrn}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Unit/Room</span>
                <span className="text-foreground font-medium">{selectedPatient.unit} / {selectedPatient.bed}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Age/Sex</span>
                <span className="text-foreground font-medium">{selectedPatient.age}{selectedPatient.sex}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  <ClinicalTooltip term="LOS" showIcon={false}>Length of Stay</ClinicalTooltip>
                </span>
                <span className="text-foreground font-medium">{selectedPatient.los} days</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  <ClinicalTooltip term="Falls Risk" showIcon={false}>Risk Level</ClinicalTooltip>
                </span>
                <span className={cn("font-semibold", getRiskLevelColor(selectedPatient.fallsLevel))}>
                  {selectedPatient.fallsLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Factor Summary */}
          <div className="glass-card rounded-lg p-4 opacity-0 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
            <h3 className="text-xs font-semibold text-foreground mb-3">Factor Breakdown</h3>
            <div className="grid grid-cols-2 gap-2">
              {shapFactors.map((factor, index) => (
                <FactorCard key={index} factor={factor} index={index} />
              ))}
            </div>
          </div>

          {/* Model Info */}
          <div className="glass-card rounded-lg p-4 opacity-0 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            <h3 className="text-xs font-semibold text-foreground mb-2">Model Information</h3>
            <div className="space-y-1.5 text-[10px] text-muted-foreground">
              <div className="flex justify-between">
                <span>Algorithm</span>
                <span className="text-foreground">XGBoost</span>
              </div>
              <div className="flex justify-between">
                <span>Training Set</span>
                <span className="text-foreground">N=45,000</span>
              </div>
              <div className="flex justify-between">
                <span>AUC-ROC</span>
                <span className="text-foreground">0.87</span>
              </div>
              <div className="flex justify-between">
                <span>
                  <ClinicalTooltip term="Confidence" showIcon={false}>Model Confidence</ClinicalTooltip>
                </span>
                <span className="text-primary font-medium">{selectedPatient.fallsConfidence}%</span>
              </div>
            </div>
          </div>

          {/* Clinical Note */}
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 opacity-0 animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="text-[10px] font-semibold text-warning block">Clinical Note</span>
                <p className="text-[10px] text-warning/80">
                  <ClinicalTooltip term="SHAP">SHAP values</ClinicalTooltip> quantify factor contributions but require clinical verification. 
                  Model predictions support—not replace—nursing judgment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
