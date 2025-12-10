import { useState } from 'react';
import { 
  DollarSign, TrendingDown, Calculator, Building2, 
  Users, AlertTriangle, CheckCircle, ArrowRight, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CostParameter {
  id: string;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  source?: string;
}

const costParameters: CostParameter[] = [
  {
    id: 'beds',
    label: 'Hospital Beds',
    description: 'Number of monitored beds',
    min: 50,
    max: 500,
    step: 10,
    defaultValue: 200,
    unit: 'beds',
  },
  {
    id: 'fallsBaseline',
    label: 'Baseline Falls Rate',
    description: 'Falls per 1,000 patient days',
    min: 2,
    max: 6,
    step: 0.5,
    defaultValue: 3.5,
    unit: '/1,000 days',
    source: 'AHRQ PSI-10',
  },
  {
    id: 'reductionRate',
    label: 'Projected Reduction',
    description: 'Expected decrease in falls',
    min: 20,
    max: 50,
    step: 5,
    defaultValue: 35,
    unit: '%',
    source: 'Target based on pilot design',
  },
  {
    id: 'costPerFall',
    label: 'Cost per Fall',
    description: 'Average cost including treatment',
    min: 10000,
    max: 50000,
    step: 5000,
    defaultValue: 30000,
    unit: '$',
    source: 'AHRQ estimate',
  },
];

const additionalSavings = [
  { label: 'HAPI Prevention', baseValue: 15000, rate: 0.25 },
  { label: 'CAUTI Prevention', baseValue: 12000, rate: 0.30 },
  { label: 'Reduced Length of Stay', baseValue: 2500, rate: 0.15 },
  { label: 'Liability Reduction', baseValue: 50000, rate: 0.10 },
];

export const ROICalculatorSlide = () => {
  const [values, setValues] = useState<Record<string, number>>({
    beds: 200,
    fallsBaseline: 3.5,
    reductionRate: 35,
    costPerFall: 30000,
  });

  const handleChange = (id: string, newValue: number[]) => {
    setValues(prev => ({ ...prev, [id]: newValue[0] }));
  };

  // Calculate ROI
  const patientDaysPerYear = values.beds * 365 * 0.75; // 75% occupancy
  const baselineFallsPerYear = (patientDaysPerYear / 1000) * values.fallsBaseline;
  const fallsPrevented = baselineFallsPerYear * (values.reductionRate / 100);
  const fallsSavings = fallsPrevented * values.costPerFall;
  
  // Additional savings calculations
  const additionalTotal = additionalSavings.reduce((acc, item) => {
    return acc + (item.baseValue * item.rate * (values.beds / 100));
  }, 0);

  const totalSavings = fallsSavings + additionalTotal;
  const implementationCost = values.beds * 500; // $500 per bed annual cost estimate
  const netROI = totalSavings - implementationCost;
  const roiPercentage = ((netROI / implementationCost) * 100).toFixed(0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <TooltipProvider>
      <div className="w-full h-full bg-gradient-to-br from-background via-background to-primary/5 p-6 flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            ROI Calculator: Projected Cost Savings
          </h1>
          <p className="text-sm text-muted-foreground">
            Estimate potential savings from NSO prevention (illustrative model)
          </p>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-6">
          {/* Parameters Panel */}
          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                Adjust Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {costParameters.map((param) => (
                <div key={param.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-foreground">
                        {param.label}
                      </span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{param.description}</p>
                          {param.source && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Source: {param.source}
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-xs font-bold text-primary">
                      {param.unit === '$' ? `$${values[param.id].toLocaleString()}` : 
                       `${values[param.id]}${param.unit}`}
                    </span>
                  </div>
                  <Slider
                    value={[values[param.id]]}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    onValueChange={(val) => handleChange(param.id, val)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground">
                    <span>{param.unit === '$' ? `$${param.min.toLocaleString()}` : `${param.min}${param.unit}`}</span>
                    <span>{param.unit === '$' ? `$${param.max.toLocaleString()}` : `${param.max}${param.unit}`}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="col-span-2 space-y-4">
            {/* Main ROI Card */}
            <Card className="border-2 border-primary">
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  {/* Falls Prevented */}
                  <div className="text-center p-4 rounded-lg bg-risk-low/10 border border-risk-low/30">
                    <TrendingDown className="w-6 h-6 text-risk-low mx-auto mb-2" />
                    <div className="text-2xl font-bold text-risk-low">
                      {Math.round(fallsPrevented)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Falls Prevented/Year
                    </div>
                  </div>

                  {/* Falls Savings */}
                  <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(fallsSavings)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Falls Cost Savings
                    </div>
                  </div>

                  {/* Total Savings */}
                  <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-emerald-500">
                      {formatCurrency(totalSavings)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Total Annual Savings
                    </div>
                  </div>

                  {/* ROI */}
                  <div className="text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <Calculator className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-amber-500">
                      {roiPercentage}%
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Return on Investment
                    </div>
                  </div>
                </div>

                {/* Summary Bar */}
                <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-muted-foreground">Implementation Cost: </span>
                        <span className="font-medium text-foreground">{formatCurrency(implementationCost)}/year</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Net Savings: </span>
                        <span className="font-bold text-risk-low">{formatCurrency(netROI)}/year</span>
                      </div>
                    </div>
                    <Badge className="bg-risk-low text-white">
                      {(netROI / implementationCost).toFixed(1)}x Return
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Savings Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Additional Projected Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {additionalSavings.map((item) => {
                    const savings = item.baseValue * item.rate * (values.beds / 100);
                    return (
                      <div 
                        key={item.label}
                        className="p-3 rounded-lg bg-secondary/50 border border-border/50"
                      >
                        <div className="text-[10px] text-muted-foreground mb-1">
                          {item.label}
                        </div>
                        <div className="text-lg font-bold text-foreground">
                          {formatCurrency(savings)}
                        </div>
                        <div className="text-[9px] text-muted-foreground">
                          per year (est.)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Calculation Details */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Calculation Basis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3 text-center">
                  <div className="p-2 rounded bg-secondary/30">
                    <div className="text-lg font-bold text-foreground">{values.beds}</div>
                    <div className="text-[9px] text-muted-foreground">Beds</div>
                  </div>
                  <div className="p-2 rounded bg-secondary/30">
                    <div className="text-lg font-bold text-foreground">75%</div>
                    <div className="text-[9px] text-muted-foreground">Occupancy</div>
                  </div>
                  <div className="p-2 rounded bg-secondary/30">
                    <div className="text-lg font-bold text-foreground">
                      {Math.round(patientDaysPerYear / 1000)}K
                    </div>
                    <div className="text-[9px] text-muted-foreground">Patient Days/Yr</div>
                  </div>
                  <div className="p-2 rounded bg-secondary/30">
                    <div className="text-lg font-bold text-foreground">
                      {Math.round(baselineFallsPerYear)}
                    </div>
                    <div className="text-[9px] text-muted-foreground">Baseline Falls</div>
                  </div>
                  <div className="p-2 rounded bg-risk-low/20">
                    <div className="text-lg font-bold text-risk-low">
                      {Math.round(baselineFallsPerYear - fallsPrevented)}
                    </div>
                    <div className="text-[9px] text-muted-foreground">After NSO</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 text-center">
          <p className="text-[9px] text-muted-foreground italic">
            * All figures are illustrative projections for demonstration purposes. Actual ROI will vary based on institution-specific factors. 
            Cost estimates based on published literature (AHRQ, CMS). Validation study required for accurate projections.
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
};
