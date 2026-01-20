// Research Data Visualizations
// Based on DRALEXIS package specification: 10,000 patients, 201 hospitals
// Copyright © Dr. Alexis Collier - Patent Pending

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { BarChart3, TrendingDown, DollarSign, Users, Activity, FileText, GitCompare, Clock, Layers } from 'lucide-react';
import { RESEARCH_DATA } from '@/data/researchData';
import { cn } from '@/lib/utils';
import { InterventionTrendChart } from './InterventionTrendChart';
import { InterventionCascadeTimeline } from './InterventionCascadeTimeline';
import { PopulationTrendAggregation } from './PopulationTrendAggregation';

interface ResearchChartsProps {
  className?: string;
  compact?: boolean;
}

// Color palette using semantic colors
const COLORS = {
  primary: 'hsl(var(--primary))',
  riskLow: 'hsl(142.1 76.2% 36.3%)',
  riskMedium: 'hsl(47.9 95.8% 53.1%)',
  riskHigh: 'hsl(0 84.2% 60.2%)',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted-foreground))',
};

const QUARTILE_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

export function ResearchCharts({ className, compact = false }: ResearchChartsProps) {
  // DBS Quartile Distribution Data
  const quartileData = useMemo(() => 
    RESEARCH_DATA.dbs.quartiles.map((q, i) => ({
      name: q.name.split(':')[0],
      label: q.name.split(':')[1]?.trim() || q.name,
      patients: q.patients,
      percentage: q.percentage,
      staffingRatio: q.staffingRatio,
      fill: QUARTILE_COLORS[i],
    })),
    []
  );

  // Alert Reduction Data (Before vs After)
  const alertData = useMemo(() => [
    { 
      name: 'Before', 
      alerts: RESEARCH_DATA.alerts.beforeAlerts, 
      fill: '#ef4444',
      label: 'Non-optimized'
    },
    { 
      name: 'After', 
      alerts: RESEARCH_DATA.alerts.afterAlerts, 
      fill: '#22c55e',
      label: 'With DRALEXIS'
    },
  ], []);

  // ROI Breakdown Data
  const roiData = useMemo(() => [
    { name: 'Overtime\nReduction', value: 35, fullName: 'Overtime Reduction (15-20%)' },
    { name: 'Transfer\nReduction', value: 25, fullName: 'Transfer Reduction (8-15%)' },
    { name: 'Mortality\nReduction', value: 40, fullName: 'Mortality Reduction (10-18%)' },
  ], []);

  // Validation AUC Comparison
  const aucData = useMemo(() => [
    { name: 'Internal\n(10K pts)', auc: RESEARCH_DATA.validation.internalAUC * 100, fill: '#3b82f6' },
    { name: 'External\n(201 hosp)', auc: RESEARCH_DATA.validation.externalAUC * 100, fill: '#8b5cf6' },
    { name: 'Sepsis\nPrediction', auc: RESEARCH_DATA.risk.sepsisAUC * 100, fill: '#22c55e' },
    { name: 'Respiratory\nPrediction', auc: RESEARCH_DATA.risk.respiratoryAUC * 100, fill: '#06b6d4' },
  ], []);

  // DBS Feature Weights
  const featureData = useMemo(() => 
    RESEARCH_DATA.dbs.features.slice(0, 6).map((f, i) => ({
      name: f.name.replace(' Score', '').replace('Number of ', ''),
      weight: f.weight * 100,
      fill: i < 2 ? '#3b82f6' : i < 4 ? '#8b5cf6' : '#06b6d4',
    })),
    []
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover/95 backdrop-blur-md border border-border/50 rounded-xl p-4 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
          <p className="text-sm font-semibold text-foreground mb-2 pb-2 border-b border-border/30">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: entry.fill || entry.color }}
                  />
                  <span className="text-xs text-muted-foreground">{entry.name}:</span>
                </div>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                  {entry.dataKey === 'percentage' && '%'}
                  {entry.dataKey === 'auc' && '%'}
                  {entry.dataKey === 'weight' && '%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (compact) {
    return (
      <div className={cn("grid grid-cols-2 gap-4", className)}>
        {/* Mini DBS Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              DBS Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quartileData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={25} />
                <Bar dataKey="patients" radius={[0, 4, 4, 0]}>
                  {quartileData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mini Alert Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5 text-primary" />
              Alert Reduction
            </CardTitle>
          </CardHeader>
          <CardContent className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Bar dataKey="alerts" radius={[4, 4, 0, 0]}>
                  {alertData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 chart-interactive", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Research Validation Charts
          </h3>
          <p className="text-sm text-muted-foreground">
            Data from {RESEARCH_DATA.validation.internalPatients.toLocaleString()} patients, {RESEARCH_DATA.validation.externalHospitals} hospitals
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          ANIA 2026 Abstract #185
        </Badge>
      </div>

      {/* Tabs for different chart views */}
      <Tabs defaultValue="validation" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="validation" className="text-xs">
            <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
            Validation
          </TabsTrigger>
          <TabsTrigger value="intervention" className="text-xs">
            <GitCompare className="h-3.5 w-3.5 mr-1.5" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="cascade" className="text-xs">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Cascade
          </TabsTrigger>
          <TabsTrigger value="population" className="text-xs">
            <Layers className="h-3.5 w-3.5 mr-1.5" />
            Population
          </TabsTrigger>
        </TabsList>

        <TabsContent value="validation" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DBS Quartile Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              DBS Quartile Distribution
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Patient distribution by documentation burden level
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 chart-animate-in">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quartileData} barCategoryGap="20%">
                  <defs>
                    {quartileData.map((entry, index) => (
                      <linearGradient key={`grad-${index}`} id={`quartileGrad${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={entry.fill} stopOpacity={1} />
                        <stop offset="100%" stopColor={entry.fill} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                    axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ 
                      value: 'Patients', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} />
                  <Bar 
                    dataKey="patients" 
                    radius={[6, 6, 0, 0]} 
                    name="Patients"
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {quartileData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#quartileGrad${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              {quartileData.map((q, i) => (
                <div key={i} className="p-2 rounded-lg bg-muted/30">
                  <div className="text-xs font-semibold" style={{ color: q.fill }}>
                    {q.percentage}%
                  </div>
                  <div className="text-[10px] text-muted-foreground">{q.label}</div>
                  <div className="text-[10px] text-muted-foreground/60">{q.staffingRatio}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert Reduction Before/After */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-primary" />
              Smart Alert Reduction
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {Math.round(RESEARCH_DATA.alerts.reductionRate * 100)}% reduction in non-actionable alerts
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 chart-animate-in">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertData} barCategoryGap="30%">
                  <defs>
                    <linearGradient id="alertBeforeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="alertAfterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0.6} />
                    </linearGradient>
                    <filter id="alertGlow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ 
                      value: 'Alerts/Shift', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} />
                  <Bar 
                    dataKey="alerts" 
                    radius={[8, 8, 0, 0]} 
                    name="Alerts"
                    animationBegin={200}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {alertData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? 'url(#alertBeforeGrad)' : 'url(#alertAfterGrad)'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{RESEARCH_DATA.alerts.beforeAlerts}</div>
                <div className="text-xs text-muted-foreground">Before</div>
              </div>
              <div className="text-2xl">→</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-risk-low">{RESEARCH_DATA.alerts.afterAlerts}</div>
                <div className="text-xs text-muted-foreground">After</div>
              </div>
              <Badge className="bg-risk-low/20 text-risk-low border-risk-low/30">
                {Math.round((1 - RESEARCH_DATA.alerts.afterAlerts / RESEARCH_DATA.alerts.beforeAlerts) * 100)}% Reduction
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Model Validation AUC */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Model Performance (AUC)
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Area Under Curve scores across validation cohorts
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 chart-animate-in">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aucData} layout="vertical" barCategoryGap="25%">
                  <defs>
                    <linearGradient id="aucGrad1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="aucGrad2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="aucGrad3" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="aucGrad4" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    type="number" 
                    domain={[50, 100]}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                    tickFormatter={(v) => `${v}%`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={75}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} />
                  <Bar 
                    dataKey="auc" 
                    radius={[0, 6, 6, 0]} 
                    name="AUC"
                    animationBegin={300}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {aucData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#aucGrad${index + 1})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-sm" />
                <span className="font-medium">Internal</span>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 shadow-sm" />
                <span className="font-medium">External</span>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-sm" />
                <span className="font-medium">Risk Models</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* DBS Feature Weights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              DBS Scoring Weights
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Relative contribution of clinical factors
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 chart-animate-in">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureData} layout="vertical" barCategoryGap="20%">
                  <defs>
                    <linearGradient id="featureGrad1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="featureGrad2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    type="number" 
                    domain={[0, 30]}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                    tickFormatter={(v) => `${v}%`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} />
                  <Bar 
                    dataKey="weight" 
                    radius={[0, 6, 6, 0]} 
                    name="Weight"
                    animationBegin={400}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {featureData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index < 3 ? 'url(#featureGrad1)' : 'url(#featureGrad2)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <Badge variant="outline" className="text-xs px-3 py-1 font-medium">
                Validated: Cohen's d = {RESEARCH_DATA.validation.cohensD}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI Breakdown Pie */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            ROI Contribution Breakdown
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Sources of annual savings (${(RESEARCH_DATA.roi.baseROI[0] / 1000).toFixed(0)}K - ${(RESEARCH_DATA.roi.baseROI[1] / 1000).toFixed(0)}K range)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roiData.map((item, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-4 rounded-xl border text-center transition-all hover:scale-[1.02]",
                  index === 0 && "bg-blue-500/10 border-blue-500/20",
                  index === 1 && "bg-purple-500/10 border-purple-500/20",
                  index === 2 && "bg-green-500/10 border-green-500/20",
                )}
              >
                <div className={cn(
                  "text-3xl font-bold mb-2",
                  index === 0 && "text-blue-600",
                  index === 1 && "text-purple-600",
                  index === 2 && "text-green-600",
                )}>
                  {item.value}%
                </div>
                <div className="text-sm font-medium text-foreground whitespace-pre-line">
                  {item.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.fullName}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
              <span className="text-sm text-muted-foreground">Payback Period:</span>
              <span className="text-lg font-bold text-primary">
                {RESEARCH_DATA.roi.paybackMonths[0]}-{RESEARCH_DATA.roi.paybackMonths[1]} months
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="intervention" className="mt-4">
          <InterventionTrendChart />
        </TabsContent>

        <TabsContent value="cascade" className="mt-4">
          <InterventionCascadeTimeline autoPlay={false} speed={400} />
        </TabsContent>

        <TabsContent value="population" className="mt-4">
          <PopulationTrendAggregation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
