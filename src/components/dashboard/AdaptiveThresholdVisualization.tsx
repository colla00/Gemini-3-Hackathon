import { useState } from 'react';
import { 
  Sliders, Users, User, TrendingDown, AlertTriangle, 
  CheckCircle2, Info, Award, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Patient, RiskType } from '@/data/patients';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AdaptiveThresholdVisualizationProps {
  patient: Patient;
  className?: string;
}

interface ThresholdData {
  riskType: RiskType;
  populationThreshold: number;
  patientThreshold: number;
  currentScore: number;
  adaptationFactors: {
    factor: string;
    adjustment: number;
    direction: 'raise' | 'lower';
  }[];
  falsePositiveReduction: number;
}

// Calculate adaptive threshold based on patient characteristics
const calculateAdaptiveThreshold = (patient: Patient): ThresholdData => {
  const baseThreshold = 70; // Population default high-risk threshold
  
  // Simulated adaptation factors based on patient characteristics
  const adaptationFactors: ThresholdData['adaptationFactors'] = [];
  let adjustment = 0;

  // Age-based adjustment
  if (patient.ageRange.includes('70') || patient.ageRange.includes('80') || patient.ageRange.includes('90')) {
    adaptationFactors.push({ factor: 'Age > 70', adjustment: -8, direction: 'lower' });
    adjustment -= 8;
  }

  // Prior event history (simulated)
  if (patient.riskLevel === 'HIGH') {
    adaptationFactors.push({ factor: 'Prior event history', adjustment: -5, direction: 'lower' });
    adjustment -= 5;
  }

  // Length of stay (simulated based on admission date)
  const daysAdmitted = Math.floor(Math.random() * 10) + 3;
  if (daysAdmitted > 7) {
    adaptationFactors.push({ factor: 'LOS > 7 days', adjustment: -4, direction: 'lower' });
    adjustment -= 4;
  }

  // Protective factors
  if (patient.trend === 'down') {
    adaptationFactors.push({ factor: 'Improving trend', adjustment: 5, direction: 'raise' });
    adjustment += 5;
  }

  // Mobility status (simulated)
  if (patient.riskType === 'Falls') {
    adaptationFactors.push({ factor: 'Mobility impairment', adjustment: -6, direction: 'lower' });
    adjustment -= 6;
  }

  const patientThreshold = Math.max(40, Math.min(85, baseThreshold + adjustment));
  
  // Calculate false positive reduction (simulated)
  const falsePositiveReduction = Math.abs(adjustment) > 10 ? 
    Math.round(35 + Math.random() * 25) : 
    Math.round(15 + Math.random() * 20);

  return {
    riskType: patient.riskType,
    populationThreshold: baseThreshold,
    patientThreshold: Math.round(patientThreshold),
    currentScore: patient.riskScore,
    adaptationFactors,
    falsePositiveReduction,
  };
};

const ThresholdBar = ({ 
  populationThreshold, 
  patientThreshold, 
  currentScore 
}: { 
  populationThreshold: number; 
  patientThreshold: number; 
  currentScore: number;
}) => {
  const isAbovePatientThreshold = currentScore >= patientThreshold;
  const isAbovePopulationThreshold = currentScore >= populationThreshold;
  const wouldBeFalsePositive = isAbovePopulationThreshold && !isAbovePatientThreshold;

  return (
    <div className="relative h-12 bg-secondary/30 rounded-lg overflow-hidden border border-border/30">
      {/* Background gradient zones */}
      <div className="absolute inset-0 flex">
        <div 
          className="bg-risk-low/20 transition-all duration-500"
          style={{ width: `${Math.min(patientThreshold, populationThreshold)}%` }}
        />
        <div 
          className="bg-risk-medium/20 transition-all duration-500"
          style={{ width: `${Math.abs(patientThreshold - populationThreshold)}%` }}
        />
        <div 
          className="bg-risk-high/20 flex-1"
        />
      </div>

      {/* Population threshold marker */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50 transition-all duration-500 z-10"
            style={{ left: `${populationThreshold}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <Users className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground whitespace-nowrap">
              Pop: {populationThreshold}%
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Population default threshold: {populationThreshold}%</p>
        </TooltipContent>
      </Tooltip>

      {/* Patient-specific threshold marker */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="absolute top-0 bottom-0 w-1 bg-primary transition-all duration-500 z-20"
            style={{ left: `${patientThreshold}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <User className="w-3 h-3 text-primary" />
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-primary font-semibold whitespace-nowrap">
              Adaptive: {patientThreshold}%
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Patient-specific adaptive threshold: {patientThreshold}%</p>
        </TooltipContent>
      </Tooltip>

      {/* Current score indicator */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-500 z-30",
              isAbovePatientThreshold 
                ? "bg-risk-high border-risk-high shadow-lg shadow-risk-high/50" 
                : "bg-risk-low border-risk-low shadow-lg shadow-risk-low/50"
            )}
            style={{ left: `calc(${currentScore}% - 8px)` }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Current risk score: {currentScore}%</p>
          <p className="text-[10px] text-muted-foreground">
            {isAbovePatientThreshold ? 'Above adaptive threshold - Alert triggered' : 'Below adaptive threshold'}
          </p>
        </TooltipContent>
      </Tooltip>

      {/* False positive zone highlight */}
      {patientThreshold < populationThreshold && (
        <div 
          className="absolute top-0 bottom-0 bg-amber-500/10 border-y border-amber-500/30"
          style={{ 
            left: `${patientThreshold}%`, 
            width: `${populationThreshold - patientThreshold}%` 
          }}
        />
      )}
    </div>
  );
};

export const AdaptiveThresholdVisualization = ({ patient, className }: AdaptiveThresholdVisualizationProps) => {
  const thresholdData = calculateAdaptiveThreshold(patient);
  const thresholdDiff = thresholdData.populationThreshold - thresholdData.patientThreshold;
  const isLowerThreshold = thresholdDiff > 0;

  return (
    <TooltipProvider>
      <div className={cn("bg-card rounded-xl border border-border/50 p-5 shadow-card", className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Adaptive Threshold
            </h3>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-accent/10 border border-accent/30">
                <Award className="w-3 h-3 text-accent" />
                <span className="text-[9px] text-accent font-medium">Claim #5</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Confidence-Based Risk Stratification (Patent Pending)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Comparison Summary */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase">Population</span>
            </div>
            <div className="text-2xl font-bold text-muted-foreground">
              {thresholdData.populationThreshold}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] text-primary uppercase">This Patient</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {thresholdData.patientThreshold}%
            </div>
          </div>
        </div>

        {/* Threshold Bar Visualization */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Risk Score Scale</span>
            <span className="text-xs text-muted-foreground">0% → 100%</span>
          </div>
          <ThresholdBar 
            populationThreshold={thresholdData.populationThreshold}
            patientThreshold={thresholdData.patientThreshold}
            currentScore={thresholdData.currentScore}
          />
        </div>

        {/* Adaptation Factors */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Threshold Adaptation Factors
          </h4>
          <div className="space-y-1.5">
            {thresholdData.adaptationFactors.map((factor, idx) => (
              <div 
                key={idx}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg text-xs",
                  factor.direction === 'lower' 
                    ? "bg-risk-high/5 border border-risk-high/20" 
                    : "bg-risk-low/5 border border-risk-low/20"
                )}
              >
                <span className="text-foreground">{factor.factor}</span>
                <span className={cn(
                  "font-mono font-semibold",
                  factor.direction === 'lower' ? "text-risk-high" : "text-risk-low"
                )}>
                  {factor.adjustment > 0 ? '+' : ''}{factor.adjustment}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Summary */}
        <div className={cn(
          "p-4 rounded-lg border",
          isLowerThreshold 
            ? "bg-risk-high/5 border-risk-high/20" 
            : "bg-risk-low/5 border-risk-low/20"
        )}>
          <div className="flex items-start gap-3">
            {isLowerThreshold ? (
              <AlertTriangle className="w-5 h-5 text-risk-high flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-risk-low flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">
                {isLowerThreshold 
                  ? `Threshold lowered by ${Math.abs(thresholdDiff)}% for earlier detection`
                  : `Threshold raised by ${Math.abs(thresholdDiff)}% to reduce false alerts`
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {isLowerThreshold
                  ? "Patient characteristics indicate higher baseline risk, requiring more sensitive monitoring."
                  : "Patient's protective factors allow for a higher alert threshold."
                }
              </p>
            </div>
          </div>
        </div>

        {/* False Positive Reduction */}
        <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-risk-low" />
            <span className="text-xs text-foreground">Est. False Positive Reduction</span>
          </div>
          <span className="text-lg font-bold text-risk-low">
            ~{thresholdData.falsePositiveReduction}%
          </span>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Population Default</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-primary" />
            <span className="text-primary">Patient-Specific</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-risk-high border-2 border-risk-high" />
            <span className="text-muted-foreground">Current Score</span>
          </div>
        </div>

        <p className="text-[9px] text-muted-foreground mt-4 text-center italic">
          Dynamic threshold adaptation based on patient characteristics • Patent Pending
        </p>
      </div>
    </TooltipProvider>
  );
};