import { TrendingUp, TrendingDown, Minus, AlertTriangle, Shield, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { riskCategories, getRiskLevelColor, getRiskLevelBg, type RiskCategoryData } from '@/data/nursingOutcomes';

const RiskCard = ({ data }: { data: RiskCategoryData }) => {
  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
  const CategoryIcon = data.category === 'FALLS' ? AlertTriangle : data.category === 'HAPI' ? Shield : Activity;
  
  return (
    <div className="glass-card rounded-[20px] p-6 hover:scale-[1.02] transition-all duration-300 group">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            data.level === 'HIGH' ? 'bg-risk-high/20' : data.level === 'MODERATE' ? 'bg-risk-medium/20' : 'bg-risk-low/20'
          )}>
            <CategoryIcon className={cn("w-6 h-6", getRiskLevelColor(data.level))} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{data.label}</h3>
            <span className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              getRiskLevelColor(data.level)
            )}>
              {data.level} RISK
            </span>
          </div>
        </div>
        <TrendIcon className={cn(
          "w-5 h-5",
          data.trend === 'up' ? 'text-risk-high' : data.trend === 'down' ? 'text-risk-low' : 'text-muted-foreground'
        )} />
      </div>

      {/* Risk Score */}
      <div className="flex items-end gap-2 mb-6">
        <span className={cn(
          "text-6xl font-extrabold leading-none",
          getRiskLevelColor(data.level)
        )}>
          {data.score}
        </span>
        <span className="text-2xl font-bold text-muted-foreground mb-1">%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden mb-6">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            getRiskLevelBg(data.level)
          )}
          style={{ width: `${data.score}%` }}
        />
      </div>

      {/* Contributing Factors */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Contributing Factors
        </h4>
        {data.factors.map((factor, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border",
              factor.impact === 'negative' ? 'bg-risk-high/5 border-risk-high/20' :
              factor.impact === 'positive' ? 'bg-risk-low/5 border-risk-low/20' :
              'bg-muted/20 border-border/30'
            )}
          >
            <span className="text-sm text-foreground">{factor.label}</span>
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded",
              factor.impact === 'negative' ? 'text-risk-high bg-risk-high/10' :
              factor.impact === 'positive' ? 'text-risk-low bg-risk-low/10' :
              'text-muted-foreground bg-muted/30'
            )}>
              {factor.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardOverview = () => {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Risk Category Overview
        </h2>
        <p className="text-muted-foreground">
          Real-time risk stratification for nurse-sensitive outcomes
        </p>
      </div>

      {/* Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {riskCategories.map((category) => (
          <RiskCard key={category.category} data={category} />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 rounded-xl bg-warning/10 border border-warning/30">
        <p className="text-center text-sm text-warning">
          <strong>Synthetic Data Demonstration:</strong> All displayed values are simulated for educational purposes.
          Not for clinical decision-making.
        </p>
      </div>
    </div>
  );
};
