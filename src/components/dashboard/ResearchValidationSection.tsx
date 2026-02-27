import { FileText, ExternalLink, CheckCircle2, TrendingUp, Clock, Activity, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const idiFeatures = [
  { domain: 'Event Volume', features: ['Total Events (24h)', 'Events per Hour'], dotClass: 'bg-primary' },
  { domain: 'Rhythm Regularity', features: ['Coefficient of Variation', 'Std Dev of Intervals', 'Mean Inter-Event Interval', 'Burstiness Index'], dotClass: 'bg-accent' },
  { domain: 'Surveillance Gaps', features: ['Gap Count >60min', 'Gap Count >120min', 'Maximum Gap Duration'], dotClass: 'bg-warning' },
  { domain: 'Temporal Dynamics', features: ['Entropy', 'Lag-1 Autocorrelation'], dotClass: 'bg-destructive' },
];

const keyFindings = [
  { metric: 'JAMIA AUROC', value: '0.683', detail: '95% CI: 0.631–0.732' },
  { metric: 'HiRID AUROC', value: '0.906', detail: 'n=33,897 (Switzerland)' },
  { metric: 'Total Cohort', value: 'n = 60,050', detail: 'MIMIC-IV + HiRID' },
  { metric: 'Strongest Predictor', value: 'CV (OR 1.53)', detail: '95% CI: 1.35–1.74' },
];

const demographics = [
  { label: 'Mortality Rate', value: '15.99%', detail: '4,182 deaths' },
  { label: 'Mean Age', value: '69.8 ± 13.8', detail: 'years' },
  { label: 'White', value: '69.0%', detail: 'of cohort' },
  { label: 'Black', value: '13.5%', detail: 'of cohort' },
  { label: 'Hispanic', value: '8.0%', detail: 'of cohort' },
  { label: 'Asian / Other', value: '4.5% / 5.0%', detail: 'of cohort' },
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
                JAMIA & npj Digital Medicine · MIMIC-IV + HiRID Databases · NIH-Funded Research
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
          Demonstrates that temporal patterns in EHR documentation, not the clinical content, independently predict ICU mortality.
          The Intensive Documentation Index (IDI) extracts 11 features from timestamp metadata alone, requiring no additional hardware or sensors.
          Validated on 60,050 patients across two international databases.
        </p>

        {/* Dual manuscript results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="bg-primary/5 rounded-xl p-3 border border-primary/20">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">JAMIA Paper (MIMIC-IV, n=26,153)</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Baseline AUROC: <span className="font-semibold text-foreground">0.658</span> <span className="text-[10px]">(95% CI: 0.609–0.710)</span></p>
              <p>IDI-Enhanced: <span className="font-semibold text-foreground">0.683</span> <span className="text-[10px]">(95% CI: 0.631–0.732)</span></p>
              <p className="text-[10px] italic">General clinical variable baseline</p>
            </div>
          </div>
          <div className="bg-accent/5 rounded-xl p-3 border border-accent/20">
            <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-2">npj Digital Medicine (MIMIC-IV, n=26,153)</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>HF Baseline AUROC: <span className="font-semibold text-foreground">0.601</span></p>
              <p>IDI-Enhanced: <span className="font-semibold text-foreground">0.634</span></p>
              <p className="text-[10px] italic">Heart failure-specific baseline, same cohort</p>
            </div>
          </div>
        </div>

        {/* HiRID External Validation */}
        <div className="bg-risk-low/5 rounded-xl p-3 border border-risk-low/20 mb-4">
          <p className="text-[10px] font-bold text-risk-low uppercase tracking-wider mb-2">External Validation — HiRID (Switzerland, n=33,897)</p>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <p>IDI AUROC: <span className="font-bold text-foreground">0.9063</span></p>
            <p>vs APACHE IV: <span className="text-foreground">0.8421</span></p>
            <p>vs SAPS III: <span className="text-foreground">0.8389</span></p>
            <p className="text-[10px] italic">DeLong p &lt; 0.001 for both comparisons</p>
          </div>
        </div>

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
        <p className="text-xs text-muted-foreground">11 temporal features across 4 domains, all computable from EHR timestamp metadata (45 tested in HiRID after leakage screening)</p>
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

    {/* Equity & Demographics */}
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Cohort Demographics (MIMIC-IV)
        </CardTitle>
        <p className="text-xs text-muted-foreground">Heart failure ICU admissions · Documentation volume: median 1,119 events/24h (~46.6/hour)</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {demographics.map((d) => (
            <div key={d.label} className="bg-muted/30 rounded-lg p-2.5 text-center border border-border/30">
              <p className="text-sm font-bold text-foreground">{d.value}</p>
              <p className="text-[10px] text-muted-foreground">{d.label}</p>
              <p className="text-[9px] text-muted-foreground/70">{d.detail}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Methodology Note */}
    <div className="bg-muted/40 rounded-xl p-4 border border-border/30 text-xs text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Methodology:</strong> Retrospective cohort studies of heart failure ICU admissions using MIMIC-IV v2.2 (PhysioNet, MIT), 2008–2019 (n=26,153) 
      and HiRID (University Hospital Bern, Switzerland, n=33,897). 
      JAMIA: Regularized logistic regression, temporal validation training 2008–2018, testing 2019. LOYO cross-validation mean AUC 0.684 (SD 0.008). 
      NIH-funded research. IRB Protocol #2025-IRB-0142.
    </div>
  </div>
);
