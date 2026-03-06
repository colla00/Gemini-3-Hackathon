import { useState } from 'react';
import { FlaskConical, Search, CheckCircle2, XCircle, Clock, Users, FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const trials = [
  {
    id: 'NCT-05892341',
    title: 'Sepsis Early Intervention with AI-Guided Protocol',
    phase: 'Phase III',
    sponsor: 'National Institutes of Health',
    matchedPatients: 23,
    totalScreened: 142,
    enrollmentRate: 78,
    status: 'recruiting',
    criteria: [
      { label: 'Age ≥ 18', met: true },
      { label: 'ICU admission ≥ 24h', met: true },
      { label: 'Suspected or confirmed sepsis', met: true },
      { label: 'No active DNR/DNI', met: true },
      { label: 'SOFA score ≥ 2', met: false },
    ],
  },
  {
    id: 'NCT-06124589',
    title: 'Documentation Burden Reduction in Critical Care',
    phase: 'Phase II',
    sponsor: 'AHRQ',
    matchedPatients: 47,
    totalScreened: 89,
    enrollmentRate: 92,
    status: 'recruiting',
    criteria: [
      { label: 'Licensed RN', met: true },
      { label: 'ICU or step-down unit', met: true },
      { label: '≥ 1 year experience', met: true },
      { label: 'EHR proficiency', met: true },
      { label: 'Consent to monitoring', met: true },
    ],
  },
  {
    id: 'NCT-05678901',
    title: 'Predictive Analytics for Hospital-Acquired Infections',
    phase: 'Phase I',
    sponsor: 'CDC / Academic Medical Center',
    matchedPatients: 8,
    totalScreened: 210,
    enrollmentRate: 34,
    status: 'pending',
    criteria: [
      { label: 'Central venous catheter', met: true },
      { label: 'ICU stay ≥ 48h', met: true },
      { label: 'No active infection at admission', met: false },
      { label: 'Age 18-85', met: true },
      { label: 'Informed consent', met: false },
    ],
  },
];

const statusColors: Record<string, string> = {
  recruiting: 'text-risk-low bg-risk-low/10 border-risk-low/30',
  pending: 'text-warning bg-warning/10 border-warning/30',
  closed: 'text-muted-foreground bg-muted/50 border-border/30',
};

export const CTCIDemo = () => {
  const [selectedTrial, setSelectedTrial] = useState(trials[0]);

  return (
    <div className="space-y-6">
      <Card className="border-warning/30 bg-gradient-to-br from-warning/[0.04] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-warning/10 border border-warning/20">
                <FlaskConical className="w-5 h-5 text-warning" />
              </div>
              <div>
                <CardTitle className="text-lg">Clinical Trial & Cohort Intelligence</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Automated eligibility screening, cohort identification, and enrollment optimization</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">Patent #10</Badge>
              <Badge className="bg-muted text-muted-foreground border-border/40 text-[10px]">DESIGN PHASE</Badge>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">MOCK DATA</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Trials', value: '3', color: 'text-warning' },
          { label: 'Patients Screened', value: '441', color: 'text-foreground' },
          { label: 'Matched', value: '78', color: 'text-risk-low' },
          { label: 'Avg Match Rate', value: '17.7%', color: 'text-chart-2' },
        ].map(k => (
          <Card key={k.label} className="border-border/40">
            <CardContent className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <p className={cn('text-2xl font-bold mt-1', k.color)}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trial List */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="h-4 w-4 text-warning" />
              Trial Matching Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {trials.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTrial(t)}
                className={cn(
                  'w-full text-left p-3 rounded-lg border transition-all',
                  selectedTrial.id === t.id ? 'border-warning/40 bg-warning/5' : 'border-border/30 hover:border-warning/20'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-muted-foreground">{t.id}</span>
                  <Badge variant="outline" className={cn('text-[9px]', statusColors[t.status])}>{t.status}</Badge>
                </div>
                <p className="text-xs font-bold text-foreground mb-1 line-clamp-2">{t.title}</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{t.phase}</span>
                  <span className="font-semibold">{t.matchedPatients} matched</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Trial Detail */}
        <Card className="lg:col-span-2 border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-warning" />
              {selectedTrial.title}
            </CardTitle>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="text-[10px]">{selectedTrial.phase}</Badge>
              <Badge variant="outline" className="text-[10px]">{selectedTrial.sponsor}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Enrollment Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Screened</p>
                <p className="text-xl font-bold text-foreground">{selectedTrial.totalScreened}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Matched</p>
                <p className="text-xl font-bold text-risk-low">{selectedTrial.matchedPatients}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Enrollment Rate</p>
                <p className="text-xl font-bold text-warning">{selectedTrial.enrollmentRate}%</p>
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-3">Automated Eligibility Screening</p>
              <div className="space-y-2">
                {selectedTrial.criteria.map((c, i) => (
                  <div key={i} className={cn('flex items-center gap-3 p-2.5 rounded-lg border', c.met ? 'border-risk-low/20 bg-risk-low/5' : 'border-destructive/20 bg-destructive/5')}>
                    {c.met ? <CheckCircle2 className="h-4 w-4 text-risk-low shrink-0" /> : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                    <span className="text-sm text-foreground">{c.label}</span>
                    <Badge variant="outline" className={cn('ml-auto text-[9px]', c.met ? 'text-risk-low border-risk-low/30' : 'text-destructive border-destructive/30')}>
                      {c.met ? 'MET' : 'NOT MET'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
              <p className="text-[10px] text-muted-foreground">
                <strong className="text-foreground">Match Rate:</strong> {((selectedTrial.matchedPatients / selectedTrial.totalScreened) * 100).toFixed(1)}% of screened patients meet eligibility criteria based on EHR documentation pattern phenotyping.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
