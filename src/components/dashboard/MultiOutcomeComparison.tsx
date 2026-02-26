import { useState } from 'react';
import { 
  Activity, TrendingUp, TrendingDown, Minus, 
  AlertTriangle, Award, ChevronRight, Footprints,
  Bed, Droplets, Plug
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskTrendChart } from './RiskTrendChart';
import type { Patient } from '@/data/patients';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MultiOutcomeComparisonProps {
  patient: Patient;
  className?: string;
}

interface OutcomeData {
  id: string;
  label: string;
  shortLabel: string;
  icon: typeof Footprints;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  trend: 'up' | 'down' | 'stable';
  topFactor: string;
  color: string;
}

// Qualitative level labels
const levelLabels = {
  HIGH: 'Elevated',
  MEDIUM: 'Moderate',
  LOW: 'Low',
};

// Qualitative trend labels
const trendLabels = {
  up: 'Rising',
  down: 'Declining',
  stable: 'Stable',
};

// Generate simulated multi-outcome data based on primary risk
const generateOutcomeData = (patient: Patient): OutcomeData[] => {
  const isPrimary = (type: string) => patient.riskType === type;
  
  // Map score to risk level
  const scoreToLevel = (score: number): 'HIGH' | 'MEDIUM' | 'LOW' => {
    if (score >= 70) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  };
  
  const baseScore = patient.riskScore;
  
  return [
    {
      id: 'falls',
      label: 'Falls Risk',
      shortLabel: 'Falls',
      icon: Footprints,
      riskLevel: isPrimary('Falls') ? scoreToLevel(baseScore) : scoreToLevel(Math.max(10, baseScore - 15 + Math.random() * 20)),
      trend: isPrimary('Falls') ? patient.trend : (Math.random() > 0.5 ? 'stable' : 'down'),
      topFactor: 'Mobility impairment',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    },
    {
      id: 'hapi',
      label: 'Pressure Injury',
      shortLabel: 'HAPI',
      icon: Bed,
      riskLevel: isPrimary('Pressure Injury') ? scoreToLevel(baseScore) : scoreToLevel(Math.max(10, baseScore - 20 + Math.random() * 25)),
      trend: isPrimary('Pressure Injury') ? patient.trend : (Math.random() > 0.6 ? 'down' : 'stable'),
      topFactor: 'Braden score',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    },
    {
      id: 'cauti',
      label: 'CAUTI Risk',
      shortLabel: 'CAUTI',
      icon: Droplets,
      riskLevel: isPrimary('CAUTI') ? scoreToLevel(baseScore) : scoreToLevel(Math.max(10, baseScore - 25 + Math.random() * 30)),
      trend: isPrimary('CAUTI') ? patient.trend : (Math.random() > 0.4 ? 'up' : 'stable'),
      topFactor: 'Catheter dwell time',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'device',
      label: 'Device Complication',
      shortLabel: 'Device',
      icon: Plug,
      riskLevel: isPrimary('Device Complication') ? scoreToLevel(baseScore) : scoreToLevel(Math.max(10, baseScore - 30 + Math.random() * 25)),
      trend: isPrimary('Device Complication') ? patient.trend : 'stable',
      topFactor: 'Line duration',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    },
  ];
};

const OutcomeCard = ({ outcome, isPrimary }: { outcome: OutcomeData; isPrimary: boolean }) => {
  const TrendIcon = outcome.trend === 'up' ? TrendingUp : outcome.trend === 'down' ? TrendingDown : Minus;
  const trendColor = outcome.trend === 'up' ? 'text-risk-high' : outcome.trend === 'down' ? 'text-risk-low' : 'text-muted-foreground';
  const riskColor = {
    HIGH: 'text-risk-high',
    MEDIUM: 'text-risk-medium',
    LOW: 'text-risk-low',
  }[outcome.riskLevel];

  const riskBg = {
    HIGH: 'bg-risk-high/10',
    MEDIUM: 'bg-risk-medium/10',
    LOW: 'bg-risk-low/10',
  }[outcome.riskLevel];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "relative p-4 rounded-xl border transition-all cursor-default",
          outcome.color,
          isPrimary && "ring-2 ring-primary ring-offset-2 ring-offset-background"
        )}>
          {isPrimary && (
            <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
              PRIMARY
            </div>
          )}
          
          <div className="flex items-center gap-2 mb-3">
            <outcome.icon className="w-5 h-5" />
            <span className="text-sm font-semibold">{outcome.shortLabel}</span>
          </div>
          
          <div className="flex items-end justify-between mb-2">
            <div className={cn("px-3 py-1.5 rounded-lg font-bold text-lg", riskBg, riskColor)}>
              {levelLabels[outcome.riskLevel]}
            </div>
            <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md bg-background/50", trendColor)}>
              <TrendIcon className="w-3 h-3" />
              <span className="text-[10px]">{trendLabels[outcome.trend]}</span>
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t border-current/10">
            <p className="text-[10px] opacity-70 truncate">
              Top: {outcome.topFactor}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">{outcome.label}</p>
          <p className="text-xs text-muted-foreground">
            Signal: {levelLabels[outcome.riskLevel]} · Trajectory: {trendLabels[outcome.trend]}
          </p>
          <p className="text-xs text-muted-foreground">
            Top Contributing Factor: {outcome.topFactor}
          </p>
          {isPrimary && (
            <p className="text-xs text-primary font-medium">
              Primary risk outcome for this patient
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export const MultiOutcomeComparison = ({ patient, className }: MultiOutcomeComparisonProps) => {
  const outcomeData = generateOutcomeData(patient);
  const primaryOutcome = patient.riskType;
  
  // Count elevated outcomes
  const elevatedCount = outcomeData.filter(o => o.riskLevel === 'HIGH').length;
  const moderateCount = outcomeData.filter(o => o.riskLevel === 'MEDIUM').length;

  return (
    <TooltipProvider>
      <div className={cn("bg-card rounded-xl border border-border/50 p-5 shadow-card", className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Multi-Outcome Profile
            </h3>
          </div>
        </div>

        {/* Summary Stats - Qualitative */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-risk-high/10 border border-risk-high/30 text-center">
            <div className="text-lg font-bold text-risk-high">
              {elevatedCount === 0 ? 'None' : elevatedCount === 1 ? 'One' : elevatedCount === 2 ? 'Two' : 'Multiple'}
            </div>
            <div className="text-[10px] text-muted-foreground">Elevated Signals</div>
          </div>
          <div className="p-3 rounded-lg bg-risk-medium/10 border border-risk-medium/30 text-center">
            <div className="text-lg font-bold text-risk-medium">
              {moderateCount === 0 ? 'None' : moderateCount === 1 ? 'One' : moderateCount === 2 ? 'Two' : 'Multiple'}
            </div>
            <div className="text-[10px] text-muted-foreground">Moderate Signals</div>
          </div>
        </div>

        {/* Outcome Grid */}
        <div className="grid grid-cols-2 gap-3">
          {outcomeData.map((outcome) => (
            <OutcomeCard 
              key={outcome.id}
              outcome={outcome}
              isPrimary={
                (outcome.id === 'falls' && primaryOutcome === 'Falls') ||
                (outcome.id === 'hapi' && primaryOutcome === 'Pressure Injury') ||
                (outcome.id === 'cauti' && primaryOutcome === 'CAUTI') ||
                (outcome.id === 'device' && primaryOutcome === 'Device Complication')
              }
            />
          ))}
        </div>

        {/* Alert for multiple elevated signals */}
        {elevatedCount >= 2 && (
          <div className="mt-4 p-3 rounded-lg bg-risk-high/10 border border-risk-high/30 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-risk-high mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-risk-high">
                Multiple Elevated Signals
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Context suggests coordinated review may be warranted
              </p>
            </div>
          </div>
        )}

        <p className="text-[9px] text-muted-foreground mt-4 text-center italic">
          Simultaneous outcome monitoring · U.S. Patent Application Filed
        </p>
      </div>
    </TooltipProvider>
  );
};