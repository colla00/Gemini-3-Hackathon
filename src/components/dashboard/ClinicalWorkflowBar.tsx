import { useState } from 'react';
import { Clock, Users, ArrowRightLeft, Coffee, Stethoscope, Droplets, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CAUTIHandoffReport } from '@/components/reports/CAUTIHandoffReport';
import { HandoffReport } from '@/components/reports/HandoffReport';

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
  const [showCAUTIReport, setShowCAUTIReport] = useState(false);
  const [showHandoffReport, setShowHandoffReport] = useState(false);

  // Determine shift based on current time
  const getShiftInfo = () => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 19) {
      return { label: 'Day Shift', time: '7A–7P' };
    } else {
      return { label: 'Night Shift', time: '7P–7A' };
    }
  };
  
  const shiftInfo = getShiftInfo();

  return (
    <TooltipProvider>
      <div className="bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl px-5 py-3.5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Workflow
              </span>
            </div>
            <div className="h-4 w-px bg-border/50" />
            <span className="text-xs font-semibold text-foreground bg-secondary/50 px-2 py-1 rounded-md">{shiftInfo.label} · {shiftInfo.time}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {workflowPhases.map((phase, index) => (
              <div key={phase.id} className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActivePhase(phase.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all duration-300",
                        activePhase === phase.id
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      )}
                    >
                      {phase.icon}
                      <span className="hidden sm:inline font-semibold">{phase.label}</span>
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

          <div className="flex items-center gap-3">
            {/* Handoff Reports - Show when handoff phase is active */}
            {activePhase === 'handoff' && (
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCAUTIReport(true)}
                      className="h-7 px-2.5 text-xs gap-1.5 bg-blue-500/10 border-blue-500/30 text-blue-600 hover:bg-blue-500/20 hover:text-blue-700"
                    >
                      <Droplets className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">CAUTI Report</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Generate CAUTI handoff report</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHandoffReport(true)}
                      className="h-7 px-2.5 text-xs gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">Full Report</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Generate full shift handoff report</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-xs bg-primary/10 px-2.5 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-semibold text-primary">System Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* CAUTI Handoff Report Modal */}
      {showCAUTIReport && (
        <CAUTIHandoffReport onClose={() => setShowCAUTIReport(false)} />
      )}

      {/* Full Handoff Report Modal */}
      {showHandoffReport && (
        <HandoffReport onClose={() => setShowHandoffReport(false)} />
      )}
    </TooltipProvider>
  );
};