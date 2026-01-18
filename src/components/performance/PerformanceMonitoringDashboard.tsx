import { useState } from 'react';
import { 
  Activity, 
  Gauge, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Play,
  Pause,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
  Timer,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePerformanceDashboard, type HookMetrics } from '@/hooks/usePerformanceDashboard';

interface PerformanceDashboardProps {
  className?: string;
  defaultExpanded?: boolean;
}

// Performance thresholds for visual indicators
const THRESHOLDS = {
  render: { good: 5, warning: 10 },
  interaction: { good: 50, warning: 100 },
  memory: { good: 50 * 1024 * 1024, warning: 100 * 1024 * 1024 },
};

const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }) => {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.warning) return 'warning';
  return 'critical';
};

const StatusIcon = ({ status }: { status: 'good' | 'warning' | 'critical' }) => {
  switch (status) {
    case 'good':
      return <TrendingDown className="w-3 h-3 text-green-500" />;
    case 'warning':
      return <Minus className="w-3 h-3 text-yellow-500" />;
    case 'critical':
      return <TrendingUp className="w-3 h-3 text-red-500" />;
  }
};

const MetricCard = ({ 
  label, 
  value, 
  unit, 
  status,
  icon: Icon,
  subValue,
}: { 
  label: string; 
  value: number; 
  unit: string; 
  status: 'good' | 'warning' | 'critical';
  icon: React.ComponentType<{ className?: string }>;
  subValue?: string;
}) => (
  <div className={cn(
    "p-3 rounded-lg border transition-colors",
    status === 'good' && "bg-green-500/5 border-green-500/20",
    status === 'warning' && "bg-yellow-500/5 border-yellow-500/20",
    status === 'critical' && "bg-red-500/5 border-red-500/20"
  )}>
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <StatusIcon status={status} />
    </div>
    <div className="flex items-baseline gap-1">
      <span className={cn(
        "text-lg font-bold",
        status === 'good' && "text-green-500",
        status === 'warning' && "text-yellow-500",
        status === 'critical' && "text-red-500"
      )}>
        {value.toFixed(1)}
      </span>
      <span className="text-xs text-muted-foreground">{unit}</span>
    </div>
    {subValue && (
      <span className="text-[10px] text-muted-foreground">{subValue}</span>
    )}
  </div>
);

const HookMetricRow = ({ metric }: { metric: HookMetrics }) => {
  const status = getPerformanceStatus(metric.avgRenderTime, THRESHOLDS.render);
  const progressValue = Math.min((metric.avgRenderTime / 10) * 100, 100);
  
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium truncate">{metric.name}</span>
          <div className="flex items-center gap-2">
            {metric.violations > 0 && (
              <Badge variant="destructive" className="h-4 text-[10px] px-1">
                {metric.violations} violations
              </Badge>
            )}
            <span className={cn(
              "text-xs font-mono",
              status === 'good' && "text-green-500",
              status === 'warning' && "text-yellow-500",
              status === 'critical' && "text-red-500"
            )}>
              {metric.avgRenderTime.toFixed(2)}ms
            </span>
          </div>
        </div>
        <Progress 
          value={progressValue} 
          className={cn(
            "h-1",
            status === 'good' && "[&>div]:bg-green-500",
            status === 'warning' && "[&>div]:bg-yellow-500",
            status === 'critical' && "[&>div]:bg-red-500"
          )}
        />
      </div>
      <div className="text-right">
        <span className="text-[10px] text-muted-foreground">
          {metric.totalRenders} renders
        </span>
      </div>
    </div>
  );
};

export const PerformanceMonitoringDashboard = ({ 
  className,
  defaultExpanded = false,
}: PerformanceDashboardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showViolations, setShowViolations] = useState(false);
  
  const {
    summary,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearMetrics,
    exportReport,
  } = usePerformanceDashboard({ refreshInterval: 1000 });

  const handleExport = () => {
    const report = exportReport();
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const memoryMB = summary.memoryUsage ? summary.memoryUsage / (1024 * 1024) : 0;
  const memoryStatus = getPerformanceStatus(
    summary.memoryUsage || 0, 
    THRESHOLDS.memory
  );
  const interactionStatus = getPerformanceStatus(
    summary.avgInteractionTime, 
    THRESHOLDS.interaction
  );

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className={cn(
          "fixed bottom-4 left-4 z-50 gap-2 bg-card/95 backdrop-blur-sm shadow-lg",
          className
        )}
      >
        <BarChart3 className="w-4 h-4 text-primary" />
        <span>Performance</span>
        {summary.budgetViolations.length > 0 && (
          <Badge variant="destructive" className="h-4 text-[10px] px-1 ml-1">
            {summary.budgetViolations.length}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-4 left-4 z-50 w-[360px] bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isMonitoring ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
          )} />
          <span className="text-sm font-semibold">Performance Monitor</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className="h-7 w-7 p-0"
            title={isMonitoring ? "Pause monitoring" : "Resume monitoring"}
          >
            {isMonitoring ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMetrics}
            className="h-7 w-7 p-0"
            title="Clear metrics"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="h-7 w-7 p-0"
            title="Export report"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="h-7 w-7 p-0"
            title="Minimize"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Web Vitals */}
      <div className="p-3 border-b border-border/50">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Web Vitals
        </div>
        <div className="grid grid-cols-3 gap-2">
          <MetricCard
            label="Page Load"
            value={summary.webVitals.pageLoad}
            unit="ms"
            status={getPerformanceStatus(summary.webVitals.pageLoad, { good: 1000, warning: 2500 })}
            icon={Clock}
          />
          <MetricCard
            label="FCP"
            value={summary.webVitals.fcp}
            unit="ms"
            status={getPerformanceStatus(summary.webVitals.fcp, { good: 1800, warning: 3000 })}
            icon={Zap}
          />
          <MetricCard
            label="TTI"
            value={summary.webVitals.tti}
            unit="ms"
            status={getPerformanceStatus(summary.webVitals.tti, { good: 3800, warning: 7300 })}
            icon={Activity}
          />
        </div>
      </div>

      {/* Runtime Metrics */}
      <div className="p-3 border-b border-border/50">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Runtime Metrics
        </div>
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            label="Avg Interaction"
            value={summary.avgInteractionTime}
            unit="ms"
            status={interactionStatus}
            icon={Timer}
            subValue={`${summary.totalMetrics} total metrics`}
          />
          {summary.memoryUsage && (
            <MetricCard
              label="Memory"
              value={memoryMB}
              unit="MB"
              status={memoryStatus}
              icon={Cpu}
            />
          )}
        </div>
      </div>

      {/* Hook Metrics */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <button className="w-full p-3 flex items-center justify-between hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">Hook Performance</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 pb-3">
            {summary.hookMetrics.map((metric) => (
              <HookMetricRow key={metric.name} metric={metric} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Budget Violations */}
      {summary.budgetViolations.length > 0 && (
        <Collapsible open={showViolations} onOpenChange={setShowViolations}>
          <CollapsibleTrigger asChild>
            <button className="w-full p-3 flex items-center justify-between hover:bg-secondary/50 transition-colors border-t border-border/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-xs font-medium">Budget Violations</span>
                <Badge variant="destructive" className="h-4 text-[10px] px-1">
                  {summary.budgetViolations.length}
                </Badge>
              </div>
              {showViolations ? (
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-3 pb-3 max-h-40 overflow-y-auto">
              {summary.budgetViolations.slice(-10).reverse().map((violation, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                  <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                    {violation.metric.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-red-500 font-mono">
                      +{violation.exceeded.toFixed(1)}ms
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      / {violation.budget}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Footer */}
      <div className="px-3 py-2 bg-muted/30 text-[10px] text-muted-foreground flex items-center justify-between">
        <span>Updated {new Date(summary.lastUpdated).toLocaleTimeString()}</span>
        <span>{isMonitoring ? 'Monitoring active' : 'Paused'}</span>
      </div>
    </div>
  );
};
