import { useEffect, useState } from 'react';
import { performanceMonitor, type PerformanceReport } from '@/lib/performanceMonitor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Activity, Clock, Zap, RefreshCw, BarChart3, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePerformanceBudget } from '@/hooks/usePerformanceBudget';

interface PerformancePanelProps {
  className?: string;
}

export const PerformancePanel = ({ className }: PerformancePanelProps) => {
  const [report, setReport] = useState<ReturnType<typeof performanceMonitor.generateReport> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [budgetAlertsEnabled, setBudgetAlertsEnabled] = useState(false);
  
  // Enable budget alerts with toast notifications
  usePerformanceBudget(budgetAlertsEnabled);

  const refreshMetrics = () => {
    setReport(performanceMonitor.generateReport());
  };

  useEffect(() => {
    if (isVisible) {
      refreshMetrics();
      const interval = setInterval(refreshMetrics, 2000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const getScoreColor = (value: number, thresholds: { good: number; moderate: number }) => {
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.moderate) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadge = (value: number, thresholds: { good: number; moderate: number }) => {
    if (value <= thresholds.good) return 'bg-green-500/10 text-green-500 border-green-500/30';
    if (value <= thresholds.moderate) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    return 'bg-red-500/10 text-red-500 border-red-500/30';
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className={cn("fixed bottom-4 right-4 z-50", className)}
      >
        <BarChart3 className="w-4 h-4 mr-2" />
        Performance
      </Button>
    );
  }

  return (
    <Card className={cn("fixed bottom-4 right-4 w-80 z-50 shadow-lg", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Performance Monitor
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={refreshMetrics}>
              <RefreshCw className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsVisible(false)}>
              ×
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {/* Core Web Vitals */}
        <div className="space-y-2">
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            Core Web Vitals
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Clock className="w-3 h-3" />
                <span>Page Load</span>
              </div>
              <div className={cn("font-bold", getScoreColor(report?.pageLoad || 0, { good: 2000, moderate: 4000 }))}>
                {(report?.pageLoad || 0).toFixed(0)}ms
              </div>
            </div>
            
            <div className="p-2 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Zap className="w-3 h-3" />
                <span>FCP</span>
              </div>
              <div className={cn("font-bold", getScoreColor(report?.firstContentfulPaint || 0, { good: 1800, moderate: 3000 }))}>
                {(report?.firstContentfulPaint || 0).toFixed(0)}ms
              </div>
            </div>
            
            <div className="p-2 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Activity className="w-3 h-3" />
                <span>TTI</span>
              </div>
              <div className={cn("font-bold", getScoreColor(report?.timeToInteractive || 0, { good: 3800, moderate: 7300 }))}>
                {(report?.timeToInteractive || 0).toFixed(0)}ms
              </div>
            </div>
            
            <div className="p-2 rounded-lg bg-secondary/30">
              <div className="text-muted-foreground mb-1">Metrics</div>
              <div className="font-bold text-primary">
                {report?.customMetrics.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Alerts Toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-2">
            <Bell className="w-3 h-3 text-muted-foreground" />
            <Label htmlFor="budget-alerts" className="text-xs cursor-pointer">
              Budget Alerts
            </Label>
          </div>
          <Switch
            id="budget-alerts"
            checked={budgetAlertsEnabled}
            onCheckedChange={setBudgetAlertsEnabled}
            className="scale-75"
          />
        </div>

        {/* Custom Metrics Averages */}
        {report?.averages && Object.keys(report.averages).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
              Custom Metrics (Avg)
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {Object.entries(report.averages).slice(0, 5).map(([name, value]) => (
                <div key={name} className="flex justify-between items-center p-1.5 rounded bg-secondary/20">
                  <span className="truncate text-muted-foreground">{name}</span>
                  <Badge variant="outline" className={getScoreBadge(value, { good: 100, moderate: 500 })}>
                    {value.toFixed(1)}ms
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => {
            performanceMonitor.clear();
            refreshMetrics();
          }}
        >
          Clear Metrics
        </Button>
      </CardContent>
    </Card>
  );
};
