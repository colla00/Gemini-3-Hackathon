import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  Target, 
  Trash2, 
  CheckCheck,
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { BaselineMetrics, RegressionAlert } from '@/hooks/usePerformanceRegression';

interface RegressionAlertPanelProps {
  baseline: BaselineMetrics | null;
  alerts: RegressionAlert[];
  isMonitoring: boolean;
  status: 'healthy' | 'warning' | 'critical';
  onCaptureBaseline: () => void;
  onClearBaseline: () => void;
  onAcknowledgeAlert: (id: string) => void;
  onAcknowledgeAll: () => void;
  onClearAlerts: () => void;
}

export const RegressionAlertPanel = ({
  baseline,
  alerts,
  isMonitoring,
  status,
  onCaptureBaseline,
  onClearBaseline,
  onAcknowledgeAlert,
  onAcknowledgeAll,
  onClearAlerts,
}: RegressionAlertPanelProps) => {
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);

  const getStatusIcon = () => {
    switch (status) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'critical':
        return 'Critical Regressions Detected';
      case 'warning':
        return 'Performance Warnings';
      default:
        return 'Performance Healthy';
    }
  };

  const formatMetricValue = (metric: string, value: number): string => {
    if (metric === 'Memory Usage') {
      return `${(value / 1024 / 1024).toFixed(1)} MB`;
    }
    return `${value.toFixed(2)}ms`;
  };

  return (
    <div className="space-y-4">
      {/* Status Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Regression Detection
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${
                status === 'critical' ? 'text-destructive' :
                status === 'warning' ? 'text-amber-500' :
                'text-emerald-500'
              }`}>
                {getStatusText()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {baseline ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Baseline captured {formatDistanceToNow(baseline.timestamp, { addSuffix: true })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {baseline.sampleCount} samples collected
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No baseline set. Capture one to enable regression detection.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onCaptureBaseline}
              >
                <Target className="h-4 w-4 mr-1" />
                {baseline ? 'Update' : 'Capture'} Baseline
              </Button>
              {baseline && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onClearBaseline}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Baseline Metrics Summary */}
          {baseline && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Avg Render</p>
                <p className="text-sm font-mono font-medium">
                  {baseline.avgRenderTime.toFixed(2)}ms
                </p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">FCP</p>
                <p className="text-sm font-mono font-medium">
                  {baseline.fcp.toFixed(0)}ms
                </p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">TTI</p>
                <p className="text-sm font-mono font-medium">
                  {baseline.tti.toFixed(0)}ms
                </p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Memory</p>
                <p className="text-sm font-mono font-medium">
                  {baseline.memoryUsage 
                    ? `${(baseline.memoryUsage / 1024 / 1024).toFixed(1)}MB`
                    : 'N/A'}
                </p>
              </div>
            </div>
          )}

          {/* Monitoring Status */}
          <div className="mt-4 flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              isMonitoring && baseline ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'
            }`} />
            <span className="text-xs text-muted-foreground">
              {isMonitoring && baseline 
                ? 'Actively monitoring for regressions' 
                : baseline 
                  ? 'Monitoring paused'
                  : 'Waiting for baseline'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {unacknowledgedAlerts.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Active Alerts ({unacknowledgedAlerts.length})
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onAcknowledgeAll}
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Acknowledge All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {unacknowledgedAlerts.map(alert => (
                  <div 
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.severity === 'critical' 
                        ? 'bg-destructive/10 border-destructive/30' 
                        : 'bg-amber-500/10 border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {alert.severity === 'critical' 
                            ? <AlertCircle className="h-4 w-4 text-destructive" />
                            : <AlertTriangle className="h-4 w-4 text-amber-500" />
                          }
                          <span className="font-medium text-sm">{alert.metric}</span>
                          <Badge 
                            variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +{alert.degradation.toFixed(1)}% degradation
                          </span>
                          <span>
                            {formatMetricValue(alert.metric, alert.baseline)} → {formatMetricValue(alert.metric, alert.current)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAcknowledgeAlert(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Acknowledged Alerts History */}
      {acknowledgedAlerts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                Acknowledged ({acknowledgedAlerts.length})
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClearAlerts}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[100px]">
              <div className="space-y-1">
                {acknowledgedAlerts.slice(-5).map(alert => (
                  <div 
                    key={alert.id}
                    className="flex items-center justify-between text-xs text-muted-foreground p-2 rounded bg-muted/30"
                  >
                    <span>{alert.metric}</span>
                    <span>+{alert.degradation.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* No Alerts State */}
      {alerts.length === 0 && baseline && (
        <Card>
          <CardContent className="py-8 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-sm font-medium">No Performance Regressions</p>
            <p className="text-xs text-muted-foreground mt-1">
              All metrics are within acceptable thresholds
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
