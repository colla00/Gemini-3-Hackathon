import { useState, useEffect } from 'react';
import { 
  BarChart3, Clock, Eye, Award, TrendingUp, RefreshCw,
  Brain, Shield, Activity, Calculator, Scale, Target, Cpu, FlaskConical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSlideAnalytics } from '@/hooks/useSlideAnalytics';

interface SlideAnalyticsData {
  slideId: string;
  slideTitle: string;
  timeSpentSeconds: number;
  viewCount: number;
  isPatentSlide: boolean;
}

interface PatentAnalyticsPanelProps {
  sessionId: string | null;
  currentSlideTime?: number;
}

const slideIcons: Record<string, React.ReactNode> = {
  'patent-portfolio': <Award className="w-4 h-4" />,
  'patent-trust-alerts': <Shield className="w-4 h-4" />,
  'patent-equity': <Scale className="w-4 h-4" />,
  'patent-dbs-breakdown': <Calculator className="w-4 h-4" />,
  'patent-validation-charts': <FlaskConical className="w-4 h-4" />,
  'patent-neural-reasoning': <Brain className="w-4 h-4" />,
  'patent-cognitive-load': <Cpu className="w-4 h-4" />,
  'patent-trust-score': <Target className="w-4 h-4" />,
  'patent-performance': <TrendingUp className="w-4 h-4" />,
};

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const PatentAnalyticsPanel = ({ sessionId, currentSlideTime = 0 }: PatentAnalyticsPanelProps) => {
  const { getAnalytics } = useSlideAnalytics(sessionId);
  const [analytics, setAnalytics] = useState<SlideAnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const loadAnalytics = async () => {
    setIsLoading(true);
    const data = await getAnalytics();
    setAnalytics(data);
    setLastRefresh(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    if (sessionId) {
      loadAnalytics();
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadAnalytics, 30000);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  const patentSlides = analytics.filter(s => s.isPatentSlide);
  const totalPatentTime = patentSlides.reduce((sum, s) => sum + s.timeSpentSeconds, 0);
  const totalTime = analytics.reduce((sum, s) => sum + s.timeSpentSeconds, 0);
  const patentPercentage = totalTime > 0 ? Math.round((totalPatentTime / totalTime) * 100) : 0;
  const maxTime = Math.max(...analytics.map(s => s.timeSpentSeconds), 1);

  // Find most engaging patent slides
  const topPatentSlides = [...patentSlides]
    .sort((a, b) => b.timeSpentSeconds - a.timeSpentSeconds)
    .slice(0, 5);

  return (
    <Card className="bg-background/95 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm">Patent Slide Analytics</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadAnalytics}
            disabled={isLoading}
            className="h-7 px-2"
          >
            <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
          </Button>
        </div>
        {lastRefresh && (
          <p className="text-[10px] text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded bg-primary/10 border border-primary/20 text-center">
            <div className="text-lg font-bold text-primary">{formatTime(totalPatentTime)}</div>
            <div className="text-[9px] text-muted-foreground">Patent Time</div>
          </div>
          <div className="p-2 rounded bg-accent/10 border border-accent/20 text-center">
            <div className="text-lg font-bold text-accent">{patentPercentage}%</div>
            <div className="text-[9px] text-muted-foreground">Of Session</div>
          </div>
          <div className="p-2 rounded bg-chart-1/10 border border-chart-1/20 text-center">
            <div className="text-lg font-bold text-chart-1">{patentSlides.length}</div>
            <div className="text-[9px] text-muted-foreground">Slides Viewed</div>
          </div>
        </div>

        {/* Engagement Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Patent Engagement</span>
            <Badge variant="outline" className="text-[10px]">
              {patentPercentage >= 50 ? 'High Interest' : patentPercentage >= 25 ? 'Moderate' : 'Low'}
            </Badge>
          </div>
          <Progress value={patentPercentage} className="h-2" />
        </div>

        {/* Top Engaging Patent Slides */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            <span>Most Engaging Patent Slides</span>
          </div>
          
          <ScrollArea className="h-[200px]">
            <div className="space-y-2 pr-2">
              {topPatentSlides.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No patent slides viewed yet
                </p>
              ) : (
                topPatentSlides.map((slide, index) => (
                  <div
                    key={slide.slideId}
                    className="p-2 rounded bg-secondary/50 border border-border/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                          index === 0 ? "bg-primary text-primary-foreground" :
                          index === 1 ? "bg-accent text-accent-foreground" :
                          "bg-secondary text-muted-foreground"
                        )}>
                          {index + 1}
                        </span>
                        <div className="text-primary">
                          {slideIcons[slide.slideId] || <Award className="w-4 h-4" />}
                        </div>
                        <span className="text-xs font-medium truncate max-w-[120px]">
                          {slide.slideTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(slide.timeSpentSeconds)}</span>
                      </div>
                    </div>
                    
                    {/* Time bar */}
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          index === 0 ? "bg-primary" :
                          index === 1 ? "bg-accent" :
                          "bg-chart-1"
                        )}
                        style={{ width: `${(slide.timeSpentSeconds / maxTime) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {slide.viewCount} view{slide.viewCount !== 1 ? 's' : ''}
                      </span>
                      <span>
                        {Math.round((slide.timeSpentSeconds / totalPatentTime) * 100)}% of patent time
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Current Slide Indicator */}
        {currentSlideTime > 0 && (
          <div className="p-2 rounded bg-risk-low/10 border border-risk-low/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
              <span className="text-risk-low font-medium">Currently Tracking</span>
            </div>
            <span className="text-xs font-mono text-risk-low">{formatTime(currentSlideTime)}</span>
          </div>
        )}

        {/* Insights */}
        {topPatentSlides.length >= 3 && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Award className="w-4 h-4" />
              Investor Insights
            </div>
            <ul className="text-[10px] text-muted-foreground space-y-1">
              <li>
                • Highest engagement: <span className="text-foreground font-medium">{topPatentSlides[0]?.slideTitle}</span>
              </li>
              <li>
                • Patent slides account for <span className="text-foreground font-medium">{patentPercentage}%</span> of presentation time
              </li>
              {patentPercentage >= 40 && (
                <li className="text-risk-low">
                  • Strong IP interest signal detected
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
