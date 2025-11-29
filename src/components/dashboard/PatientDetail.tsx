import { ArrowLeft, Calendar, User, Activity, FileText, AlertTriangle, Lightbulb, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskBadge } from './RiskBadge';
import { ShapChart } from './ShapChart';
import { RiskTrendChart } from './RiskTrendChart';
import { SuggestedActions } from './SuggestedActions';
import { WorkflowSequence } from './WorkflowSequence';
import type { Patient } from '@/data/patients';
import { Button } from '@/components/ui/button';

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
          <RiskBadge level={patient.riskLevel} className="text-base px-4 py-2" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk Score Card */}
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
            <p className="text-muted-foreground mt-2 text-sm font-medium">
              {patient.riskType} Risk Score
            </p>
          </div>

          {/* Risk Trajectory */}
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Risk Trajectory (24h)
            </h4>
            <RiskTrendChart 
              currentScore={patient.riskScore} 
              trend={patient.trend}
              className="h-20"
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

        {/* SHAP Explainability Chart */}
        <div className="bg-card rounded-xl border border-border/50 p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Explainability Breakdown
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-shap-positive" />
              <span className="text-muted-foreground">Increases Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-shap-negative" />
              <span className="text-muted-foreground">Reduces Risk</span>
            </div>
          </div>
          
          <ShapChart factors={patient.riskFactors} />
          
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

        {/* Suggested Actions */}
        <SuggestedActions patient={patient} />

        {/* Clinical Notes - Full Width */}
        <div className="lg:col-span-3 bg-card rounded-xl border border-border/50 p-5 shadow-card">
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
            * Synthetic clinical notes · Human-in-the-loop judgment required for all decisions
          </p>
        </div>
      </div>
    </div>
  );
};
