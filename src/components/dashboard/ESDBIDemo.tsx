import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Clock, TrendingUp, ArrowUpDown, Calendar, Zap, DollarSign, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const shifts = [
  { shift: 'Day (7a-7p)', current: 12, optimal: 14, burden: 7.8, gap: +2 },
  { shift: 'Night (7p-7a)', current: 10, optimal: 11, burden: 5.2, gap: +1 },
  { shift: 'Weekend Day', current: 8, optimal: 10, burden: 8.1, gap: +2 },
  { shift: 'Weekend Night', current: 7, optimal: 8, burden: 4.9, gap: +1 },
];

const skillMixData = [
  { role: 'RN (BSN)', current: 65, optimal: 58, color: 'hsl(var(--primary))' },
  { role: 'RN (ADN)', current: 20, optimal: 22, color: 'hsl(var(--chart-2))' },
  { role: 'LPN/LVN', current: 10, optimal: 12, color: 'hsl(var(--chart-3))' },
  { role: 'CNA/Tech', current: 5, optimal: 8, color: 'hsl(var(--chart-4))' },
];

const forecastData = [
  { day: 'Mon', burden: 7.2, staffing: 13, optimal: 14 },
  { day: 'Tue', burden: 6.8, staffing: 12, optimal: 13 },
  { day: 'Wed', burden: 8.1, staffing: 12, optimal: 15 },
  { day: 'Thu', burden: 7.5, staffing: 14, optimal: 14 },
  { day: 'Fri', burden: 8.9, staffing: 11, optimal: 16 },
  { day: 'Sat', burden: 6.2, staffing: 8, optimal: 10 },
  { day: 'Sun', burden: 5.8, staffing: 8, optimal: 9 },
];

const unitRebalancing = [
  { unit: 'ICU-A', load: 92, status: 'overloaded', suggestion: 'Transfer 1 RN from Med-Surg B', urgency: 'high' },
  { unit: 'ICU-B', load: 78, status: 'balanced', suggestion: 'No changes needed', urgency: 'none' },
  { unit: 'Med-Surg A', load: 85, status: 'high', suggestion: 'Request float pool RN for 3-7 PM', urgency: 'medium' },
  { unit: 'Med-Surg B', load: 54, status: 'low', suggestion: 'Available to send 1 RN to ICU-A', urgency: 'low' },
];

const loadColors: Record<string, string> = {
  overloaded: 'text-destructive bg-destructive/10 border-destructive/30',
  high: 'text-warning bg-warning/10 border-warning/30',
  balanced: 'text-risk-low bg-risk-low/10 border-risk-low/30',
  low: 'text-chart-2 bg-chart-2/10 border-chart-2/30',
};

export const ESDBIDemo = () => {
  const [activeView, setActiveView] = useState<'staffing' | 'forecast'>('staffing');
  const [liveOT, setLiveOT] = useState(18.3);
  const [liveSaved, setLiveSaved] = useState(504);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveOT(prev => parseFloat((prev + (Math.random() - 0.52) * 0.1).toFixed(1)));
      setLiveSaved(prev => prev + Math.floor(Math.random() * 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-chart-2/30 bg-gradient-to-br from-chart-2/[0.06] to-transparent overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--chart-2)/0.08),transparent_70%)]" />
        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-chart-2/15 border border-chart-2/25 shadow-lg shadow-chart-2/10">
                <Users className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <CardTitle className="text-lg">Enhanced Staffing & Documentation Burden Intelligence</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Predictive scheduling, skill-mix optimization, and workload rebalancing</p>
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
              <Badge variant="outline" className="text-[10px]">Patent #7</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enterprise KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Staffing Gap', value: '+6 RNs', sub: 'Across all shifts today', color: 'text-destructive', icon: <Users className="h-4 w-4" /> },
          { label: 'Overtime Reduction', value: `${liveOT}%`, sub: 'vs. manual scheduling', color: 'text-chart-2', icon: <Clock className="h-4 w-4" /> },
          { label: 'Hours Rebalanced', value: liveSaved.toString(), sub: 'this month', color: 'text-primary', icon: <ArrowUpDown className="h-4 w-4" /> },
          { label: 'Annual ROI', value: '$504K', sub: 'per 400-bed hospital', color: 'text-risk-low', icon: <DollarSign className="h-4 w-4" /> },
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

      <div className="flex gap-2 mb-2">
        <Button variant={activeView === 'staffing' ? 'default' : 'outline'} size="sm" onClick={() => setActiveView('staffing')}>Shift Staffing</Button>
        <Button variant={activeView === 'forecast' ? 'default' : 'outline'} size="sm" onClick={() => setActiveView('forecast')}>Weekly Forecast</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-chart-2" />
                {activeView === 'staffing' ? 'Shift Staffing Analysis' : '7-Day Burden Forecast'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={activeView === 'staffing' ? shifts.map(s => ({ name: s.shift, Current: s.current, Optimal: s.optimal })) : forecastData.map(d => ({ name: d.day, Actual: d.staffing, Optimal: d.optimal }))}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey={activeView === 'staffing' ? 'Current' : 'Actual'} fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Optimal" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Unit Rebalancing */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-chart-2" />
                Real-Time Workload Rebalancing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {unitRebalancing.map((u) => (
                <div key={u.unit} className={cn(
                  'p-3 rounded-lg border transition-all',
                  u.urgency === 'high' ? 'border-destructive/30 bg-destructive/5' : 'border-border/30 bg-muted/20'
                )}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-foreground">{u.unit}</span>
                    <Badge variant="outline" className={cn('text-[9px]', loadColors[u.status])}>{u.status}</Badge>
                  </div>
                  <Progress value={u.load} className="h-2 mb-1.5" />
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Zap className="h-2.5 w-2.5 text-chart-2" />
                      {u.suggestion}
                    </p>
                    {u.urgency === 'high' && (
                      <Button variant="outline" size="sm" className="h-5 text-[9px] px-2 border-destructive/30 text-destructive">
                        Deploy
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Skill Mix */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-chart-2" />
              Skill-Mix Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skillMixData.map((s) => {
                const delta = s.optimal - s.current;
                return (
                  <div key={s.role} className="bg-muted/30 rounded-lg p-3 border border-border/20">
                    <p className="text-[10px] text-muted-foreground font-semibold">{s.role}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xl font-bold text-foreground tabular-nums">{s.current}%</span>
                      <span className="text-xs text-muted-foreground">→</span>
                      <span className={cn('text-sm font-bold', delta > 0 ? 'text-risk-low' : 'text-warning')}>{s.optimal}%</span>
                    </div>
                    <Progress value={s.current} className="mt-2 h-1.5" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enterprise ROI */}
      <Card className="bg-gradient-to-r from-chart-2/10 via-primary/5 to-transparent border-chart-2/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-chart-2/15">
              <Shield className="w-5 h-5 text-chart-2" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">Enterprise Integration Value</p>
              <p className="text-[10px] text-muted-foreground">
                ESDBI extends DBS with predictive scheduling and real-time workload rebalancing. Reduces overtime by 15-20%*,
                improves nurse satisfaction scores, and eliminates understaffing-driven safety events — all using existing EHR data.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-chart-2">$504K</p>
              <p className="text-[9px] text-muted-foreground">annual savings*</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/60 mt-2">*Design-phase estimates. Not clinically validated. For illustration only.</p>
        </CardContent>
      </Card>
    </div>
  );
};
