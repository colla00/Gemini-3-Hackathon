import { cn } from '@/lib/utils';
import { type RiskTrendPoint, type RiskLevel, getRiskLevelColor } from '@/data/nursingOutcomes';

interface RiskSparklineProps {
  data: RiskTrendPoint[];
  level: RiskLevel;
  width?: number;
  height?: number;
}

export const RiskSparkline = ({ data, level, width = 60, height = 24 }: RiskSparklineProps) => {
  const maxValue = 100;
  const minValue = 0;
  
  // Calculate points for the path
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((point.value - minValue) / (maxValue - minValue)) * height;
    return { x, y };
  });
  
  // Create SVG path
  const pathD = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${path} L ${point.x} ${point.y}`;
  }, '');
  
  // Get stroke color based on level
  const strokeColor = level === 'HIGH' ? '#ef4444' : level === 'MODERATE' ? '#f59e0b' : '#10b981';
  
  // Calculate trend direction
  const firstValue = data[0]?.value || 0;
  const lastValue = data[data.length - 1]?.value || 0;
  const trendUp = lastValue > firstValue;
  
  return (
    <div className="relative inline-flex items-center gap-1">
      <svg width={width} height={height} className="overflow-visible">
        {/* Area fill */}
        <defs>
          <linearGradient id={`gradient-${level}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Area */}
        <path
          d={`${pathD} L ${width} ${height} L 0 ${height} Z`}
          fill={`url(#gradient-${level})`}
        />
        
        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* End dot */}
        <circle
          cx={points[points.length - 1]?.x}
          cy={points[points.length - 1]?.y}
          r="2"
          fill={strokeColor}
        />
      </svg>
      
      {/* Trend indicator */}
      <span className={cn(
        "text-[9px] font-medium",
        trendUp ? 'text-risk-high' : 'text-risk-low'
      )}>
        {trendUp ? '↑' : '↓'}
      </span>
    </div>
  );
};
