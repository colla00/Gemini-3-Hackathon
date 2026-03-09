import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Clock, Zap, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface SLAMetric {
  id: string;
  vendor_id: string | null;
  endpoint: string;
  status: string;
  response_time_ms: number | null;
  http_status: number | null;
  error_message: string | null;
  checked_at: string;
}

interface DeliveryStats {
  pending: number;
  delivered: number;
  failed: number;
  dead_letter: number;
}

export function SLAMonitoringDashboard() {
  const [metrics, setMetrics] = useState<SLAMetric[]>([]);
  const [deliveryStats, setDeliveryStats] = useState<DeliveryStats>({ pending: 0, delivered: 0, failed: 0, dead_letter: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Fetch recent SLA metrics
    const { data: slaData } = await supabase
      .from("sla_metrics")
      .select("*")
      .order("checked_at", { ascending: false })
      .limit(50);

    if (slaData) setMetrics(slaData as unknown as SLAMetric[]);

    // Fetch delivery stats
    const { data: deliveries } = await supabase
      .from("webhook_delivery_log")
      .select("status");

    if (deliveries) {
      const stats = { pending: 0, delivered: 0, failed: 0, dead_letter: 0 };
      deliveries.forEach((d: { status: string }) => {
        if (d.status in stats) stats[d.status as keyof DeliveryStats]++;
      });
      setDeliveryStats(stats);
    }

    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Calculate aggregates
  const uptimePercent = metrics.length > 0
    ? ((metrics.filter(m => m.status === "up").length / metrics.length) * 100).toFixed(1)
    : "—";
  
  const avgLatency = metrics.length > 0
    ? Math.round(metrics.filter(m => m.response_time_ms).reduce((sum, m) => sum + (m.response_time_ms || 0), 0) / Math.max(metrics.filter(m => m.response_time_ms).length, 1))
    : 0;

  const totalDeliveries = Object.values(deliveryStats).reduce((a, b) => a + b, 0);
  const deliveryRate = totalDeliveries > 0
    ? ((deliveryStats.delivered / totalDeliveries) * 100).toFixed(1)
    : "—";

  const statusIcon = (status: string) => {
    switch (status) {
      case "up": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "down": return <XCircle className="w-4 h-4 text-destructive" />;
      case "degraded": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle>SLA Monitoring & Webhook Delivery</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        <CardDescription>Real-time uptime, latency, and webhook delivery tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-xs font-medium text-green-800 dark:text-green-200">Uptime</p>
            </div>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{uptimePercent}%</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-medium text-blue-800 dark:text-blue-200">Avg Latency</p>
            </div>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{avgLatency}ms</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <p className="text-xs font-medium text-foreground">Delivery Rate</p>
            </div>
            <p className="text-2xl font-bold text-primary">{deliveryRate}%</p>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <p className="text-xs font-medium text-amber-800 dark:text-amber-200">Dead Letters</p>
            </div>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{deliveryStats.dead_letter}</p>
          </div>
        </div>

        {/* Delivery Pipeline */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Webhook Delivery Pipeline</p>
          <div className="grid grid-cols-4 gap-2">
            {([
              { label: "Pending", count: deliveryStats.pending, color: "bg-blue-500" },
              { label: "Delivered", count: deliveryStats.delivered, color: "bg-green-500" },
              { label: "Failed", count: deliveryStats.failed, color: "bg-amber-500" },
              { label: "Dead Letter", count: deliveryStats.dead_letter, color: "bg-red-500" },
            ] as const).map(s => (
              <div key={s.label} className="text-center p-3 rounded-lg bg-secondary/50">
                <div className={`w-3 h-3 rounded-full ${s.color} mx-auto mb-1`} />
                <p className="text-lg font-bold text-foreground">{s.count}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Checks */}
        {metrics.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Recent Health Checks</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {metrics.slice(0, 15).map(m => (
                <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30 text-sm">
                  {statusIcon(m.status)}
                  <span className="font-mono text-xs flex-1 truncate">{m.endpoint}</span>
                  {m.vendor_id && <Badge variant="outline" className="text-[9px]">{m.vendor_id}</Badge>}
                  {m.response_time_ms && (
                    <span className="text-xs text-muted-foreground">{m.response_time_ms}ms</span>
                  )}
                  <Badge variant={m.status === "up" ? "default" : m.status === "degraded" ? "secondary" : "destructive"} className="text-[9px]">
                    {m.status}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(m.checked_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {metrics.length === 0 && !loading && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No health checks recorded yet. SLA monitoring will populate as webhook traffic flows.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
