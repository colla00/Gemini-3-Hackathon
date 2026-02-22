import { CheckCircle, Target, Brain, Users, Shield, TrendingUp, Database, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const summaryPoints = [
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Nurse-Sensitive Outcomes',
    description: 'Falls, pressure injuries, CAUTI, device complications',
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'SHAP Explainability',
    description: 'Interpretable risk attribution (Patent #1 AUC 0.683, Patent #5 AUROC 0.857)',
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Multi-Horizon Forecasting',
    description: '4h, 12h, 24h, 48h risk trajectories',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Adaptive Thresholds',
    description: 'Projected 40-70% false positive reduction',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Closed-Loop Feedback',
    description: 'Intervention effectiveness tracking',
  },
];

const dataSources = [
  { name: 'HiRID', desc: 'Reference dataset' },
  { name: 'MIMIC-IV', desc: 'Validated (AUC 0.683 & AUROC 0.802)' },
  { name: 'eICU-CRD', desc: 'Validated (AUROC 0.857, 208 hospitals)' },
];

interface DemoSummaryProps {
  className?: string;
}

export const DemoSummary = ({ className }: DemoSummaryProps) => {
  return (
    <div className={cn("bg-card rounded-2xl border border-border/40 p-6 shadow-lg", className)}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            VitaSignal Clinical Intelligence
          </h2>
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          AI-powered nurse-sensitive outcome prediction · 5 U.S. patents filed
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {summaryPoints.map((point, index) => (
          <div
            key={point.title}
            className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40 border border-border/30 animate-fade-in hover:bg-secondary/60 transition-colors"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0 shadow-sm">
              {point.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-tight">{point.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{point.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Data Sources Attribution */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-3 border-t border-b border-border/30 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Database className="w-3.5 h-3.5" />
          <span className="font-semibold">Data sources:</span>
        </div>
        {dataSources.map((source) => (
          <div key={source.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/60 border border-border/40 shadow-sm">
            <span className="text-xs font-bold text-foreground">{source.name}</span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">· {source.desc}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <CheckCircle className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground font-medium">
          VitaSignal Research Prototype · Synthetic demonstration data
        </span>
      </div>
    </div>
  );
};
