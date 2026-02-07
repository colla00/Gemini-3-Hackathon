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
  { value: '6.2', label: 'Current Workload Score', trend: 'Below unit average (7.5)', direction: 'down', color: 'from-emerald-500 to-emerald-600' },
  { value: '42', label: 'Weekly Avg Charts/Day', trend: 'Stable vs. last week', direction: 'stable', color: 'from-blue-500 to-blue-600' },
  { value: 'Low', label: 'Burnout Risk Level', trend: 'Within healthy range', direction: 'stable', color: 'from-violet-500 to-violet-600' },
];

export const BurnoutTracking = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Burnout Risk Assessment</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Based on workload patterns and self-reported measures (Maslach Burnout Inventory)</p>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">PILOT DATA PLACEHOLDER</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {metrics.map((m) => (
              <div key={m.label} className={`bg-gradient-to-br ${m.color} text-white p-6 rounded-xl`}>
                <div className="text-3xl font-bold">{m.value}</div>
                <div className="text-sm opacity-90 mt-1">{m.label}</div>
                <div className="text-xs opacity-80 mt-2">
                  {m.direction === 'down' ? '\u2193' : m.direction === 'up' ? '\u2191' : '\u2192'} {m.trend}
                </div>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={burnoutTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 10]} label={{ value: 'Workload Score (0-10)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" fill="rgba(59,130,246,0.1)" strokeWidth={2} name="Workload Score" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Maslach Burnout Inventory Domains</CardTitle>
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">PILOT DATA PLACEHOLDER</Badge>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={mbiData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 10]} />
              <Radar name="Baseline" dataKey="baseline" stroke="#94a3b8" fill="rgba(148,163,184,0.2)" />
              <Radar name="Current (Week 8)" dataKey="current" stroke="#10b981" fill="rgba(16,185,129,0.2)" />
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
