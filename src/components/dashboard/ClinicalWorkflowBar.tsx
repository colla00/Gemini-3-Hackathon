import { Eye, AlertTriangle, ClipboardCheck, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 'scan',
    label: 'Scan',
    icon: <Eye className="w-4 h-4" />,
    description: 'Review patient list',
  },
  {
    id: 'prioritize',
    label: 'Prioritize',
    icon: <AlertTriangle className="w-4 h-4" />,
    description: 'Focus on high-risk',
  },
  {
    id: 'assess',
    label: 'Assess',
    icon: <ClipboardCheck className="w-4 h-4" />,
    description: 'Review risk factors',
  },
  {
    id: 'act',
    label: 'Act',
    icon: <Activity className="w-4 h-4" />,
    description: 'Intervene as needed',
  },
];

interface ClinicalWorkflowBarProps {
  activeStep?: string;
}

export const ClinicalWorkflowBar = ({ activeStep = 'scan' }: ClinicalWorkflowBarProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mr-4">
          Workflow
        </span>
        <div className="flex items-center gap-1 flex-1">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 flex-1",
                  activeStep === step.id
                    ? "bg-primary/20 border border-primary/40"
                    : "hover:bg-secondary/50"
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    activeStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {step.icon}
                </div>
                <div className="hidden sm:block">
                  <p
                    className={cn(
                      "text-xs font-semibold transition-colors",
                      activeStep === step.id ? "text-primary" : "text-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < workflowSteps.length - 1 && (
                <div className="w-8 h-px bg-border/50 mx-1 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
