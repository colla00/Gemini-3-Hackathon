import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
} from 'recharts';
import type { RiskFactor } from '@/data/patients';

interface ShapChartProps {
  factors: RiskFactor[];
}

export const ShapChart = ({ factors }: ShapChartProps) => {
  const [animatedData, setAnimatedData] = useState<typeof data>([]);

  // Sort factors by absolute contribution value
  const sortedFactors = [...factors].sort(
    (a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)
  );

  const data = sortedFactors.map((factor) => ({
    name: factor.name,
    value: factor.contribution,
    icon: factor.icon,
  }));

  // Animate bars appearing one by one
  useEffect(() => {
    setAnimatedData([]);
    data.forEach((item, index) => {
      setTimeout(() => {
        setAnimatedData(prev => [...prev, item]);
      }, index * 200);
    });
  }, [factors]);

  const positiveColor = '#F87171'; // Red for risk-increasing
  const negativeColor = '#4ADE80'; // Green for risk-reducing

  return (
    <div className="w-full h-[350px] animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={animatedData}
          layout="vertical"
          margin={{ top: 20, right: 80, left: 20, bottom: 20 }}
        >
          <XAxis
            type="number"
            domain={[-0.4, 0.5]}
            tickFormatter={(value) => (value > 0 ? `+${value}` : value.toString())}
            tick={{ fill: '#D1D5DB', fontSize: 12 }}
            axisLine={{ stroke: '#404040' }}
            tickLine={{ stroke: '#404040' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: '#D1D5DB', fontSize: 12 }}
            axisLine={{ stroke: '#404040' }}
            tickLine={false}
            tickFormatter={(value, index) => {
              const item = animatedData[index];
              return item ? `${item.icon} ${value}` : value;
            }}
          />
          <ReferenceLine x={0} stroke="#606060" strokeDasharray="3 3" />
          <Bar
            dataKey="value"
            radius={[4, 4, 4, 4]}
            barSize={28}
            animationDuration={500}
            animationEasing="ease-out"
          >
            {animatedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value >= 0 ? positiveColor : negativeColor}
              />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(value: number) =>
                value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2)
              }
              fill="#D1D5DB"
              fontSize={12}
              fontWeight={600}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
