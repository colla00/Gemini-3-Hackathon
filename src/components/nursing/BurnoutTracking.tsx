import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const generateBurnoutTrend = () => Array.from({ length: 8 }, (_, i) => ({
  week: `Week ${i + 1}`,
  score: parseFloat((7.5 - i * 0.18 + (Math.random() - 0.5) * 0.6).toFixed(1)),
}));

const baseMBI = [
  { domain: 'Emotional Exhaustion', baseline: 6.5 },
  { domain: 'Depersonalization', baseline: 5.8 },
  { domain: 'Personal Accomplishment', baseline: 7.2 },
  { domain: 'Work Engagement', baseline: 6.8 },
  { domain: 'Job Satisfaction', baseline: 7.0 },
];

const variantStyles = {
  success: 'bg-gradient-to-br from-[hsl(var(--risk-low))] to-[hsl(var(--risk-low)/0.8)] text-primary-foreground',
  info: 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground',
  accent: 'bg-gradient-to-br from-accent to-accent/80 text-accent-foreground',
};

export const BurnoutTracking = () => {
  const [burnoutTrend, setBurnoutTrend] = useState(generateBurnoutTrend);
  const [workloadScore, setWorkloadScore] = useState(6.2);
  const [weeklyCharts, setWeeklyCharts] = useState(42);
  const [mbiData, setMbiData] = useState(() => baseMBI.map(d => ({
    ...d,
    current: parseFloat((d.baseline + (Math.random() - 0.3) * 1.5).toFixed(1)),
  })));

  useEffect(() => {
    const interval = setInterval(() => {
      setWorkloadScore(prev => parseFloat(Math.max(3, Math.min(9, prev + (Math.random() - 0.52) * 0.15)).toFixed(1)));
      setWeeklyCharts(prev => Math.max(30, prev + Math.floor((Math.random() - 0.48) * 2)));
      setMbiData(prev => prev.map(d => ({
        ...d,
        current: parseFloat(Math.max(1, Math.min(10, d.current + (Math.random() - 0.48) * 0.1)).toFixed(1)),
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setBurnoutTrend(generateBurnoutTrend()), 20000);
    return () => clearInterval(interval);
  }, []);

  const riskLevel = workloadScore < 5 ? 'Low' : workloadScore < 7 ? 'Moderate' : 'Elevated';

  const metrics = [
    { value: workloadScore.toString(), label: 'Current Workload Score', trend: workloadScore < 7 ? '↓ Below unit average (7.5)' : '↑ Above unit average', variant: 'success' as const },
    { value: weeklyCharts.toString(), label: 'Weekly Avg Charts/Day', trend: '→ Stable vs. last week', variant: 'info' as const },
    { value: riskLevel, label: 'Burnout Risk Level', trend: riskLevel === 'Low' ? 'Within healthy range' : 'Monitor closely', variant: 'accent' as const },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Burnout Risk Assessment</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Based on workload patterns and Maslach Burnout Inventory domains</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-risk-low/10 border border-risk-low/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
            </span>
            <span className="text-[10px] font-semibold text-risk-low">LIVE</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {metrics.map((m) => (
              <div key={m.label} className={`${variantStyles[m.variant]} p-6 rounded-xl`}>
                <div className="text-3xl font-bold tabular-nums">{m.value}</div>
                <div className="text-sm opacity-90 mt-1">{m.label}</div>
                <div className="text-xs opacity-80 mt-2">{m.trend}</div>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={burnoutTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[0, 10]} label={{ value: 'Workload Score (0-10)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} name="Workload Score" dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Maslach Burnout Inventory Domains</CardTitle>
          <span className="text-[10px] text-muted-foreground tabular-nums">Updating in real-time</span>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={mbiData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Radar name="Baseline" dataKey="baseline" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground) / 0.15)" />
              <Radar name="Current" dataKey="current" stroke="hsl(var(--risk-low))" fill="hsl(var(--risk-low) / 0.15)" />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
