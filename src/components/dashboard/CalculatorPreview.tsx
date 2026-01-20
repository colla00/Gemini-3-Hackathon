// Enhanced Calculator Preview for main dashboard
// Shows detailed metrics with inline quick-edit sliders

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, DollarSign, Calculator, ArrowRight, TrendingUp, 
  Building2, Users, Zap, Activity, Heart, Pill, User, Clock,
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { calculateDBS, getDBSQuartile, calculateROI, formatCurrency, formatCompactNumber } from '@/utils/dbsCalculations';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CalculatorPreviewProps {
  onOpenCalculators: () => void;
  className?: string;
}

export function CalculatorPreview({ onOpenCalculators, className }: CalculatorPreviewProps) {
  // DBS state with quick-edit
  const [apache, setApache] = useState(18);
  const [sofa, setSofa] = useState(8);
  const [comorbidities, setComorbidities] = useState(4);
  const [medications, setMedications] = useState(12);
  const [age, setAge] = useState(62);

  // ROI state with quick-edit
  const [bedCount, setBedCount] = useState(50);
  const [occupancy, setOccupancy] = useState(85);
  const [hourlyRate, setHourlyRate] = useState(45);

  // Expand state
  const [dbsExpanded, setDbsExpanded] = useState(false);
  const [roiExpanded, setRoiExpanded] = useState(false);

  const dbsScore = useMemo(() => 
    calculateDBS({ apache, sofa, comorbidities, medications, age }), 
    [apache, sofa, comorbidities, medications, age]
  );
  const quartileInfo = useMemo(() => getDBSQuartile(dbsScore), [dbsScore]);
  const roi = useMemo(() => 
    calculateROI({ bedCount, avgOccupancy: occupancy, avgNurseHourlyRate: hourlyRate }),
    [bedCount, occupancy, hourlyRate]
  );

  // Burden-adjusted savings
  const adjustedSavings = useMemo(() => {
    const burdenMultiplier = 0.85 + (dbsScore / 100) * 0.30;
    return roi.annualSavings * burdenMultiplier;
  }, [roi.annualSavings, dbsScore]);

  const getScoreColor = (score: number) => {
    if (score < 25) return 'text-risk-low';
    if (score < 50) return 'text-warning';
    if (score < 75) return 'text-risk-medium';
    return 'text-risk-high';
  };

  const getScoreBg = (score: number) => {
    if (score < 25) return 'bg-risk-low';
    if (score < 50) return 'bg-warning';
    if (score < 75) return 'bg-risk-medium';
    return 'bg-risk-high';
  };

  const getComplexityLabel = (score: number) => {
    if (score < 25) return 'Low';
    if (score < 50) return 'Moderate';
    if (score < 75) return 'High';
    return 'Very High';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn("", className)}
    >
      <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Research Calculators
                  <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary">
                    <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                    Live
                  </Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  DBS & ROI validated across 10K patients, 201 hospitals
                </p>
              </div>
            </div>
            <Button 
              onClick={onOpenCalculators}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              Full View
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Calculator Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* DBS Calculator Card */}
            <motion.div 
              className="bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden"
              layout
            >
              {/* DBS Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setDbsExpanded(!dbsExpanded)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Documentation Burden Score</span>
                  </div>
                  <motion.div
                    animate={{ rotate: dbsExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </div>

                {/* Score Display */}
                <div className="flex items-center gap-4 mb-3">
                  <div className={cn(
                    "text-3xl font-bold",
                    getScoreColor(dbsScore)
                  )}>
                    {getComplexityLabel(dbsScore)}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className={cn("text-[10px]", getScoreColor(dbsScore))}>
                      {quartileInfo.quartile}: {quartileInfo.label}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      Staffing: {quartileInfo.staffingRatio}
                    </Badge>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-gradient-to-r from-risk-low/20 via-warning/20 via-risk-medium/20 to-risk-high/20 rounded-full overflow-hidden">
                  <motion.div 
                    className={cn("h-full rounded-full", getScoreBg(dbsScore))}
                    initial={{ width: 0 }}
                    animate={{ width: `${dbsScore}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  <motion.div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-background border-2 border-foreground rounded-full shadow-lg"
                    animate={{ left: `calc(${dbsScore}% - 6px)` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Quick Factor Summary */}
                <div className="mt-3 grid grid-cols-5 gap-1 text-center">
                  <div className="text-[9px]">
                    <div className="font-bold text-foreground">{apache}</div>
                    <div className="text-muted-foreground">APACHE</div>
                  </div>
                  <div className="text-[9px]">
                    <div className="font-bold text-foreground">{sofa}</div>
                    <div className="text-muted-foreground">SOFA</div>
                  </div>
                  <div className="text-[9px]">
                    <div className="font-bold text-foreground">{comorbidities}</div>
                    <div className="text-muted-foreground">Comorb</div>
                  </div>
                  <div className="text-[9px]">
                    <div className="font-bold text-foreground">{medications}</div>
                    <div className="text-muted-foreground">Meds</div>
                  </div>
                  <div className="text-[9px]">
                    <div className="font-bold text-foreground">{age}</div>
                    <div className="text-muted-foreground">Age</div>
                  </div>
                </div>
              </div>

              {/* Expandable Sliders */}
              <AnimatePresence>
                {dbsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border/30"
                  >
                    <div className="p-4 space-y-4 bg-muted/10">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label className="flex items-center gap-1.5 font-medium">
                            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                            APACHE II Score
                          </label>
                          <span className="font-bold tabular-nums">{apache}</span>
                        </div>
                        <Slider 
                          value={[apache]} 
                          onValueChange={([v]) => setApache(v)} 
                          min={0} 
                          max={71} 
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label className="flex items-center gap-1.5 font-medium">
                            <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                            SOFA Score
                          </label>
                          <span className="font-bold tabular-nums">{sofa}</span>
                        </div>
                        <Slider 
                          value={[sofa]} 
                          onValueChange={([v]) => setSofa(v)} 
                          min={0} 
                          max={24}
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label className="flex items-center gap-1.5 font-medium">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            Comorbidities
                          </label>
                          <span className="font-bold tabular-nums">{comorbidities}</span>
                        </div>
                        <Slider 
                          value={[comorbidities]} 
                          onValueChange={([v]) => setComorbidities(v)} 
                          min={0} 
                          max={10}
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label className="flex items-center gap-1.5 font-medium">
                            <Pill className="h-3.5 w-3.5 text-muted-foreground" />
                            Medications
                          </label>
                          <span className="font-bold tabular-nums">{medications}</span>
                        </div>
                        <Slider 
                          value={[medications]} 
                          onValueChange={([v]) => setMedications(v)} 
                          min={0} 
                          max={30}
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label className="flex items-center gap-1.5 font-medium">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            Patient Age
                          </label>
                          <span className="font-bold tabular-nums">{age}</span>
                        </div>
                        <Slider 
                          value={[age]} 
                          onValueChange={([v]) => setAge(v)} 
                          min={18} 
                          max={100}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ROI Calculator Card */}
            <motion.div 
              className="bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden"
              layout
            >
              {/* ROI Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setRoiExpanded(!roiExpanded)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-risk-low" />
                    <span className="font-semibold">Hospital ROI Calculator</span>
                  </div>
                  <motion.div
                    animate={{ rotate: roiExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </div>

                {/* ROI Display */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center p-2 rounded-lg bg-risk-low/10 border border-risk-low/20">
                    <div className="text-lg font-bold text-risk-low">
                      {formatCurrency(roi.annualSavings)}
                    </div>
                    <div className="text-[9px] text-muted-foreground">Annual Savings</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <div className="text-lg font-bold text-foreground">
                      {formatCurrency(roi.implementationCost)}
                    </div>
                    <div className="text-[9px] text-muted-foreground">Implementation</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-lg font-bold text-primary">
                      {roi.paybackMonths.toFixed(1)}mo
                    </div>
                    <div className="text-[9px] text-muted-foreground">Payback</div>
                  </div>
                </div>

                {/* Savings Breakdown Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Savings Breakdown</span>
                    <span className="text-risk-low font-medium">{formatCompactNumber(roi.annualSavings)}/yr</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-muted/20">
                    <div 
                      className="bg-blue-500 transition-all" 
                      style={{ width: `${(roi.overtimeSavings / roi.annualSavings) * 100}%` }}
                      title="Overtime Savings"
                    />
                    <div 
                      className="bg-purple-500 transition-all" 
                      style={{ width: `${(roi.transferSavings / roi.annualSavings) * 100}%` }}
                      title="Transfer Savings"
                    />
                    <div 
                      className="bg-risk-low transition-all" 
                      style={{ width: `${(roi.mortalitySavings / roi.annualSavings) * 100}%` }}
                      title="Mortality Savings"
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Overtime
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      Transfers
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-risk-low" />
                      Mortality
                    </span>
                  </div>
                </div>

                {/* Quick Config Summary */}
                <div className="mt-3 grid grid-cols-3 gap-1 text-center">
                  <div className="text-[9px]">
                    <div className="font-bold text-foreground">{bedCount}</div>
                    <div className="text-muted-foreground">Beds</div>
                  </div>
                  <div className="text-[9px]">
                    <div className="font-bold text-foreground">{occupancy}%</div>
                    <div className="text-muted-foreground">Occupancy</div>
                  </div>
                  <div className="text-[9px]">
                    <div className="font-bold text-foreground">${hourlyRate}</div>
                    <div className="text-muted-foreground">Hourly</div>
                  </div>
                </div>
              </div>

              {/* Expandable Sliders */}
              <AnimatePresence>
                {roiExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border/30"
                  >
                    <div className="p-4 space-y-4 bg-muted/10">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label className="flex items-center gap-1.5 font-medium">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            ICU Bed Count
                          </label>
                          <span className="font-bold tabular-nums">{bedCount}</span>
                        </div>
                        <Slider 
                          value={[bedCount]} 
                          onValueChange={([v]) => setBedCount(v)} 
                          min={10} 
                          max={200}
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label className="flex items-center gap-1.5 font-medium">
                            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                            Average Occupancy
                          </label>
                          <span className="font-bold tabular-nums">{occupancy}%</span>
                        </div>
                        <Slider 
                          value={[occupancy]} 
                          onValueChange={([v]) => setOccupancy(v)} 
                          min={50} 
                          max={100}
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label className="flex items-center gap-1.5 font-medium">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            Nurse Hourly Rate
                          </label>
                          <span className="font-bold tabular-nums">${hourlyRate}</span>
                        </div>
                        <Slider 
                          value={[hourlyRate]} 
                          onValueChange={([v]) => setHourlyRate(v)} 
                          min={30} 
                          max={80}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Burden-Adjusted Impact Banner */}
          <motion.div 
            className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-risk-low/10 to-primary/10 border border-primary/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Burden-Adjusted Impact</div>
                  <div className="text-xs text-muted-foreground">
                    Higher patient complexity = greater system benefit
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Adjusted Savings</div>
                  <div className="text-xl font-bold text-risk-low">{formatCurrency(adjustedSavings)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Impact Multiplier</div>
                  <div className="text-xl font-bold text-primary">
                    {((0.85 + (dbsScore / 100) * 0.30) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Research Validation Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/20">
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                10,000 Patients
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                201 Hospitals
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-risk-low" />
                14% Mortality Reduction
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenCalculators}
              className="text-xs text-primary hover:text-primary"
            >
              Advanced Options →
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
