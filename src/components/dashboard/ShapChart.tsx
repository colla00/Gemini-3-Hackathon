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

  // Animate bars appearing one by one with 300ms delay
  useEffect(() => {
    setAnimatedData([]);
    data.forEach((item, index) => {
      setTimeout(() => {
        setAnimatedData(prev => [...prev, item]);
      }, index * 300);
    });
  }, [factors]);

  const positiveColor = '#F87171'; // SHAP positive (risk-increasing)
  const negativeColor = '#4ADE80'; // SHAP negative (risk-reducing)

  return (
    <div className="w-full h-[320px] animate-fade-in">
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
            tick={{ fill: '#D1D5DB', fontSize: 13, fontFamily: 'Montserrat' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.15)' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={160}
            tick={{ fill: '#D1D5DB', fontSize: 12, fontFamily: 'Montserrat' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
            tickLine={false}
            tickFormatter={(value, index) => {
              const item = animatedData[index];
              return item ? `${item.icon} ${value}` : value;
            }}
          />
          <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
          <Bar
            dataKey="value"
            radius={[6, 6, 6, 6]}
            barSize={32}
            animationDuration={500}
            animationEasing="ease-out"
          >
            {animatedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value >= 0 ? positiveColor : negativeColor}
                style={{
                  filter: `drop-shadow(0 2px 4px ${entry.value >= 0 ? 'rgba(248, 113, 113, 0.3)' : 'rgba(74, 222, 128, 0.3)'})`
                }}
              />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(value: number) =>
                value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2)
              }
              fill="#D1D5DB"
              fontSize={13}
              fontWeight={700}
              fontFamily="Montserrat"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
