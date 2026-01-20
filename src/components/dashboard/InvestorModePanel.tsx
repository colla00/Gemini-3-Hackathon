import { TrendingUp, DollarSign, Clock, Users, Zap, Award, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InvestorModePanelProps {
  isActive: boolean;
  onNavigateToCalculator: (calc: 'dbs' | 'roi') => void;
}

const keyMetrics = [
  {
    label: 'Projected Annual Savings',
    value: '$2.4M',
    trend: '+18%',
    icon: DollarSign,
    color: 'chart-1',
  },
  {
    label: 'Nurse Time Saved',
    value: '4.2 hrs/shift',
    trend: '+32%',
    icon: Clock,
    color: 'chart-2',
  },
  {
    label: 'HAI Reduction',
    value: '47%',
    trend: 'vs baseline',
    icon: TrendingUp,
    color: 'chart-3',
  },
  {
    label: 'Patient Outcomes',
    value: 'Improved',
    trend: 'Significant',
    icon: Users,
    color: 'chart-4',
  },
];

export const InvestorModePanel = ({ isActive, onNavigateToCalculator }: InvestorModePanelProps) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="border-b border-chart-1/30 bg-gradient-to-r from-chart-1/5 via-chart-2/5 to-chart-1/5 overflow-hidden"
        >
          <div className="px-4 py-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-chart-1/20 border border-chart-1/30">
                  <Zap className="w-3.5 h-3.5 text-chart-1" />
                  <span className="text-xs font-bold text-chart-1 uppercase tracking-wide">Investor Mode</span>
                </div>
                <span className="text-xs text-muted-foreground">Key financial metrics at a glance</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToCalculator('dbs')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-chart-1/10 text-chart-1 hover:bg-chart-1/20 transition-colors border border-chart-1/30"
                >
                  <Award className="w-3.5 h-3.5" />
                  DBS Calculator
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onNavigateToCalculator('roi')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-chart-2/10 text-chart-2 hover:bg-chart-2/20 transition-colors border border-chart-2/30"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  ROI Calculator
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {keyMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border bg-background/80 backdrop-blur-sm",
                    `border-${metric.color}/30`
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    `bg-${metric.color}/15`
                  )}>
                    <metric.icon className={cn("w-5 h-5", `text-${metric.color}`)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide truncate">
                      {metric.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className={cn("text-lg font-bold", `text-${metric.color}`)}>
                        {metric.value}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {metric.trend}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom highlight */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-chart-1 animate-pulse" />
              <span>Based on 500-bed hospital model with typical ICU/Med-Surg mix</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
