import { CheckCircle, Target, Brain, Users, Shield, TrendingUp, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

const summaryPoints = [
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Nurse-Sensitive Outcomes',
    description: 'Falls, pressure injuries, CAUTI',
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'Interpretable AI',
    description: 'SHAP-based risk factor attribution',
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Risk Trajectory',
    description: 'Dynamic monitoring over time',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Human-in-the-Loop',
    description: 'Clinician judgment remains central',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Workflow Integration',
    description: 'Shift handoffs & intervention tracking',
  },
];

const dataSources = [
  { name: 'HiRID', desc: 'High-resolution ICU data' },
  { name: 'MIMIC-IV', desc: 'Critical care benchmark' },
  { name: 'eICU-CRD', desc: 'Multi-center ICU cohort' },
];

interface DemoSummaryProps {
  className?: string;
}

export const DemoSummary = ({ className }: DemoSummaryProps) => {
  return (
    <div className={cn("bg-card rounded-xl border border-border/50 p-6 shadow-card", className)}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">
          EHR-Driven Quality Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Clinician-facing interface for nurse-sensitive outcome prediction
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {summaryPoints.map((point, index) => (
          <div
            key={point.title}
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/20 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-2 rounded-md bg-primary/10 text-primary flex-shrink-0">
              {point.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{point.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{point.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Data Sources Attribution */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-3 border-t border-b border-border/30 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Database className="w-3.5 h-3.5" />
          <span className="font-medium">Model trained on:</span>
        </div>
        {dataSources.map((source) => (
          <div key={source.name} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/50 border border-border/30">
            <span className="text-xs font-semibold text-foreground">{source.name}</span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">· {source.desc}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <CheckCircle className="w-4 h-4 text-risk-low" />
        <span className="text-xs text-muted-foreground">
          Research prototype · Synthetic demonstration data
        </span>
      </div>
    </div>
  );
};
