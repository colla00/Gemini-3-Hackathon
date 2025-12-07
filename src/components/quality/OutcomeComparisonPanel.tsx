import { TrendingDown, ArrowRight, Users, DollarSign, Clock, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const outcomeMetrics = [
  {
    category: 'Falls',
    baseline: { rate: 3.2, label: 'per 1,000 patient days' },
    withNSO: { rate: 1.9, label: 'per 1,000 patient days' },
    reduction: 41,
    pValue: 0.003,
    confidence: '95% CI: 28-54%'
  },
  {
    category: 'Pressure Injuries',
    baseline: { rate: 2.8, label: 'per 1,000 patient days' },
    withNSO: { rate: 1.7, label: 'per 1,000 patient days' },
    reduction: 39,
    pValue: 0.008,
    confidence: '95% CI: 22-56%'
  },
  {
    category: 'CAUTI',
    baseline: { rate: 1.9, label: 'per 1,000 catheter days' },
    withNSO: { rate: 1.2, label: 'per 1,000 catheter days' },
    reduction: 37,
    pValue: 0.012,
    confidence: '95% CI: 18-56%'
  },
];

const impactStats = [
  {
    icon: TrendingDown,
    value: '40%',
    label: 'Avg. Reduction',
    sublabel: 'in preventable events',
    color: 'text-risk-low'
  },
  {
    icon: Clock,
    value: '2.1 days',
    label: 'Shorter LOS',
    sublabel: 'for high-risk patients',
    color: 'text-primary'
  },
  {
    icon: DollarSign,
    value: '$847K',
    label: 'Annual Savings',
    sublabel: 'per 100-bed unit',
    color: 'text-risk-low'
  },
  {
    icon: Users,
    value: '94%',
    label: 'Nurse Adoption',
    sublabel: 'after 90-day pilot',
    color: 'text-primary'
  },
];

const studyDetails = {
  design: 'Prospective Quasi-Experimental',
  setting: '3 Med/Surg Units, Academic Medical Center',
  duration: '18 months (6-mo baseline, 12-mo intervention)',
  sampleSize: '4,247 patient encounters',
  primaryEndpoint: 'Composite NSO event rate',
  status: 'Manuscript in preparation'
};

export const OutcomeComparisonPanel = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Clinical Outcomes Comparison</h2>
          <p className="text-sm text-muted-foreground">Pre/Post Implementation Analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Simulated Data
          </Badge>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            <Award className="w-3 h-3 mr-1" />
            IRB #2024-0847
          </Badge>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {impactStats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg bg-secondary flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                  <div className="text-[10px] text-muted-foreground/70">{stat.sublabel}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Outcome Comparison Cards */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Event Rate Reduction by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {outcomeMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-foreground">{metric.category}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">{metric.confidence}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-risk-low/20 text-risk-low border-risk-low/30">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      {metric.reduction}% reduction
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">p={metric.pValue}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Baseline */}
                  <div className="p-3 rounded-lg bg-risk-high/10 border border-risk-high/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-risk-high uppercase">Baseline</span>
                      <span className="text-lg font-bold text-risk-high">{metric.baseline.rate}</span>
                    </div>
                    <Progress value={metric.baseline.rate * 20} className="h-2 bg-risk-high/20" />
                    <span className="text-[10px] text-muted-foreground">{metric.baseline.label}</span>
                  </div>
                  
                  {/* With NSO */}
                  <div className="p-3 rounded-lg bg-risk-low/10 border border-risk-low/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-risk-low uppercase">With NSO</span>
                      <span className="text-lg font-bold text-risk-low">{metric.withNSO.rate}</span>
                    </div>
                    <Progress value={metric.withNSO.rate * 20} className="h-2 bg-risk-low/20" />
                    <span className="text-[10px] text-muted-foreground">{metric.withNSO.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Methodology */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Study Methodology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(studyDetails).map(([key, value], index) => (
              <div key={index} className="p-3 rounded-lg bg-secondary/50">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-xs font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-500">
              <strong>Important:</strong> Results shown are simulated for demonstration purposes. 
              Actual clinical outcomes will vary based on implementation context, patient population, 
              and care team engagement. This tool is designed to augment, not replace, clinical judgment.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
