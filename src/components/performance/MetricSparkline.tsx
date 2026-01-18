import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '@/lib/utils';

interface MetricSparklineProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
  showDots?: boolean;
  gradient?: boolean;
}

export const MetricSparkline = ({
  data,
  color = 'hsl(var(--primary))',
  height = 24,
  className,
  showDots = false,
  gradient = true,
}: MetricSparklineProps) => {
  const chartData = useMemo(() => {
    return data.map((value, index) => ({ index, value }));
  }, [data]);

  const gradientId = useMemo(() => `sparkline-gradient-${Math.random().toString(36).substr(2, 9)}`, []);

  if (data.length < 2) {
    return (
      <div 
        className={cn("flex items-center justify-center text-muted-foreground text-[10px]", className)}
        style={{ height }}
      >
        Collecting...
      </div>
    );
  }

  // Calculate trend
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const trend = secondAvg > firstAvg * 1.1 ? 'up' : secondAvg < firstAvg * 0.9 ? 'down' : 'stable';

  const trendColor = trend === 'up' 
    ? 'hsl(var(--destructive))' 
    : trend === 'down' 
      ? 'hsl(142.1 76.2% 36.3%)' // emerald
      : color;

  return (
    <div className={cn("relative", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          {gradient && (
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={trendColor} stopOpacity={1} />
              </linearGradient>
            </defs>
          )}
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={gradient ? `url(#${gradientId})` : trendColor}
            strokeWidth={1.5}
            dot={showDots ? { r: 1, fill: trendColor } : false}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
