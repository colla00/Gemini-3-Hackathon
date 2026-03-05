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
  { metric: 'Total Cohort', value: '65,157', detail: 'Across databases' },
  { metric: 'External Validation', value: 'Outperforms', detail: 'Established acuity scores' },
  { metric: 'IDI Features', value: '11', detail: 'Temporal extraction' },
  { metric: 'Databases', value: '3', detail: 'International validation' },
];

const demographics = [
  { label: 'Cohort Size', value: '26,153', detail: 'MIMIC-IV' },
  { label: 'IDI Features', value: '11', detail: 'Temporal' },
  { label: 'Databases', value: '3', detail: 'International' },
  { label: 'Hospitals', value: '172+', detail: 'DBS validated' },
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
                Manuscripts Under Review · MIMIC-IV + HiRID Databases · NIH-Funded Research
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
          Demonstrates that temporal patterns in EHR documentation independently predict ICU mortality.
          The Intensive Documentation Index (IDI) extracts 11 features from timestamp metadata alone, requiring no additional hardware or sensors.
          Validated on 65,157 patients across international databases. Detailed metrics available under NDA.
        </p>
          The Intensive Documentation Index (IDI) extracts 11 features from timestamp metadata alone, requiring no additional hardware or sensors.
          Validated on 60,050 patients across two international databases.
        </p>

        {/* High-level validation summary */}
        <div className="bg-risk-low/5 rounded-xl p-3 border border-risk-low/20 mb-4">
          <p className="text-[10px] font-bold text-risk-low uppercase tracking-wider mb-2">Validation Summary</p>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <p>Total cohort: <span className="font-bold text-foreground">65,157 patients</span></p>
            <p>Databases: <span className="text-foreground">MIMIC-IV + HiRID + eICU</span></p>
            <p>External validation: <span className="text-foreground">Outperforms established acuity scores</span></p>
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

    {/* Validation Summary */}
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Validation Overview
        </CardTitle>
        <p className="text-xs text-muted-foreground">Heart failure ICU admissions across international databases</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
      <strong className="text-foreground">Methodology:</strong> Retrospective cohort studies of heart failure ICU admissions using MIMIC-IV v2.2 (PhysioNet, MIT) 
      and HiRID (University Hospital Bern, Switzerland). 
      NIH-funded research (1OT2OD032581). Detailed statistical methods and cohort demographics available under NDA.
    </div>
  </div>
  </div>
);
