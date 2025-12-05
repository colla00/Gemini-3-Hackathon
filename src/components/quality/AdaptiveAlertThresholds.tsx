import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, BellOff, TrendingDown, Brain, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';

interface UnitBaseline {
  unit: string;
  baselineRisk: number;
  currentThreshold: number;
  adaptedThreshold: number;
  alertsToday: number;
  falsePositiveRate: number;
  truePositiveRate: number;
}

const unitBaselines: UnitBaseline[] = [
  { unit: 'ICU-A', baselineRisk: 0.45, currentThreshold: 0.7, adaptedThreshold: 0.72, alertsToday: 12, falsePositiveRate: 0.08, truePositiveRate: 0.94 },
  { unit: 'Med-Surg 3E', baselineRisk: 0.28, currentThreshold: 0.7, adaptedThreshold: 0.65, alertsToday: 8, falsePositiveRate: 0.12, truePositiveRate: 0.89 },
  { unit: 'Oncology', baselineRisk: 0.52, currentThreshold: 0.7, adaptedThreshold: 0.75, alertsToday: 15, falsePositiveRate: 0.06, truePositiveRate: 0.96 },
  { unit: 'Cardiac Step-Down', baselineRisk: 0.38, currentThreshold: 0.7, adaptedThreshold: 0.68, alertsToday: 10, falsePositiveRate: 0.10, truePositiveRate: 0.91 },
];

const alertFatigueData = [
  { hour: '6am', static: 45, adaptive: 28, dismissed: 18 },
  { hour: '8am', static: 62, adaptive: 35, dismissed: 24 },
  { hour: '10am', static: 58, adaptive: 32, dismissed: 22 },
  { hour: '12pm', static: 71, adaptive: 38, dismissed: 28 },
  { hour: '2pm', static: 65, adaptive: 34, dismissed: 25 },
  { hour: '4pm', static: 68, adaptive: 36, dismissed: 26 },
  { hour: '6pm', static: 54, adaptive: 30, dismissed: 20 },
  { hour: '8pm', static: 48, adaptive: 27, dismissed: 17 },
];

const learningCurveData = [
  { week: 'W1', threshold: 0.70, falsePositive: 0.22, truePositive: 0.85 },
  { week: 'W2', threshold: 0.68, falsePositive: 0.18, truePositive: 0.87 },
  { week: 'W3', threshold: 0.66, falsePositive: 0.15, truePositive: 0.89 },
  { week: 'W4', threshold: 0.65, falsePositive: 0.12, truePositive: 0.91 },
  { week: 'W5', threshold: 0.65, falsePositive: 0.10, truePositive: 0.92 },
  { week: 'W6', threshold: 0.64, falsePositive: 0.09, truePositive: 0.93 },
];

export const AdaptiveAlertThresholds = () => {
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<UnitBaseline>(unitBaselines[0]);
  const [manualThreshold, setManualThreshold] = useState([70]);

  const alertReduction = Math.round(((45 - 28) / 45) * 100);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Adaptive Alert Thresholds
          </h2>
          <p className="text-sm text-muted-foreground">
            ML-based personalized thresholds learning from unit-specific baselines
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Patent Claim #3
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Adaptive Mode</span>
            <Switch checked={adaptiveEnabled} onCheckedChange={setAdaptiveEnabled} />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-success/10 border-success/30">
          <CardContent className="p-4 text-center">
            <TrendingDown className="w-6 h-6 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-success">{alertReduction}%</div>
            <div className="text-xs text-muted-foreground">Alert Reduction</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">93%</div>
            <div className="text-xs text-muted-foreground">True Positive Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-4 text-center">
            <BellOff className="w-6 h-6 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-warning">9%</div>
            <div className="text-xs text-muted-foreground">False Positive Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50 border-border">
          <CardContent className="p-4 text-center">
            <Bell className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold">45</div>
            <div className="text-xs text-muted-foreground">Alerts Today</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fatigue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fatigue">Alert Fatigue Analysis</TabsTrigger>
          <TabsTrigger value="units">Unit-Specific Thresholds</TabsTrigger>
          <TabsTrigger value="learning">Learning Curve</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="fatigue">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Static vs Adaptive Alert Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={alertFatigueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="static"
                      stackId="1"
                      stroke="hsl(var(--destructive))"
                      fill="hsl(var(--destructive))"
                      fillOpacity={0.3}
                      name="Static Threshold"
                    />
                    <Area
                      type="monotone"
                      dataKey="adaptive"
                      stackId="2"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                      name="Adaptive Threshold"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/30">
                <p className="text-sm text-success">
                  <strong>Innovation:</strong> Adaptive thresholds reduce alert volume by {alertReduction}% while maintaining 
                  sensitivity, directly addressing clinician alert fatigue—a leading cause of missed events.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="units">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Unit-Specific Learned Baselines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unitBaselines.map((unit) => (
                  <div
                    key={unit.unit}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedUnit.unit === unit.unit
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-secondary/30 border-border hover:bg-secondary/50'
                    }`}
                    onClick={() => setSelectedUnit(unit)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{unit.unit}</span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          Baseline: {(unit.baselineRisk * 100).toFixed(0)}%
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={unit.adaptedThreshold < unit.currentThreshold 
                            ? 'bg-success/10 text-success border-success/30' 
                            : 'bg-warning/10 text-warning border-warning/30'
                          }
                        >
                          Threshold: {(unit.adaptedThreshold * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Alerts Today:</span>
                        <span className="ml-1 font-medium">{unit.alertsToday}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">TPR:</span>
                        <span className="ml-1 font-medium text-success">{(unit.truePositiveRate * 100).toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">FPR:</span>
                        <span className="ml-1 font-medium text-warning">{(unit.falsePositiveRate * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    {/* Visual threshold bar */}
                    <div className="mt-2 relative h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-primary/30"
                        style={{ width: `${unit.baselineRisk * 100}%` }}
                      />
                      <div
                        className="absolute h-full w-0.5 bg-muted-foreground"
                        style={{ left: `${unit.currentThreshold * 100}%` }}
                      />
                      <div
                        className="absolute h-full w-1 bg-primary"
                        style={{ left: `${unit.adaptedThreshold * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Threshold Learning Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={learningCurveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 1]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
                    />
                    <Line
                      type="monotone"
                      dataKey="truePositive"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--success))' }}
                      name="True Positive Rate"
                    />
                    <Line
                      type="monotone"
                      dataKey="falsePositive"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--destructive))' }}
                      name="False Positive Rate"
                    />
                    <Line
                      type="monotone"
                      dataKey="threshold"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'hsl(var(--primary))' }}
                      name="Adapted Threshold"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div className="p-2 bg-secondary/30 rounded">
                  <strong>Learning Algorithm:</strong> Bayesian optimization with Thompson sampling
                </div>
                <div className="p-2 bg-secondary/30 rounded">
                  <strong>Update Frequency:</strong> Weekly with 24hr minimum observation window
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Manual Override Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Global Threshold Override</span>
                  <span className="font-mono">{manualThreshold[0]}%</span>
                </div>
                <Slider
                  value={manualThreshold}
                  onValueChange={setManualThreshold}
                  max={100}
                  min={50}
                  step={1}
                  disabled={adaptiveEnabled}
                />
                <p className="text-xs text-muted-foreground">
                  {adaptiveEnabled 
                    ? 'Disable adaptive mode to manually set threshold'
                    : 'Manual threshold applies globally across all units'
                  }
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/30">
                <p className="text-xs text-warning">
                  <strong>Warning:</strong> Manual overrides disable machine learning optimization 
                  and may increase alert fatigue or missed events.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
