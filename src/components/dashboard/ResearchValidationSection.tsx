import { FileText, ExternalLink, CheckCircle2, TrendingUp, Clock, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const idiFeatures = [
  { domain: 'Frequency', features: ['Total Events', 'Events per Hour'], dotClass: 'bg-primary' },
  { domain: 'Rhythm', features: ['Coefficient of Variation', 'Entropy', 'Lag-1 Autocorrelation'], dotClass: 'bg-accent' },
  { domain: 'Gaps', features: ['Max Gap', 'Proportion Gaps >60min'], dotClass: 'bg-warning' },
  { domain: 'Burst Activity', features: ['Max Burst', 'Burstiness Index'], dotClass: 'bg-destructive' },
];

const keyFindings = [
  { metric: 'AUC', value: '0.683', detail: '95% CI: 0.631–0.732' },
  { metric: 'Cohort', value: 'n = 26,153', detail: 'ICU admissions' },
  { metric: 'Temporal Span', value: '11 years', detail: '2008–2019' },
  { metric: 'Strongest Predictor', value: 'CV (OR 1.53)', detail: 'p < 0.001' },
];

export const ResearchValidationSection = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Study Overview */}
    <Card className="border-primary/20 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">ICU Mortality Prediction via Documentation Rhythm</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                medRxiv Preprint · MIMIC-IV Database · NIH-Funded Research
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-primary border-primary/30 text-[10px]">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Validated
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Demonstrates that temporal patterns in EHR documentation, not the clinical content, independently predict ICU mortality
          in heart failure patients. The Intensive Documentation Index (IDI) extracts 9 features from timestamp metadata alone, requiring no additional hardware or sensors.
          Cohort mortality rate: 15.99% (n=4,181 deaths).
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {keyFindings.map((f) => (
            <div key={f.metric} className="bg-muted/50 rounded-xl p-3 text-center border border-border/40">
              <p className="text-lg font-bold text-foreground">{f.value}</p>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{f.metric}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{f.detail}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* IDI Feature Domains */}
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          IDI Feature Domains
        </CardTitle>
        <p className="text-xs text-muted-foreground">9 temporal features across 4 domains, all computable from EHR timestamp metadata</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {idiFeatures.map((domain) => (
            <div key={domain.domain} className="bg-muted/30 rounded-xl p-4 border border-border/30">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">{domain.domain}</p>
              <div className="space-y-1.5">
                {domain.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className={`w-1.5 h-1.5 rounded-full ${domain.dotClass}`} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Methodology Note */}
    <div className="bg-muted/40 rounded-xl p-4 border border-border/30 text-xs text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Methodology:</strong> Retrospective cohort study of heart failure ICU admissions using MIMIC-IV v2.2 (PhysioNet, MIT), 2008–2019. 
      Regularized logistic regression. Temporal validation: training on 2008–2018 (n=25,188), testing on 2019 (n=965). 
      Leave-one-year-out cross-validation across 12 years (mean AUC 0.684, SD 0.008). 
      NIH-funded research. IRB Protocol #2025-IRB-0142.
    </div>
  </div>
);
