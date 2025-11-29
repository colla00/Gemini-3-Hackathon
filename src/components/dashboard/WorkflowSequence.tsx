import { Database, Cpu, BarChart3, Users, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStep {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 'input',
    icon: <Database className="w-5 h-5" />,
    label: 'EHR Input',
    description: 'De-identified clinical features',
  },
  {
    id: 'model',
    icon: <Cpu className="w-5 h-5" />,
    label: 'Interpretable AI',
    description: 'Risk trajectory analysis',
  },
  {
    id: 'output',
    icon: <BarChart3 className="w-5 h-5" />,
    label: 'Risk Output',
    description: 'Explainable predictions',
  },
  {
    id: 'clinician',
    icon: <Users className="w-5 h-5" />,
    label: 'Clinician Use',
    description: 'Human-in-the-loop judgment',
  },
];

interface WorkflowSequenceProps {
  activeStep?: string;
  className?: string;
}

export const WorkflowSequence = ({ activeStep = 'output', className }: WorkflowSequenceProps) => {
  return (
    <div className={cn("bg-card/60 rounded-xl border border-border/30 p-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          System Workflow
        </span>
      </div>

      <div className="flex items-center justify-between">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex flex-col items-center text-center transition-all duration-300",
                activeStep === step.id
                  ? "scale-105"
                  : "opacity-70"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-all duration-300",
                  activeStep === step.id
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-secondary/50 text-muted-foreground"
                )}
              >
                {step.icon}
              </div>
              <span className={cn(
                "text-[11px] font-semibold",
                activeStep === step.id ? "text-primary" : "text-foreground"
              )}>
                {step.label}
              </span>
              <span className="text-[9px] text-muted-foreground max-w-[80px] leading-tight mt-0.5">
                {step.description}
              </span>
            </div>

            {index < workflowSteps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-border mx-2 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
