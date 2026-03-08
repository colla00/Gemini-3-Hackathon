import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const generateHeatmapData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    '06:00': Math.floor(35 + Math.random() * 15),
    '12:00': Math.floor(65 + Math.random() * 25),
    '18:00': Math.floor(52 + Math.random() * 20),
    '00:00': Math.floor(18 + Math.random() * 15),
  }));
};

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
  { metric: 'Pt Satisfaction', pre: 82, post: 89 },
];

export const WorkflowAnalytics = () => {
  const [heatmapData, setHeatmapData] = useState(generateHeatmapData);
  const [completionData, setCompletionData] = useState([
    { name: 'On Time', value: 72 },
    { name: 'Early', value: 15 },
    { name: 'Delayed (<15m)', value: 10 },
    { name: 'Delayed (>15m)', value: 3 },
  ]);
  const [efficiency, setEfficiency] = useState(87);
  const [docQuality, setDocQuality] = useState(92);
  const [timeSaved, setTimeSaved] = useState(23);

  // Live ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setEfficiency(prev => Math.max(75, Math.min(99, prev + Math.floor((Math.random() - 0.48) * 2))));
      setDocQuality(prev => Math.max(80, Math.min(99, prev + Math.floor((Math.random() - 0.48) * 1))));
      setTimeSaved(prev => Math.max(15, Math.min(35, prev + Math.floor((Math.random() - 0.48) * 2))));
      setCompletionData(prev => {
        const onTime = Math.max(60, Math.min(85, prev[0].value + Math.floor((Math.random() - 0.48) * 2)));
        return [
          { name: 'On Time', value: onTime },
          { name: 'Early', value: Math.max(8, 100 - onTime - 13) },
          { name: 'Delayed (<15m)', value: Math.max(3, Math.min(15, 10 + Math.floor((Math.random() - 0.5) * 2))) },
          { name: 'Delayed (>15m)', value: Math.max(1, Math.min(8, 3 + Math.floor((Math.random() - 0.5) * 1))) },
        ];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setHeatmapData(generateHeatmapData()), 12000);
    return () => clearInterval(interval);
  }, []);

  const performanceMetrics = [
    { label: 'Efficiency Metrics', value: `${efficiency}%`, detail: 'On-time task completion' },
    { label: 'Documentation Quality', value: `${docQuality}%`, detail: 'Complete charting rate' },
    { label: 'Workflow Optimization', value: `${timeSaved} min`, detail: 'Avg. time saved per shift' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Documentation Heatmap</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Nursing chart entry patterns by hour and day of week</p>
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
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={heatmapData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis label={{ value: 'Chart Entries', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="06:00" fill="hsl(var(--primary) / 0.3)" name="06:00" />
              <Bar dataKey="12:00" fill="hsl(var(--primary) / 0.6)" name="12:00" />
              <Bar dataKey="18:00" fill="hsl(var(--primary))" name="18:00" />
              <Bar dataKey="00:00" fill="hsl(var(--accent))" name="00:00" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Task Completion Times</CardTitle>
            <span className="text-[10px] text-muted-foreground tabular-nums">Real-time</span>
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
            <Badge variant="outline" className="text-[10px]">Pre/Post Comparison</Badge>
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
                <Bar dataKey="post" fill="hsl(var(--risk-low))" name="Post-Intervention" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Unit Performance Summary</CardTitle>
          <span className="text-[10px] text-muted-foreground tabular-nums">Updating</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {performanceMetrics.map((m) => (
              <div key={m.label} className="p-4 rounded-lg bg-muted/50 border border-border/40">
                <h4 className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">{m.label}</h4>
                <p className="text-2xl font-bold text-foreground tabular-nums">{m.value}</p>
                <p className="text-sm text-muted-foreground">{m.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
