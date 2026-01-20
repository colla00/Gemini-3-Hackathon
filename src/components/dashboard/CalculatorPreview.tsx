// Compact Calculator Preview for main dashboard
// Shows key metrics with a link to full calculators

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, DollarSign, Calculator, ArrowRight, TrendingUp, 
  Building2, Users, Zap
} from 'lucide-react';
import { calculateDBS, getDBSQuartile, calculateROI, formatCurrency, formatCompactNumber } from '@/utils/dbsCalculations';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CalculatorPreviewProps {
  onOpenCalculators: () => void;
  className?: string;
}

export function CalculatorPreview({ onOpenCalculators, className }: CalculatorPreviewProps) {
  // Demo values for preview
  const demoDbsFactors = { apache: 18, sofa: 8, comorbidities: 4, medications: 12, age: 62 };
  const demoRoiParams = { bedCount: 50, avgOccupancy: 85, avgNurseHourlyRate: 45 };

  const dbsScore = useMemo(() => calculateDBS(demoDbsFactors), []);
  const quartileInfo = useMemo(() => getDBSQuartile(dbsScore), [dbsScore]);
  const roi = useMemo(() => calculateROI(demoRoiParams), []);

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn("", className)}
    >
      <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Research Calculators</h3>
                <p className="text-[10px] text-muted-foreground">DBS & ROI validated tools</p>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={onOpenCalculators}
              className="gap-1.5 bg-primary/90 hover:bg-primary text-primary-foreground"
            >
              <span className="hidden sm:inline">Open</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calculator Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* DBS Preview */}
            <motion.div 
              className="bg-background/50 backdrop-blur-sm rounded-lg p-3 border border-border/30 hover:border-primary/30 transition-all cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              onClick={onOpenCalculators}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">Documentation Burden</span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className={cn("text-lg font-bold", getScoreColor(dbsScore))}>
                  {getComplexityLabel(dbsScore)}
                </span>
                <Badge variant="secondary" className="text-[9px]">
                  {quartileInfo.quartile}
                </Badge>
              </div>
              
              <Progress 
                value={dbsScore} 
                className="h-1.5 mb-2"
              />
              
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Staffing: {quartileInfo.staffingRatio}
                </span>
                <span className="text-primary group-hover:underline">Customize →</span>
              </div>
            </motion.div>

            {/* ROI Preview */}
            <motion.div 
              className="bg-background/50 backdrop-blur-sm rounded-lg p-3 border border-border/30 hover:border-risk-low/30 transition-all cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              onClick={onOpenCalculators}
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-risk-low" />
                <span className="text-xs font-medium">Hospital ROI</span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-risk-low">
                  {formatCurrency(roi.annualSavings)}
                </span>
                <Badge variant="secondary" className="text-[9px] text-risk-low">
                  /year
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-risk-low to-emerald-400 rounded-full"
                    style={{ width: `${Math.min((roi.annualSavings / 5000000) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Payback: {roi.paybackMonths.toFixed(1)} mo
                </span>
                <span className="text-risk-low group-hover:underline">Calculate →</span>
              </div>
            </motion.div>
          </div>

          {/* Quick Stats Row */}
          <div className="mt-3 pt-3 border-t border-border/20 grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-xs font-bold text-foreground">10K</div>
              <div className="text-[9px] text-muted-foreground">Patients</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-foreground">201</div>
              <div className="text-[9px] text-muted-foreground">Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-risk-low flex items-center justify-center gap-0.5">
                <Zap className="h-3 w-3" />
                14%
              </div>
              <div className="text-[9px] text-muted-foreground">Mortality ↓</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
