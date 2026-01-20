// DBS (Documentation Burden Score) Calculator Component
// Copyright © Dr. Alexis Collier - Patent Pending

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Activity, Heart, Pill, User, Users } from 'lucide-react';
import { calculateDBS, getDBSQuartile } from '@/utils/dbsCalculations';
import { DBS_CALCULATION_FACTORS, RESEARCH_DATA } from '@/data/researchData';

interface DBSCalculatorProps {
  className?: string;
  compact?: boolean;
  onScoreChange?: (score: number, quartile: string) => void;
}

export function DBSCalculator({ className, compact = false, onScoreChange }: DBSCalculatorProps) {
  const [apache, setApache] = useState(DBS_CALCULATION_FACTORS[0].default);
  const [sofa, setSofa] = useState(DBS_CALCULATION_FACTORS[1].default);
  const [comorbidities, setComorbidities] = useState(DBS_CALCULATION_FACTORS[2].default);
  const [medications, setMedications] = useState(DBS_CALCULATION_FACTORS[3].default);
  const [age, setAge] = useState(DBS_CALCULATION_FACTORS[4].default);

  const dbsScore = useMemo(() => {
    const score = calculateDBS({ apache, sofa, comorbidities, medications, age });
    const quartileInfo = getDBSQuartile(score);
    onScoreChange?.(score, quartileInfo.quartile);
    return score;
  }, [apache, sofa, comorbidities, medications, age, onScoreChange]);

  const quartileInfo = useMemo(() => getDBSQuartile(dbsScore), [dbsScore]);

  const getScoreColor = (score: number) => {
    if (score < 25) return 'text-green-600';
    if (score < 50) return 'text-yellow-600';
    if (score < 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score < 25) return 'bg-green-500';
    if (score < 50) return 'bg-yellow-500';
    if (score < 75) return 'bg-orange-500';
    return 'bg-red-500';
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
              {dbsScore}
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
          <Badge variant="outline" className="text-xs">
            ANIA 2026 Research
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {RESEARCH_DATA.validation.internalPatients.toLocaleString()} patients validated
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="bg-gradient-to-r from-green-50 via-yellow-50 via-orange-50 to-red-50 dark:from-green-950/20 dark:via-yellow-950/20 dark:via-orange-950/20 dark:to-red-950/20 rounded-lg p-6">
          <div className="text-center mb-4">
            <p className={`text-5xl font-bold ${getScoreColor(dbsScore)}`}>
              {dbsScore}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {quartileInfo.quartile}: {quartileInfo.label}
            </p>
            <Badge variant="secondary" className="mt-2">
              Staffing: {quartileInfo.staffingRatio}
            </Badge>
          </div>
          <div className="relative h-3 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 rounded-full">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-lg transition-all duration-300"
              style={{ left: `calc(${dbsScore}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Q1: Low</span>
            <span>Q2: Moderate</span>
            <span>Q3: High</span>
            <span>Q4: Very High</span>
          </div>
        </div>

        {/* Factor Sliders */}
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                APACHE II Score
                <span className="text-xs text-muted-foreground">(25%)</span>
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
                <span className="text-xs text-muted-foreground">(20%)</span>
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
                <span className="text-xs text-muted-foreground">(18%)</span>
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
                <span className="text-xs text-muted-foreground">(15%)</span>
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
                <span className="text-xs text-muted-foreground">(12%)</span>
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
                  <span className="font-semibold">{q.percentage.toFixed(1)}%</span>
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
          <p>✅ AUC {RESEARCH_DATA.validation.internalAUC} (internal), {RESEARCH_DATA.validation.externalAUC} (external)</p>
          <p>✅ Cohen's d = {RESEARCH_DATA.validation.cohensD} (very large effect)</p>
          <p>✅ {RESEARCH_DATA.dbs.overtimeReduction[0]}-{RESEARCH_DATA.dbs.overtimeReduction[1]}% overtime reduction potential</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default DBSCalculator;
