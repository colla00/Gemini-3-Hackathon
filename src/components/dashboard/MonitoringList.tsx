import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Patient } from '@/data/patients';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface MonitoringListProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
  displayTime: (minutes: number) => string;
}

export const MonitoringList = ({ patients, onSelect, displayTime }: MonitoringListProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (patients.length === 0) return null;

  return (
    <TooltipProvider>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-2 mb-3 group cursor-pointer">
            <div className="h-px flex-1 bg-border/30" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-secondary/30 transition-colors">
              {isOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Monitoring ({patients.length})
              </span>
            </div>
            <div className="h-px flex-1 bg-border/30" />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="bg-card/30 rounded-xl border border-border/20 overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2 border-b border-border/20 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Patient</span>
              <span className="text-center">Risk</span>
              <span className="text-center">Score</span>
              <span className="text-center">Trend</span>
              <span className="text-right">Updated</span>
            </div>
            
            <div className="divide-y divide-border/10">
              {patients.map((patient) => (
                <MonitoringRow
                  key={patient.id}
                  patient={patient}
                  onClick={() => onSelect(patient)}
                  displayTime={displayTime(patient.lastUpdatedMinutes)}
                />
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
};

interface MonitoringRowProps {
  patient: Patient;
  onClick: () => void;
  displayTime: string;
}

const MonitoringRow = ({ patient, onClick, displayTime }: MonitoringRowProps) => {
  const TrendIcon = patient.trend === 'up' ? TrendingUp : patient.trend === 'down' ? TrendingDown : Minus;
  
  const riskStyles = {
    HIGH: { badge: 'bg-risk-high/10 text-risk-high', score: 'text-risk-high' },
    MEDIUM: { badge: 'bg-risk-medium/10 text-risk-medium', score: 'text-risk-medium' },
    LOW: { badge: 'bg-risk-low/10 text-risk-low', score: 'text-risk-low' },
  }[patient.riskLevel];

  const trendColor = {
    up: 'text-risk-high',
    down: 'text-risk-low',
    stable: 'text-muted-foreground',
  }[patient.trend];

  return (
    <button
      onClick={onClick}
      className="w-full grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 hover:bg-secondary/20 transition-colors text-left group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {patient.id}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 text-muted-foreground/50 hover:text-muted-foreground cursor-help flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-xs font-medium mb-1">{patient.riskType}</p>
                <p className="text-xs text-muted-foreground">{patient.riskSummary}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-[10px] text-muted-foreground">{patient.riskType}</span>
        </div>
      </div>

      <span className={cn(
        "px-2 py-0.5 rounded text-[10px] font-bold uppercase text-center",
        riskStyles.badge
      )}>
        {patient.riskLevel}
      </span>

      <span className={cn("text-sm font-bold tabular-nums text-center w-12", riskStyles.score)}>
        {patient.riskScore}%
      </span>

      <div className={cn("flex items-center justify-center", trendColor)}>
        <TrendIcon className="w-4 h-4" />
      </div>

      <div className="flex items-center gap-1.5 text-muted-foreground justify-end">
        <Clock className="w-3 h-3" />
        <span className="text-[11px]">{displayTime}</span>
      </div>
    </button>
  );
};
