import { FlaskConical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const COMPONENTS = [
  {
    patent: 'Patent #2',
    name: 'VitaSignal Nursing',
    description: 'Unified Nursing Intelligence Platform',
    number: '63/966,117',
  },
  {
    patent: 'Patent #3',
    name: 'VitaSignal DBS',
    description: 'Documentation Burden & Staffing Intelligence',
    number: '63/966,099',
  },
  {
    patent: 'Patent #4',
    name: 'VitaSignal Alerts',
    description: 'Trust-Based Alert Prioritization',
    number: '63/946,187',
  },
  {
    patent: 'Patent #5',
    name: 'VitaSignal Risk',
    description: 'Clinical Risk Intelligence System',
    number: '63/932,953',
  },
];

export const DesignPhaseComponents = () => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          VitaSignal Platform Components (Design Phase)
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          The following components are under development with no clinical validation. Only VitaSignal
          Mortality (Patent #1) above has been validated.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COMPONENTS.map(comp => (
          <Card
            key={comp.name}
            className="opacity-60 hover:opacity-100 transition-opacity border-border"
          >
            <CardContent className="p-5 space-y-3">
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
              <p className="text-[10px] text-muted-foreground font-mono">{comp.number}</p>
              <Badge className="bg-warning/15 text-warning border border-warning/30 text-[10px] gap-1">
                <FlaskConical className="h-3 w-3" />
                No Clinical Validation
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
