import { FlaskConical, Shield, Brain, BarChart3, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const COMPONENTS = [
  {
    patent: '#2',
    name: 'VitaSignal Nursing',
    description: 'Unified Nursing Intelligence Platform',
    icon: BarChart3,
    metric: '3.8M target RNs',
  },
  {
    patent: '#3',
    name: 'VitaSignal DBS',
    description: 'Documentation Burden & Staffing Intelligence',
    icon: FileText,
    metric: '15-20% overtime reduction',
  },
  {
    patent: '#4',
    name: 'VitaSignal Alerts',
    description: 'Trust-Based Alert Prioritization',
    icon: Shield,
    metric: '87% alert reduction',
  },
  {
    patent: '#5',
    name: 'VitaSignal Risk',
    description: 'Clinical Risk Intelligence System',
    icon: Brain,
    metric: '4-48h forecasting',
  },
];

export const DesignPhaseComponents = () => {
  return (
    <div>
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Platform Expansion
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
          Design Phase Components
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The following components are under development with no clinical validation.
          Only VitaSignal Mortality (Patent #1) has been validated.
        </p>
      </div>

      <div className="space-y-3">
        {COMPONENTS.map(comp => (
          <div
            key={comp.name}
            className="group flex items-start gap-5 p-5 rounded-xl border border-border/50 bg-card transition-all hover:shadow-md hover:border-primary/20"
          >
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <comp.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-foreground">{comp.name}</h3>
                <Badge variant="secondary" className="text-[10px] px-2 py-0">
                  Patent {comp.patent}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-2 py-0 text-muted-foreground gap-1">
                  <FlaskConical className="h-2.5 w-2.5" />
                  Design Phase
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{comp.description}</p>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <span className="text-xs font-semibold text-primary block">{comp.metric}</span>
              <span className="text-[10px] text-muted-foreground font-mono">Patent Pending</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};