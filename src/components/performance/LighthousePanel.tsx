import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  RefreshCw, 
  Trash2, 
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  History,
  Gauge,
  Globe,
  Monitor,
  Smartphone,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLighthouseMonitoring } from '@/hooks/useLighthouseMonitoring';
import { useProductionLighthouse } from '@/hooks/useProductionLighthouse';
import { LighthouseGauge, LighthouseScoreBar } from './LighthouseGauge';
import { useState } from 'react';

interface LighthousePanelProps {
  className?: string;
}

const formatMetricValue = (value: number, unit: string): string => {
  if (unit === 'ms' || unit === 'millisecond') {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}s`;
    }
    return `${Math.round(value)}ms`;
  }
  if (unit === '' || unit === 'unitless') {
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
  const [auditMode, setAuditMode] = useState<'local' | 'production'>('local');
  const [prodUrl, setProdUrl] = useState('');
  const [prodStrategy, setProdStrategy] = useState<'mobile' | 'desktop'>('mobile');
  
  // Local (simulated) Lighthouse
  const localLighthouse = useLighthouseMonitoring({ autoMeasure: true });
  
  // Production (real PageSpeed Insights)
  const prodLighthouse = useProductionLighthouse({
    defaultStrategy: prodStrategy,
  });

  const currentReport = auditMode === 'local' ? localLighthouse.currentReport : prodLighthouse.currentReport;
  const history = auditMode === 'local' ? localLighthouse.history : prodLighthouse.history;
  const isLoading = auditMode === 'local' ? localLighthouse.isLoading : prodLighthouse.isLoading;
  
  const runAudit = () => {
    if (auditMode === 'local') {
      localLighthouse.runAudit();
    } else {
      const url = prodUrl || window.location.origin;
      prodLighthouse.runAudit(url, prodStrategy);
    }
  };

  const clearHistory = auditMode === 'local' ? localLighthouse.clearHistory : prodLighthouse.clearHistory;

  const previousReport = history.length > 1 ? history[history.length - 2] : null;
  const overallRating = currentReport 
    ? (auditMode === 'local' ? localLighthouse.getOverallRating() : prodLighthouse.getScoreRating(currentReport.scores.performance))
    : 'needs-improvement';

  const ratingColor = {
    good: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    'needs-improvement': 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    poor: 'text-red-500 bg-red-500/10 border-red-500/30',
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mode Switcher */}
      <Tabs value={auditMode} onValueChange={(v) => setAuditMode(v as 'local' | 'production')}>
        <TabsList className="w-full">
          <TabsTrigger value="local" className="flex-1 text-xs">
            <Monitor className="w-3 h-3 mr-1" />
            Local
          </TabsTrigger>
          <TabsTrigger value="production" className="flex-1 text-xs">
            <Globe className="w-3 h-3 mr-1" />
            Production
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Production URL Input */}
      {auditMode === 'production' && (
        <Card>
          <CardContent className="p-3 space-y-3">
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="https://your-site.com"
                value={prodUrl}
                onChange={(e) => setProdUrl(e.target.value)}
                className="h-8 text-xs"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant={prodStrategy === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setProdStrategy('mobile')}
                  className="flex-1 h-7 text-xs"
                >
                  <Smartphone className="w-3 h-3 mr-1" />
                  Mobile
                </Button>
                <Button
                  variant={prodStrategy === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setProdStrategy('desktop')}
                  className="flex-1 h-7 text-xs"
                >
                  <Monitor className="w-3 h-3 mr-1" />
                  Desktop
                </Button>
              </div>
            </div>
            
            {prodLighthouse.error && (
              <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{prodLighthouse.error}</span>
              </div>
            )}
            
            <Button
              onClick={runAudit}
              disabled={isLoading}
              className="w-full h-8"
              size="sm"
            >
              <RefreshCw className={cn("h-3 w-3 mr-1", isLoading && "animate-spin")} />
              {isLoading ? 'Auditing...' : 'Run PageSpeed Audit'}
            </Button>
            
            <p className="text-[10px] text-muted-foreground text-center">
              Uses Google PageSpeed Insights API
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Score Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              {auditMode === 'local' ? 'Local Score' : 'Production Score'}
            </CardTitle>
            {auditMode === 'local' && (
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
            )}
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

              {/* Page weight info - only for local audits */}
              {auditMode === 'local' && 'totalByteWeight' in currentReport.metrics && (
                <div className="w-full pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Total Page Weight</span>
                    <span className="font-mono">
                      {((currentReport.metrics as { totalByteWeight: number }).totalByteWeight / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              )}
              
              {/* Production audit info */}
              {auditMode === 'production' && prodLighthouse.currentReport && (
                <div className="w-full pt-3 border-t border-border/50 space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Final URL</span>
                    <a 
                      href={prodLighthouse.currentReport.finalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-primary hover:underline flex items-center gap-1 max-w-[180px] truncate"
                    >
                      {new URL(prodLighthouse.currentReport.finalUrl).hostname}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Strategy</span>
                    <span className="font-mono flex items-center gap-1">
                      {prodLighthouse.currentReport.strategy === 'mobile' 
                        ? <><Smartphone className="w-3 h-3" /> Mobile</>
                        : <><Monitor className="w-3 h-3" /> Desktop</>
                      }
                    </span>
                  </div>
                </div>
              )}
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
