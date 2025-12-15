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
  score: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  topFactor: string;
  color: string;
}

// Generate simulated multi-outcome data based on primary risk
const generateOutcomeData = (patient: Patient): OutcomeData[] => {
  const baseScore = patient.riskScore;
  const isPrimary = (type: string) => patient.riskType === type;
  
  return [
    {
      id: 'falls',
      label: 'Falls Risk',
      shortLabel: 'Falls',
      icon: Footprints,
      score: isPrimary('Falls') ? baseScore : Math.max(10, Math.min(95, baseScore - 15 + Math.random() * 20)),
      trend: isPrimary('Falls') ? patient.trend : (Math.random() > 0.5 ? 'stable' : 'down'),
      confidence: 92,
      topFactor: 'Mobility impairment',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    },
    {
      id: 'hapi',
      label: 'Pressure Injury',
      shortLabel: 'HAPI',
      icon: Bed,
      score: isPrimary('Pressure Injury') ? baseScore : Math.max(10, Math.min(95, baseScore - 20 + Math.random() * 25)),
      trend: isPrimary('Pressure Injury') ? patient.trend : (Math.random() > 0.6 ? 'down' : 'stable'),
      confidence: 89,
      topFactor: 'Braden score',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    },
    {
      id: 'cauti',
      label: 'CAUTI Risk',
      shortLabel: 'CAUTI',
      icon: Droplets,
      score: isPrimary('CAUTI') ? baseScore : Math.max(10, Math.min(95, baseScore - 25 + Math.random() * 30)),
      trend: isPrimary('CAUTI') ? patient.trend : (Math.random() > 0.4 ? 'up' : 'stable'),
      confidence: 87,
      topFactor: 'Catheter dwell time',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'device',
      label: 'Device Complication',
      shortLabel: 'Device',
      icon: Plug,
      score: isPrimary('Device Complication') ? baseScore : Math.max(10, Math.min(95, baseScore - 30 + Math.random() * 25)),
      trend: isPrimary('Device Complication') ? patient.trend : 'stable',
      confidence: 85,
      topFactor: 'Line duration',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    },
  ];
};

const getRiskLevel = (score: number): 'HIGH' | 'MEDIUM' | 'LOW' => {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
};

const OutcomeCard = ({ outcome, isPrimary }: { outcome: OutcomeData; isPrimary: boolean }) => {
  const TrendIcon = outcome.trend === 'up' ? TrendingUp : outcome.trend === 'down' ? TrendingDown : Minus;
  const trendColor = outcome.trend === 'up' ? 'text-risk-high' : outcome.trend === 'down' ? 'text-risk-low' : 'text-muted-foreground';
  const riskLevel = getRiskLevel(outcome.score);
  const riskColor = {
    HIGH: 'text-risk-high',
    MEDIUM: 'text-risk-medium',
    LOW: 'text-risk-low',
  }[riskLevel];

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
            <div>
              <span className={cn("text-3xl font-extrabold", riskColor)}>
                {Math.round(outcome.score)}
              </span>
              <span className={cn("text-lg font-semibold ml-0.5", riskColor)}>%</span>
            </div>
            <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md bg-background/50", trendColor)}>
              <TrendIcon className="w-3 h-3" />
            </div>
          </div>
          
          {/* Mini sparkline */}
          <RiskTrendChart 
            currentScore={outcome.score}
            trend={outcome.trend}
            className="h-10 -mx-1"
            showConfidenceBands={false}
            showHorizons={false}
          />
          
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
            Risk Score: {Math.round(outcome.score)}% (95% CI: ±{100 - outcome.confidence}%)
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
  
  // Calculate aggregate risk
  const avgRisk = Math.round(outcomeData.reduce((sum, o) => sum + o.score, 0) / outcomeData.length);
  const highRiskCount = outcomeData.filter(o => o.score >= 70).length;

  return (
    <TooltipProvider>
      <div className={cn("bg-card rounded-xl border border-border/50 p-5 shadow-card", className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Multi-Outcome Risk Profile
            </h3>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-accent/10 border border-accent/30">
                <Award className="w-3 h-3 text-accent" />
                <span className="text-[9px] text-accent font-medium">Claim #2</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Multi-Outcome Risk Prediction (Patent Pending)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 text-center">
            <div className="text-2xl font-bold text-primary">{avgRisk}%</div>
            <div className="text-[10px] text-muted-foreground">Avg Risk Score</div>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 text-center">
            <div className={cn(
              "text-2xl font-bold",
              highRiskCount > 0 ? "text-risk-high" : "text-risk-low"
            )}>
              {highRiskCount}/{outcomeData.length}
            </div>
            <div className="text-[10px] text-muted-foreground">High Risk Outcomes</div>
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

        {/* Alert for multiple high risks */}
        {highRiskCount >= 2 && (
          <div className="mt-4 p-3 rounded-lg bg-risk-high/10 border border-risk-high/30 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-risk-high mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-risk-high">
                Multiple High-Risk Outcomes Detected
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Patient requires coordinated multi-outcome intervention strategy
              </p>
            </div>
          </div>
        )}

        <p className="text-[9px] text-muted-foreground mt-4 text-center italic">
          Simultaneous NSO prediction • Patent Pending
        </p>
      </div>
    </TooltipProvider>
  );
};