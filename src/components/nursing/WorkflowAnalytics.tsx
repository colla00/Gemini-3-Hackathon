import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const heatmapData = [
  { day: 'Mon', '6 AM': 45, '12 PM': 78, '6 PM': 65, '12 AM': 28 },
  { day: 'Tue', '6 AM': 42, '12 PM': 82, '6 PM': 68, '12 AM': 25 },
  { day: 'Wed', '6 AM': 48, '12 PM': 85, '6 PM': 70, '12 AM': 30 },
  { day: 'Thu', '6 AM': 44, '12 PM': 80, '6 PM': 67, '12 AM': 27 },
  { day: 'Fri', '6 AM': 46, '12 PM': 77, '6 PM': 64, '12 AM': 26 },
  { day: 'Sat', '6 AM': 38, '12 PM': 65, '6 PM': 55, '12 AM': 22 },
  { day: 'Sun', '6 AM': 35, '12 PM': 62, '6 PM': 52, '12 AM': 20 },
];

const completionData = [
  { name: 'On Time', value: 72 },
  { name: 'Early', value: 15 },
  { name: 'Delayed (<15 min)', value: 10 },
  { name: 'Delayed (>15 min)', value: 3 },
];

const completionColors = [
  'hsl(var(--risk-low))',
  'hsl(var(--primary))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
];

const outcomesData = [
  { metric: 'Readmissions', pre: 12.5, post: 9.8 },
  { metric: 'Falls', pre: 3.2, post: 2.1 },
  { metric: 'Pressure Injuries', pre: 2.8, post: 1.5 },
  { metric: 'Patient Satisfaction', pre: 82, post: 89 },
];

const performanceMetrics = [
  { label: 'Efficiency Metrics', value: '87%', detail: 'On-time task completion' },
  { label: 'Documentation Quality', value: '92%', detail: 'Complete charting rate' },
  { label: 'Workflow Optimization', value: '23 min', detail: 'Avg. time saved per shift' },
];

export const WorkflowAnalytics = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Documentation Heatmap</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Nursing chart entry patterns by hour and day of week</p>
          </div>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-[10px] font-semibold">MOCK DATA</Badge>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={heatmapData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis label={{ value: 'Chart Entries', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="6 AM" fill="hsl(var(--primary) / 0.3)" />
              <Bar dataKey="12 PM" fill="hsl(var(--primary) / 0.6)" />
              <Bar dataKey="6 PM" fill="hsl(var(--primary))" />
              <Bar dataKey="12 AM" fill="hsl(var(--accent))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Task Completion Times</CardTitle>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-[10px] font-semibold">MOCK DATA</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={completionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {completionData.map((_, i) => (
                    <Cell key={i} fill={completionColors[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Patient Outcomes</CardTitle>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-[10px] font-semibold">PILOT DATA PLACEHOLDER</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outcomesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="metric" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="pre" fill="hsl(var(--muted-foreground))" name="Pre-Intervention" />
                <Bar dataKey="post" fill="hsl(var(--risk-low))" name="Post-Intervention (Projected)" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Pilot Metrics:</strong> 30-day readmissions, pressure injuries, falls, patient satisfaction scores will be tracked during pilot study.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Unit Performance Summary</CardTitle>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-[10px] font-semibold">MOCK DATA</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {performanceMetrics.map((m) => (
              <div key={m.label} className="p-4 rounded-lg bg-muted/50 border border-border/40">
                <h4 className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">{m.label}</h4>
                <p className="text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-sm text-muted-foreground">{m.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
