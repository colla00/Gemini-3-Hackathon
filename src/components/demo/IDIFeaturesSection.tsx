import { useState } from 'react';
import { BarChart3, Clock, Zap, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface IDIFeature {
  name: string;
  description: string;
  simulated: string;
  or: string;
  pValue: string;
  note?: string;
  badge?: string;
  interpretation: string;
}

interface FeatureDomain {
  title: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  features: IDIFeature[];
}

const DOMAINS: FeatureDomain[] = [
  {
    title: 'Frequency',
    icon: <BarChart3 className="h-4 w-4" />,
    color: 'text-primary',
    borderColor: 'border-primary/30',
    features: [
      {
        name: 'Total Events (24h)',
        description: 'Raw count of documentation entries in first 24 hours',
        simulated: '1,156',
        or: '0.98',
        pValue: 'p=0.74',
        note: 'NOT independently predictive',
        interpretation:
          'Despite being the most intuitive metric, total documentation volume does not independently predict mortality. This challenges the assumption that "sicker patients generate more notes." Instead, HOW documentation occurs (rhythm) matters more than HOW MUCH.',
      },
      {
        name: 'Events per Hour',
        description: 'Documentation rate normalized by time',
        simulated: '48.2',
        or: '1.05',
        pValue: 'p=0.32',
        interpretation:
          'The normalized documentation rate provides a time-adjusted view of documentation intensity. Like total events, this frequency-based metric is not a significant predictor, reinforcing that temporal patterns matter more than volume.',
      },
    ],
  },
  {
    title: 'Rhythm / Regularity',
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'text-destructive',
    borderColor: 'border-destructive/30',
    features: [
      {
        name: 'Coefficient of Variation (CV)',
        description: 'Irregularity in documentation timing intervals',
        simulated: '0.87',
        or: '1.82',
        pValue: 'p<0.001',
        badge: 'STRONGEST PREDICTOR',
        interpretation:
          'CV captures how irregular the spacing between documentation events is. High CV indicates chaotic, unpredictable documentation patterns associated with clinical instability. This is the single most powerful predictor in the IDI model.',
      },
      {
        name: 'Normalized Entropy',
        description: 'Randomness of inter-event intervals',
        simulated: '0.73',
        or: '1.45',
        pValue: 'p<0.01',
        interpretation:
          'Shannon entropy quantifies the randomness in documentation timing. Higher entropy means less predictable documentation patterns, reflecting a care environment where nurses are responding reactively rather than following structured routines.',
      },
      {
        name: 'Lag-1 Autocorrelation',
        description: 'Self-similarity of temporal patterns',
        simulated: '0.42',
        or: '1.23',
        pValue: 'p<0.05',
        interpretation:
          'Autocorrelation measures whether documentation intervals are self-similar over time. Low autocorrelation indicates that each documentation gap is independent of the previous, suggesting loss of structured care routines.',
      },
    ],
  },
  {
    title: 'Gaps',
    icon: <Clock className="h-4 w-4" />,
    color: 'text-warning',
    borderColor: 'border-warning/30',
    features: [
      {
        name: 'Maximum Gap Duration',
        description: 'Longest period without documentation',
        simulated: '142 min',
        or: '1.34',
        pValue: 'p<0.05',
        interpretation:
          'The longest gap in documentation may reflect periods where nurses are consumed by acute interventions and cannot document, or transitions of care where documentation continuity is lost.',
      },
      {
        name: 'Proportion Gaps >60min',
        description: 'Percentage of inter-event intervals exceeding 1 hour',
        simulated: '18.3%',
        or: '1.28',
        pValue: 'p<0.05',
        interpretation:
          'The proportion of long gaps provides a more robust measure than maximum gap alone. A high proportion of extended gaps suggests systematic documentation disruption rather than a single isolated event.',
      },
    ],
  },
  {
    title: 'Burst Activity',
    icon: <Zap className="h-4 w-4" />,
    color: 'text-chart-4',
    borderColor: 'border-chart-4/30',
    features: [
      {
        name: 'Maximum Burst Events',
        description: 'Peak documentation activity in 1-hour window',
        simulated: '87 events',
        or: '1.41',
        pValue: 'p<0.01',
        interpretation:
          'Burst events capture periods of intense, concentrated documentation activity. High burst counts often indicate rapid clinical deterioration where multiple interventions, assessments, and orders are documented in a short window.',
      },
      {
        name: 'Burstiness Index',
        description: 'Clustering of documentation events',
        simulated: '0.64',
        or: '1.36',
        pValue: 'p<0.01',
        interpretation:
          'The Burstiness Index quantifies how clustered documentation is over time. High burstiness with long gaps between clusters suggests a "feast or famine" pattern associated with crisis-driven care.',
      },
    ],
  },
];

export const IDIFeaturesSection = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">The 9 IDI Features</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Automatically extracted from EHR nursing documentation timestamps. Click any feature to see clinical interpretation.
        </p>
      </div>

      <div className="space-y-6">
        {DOMAINS.map(domain => (
          <div key={domain.title} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={domain.color}>{domain.icon}</span>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                {domain.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {domain.features.map(feature => {
                const isExpanded = expanded === feature.name;
                return (
                  <div key={feature.name}>
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${domain.borderColor} ${
                        isExpanded ? 'ring-2 ring-primary/30' : ''
                      } ${feature.note ? 'opacity-60 hover:opacity-100' : ''}`}
                      onClick={() => setExpanded(isExpanded ? null : feature.name)}
                    >
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-foreground leading-tight">
                            {feature.name}
                          </h4>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono text-foreground">Simulated: {feature.simulated}</span>
                          <span className="text-muted-foreground">|</span>
                          <span className="text-muted-foreground">
                            OR {feature.or} ({feature.pValue})
                          </span>
                        </div>
                        {feature.badge && (
                          <Badge variant="destructive" className="text-[10px]">
                            {feature.badge}
                          </Badge>
                        )}
                        {feature.note && (
                          <p className="text-[10px] text-muted-foreground italic">{feature.note}</p>
                        )}
                      </CardContent>
                    </Card>
                    {isExpanded && (
                      <div className="mt-2 p-4 rounded-lg bg-secondary/50 border border-border text-sm text-foreground leading-relaxed animate-fade-in">
                        <p className="font-semibold text-xs text-primary mb-1">Clinical Interpretation</p>
                        {feature.interpretation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
