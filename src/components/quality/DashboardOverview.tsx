import { TrendingUp, TrendingDown, Minus, AlertTriangle, Shield, Activity, Users, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { riskCategories, patients, getRiskLevelColor, getRiskLevelBg, type RiskCategoryData } from '@/data/nursingOutcomes';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { InterventionsSummary } from './InterventionsPanel';

const RiskCard = ({ data }: { data: RiskCategoryData }) => {
  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
  const CategoryIcon = data.category === 'FALLS' ? AlertTriangle : data.category === 'HAPI' ? Shield : Activity;
  
  return (
    <div className="glass-card rounded-lg p-4 hover:border-primary/30 transition-all duration-200 border border-transparent">
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
            <h3 className="text-sm font-semibold text-foreground">{data.label}</h3>
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider", getRiskLevelColor(data.level))}>
              {data.level}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceIndicator confidence={data.confidence} showLabel={false} />
          <TrendIcon className={cn(
            "w-3.5 h-3.5",
            data.trend === 'up' ? 'text-risk-high' : data.trend === 'down' ? 'text-risk-low' : 'text-muted-foreground'
          )} />
        </div>
      </div>

      {/* Score Display */}
      <div className="flex items-end gap-1 mb-2">
        <span className={cn("text-4xl font-bold leading-none", getRiskLevelColor(data.level))}>
          {data.score}
        </span>
        <span className="text-lg font-semibold text-muted-foreground mb-0.5">%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden mb-3">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getRiskLevelBg(data.level))}
          style={{ width: `${data.score}%` }}
        />
      </div>

      {/* Factors - Compact */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Key Factors
        </span>
        {data.factors.slice(0, 2).map((factor, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between py-1.5 px-2 rounded text-[11px]",
              factor.impact === 'negative' ? 'bg-risk-high/10' :
              factor.impact === 'positive' ? 'bg-risk-low/10' : 'bg-muted/20'
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

const QuickStatCard = ({ label, value, icon: Icon, color, subtext }: { label: string; value: string | number; icon: React.ElementType; color: string; subtext?: string }) => (
  <div className="glass-card rounded-lg p-3 flex items-center gap-3">
    <div className={cn("w-10 h-10 rounded flex items-center justify-center", color)}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground block">{label}</span>
      {subtext && <span className="text-[9px] text-muted-foreground/70">{subtext}</span>}
    </div>
  </div>
);

const PriorityPatientRow = ({ patient, index }: { patient: typeof patients[0]; index: number }) => (
  <div className={cn(
    "flex items-center justify-between py-2 px-3 rounded hover:bg-secondary/30 cursor-pointer transition-colors",
    patient.fallsLevel === 'HIGH' && "bg-risk-high/5 border-l-2 border-l-risk-high"
  )}>
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-mono text-muted-foreground w-4">{index + 1}</span>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground">{patient.mrn}</span>
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
          {patient.fallsRisk}%
        </span>
        <div className="flex items-center gap-1 justify-end">
          <ConfidenceIndicator confidence={patient.fallsConfidence} showLabel={false} size="sm" />
        </div>
      </div>
      <div className={cn(
        "px-2 py-0.5 rounded text-[10px] font-semibold uppercase",
        patient.fallsLevel === 'HIGH' ? 'bg-risk-high/20 text-risk-high' :
        patient.fallsLevel === 'MODERATE' ? 'bg-risk-medium/20 text-risk-medium' :
        'bg-risk-low/20 text-risk-low'
      )}>
        {patient.fallsLevel}
      </div>
    </div>
  </div>
);

export const DashboardOverview = () => {
  const highRiskCount = patients.filter(p => p.fallsLevel === 'HIGH').length;
  const moderateRiskCount = patients.filter(p => p.fallsLevel === 'MODERATE').length;
  const immediateActions = patients.flatMap(p => p.interventions).filter(i => i.priority === 'immediate').length;

  return (
    <div className="space-y-4">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickStatCard label="Total Patients" value={patients.length} icon={Users} color="bg-primary/20 text-primary" subtext="Unit 4C Census" />
        <QuickStatCard label="High Risk" value={highRiskCount} icon={AlertCircle} color="bg-risk-high/20 text-risk-high" subtext="Immediate attention" />
        <QuickStatCard label="Moderate Risk" value={moderateRiskCount} icon={AlertTriangle} color="bg-risk-medium/20 text-risk-medium" subtext="Monitoring required" />
        <QuickStatCard label="Pending Actions" value={immediateActions} icon={Clock} color="bg-warning/20 text-warning" subtext="Immediate priority" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Categories - Left 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Risk Categories</h2>
            <span className="text-[10px] text-muted-foreground">Unit 4C Summary • Avg Confidence: 87%</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {riskCategories.map((category) => (
              <RiskCard key={category.category} data={category} />
            ))}
          </div>
          
          {/* Disclaimer - Inline */}
          <div className="p-2.5 rounded bg-warning/10 border border-warning/30 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
            <p className="text-[11px] text-warning">
              <strong>Synthetic Data:</strong> All values are simulated for demonstration. Confidence scores indicate model prediction reliability.
            </p>
          </div>
        </div>

        {/* Right column - Priority + Interventions */}
        <div className="space-y-4">
          {/* Priority Queue */}
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Priority Queue</h3>
              <span className="text-[10px] text-primary font-medium">By Falls Risk</span>
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
    </div>
  );
};
