import { useState, useEffect } from 'react';
import { Activity, Clock, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const scenarios = [
  { id: 'sepsis', label: 'Sepsis Trajectory', desc: 'Early sepsis detection through documentation acceleration patterns' },
  { id: 'respiratory', label: 'Respiratory Failure', desc: 'Ventilator-associated deterioration from charting irregularity' },
  { id: 'cardiac', label: 'Cardiac Event', desc: 'Post-surgical cardiac complication from rhythm disruption' },
];

const scenarioData: Record<string, { features: { name: string; value: string; weight: number; direction: 'up' | 'down' | 'stable' }[]; timeline: { hour: number; event: string; risk: number }[] }> = {
  sepsis: {
    features: [
      { name: 'Documentation Acceleration', value: '4.2x baseline', weight: 0.34, direction: 'up' },
      { name: 'Note Entropy', value: '0.87 (high)', weight: 0.22, direction: 'up' },
      { name: 'Inter-Note Interval CV', value: '2.1', weight: 0.18, direction: 'up' },
      { name: 'Night-Shift Doc Ratio', value: '0.72', weight: 0.14, direction: 'up' },
      { name: 'Order Frequency', value: '3.8/hr', weight: 0.12, direction: 'up' },
    ],
    timeline: [
      { hour: 0, event: 'Admission — Baseline documentation', risk: 12 },
      { hour: 4, event: 'Slight increase in note frequency', risk: 18 },
      { hour: 8, event: 'Lab orders accelerating', risk: 28 },
      { hour: 12, event: 'TRACI alert: Pattern shift detected', risk: 45 },
      { hour: 16, event: 'Documentation burst — 6 notes/hr', risk: 67 },
      { hour: 20, event: 'Sepsis protocol initiated', risk: 78 },
      { hour: 24, event: 'Intervention documented, stabilizing', risk: 62 },
    ],
  },
  respiratory: {
    features: [
      { name: 'Ventilator Note Gaps', value: '3 missed intervals', weight: 0.31, direction: 'down' },
      { name: 'RT Assessment Delay', value: '+45 min avg', weight: 0.25, direction: 'up' },
      { name: 'ABG Documentation Surge', value: '2.8x', weight: 0.20, direction: 'up' },
      { name: 'Night Doc Irregularity', value: '0.76', weight: 0.14, direction: 'up' },
      { name: 'Provider Note Overlap', value: '3 concurrent', weight: 0.10, direction: 'up' },
    ],
    timeline: [
      { hour: 0, event: 'Post-intubation — steady charting', risk: 15 },
      { hour: 6, event: 'Missed vent check documentation', risk: 22 },
      { hour: 12, event: 'ABG orders increasing', risk: 38 },
      { hour: 18, event: 'TRACI alert: Respiratory pattern anomaly', risk: 55 },
      { hour: 24, event: 'Multiple providers documenting', risk: 71 },
      { hour: 30, event: 'Extubation failure documented', risk: 82 },
      { hour: 36, event: 'Re-intubation, pattern normalizing', risk: 68 },
    ],
  },
  cardiac: {
    features: [
      { name: 'Telemetry Note Frequency', value: '5.1x baseline', weight: 0.29, direction: 'up' },
      { name: 'Code Team Paging Lag', value: '12 min', weight: 0.26, direction: 'up' },
      { name: 'Medication Admin Cluster', value: '4 in 30 min', weight: 0.21, direction: 'up' },
      { name: 'Handoff Note Urgency', value: 'Critical flag', weight: 0.15, direction: 'up' },
      { name: 'PRN Administration Rate', value: '3.2x', weight: 0.09, direction: 'up' },
    ],
    timeline: [
      { hour: 0, event: 'Post-op Day 1 — routine charting', risk: 8 },
      { hour: 3, event: 'Normal telemetry documentation', risk: 10 },
      { hour: 6, event: 'Slight rhythm irregularity noted', risk: 22 },
      { hour: 9, event: 'TRACI alert: Cardiac pattern shift', risk: 48 },
      { hour: 10, event: 'Rapid response team activation', risk: 85 },
      { hour: 11, event: 'Intervention documented', risk: 72 },
      { hour: 14, event: 'Transfer to CCU, stabilizing', risk: 55 },
    ],
  },
};

export const TRACIScenarios = () => {
  const [activeScenario, setActiveScenario] = useState('sepsis');
  const [playingStep, setPlayingStep] = useState<number | null>(null);
  const [visibleSteps, setVisibleSteps] = useState(0);

  const data = scenarioData[activeScenario];

  const playScenario = () => {
    setVisibleSteps(0);
    setPlayingStep(0);
  };

  useEffect(() => {
    if (playingStep === null) return;
    if (playingStep >= data.timeline.length) {
      setPlayingStep(null);
      return;
    }
    const timer = setTimeout(() => {
      setVisibleSteps(playingStep + 1);
      setPlayingStep(playingStep + 1);
    }, 800);
    return () => clearTimeout(timer);
  }, [playingStep, data.timeline.length]);

  return (
    <div className="space-y-6">
      <Card className="border-chart-1/30 bg-gradient-to-br from-chart-1/[0.04] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-chart-1/10 border border-chart-1/20">
                <Activity className="w-5 h-5 text-chart-1" />
              </div>
              <div>
                <CardTitle className="text-lg">TRACI Clinical Scenarios</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Step through real-world deterioration patterns detected by temporal analysis</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">Patent #6</Badge>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">MOCK DATA</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Scenario Selector */}
      <div className="flex gap-2 flex-wrap">
        {scenarios.map(s => (
          <Button
            key={s.id}
            variant={activeScenario === s.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setActiveScenario(s.id); setVisibleSteps(0); setPlayingStep(null); }}
          >
            {s.label}
          </Button>
        ))}
        <Button variant="secondary" size="sm" onClick={playScenario} className="ml-auto gap-1.5">
          <Zap className="h-3.5 w-3.5" /> Play Scenario
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">{scenarios.find(s => s.id === activeScenario)?.desc}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Weights */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-chart-1" />
              Temporal Feature Weights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.features.map(f => (
              <div key={f.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{f.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{f.value}</span>
                    <Badge variant="outline" className="text-[9px] w-12 justify-center">{(f.weight * 100).toFixed(0)}%</Badge>
                  </div>
                </div>
                <Progress value={f.weight * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Timeline Walkthrough */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-chart-1" />
              Deterioration Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.timeline.map((step, i) => {
                const isVisible = visibleSteps === 0 || i < visibleSteps;
                if (!isVisible) return null;
                const riskColor = step.risk > 70 ? 'text-destructive' : step.risk > 40 ? 'text-warning' : 'text-risk-low';
                return (
                  <div key={i} className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-all',
                    i === visibleSteps - 1 && playingStep !== null ? 'border-chart-1/40 bg-chart-1/5 shadow-sm' : 'border-border/20'
                  )}>
                    <div className="flex flex-col items-center shrink-0">
                      <span className="text-[10px] font-mono text-muted-foreground">{step.hour}h</span>
                      <div className={cn('w-2 h-2 rounded-full mt-1', step.risk > 70 ? 'bg-destructive' : step.risk > 40 ? 'bg-warning' : 'bg-risk-low')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{step.event}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={cn('text-lg font-bold', riskColor)}>{step.risk}%</span>
                      <p className="text-[9px] text-muted-foreground">risk</p>
                    </div>
                  </div>
                );
              })}
              {visibleSteps === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Click "Play Scenario" to step through the deterioration timeline
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
