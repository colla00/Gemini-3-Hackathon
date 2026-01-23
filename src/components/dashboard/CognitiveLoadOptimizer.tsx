import { useState, useEffect } from 'react';
import { Brain, Clock, Users, AlertTriangle, TrendingUp, Pause, Play, Layers, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface QueuedAlert {
  id: string;
  message: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  delayedUntil?: Date;
  grouped?: boolean;
  groupCount?: number;
}

const mockQueuedAlerts: QueuedAlert[] = [
  { id: '1', message: 'MAP trending below threshold', urgency: 'critical' },
  { id: '2', message: 'Lab results: K+ 5.8 mEq/L', urgency: 'high' },
  { id: '3', message: 'Medication reminder (grouped)', urgency: 'medium', grouped: true, groupCount: 4 },
  { id: '4', message: 'Routine vitals check', urgency: 'low', delayedUntil: new Date(Date.now() + 15 * 60000) },
  { id: '5', message: 'Documentation reminder', urgency: 'low', delayedUntil: new Date(Date.now() + 30 * 60000) },
];

// Cognitive Load Index formula factors
const cognitiveFactors = [
  { name: 'Response Time Percentile', value: 72, weight: 0.30 },
  { name: 'Interruption Frequency', value: 65, weight: 0.25 },
  { name: 'Documentation Velocity', value: 45, weight: 0.25 },
  { name: 'Patient Load', value: 80, weight: 0.20 },
];

export const CognitiveLoadOptimizer = () => {
  const [cognitiveLoadIndex, setCognitiveLoadIndex] = useState(68);
  const [optimizationEnabled, setOptimizationEnabled] = useState(true);
  const [adaptiveThreshold, setAdaptiveThreshold] = useState(75);
  const [groupingEnabled, setGroupingEnabled] = useState(true);
  const [delayNonUrgent, setDelayNonUrgent] = useState(true);
  
  // Simulate cognitive load fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCognitiveLoadIndex(prev => {
        const delta = (Math.random() - 0.5) * 8;
        return Math.min(100, Math.max(20, prev + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Calculate adjusted threshold based on cognitive load
  const baseThreshold = 0.65;
  const k = 0.3; // adaptation coefficient from patent
  const adjustedThreshold = baseThreshold * (1 + k * (cognitiveLoadIndex - 50) / 50);

  const getLoadColor = (load: number) => {
    if (load >= 75) return 'text-risk-high';
    if (load >= 50) return 'text-risk-medium';
    return 'text-risk-low';
  };

  const getLoadBgColor = (load: number) => {
    if (load >= 75) return 'bg-risk-high';
    if (load >= 50) return 'bg-risk-medium';
    return 'bg-risk-low';
  };

  const getUrgencyColor = (urgency: QueuedAlert['urgency']) => {
    switch (urgency) {
      case 'critical': return 'bg-risk-high/20 border-risk-high/40 text-risk-high';
      case 'high': return 'bg-risk-medium/20 border-risk-medium/40 text-risk-medium';
      case 'medium': return 'bg-chart-1/20 border-chart-1/40 text-chart-1';
      case 'low': return 'bg-muted/50 border-border text-muted-foreground';
    }
  };

  const activeAlerts = optimizationEnabled 
    ? mockQueuedAlerts.filter(a => a.urgency === 'critical' || a.urgency === 'high' || !delayNonUrgent)
    : mockQueuedAlerts;

  const deferredCount = mockQueuedAlerts.filter(a => a.delayedUntil).length;
  const groupedCount = mockQueuedAlerts.filter(a => a.grouped).reduce((acc, a) => acc + (a.groupCount || 1) - 1, 0);

  return (
    <TooltipProvider>
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-1/10 border border-chart-1/20">
                <Brain className="w-4 h-4 text-chart-1" />
              </div>
              <div>
                <CardTitle className="text-base">Cognitive Load Optimizer</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Patent Pending · Workload-aware alert delivery
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Optimize</span>
              <Switch 
                checked={optimizationEnabled}
                onCheckedChange={setOptimizationEnabled}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Cognitive Load Gauge */}
          <div className="bg-secondary/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">Cognitive Load Index</span>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className={cn("text-xs", getLoadColor(cognitiveLoadIndex))}>
                    {cognitiveLoadIndex.toFixed(0)}/100
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Real-time clinician cognitive state</p>
                  <p className="text-muted-foreground text-xs">Based on response times, interruptions, and workload</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Animated gauge */}
            <div className="relative h-6 bg-secondary/50 rounded-full overflow-hidden mb-3">
              <motion.div
                className={cn("h-full rounded-full transition-colors", getLoadBgColor(cognitiveLoadIndex))}
                animate={{ width: `${cognitiveLoadIndex}%` }}
                transition={{ duration: 0.5 }}
              />
              {/* Threshold marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-foreground/50"
                style={{ left: `${adaptiveThreshold}%` }}
              />
              <span 
                className="absolute top-full text-[9px] text-muted-foreground -translate-x-1/2"
                style={{ left: `${adaptiveThreshold}%` }}
              >
                Threshold
              </span>
            </div>

            {/* Factor breakdown */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {cognitiveFactors.map((factor, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Progress value={factor.value} className="flex-1 h-1.5" />
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-[10px] text-muted-foreground w-6 text-right">
                        {factor.value}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{factor.name}</p>
                      <p className="text-xs text-muted-foreground">Weight: {(factor.weight * 100)}%</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-3.5 h-3.5 text-chart-1" />
                <span className="text-xs font-medium">Alert Grouping</span>
                <Switch 
                  checked={groupingEnabled} 
                  onCheckedChange={setGroupingEnabled}
                  className="ml-auto scale-75"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {groupedCount} alerts consolidated
              </p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-3.5 h-3.5 text-chart-2" />
                <span className="text-xs font-medium">Delay Non-Urgent</span>
                <Switch 
                  checked={delayNonUrgent} 
                  onCheckedChange={setDelayNonUrgent}
                  className="ml-auto scale-75"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {deferredCount} alerts queued
              </p>
            </div>
          </div>

          {/* Adaptive Threshold Visualization */}
          <div className="bg-secondary/30 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Adaptive Threshold</span>
              <span className="text-xs font-mono text-foreground">
                {(adjustedThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-[9px] text-muted-foreground font-mono bg-secondary/50 rounded p-1.5 mb-2">
              T = {(baseThreshold * 100).toFixed(0)}% × (1 + {k} × ({cognitiveLoadIndex.toFixed(0)} - 50) / 50) = {(adjustedThreshold * 100).toFixed(0)}%
            </p>
            <p className="text-[10px] text-muted-foreground">
              {cognitiveLoadIndex >= 75 
                ? '⚠️ High load: Only critical alerts pass through'
                : cognitiveLoadIndex >= 50
                  ? '📊 Moderate load: Filtering borderline alerts'
                  : '✅ Low load: Normal alert threshold active'
              }
            </p>
          </div>

          {/* Alert Queue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Alert Queue</span>
              <Badge variant="secondary" className="text-[10px]">
                {activeAlerts.length} active
              </Badge>
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {mockQueuedAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border",
                    getUrgencyColor(alert.urgency),
                    alert.delayedUntil && delayNonUrgent && "opacity-50"
                  )}
                >
                  {alert.urgency === 'critical' ? (
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  ) : alert.grouped ? (
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                  ) : alert.delayedUntil ? (
                    <Pause className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Play className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span className="text-xs flex-1 truncate">{alert.message}</span>
                  {alert.grouped && (
                    <Badge variant="secondary" className="text-[9px]">
                      +{alert.groupCount! - 1}
                    </Badge>
                  )}
                  {alert.delayedUntil && delayNonUrgent && (
                    <span className="text-[9px] text-muted-foreground">
                      {Math.round((alert.delayedUntil.getTime() - Date.now()) / 60000)}m
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats Footer */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/30">
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">437</div>
              <div className="text-[9px] text-muted-foreground">hrs saved/mo</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-risk-low">80%</div>
              <div className="text-[9px] text-muted-foreground">override ↓</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-chart-2">2.3m</div>
              <div className="text-[9px] text-muted-foreground">per decision</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
