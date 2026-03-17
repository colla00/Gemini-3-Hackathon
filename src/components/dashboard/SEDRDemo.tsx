import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, MapPin, TrendingUp, Bell, Shield, Radio, DollarSign, Zap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const syndromes = [
  { name: 'Respiratory Illness', baseScore: 0.73, trend: 'rising', facilities: 8, alert: true },
  { name: 'Gastrointestinal', baseScore: 0.42, trend: 'stable', facilities: 3, alert: false },
  { name: 'Neurological', baseScore: 0.28, trend: 'declining', facilities: 2, alert: false },
  { name: 'Sepsis-like', baseScore: 0.61, trend: 'rising', facilities: 5, alert: true },
];

const timelineData = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  respiratory: 0.35 + (i > 7 ? (i - 7) * 0.055 : 0) + Math.random() * 0.05,
  gi: 0.38 + Math.sin(i / 3) * 0.06 + Math.random() * 0.03,
  sepsis: 0.40 + (i > 9 ? (i - 9) * 0.045 : 0) + Math.random() * 0.04,
  threshold: 0.6,
}));

const facilityData = [
  { name: 'Memorial', respiratory: 0.82, gi: 0.31, sepsis: 0.55 },
  { name: "St. Mary's", respiratory: 0.71, gi: 0.48, sepsis: 0.62 },
  { name: 'University', respiratory: 0.68, gi: 0.35, sepsis: 0.71 },
  { name: 'Regional', respiratory: 0.75, gi: 0.42, sepsis: 0.48 },
  { name: 'Community', respiratory: 0.58, gi: 0.55, sepsis: 0.38 },
];

const alertLog = [
  { time: '2h ago', type: 'critical' as const, message: 'Respiratory syndrome score exceeded threshold at 3 facilities simultaneously', action: 'Public health notification queued' },
  { time: '8h ago', type: 'warning' as const, message: 'Sepsis-like documentation patterns rising across ICU cluster', action: 'Infection control team notified' },
  { time: '1d ago', type: 'info' as const, message: 'Cross-facility respiratory pattern correlation detected (r=0.87)', action: 'Surveillance enhanced' },
];

const alertColors: Record<string, string> = {
  critical: 'border-destructive/30 bg-destructive/5',
  warning: 'border-warning/30 bg-warning/5',
  info: 'border-border/30 bg-muted/20',
};

const trendColors: Record<string, string> = {
  rising: 'text-destructive',
  stable: 'text-muted-foreground',
  declining: 'text-risk-low',
};

export const SEDRDemo = () => {
  const [liveScores, setLiveScores] = useState(syndromes.map(s => s.baseScore));
  const [liveFacilities, setLiveFacilities] = useState(18);
  const [liveAlerts, setLiveAlerts] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveScores(prev => prev.map((s, i) => {
        const drift = syndromes[i].trend === 'rising' ? 0.003 : syndromes[i].trend === 'declining' ? -0.002 : 0;
        return Math.min(0.99, Math.max(0.05, s + drift + (Math.random() - 0.48) * 0.015));
      }));
      if (Math.random() > 0.85) setLiveAlerts(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
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
                <p className="text-xs text-muted-foreground mt-0.5">Documentation-derived workflow burden measurement · Validated on 94,444 ICU stays across five temporal periods</p>
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

      {/* Enterprise KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'ICU Stays Validated', value: '94,444', sub: 'MIMIC-IV (2008–2022)', icon: <MapPin className="h-4 w-4" />, color: 'text-destructive' },
          { label: 'Temporal Periods', value: '5', sub: 'LOPO cross-validation', icon: <Bell className="h-4 w-4" />, color: 'text-warning' },
          { label: 'Detection Lead', value: 'Strong', sub: 'vs. enriched baseline', icon: <Clock className="h-4 w-4" />, color: 'text-chart-1' },
          { label: 'Significance', value: '5/5', sub: 'periods (p<0.05)', icon: <DollarSign className="h-4 w-4" />, color: 'text-risk-low' },
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

      {/* Live Syndrome Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {syndromes.map((s, i) => {
          const score = liveScores[i];
          const isAlert = score > 0.6;
          return (
            <motion.div key={s.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
              <Card className={cn('border-border/40 transition-all', isAlert && 'border-destructive/30 shadow-sm shadow-destructive/5')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s.name}</p>
                    {isAlert && <Bell className="h-3.5 w-3.5 text-destructive animate-pulse" />}
                  </div>
                  <p className={cn('text-2xl font-bold tabular-nums', score > 0.6 ? 'text-destructive' : score > 0.4 ? 'text-warning' : 'text-risk-low')}>
                    {(score * 100).toFixed(0)}%
                  </p>
                  <Progress value={score * 100} className="mt-1.5 h-2" />
                  <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                    <span className={trendColors[s.trend]}>▲ {s.trend}</span>
                    <span>{s.facilities} facilities</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 14-Day Trend */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-destructive" />
                14-Day Syndromic Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="respGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sepsisGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 1]} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 11 }} formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
                  <Area type="monotone" dataKey="respiratory" stroke="hsl(var(--destructive))" fill="url(#respGrad)" name="Respiratory" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="sepsis" stroke="hsl(var(--warning))" fill="url(#sepsisGrad)" name="Sepsis-like" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="gi" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2) / 0.05)" name="GI" strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cross-Facility Comparison */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Card className="border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-destructive" />
                Cross-Facility Pattern Aggregation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={facilityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 1]} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 11 }} formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="respiratory" fill="hsl(var(--destructive))" name="Respiratory" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sepsis" fill="hsl(var(--warning))" name="Sepsis" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gi" fill="hsl(var(--chart-2))" name="GI" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alert Log */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Automated Public Health Alert Log
              <Badge variant="outline" className="text-[9px] ml-auto">{liveAlerts} total alerts</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertLog.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }}>
                <div className={cn('p-4 rounded-xl border', alertColors[a.type])}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {a.type === 'critical' && <AlertTriangle className="h-3 w-3 text-destructive animate-pulse" />}
                      <Badge variant="outline" className="text-[9px]">{a.type.toUpperCase()}</Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="text-sm text-foreground mb-1">{a.message}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Shield className="h-2.5 w-2.5 text-chart-5" />
                    {a.action}
                  </p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Enterprise ROI */}
      <Card className="bg-gradient-to-r from-destructive/10 via-warning/5 to-transparent border-destructive/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-destructive/15">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">Validation Summary</p>
              <p className="text-[10px] text-muted-foreground">
                SEDR captures shift-end documentation patterns from routine EHR activity, validated on 94,444 MIMIC-IV ICU stays
                across five held-out three-year periods (2008–2022). SEDR-enhanced models outperformed enriched baseline and IDI comparators
                across all temporal periods with statistical significance. Detailed metrics available under NDA.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-destructive">5/5</p>
              <p className="text-[9px] text-muted-foreground">periods significant</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/60 mt-2">*Simulated visualization. Actual performance metrics under NDA. Not for clinical use.</p>
        </CardContent>
      </Card>
    </div>
  );
};
