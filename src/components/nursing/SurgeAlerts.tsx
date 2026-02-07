import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const alerts = [
  {
    title: 'High Documentation Volume Detected',
    time: '5 minutes ago',
    message: '3 high-priority patients require immediate documentation. Predicted surge in next 30 minutes. Workload score: 9.8/10.',
    level: 'critical' as const,
  },
  {
    title: 'Admission Cluster Predicted',
    time: '15 minutes ago',
    message: 'Model predicts 4 new admissions in next 2 hours based on historical patterns. Consider proactive task batching.',
    level: 'warning' as const,
  },
  {
    title: 'Shift Change Optimization',
    time: '30 minutes ago',
    message: 'Evening shift handoff at 7:00 PM. 12 pending tasks identified for batching before transition.',
    level: 'info' as const,
  },
];

const alertHistoryData = [
  { time: '12 AM', critical: 1, warning: 2, info: 3 },
  { time: '4 AM', critical: 0, warning: 1, info: 2 },
  { time: '8 AM', critical: 3, warning: 5, info: 4 },
  { time: '12 PM', critical: 2, warning: 4, info: 5 },
  { time: '4 PM', critical: 1, warning: 3, info: 4 },
  { time: '8 PM', critical: 0, warning: 2, info: 3 },
];

const levelStyles = {
  critical: 'border-l-red-500 bg-red-50',
  warning: 'border-l-amber-500 bg-amber-50',
  info: 'border-l-blue-500 bg-blue-50',
};

export const SurgeAlerts = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Surge Alerts</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Real-time notifications for workload spikes</p>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">MOCK DATA</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((a) => (
            <div key={a.title} className={`border-l-4 p-4 rounded-lg ${levelStyles[a.level]}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">{a.title}</span>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{a.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Alert History (Last 24 Hours)</CardTitle>
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">MOCK DATA</Badge>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alertHistoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis label={{ value: 'Number of Alerts', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical Alerts" />
              <Bar dataKey="warning" stackId="a" fill="#f59e0b" name="Warning Alerts" />
              <Bar dataKey="info" stackId="a" fill="#3b82f6" name="Info Alerts" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
