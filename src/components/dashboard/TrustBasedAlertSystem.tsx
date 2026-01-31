import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Filter, Volume2, VolumeX, TrendingDown, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { RESEARCH_DATA } from '@/data/researchData';
import { PatentBadge } from '@/components/quality/PatentNotice';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  confidence: number;
  source: string;
  timestamp: Date;
  bypassed: boolean;
}

const mockAlerts: Alert[] = [
  { id: '1', type: 'critical', message: 'MAP < 65 mmHg - Septic shock protocol', confidence: 0.94, source: 'Vitals Monitor', timestamp: new Date(), bypassed: true },
  { id: '2', type: 'critical', message: 'Lactate > 4.0 - Consider fluid bolus', confidence: 0.91, source: 'Lab Results', timestamp: new Date(), bypassed: true },
  { id: '3', type: 'warning', message: 'Heart rate trending upward', confidence: 0.72, source: 'Trend Analysis', timestamp: new Date(), bypassed: false },
  { id: '4', type: 'warning', message: 'SpO2 below baseline', confidence: 0.68, source: 'Pulse Ox', timestamp: new Date(), bypassed: false },
  { id: '5', type: 'info', message: 'Medication due in 15 min', confidence: 0.45, source: 'MAR', timestamp: new Date(), bypassed: false },
  { id: '6', type: 'info', message: 'Lab results pending', confidence: 0.32, source: 'Lab System', timestamp: new Date(), bypassed: false },
];

export const TrustBasedAlertSystem = () => {
  const [trustFilterEnabled, setTrustFilterEnabled] = useState(true);
  const [nurseWorkload, setNurseWorkload] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [totalAlerts] = useState(mockAlerts.length);
  
  // Dynamic threshold based on workload (from patent)
  const getThreshold = () => {
    switch (nurseWorkload) {
      case 'low': return 0.50;
      case 'moderate': return 0.70;
      case 'high': return 0.85;
    }
  };
  
  const threshold = getThreshold();
  
  useEffect(() => {
    if (trustFilterEnabled) {
      setFilteredAlerts(mockAlerts.filter(a => a.confidence >= threshold || a.type === 'critical'));
    } else {
      setFilteredAlerts(mockAlerts);
    }
  }, [trustFilterEnabled, threshold]);
  
  const reductionRate = trustFilterEnabled 
    ? Math.round((1 - filteredAlerts.length / totalAlerts) * 100)
    : 0;
  
  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return 'bg-risk-high/20 border-risk-high/40 text-risk-high';
      case 'warning': return 'bg-risk-medium/20 border-risk-medium/40 text-risk-medium';
      case 'info': return 'bg-muted/50 border-border text-muted-foreground';
    }
  };

  return (
    <TooltipProvider>
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Filter className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Trust-Based Alert System</CardTitle>
                <PatentBadge contextPatent="trust" className="mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Filter</span>
                    <Switch 
                      checked={trustFilterEnabled}
                      onCheckedChange={setTrustFilterEnabled}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enable/disable trust-based filtering</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <TrendingDown className="w-3.5 h-3.5 text-risk-low" />
                <span className="text-lg font-bold text-risk-low">{RESEARCH_DATA.alerts.projectedReductionRate * 100}%</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Alert Reduction (Projected)</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-lg font-bold text-foreground">{RESEARCH_DATA.alerts.targetSensitivity * 100}%</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Target Sensitivity</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Zap className="w-3.5 h-3.5 text-chart-1" />
                <span className="text-lg font-bold text-foreground">{RESEARCH_DATA.alerts.projectedTimeSaved}m</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Time Saved (Projected)</span>
            </div>
          </div>
          
          {/* Workload Selector */}
          <div className="bg-secondary/30 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Current Nurse Workload</span>
              <span className="text-xs text-muted-foreground">Threshold: {(threshold * 100).toFixed(0)}%</span>
            </div>
            <div className="flex gap-2">
              {(['low', 'moderate', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setNurseWorkload(level)}
                  className={cn(
                    "flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all capitalize",
                    nurseWorkload === level
                      ? level === 'high' 
                        ? 'bg-risk-high text-white'
                        : level === 'moderate'
                          ? 'bg-risk-medium text-white'
                          : 'bg-risk-low text-white'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Higher workload → Stricter filtering → Only critical alerts bypass
            </p>
          </div>
          
          {/* Alert Comparison */}
          <div className="grid grid-cols-2 gap-3">
            {/* Before */}
            <div className="bg-risk-high/5 border border-risk-high/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-risk-high" />
                <span className="text-xs font-semibold text-risk-high">Without Filter</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{RESEARCH_DATA.alerts.illustrativeBeforeAlerts}</div>
              <span className="text-[10px] text-muted-foreground">alerts/hour (illustrative)</span>
            </div>
            
            {/* After */}
            <div className="bg-risk-low/5 border border-risk-low/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <VolumeX className="w-4 h-4 text-risk-low" />
                <span className="text-xs font-semibold text-risk-low">With Filter</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{RESEARCH_DATA.alerts.illustrativeAfterAlerts}</div>
              <span className="text-[10px] text-muted-foreground">alerts/hour (projected)</span>
            </div>
          </div>
          
          {/* Live Alert Feed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">
                {trustFilterEnabled ? 'Trusted Alerts' : 'All Alerts'} 
                <Badge variant="secondary" className="ml-2 text-[10px]">
                  {filteredAlerts.length} of {totalAlerts}
                </Badge>
              </span>
              {trustFilterEnabled && (
                <Badge variant="outline" className="text-[10px] bg-risk-low/10 border-risk-low/30 text-risk-low">
                  {reductionRate}% Filtered
                </Badge>
              )}
            </div>
            
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {filteredAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border",
                      getAlertColor(alert.type)
                    )}
                  >
                    {alert.type === 'critical' ? (
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="text-xs flex-1 truncate">{alert.message}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="shrink-0">
                          <Progress 
                            value={alert.confidence * 100} 
                            className="w-12 h-1.5"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Confidence: {(alert.confidence * 100).toFixed(0)}%</p>
                        <p className="text-muted-foreground">Source: {alert.source}</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
