import { ArrowLeft, Calendar, User, Activity, FileText, AlertTriangle, Lightbulb, BarChart3, Award, Sparkles } from 'lucide-react';
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
import { AdaptiveThresholdVisualization } from './AdaptiveThresholdVisualization';
import { ClosedLoopAnimation } from './ClosedLoopAnimation';
import { AIWorkflowPipeline } from './AIWorkflowPipeline';
import { RiskNarrative, InterventionRecommender } from '@/components/ai';
import type { Patient } from '@/data/patients';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  // Generate clinical context based on patient data
  const getInsight = () => {
    const topFactor = patient.riskFactors.reduce((prev, curr) => 
      Math.abs(curr.contribution) > Math.abs(prev.contribution) ? curr : prev
    );
    const protectiveFactor = patient.riskFactors.find(f => f.contribution < 0);
    
    if (topFactor && protectiveFactor) {
      return `Signals suggest ${topFactor.name.toLowerCase()} may be a primary factor, while ${protectiveFactor.name.toLowerCase()} appears to be a protective element.`;
    }
    return `Context indicates ${topFactor.name.toLowerCase()} may be a primary contributing factor for this patient.`;
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
                    <span className="text-[10px] text-accent font-medium">U.S. Patent Filed</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">4 U.S. Patents Filed</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Risk Assessment Card */}
          <div className="bg-card rounded-xl border border-border/50 p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Current Risk Signal
              </h3>
            </div>
            
            <div className={cn("rounded-xl border p-5 mb-5 text-center", riskScoreBg)}>
              <RiskBadge level={patient.riskLevel} className="text-lg px-5 py-2.5" />
              <p className="text-muted-foreground mt-3 text-sm font-medium">
                {patient.riskType} Risk
              </p>
            </div>

            {/* Risk Trajectory - emphasizes change over time */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Risk Trajectory
                </h4>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  Trend
                </span>
              </div>
              <RiskTrendChart 
                currentScore={patient.riskScore} 
                trend={patient.trend}
                className="h-24"
                showConfidenceBands={false}
                showHorizons={false}
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Contributing Factors
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
                      "text-xs font-medium px-2 py-0.5 rounded",
                      factor.contribution >= 0 
                        ? "bg-risk-high/10 text-risk-high" 
                        : "bg-risk-low/10 text-risk-low"
                    )}
                  >
                    {factor.contribution >= 0 ? 'Elevates' : 'Reduces'}
                  </span>
                </div>
              ))}
            </div>

            {/* AI Risk Narrative - Gemini 3 */}
            <div className="mt-4">
              <RiskNarrative
                riskScore={patient.riskScore}
                topFeatures={patient.riskFactors.map(f => ({
                  name: f.name,
                  importance: Math.abs(f.contribution) / 100,
                  value: f.contribution > 0 ? 'elevated' : 'normal'
                }))}
                patientInfo={{
                  name: patient.id,
                  age: parseInt(patient.ageRange.split('-')[0]),
                  diagnosis: patient.riskType
                }}
                autoGenerate={patient.riskLevel === 'HIGH'}
              />
            </div>
          </div>

          {/* Grouped SHAP Explainability Chart (Patent: Real-time SHAP integration) */}
          <div className="bg-card rounded-xl border border-border/50 p-5 shadow-card">
            <GroupedShapChart factors={patient.riskFactors} />
            
            {/* Clinical Context Box */}
            <div className="mt-4 p-3.5 rounded-lg border border-primary/40 bg-primary/5">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-primary mb-1">Clinical Context</h4>
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

          {/* Closed-Loop Animation (Patent: Intervention efficacy tracking) */}
          <ClosedLoopAnimation />

          {/* Adaptive Threshold Visualization (Patent: Confidence-based risk stratification) */}
          <AdaptiveThresholdVisualization patient={patient} />

          {/* AI Intervention Recommender - Gemini 3 (for high-risk patients) */}
          {patient.riskScore >= 0.7 && (
            <div className="lg:col-span-2">
              <InterventionRecommender
                riskProfile={{
                  riskType: patient.riskType,
                  riskScore: patient.riskScore,
                  riskLevel: patient.riskLevel,
                  primaryConcerns: patient.riskFactors
                    .filter(f => f.contribution > 0)
                    .map(f => f.name)
                }}
                patientInfo={{
                  name: patient.id,
                  age: parseInt(patient.ageRange.split('-')[0]),
                  diagnosis: patient.riskType
                }}
                autoTrigger={true}
                onInterventionComplete={(id) => {
                  console.log('[Gemini 3] Intervention completed:', id);
                }}
              />
            </div>
          )}

          {/* AI Workflow Pipeline (Patent: Clinical workflow integration) */}
          <div className={patient.riskScore >= 0.7 ? "lg:col-span-1" : "lg:col-span-3"}>
            <AIWorkflowPipeline />
          </div>

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
            Features on this page are protected by U.S. patents
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            © Dr. Alexis Collier | NSO Quality Dashboard – 4 U.S. Patents Filed
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
};
