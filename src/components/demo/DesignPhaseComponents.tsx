import { FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const COMPONENTS = [
  {
    patent: 'Patent #2',
    name: 'VitaSignal Nursing',
    description: 'Unified Nursing Intelligence Platform',
  },
  {
    patent: 'Patent #3',
    name: 'VitaSignal DBS',
    description: 'Documentation Burden & Staffing Intelligence',
  },
  {
    patent: 'Patent #4',
    name: 'VitaSignal Alerts',
    description: 'Trust-Based Alert Prioritization',
  },
  {
    patent: 'Patent #5',
    name: 'VitaSignal Risk',
    description: 'Clinical Risk Intelligence System',
  },
];

export const DesignPhaseComponents = () => {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Platform Expansion
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
          Design Phase Components
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          The following components are under development with no clinical validation. Only VitaSignal
          Mortality (Patent #1) above has been validated.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COMPONENTS.map(comp => (
          <div
            key={comp.name}
            className="rounded-xl border border-border/50 bg-card p-5 space-y-3 opacity-60 hover:opacity-100 hover:border-primary/20 hover:shadow-md transition-all"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[10px] font-semibold">
                {comp.patent}
              </Badge>
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                DESIGN PHASE
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-foreground">{comp.name}</h3>
            <p className="text-xs text-muted-foreground">{comp.description}</p>
            <p className="text-[10px] text-muted-foreground font-mono">Patent Pending</p>
            <Badge className="bg-accent/15 text-accent border border-accent/30 text-[10px] gap-1">
              <FlaskConical className="h-3 w-3" />
              No Clinical Validation
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
};
