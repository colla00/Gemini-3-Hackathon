import { TrendingUp, DollarSign, Clock, Users, Zap, Award, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInvestorMetrics } from '@/hooks/useInvestorMetrics';
import { formatCurrency, formatCompactNumber } from '@/utils/dbsCalculations';

interface InvestorModePanelProps {
  isActive: boolean;
  onNavigateToCalculator: (calc: 'dbs' | 'roi') => void;
}

export const InvestorModePanel = ({ isActive, onNavigateToCalculator }: InvestorModePanelProps) => {
  const { roi, nurseTimeSaved, haiReduction, inputs } = useInvestorMetrics();

  const keyMetrics = [
    {
      label: 'Projected Annual Savings',
      value: formatCurrency(roi.annualSavings),
      trend: `${inputs.bedCount} beds`,
      icon: DollarSign,
      color: 'chart-1',
    },
    {
      label: 'Nurse Time Saved',
      value: `${nurseTimeSaved.toFixed(1)} hrs/shift`,
      trend: `${inputs.occupancy}% occupancy`,
      icon: Clock,
      color: 'chart-2',
    },
    {
      label: 'HAI Reduction',
      value: `${haiReduction}%`,
      trend: 'vs baseline',
      icon: TrendingUp,
      color: 'chart-3',
    },
    {
      label: 'Payback Period',
      value: `${roi.paybackMonths.toFixed(1)} mo`,
      trend: 'to ROI',
      icon: Users,
      color: 'chart-4',
    },
  ];

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
                <span className="text-xs text-muted-foreground">
                  Real-time projections • Adjust in ROI Calculator
                </span>
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
                    <motion.div 
                      key={metric.value}
                      initial={{ opacity: 0.5, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-baseline gap-2"
                    >
                      <span className={cn("text-lg font-bold", `text-${metric.color}`)}>
                        {metric.value}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {metric.trend}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom highlight with live indicator */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <motion.span 
                className="w-1.5 h-1.5 rounded-full bg-chart-1"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>
                Based on {inputs.bedCount}-bed hospital at {inputs.occupancy}% occupancy, ${inputs.hourlyRate}/hr nurse rate
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
