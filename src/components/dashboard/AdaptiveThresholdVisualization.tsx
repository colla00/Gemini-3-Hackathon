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
  populationLevel: 'Standard' | 'Elevated' | 'Conservative';
  patientLevel: 'Heightened Sensitivity' | 'Standard' | 'Conservative';
  currentSignal: 'Low' | 'Moderate' | 'Elevated';
  adaptationFactors: {
    factor: string;
    influence: 'Strong' | 'Moderate' | 'Mild';
    direction: 'increases' | 'decreases';
  }[];
  sensitivityAdjustment: 'Significantly' | 'Moderately' | 'Slightly';
}

// Calculate adaptive threshold based on patient characteristics
const calculateAdaptiveThreshold = (patient: Patient): ThresholdData => {
  // Simulated adaptation factors based on patient characteristics
  const adaptationFactors: ThresholdData['adaptationFactors'] = [];
  let sensitivityScore = 0;

  // Age-based adjustment
  if (patient.ageRange.includes('70') || patient.ageRange.includes('80') || patient.ageRange.includes('90')) {
    adaptationFactors.push({ factor: 'Age > 70', influence: 'Moderate', direction: 'increases' });
    sensitivityScore += 2;
  }

  // Prior event history (simulated)
  if (patient.riskLevel === 'HIGH') {
    adaptationFactors.push({ factor: 'Prior event history', influence: 'Strong', direction: 'increases' });
    sensitivityScore += 3;
  }

  // Length of stay (simulated)
  const daysAdmitted = Math.floor(Math.random() * 10) + 3;
  if (daysAdmitted > 7) {
    adaptationFactors.push({ factor: 'Extended length of stay', influence: 'Moderate', direction: 'increases' });
    sensitivityScore += 2;
  }

  // Protective factors
  if (patient.trend === 'down') {
    adaptationFactors.push({ factor: 'Improving trend', influence: 'Moderate', direction: 'decreases' });
    sensitivityScore -= 2;
  }

  // Mobility status (simulated)
  if (patient.riskType === 'Falls') {
    adaptationFactors.push({ factor: 'Mobility impairment', influence: 'Strong', direction: 'increases' });
    sensitivityScore += 3;
  }

  // Determine qualitative levels
  const patientLevel = sensitivityScore >= 4 ? 'Heightened Sensitivity' : 
                       sensitivityScore <= -2 ? 'Conservative' : 'Standard';
  
  const currentSignal = patient.riskLevel === 'HIGH' ? 'Elevated' : 
                        patient.riskLevel === 'MEDIUM' ? 'Moderate' : 'Low';
  
  const sensitivityAdjustment = Math.abs(sensitivityScore) >= 4 ? 'Significantly' :
                                Math.abs(sensitivityScore) >= 2 ? 'Moderately' : 'Slightly';

  return {
    riskType: patient.riskType,
    populationLevel: 'Standard',
    patientLevel,
    currentSignal,
    adaptationFactors,
    sensitivityAdjustment,
  };
};

const ThresholdBar = ({ 
  patientLevel, 
  currentSignal 
}: { 
  patientLevel: string; 
  currentSignal: string;
}) => {
  const isElevatedSensitivity = patientLevel === 'Heightened Sensitivity';
  const isElevatedRisk = currentSignal === 'Elevated';

  return (
    <div className="relative h-12 bg-secondary/30 rounded-lg overflow-hidden border border-border/30">
      {/* Background gradient zones */}
      <div className="absolute inset-0 flex">
        <div className="bg-risk-low/20 flex-1 transition-all duration-500" />
        <div className="bg-risk-medium/20 flex-1 transition-all duration-500" />
        <div className="bg-risk-high/20 flex-1" />
      </div>

      {/* Zone labels */}
      <div className="absolute inset-0 flex items-end pb-1">
        <div className="flex-1 text-center text-[8px] text-muted-foreground">Low</div>
        <div className="flex-1 text-center text-[8px] text-muted-foreground">Moderate</div>
        <div className="flex-1 text-center text-[8px] text-muted-foreground">Elevated</div>
      </div>

      {/* Population threshold marker */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50 transition-all duration-500 z-10"
            style={{ left: '66%' }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <Users className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Population standard threshold</p>
        </TooltipContent>
      </Tooltip>

      {/* Patient-specific threshold marker */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="absolute top-0 bottom-0 w-1 bg-primary transition-all duration-500 z-20"
            style={{ left: isElevatedSensitivity ? '50%' : '66%' }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <User className="w-3 h-3 text-primary" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Patient-specific adaptive threshold: {patientLevel}</p>
        </TooltipContent>
      </Tooltip>

      {/* Current signal indicator */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-500 z-30",
              isElevatedRisk 
                ? "bg-risk-high border-risk-high shadow-lg shadow-risk-high/50" 
                : currentSignal === 'Moderate'
                  ? "bg-risk-medium border-risk-medium shadow-lg shadow-risk-medium/50"
                  : "bg-risk-low border-risk-low shadow-lg shadow-risk-low/50"
            )}
            style={{ left: isElevatedRisk ? '80%' : currentSignal === 'Moderate' ? '50%' : '20%' }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Current risk signal: {currentSignal}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export const AdaptiveThresholdVisualization = ({ patient, className }: AdaptiveThresholdVisualizationProps) => {
  const thresholdData = calculateAdaptiveThreshold(patient);
  const isHeightenedSensitivity = thresholdData.patientLevel === 'Heightened Sensitivity';

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
                <span className="text-[9px] text-accent font-medium">Patent Pending</span>
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
            <div className="text-lg font-bold text-muted-foreground">
              {thresholdData.populationLevel}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] text-primary uppercase">This Patient</span>
            </div>
            <div className="text-base font-bold text-primary">
              {thresholdData.patientLevel}
            </div>
          </div>
        </div>

        {/* Threshold Bar Visualization */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Risk Signal Scale</span>
            <span className="text-xs text-muted-foreground">Low → Elevated</span>
          </div>
          <ThresholdBar 
            patientLevel={thresholdData.patientLevel}
            currentSignal={thresholdData.currentSignal}
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
                  factor.direction === 'increases' 
                    ? "bg-risk-high/5 border border-risk-high/20" 
                    : "bg-risk-low/5 border border-risk-low/20"
                )}
              >
                <span className="text-foreground">{factor.factor}</span>
                <span className={cn(
                  "font-semibold",
                  factor.direction === 'increases' ? "text-risk-high" : "text-risk-low"
                )}>
                  {factor.influence} {factor.direction === 'increases' ? '↑' : '↓'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Summary */}
        <div className={cn(
          "p-4 rounded-lg border",
          isHeightenedSensitivity 
            ? "bg-risk-high/5 border-risk-high/20" 
            : "bg-risk-low/5 border-risk-low/20"
        )}>
          <div className="flex items-start gap-3">
            {isHeightenedSensitivity ? (
              <AlertTriangle className="w-5 h-5 text-risk-high flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-risk-low flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">
                {isHeightenedSensitivity 
                  ? `Sensitivity ${thresholdData.sensitivityAdjustment.toLowerCase()} increased for earlier detection`
                  : `Standard threshold maintained based on patient factors`
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {isHeightenedSensitivity
                  ? "Patient characteristics indicate higher baseline risk, requiring more sensitive monitoring."
                  : "Patient's factors allow for standard alert threshold."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Alert Precision Improvement */}
        <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-risk-low" />
            <span className="text-xs text-foreground">Alert Precision Improvement</span>
          </div>
          <span className="text-lg font-bold text-risk-low">
            {thresholdData.sensitivityAdjustment}
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
            <span className="text-muted-foreground">Current Signal</span>
          </div>
        </div>

        <p className="text-[9px] text-muted-foreground mt-4 text-center italic">
          Dynamic threshold adaptation based on patient characteristics • Patent Pending
        </p>
      </div>
    </TooltipProvider>
  );
};
