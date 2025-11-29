import { useState } from 'react';
import { Clock, Users, ArrowRightLeft, Coffee } from 'lucide-react';
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
}

const workflowPhases: WorkflowPhase[] = [
  {
    id: 'shift-start',
    label: 'Shift Start',
    icon: <Clock className="w-3.5 h-3.5" />,
    time: '07:00',
  },
  {
    id: 'rounds',
    label: 'Rounds',
    icon: <Users className="w-3.5 h-3.5" />,
    time: '08:30',
  },
  {
    id: 'break',
    label: 'Break',
    icon: <Coffee className="w-3.5 h-3.5" />,
    time: '12:00',
  },
  {
    id: 'handoff',
    label: 'Handoff',
    icon: <ArrowRightLeft className="w-3.5 h-3.5" />,
    time: '19:00',
  },
];

export const ClinicalWorkflowBar = () => {
  const [activePhase, setActivePhase] = useState('rounds');

  return (
    <TooltipProvider>
      <div className="bg-card/40 backdrop-blur-sm border border-border/20 rounded-lg px-4 py-2.5 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Shift
            </span>
            <span className="text-xs font-medium text-foreground">Day 7A-7P</span>
          </div>
          
          <div className="flex items-center gap-1">
            {workflowPhases.map((phase, index) => (
              <div key={phase.id} className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActivePhase(phase.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all",
                        activePhase === phase.id
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      {phase.icon}
                      <span className="hidden sm:inline font-medium">{phase.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p>{phase.label} · {phase.time}</p>
                  </TooltipContent>
                </Tooltip>
                {index < workflowPhases.length - 1 && (
                  <div className="w-4 h-px bg-border/40 mx-0.5 hidden md:block" />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
            <span className="font-medium">Active</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
