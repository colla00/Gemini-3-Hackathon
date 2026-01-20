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

const DEMO_INTERVAL_MS = 4000; // 4 seconds per preset

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
                            ? "w-6 bg-chart-1" 
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
