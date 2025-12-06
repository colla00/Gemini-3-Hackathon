import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, TrendingUp, TrendingDown, AlertTriangle, Target, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line } from 'recharts';
import { patients } from '@/data/patients';

interface ForecastPoint {
  time: string;
  predicted: number;
  lower: number;
  upper: number;
  actual?: number;
}

const generateForecast = (baseRisk: number): ForecastPoint[] => {
  const now = new Date();
  const points: ForecastPoint[] = [];
  
  // Past 4 hours (with "actual" values)
  for (let i = -4; i <= 0; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const variation = (Math.random() - 0.5) * 0.1;
    const actual = Math.min(0.95, Math.max(0.1, baseRisk + variation + (i * 0.02)));
    points.push({
      time: time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      predicted: actual,
      lower: actual,
      upper: actual,
      actual,
    });
  }
  
  // Future 12 hours (predictions with confidence bands)
  const trend = baseRisk > 0.6 ? 0.015 : baseRisk > 0.4 ? 0.005 : -0.01;
  for (let i = 1; i <= 12; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const predicted = Math.min(0.95, Math.max(0.1, baseRisk + (trend * i) + (Math.random() - 0.5) * 0.05));
    const uncertainty = 0.05 + (i * 0.01); // Uncertainty grows with time
    points.push({
      time: time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      predicted,
      lower: Math.max(0.05, predicted - uncertainty),
      upper: Math.min(0.98, predicted + uncertainty),
    });
  }
  
  return points;
};

const riskMilestones = [
  { hours: 4, label: '4h', description: 'Next assessment window' },
  { hours: 8, label: '8h', description: 'Shift change' },
  { hours: 12, label: '12h', description: 'Daily review' },
];

export const TemporalRiskForecast = () => {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [forecastData] = useState(() => generateForecast(selectedPatient.riskScore));
  const [selectedHorizon, setSelectedHorizon] = useState('12');

  const highRiskPatients = patients.filter(p => p.riskScore >= 0.7);
  
  // Calculate forecast metrics
  const currentRisk = forecastData.find(p => p.actual !== undefined && forecastData.indexOf(p) === 4)?.predicted || selectedPatient.riskScore;
  const forecast4h = forecastData[8]?.predicted || currentRisk;
  const forecast8h = forecastData[12]?.predicted || currentRisk;
  const forecast12h = forecastData[16]?.predicted || currentRisk;

  const getTrendIcon = (current: number, future: number) => {
    if (future > current + 0.05) return <TrendingUp className="w-4 h-4 text-destructive" />;
    if (future < current - 0.05) return <TrendingDown className="w-4 h-4 text-success" />;
    return <ChevronRight className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Temporal Risk Forecasting
          </h2>
          <p className="text-sm text-muted-foreground">
            Predicted risk trajectories at 4hr, 8hr, and 12hr intervals with confidence bands
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          Patent Claim #5
        </Badge>
      </div>

      {/* Patient Selector */}
      <div className="flex items-center gap-4">
        <Select value={selectedPatient.id} onValueChange={(id) => setSelectedPatient(patients.find(p => p.id === id) || patients[0])}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select patient" />
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.id} - Risk: {(patient.riskScore * 100).toFixed(0)}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedHorizon} onValueChange={setSelectedHorizon}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Forecast horizon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4 hours</SelectItem>
            <SelectItem value="8">8 hours</SelectItem>
            <SelectItem value="12">12 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Forecast Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-secondary/30 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Current</span>
              <Target className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{(currentRisk * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>
        <Card className={`border ${forecast4h > currentRisk + 0.05 ? 'bg-warning/10 border-warning/30' : 'bg-secondary/30 border-border'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">+4 hours</span>
              {getTrendIcon(currentRisk, forecast4h)}
            </div>
            <div className="text-2xl font-bold">{(forecast4h * 100).toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">CI: {((forecastData[8]?.lower || 0) * 100).toFixed(0)}-{((forecastData[8]?.upper || 0) * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>
        <Card className={`border ${forecast8h > currentRisk + 0.05 ? 'bg-warning/10 border-warning/30' : 'bg-secondary/30 border-border'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">+8 hours</span>
              {getTrendIcon(currentRisk, forecast8h)}
            </div>
            <div className="text-2xl font-bold">{(forecast8h * 100).toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">CI: {((forecastData[12]?.lower || 0) * 100).toFixed(0)}-{((forecastData[12]?.upper || 0) * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>
        <Card className={`border ${forecast12h > currentRisk + 0.1 ? 'bg-destructive/10 border-destructive/30' : forecast12h > currentRisk + 0.05 ? 'bg-warning/10 border-warning/30' : 'bg-secondary/30 border-border'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">+12 hours</span>
              {getTrendIcon(currentRisk, forecast12h)}
            </div>
            <div className="text-2xl font-bold">{(forecast12h * 100).toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">CI: {((forecastData[16]?.lower || 0) * 100).toFixed(0)}-{((forecastData[16]?.upper || 0) * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            Risk Trajectory for {selectedPatient.id}
            <Badge variant="outline" className="text-xs">
              95% Confidence Interval
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" interval={1} />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => [
                    `${(value * 100).toFixed(1)}%`,
                    name === 'upper' ? 'Upper CI' : name === 'lower' ? 'Lower CI' : name === 'actual' ? 'Actual' : 'Predicted'
                  ]}
                />
                {/* Confidence band */}
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="transparent"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="transparent"
                  fill="hsl(var(--background))"
                  fillOpacity={1}
                />
                {/* Predicted line */}
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                />
                {/* Actual values */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--foreground))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--foreground))' }}
                />
                {/* Risk thresholds */}
                <ReferenceLine y={0.7} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ value: 'High Risk', position: 'right', fontSize: 10 }} />
                <ReferenceLine y={0.4} stroke="hsl(var(--warning))" strokeDasharray="3 3" label={{ value: 'Moderate', position: 'right', fontSize: 10 }} />
                {/* Current time marker */}
                <ReferenceLine x={forecastData[4]?.time} stroke="hsl(var(--muted-foreground))" strokeWidth={2} label={{ value: 'Now', position: 'top', fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Escalating Risk Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Patients with Escalating Risk Trajectories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {highRiskPatients.slice(0, 4).map((patient) => {
              const patientForecast = generateForecast(patient.riskScore);
              const escalating = patientForecast[16]?.predicted > patient.riskScore + 0.05;
              
              return (
                <div
                  key={patient.id}
                  className={`p-3 rounded-lg border ${
                    escalating ? 'bg-destructive/5 border-destructive/30' : 'bg-secondary/30 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {escalating && <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />}
                      <div>
                        <span className="font-medium text-sm">{patient.id}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {patient.ageRange} • {patient.room || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-center">
                        <div className="text-muted-foreground">Now</div>
                        <div className="font-bold">{(patient.riskScore * 100).toFixed(0)}%</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      <div className="text-center">
                        <div className="text-muted-foreground">+12h</div>
                        <div className={`font-bold ${escalating ? 'text-destructive' : 'text-foreground'}`}>
                          {(patientForecast[16]?.predicted * 100).toFixed(0)}%
                        </div>
                      </div>
                      {escalating && (
                        <Badge variant="destructive" className="text-xs">
                          Escalating
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
            <p className="text-sm text-muted-foreground">
              <strong>Innovation:</strong> Proactive risk escalation detection enables intervention 
              <em> before </em> patients reach critical thresholds—shifting from reactive to predictive care.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
