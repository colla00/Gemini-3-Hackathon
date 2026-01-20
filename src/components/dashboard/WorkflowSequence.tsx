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
    <div className={cn("bg-card/70 rounded-2xl border border-border/40 p-5 shadow-sm", className)}>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          System Workflow
        </span>
        <div className="h-px flex-1 bg-border/30" />
      </div>

      <div className="flex items-center justify-between">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div
              className={cn(
                "flex flex-col items-center text-center transition-all duration-300 flex-1",
                activeStep === step.id
                  ? "scale-105"
                  : "opacity-60 hover:opacity-80"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-all duration-300 shadow-sm",
                  activeStep === step.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary/60 text-muted-foreground"
                )}
              >
                {step.icon}
              </div>
              <span className={cn(
                "text-xs font-bold tracking-tight",
                activeStep === step.id ? "text-primary" : "text-foreground"
              )}>
                {step.label}
              </span>
              <span className="text-[10px] text-muted-foreground max-w-[90px] leading-tight mt-1">
                {step.description}
              </span>
            </div>

            {index < workflowSteps.length - 1 && (
              <div className="flex items-center px-2">
                <div className={cn(
                  "w-8 h-0.5 rounded-full transition-colors",
                  workflowSteps.findIndex(s => s.id === activeStep) > index
                    ? "bg-primary"
                    : "bg-border"
                )} />
                <ArrowRight className={cn(
                  "w-4 h-4 -ml-1",
                  workflowSteps.findIndex(s => s.id === activeStep) > index
                    ? "text-primary"
                    : "text-border"
                )} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
