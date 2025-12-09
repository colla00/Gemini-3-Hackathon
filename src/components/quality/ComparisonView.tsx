import { useState } from 'react';
import { 
  ArrowRight, Clock, AlertTriangle, CheckCircle, TrendingDown,
  User, Activity, Zap, Brain, Shield, Target, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ComparisonMetric {
  label: string;
  traditional: number | string;
  aiEnhanced: number | string;
  improvement: string;
  unit?: string;
}

const comparisonMetrics: ComparisonMetric[] = [
  { label: 'Time to Detection', traditional: '8.2', aiEnhanced: '4.0', improvement: '51%', unit: 'hours' },
  { label: 'False Positive Rate', traditional: '24%', aiEnhanced: '11%', improvement: '54%' },
  { label: 'Intervention Success', traditional: '67%', aiEnhanced: '84%', improvement: '+17%' },
  { label: 'Documentation Time', traditional: '12', aiEnhanced: '6', improvement: '50%', unit: 'min/patient' },
  { label: 'Nurse Workload Score', traditional: '7.8', aiEnhanced: '5.2', improvement: '33%', unit: '/10' },
];

interface TimelineEvent {
  time: string;
  label: string;
  type: 'alert' | 'action' | 'outcome';
}

const traditionalTimeline: TimelineEvent[] = [
  { time: '00:00', label: 'Patient admitted', type: 'action' },
  { time: '04:30', label: 'Vital signs slightly elevated', type: 'alert' },
  { time: '06:00', label: 'Routine assessment', type: 'action' },
  { time: '08:15', label: 'Deterioration noted', type: 'alert' },
  { time: '08:45', label: 'Rapid response called', type: 'action' },
  { time: '09:30', label: 'ICU transfer', type: 'outcome' },
];

const aiEnhancedTimeline: TimelineEvent[] = [
  { time: '00:00', label: 'Patient admitted', type: 'action' },
  { time: '02:15', label: 'AI flags risk pattern', type: 'alert' },
  { time: '02:30', label: 'Proactive assessment', type: 'action' },
  { time: '03:00', label: 'Early intervention initiated', type: 'action' },
  { time: '04:30', label: 'Risk stabilized', type: 'outcome' },
  { time: '06:00', label: 'Continued monitoring', type: 'action' },
];

export const ComparisonView = () => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [animationTriggered, setAnimationTriggered] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Workflow Comparison</h2>
          <p className="text-sm text-muted-foreground">Traditional vs AI-Enhanced Clinical Pathways</p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30">
          <Award className="w-3 h-3 mr-1" />
          Patent-Pending Innovation
        </Badge>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Traditional Workflow */}
        <Card className="border-muted-foreground/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Traditional Workflow</CardTitle>
                <p className="text-xs text-muted-foreground">Reactive monitoring approach</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Timeline */}
            <div className="space-y-3">
              {traditionalTimeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      event.type === 'alert' ? 'bg-risk-high' :
                      event.type === 'outcome' ? 'bg-amber-500' : 'bg-muted-foreground'
                    )} />
                    {idx < traditionalTimeline.length - 1 && (
                      <div className="w-0.5 h-8 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{event.time}</span>
                      {event.type === 'alert' && <AlertTriangle className="w-3 h-3 text-risk-high" />}
                    </div>
                    <p className="text-sm text-foreground">{event.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold text-risk-high">9.5h</div>
                <div className="text-xs text-muted-foreground">Total response time</div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold text-amber-500">ICU</div>
                <div className="text-xs text-muted-foreground">Escalation required</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI-Enhanced Workflow */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">AI-Enhanced Workflow</CardTitle>
                <p className="text-xs text-muted-foreground">Predictive intervention approach</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Timeline */}
            <div className="space-y-3">
              {aiEnhancedTimeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      event.type === 'alert' ? 'bg-primary animate-pulse' :
                      event.type === 'outcome' ? 'bg-risk-low' : 'bg-primary/50'
                    )} />
                    {idx < aiEnhancedTimeline.length - 1 && (
                      <div className="w-0.5 h-8 bg-primary/30" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-primary">{event.time}</span>
                      {event.type === 'alert' && <Zap className="w-3 h-3 text-primary" />}
                      {event.type === 'outcome' && <CheckCircle className="w-3 h-3 text-risk-low" />}
                    </div>
                    <p className="text-sm text-foreground">{event.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-primary/20">
              <div className="p-3 rounded-lg bg-risk-low/10 border border-risk-low/20">
                <div className="text-2xl font-bold text-risk-low">4.5h</div>
                <div className="text-xs text-muted-foreground">Total response time</div>
              </div>
              <div className="p-3 rounded-lg bg-risk-low/10 border border-risk-low/20">
                <div className="text-2xl font-bold text-risk-low">Ward</div>
                <div className="text-xs text-muted-foreground">Maintained on unit</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improvement Arrow */}
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-risk-low/10 border border-risk-low/30">
          <TrendingDown className="w-5 h-5 text-risk-low" />
          <span className="text-lg font-bold text-risk-low">53% Faster Detection</span>
          <ArrowRight className="w-5 h-5 text-risk-low" />
          <span className="text-lg font-bold text-risk-low">Better Outcomes</span>
        </div>
      </div>

      {/* Metrics Comparison Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Performance Metrics Comparison (Illustrative)</CardTitle>
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/30">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Projected Goals
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {comparisonMetrics.map((metric) => (
              <div 
                key={metric.label}
                className={cn(
                  "p-3 rounded-lg transition-all cursor-pointer",
                  hoveredMetric === metric.label ? "bg-primary/10" : "bg-secondary/30"
                )}
                onMouseEnter={() => setHoveredMetric(metric.label)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{metric.label}</span>
                  <Badge className="bg-risk-low/20 text-risk-low border-risk-low/30">
                    {metric.improvement} improvement
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Traditional</span>
                      <span>{metric.traditional}{metric.unit ? ` ${metric.unit}` : ''}</span>
                    </div>
                    <Progress 
                      value={70} 
                      className="h-2 bg-muted"
                    />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>AI-Enhanced</span>
                      <span className="text-risk-low font-medium">{metric.aiEnhanced}{metric.unit ? ` ${metric.unit}` : ''}</span>
                    </div>
                    <Progress 
                      value={90} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Patent Claims Related to Comparison */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <CardTitle className="text-sm text-amber-500">Related Patent Claims</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-background/50 border border-amber-500/20">
              <p className="text-xs font-medium text-foreground">Claim 3: Automated Workflow Triggering</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Method for automatically initiating clinical workflows based on ML-derived risk thresholds
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-amber-500/20">
              <p className="text-xs font-medium text-foreground">Claim 5: Closed-Loop Efficacy Tracking</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                System for measuring intervention outcomes and feeding results back into prediction models
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
