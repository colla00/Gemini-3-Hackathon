import { useState, useEffect } from 'react';
import { DollarSign, Clock, TrendingDown, Users, Activity, Zap, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface KPIData {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'purple' | 'orange';
  tooltip: string;
}

const baseKPIs: Omit<KPIData, 'value' | 'change'>[] = [
  {
    label: 'Cost Savings',
    changeLabel: 'vs. baseline',
    icon: <DollarSign className="w-4 h-4" />,
    color: 'green',
    tooltip: 'Estimated annual savings from HAI reduction',
  },
  {
    label: 'Time to Intervention',
    changeLabel: 'improvement',
    icon: <Clock className="w-4 h-4" />,
    color: 'blue',
    tooltip: 'Average time reduction to clinical intervention',
  },
  {
    label: 'False Alarm Rate',
    changeLabel: 'reduction',
    icon: <TrendingDown className="w-4 h-4" />,
    color: 'purple',
    tooltip: 'Reduction in false positive alerts using adaptive thresholds',
  },
  {
    label: 'Nurse Efficiency',
    changeLabel: 'time saved/shift',
    icon: <Users className="w-4 h-4" />,
    color: 'orange',
    tooltip: 'Time saved per nursing shift through prioritization',
  },
];

// Simulate realistic value fluctuations
const generateKPIValue = (index: number, tick: number): { value: string; change: number } => {
  const base = [
    { value: 2.4 + Math.sin(tick * 0.1) * 0.2, format: (v: number) => `$${v.toFixed(1)}M`, change: 34 + Math.floor(Math.random() * 4) },
    { value: 4.2 + Math.cos(tick * 0.15) * 0.3, format: (v: number) => `${v.toFixed(1)}h`, change: 67 + Math.floor(Math.random() * 5) },
    { value: 42 + Math.sin(tick * 0.12) * 3, format: (v: number) => `${Math.round(v)}%`, change: 42 + Math.floor(Math.random() * 3) },
    { value: 47 + Math.cos(tick * 0.08) * 5, format: (v: number) => `${Math.round(v)}min`, change: 23 + Math.floor(Math.random() * 4) },
  ];
  
  const data = base[index];
  return {
    value: data.format(data.value),
    change: data.change,
  };
};

export const InvestorKPIs = () => {
  const [tick, setTick] = useState(0);
  const [kpis, setKpis] = useState<KPIData[]>([]);

  useEffect(() => {
    const updateKPIs = () => {
      const newKPIs = baseKPIs.map((base, index) => ({
        ...base,
        ...generateKPIValue(index, tick),
      }));
      setKpis(newKPIs);
    };
    
    updateKPIs();
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [tick]);

  const colorStyles = {
    green: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      value: 'text-emerald-600 dark:text-emerald-400',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      value: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      icon: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      value: 'text-purple-600 dark:text-purple-400',
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      icon: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
      value: 'text-orange-600 dark:text-orange-400',
    },
  };

  return (
    <TooltipProvider>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Impact Metrics</h3>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 animate-pulse">
            Live
          </span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((kpi, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "relative p-4 rounded-xl border transition-all duration-500 hover:scale-[1.02] cursor-default overflow-hidden",
                    colorStyles[kpi.color].bg,
                    colorStyles[kpi.color].border
                  )}
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  
                  <div className="relative flex items-start justify-between">
                    <div className={cn(
                      "p-2 rounded-lg",
                      colorStyles[kpi.color].icon
                    )}>
                      {kpi.icon}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <ArrowUp className="w-3 h-3 text-risk-low" />
                      <span className="text-risk-low font-medium">{kpi.change}%</span>
                    </div>
                  </div>
                  
                  <div className="relative mt-3">
                    <div className={cn(
                      "text-2xl font-bold tracking-tight transition-all duration-300",
                      colorStyles[kpi.color].value
                    )}>
                      {kpi.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {kpi.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {kpi.changeLabel}
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-[200px]">{kpi.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};
