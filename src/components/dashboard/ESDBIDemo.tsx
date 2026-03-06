import { useState } from 'react';
import { BarChart3, Users, Clock, TrendingUp, ArrowUpDown, Calendar, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

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
  { unit: 'ICU-A', load: 92, status: 'overloaded', suggestion: 'Transfer 1 RN from Med-Surg B' },
  { unit: 'ICU-B', load: 78, status: 'balanced', suggestion: 'No changes needed' },
  { unit: 'Med-Surg A', load: 85, status: 'high', suggestion: 'Request float pool RN for 3-7 PM' },
  { unit: 'Med-Surg B', load: 54, status: 'low', suggestion: 'Available to send 1 RN to ICU-A' },
];

const loadColors: Record<string, string> = {
  overloaded: 'text-destructive bg-destructive/10 border-destructive/30',
  high: 'text-warning bg-warning/10 border-warning/30',
  balanced: 'text-risk-low bg-risk-low/10 border-risk-low/30',
  low: 'text-chart-2 bg-chart-2/10 border-chart-2/30',
};

export const ESDBIDemo = () => {
  const [activeView, setActiveView] = useState<'staffing' | 'forecast'>('staffing');

  return (
    <div className="space-y-6">
      <Card className="border-chart-2/30 bg-gradient-to-br from-chart-2/[0.04] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-chart-2/10 border border-chart-2/20">
                <Users className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <CardTitle className="text-lg">Enhanced Staffing & Documentation Burden Intelligence</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Predictive scheduling, skill-mix optimization, and workload rebalancing</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">Patent #7</Badge>
              <Badge className="bg-muted text-muted-foreground border-border/40 text-[10px]">DESIGN PHASE</Badge>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">MOCK DATA</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Staffing Gap', value: '+6 RNs', sub: 'Across all shifts', color: 'text-destructive' },
          { label: 'Avg Doc Burden', value: '6.5', sub: 'DBS score / shift', color: 'text-warning' },
          { label: 'Optimal Coverage', value: '78%', sub: 'Current vs optimal', color: 'text-chart-2' },
          { label: 'Rebalance Savings', value: '$42K', sub: 'Monthly estimate', color: 'text-risk-low' },
        ].map((k) => (
          <Card key={k.label} className="border-border/40">
            <CardContent className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <p className={cn('text-2xl font-bold mt-1', k.color)}>{k.value}</p>
              <p className="text-[10px] text-muted-foreground">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        <Button variant={activeView === 'staffing' ? 'default' : 'outline'} size="sm" onClick={() => setActiveView('staffing')}>Shift Staffing</Button>
        <Button variant={activeView === 'forecast' ? 'default' : 'outline'} size="sm" onClick={() => setActiveView('forecast')}>Weekly Forecast</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-chart-2" />
              {activeView === 'staffing' ? 'Shift Staffing Analysis' : '7-Day Burden Forecast'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={activeView === 'staffing' ? shifts.map(s => ({ name: s.shift, Current: s.current, Optimal: s.optimal })) : forecastData.map(d => ({ name: d.day, Actual: d.staffing, Optimal: d.optimal }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey={activeView === 'staffing' ? 'Current' : 'Actual'} fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Optimal" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Unit Rebalancing */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-chart-2" />
              Real-Time Workload Rebalancing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unitRebalancing.map((u) => (
              <div key={u.unit} className="p-3 rounded-lg border border-border/30 bg-muted/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-foreground">{u.unit}</span>
                  <Badge variant="outline" className={cn('text-[9px]', loadColors[u.status])}>{u.status}</Badge>
                </div>
                <Progress value={u.load} className="h-1.5 mb-1.5" />
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Zap className="h-2.5 w-2.5 text-chart-2" />
                  {u.suggestion}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Skill Mix */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-chart-2" />
            Skill-Mix Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skillMixData.map((s) => (
              <div key={s.role} className="bg-muted/30 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground font-semibold">{s.role}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-foreground">{s.current}%</span>
                  <span className="text-xs text-muted-foreground">→ {s.optimal}%</span>
                </div>
                <Progress value={s.current} className="mt-2 h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
