import { useState } from 'react';
import { BarChart3, Clock, Zap, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface FeatureDomain {
  title: string;
  icon: React.ReactNode;
  count: number;
  description: string;
}

const DOMAINS: FeatureDomain[] = [
  {
    title: 'Event Volume',
    icon: <BarChart3 className="h-4 w-4" />,
    count: 2,
    description: 'Captures documentation frequency and rate metrics. Higher documentation rates are associated with improved outcomes.',
  },
  {
    title: 'Rhythm / Regularity',
    icon: <TrendingUp className="h-4 w-4" />,
    count: 4,
    description: 'Measures irregularity and variability in documentation timing patterns. This domain contains the strongest predictors of mortality.',
  },
  {
    title: 'Surveillance Gaps',
    icon: <Clock className="h-4 w-4" />,
    count: 3,
    description: 'Identifies periods without documentation activity. Extended gaps may indicate understaffing or periods consumed by acute interventions.',
  },
  {
    title: 'Temporal Dynamics',
    icon: <Zap className="h-4 w-4" />,
    count: 2,
    description: 'Analyzes the randomness and temporal dependency structure of documentation patterns over time.',
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
          11 IDI Temporal Features
        </h2>
        <p className="text-primary-foreground/70 max-w-2xl">
          Automatically extracted from EHR nursing documentation timestamps across 4 domains.
          Specific feature names, statistical associations, and model weights are proprietary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOMAINS.map(domain => {
          const isExpanded = expanded === domain.title;
          return (
            <div key={domain.title}>
              <div
                className={`cursor-pointer rounded-xl border p-5 transition-all hover:shadow-md ${
                  isExpanded
                    ? 'border-primary/40 bg-primary/10'
                    : 'border-primary-foreground/10 bg-primary-foreground/5 hover:border-primary/30'
                }`}
                onClick={() => setExpanded(isExpanded ? null : domain.title)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{domain.icon}</span>
                      <h4 className="text-sm font-semibold text-primary-foreground leading-tight">
                        {domain.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-primary-foreground/50">{domain.count} features</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-primary-foreground/50 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-primary-foreground/50 shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div className="mt-2 p-5 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary-foreground leading-relaxed animate-fade-in">
                  <p className="font-semibold text-xs text-primary mb-2">Domain Overview</p>
                  {domain.description}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-xs text-primary-foreground/40 text-center">
        Detailed feature specifications, odds ratios, and confidence intervals available under NDA.
      </div>
    </div>
  );
};
