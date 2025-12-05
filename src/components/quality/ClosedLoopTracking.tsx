import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCcw, TrendingUp, CheckCircle, XCircle, Clock, ArrowRight, Activity, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';

interface InterventionOutcome {
  id: string;
  intervention: string;
  patient: string;
  riskBefore: number;
  riskAfter: number;
  timeToEffect: string;
  outcome: 'prevented' | 'occurred' | 'pending';
  feedback: 'positive' | 'negative' | 'neutral';
}

const outcomes: InterventionOutcome[] = [
  { id: '1', intervention: 'Bed alarm activated', patient: 'P-2847', riskBefore: 0.82, riskAfter: 0.45, timeToEffect: '2.3h', outcome: 'prevented', feedback: 'positive' },
  { id: '2', intervention: 'Hourly rounding', patient: 'P-1923', riskBefore: 0.76, riskAfter: 0.52, timeToEffect: '4.1h', outcome: 'prevented', feedback: 'positive' },
  { id: '3', intervention: 'PT consultation', patient: 'P-3102', riskBefore: 0.68, riskAfter: 0.71, timeToEffect: '6.2h', outcome: 'occurred', feedback: 'negative' },
  { id: '4', intervention: 'Medication review', patient: 'P-2456', riskBefore: 0.79, riskAfter: 0.38, timeToEffect: '1.8h', outcome: 'prevented', feedback: 'positive' },
  { id: '5', intervention: 'Repositioning q2h', patient: 'P-1847', riskBefore: 0.71, riskAfter: 0.44, timeToEffect: '3.5h', outcome: 'pending', feedback: 'neutral' },
];

const modelImprovementData = [
  { week: 'W1', auc: 0.84, precision: 0.78, recall: 0.82, f1: 0.80 },
  { week: 'W2', auc: 0.85, precision: 0.79, recall: 0.83, f1: 0.81 },
  { week: 'W3', auc: 0.86, precision: 0.81, recall: 0.84, f1: 0.82 },
  { week: 'W4', auc: 0.87, precision: 0.82, recall: 0.85, f1: 0.83 },
  { week: 'W5', auc: 0.88, precision: 0.84, recall: 0.86, f1: 0.85 },
  { week: 'W6', auc: 0.89, precision: 0.85, recall: 0.87, f1: 0.86 },
];

const interventionEffectiveness = [
  { intervention: 'Bed Alarm', effectiveness: 78, count: 124 },
  { intervention: 'Hourly Rounding', effectiveness: 65, count: 89 },
  { intervention: 'PT Consult', effectiveness: 52, count: 67 },
  { intervention: 'Med Review', effectiveness: 71, count: 45 },
  { intervention: 'Reposition', effectiveness: 68, count: 156 },
];

const feedbackLoopData = [
  { riskReduction: 45, timeToEffect: 2, interventions: 15, name: 'Bed Alarm' },
  { riskReduction: 32, timeToEffect: 4, interventions: 12, name: 'Hourly Rounding' },
  { riskReduction: 18, timeToEffect: 6, interventions: 8, name: 'PT Consult' },
  { riskReduction: 52, timeToEffect: 2, interventions: 6, name: 'Med Review' },
  { riskReduction: 38, timeToEffect: 3, interventions: 20, name: 'Reposition' },
];

export const ClosedLoopTracking = () => {
  const [selectedOutcome, setSelectedOutcome] = useState<InterventionOutcome | null>(null);

  const preventedCount = outcomes.filter(o => o.outcome === 'prevented').length;
  const totalOutcomes = outcomes.length;
  const preventionRate = Math.round((preventedCount / totalOutcomes) * 100);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-primary" />
            Closed-Loop Intervention Tracking
          </h2>
          <p className="text-sm text-muted-foreground">
            Track outcomes post-intervention for continuous model improvement
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          Patent Claim #4
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-success/10 border-success/30">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-success">{preventionRate}%</div>
            <div className="text-xs text-muted-foreground">Prevention Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">+5.9%</div>
            <div className="text-xs text-muted-foreground">AUC Improvement</div>
          </CardContent>
        </Card>
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-warning">3.2h</div>
            <div className="text-xs text-muted-foreground">Avg Time to Effect</div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50 border-border">
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold">481</div>
            <div className="text-xs text-muted-foreground">Total Tracked</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="outcomes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="outcomes">Recent Outcomes</TabsTrigger>
          <TabsTrigger value="improvement">Model Improvement</TabsTrigger>
          <TabsTrigger value="effectiveness">Intervention Analysis</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Loop</TabsTrigger>
        </TabsList>

        <TabsContent value="outcomes">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tracked Intervention Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {outcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedOutcome?.id === outcome.id
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-secondary/30 border-border hover:bg-secondary/50'
                    }`}
                    onClick={() => setSelectedOutcome(outcome)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {outcome.outcome === 'prevented' && <CheckCircle className="w-4 h-4 text-success" />}
                        {outcome.outcome === 'occurred' && <XCircle className="w-4 h-4 text-destructive" />}
                        {outcome.outcome === 'pending' && <Clock className="w-4 h-4 text-warning" />}
                        <div>
                          <span className="font-medium text-sm">{outcome.intervention}</span>
                          <span className="text-xs text-muted-foreground ml-2">({outcome.patient})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-destructive font-mono">{(outcome.riskBefore * 100).toFixed(0)}%</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <span className={outcome.riskAfter < outcome.riskBefore ? 'text-success font-mono' : 'text-destructive font-mono'}>
                            {(outcome.riskAfter * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            outcome.outcome === 'prevented'
                              ? 'bg-success/10 text-success border-success/30'
                              : outcome.outcome === 'occurred'
                              ? 'bg-destructive/10 text-destructive border-destructive/30'
                              : 'bg-warning/10 text-warning border-warning/30'
                          }
                        >
                          {outcome.outcome}
                        </Badge>
                      </div>
                    </div>
                    {selectedOutcome?.id === outcome.id && (
                      <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Time to Effect:</span>
                          <span className="ml-1 font-medium">{outcome.timeToEffect}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Risk Reduction:</span>
                          <span className="ml-1 font-medium text-success">
                            {Math.max(0, Math.round((outcome.riskBefore - outcome.riskAfter) * 100))}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Feedback:</span>
                          <span className={`ml-1 font-medium ${
                            outcome.feedback === 'positive' ? 'text-success' :
                            outcome.feedback === 'negative' ? 'text-destructive' : 'text-muted-foreground'
                          }`}>
                            {outcome.feedback}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvement">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                Model Performance Over Time (Feedback-Driven)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={modelImprovementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0.7, 1]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                    />
                    <Line type="monotone" dataKey="auc" stroke="hsl(var(--primary))" strokeWidth={2} name="AUC-ROC" />
                    <Line type="monotone" dataKey="precision" stroke="hsl(var(--success))" strokeWidth={2} name="Precision" />
                    <Line type="monotone" dataKey="recall" stroke="hsl(var(--warning))" strokeWidth={2} name="Recall" />
                    <Line type="monotone" dataKey="f1" stroke="hsl(var(--chart-4))" strokeWidth={2} name="F1 Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/30">
                <p className="text-sm text-success">
                  <strong>Innovation:</strong> Continuous learning from intervention outcomes enables model 
                  self-improvement without manual retraining—a key differentiator from static ML systems.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effectiveness">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Intervention Effectiveness by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interventionEffectiveness} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <YAxis dataKey="intervention" type="category" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => [
                        name === 'effectiveness' ? `${value}%` : value,
                        name === 'effectiveness' ? 'Effectiveness' : 'Count'
                      ]}
                    />
                    <Bar dataKey="effectiveness" name="Effectiveness">
                      {interventionEffectiveness.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.effectiveness >= 70 ? 'hsl(var(--success))' : entry.effectiveness >= 50 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div className="p-2 bg-secondary/30 rounded">
                  <strong>Highest Impact:</strong> Medication Review (71% effectiveness)
                </div>
                <div className="p-2 bg-secondary/30 rounded">
                  <strong>Most Used:</strong> Repositioning q2h (156 interventions)
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Risk Reduction vs Time to Effect (Bubble = Volume)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="timeToEffect" name="Time to Effect (h)" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="riskReduction" name="Risk Reduction (%)" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <ZAxis dataKey="interventions" range={[50, 400]} name="Count" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => [value, name]}
                    />
                    <Scatter data={feedbackLoopData} fill="hsl(var(--primary))" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
                <p className="text-xs text-muted-foreground">
                  <strong>Optimal Zone:</strong> High risk reduction (&gt;40%) with fast time to effect (&lt;3h). 
                  Medication reviews and bed alarms show best efficiency profile.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
