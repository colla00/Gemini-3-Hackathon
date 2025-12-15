import { ArrowLeft, Calendar, User, Activity, FileText, AlertTriangle, Lightbulb, BarChart3, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskBadge } from './RiskBadge';
import { ShapChart } from './ShapChart';
import { GroupedShapChart } from './GroupedShapChart';
import { RiskTrendChart } from './RiskTrendChart';
import { SuggestedActions } from './SuggestedActions';
import { WorkflowSequence } from './WorkflowSequence';
import { InterventionTimer } from './InterventionTimer';
import { EfficacySummary } from './EfficacyBadge';
import { MultiOutcomeComparison } from './MultiOutcomeComparison';
import type { Patient } from '@/data/patients';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

export const PatientDetail = ({ patient, onBack }: PatientDetailProps) => {
  const riskScoreColor = {
    HIGH: 'text-risk-high',
    MEDIUM: 'text-risk-medium',
    LOW: 'text-risk-low',
  }[patient.riskLevel];

  const riskScoreBg = {
    HIGH: 'bg-risk-high/10 border-risk-high/30',
    MEDIUM: 'bg-risk-medium/10 border-risk-medium/30',
    LOW: 'bg-risk-low/10 border-risk-low/30',
  }[patient.riskLevel];

  // Confidence interval based on risk level
  const confidenceInterval = patient.riskLevel === 'HIGH' ? 8 : patient.riskLevel === 'MEDIUM' ? 6 : 4;

  // Generate clinical insight based on patient data
  const getInsight = () => {
    const topFactor = patient.riskFactors.reduce((prev, curr) => 
      Math.abs(curr.contribution) > Math.abs(prev.contribution) ? curr : prev
    );
    const protectiveFactor = patient.riskFactors.find(f => f.contribution < 0);
    
    if (topFactor && protectiveFactor) {
      return `Notice how ${topFactor.name.toLowerCase()} (${topFactor.contribution >= 0 ? '+' : ''}${topFactor.contribution.toFixed(2)}) outweighs ${protectiveFactor.name.toLowerCase()} in the risk model.`;
    }
    return `The primary risk driver is ${topFactor.name.toLowerCase()} contributing ${topFactor.contribution >= 0 ? '+' : ''}${topFactor.contribution.toFixed(2)} to the overall score.`;
  };

  return (
    <TooltipProvider>
      <div className="animate-slide-in-right pb-20">
        {/* Workflow Sequence - shows where we are in the pipeline */}
        <WorkflowSequence activeStep="output" className="mb-6" />

        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-5 text-muted-foreground hover:text-foreground hover:bg-secondary group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Return to Dashboard
        </Button>

        {/* Patient Header */}
        <div className="bg-card rounded-xl border border-border/50 p-6 mb-6 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-secondary">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">{patient.id}</h2>
                <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Age: {patient.ageRange}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Admitted: {patient.admissionDate}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RiskBadge level={patient.riskLevel} className="text-base px-4 py-2" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-accent/10 border border-accent/30">
                    <Award className="w-3 h-3 text-accent" />
                    <span className="text-[10px] text-accent font-medium">Patent Pending</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">U.S. Prov. Pat. App. 63/932,953</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Risk Score Card with Confidence Interval */}
          <div className="bg-card rounded-xl border border-border/50 p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Current Risk Assessment
              </h3>
            </div>
            
            <div className={cn("rounded-xl border p-5 mb-5 text-center", riskScoreBg)}>
              <span className={cn("text-6xl font-extrabold", riskScoreColor)}>
                {patient.riskScore}%
              </span>
              {/* Confidence interval display (Patent: Confidence-based risk stratification) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-muted-foreground mt-2 text-sm font-medium cursor-help">
                    {patient.riskType} Risk Score
                    <span className="ml-2 text-xs opacity-70">
                      (95% CI: {patient.riskScore - confidenceInterval}-{patient.riskScore + confidenceInterval}%)
                    </span>
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs font-medium">Confidence-Based Stratification</p>
                  <p className="text-[10px] text-muted-foreground">Model uncertainty quantification</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Multi-Horizon Risk Trajectory (Patent: Multi-horizon forecasting) */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Multi-Horizon Forecast
                </h4>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  4h-48h
                </span>
              </div>
              <RiskTrendChart 
                currentScore={patient.riskScore} 
                trend={patient.trend}
                className="h-24"
                showConfidenceBands={true}
                showHorizons={true}
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ranked Contributing Factors
              </h4>
              {patient.riskFactors
                .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
                .map((factor, index) => (
                <div
                  key={factor.name}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/40 animate-fade-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-base">{factor.icon}</span>
                    {factor.name}
                  </span>
                  <span
                    className={cn(
                      "font-mono font-semibold text-xs",
                      factor.contribution >= 0 ? "text-risk-high" : "text-risk-low"
                    )}
                  >
                    {factor.contribution >= 0 ? '+' : ''}{factor.contribution.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Grouped SHAP Explainability Chart (Patent: Real-time SHAP integration) */}
          <div className="bg-card rounded-xl border border-border/50 p-5 shadow-card">
            <GroupedShapChart factors={patient.riskFactors} />
            
            {/* Clinical Insight Box */}
            <div className="mt-4 p-3.5 rounded-lg border border-primary/40 bg-primary/5">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-primary mb-1">Workflow-Aware Insight</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {getInsight()}
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              De-identified clinical features · Synthetic demonstration only
            </p>
          </div>

          {/* Multi-Outcome Comparison (Patent: Multi-outcome risk prediction) */}
          <MultiOutcomeComparison patient={patient} />

          {/* Suggested Actions (Patent: AI-guided intervention framework) */}
          <SuggestedActions patient={patient} />

          {/* Intervention Timer (Patent: AI-guided intervention framework) */}
          <InterventionTimer 
            riskType={patient.riskType}
            riskLevel={patient.riskLevel}
          />

          {/* Efficacy Summary (Patent: Intervention efficacy tracking) */}
          <EfficacySummary patientId={patient.id} />

          {/* Clinical Notes */}
          <div className="bg-card rounded-xl border border-border/50 p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Clinical Context
              </h3>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/40 border border-border/30">
              <p className="text-sm text-foreground leading-relaxed">
                {patient.clinicalNotes}
              </p>
            </div>
            
            <p className="text-[10px] text-muted-foreground mt-3">
              * Synthetic clinical notes · Human-in-the-loop judgment required
            </p>
          </div>
        </div>

        {/* Patent Footer */}
        <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/20 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Protected Innovation</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Features on this page are covered by U.S. Provisional Patent Application No. 63/932,953
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            © Dr. Alexis Collier | Clinical Risk Intelligence Dashboard – Patent Pending
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
};
