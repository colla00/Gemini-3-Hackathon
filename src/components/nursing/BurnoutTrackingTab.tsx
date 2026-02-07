import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';

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

const MetricCard = ({ value, label, trend, color }: { value: string; label: string; trend: string; color: string }) => (
  <div className={`relative overflow-hidden rounded-xl p-6 text-white ${color}`}>
    <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-white/10 rounded-full" />
    <p className="text-4xl font-bold mb-2 relative">{value}</p>
    <p className="text-sm opacity-90 relative">{label}</p>
    <p className="text-xs opacity-80 mt-2 relative">{trend}</p>
  </div>
);

export const BurnoutTrackingTab = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Burnout Risk Assessment</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Based on workload patterns and self-reported measures (Maslach Burnout Inventory)</p>
        </div>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold">PILOT DATA PLACEHOLDER</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard value="6.2" label="Current Workload Score" trend="↓ Below unit average (7.5)" color="bg-gradient-to-br from-emerald-500 to-emerald-700" />
          <MetricCard value="42" label="Weekly Avg Charts/Day" trend="→ Stable vs. last week" color="bg-gradient-to-br from-blue-500 to-blue-700" />
          <MetricCard value="Low" label="Burnout Risk Level" trend="Within healthy range" color="bg-gradient-to-br from-violet-500 to-violet-700" />
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={burnoutTrend}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} label={{ value: 'Workload Score (0-10)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" name="Workload Score" stroke="hsl(var(--primary))" strokeWidth={2} fill="hsl(var(--primary) / 0.1)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Maslach Burnout Inventory Domains</CardTitle>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold">PILOT DATA PLACEHOLDER</Badge>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={mbiData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 10]} />
              <Legend />
              <Radar name="Baseline" dataKey="baseline" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground) / 0.2)" />
              <Radar name="Current (Week 8)" dataKey="current" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2) / 0.2)" />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          <strong>Note:</strong> MBI scores will be collected during 6-month pilot study. Mock data shown for prototype demonstration.
        </p>
      </CardContent>
    </Card>
  </div>
);
