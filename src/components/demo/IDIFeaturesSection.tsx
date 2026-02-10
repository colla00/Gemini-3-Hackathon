import { useState } from 'react';
import { BarChart3, Clock, Zap, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
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
  features: IDIFeature[];
}

const DOMAINS: FeatureDomain[] = [
  {
    title: 'Event Volume',
    icon: <BarChart3 className="h-4 w-4" />,
    features: [
      {
        name: 'Total Events (24h)',
        description: 'Raw count of documentation entries in first 24 hours',
        simulated: '1,156',
        or: '0.91',
        pValue: 'p=0.081',
        note: 'NOT independently significant',
        interpretation:
          'Despite being the most intuitive metric, total documentation volume is not independently significant (p=0.081). This challenges the assumption that "sicker patients generate more notes." Instead, HOW documentation occurs (rhythm) matters more than HOW MUCH.',
      },
      {
        name: 'Events per Hour',
        description: 'Documentation rate normalized by time',
        simulated: '48.2',
        or: '0.88',
        pValue: 'p=0.009',
        note: 'PROTECTIVE — higher rate = lower mortality',
        interpretation:
          'Higher documentation event rates are associated with LOWER mortality (OR 0.88), consistent with the hypothesis that more frequent monitoring reflects appropriate clinical attention. This is a protective factor.',
      },
    ],
  },
  {
    title: 'Rhythm / Regularity',
    icon: <TrendingUp className="h-4 w-4" />,
    features: [
      {
        name: 'Coefficient of Variation (CV)',
        description: 'Irregularity in documentation timing intervals (SD/mean)',
        simulated: '0.87',
        or: '1.53',
        pValue: 'p<0.001',
        badge: 'STRONGEST PREDICTOR',
        interpretation:
          'CV captures how irregular the spacing between documentation events is. High CV indicates chaotic, unpredictable documentation patterns associated with clinical instability. This is the single most powerful predictor in the IDI model (OR 1.53, 95% CI 1.38-1.70).',
      },
      {
        name: 'Std Dev of Inter-Event Intervals',
        description: 'Standard deviation of time between consecutive events (minutes)',
        simulated: '34.2 min',
        or: '1.15',
        pValue: 'p=0.003',
        interpretation:
          'Captures temporal variability in documentation patterns. Higher variability predicts mortality, reflecting disrupted care routines and reactive documentation behavior.',
      },
      {
        name: 'Mean Inter-Event Interval',
        description: 'Average time between consecutive documentation events (minutes)',
        simulated: '28.7 min',
        or: '1.11',
        pValue: 'p=0.032',
        interpretation:
          'Longer mean intervals between documentation events predict mortality, suggesting reduced monitoring frequency in patients who may need more attention.',
      },
      {
        name: 'Burstiness Index',
        description: 'Clustering of documentation events: B=(σ−μ)/(σ+μ)',
        simulated: '0.64',
        or: '1.24',
        pValue: 'p<0.001',
        interpretation:
          'The Burstiness Index quantifies how clustered documentation is over time. Ranges from -1 (perfectly regular) to +1 (highly bursty). High burstiness with long gaps between clusters suggests a "feast or famine" pattern associated with crisis-driven care.',
      },
    ],
  },
  {
    title: 'Surveillance Gaps',
    icon: <Clock className="h-4 w-4" />,
    features: [
      {
        name: 'Gaps >120 Minutes',
        description: 'Number of inter-event intervals exceeding 2 hours',
        simulated: '3',
        or: '1.32',
        pValue: 'p<0.001',
        interpretation:
          'Extended surveillance gaps (>2 hours) are the second strongest predictor after CV. More gaps exceeding 120 minutes predict mortality, potentially indicating understaffing or periods where nurses are consumed by acute interventions.',
      },
      {
        name: 'Maximum Gap Duration',
        description: 'Longest period without documentation (minutes)',
        simulated: '142 min',
        or: '1.28',
        pValue: 'p<0.001',
        interpretation:
          'The longest gap in documentation may reflect periods where nurses are consumed by acute interventions and cannot document, or transitions of care where documentation continuity is lost.',
      },
      {
        name: 'Gaps >60 Minutes',
        description: 'Number of inter-event intervals exceeding 1 hour',
        simulated: '7',
        or: '1.19',
        pValue: 'p<0.001',
        interpretation:
          'The count of moderate-length gaps provides a more robust measure than maximum gap alone. A high number of 60+ minute gaps suggests systematic documentation disruption rather than a single isolated event.',
      },
    ],
  },
];

export const IDIFeaturesSection = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Feature Engineering
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-3">
          The 9 IDI Features
        </h2>
        <p className="text-primary-foreground/70 max-w-2xl">
          Automatically extracted from EHR nursing documentation timestamps. Click any feature to see the clinical interpretation.
        </p>
      </div>

      <div className="space-y-10">
        {DOMAINS.map(domain => (
          <div key={domain.title} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-primary">{domain.icon}</span>
              <h3 className="text-sm font-semibold text-primary-foreground uppercase tracking-wide">
                {domain.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {domain.features.map(feature => {
                const isExpanded = expanded === feature.name;
                return (
                  <div key={feature.name}>
                    <div
                      className={`cursor-pointer rounded-xl border p-5 transition-all hover:shadow-md ${
                        isExpanded
                          ? 'border-primary/40 bg-primary/10'
                          : 'border-primary-foreground/10 bg-primary-foreground/5 hover:border-primary/30'
                      } ${feature.note ? 'opacity-60 hover:opacity-100' : ''}`}
                      onClick={() => setExpanded(isExpanded ? null : feature.name)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-primary-foreground leading-tight">
                            {feature.name}
                          </h4>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-primary-foreground/50 shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-primary-foreground/50 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-primary-foreground/60">{feature.description}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono text-primary">Simulated: {feature.simulated}</span>
                          <span className="text-primary-foreground/30">|</span>
                          <span className="text-primary-foreground/60">
                            OR {feature.or} ({feature.pValue})
                          </span>
                        </div>
                        {feature.badge && (
                          <Badge variant="destructive" className="text-[10px]">
                            {feature.badge}
                          </Badge>
                        )}
                        {feature.note && (
                          <p className="text-[10px] text-primary-foreground/50 italic">{feature.note}</p>
                        )}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-2 p-5 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary-foreground leading-relaxed animate-fade-in">
                        <p className="font-semibold text-xs text-primary mb-2">Clinical Interpretation</p>
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
    </div>
  );
};