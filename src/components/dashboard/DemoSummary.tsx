import { CheckCircle, Target, Brain, Users, Shield, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const summaryPoints = [
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Nurse-Sensitive Outcomes',
    description: 'Falls, pressure injuries, device complications',
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'Interpretable AI',
    description: 'Transparent risk factor contributions',
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
    title: 'Workflow-Aware',
    description: 'Integrated into clinical routines',
  },
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

      <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/30">
        <CheckCircle className="w-4 h-4 text-risk-low" />
        <span className="text-xs text-muted-foreground">
          Research prototype using de-identified clinical data
        </span>
      </div>
    </div>
  );
};
