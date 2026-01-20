// Intervention Trend Charts - Before/After Risk Trajectory Comparison
// Demonstrates temporal awareness with intervention impact visualization
// Copyright © Dr. Alexis Collier - Patent Pending

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend, ComposedChart, Line
} from 'recharts';
import { 
  TrendingDown, TrendingUp, Activity, Clock, Award, 
  ArrowRight, Minus, Play, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterventionPoint {
  time: string;
  hour: number;
  riskBefore: number;
  riskAfter: number;
  confidenceLower: number;
  confidenceUpper: number;
}

interface InterventionScenario {
  id: string;
  patientId: string;
  intervention: string;
  interventionHour: number;
  baselineRisk: number;
  currentRisk: number;
  projectedRisk: number;
  riskReduction: number;
  trajectory: 'declining' | 'stable' | 'rising';
  dataPoints: InterventionPoint[];
}

// Mock intervention scenarios demonstrating before/after comparisons
const mockScenarios: InterventionScenario[] = [
  {
    id: 'int-1',
    patientId: '849201',
    intervention: 'Early Mobility Protocol',
    interventionHour: 12,
    baselineRisk: 72,
    currentRisk: 48,
    projectedRisk: 35,
    riskReduction: 33,
    trajectory: 'declining',
    dataPoints: [
      { time: '0h', hour: 0, riskBefore: 72, riskAfter: 72, confidenceLower: 68, confidenceUpper: 76 },
      { time: '4h', hour: 4, riskBefore: 74, riskAfter: 70, confidenceLower: 65, confidenceUpper: 75 },
      { time: '8h', hour: 8, riskBefore: 76, riskAfter: 65, confidenceLower: 58, confidenceUpper: 72 },
      { time: '12h', hour: 12, riskBefore: 78, riskAfter: 58, confidenceLower: 50, confidenceUpper: 66 },
      { time: '16h', hour: 16, riskBefore: 80, riskAfter: 52, confidenceLower: 44, confidenceUpper: 60 },
      { time: '20h', hour: 20, riskBefore: 82, riskAfter: 48, confidenceLower: 40, confidenceUpper: 56 },
      { time: '24h', hour: 24, riskBefore: 85, riskAfter: 42, confidenceLower: 34, confidenceUpper: 50 },
      { time: '48h', hour: 48, riskBefore: 88, riskAfter: 35, confidenceLower: 28, confidenceUpper: 42 },
    ]
  },
  {
    id: 'int-2',
    patientId: '847203',
    intervention: 'Catheter Removal Protocol',
    interventionHour: 8,
    baselineRisk: 65,
    currentRisk: 42,
    projectedRisk: 28,
    riskReduction: 35,
    trajectory: 'declining',
    dataPoints: [
      { time: '0h', hour: 0, riskBefore: 65, riskAfter: 65, confidenceLower: 60, confidenceUpper: 70 },
      { time: '4h', hour: 4, riskBefore: 68, riskAfter: 60, confidenceLower: 54, confidenceUpper: 66 },
      { time: '8h', hour: 8, riskBefore: 70, riskAfter: 52, confidenceLower: 45, confidenceUpper: 59 },
      { time: '12h', hour: 12, riskBefore: 72, riskAfter: 45, confidenceLower: 38, confidenceUpper: 52 },
      { time: '16h', hour: 16, riskBefore: 75, riskAfter: 40, confidenceLower: 33, confidenceUpper: 47 },
      { time: '20h', hour: 20, riskBefore: 78, riskAfter: 35, confidenceLower: 28, confidenceUpper: 42 },
      { time: '24h', hour: 24, riskBefore: 80, riskAfter: 30, confidenceLower: 24, confidenceUpper: 36 },
      { time: '48h', hour: 48, riskBefore: 82, riskAfter: 28, confidenceLower: 22, confidenceUpper: 34 },
    ]
  },
  {
    id: 'int-3',
    patientId: '850104',
    intervention: 'Sedation Vacation',
    interventionHour: 6,
    baselineRisk: 58,
    currentRisk: 45,
    projectedRisk: 38,
    riskReduction: 20,
    trajectory: 'stable',
    dataPoints: [
      { time: '0h', hour: 0, riskBefore: 58, riskAfter: 58, confidenceLower: 54, confidenceUpper: 62 },
      { time: '4h', hour: 4, riskBefore: 60, riskAfter: 55, confidenceLower: 50, confidenceUpper: 60 },
      { time: '8h', hour: 8, riskBefore: 62, riskAfter: 50, confidenceLower: 44, confidenceUpper: 56 },
      { time: '12h', hour: 12, riskBefore: 63, riskAfter: 48, confidenceLower: 42, confidenceUpper: 54 },
      { time: '16h', hour: 16, riskBefore: 64, riskAfter: 45, confidenceLower: 39, confidenceUpper: 51 },
      { time: '20h', hour: 20, riskBefore: 65, riskAfter: 43, confidenceLower: 37, confidenceUpper: 49 },
      { time: '24h', hour: 24, riskBefore: 66, riskAfter: 40, confidenceLower: 34, confidenceUpper: 46 },
      { time: '48h', hour: 48, riskBefore: 68, riskAfter: 38, confidenceLower: 32, confidenceUpper: 44 },
    ]
  },
];

const TrajectoryIcon = ({ trajectory }: { trajectory: InterventionScenario['trajectory'] }) => {
  switch (trajectory) {
    case 'declining':
      return <TrendingDown className="w-4 h-4 text-risk-low" />;
    case 'rising':
      return <TrendingUp className="w-4 h-4 text-risk-high" />;
    default:
      return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

interface InterventionTrendChartProps {
  className?: string;
  compact?: boolean;
}

export function InterventionTrendChart({ className, compact = false }: InterventionTrendChartProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>(mockScenarios[0].id);
  const [animating, setAnimating] = useState(false);

  const activeScenario = useMemo(
    () => mockScenarios.find(s => s.id === selectedScenario) || mockScenarios[0],
    [selectedScenario]
  );

  const handleReplay = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 2000);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover/95 backdrop-blur-md border border-border/50 rounded-xl p-4 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
          <p className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border/30">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-1 rounded-full bg-risk-high" />
              <span className="text-xs text-muted-foreground flex-1">Without intervention:</span>
              <span className="text-sm font-bold text-risk-high tabular-nums">{data.riskBefore}%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-1 rounded-full bg-risk-low" />
              <span className="text-xs text-muted-foreground flex-1">With intervention:</span>
              <span className="text-sm font-bold text-risk-low tabular-nums">{data.riskAfter}%</span>
            </div>
            <div className="pt-2 mt-2 border-t border-border/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Risk reduction:</span>
              <span className="text-sm font-bold text-primary tabular-nums">
                -{data.riskBefore - data.riskAfter}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (compact) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-primary" />
            Intervention Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeScenario.dataPoints}>
              <defs>
                <linearGradient id="gradientBefore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--risk-high))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--risk-high))" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="gradientAfter" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--risk-low))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--risk-low))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <Area
                type="monotone"
                dataKey="riskBefore"
                stroke="hsl(var(--risk-high))"
                fill="url(#gradientBefore)"
                strokeWidth={1.5}
                strokeDasharray="4 2"
              />
              <Area
                type="monotone"
                dataKey="riskAfter"
                stroke="hsl(var(--risk-low))"
                fill="url(#gradientAfter)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Intervention Impact Analysis
          </h3>
          <p className="text-sm text-muted-foreground">
            Before/after risk trajectories with intervention timing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Award className="h-3 w-3 text-accent" />
            Patent Claim 4
          </Badge>
          <Button variant="ghost" size="sm" onClick={handleReplay} className="h-7">
            <RefreshCw className={cn("h-3.5 w-3.5 mr-1", animating && "animate-spin")} />
            Replay
          </Button>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="flex flex-wrap gap-2">
        {mockScenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
              selectedScenario === scenario.id
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
            )}
          >
            <TrajectoryIcon trajectory={scenario.trajectory} />
            <span className="font-medium">{scenario.patientId}</span>
            <span className="text-xs opacity-70">{scenario.intervention}</span>
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Risk Trajectory: {activeScenario.intervention}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Patient {activeScenario.patientId} • Intervention at {activeScenario.interventionHour}h
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-risk-high">{activeScenario.baselineRisk}%</div>
                <div className="text-[10px] text-muted-foreground">Baseline</div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="text-center">
                <div className="text-lg font-bold text-risk-low">{activeScenario.projectedRisk}%</div>
                <div className="text-[10px] text-muted-foreground">Projected</div>
              </div>
              <Badge className="bg-risk-low/20 text-risk-low border-risk-low/30">
                -{activeScenario.riskReduction}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72 chart-animate-in">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={activeScenario.dataPoints}>
                <defs>
                  <linearGradient id="gradientConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradientBeforeFull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--risk-high))" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(var(--risk-high))" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradientAfterFull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--risk-low))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--risk-low))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid 
                  strokeDasharray="4 4" 
                  stroke="hsl(var(--border))" 
                  strokeOpacity={0.3}
                  vertical={false}
                />
                
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                  axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                  label={{ 
                    value: 'Risk Level', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }
                  }}
                />

                {/* Intervention marker line */}
                <ReferenceLine 
                  x={`${activeScenario.interventionHour}h`} 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  label={{ 
                    value: 'Intervention', 
                    position: 'top', 
                    fill: 'hsl(var(--primary))',
                    fontSize: 10
                  }}
                />

                {/* Risk threshold lines */}
                <ReferenceLine 
                  y={70} 
                  stroke="hsl(var(--risk-high))" 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.5}
                />
                <ReferenceLine 
                  y={40} 
                  stroke="hsl(var(--risk-medium))" 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.4}
                />

                {/* Confidence band for after intervention */}
                <Area
                  type="monotone"
                  dataKey="confidenceUpper"
                  stroke="none"
                  fill="url(#gradientConfidence)"
                  animationDuration={1500}
                />

                {/* Before intervention trajectory (dashed) */}
                <Area
                  type="monotone"
                  dataKey="riskBefore"
                  stroke="hsl(var(--risk-high))"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  fill="url(#gradientBeforeFull)"
                  animationDuration={1200}
                  name="Without Intervention"
                />

                {/* After intervention trajectory (solid) */}
                <Area
                  type="monotone"
                  dataKey="riskAfter"
                  stroke="hsl(var(--risk-low))"
                  strokeWidth={2.5}
                  fill="url(#gradientAfterFull)"
                  animationDuration={1500}
                  name="With Intervention"
                  dot={{ fill: 'hsl(var(--risk-low))', strokeWidth: 2, r: 4 }}
                />

                <Tooltip content={<CustomTooltip />} />
                
                <Legend 
                  wrapperStyle={{ fontSize: 11 }}
                  iconType="line"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50">
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Time to Response</div>
              <div className="text-lg font-bold text-foreground">{activeScenario.interventionHour}h</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-risk-high/10">
              <div className="text-xs text-muted-foreground mb-1">Peak Risk (No Int.)</div>
              <div className="text-lg font-bold text-risk-high">
                {Math.max(...activeScenario.dataPoints.map(d => d.riskBefore))}%
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-risk-low/10">
              <div className="text-xs text-muted-foreground mb-1">Nadir (With Int.)</div>
              <div className="text-lg font-bold text-risk-low">
                {Math.min(...activeScenario.dataPoints.map(d => d.riskAfter))}%
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <div className="text-xs text-muted-foreground mb-1">Total Reduction</div>
              <div className="text-lg font-bold text-primary">
                {activeScenario.baselineRisk - activeScenario.projectedRisk}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockScenarios.map((scenario, index) => (
          <Card 
            key={scenario.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedScenario === scenario.id && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedScenario(scenario.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrajectoryIcon trajectory={scenario.trajectory} />
                  <span className="font-medium text-sm">{scenario.patientId}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[10px]",
                    scenario.trajectory === 'declining' && "border-risk-low/50 text-risk-low",
                    scenario.trajectory === 'stable' && "border-muted-foreground/50",
                    scenario.trajectory === 'rising' && "border-risk-high/50 text-risk-high"
                  )}
                >
                  {scenario.trajectory}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground mb-3">{scenario.intervention}</div>
              
              {/* Mini trend chart */}
              <div className="h-16 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scenario.dataPoints}>
                    <defs>
                      <linearGradient id={`mini-before-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--risk-high))" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(var(--risk-high))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id={`mini-after-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--risk-low))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--risk-low))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="riskBefore"
                      stroke="hsl(var(--risk-high))"
                      strokeWidth={1}
                      strokeDasharray="3 2"
                      fill={`url(#mini-before-${index})`}
                    />
                    <Area
                      type="monotone"
                      dataKey="riskAfter"
                      stroke="hsl(var(--risk-low))"
                      strokeWidth={1.5}
                      fill={`url(#mini-after-${index})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {scenario.baselineRisk}% → {scenario.projectedRisk}%
                </span>
                <span className="font-semibold text-risk-low">-{scenario.riskReduction}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patent Notice */}
      <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-xs">
        <div className="flex items-start gap-2">
          <Award className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-accent">Novel Innovation:</span>
            <span className="text-muted-foreground ml-1">
              Counterfactual trajectory modeling with intervention timing optimization enables 
              evidence-based intervention decisions and outcome prediction.
            </span>
            <p className="text-accent mt-1">Patent Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
