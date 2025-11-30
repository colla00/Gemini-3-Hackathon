import { AlertTriangle, ClipboardCheck, CheckCircle2, ArrowRight, TrendingUp, Shield, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workflowStages, type WorkflowStage } from '@/data/nursingOutcomes';

const StageCard = ({ stage, index }: { stage: WorkflowStage; index: number }) => {
  const icons = {
    alert: AlertTriangle,
    assessment: ClipboardCheck,
    action: CheckCircle2,
  };
  const Icon = icons[stage.id];
  
  const colors = {
    alert: 'border-risk-high/40 bg-risk-high/5',
    assessment: 'border-primary/40 bg-primary/5',
    action: 'border-risk-low/40 bg-risk-low/5',
  };

  const iconColors = {
    alert: 'bg-risk-high/20 text-risk-high',
    assessment: 'bg-primary/20 text-primary',
    action: 'bg-risk-low/20 text-risk-low',
  };
  
  return (
    <div className="relative animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Connector */}
      {index < workflowStages.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
          <ArrowRight className="w-5 h-5 text-primary" />
        </div>
      )}
      
      <div className={cn("glass-card rounded-lg p-4 border h-full", colors[stage.id])}>
        {/* Stage Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={cn("w-8 h-8 rounded flex items-center justify-center", iconColors[stage.id])}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Stage {index + 1}</span>
            <h3 className="text-sm font-bold text-foreground">{stage.label}</h3>
          </div>
        </div>
        
        {/* Checklist Items */}
        <div className="space-y-2">
          {stage.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className={cn(
                "flex items-center gap-2 py-1.5 px-2 rounded text-[11px]",
                item.completed ? 'bg-risk-low/10' : 'bg-muted/20'
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded flex items-center justify-center shrink-0",
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
      </div>
    </div>
  );
};

const TimelineEvent = ({ time, label, color }: { time: string; label: string; color: string }) => (
  <div className="flex items-start gap-3 pl-6 relative">
    <div className={cn("absolute left-1.5 w-3 h-3 rounded-full border-2 border-background", color)} />
    <div>
      <span className="text-[10px] text-muted-foreground">{time}</span>
      <p className="text-xs text-foreground">{label}</p>
    </div>
  </div>
);

export const ClinicalWorkflowView = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Clinical Workflow Scenario</h2>
          <p className="text-[11px] text-muted-foreground">Three-stage intervention from alert to outcome</p>
        </div>
        <span className="text-[10px] text-primary font-medium px-2 py-1 bg-primary/10 rounded">
          Demo Scenario
        </span>
      </div>

      {/* Patient Context + Risk Escalation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patient Context */}
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Patient Context</span>
              <h3 className="text-sm font-bold text-foreground">Simulated Patient 849201</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between p-2 rounded bg-secondary/30">
              <span className="text-muted-foreground">Unit</span>
              <span className="text-foreground font-medium">4 West (Med-Surg)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-secondary/30">
              <span className="text-muted-foreground">Room</span>
              <span className="text-foreground font-medium">412-A</span>
            </div>
          </div>
        </div>

        {/* Risk Escalation */}
        <div className="glass-card rounded-lg p-4 border border-risk-high/30 bg-risk-high/5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Risk Escalation Detected</span>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <span className="text-[10px] text-muted-foreground block">Baseline</span>
              <span className="text-2xl font-bold text-risk-medium">42%</span>
              <span className="text-[10px] text-muted-foreground block">01:30 AM</span>
            </div>
            <TrendingUp className="w-6 h-6 text-risk-high mx-4" />
            <div className="text-center">
              <span className="text-[10px] text-muted-foreground block">Escalated</span>
              <span className="text-2xl font-bold text-risk-high">68%</span>
              <span className="text-[10px] text-muted-foreground block">02:00 AM</span>
            </div>
            <div className="ml-4 px-3 py-1.5 rounded bg-risk-high/20 border border-risk-high/40">
              <span className="text-xs font-bold text-risk-high">+26%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {workflowStages.map((stage, index) => (
          <StageCard key={stage.id} stage={stage} index={index} />
        ))}
      </div>

      {/* Outcome Banner */}
      <div className="p-4 rounded-lg bg-risk-low/10 border border-risk-low/40 flex items-center justify-center gap-3">
        <Shield className="w-6 h-6 text-risk-low" />
        <div className="text-center">
          <h3 className="text-lg font-bold text-risk-low">Fall Prevention Successful</h3>
          <p className="text-[11px] text-muted-foreground">Risk mitigated through timely intervention • 02:15 AM</p>
        </div>
        <Shield className="w-6 h-6 text-risk-low" />
      </div>

      {/* Bottom Row: Timeline + Disclaimer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Timeline */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary" />
            Intervention Timeline
          </h3>
          <div className="relative space-y-3">
            {/* Timeline Line */}
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-border/50" />
            
            <TimelineEvent time="01:30 AM" label="Baseline risk: 42% (Moderate)" color="bg-risk-medium" />
            <TimelineEvent time="02:00 AM" label="Risk escalation: 68% (High) - Alert triggered" color="bg-risk-high" />
            <TimelineEvent time="02:05 AM" label="Clinical assessment completed" color="bg-primary" />
            <TimelineEvent time="02:15 AM" label="Preventive actions implemented - Risk mitigated" color="bg-risk-low" />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 flex flex-col justify-center">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-warning block mb-1">Scenario Simulation</span>
              <p className="text-[11px] text-warning/80">
                This workflow demonstrates intended clinical integration. All timestamps and outcomes
                are synthetic for demonstration purposes. Not representative of actual clinical performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
