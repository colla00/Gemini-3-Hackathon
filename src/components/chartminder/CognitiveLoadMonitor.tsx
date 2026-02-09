import { ArrowLeft, Users, Bell, FileText, Zap, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CognitiveLoadMonitorProps {
  onNavigate: (screen: string) => void;
}

const loadFactors = [
  { icon: Users, label: 'Patient Census', points: 25, detail: '8 Active Patients', color: 'text-primary' },
  { icon: Bell, label: 'Alert Volume', points: 20, detail: '12 Alerts in past hour', color: 'text-warning' },
  { icon: FileText, label: 'Documentation Burden', points: 12, detail: '3 Notes Pending', color: 'text-accent' },
  { icon: Zap, label: 'Interruption Frequency', points: 5, detail: '18 interruptions this shift', color: 'text-muted-foreground' },
];

const optimizations = [
  { title: 'Adaptive Thresholding', status: 'ACTIVE', description: 'Alert threshold raised to 85/100 due to moderate load' },
  { title: 'Intelligent Timing', status: 'ACTIVE', description: '4 non-urgent alerts queued for next low-activity period' },
  { title: 'Alert Grouping', status: 'ACTIVE', description: 'Related alerts consolidated into 2 notifications' },
];

const loadPattern = [
  { time: '8AM', load: 55 },
  { time: '9AM', load: 75 },
  { time: '10AM', load: 68 },
  { time: '11AM', load: 58 },
  { time: '12PM', load: 45 },
  { time: '1PM', load: 52 },
  { time: '2PM', load: 58 },
  { time: '2:45', load: 62, current: true },
  { time: '4PM', load: 55 },
  { time: '6PM', load: 48 },
  { time: '8PM', load: 40 },
];

export const CognitiveLoadMonitor = ({ onNavigate }: CognitiveLoadMonitorProps) => {
  const score = 62;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-5">
      {/* Back nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Badge className="bg-green-500/15 text-green-600 border-green-500/30 text-xs font-bold">● LIVE</Badge>
      </div>

      <div className="text-center">
        <h2 className="text-lg font-bold text-foreground">Cognitive Load Monitor</h2>
      </div>

      {/* Gauge */}
      <Card className="bg-card border-border/40">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
              <circle
                cx="50" cy="50" r="45" fill="none" strokeWidth="8"
                stroke="hsl(var(--warning))"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-foreground">{score}</p>
              <p className="text-[10px] text-muted-foreground">/100</p>
            </div>
          </div>
          <Badge className="mt-3 bg-warning/15 text-warning border-warning/30 text-xs font-bold">Moderate Load</Badge>
          <p className="text-xs text-muted-foreground mt-1">Optimal alert timing active</p>
        </CardContent>
      </Card>

      {/* Load Breakdown */}
      <div className="space-y-2">
        {loadFactors.map((factor) => (
          <Card key={factor.label} className="bg-card border-border/40">
            <CardContent className="p-3 flex items-center gap-3">
              <factor.icon className={`h-5 w-5 ${factor.color}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{factor.label}</p>
                <p className="text-xs text-muted-foreground">{factor.detail}</p>
              </div>
              <Badge variant="outline" className="text-xs">+{factor.points} pts</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Optimizations */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Active Optimizations</h3>
        <div className="space-y-2">
          {optimizations.map((opt) => (
            <Card key={opt.title} className="bg-green-500/5 border-green-500/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-sm font-semibold text-foreground">{opt.title}</p>
                  <Badge className="bg-green-500/15 text-green-600 border-green-500/30 text-[10px] h-4">{opt.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 12-Hour Load Pattern */}
      <Card className="bg-card border-border/40">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">12-Hour Load Pattern</h4>
          <div className="flex items-end gap-1 h-24">
            {loadPattern.map((point) => (
              <div key={point.time} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className={`w-full rounded-t-sm ${
                    point.load > 70 ? 'bg-destructive/60' :
                    point.load > 50 ? 'bg-warning/60' :
                    'bg-green-500/60'
                  } ${point.current ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                  style={{ height: `${point.load}%` }}
                />
                <span className={`text-[8px] ${point.current ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{point.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            Your load is stable. System will notify you when cognitive state improves for non-urgent alerts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
