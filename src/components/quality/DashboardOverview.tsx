import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Shield, Activity, Users, Clock, AlertCircle, Heart, Thermometer, Droplets, RefreshCw, Syringe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { riskCategories, patients, getRiskLevelColor, getRiskLevelBg, type RiskCategoryData } from '@/data/nursingOutcomes';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { InterventionsSummary } from './InterventionsPanel';
import { ClinicalTooltip, MetricTooltip } from './ClinicalTooltip';
import { AdaptiveThresholds } from './AdaptiveThresholds';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DashboardOverviewProps {
  liveSimulation?: {
    isActive: boolean;
    updateCount: number;
    lastUpdate: Date;
  };
}

const RiskCard = ({ data, index, isLive }: { data: RiskCategoryData; index: number; isLive?: boolean }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
  const CategoryIcon = data.category === 'FALLS' ? AlertTriangle : data.category === 'HAPI' ? Shield : data.category === 'CAUTI' ? Syringe : Activity;
  
  useEffect(() => {
    // Animate score on mount
    const timer = setTimeout(() => {
      let current = 0;
      const increment = data.score / 30;
      const interval = setInterval(() => {
        current += increment;
        if (current >= data.score) {
          setAnimatedScore(data.score);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, 20);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [data.score, index]);

  return (
    <div 
      className={cn(
        "glass-card rounded-lg p-4 hover:border-primary/30 transition-all duration-300 border border-transparent hover-lift opacity-0 animate-fade-in-up",
        isLive && "ring-1 ring-risk-low/30"
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded flex items-center justify-center",
            data.level === 'HIGH' ? 'bg-risk-high/20' : data.level === 'MODERATE' ? 'bg-risk-medium/20' : 'bg-risk-low/20'
          )}>
            <CategoryIcon className={cn("w-4 h-4", getRiskLevelColor(data.level))} />
          </div>
          <div>
            <ClinicalTooltip term={data.category === 'FALLS' ? 'Falls Risk' : data.category}>
              <h3 className="text-sm font-semibold text-foreground">{data.label}</h3>
            </ClinicalTooltip>
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider", getRiskLevelColor(data.level))}>
              {data.level}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ClinicalTooltip term="Confidence" showIcon={false}>
            <ConfidenceIndicator confidence={data.confidence} showLabel={false} />
          </ClinicalTooltip>
          <TrendIcon className={cn(
            "w-3.5 h-3.5",
            data.trend === 'up' ? 'text-risk-high' : data.trend === 'down' ? 'text-risk-low' : 'text-muted-foreground'
          )} />
        </div>
      </div>

      {/* Score Display - Qualitative */}
      <MetricTooltip 
        label="Unit Risk Signal" 
        value={data.level === 'HIGH' ? 'Elevated' : data.level === 'MODERATE' ? 'Moderate' : 'Low'}
        details="Aggregate risk signal for all patients in Unit 4C. Based on individual patient assessments."
        trend={data.trend === 'up' ? 'up' : data.trend === 'down' ? 'down' : 'stable'}
      >
        <div className="flex items-end gap-1 mb-2">
          <span className={cn("text-2xl font-bold leading-none transition-all", getRiskLevelColor(data.level))}>
            {data.level === 'HIGH' ? 'Elevated' : data.level === 'MODERATE' ? 'Moderate' : 'Low'}
          </span>
          {isLive && (
            <RefreshCw className="w-3 h-3 text-risk-low ml-1 animate-spin" style={{ animationDuration: '3s' }} />
          )}
        </div>
      </MetricTooltip>

      {/* Progress Bar - Visual indicator */}
      <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden mb-3">
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", getRiskLevelBg(data.level))}
          style={{ 
            width: data.level === 'HIGH' ? '85%' : data.level === 'MODERATE' ? '55%' : '25%',
          }}
        />
      </div>

      {/* Factors - Compact */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Key Factors
        </span>
        {data.factors.slice(0, 2).map((factor, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-center justify-between py-1.5 px-2 rounded text-[11px] transition-colors",
              factor.impact === 'negative' ? 'bg-risk-high/10 hover:bg-risk-high/15' :
              factor.impact === 'positive' ? 'bg-risk-low/10 hover:bg-risk-low/15' : 'bg-muted/20 hover:bg-muted/30'
            )}
          >
            <span className="text-foreground truncate flex-1">{factor.label}</span>
            <span className={cn(
              "text-[10px] font-medium ml-2 shrink-0",
              factor.impact === 'negative' ? 'text-risk-high' :
              factor.impact === 'positive' ? 'text-risk-low' : 'text-muted-foreground'
            )}>
              {factor.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuickStatCard = ({ label, value, icon: Icon, color, subtext, index, tooltip }: { 
  label: string; 
  value: string | number; 
  icon: React.ElementType; 
  color: string; 
  subtext?: string; 
  index?: number;
  tooltip?: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className="glass-card rounded-lg p-3 flex items-center gap-3 hover-lift cursor-default opacity-0 animate-fade-in"
          style={{ animationDelay: `${(index || 0) * 75}ms`, animationFillMode: 'forwards' }}
        >
          <div className={cn("w-10 h-10 rounded flex items-center justify-center", color)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-foreground tabular-nums">{value}</span>
            <span className="text-[11px] text-muted-foreground block">{label}</span>
            {subtext && <span className="text-[9px] text-muted-foreground/70">{subtext}</span>}
          </div>
        </div>
      </TooltipTrigger>
      {tooltip && (
        <TooltipContent side="bottom" className="text-[10px] max-w-xs">
          {tooltip}
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);

const PriorityPatientRow = ({ patient, index }: { patient: typeof patients[0]; index: number }) => {
  const getRiskSignal = (level: string) => {
    switch (level) {
      case 'HIGH': return 'Elevated';
      case 'MODERATE': return 'Moderate';
      case 'LOW': return 'Low';
      default: return 'Low';
    }
  };

  return (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={cn(
            "flex items-center justify-between py-2 px-3 rounded hover:bg-secondary/30 cursor-pointer transition-all duration-200 opacity-0 animate-slide-in-right",
            patient.fallsLevel === 'HIGH' && "bg-risk-high/5 border-l-2 border-l-risk-high"
          )}
          style={{ animationDelay: `${300 + index * 75}ms`, animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-foreground w-4">{index + 1}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <ClinicalTooltip term="MRN" showIcon={false}>
                  <span className="text-sm font-medium text-foreground">{patient.mrn}</span>
                </ClinicalTooltip>
                <span className="text-[10px] text-muted-foreground">• {patient.age}{patient.sex}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>Rm {patient.bed}</span>
                <span className="text-primary">HR {patient.vitals.heartRate}</span>
                <span className="text-muted-foreground/70">{patient.vitals.bp}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className={cn("text-sm font-bold", getRiskLevelColor(patient.fallsLevel))}>
                {getRiskSignal(patient.fallsLevel)}
              </span>
            </div>
            <div className={cn(
              "px-2 py-0.5 rounded text-[10px] font-semibold uppercase",
              patient.fallsLevel === 'HIGH' ? 'bg-risk-high/20 text-risk-high' :
              patient.fallsLevel === 'MODERATE' ? 'bg-risk-medium/20 text-risk-medium' :
              'bg-risk-low/20 text-risk-low'
            )}>
              {getRiskSignal(patient.fallsLevel)}
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-xs p-3">
        <div className="space-y-2">
          <div className="font-semibold text-xs">{patient.diagnosis}</div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-risk-high" />
              <span>HR: {patient.vitals.heartRate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-primary" />
              <span>BP: {patient.vitals.bp}</span>
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-risk-medium" />
              <span>Temp: {patient.vitals.temp}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[8px]">O₂</span>
              <span>SpO2: {patient.vitals.o2Sat}</span>
            </div>
          </div>
          <div className="text-[9px] text-muted-foreground">
            <ClinicalTooltip term="LOS" showIcon={false}>LOS: {patient.los} days</ClinicalTooltip>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  );
};

export const DashboardOverview = ({ liveSimulation }: DashboardOverviewProps) => {
  const getQualitativeCount = (count: number) => {
    if (count === 0) return 'None';
    if (count === 1) return 'One';
    if (count <= 3) return 'Few';
    if (count <= 6) return 'Several';
    return 'Multiple';
  };

  const highRiskCount = patients.filter(p => p.fallsLevel === 'HIGH').length;
  const moderateRiskCount = patients.filter(p => p.fallsLevel === 'MODERATE').length;
  const immediateActions = patients.flatMap(p => p.interventions).filter(i => i.priority === 'immediate').length;

  return (
    <div className="space-y-4">
      {/* Quick Stats Row - Qualitative */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-tour="quick-stats">
        <QuickStatCard 
          index={0} 
          label="Total Patients" 
          value={getQualitativeCount(patients.length)} 
          icon={Users} 
          color="bg-primary/20 text-primary" 
          subtext="Unit 4C Census"
          tooltip="Current patient count for Unit 4C Med/Surg"
        />
        <QuickStatCard 
          index={1} 
          label="Elevated Risk" 
          value={getQualitativeCount(highRiskCount)} 
          icon={AlertCircle} 
          color="bg-risk-high/20 text-risk-high" 
          subtext="Immediate attention"
          tooltip="Patients with elevated risk signals requiring immediate assessment"
        />
        <QuickStatCard 
          index={2} 
          label="Moderate Risk" 
          value={getQualitativeCount(moderateRiskCount)} 
          icon={AlertTriangle} 
          color="bg-risk-medium/20 text-risk-medium" 
          subtext="Monitoring required"
          tooltip="Patients with moderate risk signals requiring enhanced monitoring"
        />
        <QuickStatCard 
          index={3} 
          label="Pending Actions" 
          value={getQualitativeCount(immediateActions)} 
          icon={Clock} 
          color="bg-warning/20 text-warning" 
          subtext="Immediate priority"
          tooltip="Interventions flagged as immediate priority requiring nurse action"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Categories - Left 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              <ClinicalTooltip term="NSO">Risk Categories</ClinicalTooltip>
            </h2>
            <div className="flex items-center gap-2">
              {/* Adaptive Thresholds Indicator */}
              <AdaptiveThresholds compact />
              {liveSimulation?.isActive && (
                <span className="flex items-center gap-1 text-[10px] text-risk-low">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
                  Live
                </span>
              )}
              <span className="text-[10px] text-muted-foreground hidden md:inline">Unit 4C</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3" data-tour="risk-cards">
            {riskCategories.map((category, index) => (
              <RiskCard key={category.category} data={category} index={index} isLive={liveSimulation?.isActive} />
            ))}
          </div>
          
          {/* Disclaimer - Inline */}
          <div className="p-2.5 rounded bg-warning/10 border border-warning/30 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 animate-pulse" />
            <p className="text-[11px] text-warning">
              <strong>Synthetic Data:</strong> All values are simulated for demonstration. Risk signals are categorical, not numerical.
            </p>
          </div>
        </div>

        {/* Right column - Priority + Interventions */}
        <div className="space-y-4">
          {/* Priority Queue */}
          <div className="glass-card rounded-lg p-4" data-tour="priority-queue">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Priority Queue</h3>
              <span className="text-[10px] text-primary font-medium">By <ClinicalTooltip term="Falls Risk" showIcon={false}>Falls Risk</ClinicalTooltip></span>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {[...patients].sort((a, b) => b.fallsRisk - a.fallsRisk).slice(0, 5).map((patient, index) => (
                <PriorityPatientRow key={patient.id} patient={patient} index={index} />
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border/30">
              <button className="w-full py-2 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors">
                View All {patients.length} Patients →
              </button>
            </div>
          </div>

          {/* Interventions Summary */}
          <InterventionsSummary patients={patients} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border/30 text-center">
        <p className="text-[9px] text-muted-foreground">
          Clinical Risk Intelligence Dashboard – Patent Pending
        </p>
      </div>
    </div>
  );
};
