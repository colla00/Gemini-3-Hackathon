// Linked DBS + ROI Calculator View
// Copyright © Dr. Alexis Collier - Patent Pending

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, DollarSign, Building2, Clock, TrendingUp, Users, Activity, 
  Heart, Pill, User, Link2, Unlink, Save, Trash2, BarChart3, Sparkles, 
  Shuffle, ArrowRight, Zap, ChevronDown, ChevronUp
} from 'lucide-react';
import { calculateDBS, getDBSQuartile, calculateROI, formatCurrency, formatCompactNumber } from '@/utils/dbsCalculations';
import { DBS_CALCULATION_FACTORS, RESEARCH_DATA } from '@/data/researchData';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LinkedCalculatorViewProps {
  className?: string;
}

interface LinkedScenario {
  id: string;
  name: string;
  // DBS factors
  apache: number;
  sofa: number;
  comorbidities: number;
  medications: number;
  age: number;
  dbsScore: number;
  quartile: ReturnType<typeof getDBSQuartile>;
  // Hospital factors
  bedCount: number;
  occupancy: number;
  hourlyRate: number;
  roi: ReturnType<typeof calculateROI>;
}

// Combined presets linking patient profiles with hospital types
const LINKED_PRESETS = [
  {
    id: 'community-typical',
    name: 'Community Hospital + Typical ICU',
    description: 'Standard community setting',
    // Patient
    apache: 18, sofa: 8, comorbidities: 4, medications: 12, age: 62,
    // Hospital
    bedCount: 35, occupancy: 75, hourlyRate: 42,
    color: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  },
  {
    id: 'academic-complex',
    name: 'Academic Center + Geriatric Complex',
    description: 'Teaching hospital with complex patients',
    apache: 28, sofa: 12, comorbidities: 7, medications: 18, age: 82,
    bedCount: 150, occupancy: 90, hourlyRate: 55,
    color: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  },
  {
    id: 'rural-post-surgical',
    name: 'Rural CAH + Post-Surgical',
    description: 'Critical access with surgical focus',
    apache: 10, sofa: 4, comorbidities: 2, medications: 8, age: 55,
    bedCount: 15, occupancy: 60, hourlyRate: 35,
    color: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
  },
  {
    id: 'tertiary-trauma',
    name: 'Urban Tertiary + Trauma Acute',
    description: 'Level 1 trauma center',
    apache: 32, sofa: 14, comorbidities: 1, medications: 15, age: 38,
    bedCount: 200, occupancy: 95, hourlyRate: 60,
    color: 'bg-red-500/20 text-red-600 border-red-500/30',
  },
  {
    id: 'cardiac-specialized',
    name: 'Cardiac Center + Cardiac ICU',
    description: 'Specialized cardiac unit',
    apache: 22, sofa: 10, comorbidities: 5, medications: 14, age: 68,
    bedCount: 40, occupancy: 85, hourlyRate: 52,
    color: 'bg-rose-500/20 text-rose-600 border-rose-500/30',
  },
  {
    id: 'regional-sepsis',
    name: 'Regional Center + Sepsis Severe',
    description: 'High-acuity sepsis management',
    apache: 35, sofa: 16, comorbidities: 4, medications: 20, age: 70,
    bedCount: 75, occupancy: 88, hourlyRate: 48,
    color: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
  },
];

export function LinkedCalculatorView({ className }: LinkedCalculatorViewProps) {
  // DBS state
  const [apache, setApache] = useState(18);
  const [sofa, setSofa] = useState(8);
  const [comorbidities, setComorbidities] = useState(4);
  const [medications, setMedications] = useState(12);
  const [age, setAge] = useState(62);

  // ROI state
  const [bedCount, setBedCount] = useState(50);
  const [occupancy, setOccupancy] = useState(85);
  const [hourlyRate, setHourlyRate] = useState(45);

  // Linking state
  const [isLinked, setIsLinked] = useState(true);
  const [savedScenarios, setSavedScenarios] = useState<LinkedScenario[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'presets' | null>('presets');

  // Calculate DBS score
  const dbsScore = useMemo(() => 
    calculateDBS({ apache, sofa, comorbidities, medications, age }), 
    [apache, sofa, comorbidities, medications, age]
  );
  const quartileInfo = useMemo(() => getDBSQuartile(dbsScore), [dbsScore]);

  // Calculate ROI
  const roi = useMemo(() => 
    calculateROI({ bedCount, avgOccupancy: occupancy, avgNurseHourlyRate: hourlyRate }),
    [bedCount, occupancy, hourlyRate]
  );

  // Estimated burden-adjusted savings (DBS affects ROI)
  const adjustedSavings = useMemo(() => {
    // Higher DBS = more benefit from the system
    const burdenMultiplier = 0.85 + (dbsScore / 100) * 0.30; // 0.85x to 1.15x
    return roi.annualSavings * burdenMultiplier;
  }, [roi.annualSavings, dbsScore]);

  const getScoreColor = (score: number) => {
    if (score < 25) return 'text-risk-low';
    if (score < 50) return 'text-warning';
    if (score < 75) return 'text-risk-medium';
    return 'text-risk-high';
  };

  const getComplexityLabel = (score: number) => {
    if (score < 25) return 'Low';
    if (score < 50) return 'Moderate';
    if (score < 75) return 'High';
    return 'Very High';
  };

  const loadPreset = useCallback((preset: typeof LINKED_PRESETS[0]) => {
    setApache(preset.apache);
    setSofa(preset.sofa);
    setComorbidities(preset.comorbidities);
    setMedications(preset.medications);
    setAge(preset.age);
    setBedCount(preset.bedCount);
    setOccupancy(preset.occupancy);
    setHourlyRate(preset.hourlyRate);
  }, []);

  const randomizeScenario = useCallback(() => {
    setApache(Math.floor(Math.random() * 40) + 5);
    setSofa(Math.floor(Math.random() * 18) + 2);
    setComorbidities(Math.floor(Math.random() * 8) + 1);
    setMedications(Math.floor(Math.random() * 20) + 5);
    setAge(Math.floor(Math.random() * 60) + 25);
    setBedCount(Math.floor(Math.random() * 180) + 20);
    setOccupancy(Math.floor(Math.random() * 40) + 60);
    setHourlyRate(Math.floor(Math.random() * 40) + 35);
  }, []);

  const saveScenario = useCallback(() => {
    if (savedScenarios.length >= 4) return;
    const newScenario: LinkedScenario = {
      id: crypto.randomUUID(),
      name: `Scenario ${savedScenarios.length + 1}`,
      apache, sofa, comorbidities, medications, age,
      dbsScore,
      quartile: quartileInfo,
      bedCount, occupancy, hourlyRate,
      roi,
    };
    setSavedScenarios(prev => [...prev, newScenario]);
    setShowComparison(true);
  }, [savedScenarios.length, apache, sofa, comorbidities, medications, age, dbsScore, quartileInfo, bedCount, occupancy, hourlyRate, roi]);

  const removeScenario = useCallback((id: string) => {
    setSavedScenarios(prev => prev.filter(s => s.id !== id));
  }, []);

  const loadScenario = useCallback((scenario: LinkedScenario) => {
    setApache(scenario.apache);
    setSofa(scenario.sofa);
    setComorbidities(scenario.comorbidities);
    setMedications(scenario.medications);
    setAge(scenario.age);
    setBedCount(scenario.bedCount);
    setOccupancy(scenario.occupancy);
    setHourlyRate(scenario.hourlyRate);
  }, []);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Link2 className="h-6 w-6 text-primary" />
            Linked Calculator View
          </h2>
          <p className="text-sm text-muted-foreground">
            Compare patient complexity with hospital ROI in unified scenarios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isLinked ? "default" : "outline"}
            onClick={() => setIsLinked(!isLinked)}
            className="gap-2"
          >
            {isLinked ? <Link2 className="h-4 w-4" /> : <Unlink className="h-4 w-4" />}
            {isLinked ? 'Linked' : 'Independent'}
          </Button>
          <Button size="sm" variant="outline" onClick={randomizeScenario}>
            <Shuffle className="h-4 w-4 mr-1" />
            Randomize
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={saveScenario}
            disabled={savedScenarios.length >= 4}
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          {savedScenarios.length > 0 && (
            <Button
              size="sm"
              variant={showComparison ? "default" : "outline"}
              onClick={() => setShowComparison(!showComparison)}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Compare
            </Button>
          )}
        </div>
      </div>

      {/* Linked Presets */}
      <Card>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'presets' ? null : 'presets')}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Quick Load Linked Scenarios
            </CardTitle>
            {expandedSection === 'presets' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CardHeader>
        <AnimatePresence>
          {expandedSection === 'presets' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {LINKED_PRESETS.map((preset) => {
                    const presetDbs = calculateDBS({
                      apache: preset.apache,
                      sofa: preset.sofa,
                      comorbidities: preset.comorbidities,
                      medications: preset.medications,
                      age: preset.age,
                    });
                    const presetRoi = calculateROI({
                      bedCount: preset.bedCount,
                      avgOccupancy: preset.occupancy,
                      avgNurseHourlyRate: preset.hourlyRate,
                    });
                    const isActive = 
                      apache === preset.apache && sofa === preset.sofa &&
                      comorbidities === preset.comorbidities &&
                      medications === preset.medications && age === preset.age &&
                      bedCount === preset.bedCount && occupancy === preset.occupancy &&
                      hourlyRate === preset.hourlyRate;

                    return (
                      <motion.button
                        key={preset.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => loadPreset(preset)}
                        className={cn(
                          "p-4 rounded-lg border text-left transition-all hover:shadow-md",
                          preset.color,
                          isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        )}
                      >
                        <p className="font-semibold text-sm">{preset.name}</p>
                        <p className="text-xs opacity-80 mb-3">{preset.description}</p>
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="secondary" className={cn("text-[10px]", getScoreColor(presetDbs))}>
                            DBS: {getComplexityLabel(presetDbs)}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] text-risk-low">
                            ${formatCompactNumber(presetRoi.annualSavings)}/yr
                          </Badge>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Side-by-Side Calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DBS Calculator */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Patient Complexity (DBS)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* DBS Score Display */}
            <motion.div 
              className="bg-gradient-to-r from-risk-low/10 via-warning/10 via-risk-medium/10 to-risk-high/10 rounded-lg p-4"
              key={dbsScore}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center mb-3">
                <p className={cn("text-3xl font-bold", getScoreColor(dbsScore))}>
                  {getComplexityLabel(dbsScore)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {quartileInfo.quartile}: {quartileInfo.label}
                </p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  Staffing: {quartileInfo.staffingRatio}
                </Badge>
              </div>
              <div className="relative h-2 bg-gradient-to-r from-risk-low via-warning via-risk-medium to-risk-high rounded-full">
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-background border-2 border-foreground rounded-full shadow"
                  animate={{ left: `calc(${dbsScore}% - 6px)` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            {/* DBS Sliders */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                    APACHE II
                  </label>
                  <span className="text-xs font-bold">{apache}</span>
                </div>
                <Slider value={[apache]} onValueChange={([v]) => setApache(v)} min={0} max={71} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                    SOFA Score
                  </label>
                  <span className="text-xs font-bold">{sofa}</span>
                </div>
                <Slider value={[sofa]} onValueChange={([v]) => setSofa(v)} min={0} max={24} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    Comorbidities
                  </label>
                  <span className="text-xs font-bold">{comorbidities}</span>
                </div>
                <Slider value={[comorbidities]} onValueChange={([v]) => setComorbidities(v)} min={0} max={10} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium flex items-center gap-1.5">
                    <Pill className="h-3.5 w-3.5 text-muted-foreground" />
                    Medications
                  </label>
                  <span className="text-xs font-bold">{medications}</span>
                </div>
                <Slider value={[medications]} onValueChange={([v]) => setMedications(v)} min={0} max={30} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Age
                  </label>
                  <span className="text-xs font-bold">{age}</span>
                </div>
                <Slider value={[age]} onValueChange={([v]) => setAge(v)} min={18} max={100} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI Calculator */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Hospital ROI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* ROI Results */}
            <motion.div 
              className="grid grid-cols-3 gap-3"
              key={`${bedCount}-${occupancy}-${hourlyRate}`}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
            >
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-center border border-green-200 dark:border-green-900">
                <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-600" />
                <p className="text-lg font-bold text-green-600">
                  ${formatCompactNumber(roi.annualSavings)}
                </p>
                <p className="text-[10px] text-muted-foreground">Annual Savings</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center border border-blue-200 dark:border-blue-900">
                <DollarSign className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                <p className="text-lg font-bold text-blue-600">
                  ${formatCompactNumber(roi.implementationCost)}
                </p>
                <p className="text-[10px] text-muted-foreground">One-time Cost</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg text-center border border-purple-200 dark:border-purple-900">
                <Clock className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                <p className="text-lg font-bold text-purple-600">
                  {roi.paybackMonths.toFixed(1)}
                </p>
                <p className="text-[10px] text-muted-foreground">Months Payback</p>
              </div>
            </motion.div>

            {/* Hospital Sliders */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    ICU Beds
                  </label>
                  <span className="text-xs font-bold">{bedCount}</span>
                </div>
                <Slider value={[bedCount]} onValueChange={([v]) => setBedCount(v)} min={10} max={200} step={5} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                    Occupancy
                  </label>
                  <span className="text-xs font-bold">{occupancy}%</span>
                </div>
                <Slider value={[occupancy]} onValueChange={([v]) => setOccupancy(v)} min={50} max={100} step={5} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    Hourly Rate
                  </label>
                  <span className="text-xs font-bold">${hourlyRate}</span>
                </div>
                <Slider value={[hourlyRate]} onValueChange={([v]) => setHourlyRate(v)} min={30} max={80} step={5} />
              </div>
            </div>

            {/* Linked Impact */}
            {isLinked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Burden-Adjusted Impact</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {getComplexityLabel(dbsScore)} complexity patients benefit more
                  </span>
                  <span className="text-lg font-bold text-primary">
                    ${formatCompactNumber(adjustedSavings)}/yr
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {dbsScore >= 50 ? '+' : ''}{((adjustedSavings / roi.annualSavings - 1) * 100).toFixed(0)}% vs base ROI
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scenario Comparison Panel */}
      <AnimatePresence>
        {showComparison && savedScenarios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Compare Linked Scenarios
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {savedScenarios.length}/4 saved
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {savedScenarios.map((scenario, index) => (
                    <motion.div
                      key={scenario.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "relative p-4 rounded-lg border-2 cursor-pointer transition-all bg-background hover:border-primary/50",
                        scenario.apache === apache && scenario.bedCount === bedCount
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

                      <p className="font-semibold text-sm mb-3 pr-6">{scenario.name}</p>

                      {/* DBS Summary */}
                      <div className="mb-3 pb-3 border-b border-border/30">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Patient</p>
                        <div className="flex items-center justify-between">
                          <span className={cn("text-sm font-bold", getScoreColor(scenario.dbsScore))}>
                            {getComplexityLabel(scenario.dbsScore)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {scenario.quartile.quartile}
                          </span>
                        </div>
                      </div>

                      {/* ROI Summary */}
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Hospital</p>
                        <div className="space-y-1">
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
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Comparison Summary */}
                {savedScenarios.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 pt-4 border-t border-border/30"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Highest Complexity</p>
                        <p className={cn("text-lg font-bold", getScoreColor(Math.max(...savedScenarios.map(s => s.dbsScore))))}>
                          {getComplexityLabel(Math.max(...savedScenarios.map(s => s.dbsScore)))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Lowest Complexity</p>
                        <p className={cn("text-lg font-bold", getScoreColor(Math.min(...savedScenarios.map(s => s.dbsScore))))}>
                          {getComplexityLabel(Math.min(...savedScenarios.map(s => s.dbsScore)))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Max Annual Savings</p>
                        <p className="text-lg font-bold text-green-600">
                          ${formatCompactNumber(Math.max(...savedScenarios.map(s => s.roi.annualSavings)))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Fastest Payback</p>
                        <p className="text-lg font-bold text-purple-600">
                          {Math.min(...savedScenarios.map(s => s.roi.paybackMonths)).toFixed(1)} mo
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
