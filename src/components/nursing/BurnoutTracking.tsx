import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const burnoutTrend = [
  { week: 'Week 1', score: 7.5 },
  { week: 'Week 2', score: 7.8 },
  { week: 'Week 3', score: 6.9 },
  { week: 'Week 4', score: 7.2 },
  { week: 'Week 5', score: 6.5 },
  { week: 'Week 6', score: 6.8 },
  { week: 'Week 7', score: 6.3 },
  { week: 'Week 8', score: 6.2 },
];

const mbiData = [
  { domain: 'Emotional Exhaustion', baseline: 6.5, current: 5.2 },
  { domain: 'Depersonalization', baseline: 5.8, current: 4.5 },
  { domain: 'Personal Accomplishment', baseline: 7.2, current: 8.1 },
  { domain: 'Work Engagement', baseline: 6.8, current: 7.5 },
  { domain: 'Job Satisfaction', baseline: 7.0, current: 7.8 },
];

const metrics = [
  { value: '6.2', label: 'Current Workload Score', trend: '\u2193 Below unit average (7.5)', variant: 'success' as const },
  { value: '42', label: 'Weekly Avg Charts/Day', trend: '\u2192 Stable vs. last week', variant: 'info' as const },
  { value: 'Low', label: 'Burnout Risk Level', trend: 'Within healthy range', variant: 'accent' as const },
];

const variantStyles = {
  success: 'bg-gradient-to-br from-[hsl(var(--risk-low))] to-[hsl(var(--risk-low)/0.8)] text-white',
  info: 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground',
  accent: 'bg-gradient-to-br from-accent to-accent/80 text-accent-foreground',
};

export const BurnoutTracking = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Burnout Risk Assessment</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Based on workload patterns and self-reported measures (Maslach Burnout Inventory)</p>
          </div>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-[10px] font-semibold">PILOT DATA PLACEHOLDER</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {metrics.map((m) => (
              <div key={m.label} className={`${variantStyles[m.variant]} p-6 rounded-xl`}>
                <div className="text-3xl font-bold">{m.value}</div>
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
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-[10px] font-semibold">PILOT DATA PLACEHOLDER</Badge>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={mbiData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Radar name="Baseline" dataKey="baseline" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground) / 0.15)" />
              <Radar name="Current (Week 8)" dataKey="current" stroke="hsl(var(--risk-low))" fill="hsl(var(--risk-low) / 0.15)" />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-4">
            <strong>Note:</strong> MBI scores will be collected during 6-month pilot study. Mock data shown for prototype demonstration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
