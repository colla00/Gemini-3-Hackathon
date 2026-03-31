import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Brain, Activity, Clock, Shield, TrendingUp } from 'lucide-react';

interface ComparisonRow {
  icon: React.ElementType;
  label: string;
  traditional: string;
  vitasignal: string;
}

const comparisons: ComparisonRow[] = [
  { icon: Brain, label: 'Validation Evidence', traditional: 'Demo-scale or single-site claims', vitasignal: '225K+ patients across international multi-center databases' },
  { icon: Shield, label: 'Governance Readiness', traditional: 'Compliance as afterthought or appendix', vitasignal: 'Audit trails, bias reviews, and procurement docs shipped as product' },
  { icon: Activity, label: 'Fairness & Equity', traditional: 'Cosmetic or absent bias testing', vitasignal: 'Continuous subgroup monitoring with <0.5% disparity alerting' },
  { icon: Clock, label: 'ROI Specificity', traditional: '"Better outcomes" — abstract claims', vitasignal: 'Six budget lines with baselines, targets, timelines, and owners' },
  { icon: TrendingUp, label: 'Pilot Design', traditional: 'Open-ended "innovation partnership"', vitasignal: 'Predefined operational & clinical endpoints with measurement plan' },
  { icon: AlertTriangle, label: 'Human Oversight', traditional: 'Black-box autonomous decisions', vitasignal: 'Advisory-only with override tracking, escalation logs, intended-use boundaries' },
];

export const ComparisonSlider = () => {
  return (
    <section className="py-20 px-6 bg-background" aria-label="VitaSignal vs Traditional EWS comparison">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Side-by-Side Comparison</p>
          <h2 className="font-display text-2xl md:text-4xl text-foreground mb-3">Traditional EWS vs VitaSignal™</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            See how equipment-independent clinical AI compares to legacy monitoring.
          </p>
        </motion.div>

        {/* Table header */}
        <div className="rounded-2xl border border-border/50 overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[1.2fr_1fr_1fr]">
            {/* Header row */}
            <div className="p-4 md:p-5 bg-muted/30 border-b border-border/50">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</span>
            </div>
            <div className="p-4 md:p-5 bg-muted/50 border-b border-l border-border/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                <span className="text-xs md:text-sm font-bold text-foreground">Traditional EWS</span>
              </div>
            </div>
            <div className="p-4 md:p-5 bg-primary/5 border-b border-l border-border/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs md:text-sm font-bold text-foreground">VitaSignal™</span>
              </div>
            </div>

            {/* Data rows */}
            {comparisons.map((row, i) => (
              <motion.div
                key={row.label}
                className="contents"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                {/* Label */}
                <div className={cn(
                  "p-4 md:p-5 flex items-start gap-2",
                  i < comparisons.length - 1 && "border-b border-border/30"
                )}>
                  <row.icon className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="text-xs md:text-sm font-semibold text-foreground">{row.label}</span>
                </div>

                {/* Traditional */}
                <div className={cn(
                  "p-4 md:p-5 bg-muted/20 border-l border-border/30",
                  i < comparisons.length - 1 && "border-b border-border/30"
                )}>
                  <p className="text-xs md:text-sm text-foreground/70">{row.traditional}</p>
                </div>

                {/* VitaSignal */}
                <div className={cn(
                  "p-4 md:p-5 bg-primary/5 border-l border-border/30",
                  i < comparisons.length - 1 && "border-b border-border/30"
                )}>
                  <p className="text-xs md:text-sm text-foreground font-medium">{row.vitasignal}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
