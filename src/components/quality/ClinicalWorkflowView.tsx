import { AlertTriangle, ClipboardCheck, CheckCircle2, ArrowRight, TrendingUp, Shield } from 'lucide-react';
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
    alert: 'text-risk-high bg-risk-high/10 border-risk-high/30',
    assessment: 'text-primary bg-primary/10 border-primary/30',
    action: 'text-risk-low bg-risk-low/10 border-risk-low/30',
  };
  
  return (
    <div className="relative animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
      {/* Connector */}
      {index < workflowStages.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
          <ArrowRight className="w-6 h-6 text-primary" />
        </div>
      )}
      
      <div className={cn(
        "glass-card rounded-[20px] p-6 border-2 h-full",
        colors[stage.id]
      )}>
        {/* Stage Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            stage.id === 'alert' ? 'bg-risk-high/20' :
            stage.id === 'assessment' ? 'bg-primary/20' : 'bg-risk-low/20'
          )}>
            <Icon className={cn(
              "w-6 h-6",
              stage.id === 'alert' ? 'text-risk-high' :
              stage.id === 'assessment' ? 'text-primary' : 'text-risk-low'
            )} />
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Stage {index + 1}</span>
            <h3 className="text-lg font-bold text-foreground">{stage.label}</h3>
          </div>
        </div>
        
        {/* Checklist Items */}
        <div className="space-y-3">
          {stage.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                item.completed ? 'bg-risk-low/10' : 'bg-muted/20'
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
                item.completed ? 'bg-risk-low text-background' : 'border border-muted-foreground'
              )}>
                {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <span className={cn(
                "text-sm",
                item.completed ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ClinicalWorkflowView = () => {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Clinical Workflow Scenario
        </h2>
        <p className="text-muted-foreground">
          Three-stage intervention workflow from alert to outcome
        </p>
      </div>

      {/* Patient Context Card */}
      <div className="glass-card rounded-[20px] p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Patient Context</span>
            <h3 className="text-xl font-bold text-foreground">Simulated Patient 849201</h3>
            <p className="text-sm text-muted-foreground mt-1">Unit 4 West (Med-Surg) • Room 412-A</p>
          </div>
          
          {/* Risk Escalation */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-risk-high/10 border border-risk-high/30">
            <div className="text-center">
              <span className="text-xs text-muted-foreground block">Baseline</span>
              <span className="text-2xl font-bold text-risk-medium">42%</span>
              <span className="text-xs text-muted-foreground block">01:30 AM</span>
            </div>
            <TrendingUp className="w-6 h-6 text-risk-high" />
            <div className="text-center">
              <span className="text-xs text-muted-foreground block">Escalated</span>
              <span className="text-2xl font-bold text-risk-high">68%</span>
              <span className="text-xs text-muted-foreground block">02:00 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {workflowStages.map((stage, index) => (
          <StageCard key={stage.id} stage={stage} index={index} />
        ))}
      </div>

      {/* Outcome Banner */}
      <div className="mt-8 p-6 rounded-[20px] bg-risk-low/20 border-2 border-risk-low/40">
        <div className="flex items-center justify-center gap-4">
          <Shield className="w-10 h-10 text-risk-low" />
          <div className="text-center">
            <h3 className="text-2xl font-bold text-risk-low">Fall Prevention Successful</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Workflow completed • Risk mitigated through timely intervention
            </p>
          </div>
          <Shield className="w-10 h-10 text-risk-low" />
        </div>
      </div>

      {/* Workflow Summary */}
      <div className="glass-card rounded-[20px] p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Intervention Timeline</h3>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/30" />
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 pl-10 relative">
              <div className="absolute left-2.5 w-3 h-3 rounded-full bg-risk-medium border-2 border-background" />
              <div>
                <span className="text-xs text-muted-foreground">01:30 AM</span>
                <p className="text-sm text-foreground">Baseline risk assessment: 42% (Moderate)</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pl-10 relative">
              <div className="absolute left-2.5 w-3 h-3 rounded-full bg-risk-high border-2 border-background" />
              <div>
                <span className="text-xs text-muted-foreground">02:00 AM</span>
                <p className="text-sm text-foreground">Risk escalation detected: 68% (High) - Alert triggered</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pl-10 relative">
              <div className="absolute left-2.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              <div>
                <span className="text-xs text-muted-foreground">02:05 AM</span>
                <p className="text-sm text-foreground">Clinical assessment initiated and completed</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pl-10 relative">
              <div className="absolute left-2.5 w-3 h-3 rounded-full bg-risk-low border-2 border-background" />
              <div>
                <span className="text-xs text-muted-foreground">02:15 AM</span>
                <p className="text-sm text-foreground">Preventive actions implemented - Risk mitigated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
        <p className="text-center text-sm text-warning">
          <strong>Scenario Simulation:</strong> This workflow demonstrates the intended clinical integration.
          All timestamps and outcomes are synthetic for demonstration purposes.
        </p>
      </div>
    </div>
  );
};
