import { useState } from 'react';
import { Clock, Users, ArrowRightLeft, Coffee, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WorkflowPhase {
  id: string;
  label: string;
  icon: React.ReactNode;
  time: string;
  description: string;
}

const workflowPhases: WorkflowPhase[] = [
  {
    id: 'shift-start',
    label: 'Shift Start',
    icon: <Clock className="w-3.5 h-3.5" />,
    time: '07:00',
    description: 'Initial patient census review',
  },
  {
    id: 'rounds',
    label: 'Rounds',
    icon: <Stethoscope className="w-3.5 h-3.5" />,
    time: '08:30',
    description: 'Bedside assessment & risk review',
  },
  {
    id: 'break',
    label: 'Break',
    icon: <Coffee className="w-3.5 h-3.5" />,
    time: '12:00',
    description: 'Mid-shift status check',
  },
  {
    id: 'handoff',
    label: 'Handoff',
    icon: <ArrowRightLeft className="w-3.5 h-3.5" />,
    time: '19:00',
    description: 'Shift transition & risk summary',
  },
];

export const ClinicalWorkflowBar = () => {
  const [activePhase, setActivePhase] = useState('rounds');

  return (
    <TooltipProvider>
      <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Workflow Context
              </span>
            </div>
            <div className="h-4 w-px bg-border/40" />
            <span className="text-xs font-medium text-foreground">Day Shift · 7A–7P</span>
          </div>
          
          <div className="flex items-center gap-1">
            {workflowPhases.map((phase, index) => (
              <div key={phase.id} className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActivePhase(phase.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all duration-300",
                        activePhase === phase.id
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      {phase.icon}
                      <span className="hidden sm:inline font-medium">{phase.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs max-w-[180px]">
                    <p className="font-semibold">{phase.label} · {phase.time}</p>
                    <p className="text-muted-foreground mt-0.5">{phase.description}</p>
                  </TooltipContent>
                </Tooltip>
                {index < workflowPhases.length - 1 && (
                  <div className="w-6 h-px bg-border/30 mx-1 hidden md:block" />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
            <span className="font-medium text-muted-foreground">System Active</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
