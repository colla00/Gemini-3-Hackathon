import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const workloadData = [
  { time: '12:00 AM', actual: 3.2, predicted: null },
  { time: '2:00 AM', actual: 2.8, predicted: null },
  { time: '4:00 AM', actual: 2.5, predicted: null },
  { time: '6:00 AM', actual: 4.5, predicted: null },
  { time: '8:00 AM', actual: 7.8, predicted: null },
  { time: '10:00 AM', actual: 8.2, predicted: null },
  { time: '12:00 PM', actual: 7.5, predicted: null },
  { time: '2:00 PM', actual: 7.2, predicted: 7.2 },
  { time: '4:00 PM', actual: null, predicted: 8.5 },
  { time: '6:00 PM', actual: null, predicted: 7.8 },
  { time: '8:00 PM', actual: null, predicted: 6.2 },
  { time: '10:00 PM', actual: null, predicted: 4.5 },
];

const metrics = [
  { value: '7.2', label: 'Current Charts/Hour', trend: '12% from morning peak', direction: 'down' as const, color: 'from-emerald-500 to-emerald-600' },
  { value: '8.5', label: 'Predicted Peak (3:00 PM)', trend: 'Moderate workload expected', direction: 'up' as const, color: 'from-amber-500 to-amber-600' },
  { value: '0.68', label: 'Workload CV Score', trend: 'Stable documentation pattern', direction: 'stable' as const, color: 'from-blue-500 to-blue-600' },
];

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
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">MOCK DATA</Badge>
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
            <AreaChart data={workloadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis label={{ value: 'Charts per Hour', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="actual" stroke="#3b82f6" fill="rgba(59,130,246,0.1)" name="Actual Workload" connectNulls={false} />
              <Area type="monotone" dataKey="predicted" stroke="#f59e0b" fill="rgba(245,158,11,0.1)" strokeDasharray="5 5" name="Predicted Workload" connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Unit-Level Predictions</CardTitle>
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">MOCK DATA</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unitPredictions.map((u) => (
              <div key={u.unit} className={`border-l-4 p-4 rounded-lg ${u.level === 'warning' ? 'border-l-amber-500 bg-amber-50' : 'border-l-blue-500 bg-blue-50'}`}>
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
