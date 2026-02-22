import { useState, useEffect, useCallback, useRef } from 'react';
import { TrendingUp, DollarSign, Clock, Users, Zap, Award, ArrowRight, Play, Pause, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInvestorMetrics } from '@/hooks/useInvestorMetrics';
import { formatCurrency } from '@/utils/dbsCalculations';
import { HOSPITAL_PRESETS } from '@/data/hospitalPresets';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface InvestorModePanelProps {
  isActive: boolean;
  onNavigateToCalculator: (calc: 'dbs' | 'roi') => void;
}

const DEMO_INTERVAL_MS = 6000; // 6 seconds per preset

export const InvestorModePanel = ({ isActive, onNavigateToCalculator }: InvestorModePanelProps) => {
  const { roi, nurseTimeSaved, haiReduction, inputs, setInputs } = useInvestorMetrics();
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [currentPresetIndex, setCurrentPresetIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  // Current preset being displayed
  const currentPreset = HOSPITAL_PRESETS[currentPresetIndex];

  // Start/stop demo
  const toggleDemo = useCallback(() => {
    setIsDemoRunning(prev => !prev);
  }, []);

  // Skip to next preset
  const skipToNext = useCallback(() => {
    const nextIndex = (currentPresetIndex + 1) % HOSPITAL_PRESETS.length;
    setCurrentPresetIndex(nextIndex);
    setProgress(0);
    const preset = HOSPITAL_PRESETS[nextIndex];
    setInputs({
      bedCount: preset.bedCount,
      occupancy: preset.occupancy,
      hourlyRate: preset.hourlyRate,
    });
  }, [currentPresetIndex, setInputs]);

  // Auto-cycle through presets when demo is running
  useEffect(() => {
    if (isDemoRunning && isActive) {
      // Set initial preset
      const preset = HOSPITAL_PRESETS[currentPresetIndex];
      setInputs({
        bedCount: preset.bedCount,
        occupancy: preset.occupancy,
        hourlyRate: preset.hourlyRate,
      });

      // Progress animation
      progressRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 0;
          return prev + (100 / (DEMO_INTERVAL_MS / 50));
        });
      }, 50);

      // Cycle to next preset
      intervalRef.current = setInterval(() => {
        setCurrentPresetIndex(prev => {
          const nextIndex = (prev + 1) % HOSPITAL_PRESETS.length;
          const nextPreset = HOSPITAL_PRESETS[nextIndex];
          setInputs({
            bedCount: nextPreset.bedCount,
            occupancy: nextPreset.occupancy,
            hourlyRate: nextPreset.hourlyRate,
          });
          setProgress(0);
          return nextIndex;
        });
      }, DEMO_INTERVAL_MS);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (progressRef.current) clearInterval(progressRef.current);
      };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      setProgress(0);
    }
  }, [isDemoRunning, isActive, currentPresetIndex, setInputs]);

  // Stop demo when panel closes
  useEffect(() => {
    if (!isActive) {
      setIsDemoRunning(false);
    }
  }, [isActive]);

  // Define color styles for each metric to ensure proper Tailwind compilation
  const metricStyles = {
    savings: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/15',
      icon: 'text-emerald-500',
      value: 'text-emerald-500',
    },
    time: {
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/15',
      icon: 'text-blue-500',
      value: 'text-blue-500',
    },
    reduction: {
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/15',
      icon: 'text-purple-500',
      value: 'text-purple-500',
    },
    payback: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/15',
      icon: 'text-amber-500',
      value: 'text-amber-500',
    },
  };

  // ChartMinder patent metrics
  const chartMinderMetrics = {
    alertReduction: {
      border: 'border-primary/30',
      bg: 'bg-primary/15',
      icon: 'text-primary',
      value: 'text-primary',
    },
    expertAgreement: {
      border: 'border-chart-2/30',
      bg: 'bg-chart-2/15',
      icon: 'text-chart-2',
      value: 'text-chart-2',
    },
    cognitiveLoad: {
      border: 'border-risk-low/30',
      bg: 'bg-risk-low/15',
      icon: 'text-risk-low',
      value: 'text-risk-low',
    },
    trustScore: {
      border: 'border-chart-1/30',
      bg: 'bg-chart-1/15',
      icon: 'text-chart-1',
      value: 'text-chart-1',
    },
  };

  const keyMetrics = [
    {
      label: 'Projected Annual Savings',
      value: formatCurrency(roi.annualSavings),
      trend: `${inputs.bedCount} beds`,
      icon: DollarSign,
      styles: metricStyles.savings,
    },
    {
      label: 'Nurse Time Saved',
      value: `${nurseTimeSaved.toFixed(1)} hrs/shift`,
      trend: `${inputs.occupancy}% occupancy`,
      icon: Clock,
      styles: metricStyles.time,
    },
    {
      label: 'HAI Reduction',
      value: `${haiReduction}%`,
      trend: 'vs baseline',
      icon: TrendingUp,
      styles: metricStyles.reduction,
    },
    {
      label: 'Payback Period',
      value: `${roi.paybackMonths.toFixed(1)} mo`,
      trend: 'to ROI',
      icon: Users,
      styles: metricStyles.payback,
    },
  ];

  const patentMetrics = [
    {
      label: 'Alert Fatigue Reduction',
      value: '87%*',
      trend: 'ChartMinder (target)',
      icon: Zap,
      styles: chartMinderMetrics.alertReduction,
    },
    {
      label: 'Expert Agreement',
      value: '94%',
      trend: 'Neural Reasoning',
      icon: Award,
      styles: chartMinderMetrics.expertAgreement,
    },
    {
      label: 'Cognitive Load Saved',
      value: '2.3 min*',
      trend: 'per decision (target)',
      icon: Clock,
      styles: chartMinderMetrics.cognitiveLoad,
    },
    {
      label: 'Trust Score',
      value: '0.89',
      trend: 'composite',
      icon: TrendingUp,
      styles: chartMinderMetrics.trustScore,
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
          className="border-b border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 overflow-hidden"
        >
          <div className="px-4 py-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary/15 border border-primary/25 shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">Investor Mode</span>
                </div>
                
                {/* Quick Demo Controls */}
                <div className="flex items-center gap-1.5 ml-2">
                  <Button
                    size="sm"
                    variant={isDemoRunning ? "default" : "outline"}
                    className={cn(
                      "h-7 text-xs gap-1.5",
                      isDemoRunning && "bg-chart-2 hover:bg-chart-2/90"
                    )}
                    onClick={toggleDemo}
                  >
                    {isDemoRunning ? (
                      <>
                        <Pause className="w-3 h-3" />
                        Stop Demo
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        Quick Demo
                      </>
                    )}
                  </Button>
                  {isDemoRunning && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1"
                      onClick={skipToNext}
                    >
                      <SkipForward className="w-3 h-3" />
                      Skip
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToCalculator('dbs')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-all border border-purple-500/25 shadow-sm"
                >
                  <Award className="w-3.5 h-3.5" />
                  DBS Calculator
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onNavigateToCalculator('roi')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all border border-emerald-500/25 shadow-sm"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  ROI Calculator
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Demo Progress Bar */}
            <AnimatePresence>
              {isDemoRunning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <motion.span
                        key={currentPreset.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm font-semibold text-foreground"
                      >
                        {currentPreset.name}
                      </motion.span>
                      <span className="text-xs text-muted-foreground">
                        {currentPreset.description}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {currentPresetIndex + 1} / {HOSPITAL_PRESETS.length}
                    </span>
                  </div>
                  <Progress value={progress} className="h-1" />
                  
                  {/* Preset indicators */}
                  <div className="flex items-center gap-1 mt-2">
                    {HOSPITAL_PRESETS.map((preset, index) => (
                      <motion.button
                        key={preset.id}
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                        index === currentPresetIndex 
                            ? "w-6 bg-primary"
                            : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        )}
                        onClick={() => {
                          setCurrentPresetIndex(index);
                          setProgress(0);
                          setInputs({
                            bedCount: preset.bedCount,
                            occupancy: preset.occupancy,
                            hourlyRate: preset.hourlyRate,
                          });
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Financial Metrics Grid */}
            <div className="mb-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2 font-semibold flex items-center gap-1.5">
                <DollarSign className="w-3 h-3" />
                Financial Projections
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {keyMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border bg-background/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow",
                      metric.styles.border
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      metric.styles.bg
                    )}>
                      <metric.icon className={cn("w-5 h-5", metric.styles.icon)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide truncate font-medium">
                        {metric.label}
                      </p>
                      <motion.div 
                        key={metric.value}
                        initial={{ opacity: 0.5, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-baseline gap-2"
                      >
                        <span className={cn("text-lg font-bold tracking-tight", metric.styles.value)}>
                          {metric.value}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {metric.trend}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ChartMinder Patent Metrics Grid */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2 font-semibold flex items-center gap-1.5">
                <Award className="w-3 h-3" />
                ChartMinder Patent Innovations
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {patentMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.3 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border bg-background/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow",
                      metric.styles.border
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      metric.styles.bg
                    )}>
                      <metric.icon className={cn("w-5 h-5", metric.styles.icon)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide truncate font-medium">
                        {metric.label}
                      </p>
                      <motion.div 
                        key={metric.value}
                        initial={{ opacity: 0.5, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-baseline gap-2"
                      >
                        <span className={cn("text-lg font-bold tracking-tight", metric.styles.value)}>
                          {metric.value}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {metric.trend}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom highlight with live indicator */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg py-2 px-3">
              <motion.span 
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-medium">
                {isDemoRunning ? (
                  <>Auto-cycling through hospital scenarios</>
                ) : (
                  <>Based on {inputs.bedCount}-bed hospital at {inputs.occupancy}% occupancy, ${inputs.hourlyRate}/hr nurse rate</>
                )}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
