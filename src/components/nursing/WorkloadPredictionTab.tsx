import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const MetricCard = ({ value, label, trend, color }: { value: string; label: string; trend: string; color: string }) => (
  <div className={`relative overflow-hidden rounded-xl p-6 text-white ${color}`}>
    <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-white/10 rounded-full" />
    <p className="text-4xl font-bold mb-2 relative">{value}</p>
    <p className="text-sm opacity-90 relative">{label}</p>
    <p className="text-xs opacity-80 mt-2 relative">{trend}</p>
  </div>
);

export const WorkloadPredictionTab = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Real-Time Workload Forecast</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Next 4 hours prediction based on documentation patterns</p>
        </div>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold">MOCK DATA</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard value="7.2" label="Current Charts/Hour" trend="↓ 12% from morning peak" color="bg-gradient-to-br from-emerald-500 to-emerald-700" />
          <MetricCard value="8.5" label="Predicted Peak (3:00 PM)" trend="↑ Moderate workload expected" color="bg-gradient-to-br from-amber-500 to-amber-700" />
          <MetricCard value="0.68" label="Workload CV Score" trend="→ Stable documentation pattern" color="bg-gradient-to-br from-blue-500 to-blue-700" />
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={workloadData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: 'Charts per Hour', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" name="Actual Workload" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="predicted" name="Predicted Workload" stroke="hsl(var(--warning))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Unit-Level Predictions</CardTitle>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold">MOCK DATA</Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-l-4 border-warning p-4 bg-warning/5 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm">Medical-Surgical Unit A</span>
            <span className="text-xs text-muted-foreground">Updated 2 min ago</span>
          </div>
          <p className="text-sm text-muted-foreground">Moderate workload expected (8.2 charts/hour). Consider staffing adjustment for 2:00-4:00 PM window.</p>
        </div>
        <div className="border-l-4 border-primary p-4 bg-primary/5 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm">Medical-Surgical Unit B</span>
            <span className="text-xs text-muted-foreground">Updated 2 min ago</span>
          </div>
          <p className="text-sm text-muted-foreground">Normal workload predicted (6.5 charts/hour). Current staffing adequate.</p>
        </div>
      </CardContent>
    </Card>
  </div>
);
