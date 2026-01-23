import { useState, useMemo } from 'react';
import { Shield, History, MessageSquare, Clock, Database, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface TrustComponent {
  id: string;
  name: string;
  description: string;
  weight: number;
  value: number;
  icon: typeof Shield;
  color: string;
}

const defaultComponents: TrustComponent[] = [
  { 
    id: 'historical', 
    name: 'Historical Accuracy', 
    description: 'True positive rate over 90-day window',
    weight: 0.35, 
    value: 0.89, 
    icon: History, 
    color: 'text-chart-1' 
  },
  { 
    id: 'feedback', 
    name: 'Clinician Feedback', 
    description: 'Weighted accept/dismiss with decay',
    weight: 0.30, 
    value: 0.82, 
    icon: MessageSquare, 
    color: 'text-chart-2' 
  },
  { 
    id: 'temporal', 
    name: 'Temporal Relevance', 
    description: 'Exponential decay λ = ln(2)/30',
    weight: 0.20, 
    value: 0.91, 
    icon: Clock, 
    color: 'text-primary' 
  },
  { 
    id: 'quality', 
    name: 'Data Quality', 
    description: 'Completeness, consistency, timeliness',
    weight: 0.15, 
    value: 0.78, 
    icon: Database, 
    color: 'text-risk-low' 
  },
];

export const TrustScoreAlgorithm = () => {
  const [components, setComponents] = useState(defaultComponents);
  const [confidenceInterval, setConfidenceInterval] = useState(0.92); // CI adjustment

  // Calculate composite trust score using patent formula
  const trustScore = useMemo(() => {
    const weightedSum = components.reduce((sum, comp) => sum + comp.weight * comp.value, 0);
    return weightedSum * confidenceInterval;
  }, [components, confidenceInterval]);

  const handleValueChange = (id: string, newValue: number) => {
    setComponents(prev => prev.map(c => 
      c.id === id ? { ...c, value: newValue } : c
    ));
  };

  const getTrustLevel = (score: number) => {
    if (score >= 0.85) return { label: 'High Trust', color: 'text-risk-low', bg: 'bg-risk-low' };
    if (score >= 0.70) return { label: 'Moderate Trust', color: 'text-risk-medium', bg: 'bg-risk-medium' };
    return { label: 'Low Trust', color: 'text-risk-high', bg: 'bg-risk-high' };
  };

  const trustLevel = getTrustLevel(trustScore);

  return (
    <TooltipProvider>
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Trust Score Algorithm</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Patent Pending · Composite reliability scoring
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/30 text-primary">
              96% Correlation
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Trust Score Display */}
          <div className="bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-1/10 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.div
                key={trustScore.toFixed(2)}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold text-foreground"
              >
                {(trustScore * 100).toFixed(0)}
              </motion.div>
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
            <Badge className={cn("text-xs", trustLevel.bg)}>
              {trustLevel.label}
            </Badge>
          </div>

          {/* Formula Display */}
          <div className="bg-secondary/30 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Trust Score Formula</span>
            </div>
            <div className="font-mono text-[10px] text-foreground bg-secondary/50 rounded p-2 overflow-x-auto">
              <div>Trust = (w₁×HA + w₂×CF + w₃×TR + w₄×DQ) × CI</div>
              <div className="text-muted-foreground mt-1">
                = ({components[0].weight}×{components[0].value.toFixed(2)} + 
                {components[1].weight}×{components[1].value.toFixed(2)} + 
                {components[2].weight}×{components[2].value.toFixed(2)} + 
                {components[3].weight}×{components[3].value.toFixed(2)}) × {confidenceInterval.toFixed(2)}
              </div>
              <div className="text-primary mt-1 font-semibold">
                = {(trustScore * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Component Sliders */}
          <div className="space-y-3">
            {components.map((comp) => {
              const Icon = comp.icon;
              return (
                <div key={comp.id} className="bg-secondary/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("w-3.5 h-3.5", comp.color)} />
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-xs font-medium text-foreground">{comp.name}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{comp.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[9px]">
                        w={comp.weight}
                      </Badge>
                      <span className={cn("text-xs font-bold", comp.color)}>
                        {(comp.value * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[comp.value * 100]}
                    onValueChange={([v]) => handleValueChange(comp.id, v / 100)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-muted-foreground">
                      Contribution: {(comp.weight * comp.value * confidenceInterval * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confidence Interval */}
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-chart-1" />
                <span className="text-xs font-medium text-foreground">Confidence Interval Adjustment</span>
              </div>
              <span className="text-xs font-bold text-chart-1">
                {(confidenceInterval * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[confidenceInterval * 100]}
              onValueChange={([v]) => setConfidenceInterval(v / 100)}
              min={50}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-[9px] text-muted-foreground mt-1">
              95% CI width via bootstrapping. Narrower intervals increase trust score.
            </p>
          </div>

          {/* Threshold Guidance */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/30">
            <div className="text-center p-2 rounded-lg bg-risk-high/10 border border-risk-high/20">
              <div className="text-xs font-bold text-risk-high">&lt;70</div>
              <div className="text-[9px] text-muted-foreground">Suppress</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-risk-medium/10 border border-risk-medium/20">
              <div className="text-xs font-bold text-risk-medium">70-85</div>
              <div className="text-[9px] text-muted-foreground">Review</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-risk-low/10 border border-risk-low/20">
              <div className="text-xs font-bold text-risk-low">&gt;85</div>
              <div className="text-[9px] text-muted-foreground">Display</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
