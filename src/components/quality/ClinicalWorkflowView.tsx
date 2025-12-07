import { useState } from 'react';
import { 
  AlertTriangle, CheckCircle2, Shield, User, Activity, Clock, 
  MapPin, Pill, Bell, FileText, TrendingUp, ChevronRight,
  ClipboardCheck, AlertCircle, Heart, Thermometer, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClosedLoopFeedback } from './ClosedLoopFeedback';
import { TemporalForecasting } from './TemporalForecasting';
import { PriorityScoring } from './PriorityScoring';
import { AdaptiveThresholds } from './AdaptiveThresholds';
interface TimelineEvent {
  time: string;
  type: 'alert' | 'assessment' | 'action' | 'outcome';
  title: string;
  description: string;
  user?: string;
}

const timelineEvents: TimelineEvent[] = [
  { time: '01:30', type: 'alert', title: 'Baseline Risk Assessment', description: 'Fall risk: 42% (Moderate) - Routine monitoring', user: 'System' },
  { time: '01:45', type: 'action', title: 'Sedation Administered', description: 'Lorazepam 2mg IV per order', user: 'Clinical Staff' },
  { time: '02:00', type: 'alert', title: 'Risk Escalation Detected', description: 'Fall risk increased to 68% (High) - Alert triggered', user: 'System' },
  { time: '02:03', type: 'assessment', title: 'Clinical Assessment Initiated', description: 'Mobility check, mental status, environment review', user: 'Clinical Staff' },
  { time: '02:08', type: 'action', title: 'Bed Alarm Activated', description: 'Fall precaution protocol initiated', user: 'Clinical Staff' },
  { time: '02:10', type: 'action', title: 'Safety Measures Documented', description: 'Side rails up, call light within reach, non-slip socks applied', user: 'Clinical Staff' },
  { time: '02:15', type: 'outcome', title: 'Intervention Complete', description: 'Risk mitigated - Patient remains safe through shift', user: 'System' },
];

const TimelineItem = ({ event, index, isLast }: { event: TimelineEvent; index: number; isLast: boolean }) => {
  const typeConfig = {
    alert: { icon: Bell, color: 'text-risk-high', bg: 'bg-risk-high/20', border: 'border-risk-high/40' },
    assessment: { icon: ClipboardCheck, color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/40' },
    action: { icon: CheckCircle2, color: 'text-risk-medium', bg: 'bg-risk-medium/20', border: 'border-risk-medium/40' },
    outcome: { icon: Shield, color: 'text-risk-low', bg: 'bg-risk-low/20', border: 'border-risk-low/40' },
  };
  
  const config = typeConfig[event.type];
  const Icon = config.icon;

  return (
    <div 
      className="flex gap-4 opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border", config.bg, config.border)}>
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border/50 my-1" />}
      </div>
      
      {/* Content */}
      <div className={cn("flex-1 pb-4", !isLast && "border-b border-border/20 mb-4")}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-primary">{event.time}</span>
            <span className={cn("text-sm font-semibold", config.color)}>{event.title}</span>
          </div>
          {event.user && (
            <span className="text-[10px] text-muted-foreground">{event.user}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{event.description}</p>
      </div>
    </div>
  );
};

const AssessmentChecklist = () => {
  const [checks, setChecks] = useState([
    { id: 1, label: 'Mobility assessment completed', checked: true },
    { id: 2, label: 'Mental status evaluated', checked: true },
    { id: 3, label: 'Environment safety check', checked: true },
    { id: 4, label: 'Bed alarm verified', checked: true },
    { id: 5, label: 'Call light placement confirmed', checked: true },
    { id: 6, label: 'Non-slip footwear applied', checked: true },
  ]);

  return (
    <div className="space-y-2">
      {checks.map((check, index) => (
        <div 
          key={check.id}
          className="flex items-center gap-2 py-1.5 px-2 rounded bg-secondary/30 opacity-0 animate-slide-in-right"
          style={{ animationDelay: `${400 + index * 50}ms`, animationFillMode: 'forwards' }}
        >
          <div className={cn(
            "w-4 h-4 rounded flex items-center justify-center shrink-0",
            check.checked ? 'bg-risk-low text-background' : 'border border-muted-foreground'
          )}>
            {check.checked && <CheckCircle2 className="w-3 h-3" />}
          </div>
          <span className={cn("text-xs", check.checked ? 'text-foreground' : 'text-muted-foreground')}>
            {check.label}
          </span>
          {check.checked && (
            <span className="text-[9px] text-risk-low ml-auto">✓ Completed</span>
          )}
        </div>
      ))}
    </div>
  );
};

export const ClinicalWorkflowView = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Clinical Workflow Review</h2>
          <p className="text-[11px] text-muted-foreground">Case study: Fall risk escalation and intervention</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-risk-low/20 border border-risk-low/30 text-[10px] font-semibold text-risk-low">
            RESOLVED
          </span>
          <span className="text-[10px] text-muted-foreground">Shift: Night 11/30</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Patient Info + Risk Summary */}
        <div className="space-y-4">
          {/* Patient Card */}
          <div className="glass-card rounded-lg p-4 opacity-0 animate-fade-in" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">849201</span>
                  <span className="text-xs text-muted-foreground">• 78F</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Room 06 • Unit 4C</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">Diagnosis</span>
                  <span className="text-foreground">CHF Exacerbation</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">LOS</span>
                  <span className="text-foreground">2 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Escalation Summary */}
          <div className="glass-card rounded-lg p-4 border border-risk-high/30 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-risk-high" />
              <span className="text-xs font-semibold text-foreground">Risk Escalation</span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground block">Before</span>
                <span className="text-xl font-bold text-risk-medium">42%</span>
                <span className="text-[10px] text-muted-foreground block">01:30</span>
              </div>
              <TrendingUp className="w-5 h-5 text-risk-high mx-2" />
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground block">After</span>
                <span className="text-xl font-bold text-risk-high">68%</span>
                <span className="text-[10px] text-muted-foreground block">02:00</span>
              </div>
              <div className="px-2 py-1 rounded bg-risk-high/20 border border-risk-high/30">
                <span className="text-sm font-bold text-risk-high">+26%</span>
              </div>
            </div>

            <div className="p-2 rounded bg-secondary/50 text-[10px] text-muted-foreground">
              <strong className="text-foreground">Trigger:</strong> Sedation administration (Lorazepam 2mg)
            </div>
          </div>

          {/* Vitals at Time of Alert */}
          <div className="glass-card rounded-lg p-4 opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <span className="text-xs font-semibold text-foreground block mb-3">Vitals at Alert (02:00)</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                <Heart className="w-3.5 h-3.5 text-risk-high" />
                <div className="text-xs">
                  <span className="text-muted-foreground">HR</span>
                  <span className="text-foreground font-medium ml-1">88 bpm</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <div className="text-xs">
                  <span className="text-muted-foreground">BP</span>
                  <span className="text-foreground font-medium ml-1">124/82</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                <Thermometer className="w-3.5 h-3.5 text-risk-medium" />
                <div className="text-xs">
                  <span className="text-muted-foreground">Temp</span>
                  <span className="text-foreground font-medium ml-1">37.1°C</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                <span className="w-3.5 h-3.5 text-center text-primary text-[10px] font-bold">O₂</span>
                <div className="text-xs">
                  <span className="text-muted-foreground">SpO2</span>
                  <span className="text-foreground font-medium ml-1">97%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Timeline */}
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-foreground">Intervention Timeline</span>
            <span className="text-[10px] text-muted-foreground">Night Shift 11/30</span>
          </div>
          
          <div className="space-y-0">
            {timelineEvents.map((event, index) => (
              <TimelineItem 
                key={index} 
                event={event} 
                index={index}
                isLast={index === timelineEvents.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Assessment & Outcome */}
        <div className="space-y-4">
          {/* Assessment Checklist */}
          <div className="glass-card rounded-lg p-4 opacity-0 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Fall Prevention Checklist</span>
            </div>
            <AssessmentChecklist />
          </div>

          {/* Outcome Card */}
          <div className="glass-card rounded-lg p-4 border border-risk-low/40 bg-risk-low/5 opacity-0 animate-scale-in" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-risk-low/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-risk-low" />
              </div>
              <div>
                <span className="text-sm font-bold text-risk-low block">Fall Prevented</span>
                <span className="text-[10px] text-muted-foreground">Intervention successful</span>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-secondary/30">
                <span className="text-muted-foreground">Response Time</span>
                <span className="text-foreground font-medium">15 minutes</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-secondary/30">
                <span className="text-muted-foreground">Post-Intervention Risk</span>
                <span className="text-risk-low font-medium">38% (Moderate)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-secondary/30">
                <span className="text-muted-foreground">Shift Outcome</span>
                <span className="text-risk-low font-medium">No fall event</span>
              </div>
            </div>
          </div>

          {/* Simulation Notice */}
          <div className="p-3 rounded bg-warning/10 border border-warning/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
              <p className="text-[10px] text-warning/80">
                <strong className="text-warning">Simulated Scenario:</strong> This workflow demonstrates AI-assisted early warning with human clinical response. All data is synthetic.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Closed-Loop Feedback Section - Patent Innovation */}
      <div className="mt-4">
        <ClosedLoopFeedback />
      </div>

      {/* Additional Patent Innovations - Collapsible */}
      <div className="mt-4 space-y-4">
        <details className="glass-card rounded-lg overflow-hidden group">
          <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors">
            <span className="text-sm font-semibold text-foreground">Multi-Horizon Temporal Forecasting (Patent Claim 5)</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="p-4 pt-0 border-t border-border/20">
            <TemporalForecasting />
          </div>
        </details>

        <details className="glass-card rounded-lg overflow-hidden group">
          <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors">
            <span className="text-sm font-semibold text-foreground">Workload Priority Scoring (Patent Claim 9)</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="p-4 pt-0 border-t border-border/20">
            <PriorityScoring />
          </div>
        </details>

        <details className="glass-card rounded-lg overflow-hidden group">
          <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors">
            <span className="text-sm font-semibold text-foreground">Patient-Adaptive Thresholds (Patent Claim 6)</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="p-4 pt-0 border-t border-border/20">
            <AdaptiveThresholds />
          </div>
        </details>
      </div>
    </div>
  );
};