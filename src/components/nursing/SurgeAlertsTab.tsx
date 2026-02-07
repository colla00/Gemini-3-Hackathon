import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const alertHistoryData = [
  { time: '12 AM', critical: 1, warning: 2, info: 3 },
  { time: '4 AM', critical: 0, warning: 1, info: 2 },
  { time: '8 AM', critical: 3, warning: 5, info: 4 },
  { time: '12 PM', critical: 2, warning: 4, info: 5 },
  { time: '4 PM', critical: 1, warning: 3, info: 4 },
  { time: '8 PM', critical: 0, warning: 2, info: 3 },
];

const AlertCard = ({ title, time, message, variant }: { title: string; time: string; message: string; variant: 'critical' | 'warning' | 'info' }) => {
  const styles = {
    critical: 'border-l-4 border-destructive bg-destructive/5',
    warning: 'border-l-4 border-warning bg-warning/5',
    info: 'border-l-4 border-primary bg-primary/5',
  };
  return (
    <div className={`${styles[variant]} p-4 rounded-lg mb-3`}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export const SurgeAlertsTab = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Surge Alerts</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Real-time notifications for workload spikes</p>
        </div>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold">MOCK DATA</Badge>
      </CardHeader>
      <CardContent>
        <AlertCard variant="critical" title="High Documentation Volume Detected" time="5 minutes ago" message="<strong>3 high-priority patients</strong> require immediate documentation. Predicted surge in next 30 minutes. Workload score: 9.8/10." />
        <AlertCard variant="warning" title="Admission Cluster Predicted" time="15 minutes ago" message="Model predicts <strong>4 new admissions</strong> in next 2 hours based on historical patterns. Consider proactive task batching." />
        <AlertCard variant="info" title="Shift Change Optimization" time="30 minutes ago" message="Evening shift handoff at 7:00 PM. <strong>12 pending tasks</strong> identified for batching before transition." />
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Alert History (Last 24 Hours)</CardTitle>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold">MOCK DATA</Badge>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={alertHistoryData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: 'Number of Alerts', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="critical" name="Critical" stackId="a" fill="hsl(var(--destructive))" />
              <Bar dataKey="warning" name="Warning" stackId="a" fill="hsl(var(--warning))" />
              <Bar dataKey="info" name="Info" stackId="a" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </div>
);
