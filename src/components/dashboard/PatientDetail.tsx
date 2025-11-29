import { ArrowLeft, Calendar, User, Activity, FileText, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskBadge } from './RiskBadge';
import { ShapChart } from './ShapChart';
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

  return (
    <div className="animate-slide-in-right">
      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 text-muted-foreground hover:text-foreground hover:bg-secondary group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Score Card */}
        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Current Risk Assessment</h3>
          </div>
          
          <div className={cn("rounded-xl border p-6 mb-6 text-center", riskScoreBg)}>
            <span className={cn("text-7xl font-extrabold", riskScoreColor)}>
              {patient.riskScore}%
            </span>
            <p className="text-muted-foreground mt-2 font-medium">
              {patient.riskType} Risk Score
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Risk Factors Identified
            </h4>
            {patient.riskFactors.map((factor) => (
              <div
                key={factor.name}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <span className="text-xl">{factor.icon}</span>
                  {factor.name}
                </span>
                <span
                  className={cn(
                    "font-mono font-semibold text-sm",
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
        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">AI Explainability (SHAP Values)</h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Feature contributions to the predicted risk score. Red bars increase risk, green bars reduce risk.
          </p>
          
          <ShapChart factors={patient.riskFactors} />
          
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-shap-positive" />
              <span className="text-sm text-muted-foreground">Risk Increasing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-shap-negative" />
              <span className="text-sm text-muted-foreground">Risk Reducing</span>
            </div>
          </div>
        </div>

        {/* Clinical Notes */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Clinical Notes</h3>
          </div>
          
          <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
            <p className="text-foreground leading-relaxed">
              {patient.clinicalNotes}
            </p>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 italic">
            * These are synthetic clinical notes for demonstration purposes only
          </p>
        </div>
      </div>
    </div>
  );
};
