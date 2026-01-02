import { useState, useEffect } from 'react';
import { Activity, Cpu, Database, Wifi, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricData {
  label: string;
  value: string;
  icon: React.ReactNode;
  status: 'good' | 'warning' | 'critical';
}

export const LiveMetricsBar = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics: MetricData[] = [
        {
          label: 'System Health',
          value: `${97 + Math.floor(Math.random() * 3)}%`,
          icon: <Activity className="w-3.5 h-3.5" />,
          status: 'good',
        },
        {
          label: 'Model Latency',
          value: `${42 + Math.floor(Math.random() * 15)}ms`,
          icon: <Cpu className="w-3.5 h-3.5" />,
          status: 'good',
        },
        {
          label: 'Data Pipeline',
          value: 'Active',
          icon: <Database className="w-3.5 h-3.5" />,
          status: 'good',
        },
        {
          label: 'EHR Sync',
          value: 'Connected',
          icon: <Wifi className="w-3.5 h-3.5" />,
          status: 'good',
        },
      ];
      setMetrics(newMetrics);
      setLastUpdate(new Date());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    good: 'text-risk-low',
    warning: 'text-risk-medium',
    critical: 'text-risk-high',
  };

  const statusBg = {
    good: 'bg-risk-low/10',
    warning: 'bg-risk-medium/10',
    critical: 'bg-risk-high/10',
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-card/50 border border-border/30 mb-4">
      <div className="flex items-center gap-4 flex-wrap">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-md",
              statusBg[metric.status]
            )}>
              <span className={statusColors[metric.status]}>
                {metric.icon}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {metric.label}
              </span>
              <span className={cn(
                "text-xs font-semibold",
                statusColors[metric.status]
              )}>
                {metric.value}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>Updated {lastUpdate.toLocaleTimeString()}</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low"></span>
        </span>
      </div>
    </div>
  );
};
