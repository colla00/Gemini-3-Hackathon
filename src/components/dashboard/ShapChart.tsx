import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { RiskFactor } from '@/data/patients';

interface ShapChartProps {
  factors: RiskFactor[];
}

// Convert contribution to relative influence labels
const getInfluenceLabel = (contribution: number) => {
  const abs = Math.abs(contribution);
  if (abs > 0.25) return 'Strong';
  if (abs > 0.15) return 'Moderate';
  if (abs > 0.08) return 'Mild';
  return 'Minimal';
};

export const ShapChart = ({ factors }: ShapChartProps) => {
  const [animatedFactors, setAnimatedFactors] = useState<typeof sortedFactors>([]);

  // Sort factors by absolute contribution value
  const sortedFactors = [...factors].sort(
    (a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)
  );

  const maxContribution = Math.max(...factors.map(f => Math.abs(f.contribution)));

  // Animate bars appearing one by one with 200ms delay
  useEffect(() => {
    setAnimatedFactors([]);
    sortedFactors.forEach((factor, index) => {
      setTimeout(() => {
        setAnimatedFactors(prev => [...prev, factor]);
      }, index * 200);
    });
  }, [factors]);

  return (
    <div className="w-full space-y-2 animate-fade-in">
      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-risk-high" />
          <span className="text-muted-foreground">Elevates</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-risk-low" />
          <span className="text-muted-foreground">Protective</span>
        </div>
      </div>

      {/* Factor bars */}
      <div className="space-y-2">
        {animatedFactors.map((factor, index) => {
          const isPositive = factor.contribution >= 0;
          const barWidth = Math.min(100, (Math.abs(factor.contribution) / maxContribution) * 100);
          
          return (
            <div 
              key={factor.name}
              className="flex items-center gap-3 py-2 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-lg w-8 text-center">{factor.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground truncate pr-2">
                    {factor.name}
                  </span>
                  <span className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded shrink-0",
                    isPositive ? "bg-risk-high/10 text-risk-high" : "bg-risk-low/10 text-risk-low"
                  )}>
                    {getInfluenceLabel(factor.contribution)}
                  </span>
                </div>
                <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
                  {isPositive ? (
                    <div 
                      className="h-full bg-gradient-to-r from-risk-high/70 to-risk-high rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  ) : (
                    <div className="flex justify-end w-full">
                      <div 
                        className="h-full bg-gradient-to-l from-risk-low/70 to-risk-low rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
