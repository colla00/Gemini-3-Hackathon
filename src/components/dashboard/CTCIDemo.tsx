import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Search, CheckCircle2, XCircle, Clock, Users, FileText, DollarSign, Shield, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
    revenuePerPatient: 42000,
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
    revenuePerPatient: 28000,
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
    revenuePerPatient: 35000,
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
  const [liveScreened, setLiveScreened] = useState(441);
  const [liveMatched, setLiveMatched] = useState(78);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveScreened(prev => prev + Math.floor(Math.random() * 3));
      if (Math.random() > 0.7) setLiveMatched(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalRevenue = trials.reduce((acc, t) => acc + t.matchedPatients * t.revenuePerPatient, 0);

  return (
    <div className="space-y-6">
      <Card className="border-warning/30 bg-gradient-to-br from-warning/[0.06] to-transparent overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--warning)/0.08),transparent_70%)]" />
        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-warning/15 border border-warning/25 shadow-lg shadow-warning/10">
                <FlaskConical className="w-5 h-5 text-warning" />
              </div>
              <div>
                <CardTitle className="text-lg">Clinical Trial & Cohort Intelligence</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Automated eligibility screening, cohort identification, and enrollment optimization</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-risk-low/10 border border-risk-low/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
                </span>
                <span className="text-[10px] font-semibold text-risk-low">LIVE</span>
              </div>
              <Badge variant="outline" className="text-[10px]">Patent #10</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enterprise KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Trials', value: '3', sub: 'matched in system', icon: <FlaskConical className="h-4 w-4" />, color: 'text-warning' },
          { label: 'Patients Screened', value: liveScreened.toLocaleString(), sub: 'automated screening', icon: <Users className="h-4 w-4" />, color: 'text-foreground' },
          { label: 'Matched', value: liveMatched.toString(), sub: 'eligible patients found', icon: <CheckCircle2 className="h-4 w-4" />, color: 'text-risk-low' },
          { label: 'Trial Revenue', value: `$${(totalRevenue / 1000000).toFixed(1)}M`, sub: 'enrollment value', icon: <DollarSign className="h-4 w-4" />, color: 'text-chart-2' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.08 }}>
            <Card className="border-border/40 bg-gradient-to-b from-background to-muted/20 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className={cn('mx-auto mb-1.5', k.color)}>{k.icon}</div>
                <p className={cn('text-2xl font-bold tabular-nums', k.color)}>{k.value}</p>
                <p className="text-[10px] font-semibold text-foreground mt-0.5">{k.label}</p>
                <p className="text-[9px] text-muted-foreground">{k.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trial List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/40 h-full">
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
                    selectedTrial.id === t.id ? 'border-warning/40 bg-warning/5 shadow-sm' : 'border-border/30 hover:border-warning/20'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground">{t.id}</span>
                    <Badge variant="outline" className={cn('text-[9px]', statusColors[t.status])}>{t.status}</Badge>
                  </div>
                  <p className="text-xs font-bold text-foreground mb-1 line-clamp-2">{t.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{t.phase}</span>
                    <span className="font-semibold text-risk-low">{t.matchedPatients} matched</span>
                  </div>
                  <Progress value={t.enrollmentRate} className="mt-1.5 h-1" />
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Trial Detail */}
        <AnimatePresence mode="wait">
          <motion.div key={selectedTrial.id} className="lg:col-span-2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-border/40 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-warning" />
                  {selectedTrial.title}
                </CardTitle>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px]">{selectedTrial.phase}</Badge>
                  <Badge variant="outline" className="text-[10px]">{selectedTrial.sponsor}</Badge>
                  <Badge variant="outline" className="text-[10px] text-chart-2 border-chart-2/30">
                    ${(selectedTrial.revenuePerPatient / 1000).toFixed(0)}K/patient
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Enrollment Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Screened', value: selectedTrial.totalScreened, color: 'text-foreground' },
                    { label: 'Matched', value: selectedTrial.matchedPatients, color: 'text-risk-low' },
                    { label: 'Enrollment Rate', value: `${selectedTrial.enrollmentRate}%`, color: 'text-warning' },
                  ].map(m => (
                    <div key={m.label} className="bg-muted/30 rounded-lg p-3 text-center border border-border/20">
                      <p className="text-[10px] text-muted-foreground">{m.label}</p>
                      <p className={cn('text-xl font-bold tabular-nums', m.color)}>{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Eligibility Criteria */}
                <div>
                  <p className="text-xs font-semibold text-foreground mb-3">Automated Eligibility Screening</p>
                  <div className="space-y-2">
                    {selectedTrial.criteria.map((c, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.06 }}
                        className={cn('flex items-center gap-3 p-2.5 rounded-lg border', c.met ? 'border-risk-low/20 bg-risk-low/5' : 'border-destructive/20 bg-destructive/5')}
                      >
                        {c.met ? <CheckCircle2 className="h-4 w-4 text-risk-low shrink-0" /> : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                        <span className="text-sm text-foreground flex-1">{c.label}</span>
                        <Badge variant="outline" className={cn('text-[9px]', c.met ? 'text-risk-low border-risk-low/30' : 'text-destructive border-destructive/30')}>
                          {c.met ? 'MET' : 'NOT MET'}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
                  <p className="text-[10px] text-muted-foreground">
                    <strong className="text-foreground">Match Rate:</strong> {((selectedTrial.matchedPatients / selectedTrial.totalScreened) * 100).toFixed(1)}% of screened patients meet eligibility criteria. Potential enrollment revenue: <strong className="text-chart-2">${((selectedTrial.matchedPatients * selectedTrial.revenuePerPatient) / 1000).toFixed(0)}K</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enterprise ROI */}
      <Card className="bg-gradient-to-r from-warning/10 via-chart-2/5 to-transparent border-warning/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-warning/15">
              <Shield className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">Enterprise Integration Value</p>
              <p className="text-[10px] text-muted-foreground">
                CTCI automates clinical trial screening from EHR documentation patterns — replacing manual chart review.
                Hospitals earn $28-42K per enrolled patient* while reducing screening time by 85%*. A single 500-bed hospital
                can generate $2-4M in additional trial revenue annually*.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-warning">${(totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-[9px] text-muted-foreground">trial revenue*</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/60 mt-2">*Design-phase estimates. Not clinically validated. For illustration only.</p>
        </CardContent>
      </Card>
    </div>
  );
};
