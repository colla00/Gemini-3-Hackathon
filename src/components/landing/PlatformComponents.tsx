import { Activity, Users, Shield, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

const components = [
  {
    icon: Activity,
    name: 'VitaSignal™ Mortality',
    description: 'ICU mortality prediction using temporal documentation analysis.',
    status: '✓ Validated on large-scale research datasets with strong predictive performance.',
    statusType: 'validated' as const,
  },
  {
    icon: Users,
    name: 'VitaSignal™ Nursing',
    description: 'Workload prediction and staffing optimization to reduce burnout.',
    status: '⚙️ Design phase; pilot studies planned.',
    statusType: 'design' as const,
  },
  {
    icon: Shield,
    name: 'VitaSignal™ Alerts',
    description: 'Trust-based alert prioritization to reduce alarm fatigue by 40-70%.',
    status: '⚙️ Design phase; clinical validation ongoing.',
    statusType: 'design' as const,
  },
  {
    icon: Brain,
    name: 'VitaSignal™ Risk',
    description: 'Real-time risk stratification with explainable AI.',
    status: '⚙️ Design phase; clinical validation ongoing.',
    statusType: 'design' as const,
  },
];

export const PlatformComponents = () => (
  <section className="py-20 px-6">
    <div className="max-w-6xl mx-auto">
      <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
        Platform Components
      </h3>
      <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-12" />

      <div className="grid md:grid-cols-2 gap-6">
        {components.map((comp) => (
          <div
            key={comp.name}
            className="p-6 rounded-xl bg-card border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <comp.icon className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">{comp.name}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{comp.description}</p>
            <div className={cn(
              "text-xs px-3 py-2 rounded-lg",
              comp.statusType === 'validated'
                ? "bg-risk-low/10 text-risk-low border border-risk-low/30"
                : "bg-primary/5 text-muted-foreground border border-border/50"
            )}>
              {comp.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
