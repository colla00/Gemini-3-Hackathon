// ROI Calculator Component
// Copyright © Dr. Alexis Collier - Patent Pending

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Building2, Clock, TrendingUp, Users, Activity } from 'lucide-react';
import { calculateROI, formatCurrency, formatCompactNumber } from '@/utils/dbsCalculations';
import { RESEARCH_DATA } from '@/data/researchData';

interface ROICalculatorProps {
  className?: string;
  compact?: boolean;
}

export function ROICalculator({ className, compact = false }: ROICalculatorProps) {
  const [bedCount, setBedCount] = useState(50);
  const [occupancy, setOccupancy] = useState(85);
  const [hourlyRate, setHourlyRate] = useState(45);

  const roi = useMemo(() => 
    calculateROI({
      bedCount,
      avgOccupancy: occupancy,
      avgNurseHourlyRate: hourlyRate,
    }),
    [bedCount, occupancy, hourlyRate]
  );

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            ROI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-lg font-bold text-green-600">
                ${formatCompactNumber(roi.annualSavings)}
              </p>
              <p className="text-xs text-muted-foreground">Annual</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-lg font-bold text-blue-600">
                ${formatCompactNumber(roi.implementationCost)}
              </p>
              <p className="text-xs text-muted-foreground">Cost</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <p className="text-lg font-bold text-purple-600">
                {roi.paybackMonths.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Months</p>
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
            <DollarSign className="h-5 w-5 text-primary" />
            ROI Calculator
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Research Validated
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Calculate estimated savings for your hospital
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                ICU Beds
              </label>
              <span className="text-sm font-bold">{bedCount}</span>
            </div>
            <Slider
              value={[bedCount]}
              onValueChange={([value]) => setBedCount(value)}
              min={10}
              max={200}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Occupancy
              </label>
              <span className="text-sm font-bold">{occupancy}%</span>
            </div>
            <Slider
              value={[occupancy]}
              onValueChange={([value]) => setOccupancy(value)}
              min={50}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Hourly Rate
              </label>
              <span className="text-sm font-bold">${hourlyRate}</span>
            </div>
            <Slider
              value={[hourlyRate]}
              onValueChange={([value]) => setHourlyRate(value)}
              min={30}
              max={80}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg text-center border border-green-200 dark:border-green-900">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-muted-foreground mb-1">Annual Savings</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(roi.annualSavings)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Per year</p>
          </div>

          <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center border border-blue-200 dark:border-blue-900">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-muted-foreground mb-1">Implementation Cost</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(roi.implementationCost)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">One-time</p>
          </div>

          <div className="p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg text-center border border-purple-200 dark:border-purple-900">
            <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-muted-foreground mb-1">Payback Period</p>
            <p className="text-3xl font-bold text-purple-600">
              {roi.paybackMonths.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Months</p>
          </div>
        </div>

        {/* Savings Breakdown */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-4 text-sm">Savings Breakdown</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Overtime Reduction ({RESEARCH_DATA.dbs.overtimeReduction[0]}-{RESEARCH_DATA.dbs.overtimeReduction[1]}%)
              </span>
              <span className="font-semibold">{formatCurrency(roi.overtimeSavings)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Transfer Reduction (8-15%)
              </span>
              <span className="font-semibold">{formatCurrency(roi.transferSavings)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Mortality Reduction ({(RESEARCH_DATA.roi.mortalityReduction * 100).toFixed(0)}%)
              </span>
              <span className="font-semibold">{formatCurrency(roi.mortalitySavings)}</span>
            </div>
            <div className="border-t pt-3 mt-3 flex justify-between font-bold">
              <span>Total Annual Savings</span>
              <span className="text-green-600">{formatCurrency(roi.annualSavings)}</span>
            </div>
          </div>
        </div>

        {/* Research Note */}
        <p className="text-xs text-muted-foreground text-center">
          Based on research data: {RESEARCH_DATA.validation.internalPatients.toLocaleString()} patients, {RESEARCH_DATA.validation.externalHospitals} hospitals
        </p>
      </CardContent>
    </Card>
  );
}

export default ROICalculator;
