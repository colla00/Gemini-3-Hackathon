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

const completionColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

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
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">MOCK DATA</Badge>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={heatmapData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Day of Week', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Number of Chart Entries', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="6 AM" fill="#dbeafe" />
              <Bar dataKey="12 PM" fill="#93c5fd" />
              <Bar dataKey="6 PM" fill="#3b82f6" />
              <Bar dataKey="12 AM" fill="#1e40af" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Task Completion Times</CardTitle>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">MOCK DATA</Badge>
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Patient Outcomes</CardTitle>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">PILOT DATA PLACEHOLDER</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outcomesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <YAxis label={{ value: 'Rate / Score', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="pre" fill="#94a3b8" name="Pre-Intervention" />
                <Bar dataKey="post" fill="#10b981" name="Post-Intervention (Projected)" />
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
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">MOCK DATA</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {performanceMetrics.map((m) => (
              <div key={m.label}>
                <h4 className="text-sm text-muted-foreground mb-2">{m.label}</h4>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-sm text-muted-foreground">{m.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
