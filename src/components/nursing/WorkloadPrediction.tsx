import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const generateWorkloadData = () => {
  const now = new Date();
  const currentHour = now.getHours();
  return Array.from({ length: 12 }, (_, i) => {
    const hour = (currentHour - 11 + i + 24) % 24;
    const label = `${hour.toString().padStart(2, '0')}:00`;
    const isFuture = i > 8;
    const base = 3 + Math.sin((hour - 6) / 3.8) * 3.5 + (hour >= 7 && hour <= 18 ? 2 : 0);
    return {
      time: label,
      actual: isFuture ? null : parseFloat((base + (Math.random() - 0.5) * 1.2).toFixed(1)),
      predicted: i >= 7 ? parseFloat((base + (Math.random() - 0.5) * 0.8).toFixed(1)) : null,
    };
  });
};

const variantStyles = {
  success: 'bg-gradient-to-br from-[hsl(var(--risk-low))] to-[hsl(var(--risk-low)/0.8)] text-primary-foreground',
  warning: 'bg-gradient-to-br from-[hsl(var(--warning))] to-[hsl(var(--warning)/0.8)] text-primary-foreground',
  info: 'bg-gradient-to-br from-primary to-accent text-primary-foreground',
};

const unitNames = ['Medical-Surgical 4N', 'Medical-Surgical 4S', 'ICU-A', 'Step-Down 3W'];

export const WorkloadPrediction = () => {
  const [workloadData, setWorkloadData] = useState(generateWorkloadData);
  const [currentRate, setCurrentRate] = useState(7.2);
  const [peakPredicted, setPeakPredicted] = useState(8.5);
  const [cvScore, setCvScore] = useState(0.68);
  const [unitStatuses, setUnitStatuses] = useState(() =>
    unitNames.map((unit, i) => ({
      unit,
      rate: parseFloat((5 + Math.random() * 4).toFixed(1)),
      level: i === 0 || i === 2 ? 'warning' as const : 'info' as const,
      updatedSec: Math.floor(Math.random() * 120),
    }))
  );

  // Simulate live ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRate(prev => parseFloat((prev + (Math.random() - 0.48) * 0.3).toFixed(1)));
      setPeakPredicted(prev => parseFloat(Math.max(6, prev + (Math.random() - 0.48) * 0.2).toFixed(1)));
      setCvScore(prev => parseFloat(Math.max(0.3, Math.min(0.95, prev + (Math.random() - 0.5) * 0.02)).toFixed(2)));
      setUnitStatuses(prev => prev.map(u => ({
        ...u,
        rate: parseFloat(Math.max(2, u.rate + (Math.random() - 0.48) * 0.2).toFixed(1)),
        updatedSec: Math.floor(Math.random() * 30),
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Refresh chart data less frequently
  useEffect(() => {
    const interval = setInterval(() => setWorkloadData(generateWorkloadData()), 12000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { value: currentRate.toString(), label: 'Current Charts/Hour', trend: `${currentRate > 7 ? '↑' : '↓'} from shift average`, variant: 'success' as const },
    { value: peakPredicted.toString(), label: 'Predicted Peak', trend: '↑ Next 2 hours', variant: 'warning' as const },
    { value: cvScore.toString(), label: 'Workload CV Score', trend: cvScore < 0.6 ? '→ Stable pattern' : '⚠ Variable', variant: 'info' as const },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Real-Time Workload Forecast</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Next 4 hours prediction based on documentation patterns</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {metrics.map((m) => (
              <div key={m.label} className={`${variantStyles[m.variant]} p-6 rounded-xl`}>
                <div className="text-3xl font-bold tabular-nums">{m.value}</div>
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
          <span className="text-[10px] text-muted-foreground tabular-nums">Auto-refreshing</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unitStatuses.map((u) => (
              <div key={u.unit} className={`border-l-4 p-4 rounded-lg ${u.level === 'warning' ? 'border-l-warning bg-warning/10' : 'border-l-primary bg-primary/10'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">{u.unit}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">Updated {u.updatedSec}s ago</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {u.level === 'warning'
                    ? `Elevated workload (${u.rate} charts/hour). Consider staffing adjustment.`
                    : `Normal workload (${u.rate} charts/hour). Current staffing adequate.`}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
