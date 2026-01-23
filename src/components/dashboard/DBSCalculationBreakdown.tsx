import { useState, useEffect } from 'react';
import { Calculator, ChevronRight, Info, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { RESEARCH_DATA, DBS_CALCULATION_FACTORS } from '@/data/researchData';
import { calculateDBS, getDBSQuartile } from '@/utils/dbsCalculations';
import { PatentBadge } from '@/components/quality/PatentNotice';

interface FeatureValue {
  name: string;
  value: number;
  weight: number;
  contribution: number;
  max: number;
}

// Example high-risk patient from patent Figure 3
const HIGH_RISK_PRESET = {
  'APACHE II Score': 28,
  'SOFA Score': 12,
  'Number of Comorbidities': 5,
  'Active Medications': 15,
  'Age': 72,
};

export const DBSCalculationBreakdown = () => {
  const [featureValues, setFeatureValues] = useState<Record<string, number>>({
    'APACHE II Score': 25,
    'SOFA Score': 8,
    'Number of Comorbidities': 3,
    'Active Medications': 12,
    'Age': 65,
  });
  
  const [calculations, setCalculations] = useState<FeatureValue[]>([]);
  const [dbsScore, setDbsScore] = useState(0);
  const [quartile, setQuartile] = useState({ quartile: 'Q2', label: 'Moderate Burden', staffingRatio: '1:1' });
  
  useEffect(() => {
    // Calculate weighted contributions
    const calcs = DBS_CALCULATION_FACTORS.map(factor => {
      const value = featureValues[factor.name] || factor.default;
      const normalizedValue = (value - factor.min) / (factor.max - factor.min);
      const contribution = normalizedValue * factor.weight * 100;
      
      return {
        name: factor.name,
        value,
        weight: factor.weight,
        contribution,
        max: factor.max,
      };
    });
    
    setCalculations(calcs);
    
    // Calculate DBS using existing utility
    const dbs = calculateDBS({
      apache: featureValues['APACHE II Score'],
      sofa: featureValues['SOFA Score'],
      comorbidities: featureValues['Number of Comorbidities'],
      medications: featureValues['Active Medications'],
      age: featureValues['Age'],
    });
    
    setDbsScore(dbs);
    setQuartile(getDBSQuartile(dbs));
  }, [featureValues]);
  
  const handleSliderChange = (name: string, value: number[]) => {
    setFeatureValues(prev => ({ ...prev, [name]: value[0] }));
  };
  
  const loadPreset = () => {
    setFeatureValues(HIGH_RISK_PRESET);
  };
  
  const getQuartileColor = () => {
    switch (quartile.quartile) {
      case 'Q1': return 'bg-risk-low text-white';
      case 'Q2': return 'bg-chart-3 text-white';
      case 'Q3': return 'bg-risk-medium text-white';
      case 'Q4': return 'bg-risk-high text-white';
    }
  };

  const totalContribution = calculations.reduce((sum, c) => sum + c.contribution, 0);

  return (
    <TooltipProvider>
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-1/10 border border-chart-1/20">
                <Calculator className="w-4 h-4 text-chart-1" />
              </div>
              <div>
                <CardTitle className="text-base">DBS Calculation Breakdown</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Patent Pending · Weighted feature analysis
                </p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={loadPreset}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-risk-high/10 border border-risk-high/30 text-risk-high text-xs font-medium hover:bg-risk-high/20 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  High-Risk Example
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Load example from patent Figure 3</p>
                <p className="text-muted-foreground">72-year-old male with septic shock</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* DBS Score Result */}
          <div className="bg-secondary/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Calculated DBS</span>
                <motion.div
                  key={dbsScore}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold text-foreground"
                >
                  {dbsScore}
                </motion.div>
              </div>
              <div className="text-right">
                <Badge className={cn("text-sm px-3 py-1", getQuartileColor())}>
                  {quartile.quartile}: {quartile.label}
                </Badge>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <ChevronRight className="w-3 h-3" />
                  <span>Staffing: <span className="text-foreground font-medium">{quartile.staffingRatio}</span></span>
                </div>
              </div>
            </div>
            
            {/* Visual Score Bar */}
            <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", getQuartileColor())}
                initial={{ width: 0 }}
                animate={{ width: `${dbsScore}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              {/* Quartile markers */}
              <div className="absolute inset-0 flex">
                <div className="w-1/4 border-r border-background/30" />
                <div className="w-1/4 border-r border-background/30" />
                <div className="w-1/4 border-r border-background/30" />
                <div className="w-1/4" />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Q1</span>
              <span>Q2</span>
              <span>Q3</span>
              <span>Q4</span>
            </div>
          </div>
          
          {/* Feature Sliders with Contributions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Feature Weights</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Weights derived from Random Forest feature importance analysis validated on 10,000 patients across 201 hospitals.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {DBS_CALCULATION_FACTORS.map((factor, idx) => {
              const calc = calculations.find(c => c.name === factor.name);
              const value = featureValues[factor.name] || factor.default;
              
              return (
                <motion.div
                  key={factor.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-secondary/30 rounded-xl p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{factor.name}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        ×{factor.weight}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground w-8 text-right">
                        {value}
                      </span>
                      <span className="text-[10px] text-muted-foreground w-16 text-right">
                        → {calc?.contribution.toFixed(1) ?? 0}
                      </span>
                    </div>
                  </div>
                  
                  <Slider
                    value={[value]}
                    onValueChange={(v) => handleSliderChange(factor.name, v)}
                    min={factor.min}
                    max={factor.max}
                    step={1}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{factor.min}</span>
                    <span>{factor.max}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Calculation Summary */}
          <div className="bg-chart-1/5 border border-chart-1/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-3.5 h-3.5 text-chart-1" />
              <span className="text-xs font-medium text-foreground">Calculation Formula</span>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground">
              DBS = Σ(Feature × Weight) / Max × 100
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Raw Score: {totalContribution.toFixed(2)} → Normalized: {dbsScore}
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
