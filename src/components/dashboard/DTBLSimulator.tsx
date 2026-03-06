import { useState, useEffect, useCallback } from 'react';
import { Layers, Activity, Play, Pause, RotateCcw, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const vitalKeys = ['HR', 'SBP', 'DBP', 'RR', 'Temp', 'SpO2'] as const;
type VitalKey = typeof vitalKeys[number];

const baselineVitals: Record<VitalKey, { value: number; unit: string; min: number; max: number }> = {
  HR: { value: 78, unit: 'bpm', min: 50, max: 140 },
  SBP: { value: 128, unit: 'mmHg', min: 80, max: 200 },
  DBP: { value: 82, unit: 'mmHg', min: 50, max: 120 },
  RR: { value: 16, unit: '/min', min: 8, max: 40 },
  Temp: { value: 98.4, unit: '°F', min: 95, max: 104 },
  SpO2: { value: 96, unit: '%', min: 80, max: 100 },
};

const deteriorationCurve = (hour: number, vital: VitalKey): number => {
  const base = baselineVitals[vital].value;
  switch (vital) {
    case 'HR': return base + Math.sin(hour / 3) * 4 + (hour > 12 ? (hour - 12) * 1.8 : 0);
    case 'SBP': return base - (hour > 14 ? (hour - 14) * 3 : 0) + Math.sin(hour / 5) * 3;
    case 'DBP': return base - (hour > 14 ? (hour - 14) * 1.5 : 0);
    case 'RR': return base + (hour > 10 ? (hour - 10) * 0.6 : 0) + Math.random() * 2;
    case 'Temp': return base + (hour > 8 ? (hour - 8) * 0.08 : 0);
    case 'SpO2': return Math.max(85, base - (hour > 16 ? (hour - 16) * 0.8 : 0));
    default: return base;
  }
};

export const DTBLSimulator = () => {
  const [hour, setHour] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vitals, setVitals] = useState<Record<VitalKey, number>>(() => {
    const v: Record<string, number> = {};
    vitalKeys.forEach(k => v[k] = baselineVitals[k].value);
    return v as Record<VitalKey, number>;
  });

  const updateVitals = useCallback((h: number) => {
    const v: Record<string, number> = {};
    vitalKeys.forEach(k => v[k] = parseFloat(deteriorationCurve(h, k).toFixed(1)));
    setVitals(v as Record<VitalKey, number>);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setHour(prev => {
        const next = prev + 1;
        if (next > 24) { setIsPlaying(false); return 24; }
        updateVitals(next);
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, updateVitals]);

  useEffect(() => { updateVitals(hour); }, []);

  const reset = () => { setHour(0); setIsPlaying(false); updateVitals(0); };

  const getDeviationPct = (vital: VitalKey) => {
    const base = baselineVitals[vital].value;
    return Math.abs(((vitals[vital] - base) / base) * 100);
  };

  const getColor = (vital: VitalKey) => {
    const dev = getDeviationPct(vital);
    if (dev > 15) return 'text-destructive';
    if (dev > 8) return 'text-warning';
    return 'text-risk-low';
  };

  const totalDeviation = vitalKeys.reduce((acc, k) => acc + getDeviationPct(k), 0) / vitalKeys.length;

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-gradient-to-br from-primary/[0.04] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Digital Twin Simulator</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Watch a patient's vitals drift from their personalized baseline in real time</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">Patent #9</Badge>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">MOCK DATA</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Playback Controls */}
      <Card className="border-border/40">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)} className="gap-1.5">
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
            <div className="flex-1">
              <Slider
                value={[hour]}
                onValueChange={([v]) => { setHour(v); updateVitals(v); setIsPlaying(false); }}
                max={24}
                step={1}
              />
            </div>
            <Badge variant="outline" className="text-sm font-mono min-w-[60px] justify-center">
              {hour}h / 24h
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-[10px] text-muted-foreground">Overall deviation from baseline</p>
            <Badge variant="outline" className={cn(
              'text-xs',
              totalDeviation > 10 ? 'text-destructive border-destructive/30 bg-destructive/10' :
              totalDeviation > 5 ? 'text-warning border-warning/30 bg-warning/10' :
              'text-risk-low border-risk-low/30 bg-risk-low/10'
            )}>
              {totalDeviation.toFixed(1)}% deviation
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {vitalKeys.map(k => {
          const base = baselineVitals[k];
          const current = vitals[k];
          const devPct = getDeviationPct(k);
          const color = getColor(k);
          return (
            <Card key={k} className={cn(
              'border-border/40 transition-all',
              devPct > 15 && 'border-destructive/30 shadow-sm shadow-destructive/10'
            )}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{k}</p>
                  <span className="text-[10px] text-muted-foreground">{base.unit}</span>
                </div>
                <p className={cn('text-3xl font-bold transition-colors', color)}>
                  {k === 'Temp' ? current.toFixed(1) : Math.round(current)}
                </p>
                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <span className="text-muted-foreground">Baseline: {base.value}</span>
                  <span className={cn('font-semibold', color)}>
                    {devPct > 0.5 ? `${devPct.toFixed(1)}% off` : 'Normal'}
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', devPct > 15 ? 'bg-destructive' : devPct > 8 ? 'bg-warning' : 'bg-risk-low')}
                    style={{ width: `${Math.min(100, devPct * 5)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
