import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Activity, ArrowRight, TrendingUp, AlertTriangle, RefreshCw, Heart, DollarSign, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const patients = [
  { id: 'DT-001', name: 'E. Ramirez', age: 72, baseline: { hr: 78, bp: '128/82', rr: 16, temp: 98.4, spo2: 96 }, current: { hr: 92, bp: '142/90', rr: 20, temp: 99.1, spo2: 94 }, deviation: 34, status: 'drifting' },
  { id: 'DT-002', name: 'K. Patel', age: 58, baseline: { hr: 68, bp: '118/72', rr: 14, temp: 98.6, spo2: 98 }, current: { hr: 70, bp: '120/74', rr: 14, temp: 98.5, spo2: 97 }, deviation: 5, status: 'stable' },
  { id: 'DT-003', name: 'L. Johnson', age: 84, baseline: { hr: 82, bp: '135/88', rr: 18, temp: 98.2, spo2: 93 }, current: { hr: 110, bp: '98/60', rr: 26, temp: 100.4, spo2: 88 }, deviation: 72, status: 'critical' },
];

const generateTimeline = () => Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  actual: 78 + Math.sin(i / 4) * 8 + (i > 16 ? (i - 16) * 2.5 : 0) + Math.random() * 3,
  baseline: 78 + Math.sin(i / 4) * 3,
  upper: 78 + Math.sin(i / 4) * 3 + 12,
  lower: 78 + Math.sin(i / 4) * 3 - 12,
}));

const statusColors: Record<string, string> = {
  stable: 'text-risk-low bg-risk-low/10 border-risk-low/30',
  drifting: 'text-warning bg-warning/10 border-warning/30',
  critical: 'text-destructive bg-destructive/10 border-destructive/30',
};

export const DTBLDemo = () => {
  const [selectedPatient, setSelectedPatient] = useState(patients[2]);
  const [twinTimeline] = useState(generateTimeline);
  const [liveDeviation, setLiveDeviation] = useState(selectedPatient.deviation);
  const [falsePosReduction, setFalsePosReduction] = useState(62);

  useEffect(() => {
    setLiveDeviation(selectedPatient.deviation);
  }, [selectedPatient]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDeviation(prev => parseFloat((prev + (Math.random() - 0.47) * 0.8).toFixed(0)));
      if (Math.random() > 0.9) setFalsePosReduction(prev => Math.min(68, prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-gradient-to-br from-primary/[0.06] to-transparent overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_70%)]" />
        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/25 shadow-lg shadow-primary/10">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Digital Twin Baseline Learning</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Dynamic patient baseline models with personalized risk thresholds and drift detection</p>
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
              <Badge variant="outline" className="text-[10px]">Patent #9</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enterprise KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Twins', value: '3', sub: 'patient models running', icon: <Heart className="h-4 w-4" />, color: 'text-primary' },
          { label: 'False + Reduction', value: `${falsePosReduction}%`, sub: 'vs. static thresholds', icon: <Zap className="h-4 w-4" />, color: 'text-chart-1' },
          { label: 'Drift Alerts', value: '2', sub: 'baseline deviations detected', icon: <AlertTriangle className="h-4 w-4" />, color: 'text-warning' },
          { label: 'Est. Annual Value', value: '$890K', sub: 'per 300-bed facility', icon: <DollarSign className="h-4 w-4" />, color: 'text-risk-low' },
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

      {/* Patient Twin Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {patients.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            onClick={() => setSelectedPatient(p)}
            className={cn(
              'text-left p-4 rounded-xl border transition-all',
              selectedPatient.id === p.id ? 'border-primary/40 bg-primary/5 shadow-md' : 'border-border/30 hover:border-primary/20',
              p.status === 'critical' && selectedPatient.id !== p.id && 'border-destructive/20'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-foreground">{p.name}</span>
              <Badge variant="outline" className={cn('text-[9px]', statusColors[p.status])}>
                {p.status === 'critical' && <span className="relative flex h-1.5 w-1.5 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-destructive" /></span>}
                {p.status}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">{p.id} · Age {p.age}</p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                <span>Deviation from baseline</span>
                <span className={cn('font-bold', statusColors[p.status]?.split(' ')[0])}>{p.deviation}%</span>
              </div>
              <Progress value={p.deviation} className="h-2" />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Twin Timeline */}
        <motion.div className="lg:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Digital Twin vs. Actual — Heart Rate ({selectedPatient.name})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={twinTimeline}>
                  <defs>
                    <linearGradient id="twinBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} interval={3} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[55, 120]} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
                  <Area type="monotone" dataKey="upper" stroke="none" fill="url(#twinBand)" name="Upper Bound" />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(var(--background))" name="Lower Bound" />
                  <Line type="monotone" dataKey="baseline" stroke="hsl(var(--primary))" strokeDasharray="5 5" dot={false} name="Baseline" strokeWidth={1.5} />
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--destructive))" dot={false} name="Actual" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vitals Comparison */}
        <AnimatePresence mode="wait">
          <motion.div key={selectedPatient.id} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-border/40 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  Baseline vs. Current
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'Heart Rate', base: selectedPatient.baseline.hr, curr: selectedPatient.current.hr, unit: 'bpm' },
                  { label: 'Blood Pressure', base: selectedPatient.baseline.bp, curr: selectedPatient.current.bp, unit: '' },
                  { label: 'Resp Rate', base: selectedPatient.baseline.rr, curr: selectedPatient.current.rr, unit: '/min' },
                  { label: 'Temp', base: selectedPatient.baseline.temp, curr: selectedPatient.current.temp, unit: '°F' },
                  { label: 'SpO₂', base: selectedPatient.baseline.spo2, curr: selectedPatient.current.spo2, unit: '%' },
                ].map(v => {
                  const diff = typeof v.base === 'number' && typeof v.curr === 'number' ? v.curr - v.base : 0;
                  const isDeviated = Math.abs(diff) > 5;
                  const isCritical = Math.abs(diff) > 15;
                  return (
                    <div key={v.label} className={cn(
                      'p-2.5 rounded-lg border transition-all',
                      isCritical ? 'border-destructive/30 bg-destructive/5' : isDeviated ? 'border-warning/30 bg-warning/5' : 'border-border/30 bg-muted/20'
                    )}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-semibold">{v.label}</p>
                          <span className="text-[9px] text-muted-foreground">Base: {v.base}{v.unit}</span>
                        </div>
                        <div className="text-right">
                          <span className={cn('text-sm font-bold', isCritical ? 'text-destructive' : isDeviated ? 'text-warning' : 'text-foreground')}>{v.curr}{v.unit}</span>
                          {typeof diff === 'number' && diff !== 0 && (
                            <p className={cn('text-[9px] font-semibold', diff > 0 ? 'text-destructive' : 'text-warning')}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className={cn('p-3 rounded-lg border mt-1', statusColors[selectedPatient.status])}>
                  <p className="text-[10px] text-muted-foreground">Overall Deviation</p>
                  <p className={cn('text-2xl font-bold tabular-nums', statusColors[selectedPatient.status]?.split(' ')[0])}>{liveDeviation}%</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enterprise ROI */}
      <Card className="bg-gradient-to-r from-primary/10 via-chart-1/5 to-transparent border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary/15">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">Enterprise Integration Value</p>
              <p className="text-[10px] text-muted-foreground">
                DTBL replaces population-based thresholds with individualized baselines — reducing false positives by {falsePosReduction}%*
                while catching deterioration earlier. Each patient becomes their own control, enabling precision medicine from day 1.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-primary">$890K</p>
              <p className="text-[9px] text-muted-foreground">annual value*</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/60 mt-2">*Design-phase estimates. Not clinically validated. For illustration only.</p>
        </CardContent>
      </Card>
    </div>
  );
};
