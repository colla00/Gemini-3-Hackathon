import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, TrendingUp, AlertTriangle, Radio, Shield, Zap, BarChart3, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, ReferenceLine, Legend } from 'recharts';

// The 9 SEDR features from the validated paper
const sedrFeatures = [
  { key: 'sedr_ratio', name: 'SEDR Ratio', category: 'Core SEDR', description: 'Fraction of shift events in the final 60 min', shapRank: 3 },
  { key: 'sedr_events', name: 'SEDR Events', category: 'Core SEDR', description: 'Count of events in the final 60 min', shapRank: 5 },
  { key: 'total_event_count', name: 'Total Events', category: 'Doc Load', description: 'Total events per 12-hour shift', shapRank: 4 },
  { key: 'doc_velocity_full', name: 'Doc Velocity (Full)', category: 'Temporal', description: 'Events per hour across the full shift', shapRank: 6 },
  { key: 'doc_velocity_last4h', name: 'Doc Velocity (Last 4h)', category: 'Temporal', description: 'Events per hour in the final 4 hours', shapRank: 7 },
  { key: 'velocity_ratio', name: 'Velocity Ratio', category: 'Acceleration', description: 'Last 4h velocity / full shift velocity', shapRank: 8 },
  { key: 'event_type_entropy', name: 'Event Type Entropy', category: 'Diversity', description: 'Shannon entropy of event-type distribution', shapRank: 2 },
  { key: 'intervention_assess_var', name: 'Intervention-Assess Var', category: 'Clinical', description: 'Variance between interventions and assessments', shapRank: 9 },
  { key: 'shift_start_density', name: 'Shift Start Density', category: 'Shift Pattern', description: 'Events in first 2h / total events', shapRank: 1 },
];

// Simulated patients with SEDR profiles
const patients = [
  { id: 'ICU-7201', name: 'D. Kim', age: 68, sedrRatio: 0.42, entropy: 2.8, velocity: 12.4, outcome: 'survived', riskLabel: 'Low', risk: 0.15 },
  { id: 'ICU-3891', name: 'T. Okafor', age: 77, sedrRatio: 0.71, entropy: 1.2, velocity: 28.6, outcome: 'deceased', riskLabel: 'High', risk: 0.82 },
  { id: 'ICU-5440', name: 'S. Gupta', age: 62, sedrRatio: 0.55, entropy: 2.1, velocity: 18.9, outcome: 'survived', riskLabel: 'Moderate', risk: 0.41 },
  { id: 'ICU-9102', name: 'M. Reyes', age: 83, sedrRatio: 0.68, entropy: 1.5, velocity: 24.1, outcome: 'deceased', riskLabel: 'High', risk: 0.76 },
];

const generateShiftTimeline = (patient: typeof patients[0]) => {
  const hours = Array.from({ length: 12 }, (_, i) => i);
  const baseRate = patient.velocity / 12;
  return hours.map(h => {
    const shiftEndAccel = h >= 10 ? baseRate * patient.sedrRatio * (1 + (h - 10) * 0.8) : baseRate * (0.6 + Math.random() * 0.4);
    return {
      hour: `${h}:00`,
      events: Math.round(shiftEndAccel + Math.random() * 2),
      shiftEnd: h >= 10,
    };
  });
};

const riskColor = (r: number) => r > 0.6 ? 'text-destructive' : r > 0.3 ? 'text-warning' : 'text-risk-low';

export const SEDRDemo = () => {
  const [selectedPatient, setSelectedPatient] = useState(patients[1]);
  const [activeView, setActiveView] = useState<'features' | 'shift' | 'shap'>('features');
  const [liveEntropy, setLiveEntropy] = useState(selectedPatient.entropy);
  const [liveVelocity, setLiveVelocity] = useState(selectedPatient.velocity);
  const [shiftAlert, setShiftAlert] = useState<string | null>(null);

  const shiftData = useMemo(() => generateShiftTimeline(selectedPatient), [selectedPatient.id]);

  const radarData = useMemo(() => sedrFeatures.slice(0, 6).map(f => ({
    feature: f.name.replace(/\(.*\)/, '').trim(),
    patient: 30 + Math.random() * 70,
    cohortAvg: 40 + Math.random() * 20,
  })), [selectedPatient.id]);

  // SHAP importance (based on paper: 14 of top 15 are SEDR-derived)
  const shapData = useMemo(() =>
    [...sedrFeatures]
      .sort((a, b) => a.shapRank - b.shapRank)
      .map((f, i) => ({
        feature: f.name,
        importance: parseFloat((0.4 - i * 0.035 + Math.random() * 0.02).toFixed(3)),
        category: f.category,
      })),
    [selectedPatient.id]
  );

  useEffect(() => {
    setLiveEntropy(selectedPatient.entropy);
    setLiveVelocity(selectedPatient.velocity);
  }, [selectedPatient]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveEntropy(prev => parseFloat((prev + (Math.random() - 0.48) * 0.05).toFixed(2)));
      setLiveVelocity(prev => parseFloat((prev + (Math.random() - 0.48) * 0.3).toFixed(1)));

      // Simulate shift-end acceleration event
      if (Math.random() > 0.9 && selectedPatient.sedrRatio > 0.5) {
        setShiftAlert(`Shift-end acceleration detected for ${selectedPatient.name} — SEDR ratio ${selectedPatient.sedrRatio.toFixed(2)}`);
        setTimeout(() => setShiftAlert(null), 4000);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [selectedPatient]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-destructive/30 bg-gradient-to-br from-destructive/[0.06] to-transparent overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--destructive)/0.08),transparent_70%)]" />
        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-destructive/15 border border-destructive/25 shadow-lg shadow-destructive/10">
                <Radio className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-lg">Shift-End Documentation Rate (SEDR)</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">9-feature temporal signal from EHR audit logs · Validated on 131,901 ICU stays</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 border border-destructive/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
                </span>
                <span className="text-[10px] font-semibold text-destructive">MONITORING</span>
              </div>
              <Badge variant="outline" className="text-[10px]">Patent #11</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Shift-End Alert */}
      <AnimatePresence>
        {shiftAlert && (
          <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }}>
            <div className="p-3 rounded-lg border border-warning/40 bg-warning/10 flex items-center gap-3">
              <Timer className="h-4 w-4 text-warning shrink-0 animate-pulse" />
              <p className="text-sm font-semibold text-warning">{shiftAlert}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Event Entropy', value: liveEntropy.toFixed(2), sub: 'Shannon diversity index', icon: <Activity className="h-4 w-4" />, color: 'text-destructive' },
          { label: 'Doc Velocity', value: `${liveVelocity}/hr`, sub: 'events per hour', icon: <TrendingUp className="h-4 w-4" />, color: 'text-warning' },
          { label: 'SEDR Ratio', value: selectedPatient.sedrRatio.toFixed(2), sub: 'shift-end concentration', icon: <Clock className="h-4 w-4" />, color: 'text-chart-1' },
          { label: 'Predicted Risk', value: `${(selectedPatient.risk * 100).toFixed(0)}%`, sub: selectedPatient.riskLabel, icon: <AlertTriangle className="h-4 w-4" />, color: riskColor(selectedPatient.risk) },
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

      {/* View Switcher */}
      <div className="flex gap-2">
        {([['features', '9 Features'], ['shift', 'Shift Timeline'], ['shap', 'SHAP Importance']] as const).map(([key, label]) => (
          <Button key={key} variant={activeView === key ? 'default' : 'outline'} size="sm" onClick={() => setActiveView(key)}>
            {label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Visualization */}
        <motion.div className="lg:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-destructive" />
                {activeView === 'features' ? 'SEDR Feature Radar' : activeView === 'shift' ? '12-Hour Shift Activity Timeline' : 'SHAP Feature Importance'}
                <Badge variant="outline" className="text-[9px] ml-auto">{selectedPatient.name}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div key={`${activeView}-${selectedPatient.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {activeView === 'features' && (
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="feature" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar name="Patient" dataKey="patient" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.2} strokeWidth={2} />
                        <Radar name="Cohort Avg" dataKey="cohortAvg" stroke="hsl(var(--muted-foreground))" fill="none" strokeDasharray="5 5" />
                      </RadarChart>
                    </ResponsiveContainer>
                  )}
                  {activeView === 'shift' && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={shiftData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
                        <Bar dataKey="events" name="Documentation Events" radius={[4, 4, 0, 0]}
                          fill="hsl(var(--chart-2))"
                          // Color shift-end bars differently
                          shape={(props: any) => {
                            const { x, y, width, height, payload } = props;
                            return <rect x={x} y={y} width={width} height={height} rx={4} fill={payload.shiftEnd ? 'hsl(var(--destructive))' : 'hsl(var(--chart-2))'} fillOpacity={payload.shiftEnd ? 0.8 : 0.6} />;
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  {activeView === 'shap' && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={shapData} layout="vertical" margin={{ left: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis type="category" dataKey="feature" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} width={75} />
                        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
                        <Bar dataKey="importance" name="SHAP Value" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} fillOpacity={0.7} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Patient Selector */}
        <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-destructive" />
                Patient SEDR Profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-all',
                    selectedPatient.id === p.id ? 'border-destructive/40 bg-destructive/5 shadow-sm' : 'border-border/30 hover:border-destructive/20'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-foreground">{p.name}</span>
                    <Badge variant="outline" className={cn('text-[9px]', p.risk > 0.6 ? 'text-destructive bg-destructive/10 border-destructive/30' : p.risk > 0.3 ? 'text-warning bg-warning/10 border-warning/30' : 'text-risk-low bg-risk-low/10 border-risk-low/30')}>
                      {p.riskLabel}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-1.5 text-[9px] text-muted-foreground">
                    <span>SEDR: <strong className="text-foreground">{p.sedrRatio}</strong></span>
                    <span>H: <strong className="text-foreground">{p.entropy}</strong></span>
                    <span>V: <strong className="text-foreground">{p.velocity}</strong></span>
                  </div>
                  <Progress value={p.risk * 100} className="mt-1.5 h-1" />
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Feature Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-destructive" />
              SEDR Feature Definitions (9-Feature Family)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {sedrFeatures.map((f, i) => (
                <motion.div key={f.key} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.04 }}
                  className="p-2.5 rounded-lg border border-border/30 bg-muted/20"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold text-foreground">{f.name}</span>
                    <Badge variant="outline" className="text-[8px]">{f.category}</Badge>
                  </div>
                  <p className="text-[9px] text-muted-foreground">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Validation Summary */}
      <Card className="bg-gradient-to-r from-destructive/10 via-warning/5 to-transparent border-destructive/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-destructive/15">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">Validation Summary</p>
              <p className="text-[10px] text-muted-foreground">
                SEDR captures shift-end documentation patterns from routine EHR audit logs. Validated across 131,901 ICU stays
                (MIMIC-IV: 94,444 + eICU-CRD: 37,457, 208 ICUs). Consistent improvement across all temporal periods with statistical
                significance. 14 of top 15 predictive features are SEDR-derived. Detailed metrics available under NDA.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-destructive">131K+</p>
              <p className="text-[9px] text-muted-foreground">ICU stays validated</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/60 mt-2">*Simulated visualization. Actual performance metrics under NDA. Not for clinical use.</p>
        </CardContent>
      </Card>
    </div>
  );
};
