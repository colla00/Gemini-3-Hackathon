import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const qualityDimensions = [
  { dimension: 'Hand Hygiene', score: 94, benchmark: 95, trend: 'stable' },
  { dimension: 'Falls Prevention', score: 88, benchmark: 90, trend: 'improving' },
  { dimension: 'CAUTI Rate', score: 96, benchmark: 92, trend: 'stable' },
  { dimension: 'CLABSI Rate', score: 91, benchmark: 90, trend: 'declining' },
  { dimension: 'Pressure Injury', score: 82, benchmark: 88, trend: 'declining' },
  { dimension: 'Med Errors', score: 97, benchmark: 95, trend: 'improving' },
];

const radarData = qualityDimensions.map(d => ({
  subject: d.dimension,
  Current: d.score,
  Benchmark: d.benchmark,
}));

const trendData = [
  { month: 'Jul', composite: 88, benchmark: 90 },
  { month: 'Aug', composite: 89, benchmark: 90 },
  { month: 'Sep', composite: 87, benchmark: 90 },
  { month: 'Oct', composite: 91, benchmark: 90 },
  { month: 'Nov', composite: 90, benchmark: 90 },
  { month: 'Dec', composite: 92, benchmark: 90 },
  { month: 'Jan', composite: 91, benchmark: 91 },
];

const deviations = [
  { id: 1, metric: 'Pressure Injury Rate', severity: 'high', value: '82%', benchmark: '88%', gap: '-6%', action: 'Triggered: Skin assessment protocol reinforcement', timeDetected: '2h ago' },
  { id: 2, metric: 'Falls (Unit 3B)', severity: 'medium', value: '3 events', benchmark: '≤1/month', gap: '+2', action: 'Triggered: Fall risk reassessment for all patients', timeDetected: '6h ago' },
  { id: 3, metric: 'CLABSI (ICU-A)', severity: 'low', value: '91%', benchmark: '90%', gap: '+1%', action: 'Monitoring: Within acceptable variance', timeDetected: '1d ago' },
];

const sevColors: Record<string, string> = {
  high: 'text-destructive bg-destructive/10 border-destructive/30',
  medium: 'text-warning bg-warning/10 border-warning/30',
  low: 'text-risk-low bg-risk-low/10 border-risk-low/30',
};

export const SHQSDemo = () => {
  const compositeScore = 91.3;

  return (
    <div className="space-y-6">
      <Card className="border-chart-5/30 bg-gradient-to-br from-chart-5/[0.04] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-chart-5/10 border border-chart-5/20">
                <Shield className="w-5 h-5 text-chart-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Smart Healthcare Quality Surveillance</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Continuous quality monitoring, deviation detection, and automated improvement workflows</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">Patent #8</Badge>
              <Badge className="bg-muted text-muted-foreground border-border/40 text-[10px]">DESIGN PHASE</Badge>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">MOCK DATA</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Composite Score + KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/40 md:col-span-1">
          <CardContent className="p-5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Composite Quality</p>
            <p className="text-4xl font-bold text-risk-low mt-1">{compositeScore}%</p>
            <Badge className="bg-risk-low/10 text-risk-low border-risk-low/30 text-[9px] mt-2">Above Benchmark</Badge>
          </CardContent>
        </Card>
        {[
          { label: 'Active Deviations', value: '2', color: 'text-warning' },
          { label: 'Auto-Actions', value: '4', color: 'text-chart-5' },
          { label: 'Days Since Critical', value: '18', color: 'text-risk-low' },
        ].map(k => (
          <Card key={k.label} className="border-border/40">
            <CardContent className="p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <p className={cn('text-3xl font-bold mt-1', k.color)}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-chart-5" />
              Multi-Dimensional Quality Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                <PolarRadiusAxis angle={30} domain={[70, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Current" dataKey="Current" stroke="hsl(var(--chart-5))" fill="hsl(var(--chart-5))" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Benchmark" dataKey="Benchmark" stroke="hsl(var(--muted-foreground))" fill="none" strokeDasharray="5 5" />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-chart-5" />
              Composite Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[82, 96]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
                <Line type="monotone" dataKey="composite" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--chart-5))' }} name="Quality Score" />
                <Line type="monotone" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Benchmark" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Deviations */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Quality Deviation Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {deviations.map((d) => (
            <div key={d.id} className={cn('p-4 rounded-xl border', sevColors[d.severity])}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{d.metric}</span>
                  <Badge variant="outline" className={cn('text-[9px]', sevColors[d.severity])}>{d.severity}</Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">{d.timeDetected}</span>
              </div>
              <div className="flex gap-4 text-[11px] text-muted-foreground mb-2">
                <span>Current: <strong className="text-foreground">{d.value}</strong></span>
                <span>Benchmark: {d.benchmark}</span>
                <span>Gap: <strong>{d.gap}</strong></span>
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-chart-5" />
                {d.action}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
