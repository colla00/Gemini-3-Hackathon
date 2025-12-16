import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ShieldAlert, RefreshCw, Clock, Globe, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface ViolationStats {
  total_violations: number;
  unique_keys: number;
  unique_ips: number;
  by_endpoint: Record<string, number> | null;
  top_offenders: Array<{ ip_address: string; total_violations: number }> | null;
}

interface ViolationRecord {
  id: string;
  key: string;
  ip_address: string | null;
  endpoint: string;
  violation_count: number;
  first_violation_at: string;
  last_violation_at: string;
}

export const RateLimitMonitoringPanel = () => {
  const [stats, setStats] = useState<ViolationStats | null>(null);
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24');

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch stats using RPC
      const { data: statsData, error: statsError } = await supabase.rpc('get_rate_limit_stats', {
        p_hours: parseInt(timeRange)
      });

      if (statsError) {
        console.error('Error fetching stats:', statsError);
        toast.error('Failed to load rate limit stats');
      } else {
        setStats(statsData as unknown as ViolationStats);
      }

      // Fetch recent violations
      const { data: violationsData, error: violationsError } = await supabase
        .from('rate_limit_violations')
        .select('*')
        .order('last_violation_at', { ascending: false })
        .limit(50);

      if (violationsError) {
        console.error('Error fetching violations:', violationsError);
      } else {
        setViolations(violationsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load monitoring data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const getEndpointColor = (endpoint: string) => {
    switch (endpoint) {
      case 'methodology-chat':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'text-to-speech':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'send-walkthrough-notification':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getSeverityBadge = (count: number) => {
    if (count >= 10) {
      return <Badge variant="destructive">High</Badge>;
    } else if (count >= 5) {
      return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">Medium</Badge>;
    }
    return <Badge variant="secondary">Low</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <CardTitle>Rate Limit Monitoring</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last hour</SelectItem>
                <SelectItem value="6">Last 6 hours</SelectItem>
                <SelectItem value="24">Last 24 hours</SelectItem>
                <SelectItem value="168">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        <CardDescription>
          Monitor rate limit violations and identify potential abuse patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Total Violations</span>
            </div>
            <p className="text-2xl font-bold text-destructive">
              {stats?.total_violations || 0}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-muted-foreground">Unique IPs</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {stats?.unique_ips || 0}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">Unique Keys</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {stats?.unique_keys || 0}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Endpoints Hit</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {stats?.by_endpoint ? Object.keys(stats.by_endpoint).length : 0}
            </p>
          </div>
        </div>

        {/* By Endpoint */}
        {stats?.by_endpoint && Object.keys(stats.by_endpoint).length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Violations by Endpoint
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.by_endpoint).map(([endpoint, count]) => (
                <div 
                  key={endpoint}
                  className={`px-3 py-2 rounded-lg border ${getEndpointColor(endpoint)}`}
                >
                  <span className="text-sm font-medium">{endpoint}</span>
                  <span className="ml-2 text-lg font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Offenders */}
        {stats?.top_offenders && stats.top_offenders.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Top Offenders
            </h3>
            <div className="space-y-2">
              {stats.top_offenders.slice(0, 5).map((offender, index) => (
                <div 
                  key={offender.ip_address || index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {offender.ip_address || 'Unknown'}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(offender.total_violations)}
                    <span className="font-bold">{offender.total_violations} violations</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Violations Table */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Violations
          </h3>
          {violations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg bg-secondary/20">
              <ShieldAlert className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No rate limit violations recorded</p>
              <p className="text-sm">Your API endpoints are running smoothly!</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>First Seen</TableHead>
                    <TableHead>Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violations.map((violation) => (
                    <TableRow key={violation.id}>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {violation.ip_address || 'Unknown'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getEndpointColor(violation.endpoint)}>
                          {violation.endpoint}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(violation.violation_count)}
                          <span className="font-medium">{violation.violation_count}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(violation.first_violation_at), 'MMM d, HH:mm')}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(violation.last_violation_at), 'MMM d, HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};