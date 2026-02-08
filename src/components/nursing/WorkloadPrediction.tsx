import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const workloadData = [
  { time: '12 AM', actual: 3.2, predicted: null },
  { time: '2 AM', actual: 2.8, predicted: null },
  { time: '4 AM', actual: 2.5, predicted: null },
  { time: '6 AM', actual: 4.5, predicted: null },
  { time: '8 AM', actual: 7.8, predicted: null },
  { time: '10 AM', actual: 8.2, predicted: null },
  { time: '12 PM', actual: 7.5, predicted: null },
  { time: '2 PM', actual: 7.2, predicted: 7.2 },
  { time: '4 PM', actual: null, predicted: 8.5 },
  { time: '6 PM', actual: null, predicted: 7.8 },
  { time: '8 PM', actual: null, predicted: 6.2 },
  { time: '10 PM', actual: null, predicted: 4.5 },
];

const metrics = [
  { value: '7.2', label: 'Current Charts/Hour', trend: '\u2193 12% from morning peak', variant: 'success' as const },
  { value: '8.5', label: 'Predicted Peak (3:00 PM)', trend: '\u2191 Moderate workload expected', variant: 'warning' as const },
  { value: '0.68', label: 'Workload CV Score', trend: '\u2192 Stable documentation pattern', variant: 'info' as const },
];

const variantStyles = {
  success: 'bg-gradient-to-br from-[hsl(var(--risk-low))] to-[hsl(var(--risk-low)/0.8)] text-primary-foreground',
  warning: 'bg-gradient-to-br from-[hsl(var(--warning))] to-[hsl(var(--warning)/0.8)] text-primary-foreground',
  info: 'bg-gradient-to-br from-primary to-accent text-primary-foreground',
};

const unitPredictions = [
  { unit: 'Medical-Surgical Unit A', time: 'Updated 2 min ago', message: 'Moderate workload expected (8.2 charts/hour). Consider staffing adjustment for 2:00-4:00 PM window.', level: 'warning' as const },
  { unit: 'Medical-Surgical Unit B', time: 'Updated 2 min ago', message: 'Normal workload predicted (6.5 charts/hour). Current staffing adequate.', level: 'info' as const },
];

export const WorkloadPrediction = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Real-Time Workload Forecast</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Next 4 hours prediction based on documentation patterns</p>
          </div>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-[10px] font-semibold">MOCK DATA</Badge>
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
            <AreaChart data={workloadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis label={{ value: 'Charts per Hour', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="actual" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" name="Actual Workload" connectNulls={false} />
              <Area type="monotone" dataKey="predicted" stroke="hsl(var(--warning))" fill="hsl(var(--warning) / 0.1)" strokeDasharray="5 5" name="Predicted Workload" connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Unit-Level Predictions</CardTitle>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-[10px] font-semibold">MOCK DATA</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unitPredictions.map((u) => (
              <div key={u.unit} className={`border-l-4 p-4 rounded-lg ${u.level === 'warning' ? 'border-l-warning bg-warning/10' : 'border-l-primary bg-primary/10'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">{u.unit}</span>
                  <span className="text-xs text-muted-foreground">{u.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{u.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
