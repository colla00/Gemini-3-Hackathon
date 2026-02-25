// ROI Calculator Component
// Copyright © Dr. Alexis Collier - Patent Application Pending

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Building2, Clock, TrendingUp, Users, Activity, Save, Trash2, BarChart3, Sparkles } from 'lucide-react';
import { calculateROI, formatCurrency, formatCompactNumber } from '@/utils/dbsCalculations';
import { RESEARCH_DATA } from '@/data/researchData';
import { HOSPITAL_PRESETS, PRESET_COLORS } from '@/data/hospitalPresets';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInvestorMetrics } from '@/hooks/useInvestorMetrics';
import { PatentBadge } from '@/components/quality/PatentNotice';

interface ROICalculatorProps {
  className?: string;
  compact?: boolean;
}

interface SavedScenario {
  id: string;
  name: string;
  bedCount: number;
  occupancy: number;
  hourlyRate: number;
  roi: ReturnType<typeof calculateROI>;
}
// Use shared presets with color mapping
const getPresetWithColor = (preset: typeof HOSPITAL_PRESETS[0]) => ({
  ...preset,
  color: PRESET_COLORS[preset.id] || 'bg-gray-500/20 text-gray-600 border-gray-500/30',
});

export function ROICalculator({ className, compact = false }: ROICalculatorProps) {
  // Get shared investor metrics context
  const investorMetrics = useInvestorMetrics();
  
  // Local state initialized from context
  const [bedCount, setBedCount] = useState(investorMetrics.inputs.bedCount);
  const [occupancy, setOccupancy] = useState(investorMetrics.inputs.occupancy);
  const [hourlyRate, setHourlyRate] = useState(investorMetrics.inputs.hourlyRate);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Sync local state changes to investor metrics context
  useEffect(() => {
    investorMetrics.updateInputs({ bedCount, occupancy, hourlyRate });
  }, [bedCount, occupancy, hourlyRate, investorMetrics]);

  const roi = useMemo(() => 
    calculateROI({
      bedCount,
      avgOccupancy: occupancy,
      avgNurseHourlyRate: hourlyRate,
    }),
    [bedCount, occupancy, hourlyRate]
  );

  const saveScenario = () => {
    if (savedScenarios.length >= 4) return; // Max 4 scenarios
    const newScenario: SavedScenario = {
      id: crypto.randomUUID(),
      name: `Scenario ${savedScenarios.length + 1}`,
      bedCount,
      occupancy,
      hourlyRate,
      roi,
    };
    setSavedScenarios([...savedScenarios, newScenario]);
    setShowComparison(true);
  };

  const removeScenario = (id: string) => {
    setSavedScenarios(savedScenarios.filter(s => s.id !== id));
    if (savedScenarios.length <= 1) setShowComparison(false);
  };

  const loadScenario = (scenario: SavedScenario) => {
    setBedCount(scenario.bedCount);
    setOccupancy(scenario.occupancy);
    setHourlyRate(scenario.hourlyRate);
  };

  const loadPreset = (preset: typeof HOSPITAL_PRESETS[0]) => {
    setBedCount(preset.bedCount);
    setOccupancy(preset.occupancy);
    setHourlyRate(preset.hourlyRate);
  };

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            ROI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-lg font-bold text-green-600">
                ${formatCompactNumber(roi.annualSavings)}
              </p>
              <p className="text-xs text-muted-foreground">Annual</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-lg font-bold text-blue-600">
                ${formatCompactNumber(roi.implementationCost)}
              </p>
              <p className="text-xs text-muted-foreground">Cost</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <p className="text-lg font-bold text-purple-600">
                {roi.paybackMonths.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Months</p>
            </div>
          </div>
          {savedScenarios.length > 0 && (
            <p className="text-xs text-center text-muted-foreground">
              {savedScenarios.length} scenario{savedScenarios.length > 1 ? 's' : ''} saved
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              ROI Calculator
            </CardTitle>
            <PatentBadge contextPatent="dbs" className="mt-1" />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Research Validated
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={saveScenario}
              disabled={savedScenarios.length >= 4}
              className="h-7 text-xs"
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            {savedScenarios.length > 0 && (
              <Button
                size="sm"
                variant={showComparison ? "default" : "outline"}
                onClick={() => setShowComparison(!showComparison)}
                className="h-7 text-xs"
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Compare
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Calculate estimated savings for your hospital
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hospital Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Quick Load Presets
            </h4>
            <span className="text-xs text-muted-foreground">Click to apply</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {HOSPITAL_PRESETS.map((preset) => {
              const presetWithColor = getPresetWithColor(preset);
              const presetRoi = calculateROI({
                bedCount: preset.bedCount,
                avgOccupancy: preset.occupancy,
                avgNurseHourlyRate: preset.hourlyRate,
              });
              return (
                <motion.button
                  key={preset.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => loadPreset(preset)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all hover:shadow-md",
                    presetWithColor.color,
                    bedCount === preset.bedCount && 
                    occupancy === preset.occupancy && 
                    hourlyRate === preset.hourlyRate
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : ""
                  )}
                >
                  <p className="font-medium text-sm">{preset.name}</p>
                  <p className="text-xs opacity-80">{preset.description}</p>
                  <Badge variant="secondary" className="mt-2 text-[10px] text-risk-low">
                    ${formatCompactNumber(presetRoi.annualSavings)}/yr
                  </Badge>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Input Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                ICU Beds
              </label>
              <span className="text-sm font-bold">{bedCount}</span>
            </div>
            <Slider
              value={[bedCount]}
              onValueChange={([value]) => setBedCount(value)}
              min={10}
              max={200}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Occupancy
              </label>
              <span className="text-sm font-bold">{occupancy}%</span>
            </div>
            <Slider
              value={[occupancy]}
              onValueChange={([value]) => setOccupancy(value)}
              min={50}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Hourly Rate
              </label>
              <span className="text-sm font-bold">${hourlyRate}</span>
            </div>
            <Slider
              value={[hourlyRate]}
              onValueChange={([value]) => setHourlyRate(value)}
              min={30}
              max={80}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Results */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          key={`${bedCount}-${occupancy}-${hourlyRate}`}
          initial={{ opacity: 0.8, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg text-center border border-green-200 dark:border-green-900">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-muted-foreground mb-1">Annual Savings</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(roi.annualSavings)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Per year</p>
          </div>

          <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center border border-blue-200 dark:border-blue-900">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-muted-foreground mb-1">Implementation Cost</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(roi.implementationCost)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">One-time</p>
          </div>

          <div className="p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg text-center border border-purple-200 dark:border-purple-900">
            <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-muted-foreground mb-1">Payback Period</p>
            <p className="text-3xl font-bold text-purple-600">
              {roi.paybackMonths.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Months</p>
          </div>
        </motion.div>

        {/* Scenario Comparison Panel */}
        <AnimatePresence>
          {showComparison && savedScenarios.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Compare Scenarios
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {savedScenarios.length}/4 saved
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <AnimatePresence>
                    {savedScenarios.map((scenario, index) => (
                      <motion.div
                        key={scenario.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "relative p-3 rounded-lg border-2 cursor-pointer transition-all",
                          "bg-background hover:border-primary/50",
                          scenario.bedCount === bedCount && 
                          scenario.occupancy === occupancy && 
                          scenario.hourlyRate === hourlyRate
                            ? "border-primary"
                            : "border-border/50"
                        )}
                        onClick={() => loadScenario(scenario)}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeScenario(scenario.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        
                        <p className="font-medium text-sm mb-2 pr-6">{scenario.name}</p>
                        
                        <div className="space-y-1 text-xs text-muted-foreground mb-3">
                          <div className="flex justify-between">
                            <span>Beds:</span>
                            <span className="font-medium text-foreground">{scenario.bedCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Occupancy:</span>
                            <span className="font-medium text-foreground">{scenario.occupancy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rate:</span>
                            <span className="font-medium text-foreground">${scenario.hourlyRate}/hr</span>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-border/30">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Savings</span>
                            <span className="text-sm font-bold text-green-600">
                              ${formatCompactNumber(scenario.roi.annualSavings)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Payback</span>
                            <span className="text-sm font-bold text-purple-600">
                              {scenario.roi.paybackMonths.toFixed(1)}mo
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Comparison Summary */}
                {savedScenarios.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 pt-4 border-t border-border/30"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Best Savings</p>
                        <p className="text-lg font-bold text-green-600">
                          ${formatCompactNumber(Math.max(...savedScenarios.map(s => s.roi.annualSavings)))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Fastest Payback</p>
                        <p className="text-lg font-bold text-purple-600">
                          {Math.min(...savedScenarios.map(s => s.roi.paybackMonths)).toFixed(1)}mo
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Avg Savings</p>
                        <p className="text-lg font-bold text-blue-600">
                          ${formatCompactNumber(
                            savedScenarios.reduce((sum, s) => sum + s.roi.annualSavings, 0) / savedScenarios.length
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Scenarios</p>
                        <p className="text-lg font-bold text-foreground">
                          {savedScenarios.length}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Savings Breakdown */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-4 text-sm">Savings Breakdown</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Overtime Reduction ({RESEARCH_DATA.dbs.overtimeReduction[0]}-{RESEARCH_DATA.dbs.overtimeReduction[1]}%)
              </span>
              <span className="font-semibold">{formatCurrency(roi.overtimeSavings)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Transfer Reduction (8-15%)
              </span>
              <span className="font-semibold">{formatCurrency(roi.transferSavings)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Mortality Reduction ({(RESEARCH_DATA.roi.projectedMortalityReduction * 100).toFixed(0)}% projected)
              </span>
              <span className="font-semibold">{formatCurrency(roi.mortalitySavings)}</span>
            </div>
            <div className="border-t pt-3 mt-3 flex justify-between font-bold">
              <span>Total Annual Savings (Projected)</span>
              <span className="text-green-600">{formatCurrency(roi.annualSavings)}</span>
            </div>
          </div>
        </div>

        {/* Research Note */}
        <p className="text-xs text-muted-foreground text-center">
          Illustrative projections based on literature review • No clinical validation conducted
        </p>
      </CardContent>
    </Card>
  );
}

export default ROICalculator;
