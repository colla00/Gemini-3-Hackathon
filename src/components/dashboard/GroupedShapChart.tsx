import { useState } from 'react';
import { 
  BarChart3, Heart, Footprints, Pill, Brain, 
  Thermometer, Clock, ChevronDown, ChevronRight, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Factor {
  name: string;
  contribution: number;
  icon: string;
  category?: string;
}

interface GroupedShapChartProps {
  factors: Factor[];
  className?: string;
}

interface FactorCategory {
  id: string;
  label: string;
  icon: typeof Heart;
  color: string;
  factors: Factor[];
  totalContribution: number;
}

const categoryConfig: Record<string, { icon: typeof Heart; color: string; label: string }> = {
  vitals: { icon: Heart, color: 'text-red-500', label: 'Vital Signs' },
  mobility: { icon: Footprints, color: 'text-blue-500', label: 'Mobility & Activity' },
  medications: { icon: Pill, color: 'text-purple-500', label: 'Medications' },
  cognitive: { icon: Brain, color: 'text-amber-500', label: 'Cognitive Status' },
  clinical: { icon: Thermometer, color: 'text-emerald-500', label: 'Clinical Indicators' },
  temporal: { icon: Clock, color: 'text-cyan-500', label: 'Time-Based Factors' },
};

// Categorize factors based on name patterns
const categorizeFactor = (factor: Factor): string => {
  const name = factor.name.toLowerCase();
  
  if (name.includes('bp') || name.includes('heart') || name.includes('pulse') || 
      name.includes('temp') || name.includes('oxygen') || name.includes('vital')) {
    return 'vitals';
  }
  if (name.includes('mobil') || name.includes('walk') || name.includes('gait') || 
      name.includes('fall') || name.includes('balance') || name.includes('bed')) {
    return 'mobility';
  }
  if (name.includes('med') || name.includes('drug') || name.includes('sedation') || 
      name.includes('opioid') || name.includes('anticoag')) {
    return 'medications';
  }
  if (name.includes('cognit') || name.includes('mental') || name.includes('confus') || 
      name.includes('orient') || name.includes('delir')) {
    return 'cognitive';
  }
  if (name.includes('day') || name.includes('hour') || name.includes('time') || 
      name.includes('duration') || name.includes('los') || name.includes('shift')) {
    return 'temporal';
  }
  return 'clinical';
};

const ShapBar = ({ factor, maxContribution }: { factor: Factor; maxContribution: number }) => {
  const isPositive = factor.contribution >= 0;
  const barWidth = Math.min(100, (Math.abs(factor.contribution) / maxContribution) * 100);
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 py-1.5 group cursor-default">
          <span className="text-sm w-6 text-center">{factor.icon}</span>
          <span className="text-xs text-foreground flex-1 truncate min-w-0">
            {factor.name}
          </span>
          <div className="w-32 h-4 bg-secondary/50 rounded-full overflow-hidden flex items-center">
            {isPositive ? (
              <div 
                className="h-full bg-gradient-to-r from-risk-high/70 to-risk-high rounded-full transition-all duration-500 group-hover:from-risk-high group-hover:to-risk-high"
                style={{ width: `${barWidth}%` }}
              />
            ) : (
              <div className="flex-1 flex justify-end">
                <div 
                  className="h-full bg-gradient-to-l from-risk-low/70 to-risk-low rounded-full transition-all duration-500 group-hover:from-risk-low group-hover:to-risk-low"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            )}
          </div>
          <span className={cn(
            "text-xs font-mono font-semibold w-12 text-right",
            isPositive ? "text-risk-high" : "text-risk-low"
          )}>
            {isPositive ? '+' : ''}{factor.contribution.toFixed(2)}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">
          <strong>{factor.name}</strong> contributes {isPositive ? 'positively' : 'negatively'} to risk
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export const GroupedShapChart = ({ factors, className }: GroupedShapChartProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['vitals', 'mobility']);
  
  // Group factors by category
  const groupedFactors = factors.reduce<Record<string, Factor[]>>((acc, factor) => {
    const category = factor.category || categorizeFactor(factor);
    if (!acc[category]) acc[category] = [];
    acc[category].push(factor);
    return acc;
  }, {});

  // Create category objects with totals
  const categories: FactorCategory[] = Object.entries(groupedFactors)
    .map(([id, categoryFactors]) => ({
      id,
      label: categoryConfig[id]?.label || 'Other',
      icon: categoryConfig[id]?.icon || Thermometer,
      color: categoryConfig[id]?.color || 'text-muted-foreground',
      factors: categoryFactors.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)),
      totalContribution: categoryFactors.reduce((sum, f) => sum + f.contribution, 0),
    }))
    .sort((a, b) => Math.abs(b.totalContribution) - Math.abs(a.totalContribution));

  const maxContribution = Math.max(...factors.map(f => Math.abs(f.contribution)));

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-3", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">
              Grouped SHAP Analysis
            </h4>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-accent/10 border border-accent/30">
                <Award className="w-3 h-3 text-accent" />
                <span className="text-[9px] text-accent font-medium">Claim #1</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Real-time SHAP Integration (Patent Pending)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-risk-high" />
            <span className="text-muted-foreground">Increases Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-risk-low" />
            <span className="text-muted-foreground">Decreases Risk</span>
          </div>
        </div>

        {/* Grouped Categories */}
        <div className="space-y-2">
          {categories.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            const CategoryIcon = category.icon;
            const isPositiveTotal = category.totalContribution >= 0;
            
            return (
              <Collapsible 
                key={category.id} 
                open={isExpanded}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger asChild>
                  <button className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                    "hover:bg-secondary/50",
                    isExpanded ? "bg-secondary/30 border-primary/30" : "bg-card border-border/50"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn("p-1.5 rounded-lg bg-secondary", category.color)}>
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-medium text-foreground">
                          {category.label}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({category.factors.length} factors)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-sm font-mono font-bold",
                        isPositiveTotal ? "text-risk-high" : "text-risk-low"
                      )}>
                        {isPositiveTotal ? '+' : ''}{category.totalContribution.toFixed(2)}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-1 ml-4 pl-4 border-l-2 border-border/50 py-2 space-y-1">
                    {category.factors.map((factor, idx) => (
                      <ShapBar 
                        key={idx} 
                        factor={factor} 
                        maxContribution={maxContribution}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Summary */}
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Net Risk Contribution:</span>
            <span className={cn(
              "font-mono font-bold",
              factors.reduce((sum, f) => sum + f.contribution, 0) >= 0 
                ? "text-risk-high" 
                : "text-risk-low"
            )}>
              {factors.reduce((sum, f) => sum + f.contribution, 0) >= 0 ? '+' : ''}
              {factors.reduce((sum, f) => sum + f.contribution, 0).toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-[9px] text-muted-foreground text-center">
          Hierarchical factor grouping • Real-time SHAP integration
        </p>
      </div>
    </TooltipProvider>
  );
};