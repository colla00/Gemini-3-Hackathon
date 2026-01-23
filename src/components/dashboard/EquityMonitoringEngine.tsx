import { useState, useEffect } from 'react';
import { Scale, AlertCircle, CheckCircle2, Users, BarChart2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { RESEARCH_DATA } from '@/data/researchData';

interface DemographicGroup {
  name: string;
  fpr: number; // False Positive Rate
  fnr: number; // False Negative Rate
  size: number;
}

const demographicGroups: DemographicGroup[] = [
  { name: 'Male', fpr: 0.082, fnr: 0.031, size: 5234 },
  { name: 'Female', fpr: 0.079, fnr: 0.029, size: 4766 },
  { name: 'Age 18-44', fpr: 0.075, fnr: 0.028, size: 2847 },
  { name: 'Age 45-64', fpr: 0.081, fnr: 0.032, size: 3615 },
  { name: 'Age 65+', fpr: 0.084, fnr: 0.030, size: 3538 },
  { name: 'White', fpr: 0.080, fnr: 0.030, size: 5847 },
  { name: 'Black', fpr: 0.082, fnr: 0.031, size: 2153 },
  { name: 'Hispanic', fpr: 0.078, fnr: 0.029, size: 1423 },
  { name: 'Asian', fpr: 0.079, fnr: 0.030, size: 577 },
];

const DISPARITY_THRESHOLD = 0.005; // 0.5% from patent

export const EquityMonitoringEngine = () => {
  const [selectedMetric, setSelectedMetric] = useState<'fpr' | 'fnr'>('fpr');
  const [currentDisparity, setCurrentDisparity] = useState(0);
  const [isWithinThreshold, setIsWithinThreshold] = useState(true);
  
  useEffect(() => {
    // Calculate max disparity
    const rates = demographicGroups.map(g => selectedMetric === 'fpr' ? g.fpr : g.fnr);
    const maxRate = Math.max(...rates);
    const minRate = Math.min(...rates);
    const disparity = maxRate - minRate;
    
    setCurrentDisparity(disparity);
    setIsWithinThreshold(disparity <= DISPARITY_THRESHOLD);
  }, [selectedMetric]);
  
  const getDisparityColor = () => {
    if (currentDisparity <= DISPARITY_THRESHOLD * 0.5) return 'text-risk-low';
    if (currentDisparity <= DISPARITY_THRESHOLD) return 'text-risk-medium';
    return 'text-risk-high';
  };
  
  const getProgressColor = (rate: number, maxRate: number, minRate: number) => {
    const normalized = (rate - minRate) / (maxRate - minRate || 1);
    if (normalized > 0.8) return 'bg-risk-high';
    if (normalized > 0.4) return 'bg-risk-medium';
    return 'bg-risk-low';
  };

  const rates = demographicGroups.map(g => selectedMetric === 'fpr' ? g.fpr : g.fnr);
  const maxRate = Math.max(...rates);
  const minRate = Math.min(...rates);

  return (
    <TooltipProvider>
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/10 border border-chart-2/20">
                <Scale className="w-4 h-4 text-chart-2" />
              </div>
              <div>
                <CardTitle className="text-base">Real-Time Equity Monitoring</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Patent Pending · Demographic disparity &lt;0.5% threshold
                </p>
              </div>
            </div>
            <Badge 
              variant={isWithinThreshold ? "default" : "destructive"}
              className={cn(
                "text-xs",
                isWithinThreshold 
                  ? "bg-risk-low/20 text-risk-low border-risk-low/30" 
                  : "bg-risk-high/20 text-risk-high border-risk-high/30"
              )}
            >
              {isWithinThreshold ? (
                <><CheckCircle2 className="w-3 h-3 mr-1" /> Equitable</>
              ) : (
                <><AlertCircle className="w-3 h-3 mr-1" /> Bias Detected</>
              )}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-chart-2" />
                <span className={cn("text-lg font-bold", getDisparityColor())}>
                  {(currentDisparity * 100).toFixed(2)}%
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">Current Disparity</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <BarChart2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-lg font-bold text-foreground">
                  {(DISPARITY_THRESHOLD * 100).toFixed(1)}%
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">Threshold</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-lg font-bold text-foreground">
                  {(RESEARCH_DATA.validation.internalPatients / 1000).toFixed(0)}K
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">Patients Audited</span>
            </div>
          </div>
          
          {/* Metric Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMetric('fpr')}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all",
                selectedMetric === 'fpr'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              )}
            >
              False Positive Rate
            </button>
            <button
              onClick={() => setSelectedMetric('fnr')}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all",
                selectedMetric === 'fnr'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              )}
            >
              False Negative Rate
            </button>
          </div>
          
          {/* Demographic Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Demographic Group</span>
              <span>{selectedMetric === 'fpr' ? 'FPR' : 'FNR'} (%)</span>
            </div>
            
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {demographicGroups.map((group, idx) => {
                const rate = selectedMetric === 'fpr' ? group.fpr : group.fnr;
                const progressColor = getProgressColor(rate, maxRate, minRate);
                
                return (
                  <motion.div
                    key={group.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 bg-secondary/30 rounded-lg p-2"
                  >
                    <span className="text-xs font-medium w-20 shrink-0">{group.name}</span>
                    <div className="flex-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative">
                            <Progress 
                              value={(rate / maxRate) * 100} 
                              className={cn("h-2", progressColor)}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{selectedMetric === 'fpr' ? 'False Positive Rate' : 'False Negative Rate'}: {(rate * 100).toFixed(2)}%</p>
                          <p className="text-muted-foreground">Sample size: {group.size.toLocaleString()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-xs font-mono w-12 text-right">
                      {(rate * 100).toFixed(2)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Framework Principles */}
          <div className="bg-chart-2/5 border border-chart-2/20 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">Human-Centered AI Framework</p>
                <ul className="text-[10px] text-muted-foreground space-y-0.5">
                  <li>• Real-time stratification across protected classes</li>
                  <li>• Automatic alerts if disparity exceeds 0.5%</li>
                  <li>• Model recalibration triggers for bias correction</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
