import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  RefreshCw, 
  Trash2, 
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  History,
  Gauge
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLighthouseMonitoring, type LighthouseReport } from '@/hooks/useLighthouseMonitoring';
import { LighthouseGauge, LighthouseScoreBar } from './LighthouseGauge';
import { useState } from 'react';

interface LighthousePanelProps {
  className?: string;
}

const formatMetricValue = (value: number, unit: string): string => {
  if (unit === 'ms') {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}s`;
    }
    return `${Math.round(value)}ms`;
  }
  if (unit === '') {
    return value.toFixed(3);
  }
  return `${value}${unit}`;
};

const getTrendIcon = (current: number, previous: number) => {
  const diff = current - previous;
  if (Math.abs(diff) < 5) {
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  }
  if (diff > 0) {
    return <TrendingUp className="w-3 h-3 text-emerald-500" />;
  }
  return <TrendingDown className="w-3 h-3 text-red-500" />;
};

export const LighthousePanel = ({ className }: LighthousePanelProps) => {
  const [showHistory, setShowHistory] = useState(false);
  
  const {
    currentReport,
    history,
    isLoading,
    runAudit,
    clearHistory,
    getOverallRating,
  } = useLighthouseMonitoring({ autoMeasure: true });

  const previousReport = history.length > 1 ? history[history.length - 2] : null;
  const overallRating = getOverallRating();

  const ratingColor = {
    good: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    'needs-improvement': 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    poor: 'text-red-500 bg-red-500/10 border-red-500/30',
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Score Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Lighthouse Score
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={runAudit}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
                {isLoading ? 'Measuring...' : 'Run Audit'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentReport ? (
            <div className="flex flex-col items-center gap-4">
              {/* Main gauge */}
              <div className="flex items-center justify-center gap-6">
                <LighthouseGauge 
                  score={currentReport.scores.performance} 
                  size="lg"
                  label="Performance"
                />
                
                {/* Rating badge */}
                <div className="space-y-2">
                  <Badge 
                    variant="outline" 
                    className={cn("capitalize", ratingColor[overallRating])}
                  >
                    {overallRating.replace('-', ' ')}
                  </Badge>
                  
                  {previousReport && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getTrendIcon(
                        currentReport.scores.performance, 
                        previousReport.scores.performance
                      )}
                      <span>
                        {currentReport.scores.performance > previousReport.scores.performance
                          ? `+${currentReport.scores.performance - previousReport.scores.performance}`
                          : currentReport.scores.performance - previousReport.scores.performance
                        } from last
                      </span>
                    </div>
                  )}
                  
                  <p className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(currentReport.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Individual metric scores */}
              <div className="w-full space-y-3 mt-2">
                {currentReport.audits.map(audit => (
                  <LighthouseScoreBar
                    key={audit.id}
                    score={audit.score}
                    label={audit.title}
                    value={formatMetricValue(audit.value, audit.unit)}
                  />
                ))}
              </div>

              {/* Page weight info */}
              <div className="w-full pt-3 border-t border-border/50">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Total Page Weight</span>
                  <span className="font-mono">
                    {(currentReport.metrics.totalByteWeight / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Gauge className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium">No audit data</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Run Audit" to measure performance
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      {history.length > 1 && (
        <Collapsible open={showHistory} onOpenChange={setShowHistory}>
          <Card>
            <CollapsibleTrigger asChild>
              <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Score History</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {history.length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {showHistory && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearHistory();
                      }}
                      className="h-7 px-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    showHistory && "rotate-180"
                  )} />
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ScrollArea className="h-[200px]">
                <div className="px-4 pb-4 space-y-2">
                  {[...history].reverse().map((report, index) => {
                    const prevReport = history[history.length - 2 - index];
                    return (
                      <div 
                        key={report.timestamp}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <LighthouseGauge 
                            score={report.scores.performance} 
                            size="sm"
                            showLabel={false}
                          />
                          <div>
                            <p className="text-xs font-medium">
                              Score: {report.scores.performance}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {formatDistanceToNow(report.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        {prevReport && (
                          <div className="flex items-center gap-1">
                            {getTrendIcon(report.scores.performance, prevReport.scores.performance)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>90-100 Good</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>50-89 Needs Work</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>0-49 Poor</span>
        </div>
      </div>
    </div>
  );
};
