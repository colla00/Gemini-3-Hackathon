import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const baseAlerts = [
  {
    title: 'High Documentation Volume Detected',
    message: '3 high-priority patients require immediate documentation. Predicted surge in next 30 minutes. Workload score: 9.8/10.',
    level: 'critical' as const,
    ageSec: 300,
  },
  {
    title: 'Admission Cluster Predicted',
    message: 'Model predicts 4 new admissions in next 2 hours based on historical patterns. Consider proactive task batching.',
    level: 'warning' as const,
    ageSec: 900,
  },
  {
    title: 'Shift Change Optimization',
    message: 'Evening shift handoff approaching. 12 pending tasks identified for batching before transition.',
    level: 'info' as const,
    ageSec: 1800,
  },
];

const newAlertTemplates = [
  { title: 'SpO₂ Desaturation Cluster — Unit 4N', message: '2 patients with SpO₂ < 92% in last 15 min. Respiratory surge protocol triggered.', level: 'critical' as const },
  { title: 'Lab Result Batch Incoming', message: '8 CBC/BMP results expected in next 20 min. Prioritize high-risk reviews.', level: 'warning' as const },
  { title: 'Bed Alarm Frequency ↑ Rm 402A', message: 'Patient G07 — 4 bed alarms in 30 min. Sitter effectiveness review recommended.', level: 'critical' as const },
  { title: 'Medication Administration Window', message: '5 scheduled meds due in next 15 min across 3 patients. Batching suggested.', level: 'warning' as const },
];

const generateHistoryData = () => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const h = new Date(now.getTime() - (5 - i) * 4 * 3600000);
    return {
      time: h.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      critical: Math.floor(Math.random() * 3),
      warning: 1 + Math.floor(Math.random() * 4),
      info: 2 + Math.floor(Math.random() * 3),
    };
  });
};

const levelStyles = {
  critical: 'border-l-destructive bg-destructive/10',
  warning: 'border-l-warning bg-warning/10',
  info: 'border-l-primary bg-primary/10',
};

const formatAge = (sec: number) => {
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  return `${Math.floor(sec / 3600)}h ago`;
};

export const SurgeAlerts = () => {
  const [alerts, setAlerts] = useState(baseAlerts);
  const [historyData, setHistoryData] = useState(generateHistoryData);

  // Age alerts and occasionally add new ones
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => {
        let updated = prev.map(a => ({ ...a, ageSec: a.ageSec + 5 }));
        // Occasionally add a new alert
        if (Math.random() > 0.85) {
          const template = newAlertTemplates[Math.floor(Math.random() * newAlertTemplates.length)];
          updated = [{ ...template, ageSec: 0 }, ...updated].slice(0, 6);
        }
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Refresh history data periodically
  useEffect(() => {
    const interval = setInterval(() => setHistoryData(generateHistoryData()), 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Surge Alerts</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Real-time notifications for workload spikes</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-risk-low/10 border border-risk-low/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
            </span>
            <span className="text-[10px] font-semibold text-risk-low">LIVE</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((a, i) => (
            <div key={`${a.title}-${i}`} className={cn('border-l-4 p-4 rounded-lg transition-all', levelStyles[a.level], a.ageSec < 10 && 'animate-fade-in')}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">{a.title}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{formatAge(a.ageSec)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{a.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Alert History (Last 24 Hours)</CardTitle>
          <span className="text-[10px] text-muted-foreground tabular-nums">Auto-refreshing</span>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis label={{ value: 'Number of Alerts', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="critical" stackId="a" fill="hsl(var(--destructive))" name="Critical Alerts" />
              <Bar dataKey="warning" stackId="a" fill="hsl(var(--warning))" name="Warning Alerts" />
              <Bar dataKey="info" stackId="a" fill="hsl(var(--primary))" name="Info Alerts" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
