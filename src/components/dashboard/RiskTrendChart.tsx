import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';

interface RiskTrendChartProps {
  currentScore: number;
  trend: 'up' | 'down' | 'stable';
  className?: string;
}

export const RiskTrendChart = ({ currentScore, trend, className }: RiskTrendChartProps) => {
  // Generate synthetic trend data based on current score and trend direction
  const trendData = useMemo(() => {
    const points = 8;
    const data = [];
    
    for (let i = 0; i < points; i++) {
      let value: number;
      if (trend === 'up') {
        // Rising trend
        value = currentScore - (points - 1 - i) * 4 + Math.random() * 3;
      } else if (trend === 'down') {
        // Falling trend
        value = currentScore + (points - 1 - i) * 4 - Math.random() * 3;
      } else {
        // Stable with slight fluctuation
        value = currentScore + (Math.random() - 0.5) * 6;
      }
      
      data.push({
        time: `${(i + 1) * 3}h`,
        value: Math.max(0, Math.min(100, Math.round(value))),
      });
    }
    
    return data;
  }, [currentScore, trend]);

  const lineColor = trend === 'up' ? 'hsl(var(--risk-high))' : trend === 'down' ? 'hsl(var(--risk-low))' : 'hsl(var(--muted-foreground))';
  const gradientId = `gradient-${currentScore}-${trend}`;

  return (
    <div className={cn("h-16", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            animationDuration={800}
          />
          <ReferenceLine y={50} stroke="hsl(var(--border))" strokeDasharray="3 3" strokeOpacity={0.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
