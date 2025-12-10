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
  },
  {
    category: 'Pressure Injuries',
    baseline: { rate: 2.8, label: 'per 1,000 patient days' },
    withNSO: { rate: 1.7, label: 'per 1,000 patient days' },
    reduction: 39,
  },
  {
    category: 'CAUTI',
    baseline: { rate: 1.9, label: 'per 1,000 catheter days' },
    withNSO: { rate: 1.2, label: 'per 1,000 catheter days' },
    reduction: 37,
  },
];

const impactStats = [
  {
    icon: TrendingDown,
    value: '~40%',
    label: 'Target Reduction',
    sublabel: 'in preventable events',
    color: 'text-risk-low',
    tag: 'Design Target'
  },
  {
    icon: Clock,
    value: '~2 days',
    label: 'Target LOS Reduction',
    sublabel: 'for high-risk patients',
    color: 'text-primary',
    tag: 'Design Target'
  },
  {
    icon: DollarSign,
    value: 'TBD',
    label: 'Projected Savings',
    sublabel: 'requires validation',
    color: 'text-muted-foreground',
    tag: 'Not Validated'
  },
  {
    icon: Users,
    value: 'TBD',
    label: 'Adoption Rate',
    sublabel: 'no pilot conducted',
    color: 'text-muted-foreground',
    tag: 'Not Validated'
  },
];

const studyDetails = {
  design: 'Illustrative Study Design',
  setting: 'Simulated Med/Surg Units',
  duration: 'Projected 18-month study period',
  sampleSize: 'Target: ~4,000 patient encounters',
  primaryEndpoint: 'Composite NSO event rate',
  status: 'Validation study planned'
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
            Illustrative Data Only
          </Badge>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            <Award className="w-3 h-3 mr-1" />
            Patent-Pending
          </Badge>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-600 dark:text-amber-400">
            <strong>Important:</strong> All outcome metrics, reduction percentages, and statistical values shown are 
            illustrative projections based on synthetic demonstration data. These represent target performance goals, 
            not validated clinical results from completed studies.
          </p>
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
              <Badge variant="outline" className="mt-2 text-[9px] border-amber-500/30 text-amber-600 dark:text-amber-400">
                {stat.tag}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Outcome Comparison Cards */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Projected Event Rate Reduction by Category (Illustrative)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {outcomeMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{metric.category}</span>
                    <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-600 dark:text-amber-400">
                      Design Target
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-risk-low/20 text-risk-low border-risk-low/30">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      ~{metric.reduction}% target
                    </Badge>
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
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Proposed Study Methodology (Illustrative)
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
              <strong>Important:</strong> All results, statistics, and study parameters shown are illustrative 
              projections for demonstration purposes only. No clinical validation studies have been completed. 
              Actual outcomes will vary based on implementation context, patient population, and care team engagement. 
              This tool is designed to augment, not replace, clinical judgment.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
