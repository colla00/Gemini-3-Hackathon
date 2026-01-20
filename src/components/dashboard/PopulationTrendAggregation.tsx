// Population-Level Trend Aggregation - Cohort Risk Reduction Visualization
// Shows overall population risk trends with intervention efficacy metrics
// Copyright © Dr. Alexis Collier - Patent Pending

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, Bar, ReferenceLine, Legend
} from 'recharts';
import { 
  Users, TrendingDown, Activity, Award, 
  BarChart3, Target, Clock, Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PopulationDataPoint {
  time: string;
  hour: number;
  avgRisk: number;
  highRiskCount: number;
  moderateRiskCount: number;
  lowRiskCount: number;
  interventionCount: number;
  cumulativeReduction: number;
}

interface EfficacyMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target: number;
  description: string;
}

// Mock population trend data over 48 hours
const populationData: PopulationDataPoint[] = [
  { time: '0h', hour: 0, avgRisk: 58, highRiskCount: 4, moderateRiskCount: 8, lowRiskCount: 12, interventionCount: 0, cumulativeReduction: 0 },
  { time: '4h', hour: 4, avgRisk: 55, highRiskCount: 3, moderateRiskCount: 9, lowRiskCount: 12, interventionCount: 3, cumulativeReduction: 5 },
  { time: '8h', hour: 8, avgRisk: 52, highRiskCount: 3, moderateRiskCount: 8, lowRiskCount: 13, interventionCount: 5, cumulativeReduction: 10 },
  { time: '12h', hour: 12, avgRisk: 48, highRiskCount: 2, moderateRiskCount: 8, lowRiskCount: 14, interventionCount: 8, cumulativeReduction: 17 },
  { time: '16h', hour: 16, avgRisk: 45, highRiskCount: 2, moderateRiskCount: 7, lowRiskCount: 15, interventionCount: 10, cumulativeReduction: 22 },
  { time: '20h', hour: 20, avgRisk: 42, highRiskCount: 1, moderateRiskCount: 7, lowRiskCount: 16, interventionCount: 12, cumulativeReduction: 28 },
  { time: '24h', hour: 24, avgRisk: 40, highRiskCount: 1, moderateRiskCount: 6, lowRiskCount: 17, interventionCount: 14, cumulativeReduction: 31 },
  { time: '28h', hour: 28, avgRisk: 38, highRiskCount: 1, moderateRiskCount: 5, lowRiskCount: 18, interventionCount: 15, cumulativeReduction: 34 },
  { time: '32h', hour: 32, avgRisk: 36, highRiskCount: 0, moderateRiskCount: 5, lowRiskCount: 19, interventionCount: 16, cumulativeReduction: 38 },
  { time: '36h', hour: 36, avgRisk: 35, highRiskCount: 0, moderateRiskCount: 4, lowRiskCount: 20, interventionCount: 17, cumulativeReduction: 40 },
  { time: '40h', hour: 40, avgRisk: 34, highRiskCount: 0, moderateRiskCount: 4, lowRiskCount: 20, interventionCount: 17, cumulativeReduction: 41 },
  { time: '44h', hour: 44, avgRisk: 33, highRiskCount: 0, moderateRiskCount: 3, lowRiskCount: 21, interventionCount: 18, cumulativeReduction: 43 },
  { time: '48h', hour: 48, avgRisk: 32, highRiskCount: 0, moderateRiskCount: 3, lowRiskCount: 21, interventionCount: 18, cumulativeReduction: 45 },
];

const efficacyMetrics: EfficacyMetric[] = [
  { name: 'Average Risk Reduction', value: 45, unit: '%', trend: 'down', target: 40, description: 'Mean risk decrease across cohort' },
  { name: 'High-Risk Elimination', value: 100, unit: '%', trend: 'down', target: 90, description: 'Patients moved from high-risk tier' },
  { name: 'Time to Response', value: 4.2, unit: 'h', trend: 'down', target: 6, description: 'Average intervention response time' },
  { name: 'Intervention Efficiency', value: 2.5, unit: 'pts/%', trend: 'up', target: 2.0, description: 'Risk reduction per intervention' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover/95 backdrop-blur-md border border-border/50 rounded-xl p-4 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        <p className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border/30">{label}</p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between gap-6 items-center">
            <span className="text-muted-foreground">Avg Risk:</span>
            <span className="font-bold text-foreground tabular-nums">{data.avgRisk}%</span>
          </div>
          <div className="flex justify-between gap-6 items-center">
            <span className="text-muted-foreground">High Risk:</span>
            <span className="font-bold text-risk-high tabular-nums">{data.highRiskCount}</span>
          </div>
          <div className="flex justify-between gap-6 items-center">
            <span className="text-muted-foreground">Interventions:</span>
            <span className="font-bold text-primary tabular-nums">{data.interventionCount}</span>
          </div>
          <div className="flex justify-between gap-6 items-center pt-2 mt-2 border-t border-border/30">
            <span className="text-muted-foreground">Cumulative ↓:</span>
            <span className="font-bold text-risk-low tabular-nums">{data.cumulativeReduction}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface PopulationTrendAggregationProps {
  className?: string;
  compact?: boolean;
}

export function PopulationTrendAggregation({ className, compact = false }: PopulationTrendAggregationProps) {
  const [selectedView, setSelectedView] = useState<'trend' | 'distribution'>('trend');

  const summaryStats = useMemo(() => {
    const first = populationData[0];
    const last = populationData[populationData.length - 1];
    return {
      initialAvgRisk: first.avgRisk,
      finalAvgRisk: last.avgRisk,
      totalReduction: last.cumulativeReduction,
      totalInterventions: last.interventionCount,
      highRiskEliminated: first.highRiskCount - last.highRiskCount,
      patientsImproved: last.lowRiskCount - first.lowRiskCount,
    };
  }, []);

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            Population Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={populationData}>
              <defs>
                <linearGradient id="compactGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <Area
                type="monotone"
                dataKey="avgRisk"
                stroke="hsl(var(--primary))"
                fill="url(#compactGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4 chart-interactive", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Population-Level Trend Aggregation
          </h3>
          <p className="text-sm text-muted-foreground">
            Cohort risk reduction over time with intervention efficacy metrics
          </p>
        </div>
        <Badge variant="outline" className="text-xs flex items-center gap-1">
          <Award className="h-3 w-3 text-accent" />
          Patent Claim 3
        </Badge>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <TrendingDown className="h-5 w-5 text-risk-low mx-auto mb-2" />
            <div className="text-2xl font-bold text-risk-low">-{summaryStats.totalReduction}%</div>
            <div className="text-xs text-muted-foreground">Total Risk Reduction</div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <Activity className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{summaryStats.totalInterventions}</div>
            <div className="text-xs text-muted-foreground">Total Interventions</div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent">{summaryStats.highRiskEliminated}</div>
            <div className="text-xs text-muted-foreground">High-Risk Resolved</div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <Percent className="h-5 w-5 text-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {summaryStats.initialAvgRisk}% → {summaryStats.finalAvgRisk}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Risk Trajectory</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              48-Hour Population Risk Trajectory
            </CardTitle>
            <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
              <TabsList className="h-7">
                <TabsTrigger value="trend" className="text-xs h-6 px-2">Trend</TabsTrigger>
                <TabsTrigger value="distribution" className="text-xs h-6 px-2">Distribution</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 chart-animate-in">
            <ResponsiveContainer width="100%" height="100%">
              {selectedView === 'trend' ? (
                <ComposedChart data={populationData}>
                  <defs>
                    <linearGradient id="avgRiskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="reductionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--risk-low))" stopOpacity={0.3} />
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
                    yAxisId="left"
                    domain={[0, 80]}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                    label={{ 
                      value: 'Avg Risk %', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }
                    }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 50]}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                    label={{ 
                      value: 'Reduction %', 
                      angle: 90, 
                      position: 'insideRight',
                      style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }
                    }}
                  />

                  <ReferenceLine 
                    yAxisId="left"
                    y={40} 
                    stroke="hsl(var(--risk-medium))" 
                    strokeDasharray="4 4" 
                    strokeOpacity={0.5}
                    label={{ value: 'Target', position: 'right', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  />

                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="avgRisk"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#avgRiskGradient)"
                    name="Average Risk"
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                  />
                  
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cumulativeReduction"
                    stroke="hsl(var(--risk-low))"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    name="Cumulative Reduction"
                    dot={false}
                  />

                  <Bar
                    yAxisId="right"
                    dataKey="interventionCount"
                    fill="hsl(var(--accent))"
                    opacity={0.3}
                    name="Interventions"
                    radius={[2, 2, 0, 0]}
                  />

                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </ComposedChart>
              ) : (
                <ComposedChart data={populationData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    label={{ 
                      value: 'Patient Count', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' }
                    }}
                  />
                  
                  <Bar dataKey="highRiskCount" stackId="a" fill="hsl(var(--risk-high))" name="High Risk" />
                  <Bar dataKey="moderateRiskCount" stackId="a" fill="hsl(var(--risk-medium))" name="Moderate" />
                  <Bar dataKey="lowRiskCount" stackId="a" fill="hsl(var(--risk-low))" name="Low Risk" radius={[4, 4, 0, 0]} />

                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Efficacy Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Intervention Efficacy Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {efficacyMetrics.map((metric, index) => (
              <div 
                key={index}
                className={cn(
                  "p-4 rounded-lg border transition-all hover:shadow-md",
                  metric.value >= metric.target 
                    ? "bg-risk-low/10 border-risk-low/30" 
                    : "bg-muted/30 border-border"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{metric.name}</span>
                  {metric.value >= metric.target && (
                    <Badge className="text-[9px] bg-risk-low/20 text-risk-low border-risk-low/30">
                      Target Met
                    </Badge>
                  )}
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {metric.value}{metric.unit}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        metric.value >= metric.target ? "bg-risk-low" : "bg-primary"
                      )}
                      style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Target: {metric.target}{metric.unit}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">{metric.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time-to-Effect Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">4h</div>
                <div className="text-xs text-muted-foreground">Median Response Time</div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Time from intervention to measurable risk reduction
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-risk-low/20">
                <TrendingDown className="h-5 w-5 text-risk-low" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">12h</div>
                <div className="text-xs text-muted-foreground">Peak Effect Time</div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Time to maximum intervention impact observed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Activity className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">2.5%</div>
                <div className="text-xs text-muted-foreground">Reduction/Intervention</div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Average risk reduction per intervention action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Patent Notice */}
      <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-xs">
        <div className="flex items-start gap-2">
          <Award className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-accent">Novel Innovation:</span>
            <span className="text-muted-foreground ml-1">
              Population-level risk aggregation with intervention efficacy tracking enables 
              unit-wide quality improvement and resource optimization.
            </span>
            <p className="text-accent mt-1">Patent Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
