import { useState } from 'react';
import { 
  Activity, Target, TrendingUp, CheckCircle, AlertTriangle,
  BarChart3, PieChart, Layers, Award, FileText, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar
} from 'recharts';

// ROC Curve data points
const rocCurveData = [
  { fpr: 0, tpr: 0 },
  { fpr: 0.05, tpr: 0.42 },
  { fpr: 0.1, tpr: 0.58 },
  { fpr: 0.15, tpr: 0.68 },
  { fpr: 0.2, tpr: 0.75 },
  { fpr: 0.25, tpr: 0.80 },
  { fpr: 0.3, tpr: 0.84 },
  { fpr: 0.4, tpr: 0.88 },
  { fpr: 0.5, tpr: 0.91 },
  { fpr: 0.6, tpr: 0.94 },
  { fpr: 0.7, tpr: 0.96 },
  { fpr: 0.8, tpr: 0.97 },
  { fpr: 0.9, tpr: 0.98 },
  { fpr: 1, tpr: 1 },
];

// Calibration curve data
const calibrationData = [
  { predicted: 0.1, observed: 0.08 },
  { predicted: 0.2, observed: 0.18 },
  { predicted: 0.3, observed: 0.32 },
  { predicted: 0.4, observed: 0.38 },
  { predicted: 0.5, observed: 0.52 },
  { predicted: 0.6, observed: 0.58 },
  { predicted: 0.7, observed: 0.72 },
  { predicted: 0.8, observed: 0.78 },
  { predicted: 0.9, observed: 0.88 },
];

// Temporal stability data
const temporalStabilityData = [
  { week: 'W1', auc: 0.842, sensitivity: 0.81, specificity: 0.85 },
  { week: 'W2', auc: 0.848, sensitivity: 0.82, specificity: 0.84 },
  { week: 'W3', auc: 0.845, sensitivity: 0.80, specificity: 0.86 },
  { week: 'W4', auc: 0.851, sensitivity: 0.83, specificity: 0.85 },
  { week: 'W5', auc: 0.847, sensitivity: 0.82, specificity: 0.85 },
  { week: 'W6', auc: 0.849, sensitivity: 0.81, specificity: 0.86 },
  { week: 'W7', auc: 0.846, sensitivity: 0.82, specificity: 0.85 },
  { week: 'W8', auc: 0.850, sensitivity: 0.83, specificity: 0.84 },
];

// Confusion matrix values
const confusionMatrix = {
  truePositive: 164,
  falsePositive: 29,
  trueNegative: 193,
  falseNegative: 36,
};

interface MetricCardProps {
  label: string;
  value: string;
  ci?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
}

const MetricCard = ({ label, value, ci, icon, trend, description }: MetricCardProps) => (
  <Card className="overflow-hidden">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        {trend && (
          <Badge variant="outline" className={cn(
            "text-[10px]",
            trend === 'up' ? 'text-risk-low border-risk-low/30' :
            trend === 'down' ? 'text-risk-high border-risk-high/30' :
            'text-muted-foreground'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} Stable
          </Badge>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {ci && <div className="text-xs text-muted-foreground">95% CI: {ci}</div>}
        <div className="text-sm font-medium text-muted-foreground mt-1">{label}</div>
        {description && <div className="text-[10px] text-muted-foreground mt-1">{description}</div>}
      </div>
    </CardContent>
  </Card>
);

export const ValidationMetricsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const total = confusionMatrix.truePositive + confusionMatrix.falsePositive + 
                confusionMatrix.trueNegative + confusionMatrix.falseNegative;
  const accuracy = ((confusionMatrix.truePositive + confusionMatrix.trueNegative) / total * 100).toFixed(1);
  const precision = (confusionMatrix.truePositive / (confusionMatrix.truePositive + confusionMatrix.falsePositive) * 100).toFixed(1);
  const recall = (confusionMatrix.truePositive / (confusionMatrix.truePositive + confusionMatrix.falseNegative) * 100).toFixed(1);
  const f1Score = (2 * (parseFloat(precision) * parseFloat(recall)) / (parseFloat(precision) + parseFloat(recall))).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Validation Metrics Dashboard</h2>
          <p className="text-sm text-muted-foreground">Design Target Metrics (No Testing Conducted)</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Illustrative Only
          </Badge>
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Award className="w-3 h-3 mr-1" />
            Patent-Pending
          </Badge>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-600 dark:text-amber-400">
            <strong>Important:</strong> All metrics shown are design targets based on published literature benchmarks. 
            No model training, testing, or validation has been conducted. 
            These values represent performance goals, not actual results.
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="AUROC"
          value="0.89"
          ci="0.86-0.92"
          icon={<Target className="w-5 h-5 text-primary" />}
          trend="stable"
          description="Area Under ROC Curve"
        />
        <MetricCard
          label="Sensitivity"
          value="87.0%"
          ci="83.2-90.8"
          icon={<Activity className="w-5 h-5 text-primary" />}
          trend="up"
          description="True Positive Rate"
        />
        <MetricCard
          label="Specificity"
          value="86.0%"
          ci="82.1-89.9"
          icon={<CheckCircle className="w-5 h-5 text-primary" />}
          trend="stable"
          description="True Negative Rate"
        />
        <MetricCard
          label="PPV"
          value="85.0%"
          ci="80.8-89.2"
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          trend="up"
          description="Positive Predictive Value"
        />
      </div>

      {/* Tabs for detailed views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">ROC Curve</TabsTrigger>
          <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
          <TabsTrigger value="temporal">Temporal Stability</TabsTrigger>
        </TabsList>

        {/* ROC Curve */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Receiver Operating Characteristic (ROC) Curve</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Design target AUROC = 0.89 (no testing conducted)</p>
                </div>
                <Badge variant="outline" className="text-amber-500 border-amber-500/30">Design Target</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rocCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="fpr" 
                      label={{ value: 'False Positive Rate', position: 'bottom', offset: -5 }}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <YAxis 
                      label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <ReferenceLine 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeDasharray="5 5"
                      segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tpr" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                <strong>Note:</strong> This is a design target visualization. AUROC of 0.89 represents our performance goal based on published literature. No actual model has been trained or tested.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Confusion Matrix */}
        <TabsContent value="confusion">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Confusion Matrix</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Classification results at optimal threshold (0.42)</p>
                </div>
                <Badge variant="outline">Threshold: 0.42</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Matrix Visualization */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-1">
                      <div className="text-[10px] text-muted-foreground">Predicted Positive</div>
                    </div>
                    <div className="text-center p-1">
                      <div className="text-[10px] text-muted-foreground">Predicted Negative</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {/* True Positive */}
                    <div className="p-4 rounded-lg bg-risk-low/20 border border-risk-low/30 text-center">
                      <div className="text-2xl font-bold text-risk-low">{confusionMatrix.truePositive}</div>
                      <div className="text-xs text-risk-low">True Positive</div>
                    </div>
                    {/* False Negative */}
                    <div className="p-4 rounded-lg bg-risk-high/20 border border-risk-high/30 text-center">
                      <div className="text-2xl font-bold text-risk-high">{confusionMatrix.falseNegative}</div>
                      <div className="text-xs text-risk-high">False Negative</div>
                    </div>
                    {/* False Positive */}
                    <div className="p-4 rounded-lg bg-amber-500/20 border border-amber-500/30 text-center">
                      <div className="text-2xl font-bold text-amber-500">{confusionMatrix.falsePositive}</div>
                      <div className="text-xs text-amber-500">False Positive</div>
                    </div>
                    {/* True Negative */}
                    <div className="p-4 rounded-lg bg-risk-low/20 border border-risk-low/30 text-center">
                      <div className="text-2xl font-bold text-risk-low">{confusionMatrix.trueNegative}</div>
                      <div className="text-xs text-risk-low">True Negative</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-muted-foreground px-2">
                    <span>Actual Positive →</span>
                    <span>← Actual Negative</span>
                  </div>
                </div>

                {/* Derived Metrics */}
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Accuracy</span>
                      <span className="text-lg font-bold text-foreground">{accuracy}%</span>
                    </div>
                    <Progress value={parseFloat(accuracy)} className="h-2" />
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Precision</span>
                      <span className="text-lg font-bold text-foreground">{precision}%</span>
                    </div>
                    <Progress value={parseFloat(precision)} className="h-2" />
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Recall</span>
                      <span className="text-lg font-bold text-foreground">{recall}%</span>
                    </div>
                    <Progress value={parseFloat(recall)} className="h-2" />
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-primary">F1 Score</span>
                      <span className="text-lg font-bold text-primary">{f1Score}%</span>
                    </div>
                    <Progress value={parseFloat(f1Score)} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calibration Curve */}
        <TabsContent value="calibration">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Calibration Curve</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Predicted vs Observed Probabilities</p>
                </div>
                <Badge variant="outline" className="text-risk-low border-risk-low/30">
                  Well Calibrated
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={calibrationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="predicted" 
                      label={{ value: 'Mean Predicted Probability', position: 'bottom', offset: -5 }}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <YAxis 
                      label={{ value: 'Fraction of Positives', angle: -90, position: 'insideLeft' }}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <ReferenceLine 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeDasharray="5 5"
                      segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="observed" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                <strong>Interpretation:</strong> The calibration curve closely follows the diagonal reference line, indicating that predicted probabilities accurately reflect observed event rates.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Temporal Stability */}
        <TabsContent value="temporal">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Temporal Stability Analysis</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Model performance over 8-week validation period</p>
                </div>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  Patent Claim #2
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temporalStabilityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="week" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <YAxis 
                      domain={[0.7, 1]}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="auc" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                      name="AUC-ROC"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sensitivity" 
                      stroke="hsl(var(--risk-low))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--risk-low))', r: 3 }}
                      name="Sensitivity"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="specificity" 
                      stroke="hsl(var(--risk-medium))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--risk-medium))', r: 3 }}
                      name="Specificity"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
                  <div className="text-lg font-bold text-primary">±0.004</div>
                  <div className="text-[10px] text-muted-foreground">AUC Variance</div>
                </div>
                <div className="p-3 rounded-lg bg-risk-low/10 border border-risk-low/30 text-center">
                  <div className="text-lg font-bold text-risk-low">±1.2%</div>
                  <div className="text-[10px] text-muted-foreground">Sensitivity Variance</div>
                </div>
                <div className="p-3 rounded-lg bg-risk-medium/10 border border-risk-medium/30 text-center">
                  <div className="text-lg font-bold text-risk-medium">±0.8%</div>
                  <div className="text-[10px] text-muted-foreground">Specificity Variance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Study Information */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <CardTitle className="text-sm text-amber-500">Planned Validation Study Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground text-xs">Planned Design</div>
              <div className="font-medium">Prospective Cohort</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Target Sample Size</div>
              <div className="font-medium">n ≈ 3,000 patients</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">IRB Status</div>
              <div className="font-medium">Submission planned</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Target Timeline</div>
              <div className="font-medium">2025-2026</div>
            </div>
          </div>
          <p className="text-xs text-amber-500 mt-3">
            Note: All data shown above is synthetic/illustrative. No actual validation study has been completed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
