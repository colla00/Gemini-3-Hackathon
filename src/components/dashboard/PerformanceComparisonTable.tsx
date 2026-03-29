import { CheckCircle, TrendingUp, ArrowRight, Clock, FileCheck, ShieldAlert, Scale, FileX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface OutcomeMetric {
  id: string;
  name: string;
  budgetLine: string;
  before: string;
  after: string;
  source: string;
  icon: typeof Clock;
}

const outcomeMetrics: OutcomeMetric[] = [
  {
    id: 'nurse-time',
    name: 'Nurse Documentation Time',
    budgetLine: 'Nursing Labor',
    before: '~40% of shift on documentation',
    after: '34 min saved/nurse/shift',
    source: 'SEDR model · 131K patient-stays',
    icon: Clock,
  },
  {
    id: 'doc-completeness',
    name: 'Documentation Completeness',
    budgetLine: 'CMS Quality Penalties',
    before: '~78% baseline completeness',
    after: '92% target (+14pp lift)',
    source: 'DBS model · documentation pattern analysis',
    icon: FileCheck,
  },
  {
    id: 'safety-events',
    name: 'Failure-to-Rescue Detection',
    budgetLine: 'Patient Safety / Liability',
    before: '3.2% national FTR rate',
    after: '18% projected FTR reduction',
    source: 'IDI model · 225K patients · 172 hospitals',
    icon: ShieldAlert,
  },
  {
    id: 'denials',
    name: 'Claim Denial Rework',
    budgetLine: 'Revenue Cycle',
    before: '~8.5% denial rate',
    after: '22% denial reduction projected',
    source: 'Documentation completeness → denial correlation',
    icon: FileX,
  },
  {
    id: 'fairness',
    name: 'Demographic Disparity',
    budgetLine: 'CMS Equity Compliance',
    before: 'Variable / unmeasured',
    after: '<0.5% disparity target',
    source: 'Subgroup fairness monitoring built-in',
    icon: Scale,
  },
];

export const PerformanceComparisonTable = () => {
  return (
    <TooltipProvider>
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-risk-low/10 border border-risk-low/20">
                <TrendingUp className="w-4 h-4 text-risk-low" />
              </div>
              <div>
                <CardTitle className="text-base">Measurable Outcomes by Budget Line</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Each outcome maps to a cost center your finance team can verify
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] bg-amber-500/10 border-amber-500/30 text-amber-500">
              Design Targets
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Outcome rows */}
          <div className="bg-secondary/20 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 p-3 bg-secondary/40 border-b border-border/30">
              <div className="col-span-3 text-[10px] font-semibold text-muted-foreground uppercase">Outcome</div>
              <div className="col-span-2 text-[10px] font-semibold text-muted-foreground uppercase text-center">Budget Line</div>
              <div className="col-span-3 text-[10px] font-semibold text-muted-foreground uppercase text-center">Before</div>
              <div className="col-span-1 text-center">
                <ArrowRight className="w-3 h-3 text-muted-foreground mx-auto" />
              </div>
              <div className="col-span-3 text-[10px] font-semibold text-primary uppercase text-center">After</div>
            </div>

            {/* Rows */}
            {outcomeMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <Tooltip key={metric.id}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={cn(
                        "grid grid-cols-12 gap-2 p-3 items-center cursor-default",
                        idx % 2 === 0 ? "bg-secondary/10" : ""
                      )}
                    >
                      <div className="col-span-3 flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs font-medium text-foreground">{metric.name}</span>
                      </div>
                      <div className="col-span-2 text-center">
                        <Badge variant="outline" className="text-[9px] bg-muted/30 border-border/40 text-muted-foreground">
                          {metric.budgetLine}
                        </Badge>
                      </div>
                      <div className="col-span-3 text-center">
                        <span className="text-xs text-risk-high/80">{metric.before}</span>
                      </div>
                      <div className="col-span-1 text-center">
                        <ArrowRight className="w-3 h-3 text-muted-foreground mx-auto" />
                      </div>
                      <div className="col-span-3 text-center">
                        <span className="text-xs text-risk-low font-bold">{metric.after}</span>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{metric.name}</p>
                    <p className="text-xs text-muted-foreground">{metric.source}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Key differentiators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-chart-1/10 to-chart-2/10 rounded-xl p-3 text-center border border-chart-1/20">
              <CheckCircle className="w-4 h-4 text-chart-1 mx-auto mb-1" />
              <div className="text-xs font-bold text-foreground">Auditable</div>
              <div className="text-[9px] text-muted-foreground">SHAP explanations per prediction</div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-chart-2/10 rounded-xl p-3 text-center border border-primary/20">
              <Scale className="w-4 h-4 text-primary mx-auto mb-1" />
              <div className="text-xs font-bold text-foreground">Fairness-Tested</div>
              <div className="text-[9px] text-muted-foreground">Subgroup monitoring built-in</div>
            </div>
            <div className="bg-gradient-to-br from-risk-low/10 to-chart-1/10 rounded-xl p-3 text-center border border-risk-low/20">
              <Clock className="w-4 h-4 text-risk-low mx-auto mb-1" />
              <div className="text-xs font-bold text-foreground">Governance-Ready</div>
              <div className="text-[9px] text-muted-foreground">Committee-ready reporting</div>
            </div>
          </div>

          {/* Methodology note */}
          <div className="bg-secondary/20 rounded-lg p-2.5 text-center border border-border/30">
            <p className="text-[9px] text-muted-foreground">
              ⚠️ Projections based on validated models (IDI, DBS, SEDR) and published benchmarks (BLS, AHRQ, CMS).
              No prospective study conducted. Actual results depend on baseline performance and implementation scope.
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
