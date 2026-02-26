import { Database, Cpu, BarChart3, Users, ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface WorkflowStep {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  patentFeature: string;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 'input',
    icon: <Database className="w-5 h-5" />,
    label: 'EHR Integration',
    description: 'De-identified clinical features extracted in real-time',
    patentFeature: 'Continuous data ingestion',
  },
  {
    id: 'model',
    icon: <Cpu className="w-5 h-5" />,
    label: 'Interpretable AI',
    description: 'Temporal risk trajectory with explainable predictions',
    patentFeature: 'SHAP-based transparency',
  },
  {
    id: 'output',
    icon: <BarChart3 className="w-5 h-5" />,
    label: 'Priority Queue',
    description: 'Dynamic ranking by risk × actionability scoring',
    patentFeature: 'Adaptive prioritization',
  },
  {
    id: 'clinician',
    icon: <Users className="w-5 h-5" />,
    label: 'Clinical Action',
    description: 'Human-in-the-loop judgment with decision support',
    patentFeature: 'Augmented decision-making',
  },
];

interface AIWorkflowPipelineProps {
  activeStep?: string;
  className?: string;
  animated?: boolean;
}

export const AIWorkflowPipeline = ({ 
  activeStep: propActiveStep, 
  className,
  animated = true 
}: AIWorkflowPipelineProps) => {
  const [activeStep, setActiveStep] = useState(propActiveStep || 'input');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    if (!animated) return;
    
    const steps = workflowSteps.map(s => s.id);
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      const currentStep = steps[currentIndex];
      setActiveStep(currentStep);
      
      const completed = steps.slice(0, currentIndex);
      setCompletedSteps(completed);
      
      currentIndex = (currentIndex + 1) % steps.length;
      
      if (currentIndex === 0) {
        setCompletedSteps([]);
      }
    }, 2500);
    
    return () => clearInterval(interval);
  }, [animated]);

  const getStepStatus = (stepId: string) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (activeStep === stepId) return 'active';
    return 'pending';
  };

  return (
    <div className={cn("bg-card rounded-xl border border-border/50 p-5 shadow-card", className)}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Clinical Workflow Integration
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium border border-primary/20">
          Claim 3 · U.S. Patent Application Filed
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {workflowSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          
          return (
            <div key={step.id} className="relative">
              <div
                className={cn(
                  "flex flex-col items-center text-center transition-all duration-500 p-3 rounded-lg h-full",
                  status === 'active' && "bg-primary/10 ring-1 ring-primary/30",
                  status === 'completed' && "bg-green-500/10",
                  status === 'pending' && "opacity-60"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-all duration-500 relative",
                    status === 'active' && "bg-primary/20 text-primary border border-primary/40 shadow-lg shadow-primary/20",
                    status === 'completed' && "bg-green-500/20 text-green-500 border border-green-500/40",
                    status === 'pending' && "bg-secondary/50 text-muted-foreground border border-border/30"
                  )}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                  {status === 'active' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
                
                <span className={cn(
                  "text-[11px] font-semibold transition-colors duration-300",
                  status === 'active' && "text-primary",
                  status === 'completed' && "text-green-500",
                  status === 'pending' && "text-foreground"
                )}>
                  {step.label}
                </span>
                
                <span className="text-[9px] text-muted-foreground leading-tight mt-1">
                  {step.description}
                </span>
                
                <span className={cn(
                  "text-[8px] mt-2 px-1.5 py-0.5 rounded font-medium",
                  status === 'active' && "bg-primary/20 text-primary",
                  status === 'completed' && "bg-green-500/20 text-green-500",
                  status === 'pending' && "bg-secondary text-muted-foreground"
                )}>
                  {step.patentFeature}
                </span>
              </div>

              {index < workflowSteps.length - 1 && (
                <ArrowRight className={cn(
                  "absolute top-1/2 -right-3 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300 z-10",
                  completedSteps.includes(step.id) ? "text-green-500" : "text-border"
                )} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-border/30">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <div>
              <span className="text-[10px] text-muted-foreground block">Response</span>
              <span className="text-xs font-semibold text-primary">Near Real-Time</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-green-500" />
            <div>
              <span className="text-[10px] text-muted-foreground block">Human-in-Loop</span>
              <span className="text-xs font-semibold text-green-500">Always Required</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <div>
              <span className="text-[10px] text-muted-foreground block">Audit Trail</span>
              <span className="text-xs font-semibold text-amber-500">Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
