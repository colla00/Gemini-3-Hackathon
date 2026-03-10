import { useState, useEffect, useCallback } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock, RefreshCw, TrendingUp, Wifi, WifiOff, BarChart3, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface DeliveryStats {
  total: number;
  delivered: number;
  failed: number;
  pending: number;
  retrying: number;
  successRate: number;
}

interface LatencyStats {
  p50: number;
  p90: number;
  p99: number;
  avg: number;
  checks: number;
}

interface VendorHealth {
  vendorName: string;
  vendorId: string;
  totalRequests: number;
  isActive: boolean;
  environment: string;
  lastUsed: string | null;
}

interface FhirStats {
  total: number;
  validSignatures: number;
  invalidSignatures: number;
  byResourceType: Record<string, number>;
  recentErrors: number;
}

export const IntegrationHealthDashboard = () => {
  const [deliveryStats, setDeliveryStats] = useState<DeliveryStats | null>(null);
  const [latencyStats, setLatencyStats] = useState<LatencyStats | null>(null);
  const [vendors, setVendors] = useState<VendorHealth[]>([]);
  const [fhirStats, setFhirStats] = useState<FhirStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchAll = useCallback(async () => {
    setIsLoading(true);

    const [deliveryRes, slaRes, vendorRes, fhirRes] = await Promise.all([
      supabase.from('webhook_delivery_log').select('status, http_status, attempt_count, delivered_at, created_at'),
      supabase.from('sla_metrics').select('response_time_ms, status, checked_at').order('checked_at', { ascending: false }).limit(500),
      supabase.from('vendor_api_keys').select('vendor_name, vendor_id, total_requests, is_active, environment, last_used_at'),
      supabase.from('fhir_events').select('signature_valid, resource_type, created_at').order('created_at', { ascending: false }).limit(500),
    ]);

    // Delivery stats
    if (deliveryRes.data) {
      const d = deliveryRes.data;
      const delivered = d.filter(r => r.status === 'delivered').length;
      const failed = d.filter(r => r.status === 'failed').length;
      const pending = d.filter(r => r.status === 'pending').length;
      const retrying = d.filter(r => r.status === 'retrying').length;
      setDeliveryStats({
        total: d.length,
        delivered,
        failed,
        pending,
        retrying,
        successRate: d.length > 0 ? (delivered / d.length) * 100 : 0,
      });
    }

    // Latency stats
    if (slaRes.data && slaRes.data.length > 0) {
      const times = slaRes.data
        .map(r => r.response_time_ms)
        .filter((t): t is number => t !== null)
        .sort((a, b) => a - b);

      if (times.length > 0) {
        setLatencyStats({
          p50: times[Math.floor(times.length * 0.5)] || 0,
          p90: times[Math.floor(times.length * 0.9)] || 0,
          p99: times[Math.floor(times.length * 0.99)] || 0,
          avg: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
          checks: times.length,
        });
      } else {
        setLatencyStats(null);
      }
    }

    // Vendor health
    if (vendorRes.data) {
      setVendors(vendorRes.data.map(v => ({
        vendorName: v.vendor_name,
        vendorId: v.vendor_id,
        totalRequests: Number(v.total_requests),
        isActive: v.is_active,
        environment: v.environment,
        lastUsed: v.last_used_at,
      })));
    }

    // FHIR stats
    if (fhirRes.data) {
      const f = fhirRes.data;
      const byType: Record<string, number> = {};
      f.forEach(e => {
        byType[e.resource_type] = (byType[e.resource_type] || 0) + 1;
      });
      const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
      setFhirStats({
        total: f.length,
        validSignatures: f.filter(e => e.signature_valid).length,
        invalidSignatures: f.filter(e => !e.signature_valid).length,
        byResourceType: byType,
        recentErrors: f.filter(e => !e.signature_valid && e.created_at > oneHourAgo).length,
      });
    }

    setIsLoading(false);
    setLastRefreshed(new Date());
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const overallHealth = deliveryStats
    ? deliveryStats.successRate >= 99 ? 'healthy'
    : deliveryStats.successRate >= 95 ? 'degraded'
    : 'critical'
    : 'unknown';

  const healthColor = {
    healthy: 'text-emerald-500',
    degraded: 'text-amber-500',
    critical: 'text-destructive',
    unknown: 'text-muted-foreground',
  };

  const healthBg = {
    healthy: 'bg-emerald-500/10 border-emerald-500/30',
    degraded: 'bg-amber-500/10 border-amber-500/30',
    critical: 'bg-destructive/10 border-destructive/30',
    unknown: 'bg-muted border-border',
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium', healthBg[overallHealth])}>
            {overallHealth === 'healthy' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
             overallHealth === 'degraded' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> :
             overallHealth === 'critical' ? <WifiOff className="w-4 h-4 text-destructive" /> :
             <Activity className="w-4 h-4 text-muted-foreground" />}
            <span className={healthColor[overallHealth]}>
              {overallHealth === 'healthy' ? 'All Systems Operational' :
               overallHealth === 'degraded' ? 'Degraded Performance' :
               overallHealth === 'critical' ? 'Service Disruption' : 'Loading...'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Updated {lastRefreshed.toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm" onClick={fetchAll} disabled={isLoading}>
            <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5', isLoading && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Delivery Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wifi className="w-4 h-4" /> Delivery Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">
              {deliveryStats ? `${deliveryStats.successRate.toFixed(1)}%` : '—'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {deliveryStats ? `${deliveryStats.delivered} / ${deliveryStats.total} webhooks delivered` : 'No data'}
            </p>
            {deliveryStats && (
              <Progress value={deliveryStats.successRate} className="mt-2 h-1.5" />
            )}
          </CardContent>
        </Card>

        {/* Avg Latency */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" /> Avg Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">
              {latencyStats ? `${latencyStats.avg}ms` : '—'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {latencyStats ? `P50: ${latencyStats.p50}ms · P90: ${latencyStats.p90}ms · P99: ${latencyStats.p99}ms` : 'No checks recorded'}
            </p>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">
              {deliveryStats && deliveryStats.total > 0
                ? `${((deliveryStats.failed / deliveryStats.total) * 100).toFixed(1)}%`
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {deliveryStats ? `${deliveryStats.failed} failed · ${deliveryStats.retrying} retrying · ${deliveryStats.pending} pending` : 'No data'}
            </p>
          </CardContent>
        </Card>

        {/* Data Quality */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Signature Validity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">
              {fhirStats && fhirStats.total > 0
                ? `${((fhirStats.validSignatures / fhirStats.total) * 100).toFixed(1)}%`
                : '—'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {fhirStats ? `${fhirStats.validSignatures} valid / ${fhirStats.total} events` : 'No FHIR events'}
            </p>
            {fhirStats && fhirStats.recentErrors > 0 && (
              <Badge variant="destructive" className="mt-2 text-[10px]">
                {fhirStats.recentErrors} invalid in last hour
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Vendors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Active Licensee Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vendors.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No vendor integrations configured yet.</p>
            ) : (
              <div className="space-y-3">
                {vendors.map(v => (
                  <div key={v.vendorId} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{v.vendorName}</span>
                        <Badge variant={v.isActive ? 'default' : 'secondary'} className="text-[10px]">
                          {v.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {v.environment}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {v.totalRequests.toLocaleString()} total requests
                        {v.lastUsed && ` · Last active ${new Date(v.lastUsed).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className={cn('w-2.5 h-2.5 rounded-full', v.isActive ? 'bg-emerald-500' : 'bg-muted-foreground/30')} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* FHIR Resource Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> FHIR Resource Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!fhirStats || Object.keys(fhirStats.byResourceType).length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No FHIR events recorded yet.</p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(fhirStats.byResourceType)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([type, count]) => {
                    const pct = (count / fhirStats.total) * 100;
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">{type}</span>
                          <span className="text-muted-foreground tabular-nums">{count} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Webhook Delivery Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" /> Webhook Delivery Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!deliveryStats || deliveryStats.total === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No webhook deliveries recorded. Send a test webhook from the Webhook Testing console.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Delivered', value: deliveryStats.delivered, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                  { label: 'Pending', value: deliveryStats.pending, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  { label: 'Retrying', value: deliveryStats.retrying, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { label: 'Failed', value: deliveryStats.failed, color: 'text-destructive', bg: 'bg-destructive/10' },
                ].map(s => (
                  <div key={s.label} className={cn('rounded-lg p-4 text-center', s.bg)}>
                    <div className={cn('text-2xl font-bold tabular-nums', s.color)}>{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
