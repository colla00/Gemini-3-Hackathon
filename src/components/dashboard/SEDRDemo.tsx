import { useState } from 'react';
import { Activity, AlertTriangle, MapPin, TrendingUp, Bell, Shield, Radio } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const syndromes = [
  { name: 'Respiratory Illness', score: 0.73, trend: 'rising', facilities: 8, baseline: 0.35, alert: true },
  { name: 'Gastrointestinal', score: 0.42, trend: 'stable', facilities: 3, baseline: 0.38, alert: false },
  { name: 'Neurological', score: 0.28, trend: 'declining', facilities: 2, baseline: 0.30, alert: false },
  { name: 'Sepsis-like', score: 0.61, trend: 'rising', facilities: 5, baseline: 0.40, alert: true },
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
  { name: 'St. Mary\'s', respiratory: 0.71, gi: 0.48, sepsis: 0.62 },
  { name: 'University', respiratory: 0.68, gi: 0.35, sepsis: 0.71 },
  { name: 'Regional', respiratory: 0.75, gi: 0.42, sepsis: 0.48 },
  { name: 'Community', respiratory: 0.58, gi: 0.55, sepsis: 0.38 },
];

const alertLog = [
  { time: '2h ago', type: 'critical', message: 'Respiratory syndrome score exceeded threshold at 3 facilities simultaneously', action: 'Public health notification queued' },
  { time: '8h ago', type: 'warning', message: 'Sepsis-like documentation patterns rising across ICU cluster', action: 'Infection control team notified' },
  { time: '1d ago', type: 'info', message: 'Cross-facility respiratory pattern correlation detected (r=0.87)', action: 'Surveillance enhanced' },
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
  return (
    <div className="space-y-6">
      <Card className="border-destructive/30 bg-gradient-to-br from-destructive/[0.04] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-destructive/10 border border-destructive/20">
                <Radio className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-lg">Syndromic Early Detection & Response</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Population-level surveillance using documentation rhythm patterns for outbreak detection</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">Patent #11</Badge>
              <Badge className="bg-muted text-muted-foreground border-border/40 text-[10px]">DESIGN PHASE</Badge>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">MOCK DATA</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Syndrome Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {syndromes.map(s => (
          <Card key={s.name} className={cn('border-border/40', s.alert && 'border-destructive/30')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s.name}</p>
                {s.alert && <Bell className="h-3.5 w-3.5 text-destructive animate-pulse" />}
              </div>
              <p className={cn('text-2xl font-bold', s.score > 0.6 ? 'text-destructive' : s.score > 0.4 ? 'text-warning' : 'text-risk-low')}>
                {(s.score * 100).toFixed(0)}%
              </p>
              <Progress value={s.score * 100} className="mt-1.5 h-1.5" />
              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                <span className={trendColors[s.trend]}>▲ {s.trend}</span>
                <span>{s.facilities} facilities</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 14-Day Trend */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-destructive" />
              14-Day Syndromic Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 1]} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 11 }} formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
                <Area type="monotone" dataKey="respiratory" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.1)" name="Respiratory" strokeWidth={2} />
                <Area type="monotone" dataKey="sepsis" stroke="hsl(var(--warning))" fill="hsl(var(--warning) / 0.1)" name="Sepsis-like" strokeWidth={1.5} />
                <Area type="monotone" dataKey="gi" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2) / 0.05)" name="GI" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cross-Facility Comparison */}
        <Card className="border-border/40">
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
                <Bar dataKey="respiratory" fill="hsl(var(--destructive))" name="Respiratory" radius={[3, 3, 0, 0]} />
                <Bar dataKey="sepsis" fill="hsl(var(--warning))" name="Sepsis" radius={[3, 3, 0, 0]} />
                <Bar dataKey="gi" fill="hsl(var(--chart-2))" name="GI" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alert Log */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Automated Public Health Alert Log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alertLog.map((a, i) => (
            <div key={i} className={cn('p-4 rounded-xl border', alertColors[a.type])}>
              <div className="flex items-center justify-between mb-1.5">
                <Badge variant="outline" className="text-[9px]">{a.type.toUpperCase()}</Badge>
                <span className="text-[10px] text-muted-foreground">{a.time}</span>
              </div>
              <p className="text-sm text-foreground mb-1">{a.message}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Shield className="h-2.5 w-2.5 text-chart-5" />
                {a.action}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
