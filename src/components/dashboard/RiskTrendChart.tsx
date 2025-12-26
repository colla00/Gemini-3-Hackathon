import { useMemo } from 'react';
import { ResponsiveContainer, ReferenceLine, Area, AreaChart, XAxis, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface RiskTrendChartProps {
  currentScore: number;
  trend: 'up' | 'down' | 'stable';
  className?: string;
  showConfidenceBands?: boolean;
  showHorizons?: boolean;
}

export const RiskTrendChart = ({ 
  currentScore, 
  trend, 
  className,
  showConfidenceBands = true,
  showHorizons = false
}: RiskTrendChartProps) => {
  // Generate synthetic trend data with confidence intervals (Patent: Confidence-based risk stratification)
  const trendData = useMemo(() => {
    const points = 8;
    const data = [];
    
    // Multi-horizon labels (Patent: Multi-horizon forecasting)
    const horizonLabels = ['0h', '4h', '8h', '12h', '16h', '20h', '24h', '48h'];
    
    for (let i = 0; i < points; i++) {
      let value: number;
      let confidence: number;
      
      if (trend === 'up') {
        value = currentScore - (points - 1 - i) * 4 + Math.random() * 3;
        confidence = 8 + i * 1.5; // Wider confidence at future horizons
      } else if (trend === 'down') {
        value = currentScore + (points - 1 - i) * 4 - Math.random() * 3;
        confidence = 8 + i * 1.5;
      } else {
        value = currentScore + (Math.random() - 0.5) * 6;
        confidence = 6 + i;
      }
      
      const boundedValue = Math.max(0, Math.min(100, Math.round(value)));
      
      data.push({
        time: showHorizons ? horizonLabels[i] : `${(i + 1) * 3}h`,
        value: boundedValue,
        upperBound: Math.min(100, boundedValue + confidence),
        lowerBound: Math.max(0, boundedValue - confidence),
        confidence: Math.round(100 - confidence * 2), // Confidence % for tooltip
      });
    }
    
    return data;
  }, [currentScore, trend, showHorizons]);

  const lineColor = trend === 'up' ? 'hsl(var(--risk-high))' : trend === 'down' ? 'hsl(var(--risk-low))' : 'hsl(var(--primary))';
  const gradientId = `gradient-${currentScore}-${trend}`;
  const confidenceGradientId = `confidence-${currentScore}-${trend}`;

  return (
    <div className={cn("h-20", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 15, left: 5 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.4} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id={confidenceGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.15} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          
          {/* Confidence band (Patent: Confidence-based risk stratification) */}
          {showConfidenceBands && (
            <Area
              type="monotone"
              dataKey="upperBound"
              stroke="none"
              fill={`url(#${confidenceGradientId})`}
              animationDuration={600}
            />
          )}
          
          {/* Main risk trajectory */}
          <Area
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            animationDuration={800}
          />
          
          {/* Alert threshold line */}
          <ReferenceLine y={70} stroke="hsl(var(--risk-high))" strokeDasharray="3 3" strokeOpacity={0.4} />
          <ReferenceLine y={40} stroke="hsl(var(--risk-medium))" strokeDasharray="3 3" strokeOpacity={0.3} />
          
          {showHorizons && (
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
          )}
          
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const trendLabel = trend === 'up' ? 'Rising' : trend === 'down' ? 'Declining' : 'Stable';
                const riskLevel = data.value >= 70 ? 'Elevated' : data.value >= 40 ? 'Moderate' : 'Low';
                return (
                  <div className="bg-card border border-border/50 rounded-lg p-2 shadow-lg text-xs">
                    <div className="font-semibold text-foreground">{data.time}</div>
                    <div className="text-primary">Signal: {riskLevel}</div>
                    <div className="text-muted-foreground">Trajectory: {trendLabel}</div>
                  </div>
                );
              }
              return null;
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Trend label */}
      <div className="flex justify-center items-center mt-1 px-1">
        <span className="text-[8px] text-muted-foreground/60">Risk trajectory over time</span>
      </div>
    </div>
  );
};
