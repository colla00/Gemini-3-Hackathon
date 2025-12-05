import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Users, AlertTriangle, Clock, Target, UserCheck, Scale, ArrowRight, CheckCircle } from 'lucide-react';
import { patients } from '@/data/patients';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StaffingData {
  unit: string;
  nurses: number;
  patients: number;
  ratio: number;
  capacity: number;
  highRiskCount: number;
}

const staffingData: StaffingData[] = [
  { unit: 'ICU-A', nurses: 4, patients: 8, ratio: 2.0, capacity: 75, highRiskCount: 5 },
  { unit: 'Med-Surg 3E', nurses: 3, patients: 18, ratio: 6.0, capacity: 95, highRiskCount: 4 },
  { unit: 'Oncology', nurses: 4, patients: 16, ratio: 4.0, capacity: 85, highRiskCount: 6 },
  { unit: 'Cardiac', nurses: 3, patients: 12, ratio: 4.0, capacity: 80, highRiskCount: 3 },
];

interface PrioritizedPatient {
  id: string;
  name: string;
  riskScore: number;
  unit: string;
  assignedNurse: string;
  priorityScore: number;
  urgency: 'critical' | 'high' | 'moderate' | 'low';
  estimatedTime: number; // minutes for intervention
}

export const WorkloadPrioritization = () => {
  const [staffingAdjustment, setStaffingAdjustment] = useState([100]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const prioritizedPatients = useMemo((): PrioritizedPatient[] => {
    return patients
      .map((p, index) => {
        const unitData = staffingData.find(s => s.unit === p.unit) || staffingData[0];
        const workloadFactor = unitData.ratio / 4; // Normalize to ideal ratio
        const priorityScore = p.riskScore * (1 + workloadFactor * 0.3);
        
        return {
          id: p.id,
          name: `Patient ${p.id}`,
          riskScore: p.riskScore,
          unit: p.unit,
          assignedNurse: `RN ${(index % 4) + 1}`,
          priorityScore: Math.min(0.99, priorityScore),
          urgency: priorityScore > 0.85 ? 'critical' : priorityScore > 0.7 ? 'high' : priorityScore > 0.5 ? 'moderate' : 'low',
          estimatedTime: Math.round(15 + p.riskScore * 30),
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }, []);

  const workloadDistribution = useMemo(() => {
    return staffingData.map(unit => ({
      unit: unit.unit,
      workload: Math.round((unit.highRiskCount / unit.nurses) * 100),
      patients: unit.patients,
      nurses: unit.nurses,
    }));
  }, []);

  const totalHighRisk = staffingData.reduce((sum, u) => sum + u.highRiskCount, 0);
  const avgRatio = staffingData.reduce((sum, u) => sum + u.ratio, 0) / staffingData.length;
  const overCapacityUnits = staffingData.filter(u => u.capacity > 90).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Workload-Aware Prioritization
          </h2>
          <p className="text-sm text-muted-foreground">
            Risk prioritization factoring nurse staffing ratios and unit capacity
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          Patent Claim #7
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-destructive mx-auto mb-2" />
            <div className="text-2xl font-bold text-destructive">{totalHighRisk}</div>
            <div className="text-xs text-muted-foreground">High-Risk Patients</div>
          </CardContent>
        </Card>
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-warning">{avgRatio.toFixed(1)}:1</div>
            <div className="text-xs text-muted-foreground">Avg Nurse:Patient</div>
          </CardContent>
        </Card>
        <Card className={`border ${overCapacityUnits > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-success/10 border-success/30'}`}>
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{overCapacityUnits}</div>
            <div className="text-xs text-muted-foreground">Units Over Capacity</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">23min</div>
            <div className="text-xs text-muted-foreground">Avg Response Time</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Unit Workload Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Unit Workload Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staffingData.map((unit) => (
                <div
                  key={unit.unit}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedUnit === unit.unit
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-secondary/30 border-border hover:bg-secondary/50'
                  }`}
                  onClick={() => setSelectedUnit(selectedUnit === unit.unit ? null : unit.unit)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{unit.unit}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {unit.nurses} RNs
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          unit.capacity > 90
                            ? 'bg-destructive/10 text-destructive border-destructive/30'
                            : unit.capacity > 80
                            ? 'bg-warning/10 text-warning border-warning/30'
                            : 'bg-success/10 text-success border-success/30'
                        }
                      >
                        {unit.capacity}% capacity
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs mb-2">
                    <div>
                      <span className="text-muted-foreground">Patients:</span>
                      <span className="ml-1 font-medium">{unit.patients}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ratio:</span>
                      <span className={`ml-1 font-medium ${unit.ratio > 5 ? 'text-destructive' : 'text-foreground'}`}>
                        {unit.ratio.toFixed(1)}:1
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">High Risk:</span>
                      <span className="ml-1 font-medium text-destructive">{unit.highRiskCount}</span>
                    </div>
                  </div>
                  <Progress value={unit.capacity} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workload Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">High-Risk Patients per Nurse by Unit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="unit" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="workload" name="Workload Index">
                    {workloadDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.workload > 150 ? 'hsl(var(--destructive))' : entry.workload > 100 ? 'hsl(var(--warning))' : 'hsl(var(--success))'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Workload Index = (High-risk patients / Nurses) × 100. Target: &lt;100
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prioritized Patient Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="w-4 h-4" />
            Workload-Adjusted Priority Queue
            <Badge variant="outline" className="text-xs ml-2">
              Top 8 patients
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {prioritizedPatients.slice(0, 8).map((patient, index) => (
              <div
                key={patient.id}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  patient.urgency === 'critical'
                    ? 'bg-destructive/5 border-destructive/30'
                    : patient.urgency === 'high'
                    ? 'bg-warning/5 border-warning/30'
                    : 'bg-secondary/30 border-border'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{patient.id}</span>
                      <Badge variant="outline" className="text-xs">{patient.unit}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Assigned: {patient.assignedNurse} • Est. time: {patient.estimatedTime}min
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <div className="text-muted-foreground">Base Risk</div>
                    <div className="font-mono">{(patient.riskScore * 100).toFixed(0)}%</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="text-right text-xs">
                    <div className="text-muted-foreground">Adjusted Priority</div>
                    <div className={`font-mono font-bold ${
                      patient.urgency === 'critical' ? 'text-destructive' :
                      patient.urgency === 'high' ? 'text-warning' : 'text-foreground'
                    }`}>
                      {(patient.priorityScore * 100).toFixed(0)}%
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      patient.urgency === 'critical'
                        ? 'bg-destructive/10 text-destructive border-destructive/30'
                        : patient.urgency === 'high'
                        ? 'bg-warning/10 text-warning border-warning/30'
                        : patient.urgency === 'moderate'
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : 'bg-muted/50 text-muted-foreground'
                    }
                  >
                    {patient.urgency}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
            <p className="text-sm text-muted-foreground">
              <strong>Innovation:</strong> Priority scores incorporate real-time staffing constraints, ensuring 
              high-risk patients in understaffed units receive proportionally higher urgency—addressing a gap 
              in existing risk stratification systems.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Staffing Simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Staffing Impact Simulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-32">Staffing Level:</span>
            <Slider
              value={staffingAdjustment}
              onValueChange={setStaffingAdjustment}
              max={150}
              min={50}
              step={10}
              className="flex-1"
            />
            <span className="font-mono text-sm w-16">{staffingAdjustment[0]}%</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-lg font-bold">
                {Math.round(avgRatio * (100 / staffingAdjustment[0]) * 10) / 10}:1
              </div>
              <div className="text-xs text-muted-foreground">Projected Ratio</div>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-lg font-bold">
                {Math.round(23 * (100 / staffingAdjustment[0]))}min
              </div>
              <div className="text-xs text-muted-foreground">Projected Response</div>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className={`text-lg font-bold ${staffingAdjustment[0] >= 100 ? 'text-success' : 'text-warning'}`}>
                {staffingAdjustment[0] >= 100 ? 'Adequate' : 'At Risk'}
              </div>
              <div className="text-xs text-muted-foreground">Capacity Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
