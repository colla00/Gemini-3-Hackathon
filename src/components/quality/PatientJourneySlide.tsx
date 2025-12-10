import { useState, useEffect } from 'react';
import { 
  UserPlus, Activity, AlertTriangle, Bell, Stethoscope, 
  CheckCircle, TrendingUp, Shield, ArrowRight, Clock, Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface JourneyStage {
  id: string;
  time: string;
  label: string;
  description: string;
  icon: React.ElementType;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  events: string[];
  systemAction?: string;
}

const patientJourney: JourneyStage[] = [
  {
    id: 'admission',
    time: 'Day 1, 08:00',
    label: 'Admission',
    description: 'Patient admitted to Med/Surg unit',
    icon: UserPlus,
    riskLevel: 'medium',
    riskScore: 45,
    events: ['Age: 78', 'History of falls', 'Hip replacement surgery'],
    systemAction: 'Baseline risk calculated from admission data',
  },
  {
    id: 'assessment',
    time: 'Day 1, 10:30',
    label: 'Nursing Assessment',
    description: 'Initial Morse Fall Scale completed',
    icon: Activity,
    riskLevel: 'medium',
    riskScore: 52,
    events: ['Morse score: 55', 'Mobility impaired', 'IV therapy active'],
    systemAction: 'Risk score updated with assessment data',
  },
  {
    id: 'vitals-change',
    time: 'Day 2, 14:15',
    label: 'Vital Signs Change',
    description: 'Afternoon vitals documented',
    icon: TrendingUp,
    riskLevel: 'high',
    riskScore: 68,
    events: ['BP: 142/88 → 118/72', 'HR: 88 → 102', 'Orthostatic changes noted'],
    systemAction: 'Risk trending upward detected',
  },
  {
    id: 'alert-triggered',
    time: 'Day 2, 14:15',
    label: 'High-Risk Alert',
    description: 'System generates priority alert',
    icon: AlertTriangle,
    riskLevel: 'high',
    riskScore: 78,
    events: ['Falls risk: 78%', 'Threshold exceeded', 'SHAP: BP drop + mobility'],
    systemAction: 'Alert sent to charge nurse dashboard',
  },
  {
    id: 'nurse-notified',
    time: 'Day 2, 14:16',
    label: 'Nurse Notification',
    description: 'Assigned nurse receives alert',
    icon: Bell,
    riskLevel: 'high',
    riskScore: 78,
    events: ['Push notification sent', 'Patient prioritized in queue', 'Interventions suggested'],
    systemAction: 'Waiting for nurse acknowledgment',
  },
  {
    id: 'intervention',
    time: 'Day 2, 14:22',
    label: 'Intervention Applied',
    description: 'Preventive measures implemented',
    icon: Stethoscope,
    riskLevel: 'high',
    riskScore: 78,
    events: ['Bed alarm activated', 'Non-slip socks applied', 'Hourly rounding initiated'],
    systemAction: 'Intervention logged in EHR',
  },
  {
    id: 'outcome',
    time: 'Day 4, Discharge',
    label: 'Safe Discharge',
    description: 'Patient discharged without falls',
    icon: Shield,
    riskLevel: 'low',
    riskScore: 32,
    events: ['No falls during stay', 'Interventions effective', 'Risk decreased post-mobility'],
    systemAction: 'Outcome tracked for model feedback',
  },
];

const riskColors = {
  low: 'bg-risk-low text-white',
  medium: 'bg-risk-medium text-white',
  high: 'bg-risk-high text-white',
};

const riskBorderColors = {
  low: 'border-risk-low',
  medium: 'border-risk-medium',
  high: 'border-risk-high',
};

export const PatientJourneySlide = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % patientJourney.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const stage = patientJourney[activeStage];

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-primary/5 p-6 flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Patient Journey: High-Risk Falls Prevention
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time monitoring from admission to safe discharge
        </p>
      </div>

      {/* Patient Info Bar */}
      <div className="flex items-center justify-center gap-6 mb-4 p-3 rounded-lg bg-secondary/50 border border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">MJ</span>
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">Margaret Johnson, 78F</div>
            <div className="text-[10px] text-muted-foreground">MRN: 4521 • Room 412B • Med/Surg</div>
          </div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{stage.riskScore}%</div>
            <div className="text-[9px] text-muted-foreground">Current Risk</div>
          </div>
          <Badge className={cn(riskColors[stage.riskLevel], "text-xs")}>
            {stage.riskLevel.toUpperCase()} RISK
          </Badge>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mb-4">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-border/50 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-risk-low via-risk-medium to-risk-high rounded-full transition-all duration-500"
            style={{ width: `${((activeStage + 1) / patientJourney.length) * 100}%` }}
          />
        </div>

        {/* Stage Dots */}
        <div className="relative flex justify-between px-4">
          {patientJourney.map((s, index) => {
            const isActive = index === activeStage;
            const isPast = index < activeStage;
            const Icon = s.icon;

            return (
              <button
                key={s.id}
                onClick={() => {
                  setActiveStage(index);
                  setIsAnimating(false);
                }}
                className="flex flex-col items-center"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    isActive
                      ? `${riskColors[s.riskLevel]} border-white shadow-lg scale-110`
                      : isPast
                      ? `${riskColors[s.riskLevel]} border-transparent opacity-70`
                      : "bg-secondary text-muted-foreground border-border"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className={cn(
                  "mt-2 text-[9px] font-medium text-center max-w-[80px] transition-opacity",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail */}
      <Card className={cn("flex-1 border-2", riskBorderColors[stage.riskLevel])}>
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-start gap-6 mb-4">
            {/* Stage Icon & Info */}
            <div className={cn(
              "w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0",
              riskColors[stage.riskLevel]
            )}>
              <stage.icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-foreground">{stage.label}</h3>
                <Badge variant="outline" className="text-[10px]">
                  <Clock className="w-3 h-3 mr-1" />
                  {stage.time}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{stage.description}</p>
            </div>
            {/* Risk Gauge */}
            <div className="w-24 text-center">
              <div className={cn(
                "text-3xl font-bold",
                stage.riskLevel === 'high' ? "text-risk-high" :
                stage.riskLevel === 'medium' ? "text-risk-medium" : "text-risk-low"
              )}>
                {stage.riskScore}%
              </div>
              <div className="text-[10px] text-muted-foreground">Falls Risk</div>
              <div className="mt-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500",
                    stage.riskLevel === 'high' ? "bg-risk-high" :
                    stage.riskLevel === 'medium' ? "bg-risk-medium" : "bg-risk-low"
                  )}
                  style={{ width: `${stage.riskScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Events & System Action */}
          <div className="grid grid-cols-2 gap-6 flex-1">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Clinical Events
              </h4>
              <div className="space-y-2">
                {stage.events.map((event, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 animate-fade-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <CheckCircle className={cn(
                      "w-4 h-4",
                      stage.riskLevel === 'high' ? "text-risk-high" :
                      stage.riskLevel === 'medium' ? "text-risk-medium" : "text-risk-low"
                    )} />
                    <span className="text-sm text-foreground">{event}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                System Response
              </h4>
              {stage.systemAction && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">AI System Action</span>
                  </div>
                  <p className="text-sm text-foreground">{stage.systemAction}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => setActiveStage(prev => prev > 0 ? prev - 1 : patientJourney.length - 1)}
          className="px-3 py-1.5 rounded text-xs font-medium bg-secondary hover:bg-secondary/80 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={cn(
            "px-4 py-1.5 rounded text-xs font-medium transition-colors",
            isAnimating ? "bg-primary text-primary-foreground" : "bg-secondary"
          )}
        >
          {isAnimating ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={() => setActiveStage(prev => (prev + 1) % patientJourney.length)}
          className="px-3 py-1.5 rounded text-xs font-medium bg-secondary hover:bg-secondary/80 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
