import { AlertTriangle, ClipboardCheck, CheckCircle2, Shield, User, Activity, Clock, MapPin, Pill, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStage {
  id: 'escalation' | 'assessment' | 'action';
  label: string;
  icon: React.ElementType;
  description?: string;
  items: { label: string; completed: boolean }[];
  borderColor: string;
  iconBg: string;
  iconColor: string;
}

const workflowStages: WorkflowStage[] = [
  {
    id: 'escalation',
    label: 'RISK ESCALATION',
    icon: AlertCircle,
    description: 'Early warning signal detected post-sedation.',
    items: [],
    borderColor: 'border-risk-high',
    iconBg: 'bg-risk-high/20',
    iconColor: 'text-risk-high',
  },
  {
    id: 'assessment',
    label: 'ASSESSMENT',
    icon: ClipboardCheck,
    items: [
      { label: 'Mobility Check', completed: true },
      { label: 'Sensors Verified', completed: true },
    ],
    borderColor: 'border-risk-medium',
    iconBg: 'bg-risk-medium/20',
    iconColor: 'text-risk-medium',
  },
  {
    id: 'action',
    label: 'ACTION',
    icon: CheckCircle2,
    items: [
      { label: 'Bed Alarm Set', completed: true },
      { label: 'Precautions Active', completed: true },
    ],
    borderColor: 'border-primary',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
  },
];

const StageCard = ({ stage, index }: { stage: WorkflowStage; index: number }) => {
  const Icon = stage.icon;
  
  return (
    <div className="relative flex-1 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
      {/* Connector Arrow */}
      {index < workflowStages.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50" />
            </svg>
          </div>
        </div>
      )}
      
      <div className={cn(
        "glass-card rounded-lg p-4 h-full border-2 transition-all",
        stage.borderColor
      )}>
        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stage.iconBg)}>
            <Icon className={cn("w-6 h-6", stage.iconColor)} />
          </div>
        </div>
        
        {/* Label */}
        <h3 className="text-sm font-bold text-foreground text-center mb-2">{stage.label}</h3>
        
        {/* Description or Items */}
        {stage.description ? (
          <p className="text-xs text-muted-foreground text-center">{stage.description}</p>
        ) : (
          <div className="space-y-1.5">
            {stage.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex items-center gap-2 text-xs"
              >
                <div className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                  item.completed ? 'bg-risk-low text-background' : 'border border-muted-foreground'
                )}>
                  {item.completed && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <span className={cn(item.completed ? 'text-foreground' : 'text-muted-foreground')}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ClinicalWorkflowView = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Clinical Use Case Scenario</h1>
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
            Live Demo
          </span>
          <span className="text-sm text-primary font-medium">From Alert to Intervention</span>
        </div>
      </div>

      {/* Synthetic Data Banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded bg-warning/15 border border-warning/30">
        <AlertTriangle className="w-4 h-4 text-warning" />
        <span className="text-xs font-semibold text-warning uppercase tracking-wider">Synthetic Data Simulation</span>
      </div>

      {/* Main Content: Patient Card + Workflow Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Patient Context Card */}
        <div className="glass-card rounded-lg p-4 border border-border/50">
          {/* Patient Avatar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Patient 4C-bed06</h3>
              <span className="text-[10px] text-muted-foreground">MRN 849201 • 78F</span>
            </div>
          </div>
          
          {/* Patient Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 px-3 rounded bg-risk-high/10 border border-risk-high/30">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-risk-high" />
                <span className="text-xs text-muted-foreground">Fall Risk:</span>
              </div>
              <span className="text-sm font-bold text-risk-high">68%</span>
            </div>
            
            <div className="flex items-center justify-between py-2 px-3 rounded bg-secondary/50">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">Time:</span>
              </div>
              <span className="text-xs font-medium text-primary">02:00 AM</span>
            </div>
            
            <div className="flex items-center justify-between py-2 px-3 rounded bg-secondary/50">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Unit:</span>
              </div>
              <span className="text-xs font-medium text-foreground">ICU-B</span>
            </div>
            
            <div className="flex items-center justify-between py-2 px-3 rounded bg-secondary/50">
              <div className="flex items-center gap-2">
                <Pill className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Status:</span>
              </div>
              <span className="text-xs font-medium text-foreground">Post-Sedation</span>
            </div>
          </div>
          
          {/* Pattern Change Note */}
          <div className="mt-4 pt-3 border-t border-border/30">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="text-primary font-semibold">01:30 → 02:00</span> pattern change noted in synthetic simulation
            </p>
          </div>
        </div>

        {/* Workflow Stages */}
        <div className="lg:col-span-3 flex flex-col lg:flex-row gap-4 lg:gap-6">
          {workflowStages.map((stage, index) => (
            <StageCard key={stage.id} stage={stage} index={index} />
          ))}
        </div>
      </div>

      {/* Outcome Banner */}
      <div className="p-4 rounded-lg bg-risk-low/10 border border-risk-low/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-risk-low/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-risk-low" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-risk-low">Fall Prevention Successful</h3>
            <p className="text-xs text-muted-foreground">Intervention logged at <span className="text-primary font-medium">02:15 AM</span></p>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider px-3 py-1 rounded bg-secondary/50 border border-border/30">
          Outcome
        </span>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-[10px] text-muted-foreground">
        Research Prototype — Synthetic Data — Not for Clinical Use
      </div>
    </div>
  );
};