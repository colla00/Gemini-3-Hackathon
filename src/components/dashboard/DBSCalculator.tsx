// DBS (Documentation Burden Score) Calculator Component
// Copyright © Dr. Alexis Collier - Patent Pending

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FileText, Activity, Heart, Pill, User, Users, Save, Trash2, BarChart3, Sparkles, Shuffle } from 'lucide-react';
import { calculateDBS, getDBSQuartile } from '@/utils/dbsCalculations';
import { DBS_CALCULATION_FACTORS, RESEARCH_DATA } from '@/data/researchData';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DBSCalculatorProps {
  className?: string;
  compact?: boolean;
  onScoreChange?: (score: number, quartile: string) => void;
}

interface SavedProfile {
  id: string;
  name: string;
  apache: number;
  sofa: number;
  comorbidities: number;
  medications: number;
  age: number;
  score: number;
  quartile: ReturnType<typeof getDBSQuartile>;
}

// Preset patient profiles for quick loading
const PRESET_PROFILES = [
  {
    id: 'typical-icu',
    name: 'Typical ICU',
    description: 'Average ICU patient',
    apache: 18,
    sofa: 8,
    comorbidities: 4,
    medications: 12,
    age: 62,
    color: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  },
  {
    id: 'post-surgical',
    name: 'Post-Surgical',
    description: 'Routine post-op recovery',
    apache: 10,
    sofa: 4,
    comorbidities: 2,
    medications: 8,
    age: 55,
    color: 'bg-green-500/20 text-green-600 border-green-500/30',
  },
  {
    id: 'geriatric-complex',
    name: 'Geriatric Complex',
    description: 'Elderly with multiple conditions',
    apache: 28,
    sofa: 12,
    comorbidities: 7,
    medications: 18,
    age: 82,
    color: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
  },
  {
    id: 'trauma-acute',
    name: 'Trauma Acute',
    description: 'Severe trauma admission',
    apache: 32,
    sofa: 14,
    comorbidities: 1,
    medications: 15,
    age: 38,
    color: 'bg-red-500/20 text-red-600 border-red-500/30',
  },
  {
    id: 'cardiac-icu',
    name: 'Cardiac ICU',
    description: 'Post-MI or cardiac surgery',
    apache: 22,
    sofa: 10,
    comorbidities: 5,
    medications: 14,
    age: 68,
    color: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  },
  {
    id: 'sepsis-severe',
    name: 'Sepsis Severe',
    description: 'Septic shock patient',
    apache: 35,
    sofa: 16,
    comorbidities: 4,
    medications: 20,
    age: 70,
    color: 'bg-rose-500/20 text-rose-600 border-rose-500/30',
  },
];

export function DBSCalculator({ className, compact = false, onScoreChange }: DBSCalculatorProps) {
  const [apache, setApache] = useState(DBS_CALCULATION_FACTORS[0].default);
  const [sofa, setSofa] = useState(DBS_CALCULATION_FACTORS[1].default);
  const [comorbidities, setComorbidities] = useState(DBS_CALCULATION_FACTORS[2].default);
  const [medications, setMedications] = useState(DBS_CALCULATION_FACTORS[3].default);
  const [age, setAge] = useState(DBS_CALCULATION_FACTORS[4].default);
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const dbsScore = useMemo(() => {
    const score = calculateDBS({ apache, sofa, comorbidities, medications, age });
    const quartileInfo = getDBSQuartile(score);
    onScoreChange?.(score, quartileInfo.quartile);
    return score;
  }, [apache, sofa, comorbidities, medications, age, onScoreChange]);

  const quartileInfo = useMemo(() => getDBSQuartile(dbsScore), [dbsScore]);

  const saveProfile = () => {
    if (savedProfiles.length >= 4) return;
    const newProfile: SavedProfile = {
      id: crypto.randomUUID(),
      name: `Profile ${savedProfiles.length + 1}`,
      apache,
      sofa,
      comorbidities,
      medications,
      age,
      score: dbsScore,
      quartile: quartileInfo,
    };
    setSavedProfiles([...savedProfiles, newProfile]);
    setShowComparison(true);
  };

  const removeProfile = (id: string) => {
    setSavedProfiles(savedProfiles.filter(p => p.id !== id));
    if (savedProfiles.length <= 1) setShowComparison(false);
  };

  const loadProfile = (profile: SavedProfile) => {
    setApache(profile.apache);
    setSofa(profile.sofa);
    setComorbidities(profile.comorbidities);
    setMedications(profile.medications);
    setAge(profile.age);
  };

  const loadPreset = (preset: typeof PRESET_PROFILES[0]) => {
    setApache(preset.apache);
    setSofa(preset.sofa);
    setComorbidities(preset.comorbidities);
    setMedications(preset.medications);
    setAge(preset.age);
  };

  const randomizeProfile = () => {
    // Generate random values within realistic clinical ranges
    setApache(Math.floor(Math.random() * 40) + 5); // 5-44
    setSofa(Math.floor(Math.random() * 18) + 2); // 2-19
    setComorbidities(Math.floor(Math.random() * 8) + 1); // 1-8
    setMedications(Math.floor(Math.random() * 20) + 5); // 5-24
    setAge(Math.floor(Math.random() * 60) + 25); // 25-84
  };

  const getScoreColor = (score: number) => {
    if (score < 25) return 'text-risk-low';
    if (score < 50) return 'text-warning';
    if (score < 75) return 'text-risk-medium';
    return 'text-risk-high';
  };

  const getScoreBgColor = (score: number) => {
    if (score < 25) return 'bg-risk-low/20';
    if (score < 50) return 'bg-warning/20';
    if (score < 75) return 'bg-risk-medium/20';
    return 'bg-risk-high/20';
  };

  const getComplexityLabel = (score: number) => {
    if (score < 25) return 'Low';
    if (score < 50) return 'Moderate';
    if (score < 75) return 'High';
    return 'Very High';
  };

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            DBS Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className={`text-3xl font-bold ${getScoreColor(dbsScore)}`}>
              {getComplexityLabel(dbsScore)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {quartileInfo.quartile}: {quartileInfo.label}
            </p>
            <div className="mt-2">
              <Progress 
                value={dbsScore} 
                className="h-2" 
              />
            </div>
            {savedProfiles.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {savedProfiles.length} profile{savedProfiles.length > 1 ? 's' : ''} saved
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Documentation Burden Score
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              ANIA 2026 Research
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={saveProfile}
              disabled={savedProfiles.length >= 4}
              className="h-7 text-xs"
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={randomizeProfile}
              className="h-7 text-xs"
            >
              <Shuffle className="h-3 w-3 mr-1" />
              Random
            </Button>
            {savedProfiles.length > 0 && (
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
          {RESEARCH_DATA.validation.internalPatients.toLocaleString()} patients validated
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Profiles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Quick Load Presets
            </h4>
            <span className="text-xs text-muted-foreground">Click to apply</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {PRESET_PROFILES.map((preset) => {
              const presetScore = calculateDBS({
                apache: preset.apache,
                sofa: preset.sofa,
                comorbidities: preset.comorbidities,
                medications: preset.medications,
                age: preset.age,
              });
              return (
                <motion.button
                  key={preset.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => loadPreset(preset)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all hover:shadow-md",
                    preset.color,
                    apache === preset.apache && 
                    sofa === preset.sofa && 
                    comorbidities === preset.comorbidities &&
                    medications === preset.medications &&
                    age === preset.age
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : ""
                  )}
                >
                  <p className="font-medium text-sm">{preset.name}</p>
                  <p className="text-xs opacity-80">{preset.description}</p>
                  <Badge 
                    variant="secondary" 
                    className={cn("mt-2 text-[10px]", getScoreColor(presetScore))}
                  >
                    {getComplexityLabel(presetScore)}
                  </Badge>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Score Display */}
        <motion.div 
          className="bg-gradient-to-r from-risk-low/10 via-warning/10 via-risk-medium/10 to-risk-high/10 rounded-lg p-6"
          key={dbsScore}
          initial={{ opacity: 0.8, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-center mb-4">
            <p className={`text-4xl font-bold ${getScoreColor(dbsScore)}`}>
              {getComplexityLabel(dbsScore)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {quartileInfo.quartile}: {quartileInfo.label}
            </p>
            <Badge variant="secondary" className="mt-2">
              Staffing: {quartileInfo.staffingRatio}
            </Badge>
          </div>
          <div className="relative h-3 bg-gradient-to-r from-risk-low via-warning via-risk-medium to-risk-high rounded-full">
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 border-foreground rounded-full shadow-lg"
              animate={{ left: `calc(${dbsScore}% - 8px)` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Q1: Low</span>
            <span>Q2: Moderate</span>
            <span>Q3: High</span>
            <span>Q4: Very High</span>
          </div>
        </motion.div>

        {/* Scenario Comparison Panel */}
        <AnimatePresence>
          {showComparison && savedProfiles.length > 0 && (
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
                    Compare Patient Profiles
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {savedProfiles.length}/4 saved
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <AnimatePresence>
                    {savedProfiles.map((profile, index) => (
                      <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "relative p-3 rounded-lg border-2 cursor-pointer transition-all",
                          "bg-background hover:border-primary/50",
                          profile.apache === apache && 
                          profile.sofa === sofa && 
                          profile.comorbidities === comorbidities &&
                          profile.medications === medications &&
                          profile.age === age
                            ? "border-primary"
                            : "border-border/50"
                        )}
                        onClick={() => loadProfile(profile)}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeProfile(profile.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        
                        <p className="font-medium text-sm mb-2 pr-6">{profile.name}</p>
                        
                        <div className="space-y-1 text-xs text-muted-foreground mb-3">
                          <div className="flex justify-between">
                            <span>APACHE:</span>
                            <span className="font-medium text-foreground">{profile.apache}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SOFA:</span>
                            <span className="font-medium text-foreground">{profile.sofa}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Comorbidities:</span>
                            <span className="font-medium text-foreground">{profile.comorbidities}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Medications:</span>
                            <span className="font-medium text-foreground">{profile.medications}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Age:</span>
                            <span className="font-medium text-foreground">{profile.age}</span>
                          </div>
                        </div>
                        
                        <div className={cn(
                          "pt-2 border-t border-border/30 text-center rounded",
                          getScoreBgColor(profile.score)
                        )}>
                          <span className={cn("text-sm font-bold", getScoreColor(profile.score))}>
                            {getComplexityLabel(profile.score)}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {profile.quartile.quartile}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Comparison Summary */}
                {savedProfiles.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 pt-4 border-t border-border/30"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Highest Complexity</p>
                        <p className={cn(
                          "text-lg font-bold",
                          getScoreColor(Math.max(...savedProfiles.map(p => p.score)))
                        )}>
                          {getComplexityLabel(Math.max(...savedProfiles.map(p => p.score)))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Lowest Complexity</p>
                        <p className={cn(
                          "text-lg font-bold",
                          getScoreColor(Math.min(...savedProfiles.map(p => p.score)))
                        )}>
                          {getComplexityLabel(Math.min(...savedProfiles.map(p => p.score)))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Avg Age</p>
                        <p className="text-lg font-bold text-foreground">
                          {Math.round(savedProfiles.reduce((sum, p) => sum + p.age, 0) / savedProfiles.length)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Profiles</p>
                        <p className="text-lg font-bold text-foreground">
                          {savedProfiles.length}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Factor Sliders */}
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                APACHE II Score
                <span className="text-xs text-muted-foreground">(Strong influence)</span>
              </label>
              <span className="text-sm font-bold">{apache}</span>
            </div>
            <Slider
              value={[apache]}
              onValueChange={([value]) => setApache(value)}
              min={0}
              max={71}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                SOFA Score
                <span className="text-xs text-muted-foreground">(Strong influence)</span>
              </label>
              <span className="text-sm font-bold">{sofa}</span>
            </div>
            <Slider
              value={[sofa]}
              onValueChange={([value]) => setSofa(value)}
              min={0}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Comorbidities
                <span className="text-xs text-muted-foreground">(Moderate influence)</span>
              </label>
              <span className="text-sm font-bold">{comorbidities}</span>
            </div>
            <Slider
              value={[comorbidities]}
              onValueChange={([value]) => setComorbidities(value)}
              min={0}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Pill className="h-4 w-4 text-muted-foreground" />
                Active Medications
                <span className="text-xs text-muted-foreground">(Moderate influence)</span>
              </label>
              <span className="text-sm font-bold">{medications}</span>
            </div>
            <Slider
              value={[medications]}
              onValueChange={([value]) => setMedications(value)}
              min={0}
              max={30}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Age
                <span className="text-xs text-muted-foreground">(Mild influence)</span>
              </label>
              <span className="text-sm font-bold">{age}</span>
            </div>
            <Slider
              value={[age]}
              onValueChange={([value]) => setAge(value)}
              min={18}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Quartile Distribution */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-sm">Patient Distribution</h4>
          <div className="space-y-2">
            {RESEARCH_DATA.dbs.quartiles.map((q) => (
              <div key={q.name} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{q.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {q.staffingRatio}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Findings */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>✅ Strong validation (internal), Strong validation (external)</p>
          <p>✅ Very large effect size observed</p>
          <p>✅ Significant overtime reduction potential</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default DBSCalculator;
