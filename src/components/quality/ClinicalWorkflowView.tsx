import { useState } from 'react';
import { 
  AlertTriangle, CheckCircle2, Shield, User, Activity, Clock, 
  MapPin, Pill, Bell, FileText, TrendingUp, ChevronRight,
  ClipboardCheck, AlertCircle, Heart, Thermometer, ChevronDown, Syringe, Droplets
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClosedLoopFeedback } from './ClosedLoopFeedback';
import { TemporalForecasting } from './TemporalForecasting';
import { PriorityScoring } from './PriorityScoring';
import { AdaptiveThresholds } from './AdaptiveThresholds';

type WorkflowScenario = 'falls' | 'cauti';

interface TimelineEvent {
  time: string;
  type: 'alert' | 'assessment' | 'action' | 'outcome';
  title: string;
  description: string;
  user?: string;
}

// Falls workflow timeline
const fallsTimelineEvents: TimelineEvent[] = [
  { time: '01:30', type: 'alert', title: 'Baseline Risk Assessment', description: 'Fall risk: 42% (Moderate) - Routine monitoring', user: 'System' },
  { time: '01:45', type: 'action', title: 'Sedation Administered', description: 'Lorazepam 2mg IV per order', user: 'Clinical Staff' },
  { time: '02:00', type: 'alert', title: 'Risk Escalation Detected', description: 'Fall risk increased to 68% (High) - Alert triggered', user: 'System' },
  { time: '02:03', type: 'assessment', title: 'Clinical Assessment Initiated', description: 'Mobility check, mental status, environment review', user: 'Clinical Staff' },
  { time: '02:08', type: 'action', title: 'Bed Alarm Activated', description: 'Fall precaution protocol initiated', user: 'Clinical Staff' },
  { time: '02:10', type: 'action', title: 'Safety Measures Documented', description: 'Side rails up, call light within reach, non-slip socks applied', user: 'Clinical Staff' },
  { time: '02:15', type: 'outcome', title: 'Intervention Complete', description: 'Risk mitigated - Patient remains safe through shift', user: 'System' },
];

// CAUTI workflow timeline
const cautiTimelineEvents: TimelineEvent[] = [
  { time: '05:00', type: 'alert', title: 'CAUTI Risk Alert', description: 'Catheter Day 8 threshold exceeded - Risk: 62% → 78%', user: 'System' },
  { time: '05:05', type: 'alert', title: 'Symptomatic Indicators', description: 'New fever 38.2°C, cloudy urine with sediment detected', user: 'System' },
  { time: '05:12', type: 'assessment', title: 'Bedside Assessment', description: 'Patient reports suprapubic discomfort, catheter site inspected', user: 'RN Martinez' },
  { time: '05:20', type: 'action', title: 'STAT UA/Culture Ordered', description: 'Urine specimen collected using aseptic technique', user: 'RN Martinez' },
  { time: '05:30', type: 'assessment', title: 'Catheter Necessity Review', description: 'Evaluating medical indication for continued catheterization', user: 'RN Martinez' },
  { time: '05:45', type: 'action', title: 'Urology Consult Requested', description: 'Evaluation for intermittent catheterization or removal', user: 'MD on Call' },
  { time: '06:00', type: 'action', title: 'CAUTI Bundle Reinforced', description: 'Daily care documented, securement verified, bag positioning optimized', user: 'RN Martinez' },
  { time: '06:30', type: 'assessment', title: 'Bladder Scan Ordered', description: 'Post-void residual assessment scheduled for trial', user: 'Urology' },
  { time: '08:00', type: 'outcome', title: 'Removal Trial Scheduled', description: 'Catheter removal planned for Day 9 with PVR monitoring', user: 'Care Team' },
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

// Falls Prevention Checklist
const FallsAssessmentChecklist = () => {
  const checks = [
    { id: 1, label: 'Mobility assessment completed', checked: true },
    { id: 2, label: 'Mental status evaluated', checked: true },
    { id: 3, label: 'Environment safety check', checked: true },
    { id: 4, label: 'Bed alarm verified', checked: true },
    { id: 5, label: 'Call light placement confirmed', checked: true },
    { id: 6, label: 'Non-slip footwear applied', checked: true },
  ];

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

// CAUTI Prevention Checklist
const CAUTIAssessmentChecklist = () => {
  const checks = [
    { id: 1, label: 'Catheter necessity reviewed', checked: true },
    { id: 2, label: 'Insertion indication documented', checked: true },
    { id: 3, label: 'Catheter site inspected', checked: true },
    { id: 4, label: 'Securement device intact', checked: true },
    { id: 5, label: 'Drainage bag below bladder', checked: true },
    { id: 6, label: 'Urine color/clarity documented', checked: true },
    { id: 7, label: 'Patient temperature monitored', checked: true },
    { id: 8, label: 'Alternative voiding methods evaluated', checked: true },
  ];

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
            <span className="text-[9px] text-risk-low ml-auto">✓</span>
          )}
        </div>
      ))}
    </div>
  );
};

export const ClinicalWorkflowView = () => {
  const [scenario, setScenario] = useState<WorkflowScenario>('cauti');
  
  const timelineEvents = scenario === 'falls' ? fallsTimelineEvents : cautiTimelineEvents;
  const AssessmentChecklist = scenario === 'falls' ? FallsAssessmentChecklist : CAUTIAssessmentChecklist;
  
  // Scenario-specific data
  const scenarioData = {
    falls: {
      title: 'Fall risk escalation and intervention',
      patient: { mrn: '849201', age: '78F', room: '06', unit: '4C', diagnosis: 'CHF Exacerbation', los: '2 days' },
      riskBefore: { value: 42, time: '01:30', level: 'Moderate' },
      riskAfter: { value: 68, time: '02:00', level: 'High' },
      trigger: 'Sedation administration (Lorazepam 2mg)',
      outcome: { title: 'Fall Prevented', responseTime: '15 minutes', postRisk: '38% (Moderate)', result: 'No fall event' },
      checklistTitle: 'Fall Prevention Checklist',
      riskIcon: AlertTriangle,
      outcomeIcon: Shield,
    },
    cauti: {
      title: 'CAUTI risk escalation and catheter removal evaluation',
      patient: { mrn: '762918', age: '76M', room: '05', unit: '4C', diagnosis: 'Neurogenic Bladder - Spinal Injury', los: '8 days' },
      riskBefore: { value: 62, time: '04:00', level: 'Moderate' },
      riskAfter: { value: 78, time: '05:00', level: 'High' },
      trigger: 'Catheter Day 8 + fever 38.2°C + cloudy urine',
      outcome: { title: 'Catheter Removal Scheduled', responseTime: '3 hours', postRisk: 'Pending trial', result: 'Removal Day 9' },
      checklistTitle: 'CAUTI Bundle Checklist',
      riskIcon: Syringe,
      outcomeIcon: Droplets,
    }
  };
  
  const data = scenarioData[scenario];
  const RiskIcon = data.riskIcon;
  const OutcomeIcon = data.outcomeIcon;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Clinical Workflow Review</h2>
          <p className="text-[11px] text-muted-foreground">Case study: {data.title}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Scenario Selector */}
          <div className="flex rounded-lg overflow-hidden border border-border/50">
            <button
              onClick={() => setScenario('falls')}
              className={cn(
                "px-3 py-1.5 text-[10px] font-medium transition-colors flex items-center gap-1.5",
                scenario === 'falls' 
                  ? "bg-risk-high/20 text-risk-high" 
                  : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
              )}
            >
              <AlertTriangle className="w-3 h-3" />
              Falls Scenario
            </button>
            <button
              onClick={() => setScenario('cauti')}
              className={cn(
                "px-3 py-1.5 text-[10px] font-medium transition-colors flex items-center gap-1.5 border-l border-border/50",
                scenario === 'cauti' 
                  ? "bg-primary/20 text-primary" 
                  : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
              )}
            >
              <Syringe className="w-3 h-3" />
              CAUTI Scenario
            </button>
          </div>
          <span className="px-2 py-1 rounded bg-risk-low/20 border border-risk-low/30 text-[10px] font-semibold text-risk-low">
            {scenario === 'falls' ? 'RESOLVED' : 'IN PROGRESS'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Patient Info + Risk Summary */}
        <div className="space-y-4">
          {/* Patient Card */}
          <div className="glass-card rounded-lg p-4 opacity-0 animate-fade-in" key={`patient-${scenario}`} style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-12 h-12 rounded-full bg-secondary flex items-center justify-center border-2",
                scenario === 'cauti' ? 'border-primary/30' : 'border-primary/30'
              )}>
                {scenario === 'cauti' ? (
                  <Syringe className="w-6 h-6 text-primary" />
                ) : (
                  <User className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{data.patient.mrn}</span>
                  <span className="text-xs text-muted-foreground">• {data.patient.age}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Room {data.patient.room} • Unit {data.patient.unit}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">Diagnosis</span>
                  <span className="text-foreground text-[11px]">{data.patient.diagnosis}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">LOS</span>
                  <span className="text-foreground">{data.patient.los}</span>
                </div>
              </div>
            </div>
            
            {/* CAUTI-specific: Catheter info */}
            {scenario === 'cauti' && (
              <div className="mt-2 p-2 rounded bg-risk-high/10 border border-risk-high/30">
                <div className="flex items-center gap-2 text-xs">
                  <Syringe className="w-3.5 h-3.5 text-risk-high" />
                  <span className="text-risk-high font-medium">Foley Catheter Day 8</span>
                </div>
              </div>
            )}
          </div>

          {/* Risk Escalation Summary */}
          <div className="glass-card rounded-lg p-4 border border-risk-high/30 opacity-0 animate-fade-in" key={`risk-${scenario}`} style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2 mb-3">
              <RiskIcon className="w-4 h-4 text-risk-high" />
              <span className="text-xs font-semibold text-foreground">
                {scenario === 'cauti' ? 'CAUTI Risk Escalation' : 'Fall Risk Escalation'}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground block">Before</span>
                <span className="text-xl font-bold text-risk-medium">{data.riskBefore.value}%</span>
                <span className="text-[10px] text-muted-foreground block">{data.riskBefore.time}</span>
              </div>
              <TrendingUp className="w-5 h-5 text-risk-high mx-2" />
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground block">After</span>
                <span className="text-xl font-bold text-risk-high">{data.riskAfter.value}%</span>
                <span className="text-[10px] text-muted-foreground block">{data.riskAfter.time}</span>
              </div>
              <div className="px-2 py-1 rounded bg-risk-high/20 border border-risk-high/30">
                <span className="text-sm font-bold text-risk-high">+{data.riskAfter.value - data.riskBefore.value}%</span>
              </div>
            </div>

            <div className="p-2 rounded bg-secondary/50 text-[10px] text-muted-foreground">
              <strong className="text-foreground">Trigger:</strong> {data.trigger}
            </div>
          </div>

          {/* Vitals at Time of Alert */}
          <div className="glass-card rounded-lg p-4 opacity-0 animate-fade-in" key={`vitals-${scenario}`} style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <span className="text-xs font-semibold text-foreground block mb-3">
              Vitals at Alert ({scenario === 'cauti' ? '05:00' : '02:00'})
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                <Heart className={cn("w-3.5 h-3.5", scenario === 'cauti' ? 'text-risk-medium' : 'text-risk-high')} />
                <div className="text-xs">
                  <span className="text-muted-foreground">HR</span>
                  <span className="text-foreground font-medium ml-1">{scenario === 'cauti' ? '94 bpm' : '88 bpm'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <div className="text-xs">
                  <span className="text-muted-foreground">BP</span>
                  <span className="text-foreground font-medium ml-1">{scenario === 'cauti' ? '128/84' : '124/82'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                <Thermometer className={cn("w-3.5 h-3.5", scenario === 'cauti' ? 'text-risk-high' : 'text-risk-medium')} />
                <div className="text-xs">
                  <span className="text-muted-foreground">Temp</span>
                  <span className={cn("font-medium ml-1", scenario === 'cauti' ? 'text-risk-high' : 'text-foreground')}>
                    {scenario === 'cauti' ? '38.2°C' : '37.1°C'}
                  </span>
                </div>
              </div>
              {scenario === 'cauti' ? (
                <div className="flex items-center gap-2 p-2 rounded bg-risk-high/10 border border-risk-high/30">
                  <Droplets className="w-3.5 h-3.5 text-risk-high" />
                  <div className="text-xs">
                    <span className="text-muted-foreground">Urine</span>
                    <span className="text-risk-high font-medium ml-1">Cloudy</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                  <span className="w-3.5 h-3.5 text-center text-primary text-[10px] font-bold">O₂</span>
                  <div className="text-xs">
                    <span className="text-muted-foreground">SpO2</span>
                    <span className="text-foreground font-medium ml-1">97%</span>
                  </div>
                </div>
              )}
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
          <div className="glass-card rounded-lg p-4 opacity-0 animate-fade-in" key={`checklist-${scenario}`} style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">{data.checklistTitle}</span>
            </div>
            <AssessmentChecklist />
          </div>

          {/* Outcome Card */}
          <div 
            className={cn(
              "glass-card rounded-lg p-4 opacity-0 animate-scale-in",
              scenario === 'cauti' 
                ? "border border-primary/40 bg-primary/5" 
                : "border border-risk-low/40 bg-risk-low/5"
            )} 
            key={`outcome-${scenario}`}
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                scenario === 'cauti' ? "bg-primary/20" : "bg-risk-low/20"
              )}>
                <OutcomeIcon className={cn("w-5 h-5", scenario === 'cauti' ? "text-primary" : "text-risk-low")} />
              </div>
              <div>
                <span className={cn(
                  "text-sm font-bold block",
                  scenario === 'cauti' ? "text-primary" : "text-risk-low"
                )}>
                  {data.outcome.title}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {scenario === 'cauti' ? 'Removal trial initiated' : 'Intervention successful'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-secondary/30">
                <span className="text-muted-foreground">Response Time</span>
                <span className="text-foreground font-medium">{data.outcome.responseTime}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-secondary/30">
                <span className="text-muted-foreground">{scenario === 'cauti' ? 'Removal Status' : 'Post-Intervention Risk'}</span>
                <span className={cn("font-medium", scenario === 'cauti' ? "text-primary" : "text-risk-low")}>
                  {data.outcome.postRisk}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-secondary/30">
                <span className="text-muted-foreground">{scenario === 'cauti' ? 'Next Step' : 'Shift Outcome'}</span>
                <span className={cn("font-medium", scenario === 'cauti' ? "text-primary" : "text-risk-low")}>
                  {data.outcome.result}
                </span>
              </div>
              {scenario === 'cauti' && (
                <div className="flex justify-between p-2 rounded bg-risk-low/10 border border-risk-low/30">
                  <span className="text-muted-foreground">Bundle Compliance</span>
                  <span className="text-risk-low font-medium">100%</span>
                </div>
              )}
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