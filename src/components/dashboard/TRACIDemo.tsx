import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, TrendingUp, AlertTriangle, ArrowRight, Zap, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const horizons = [
  { label: '4-Hour', key: '4h', risk: 0.23, trend: 'stable', color: 'text-risk-low' },
  { label: '12-Hour', key: '12h', risk: 0.41, trend: 'rising', color: 'text-warning' },
  { label: '24-Hour', key: '24h', risk: 0.58, trend: 'rising', color: 'text-risk-medium' },
  { label: '48-Hour', key: '48h', risk: 0.72, trend: 'critical', color: 'text-destructive' },
];

const timelineData = Array.from({ length: 48 }, (_, i) => ({
  hour: i,
  risk: Math.min(0.95, 0.15 + Math.sin(i / 8) * 0.12 + (i / 48) * 0.45 + Math.random() * 0.08),
  threshold: 0.6,
  baseline: 0.2 + (i / 48) * 0.1,
}));

const patients = [
  { id: 'PT-4821', name: 'R. Martinez', age: 67, risk4h: 0.18, risk48h: 0.71, trajectory: 'escalating', phenotype: 'Escalating Crisis' },
  { id: 'PT-3199', name: 'J. Thompson', age: 74, risk4h: 0.62, risk48h: 0.85, trajectory: 'critical', phenotype: 'Chaotic Instability' },
  { id: 'PT-5502', name: 'M. Chen', age: 55, risk4h: 0.08, risk48h: 0.12, trajectory: 'stable', phenotype: 'Steady Surveillance' },
  { id: 'PT-2847', name: 'A. Williams', age: 81, risk4h: 0.34, risk48h: 0.56, trajectory: 'rising', phenotype: 'Minimal Documentation' },
];

const trajectoryColors: Record<string, string> = {
  stable: 'text-risk-low bg-risk-low/10 border-risk-low/30',
  rising: 'text-warning bg-warning/10 border-warning/30',
  escalating: 'text-risk-medium bg-risk-medium/10 border-risk-medium/30',
  critical: 'text-destructive bg-destructive/10 border-destructive/30',
};

export const TRACIDemo = () => {
  const [selectedPatient, setSelectedPatient] = useState(patients[1]);
  const [animatedRisks, setAnimatedRisks] = useState<Record<string, number>>({});

  useEffect(() => {
    horizons.forEach((h, i) => {
      setTimeout(() => {
        setAnimatedRisks(prev => ({ ...prev, [h.key]: h.risk }));
      }, 300 + i * 200);
    });
  }, [selectedPatient]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-chart-1/30 bg-gradient-to-br from-chart-1/[0.04] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-chart-1/10 border border-chart-1/20">
                <Activity className="w-5 h-5 text-chart-1" />
              </div>
              <div>
                <CardTitle className="text-lg">Temporal Risk Assessment & Clinical Intelligence</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Multi-horizon deterioration prediction from documentation rhythm patterns</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">Patent #6</Badge>
              <Badge className="bg-muted text-muted-foreground border-border/40 text-[10px]">DESIGN PHASE</Badge>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">MOCK DATA</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Multi-Horizon Risk Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {horizons.map((h) => (
          <Card key={h.key} className="border-border/40">
            <CardContent className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{h.label} Risk</p>
              <p className={cn('text-3xl font-bold', h.color)}>{((animatedRisks[h.key] || 0) * 100).toFixed(0)}%</p>
              <Progress value={(animatedRisks[h.key] || 0) * 100} className="mt-2 h-1.5" />
              <Badge variant="outline" className={cn('mt-2 text-[9px]', trajectoryColors[h.trend])}>
                {h.trend.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Timeline Chart */}
        <Card className="lg:col-span-2 border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Timer className="h-4 w-4 text-chart-1" />
              48-Hour Risk Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} label={{ value: 'Hours', position: 'bottom', fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 1]} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
                <ReferenceLine y={0.6} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={{ value: 'Alert Threshold', fontSize: 10, fill: 'hsl(var(--destructive))' }} />
                <Area type="monotone" dataKey="baseline" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground) / 0.05)" strokeDasharray="3 3" name="Baseline" />
                <Area type="monotone" dataKey="risk" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1) / 0.15)" name="Risk Score" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Risk Queue */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Patient Risk Queue
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
                    ? 'border-chart-1/40 bg-chart-1/5'
                    : 'border-border/30 hover:border-chart-1/20'
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
                  <span className="font-semibold">48h: {(p.risk48h * 100).toFixed(0)}%</span>
                </div>
                <Progress value={p.risk48h * 100} className="mt-1.5 h-1" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Selected Patient Detail */}
      <Card className="border-border/40">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-4 w-4 text-chart-1" />
            <p className="text-sm font-bold text-foreground">Temporal Pattern Analysis: {selectedPatient.name}</p>
            <Badge variant="outline" className="text-[10px]">{selectedPatient.phenotype}</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground">4h Risk</p>
              <p className="text-lg font-bold text-foreground">{(selectedPatient.risk4h * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground">48h Risk</p>
              <p className="text-lg font-bold text-foreground">{(selectedPatient.risk48h * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground">Trajectory</p>
              <p className={cn('text-lg font-bold capitalize', trajectoryColors[selectedPatient.trajectory]?.split(' ')[0])}>{selectedPatient.trajectory}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground">Doc Phenotype</p>
              <p className="text-sm font-bold text-foreground">{selectedPatient.phenotype}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
