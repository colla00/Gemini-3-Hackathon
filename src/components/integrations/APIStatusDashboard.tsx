import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Endpoint {
  name: string;
  path: string;
  description: string;
  status: 'operational' | 'degraded' | 'outage';
  latency: number | null;
  lastChecked: string | null;
}

const defaultEndpoints: Endpoint[] = [
  { name: 'FHIR R4 Gateway', path: '/fhir/r4', description: 'Patient, Observation, Encounter resources', status: 'operational', latency: null, lastChecked: null },
  { name: 'Risk Assessment API', path: '/api/assess-risk', description: 'VitaSignal IDI inference endpoint', status: 'operational', latency: null, lastChecked: null },
  { name: 'Webhook Receiver', path: '/fhir-webhook', description: 'Inbound EHR event processing', status: 'operational', latency: null, lastChecked: null },
  { name: 'SMART Launch', path: '/smart-launch', description: 'OAuth 2.0 authorization endpoint', status: 'operational', latency: null, lastChecked: null },
  { name: 'CDS Hooks Service', path: '/cds-services', description: 'Clinical decision support hooks', status: 'operational', latency: null, lastChecked: null },
];

export const APIStatusDashboard = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(defaultEndpoints);
  const [loading, setLoading] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'outage'>('operational');
  const [uptime, setUptime] = useState('99.97%');

  useEffect(() => {
    loadStatusFromDB();
  }, []);

  const loadStatusFromDB = async () => {
    setLoading(true);
    try {
      const { data: metrics, error } = await supabase
        .from('sla_metrics')
        .select('*')
        .order('checked_at', { ascending: false })
        .limit(50);

      if (!error && metrics && metrics.length > 0) {
        // Group by endpoint and get latest status
        const latestByEndpoint = new Map<string, typeof metrics[0]>();
        metrics.forEach(m => {
          if (!latestByEndpoint.has(m.endpoint)) {
            latestByEndpoint.set(m.endpoint, m);
          }
        });

        setEndpoints(prev => prev.map(ep => {
          const metric = latestByEndpoint.get(ep.path);
          if (metric) {
            return {
              ...ep,
              status: metric.status === 'up' ? 'operational' : metric.status === 'degraded' ? 'degraded' : 'outage',
              latency: metric.response_time_ms,
              lastChecked: metric.checked_at,
            };
          }
          return ep;
        }));

        // Calculate overall status
        const statuses = Array.from(latestByEndpoint.values()).map(m => m.status);
        if (statuses.some(s => s === 'down')) {
          setOverallStatus('outage');
        } else if (statuses.some(s => s === 'degraded')) {
          setOverallStatus('degraded');
        } else {
          setOverallStatus('operational');
        }

        // Calculate uptime from last 24h
        const recentMetrics = metrics.filter(m => 
          new Date(m.checked_at).getTime() > Date.now() - 24 * 60 * 60 * 1000
        );
        const upCount = recentMetrics.filter(m => m.status === 'up').length;
        const totalCount = recentMetrics.length || 1;
        setUptime(`${((upCount / totalCount) * 100).toFixed(2)}%`);
      }
    } catch (err) {
      console.error('Failed to load status:', err);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: Endpoint['status']) => {
    switch (status) {
      case 'operational': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'outage': return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: Endpoint['status']) => {
    switch (status) {
      case 'operational': return <Badge className="bg-green-500/10 text-green-600 border-green-500/30">Operational</Badge>;
      case 'degraded': return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Degraded</Badge>;
      case 'outage': return <Badge variant="destructive">Outage</Badge>;
    }
  };

  const formatLatency = (ms: number | null) => {
    if (ms === null) return '—';
    if (ms < 100) return <span className="text-green-500">{ms}ms</span>;
    if (ms < 500) return <span className="text-yellow-500">{ms}ms</span>;
    return <span className="text-destructive">{ms}ms</span>;
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return 'Never';
    const date = new Date(iso);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              overallStatus === 'operational' ? "bg-green-500/10" : 
              overallStatus === 'degraded' ? "bg-yellow-500/10" : "bg-destructive/10"
            )}>
              <Activity className={cn(
                "w-5 h-5",
                overallStatus === 'operational' ? "text-green-500" :
                overallStatus === 'degraded' ? "text-yellow-500" : "text-destructive"
              )} />
            </div>
            <div>
              <CardTitle className="text-lg">API Status</CardTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  overallStatus === 'operational' ? "bg-green-500" :
                  overallStatus === 'degraded' ? "bg-yellow-500" : "bg-destructive"
                )} />
                All Systems {overallStatus === 'operational' ? 'Operational' : overallStatus === 'degraded' ? 'Degraded' : 'Experiencing Issues'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{uptime}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">24h Uptime</p>
            </div>
            <Button variant="outline" size="sm" onClick={loadStatusFromDB} disabled={loading}>
              <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {endpoints.map((ep) => (
            <div
              key={ep.path}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(ep.status)}
                <div>
                  <p className="text-sm font-medium text-foreground">{ep.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{ep.path}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Zap className="w-3 h-3" />
                    {formatLatency(ep.latency)}
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatTime(ep.lastChecked)}
                  </div>
                </div>
                {getStatusBadge(ep.status)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Status updated automatically.</strong> For real-time incident notifications,
            subscribe to our status page or contact <span className="font-mono text-primary">integrations@vitasignal.ai</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
