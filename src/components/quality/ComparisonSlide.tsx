import { 
  Clock, AlertTriangle, TrendingDown, TrendingUp, 
  CheckCircle, XCircle, Brain, FileText, Users, DollarSign,
  ArrowRight, Zap, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComparisonMetric {
  label: string;
  traditional: string;
  predictive: string;
  improvement?: string;
  icon: React.ElementType;
}

const comparisonMetrics: ComparisonMetric[] = [
  {
    label: 'Detection Timing',
    traditional: 'After event occurs',
    predictive: '4-24 hours before',
    improvement: 'Proactive vs Reactive',
    icon: Clock,
  },
  {
    label: 'Risk Assessment',
    traditional: 'Manual scales only',
    predictive: '47 features + ML',
    improvement: '10x more data points',
    icon: Brain,
  },
  {
    label: 'Update Frequency',
    traditional: 'Once per shift',
    predictive: 'Real-time (<30s)',
    improvement: 'Continuous monitoring',
    icon: Zap,
  },
  {
    label: 'Explainability',
    traditional: 'Clinician judgment',
    predictive: 'SHAP + judgment',
    improvement: 'Augmented decision-making',
    icon: Eye,
  },
];

const outcomeMetrics = [
  {
    label: 'Falls Rate',
    traditional: '3.5 per 1,000 days',
    predictive: '2.1 per 1,000 days',
    improvement: '-40%',
    isPositive: true,
  },
  {
    label: 'Alert Fatigue',
    traditional: 'High (many false alarms)',
    predictive: 'Low (calibrated)',
    improvement: '-60%',
    isPositive: true,
  },
  {
    label: 'Documentation Time',
    traditional: '15 min/assessment',
    predictive: '5 min/review',
    improvement: '-67%',
    isPositive: true,
  },
  {
    label: 'Intervention Speed',
    traditional: 'Post-incident',
    predictive: '<30 min from alert',
    improvement: 'Preventive',
    isPositive: true,
  },
];

export const ComparisonSlide = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-primary/5 p-6 flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Traditional vs Predictive Monitoring
        </h1>
        <p className="text-sm text-muted-foreground">
          How AI-augmented NSO monitoring transforms patient safety
        </p>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* Traditional Approach */}
        <Card className="border-2 border-muted-foreground/30">
          <CardHeader className="pb-3 bg-muted/30">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <span className="text-foreground">Traditional Approach</span>
                <div className="text-xs font-normal text-muted-foreground">
                  Retrospective Quality Monitoring
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {comparisonMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <metric.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {metric.label}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {metric.traditional}
                    </div>
                  </div>
                  <XCircle className="w-4 h-4 text-risk-high/60" />
                </div>
              ))}
            </div>

            {/* Traditional Workflow */}
            <div className="mt-4 p-3 rounded-lg bg-risk-high/10 border border-risk-high/30">
              <div className="text-xs font-semibold text-risk-high mb-2">
                Typical Scenario
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="px-2 py-0.5 rounded bg-secondary">Event Occurs</span>
                <ArrowRight className="w-3 h-3" />
                <span className="px-2 py-0.5 rounded bg-secondary">Incident Report</span>
                <ArrowRight className="w-3 h-3" />
                <span className="px-2 py-0.5 rounded bg-secondary">Root Cause</span>
              </div>
              <div className="text-[10px] text-risk-high mt-2 italic">
                "We find out after the harm has occurred"
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predictive Approach */}
        <Card className="border-2 border-primary">
          <CardHeader className="pb-3 bg-primary/10">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-foreground">NSO Predictive System</span>
                <div className="text-xs font-normal text-muted-foreground">
                  Real-Time AI-Augmented Monitoring
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {comparisonMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <metric.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {metric.label}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {metric.predictive}
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-risk-low" />
                </div>
              ))}
            </div>

            {/* Predictive Workflow */}
            <div className="mt-4 p-3 rounded-lg bg-risk-low/10 border border-risk-low/30">
              <div className="text-xs font-semibold text-risk-low mb-2">
                Preventive Scenario
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary">Risk Detected</span>
                <ArrowRight className="w-3 h-3" />
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary">Alert Sent</span>
                <ArrowRight className="w-3 h-3" />
                <span className="px-2 py-0.5 rounded bg-risk-low/20 text-risk-low">Prevention</span>
              </div>
              <div className="text-[10px] text-risk-low mt-2 italic">
                "We prevent harm before it happens"
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Metrics Row */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide text-center">
          Target Outcomes (Projected)
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {outcomeMetrics.map((metric) => (
            <Card key={metric.label} className="border border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-[10px] text-muted-foreground mb-1">
                  {metric.label}
                </div>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="text-xs text-muted-foreground line-through">
                    {metric.traditional}
                  </div>
                  <ArrowRight className="w-3 h-3 text-primary" />
                  <div className="text-sm font-bold text-foreground">
                    {metric.predictive}
                  </div>
                </div>
                <div className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                  metric.isPositive ? "bg-risk-low/20 text-risk-low" : "bg-risk-high/20 text-risk-high"
                )}>
                  {metric.isPositive ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <TrendingUp className="w-3 h-3" />
                  )}
                  {metric.improvement}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 text-center">
        <p className="text-[9px] text-muted-foreground italic">
          * Projected outcomes based on literature review and pilot design. Validation study in planning.
        </p>
      </div>
    </div>
  );
};
