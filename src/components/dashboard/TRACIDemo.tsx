import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, TrendingUp, AlertTriangle, Zap, Timer, Shield, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const patients = [
  { id: 'PT-4821', name: 'R. Martinez', age: 67, risk4h: 0.18, risk48h: 0.71, trajectory: 'escalating', phenotype: 'Escalating Crisis', alertsGenerated: 3, riskProfile: { slope: 0.35, volatility: 0.08, onset: 20 } },
  { id: 'PT-3199', name: 'J. Thompson', age: 74, risk4h: 0.62, risk48h: 0.85, trajectory: 'critical', phenotype: 'Chaotic Instability', alertsGenerated: 7, riskProfile: { slope: 0.55, volatility: 0.15, onset: 8 } },
  { id: 'PT-5502', name: 'M. Chen', age: 55, risk4h: 0.08, risk48h: 0.12, trajectory: 'stable', phenotype: 'Steady Surveillance', alertsGenerated: 0, riskProfile: { slope: 0.02, volatility: 0.03, onset: 48 } },
  { id: 'PT-2847', name: 'A. Williams', age: 81, risk4h: 0.34, risk48h: 0.56, trajectory: 'rising', phenotype: 'Minimal Documentation', alertsGenerated: 2, riskProfile: { slope: 0.15, volatility: 0.06, onset: 30 } },
];

const horizons = [
  { label: '4-Hour', key: '4h' },
  { label: '12-Hour', key: '12h' },
  { label: '24-Hour', key: '24h' },
  { label: '48-Hour', key: '48h' },
];

const generateTimeline = (profile: typeof patients[0]['riskProfile']) =>
  Array.from({ length: 48 }, (_, i) => {
    const base = 0.1 + (i > profile.onset ? ((i - profile.onset) / 48) * profile.slope * 3 : 0);
    return {
      hour: i,
      risk: Math.min(0.95, base + Math.sin(i / 6) * profile.volatility + Math.random() * profile.volatility * 0.5),
      threshold: 0.6,
      baseline: 0.15 + (i / 48) * 0.08,
    };
  });

const computeHorizonRisks = (profile: typeof patients[0]['riskProfile'], p: typeof patients[0]) => ({
  '4h': p.risk4h,
  '12h': p.risk4h + (p.risk48h - p.risk4h) * 0.35,
  '24h': p.risk4h + (p.risk48h - p.risk4h) * 0.65,
  '48h': p.risk48h,
});

const trajectoryColors: Record<string, string> = {
  stable: 'text-risk-low bg-risk-low/10 border-risk-low/30',
  rising: 'text-warning bg-warning/10 border-warning/30',
  escalating: 'text-risk-medium bg-risk-medium/10 border-risk-medium/30',
  critical: 'text-destructive bg-destructive/10 border-destructive/30',
};

const riskColor = (r: number) => r > 0.7 ? 'text-destructive' : r > 0.4 ? 'text-warning' : 'text-risk-low';

export const TRACIDemo = () => {
  const [selectedPatient, setSelectedPatient] = useState(patients[1]);
  const [liveRisks, setLiveRisks] = useState<Record<string, number>>({});
  const [liveDetections, setLiveDetections] = useState(847);
  const [liveSaved, setLiveSaved] = useState(12.4);
  const [breachEvent, setBreachEvent] = useState<string | null>(null);

  // Regenerate timeline when patient changes
  const timelineData = useMemo(
    () => generateTimeline(selectedPatient.riskProfile),
    [selectedPatient.id]
  );

  // Animate risk gauges when patient changes
  useEffect(() => {
    const baseRisks = computeHorizonRisks(selectedPatient.riskProfile, selectedPatient);
    setLiveRisks({});
    horizons.forEach((h, i) => {
      setTimeout(() => setLiveRisks(prev => ({ ...prev, [h.key]: baseRisks[h.key as keyof typeof baseRisks] })), 200 + i * 150);
    });
  }, [selectedPatient.id]);

  // Simulate live ticking + threshold breach events
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDetections(prev => prev + Math.floor(Math.random() * 3));
      setLiveSaved(prev => parseFloat((prev + Math.random() * 0.02).toFixed(1)));
      setLiveRisks(prev => {
        const updated = { ...prev };
        let breached = false;
        horizons.forEach(h => {
          if (updated[h.key] !== undefined) {
            const newVal = Math.min(0.99, Math.max(0.05, updated[h.key] + (Math.random() - 0.48) * 0.015));
            if (newVal > 0.6 && updated[h.key] <= 0.6) breached = true;
            updated[h.key] = newVal;
          }
        });
        if (breached) {
          setBreachEvent(`⚠ ${selectedPatient.name}: Risk threshold exceeded — escalation protocol triggered`);
          setTimeout(() => setBreachEvent(null), 5000);
        }
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedPatient.name]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-chart-1/30 bg-gradient-to-br from-chart-1/[0.06] to-transparent overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--chart-1)/0.08),transparent_70%)]" />
        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-chart-1/15 border border-chart-1/25 shadow-lg shadow-chart-1/10">
                <Activity className="w-5 h-5 text-chart-1" />
              </div>
              <div>
                <CardTitle className="text-lg">Temporal Risk Assessment & Clinical Intelligence</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Multi-horizon deterioration prediction from documentation rhythm patterns</p>
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
              <Badge variant="outline" className="text-[10px]">Patent #6</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Breach Event Banner */}
      <AnimatePresence>
        {breachEvent && (
          <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }}>
            <div className="p-3 rounded-lg border border-destructive/40 bg-destructive/10 flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 animate-pulse" />
              <p className="text-sm font-semibold text-destructive">{breachEvent}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enterprise Impact Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Early Detections', value: liveDetections.toLocaleString(), sub: 'pattern-based alerts', icon: <Zap className="h-4 w-4" />, color: 'text-chart-1' },
          { label: 'Hours Saved', value: `${liveSaved}K`, sub: 'nursing hours/year', icon: <Clock className="h-4 w-4" />, color: 'text-primary' },
          { label: 'Detection Lead', value: '4-48h', sub: 'before clinical signs', icon: <Timer className="h-4 w-4" />, color: 'text-warning' },
          { label: 'Est. Annual Value', value: '$2.1M', sub: 'per 500-bed hospital', icon: <DollarSign className="h-4 w-4" />, color: 'text-risk-low' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.08 }}>
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

      {/* Multi-Horizon Risk Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {horizons.map((h, i) => {
          const risk = liveRisks[h.key] || 0;
          const color = riskColor(risk);
          const isBreached = risk > 0.6;
          return (
            <motion.div key={h.key} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <Card className={cn('border-border/40 transition-all', isBreached && 'border-destructive/30 shadow-sm shadow-destructive/5')}>
                <CardContent className="p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{h.label} Risk</p>
                  <p className={cn('text-3xl font-bold tabular-nums transition-colors', color)}>
                    {(risk * 100).toFixed(0)}%
                  </p>
                  <Progress value={risk * 100} className="mt-2 h-2" />
                  {isBreached && (
                    <Badge className="mt-2 text-[9px] bg-destructive/10 text-destructive border-destructive/30 animate-pulse">
                      THRESHOLD EXCEEDED
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Timeline Chart — regenerates per patient */}
        <motion.div className="lg:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Timer className="h-4 w-4 text-chart-1" />
                48-Hour Risk Trajectory
                <Badge variant="outline" className="text-[9px] ml-auto">Patient: {selectedPatient.name}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div key={selectedPatient.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timelineData}>
                      <defs>
                        <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={5} label={{ value: 'Hours', position: 'bottom', fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 1]} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
                      <ReferenceLine y={0.6} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={{ value: 'Alert Threshold', fontSize: 10, fill: 'hsl(var(--destructive))' }} />
                      <Area type="monotone" dataKey="baseline" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground) / 0.05)" strokeDasharray="3 3" name="Baseline" />
                      <Area type="monotone" dataKey="risk" stroke="hsl(var(--chart-1))" fill="url(#riskGradient)" name="Risk Score" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Patient Risk Queue */}
        <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card className="border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Priority Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-all',
                    selectedPatient.id === p.id
                      ? 'border-chart-1/40 bg-chart-1/5 shadow-sm'
                      : 'border-border/30 hover:border-chart-1/20',
                    p.trajectory === 'critical' && selectedPatient.id !== p.id && 'border-destructive/20'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-foreground">{p.name}</span>
                    <Badge variant="outline" className={cn('text-[9px]', trajectoryColors[p.trajectory])}>
                      {p.trajectory}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{p.id} · Age {p.age}</span>
                    <span className={cn('font-bold tabular-nums', riskColor(p.risk48h))}>{(p.risk48h * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={p.risk48h * 100} className="mt-1.5 h-1" />
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Selected Patient Detail */}
      <AnimatePresence mode="wait">
        <motion.div key={selectedPatient.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <Card className="border-border/40 bg-gradient-to-r from-muted/30 to-transparent">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-4 w-4 text-chart-1" />
                <p className="text-sm font-bold text-foreground">Temporal Pattern Analysis: {selectedPatient.name}</p>
                <Badge variant="outline" className="text-[10px]">{selectedPatient.phenotype}</Badge>
                {selectedPatient.alertsGenerated > 0 && (
                  <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-[9px] ml-auto">
                    {selectedPatient.alertsGenerated} alerts triggered
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: '4h Risk', value: `${(selectedPatient.risk4h * 100).toFixed(0)}%`, color: riskColor(selectedPatient.risk4h) },
                  { label: '48h Risk', value: `${(selectedPatient.risk48h * 100).toFixed(0)}%`, color: riskColor(selectedPatient.risk48h) },
                  { label: 'Trajectory', value: selectedPatient.trajectory, color: trajectoryColors[selectedPatient.trajectory]?.split(' ')[0] || '' },
                  { label: 'Doc Phenotype', value: selectedPatient.phenotype, isText: true },
                  { label: 'Alerts', value: String(selectedPatient.alertsGenerated), color: selectedPatient.alertsGenerated > 3 ? 'text-destructive' : 'text-foreground' },
                ].map(item => (
                  <div key={item.label} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground">{item.label}</p>
                    <p className={cn('font-bold mt-0.5 capitalize', (item as any).isText ? 'text-sm text-foreground' : `text-lg ${item.color}`)}>{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Enterprise ROI */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <Card className="bg-gradient-to-r from-chart-1/10 via-primary/5 to-transparent border-chart-1/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-chart-1/15">
                <Shield className="w-5 h-5 text-chart-1" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-foreground">Enterprise Integration Value</p>
                <p className="text-[10px] text-muted-foreground">
                  TRACI detects deterioration 4-48 hours before traditional vital sign triggers using only existing EHR data —
                  no new hardware, no new workflows. Reduces code blue events by an estimated 23%* and ICU length of stay by 1.2 days*.
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-chart-1">$2.1M</p>
                <p className="text-[9px] text-muted-foreground">annual value*</p>
              </div>
            </div>
            <p className="text-[8px] text-muted-foreground/60 mt-2">*Design-phase estimates. Not clinically validated. For illustration only.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
