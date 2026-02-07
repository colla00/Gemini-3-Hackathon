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
const completionColors = ['hsl(var(--chart-2))', 'hsl(var(--primary))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

const outcomesData = [
  { metric: 'Readmissions', pre: 12.5, post: 9.8 },
  { metric: 'Falls', pre: 3.2, post: 2.1 },
  { metric: 'Pressure Injuries', pre: 2.8, post: 1.5 },
  { metric: 'Satisfaction', pre: 82, post: 89 },
];

export const WorkflowAnalyticsTab = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documentation Heatmap</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Nursing chart entry patterns by hour and day of week</p>
        </div>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold">MOCK DATA</Badge>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={heatmapData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: 'Chart Entries', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="6 AM" fill="hsl(var(--primary) / 0.3)" />
              <Bar dataKey="12 PM" fill="hsl(var(--primary) / 0.6)" />
              <Bar dataKey="6 PM" fill="hsl(var(--primary))" />
              <Bar dataKey="12 AM" fill="hsl(var(--primary) / 0.9)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Task Completion Times</CardTitle>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold">MOCK DATA</Badge>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={completionData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {completionData.map((_, i) => <Cell key={i} fill={completionColors[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Patient Outcomes</CardTitle>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold">PILOT DATA PLACEHOLDER</Badge>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="pre" name="Pre-Intervention" fill="hsl(var(--muted-foreground))" />
                <Bar dataKey="post" name="Post-Intervention (Projected)" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            <strong>Pilot Metrics:</strong> 30-day readmissions, pressure injuries, falls, patient satisfaction scores will be tracked during pilot study.
          </p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Unit Performance Summary</CardTitle>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold">MOCK DATA</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Efficiency Metrics</p>
            <p className="text-3xl font-bold text-foreground">87%</p>
            <p className="text-sm text-muted-foreground">On-time task completion</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Documentation Quality</p>
            <p className="text-3xl font-bold text-foreground">92%</p>
            <p className="text-sm text-muted-foreground">Complete charting rate</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Workflow Optimization</p>
            <p className="text-3xl font-bold text-foreground">23 min</p>
            <p className="text-sm text-muted-foreground">Avg. time saved per shift</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
