import { useState } from 'react';
import { Layers, Activity, ArrowRight, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';

const patients = [
  { id: 'DT-001', name: 'E. Ramirez', age: 72, baseline: { hr: 78, bp: '128/82', rr: 16, temp: 98.4, spo2: 96 }, current: { hr: 92, bp: '142/90', rr: 20, temp: 99.1, spo2: 94 }, deviation: 34, status: 'drifting' },
  { id: 'DT-002', name: 'K. Patel', age: 58, baseline: { hr: 68, bp: '118/72', rr: 14, temp: 98.6, spo2: 98 }, current: { hr: 70, bp: '120/74', rr: 14, temp: 98.5, spo2: 97 }, deviation: 5, status: 'stable' },
  { id: 'DT-003', name: 'L. Johnson', age: 84, baseline: { hr: 82, bp: '135/88', rr: 18, temp: 98.2, spo2: 93 }, current: { hr: 110, bp: '98/60', rr: 26, temp: 100.4, spo2: 88 }, deviation: 72, status: 'critical' },
];

const twinTimeline = Array.from({ length: 24 }, (_, i) => ({
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

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-gradient-to-br from-primary/[0.04] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Digital Twin Baseline Learning</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Dynamic patient baseline models with personalized risk thresholds and drift detection</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">Patent #9</Badge>
              <Badge className="bg-muted text-muted-foreground border-border/40 text-[10px]">DESIGN PHASE</Badge>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">MOCK DATA</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Patient Twin Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {patients.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPatient(p)}
            className={cn(
              'text-left p-4 rounded-xl border transition-all',
              selectedPatient.id === p.id ? 'border-primary/40 bg-primary/5 shadow-md' : 'border-border/30 hover:border-primary/20'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-foreground">{p.name}</span>
              <Badge variant="outline" className={cn('text-[9px]', statusColors[p.status])}>{p.status}</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">{p.id} · Age {p.age}</p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                <span>Deviation from baseline</span>
                <span className="font-bold">{p.deviation}%</span>
              </div>
              <Progress value={p.deviation} className="h-1.5" />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Twin Timeline */}
        <Card className="lg:col-span-2 border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Digital Twin vs. Actual — Heart Rate ({selectedPatient.name})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={twinTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} interval={3} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[55, 120]} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
                <Area type="monotone" dataKey="upper" stroke="none" fill="hsl(var(--primary) / 0.08)" name="Upper Bound" />
                <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(var(--background))" name="Lower Bound" />
                <Line type="monotone" dataKey="baseline" stroke="hsl(var(--primary))" strokeDasharray="5 5" dot={false} name="Baseline" strokeWidth={1.5} />
                <Line type="monotone" dataKey="actual" stroke="hsl(var(--destructive))" dot={false} name="Actual" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vitals Comparison */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              Baseline vs. Current
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Heart Rate', base: selectedPatient.baseline.hr, curr: selectedPatient.current.hr, unit: 'bpm' },
              { label: 'Blood Pressure', base: selectedPatient.baseline.bp, curr: selectedPatient.current.bp, unit: '' },
              { label: 'Resp Rate', base: selectedPatient.baseline.rr, curr: selectedPatient.current.rr, unit: '/min' },
              { label: 'Temp', base: selectedPatient.baseline.temp, curr: selectedPatient.current.temp, unit: '°F' },
              { label: 'SpO₂', base: selectedPatient.baseline.spo2, curr: selectedPatient.current.spo2, unit: '%' },
            ].map(v => {
              const diff = typeof v.base === 'number' && typeof v.curr === 'number' ? v.curr - v.base : 0;
              const isDeviated = Math.abs(diff) > 5;
              return (
                <div key={v.label} className={cn('p-3 rounded-lg border', isDeviated ? 'border-warning/30 bg-warning/5' : 'border-border/30 bg-muted/20')}>
                  <p className="text-[10px] text-muted-foreground font-semibold">{v.label}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Base: {v.base}{v.unit}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                    <span className={cn('text-sm font-bold', isDeviated ? 'text-warning' : 'text-foreground')}>{v.curr}{v.unit}</span>
                  </div>
                </div>
              );
            })}
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30 mt-2">
              <p className="text-[10px] text-muted-foreground">Overall Deviation</p>
              <p className={cn('text-2xl font-bold', statusColors[selectedPatient.status]?.split(' ')[0])}>{selectedPatient.deviation}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
