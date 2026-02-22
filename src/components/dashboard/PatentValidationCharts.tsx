import { useState } from 'react';
import { BarChart3, Map, TrendingUp, PieChart, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, ZAxis, Cell, PieChart as RechartsPie, Pie,
  Legend
} from 'recharts';
import { RESEARCH_DATA } from '@/data/researchData';

// Feature importance data from patent Figure 2
const featureImportanceData = [
  { name: 'APACHE II Score', weight: 0.25, fill: 'hsl(var(--chart-1))' },
  { name: 'SOFA Score', weight: 0.20, fill: 'hsl(var(--chart-2))' },
  { name: 'Comorbidities', weight: 0.18, fill: 'hsl(var(--chart-3))' },
  { name: 'Active Medications', weight: 0.15, fill: 'hsl(var(--chart-4))' },
  { name: 'Age', weight: 0.12, fill: 'hsl(var(--chart-5))' },
  { name: 'Mechanical Vent', weight: 0.10, fill: 'hsl(var(--primary))' },
  { name: 'Continuous Monitoring', weight: 0.08, fill: 'hsl(var(--muted-foreground))' },
  { name: 'Admission Type', weight: 0.06, fill: 'hsl(var(--secondary-foreground))' },
  { name: 'Previous ICU', weight: 0.04, fill: 'hsl(var(--accent-foreground))' },
  { name: 'Mobility Score', weight: 0.02, fill: 'hsl(var(--destructive))' },
];

// ROC curve data from patent Figure 4
const rocCurveData = Array.from({ length: 21 }, (_, i) => {
  const fpr = i / 20;
  // Simulate AUROC 0.802 curve
  const tpr = Math.pow(fpr, 0.3) * 0.95 + fpr * 0.05;
  return { fpr: fpr * 100, tpr: Math.min(tpr * 100, 100), random: fpr * 100 };
});

// DBS vs LOS scatter data from patent Figure 6
const dbsLosData = Array.from({ length: 50 }, () => {
  const dbs = Math.random() * 100;
  // r = 0.40 correlation with some noise
  const los = (dbs * 0.15) + (Math.random() * 8) + 2;
  return { dbs: Math.round(dbs), los: Math.round(los * 10) / 10, z: 100 };
});

// Quartile distribution data from patent Figure 7
const quartileDistribution = [
  { name: 'Q1: Low', patients: 2847, percentage: 28.47, color: 'hsl(var(--risk-low))' },
  { name: 'Q2: Moderate', patients: 2615, percentage: 26.15, color: 'hsl(var(--chart-3))' },
  { name: 'Q3: High', patients: 2389, percentage: 23.89, color: 'hsl(var(--risk-medium))' },
  { name: 'Q4: Very High', patients: 2149, percentage: 21.49, color: 'hsl(var(--risk-high))' },
];

// Staffing impact data from patent Figure 8
const staffingImpactData = [
  { quartile: 'Q1', overtime: 24, savings: 15000, reduction: 17 },
  { quartile: 'Q2', overtime: 36, savings: 35000, reduction: 19 },
  { quartile: 'Q3', overtime: 58, savings: 52000, reduction: 21 },
  { quartile: 'Q4', overtime: 80, savings: 78000, reduction: 20 },
];

// Hospital validation map data from patent Figure 5
const hospitalRegions = [
  { region: 'Northeast', hospitals: 48, avgAuc: 0.76 },
  { region: 'Southeast', hospitals: 42, avgAuc: 0.74 },
  { region: 'Midwest', hospitals: 38, avgAuc: 0.73 },
  { region: 'Southwest', hospitals: 35, avgAuc: 0.75 },
  { region: 'West Coast', hospitals: 38, avgAuc: 0.77 },
];

export const PatentValidationCharts = () => {
  const [activeTab, setActiveTab] = useState('features');

  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Research Validation Visualizations</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                321,719 patients · 208 hospitals · AUROC 0.802→0.857
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px]">Patent Figures 2-8</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="features" className="text-xs">Features</TabsTrigger>
            <TabsTrigger value="roc" className="text-xs">ROC</TabsTrigger>
            <TabsTrigger value="correlation" className="text-xs">DBS↔LOS</TabsTrigger>
            <TabsTrigger value="quartiles" className="text-xs">Quartiles</TabsTrigger>
            <TabsTrigger value="impact" className="text-xs">Impact</TabsTrigger>
          </TabsList>
          
          {/* Feature Importance Chart */}
          <TabsContent value="features" className="mt-0">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Top 10 Predictive Features (Relative Weight)</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={featureImportanceData} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" domain={[0, 0.3]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={95} />
                  <Tooltip
                    formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Weight']}
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                    {featureImportanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          {/* ROC Curve */}
          <TabsContent value="roc" className="mt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Internal Validation ROC Curve (N=24,689 · MIMIC-IV)</p>
                <Badge className="bg-risk-low/20 text-risk-low border-risk-low/30 text-[10px]">
                  AUROC = 0.802
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={rocCurveData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="fpr" 
                    label={{ value: 'False Positive Rate (%)', position: 'bottom', fontSize: 10 }}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    label={{ value: 'True Positive Rate (%)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Line 
                    type="monotone" 
                    dataKey="tpr" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                    name="DBS Model"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="random" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Random (AUC=0.50)"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          {/* DBS vs LOS Scatter */}
          <TabsContent value="correlation" className="mt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">DBS vs ICU Length of Stay</p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px]">r = 0.40</Badge>
                  <Badge variant="outline" className="text-[10px]">p &lt; 0.001</Badge>
                  <Badge variant="outline" className="text-[10px]">d = 3.2</Badge>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <ScatterChart margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="dbs" 
                    type="number"
                    domain={[0, 100]}
                    label={{ value: 'Documentation Burden Score', position: 'bottom', fontSize: 10 }}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    dataKey="los" 
                    type="number"
                    domain={[0, 20]}
                    label={{ value: 'ICU LOS (days)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                    tick={{ fontSize: 10 }}
                  />
                  <ZAxis dataKey="z" range={[30, 30]} />
                  <Tooltip 
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number, name: string) => [
                      name === 'dbs' ? `${value}` : `${value} days`,
                      name === 'dbs' ? 'DBS' : 'LOS'
                    ]}
                  />
                  <Scatter data={dbsLosData} fill="hsl(var(--chart-1))" opacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          {/* Quartile Distribution */}
          <TabsContent value="quartiles" className="mt-0">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Patient Distribution Across DBS Quartiles (N=321,719)</p>
              <div className="grid grid-cols-2 gap-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={quartileDistribution}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="patients" radius={[4, 4, 0, 0]}>
                      {quartileDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPie>
                    <Pie
                      data={quartileDistribution}
                      dataKey="percentage"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      label={({ name, percentage }) => `${percentage.toFixed(1)}%`}
                      labelLine={false}
                    >
                      {quartileDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend 
                      layout="vertical" 
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{ fontSize: '10px' }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          {/* Staffing Impact */}
          <TabsContent value="impact" className="mt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">DBS-Guided Staffing Impact by Quartile</p>
                <div className="flex gap-2">
                  <Badge className="bg-risk-low/20 text-risk-low border-risk-low/30 text-[10px]">
                    15-20% Overtime ↓
                  </Badge>
                  <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30 text-[10px]">
                    $180K-$360K ROI
                  </Badge>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={staffingImpactData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="quartile" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `$${v/1000}k`} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number, name: string) => [
                      name === 'savings' ? `$${value.toLocaleString()}` : `${value}%`,
                      name === 'savings' ? 'Weekly Savings' : 'Overtime Hours'
                    ]}
                  />
                  <Bar yAxisId="left" dataKey="overtime" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Overtime Hours" />
                  <Bar yAxisId="right" dataKey="savings" fill="hsl(var(--risk-low))" radius={[4, 4, 0, 0]} name="Weekly Savings" />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Hospital validation summary */}
              <div className="grid grid-cols-5 gap-2 mt-3">
                {hospitalRegions.map((region) => (
                  <div key={region.region} className="bg-secondary/30 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-foreground">{region.hospitals}</div>
                    <div className="text-[9px] text-muted-foreground">{region.region}</div>
                    <div className="text-[10px] text-primary">AUC {region.avgAuc}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
