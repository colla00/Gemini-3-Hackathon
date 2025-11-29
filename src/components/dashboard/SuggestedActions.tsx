import { CheckCircle2, Circle, ArrowRight, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Patient, RiskType } from '@/data/patients';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SuggestedActionsProps {
  patient: Patient;
}

interface Action {
  id: string;
  label: string;
  priority: 'high' | 'medium' | 'low';
  rationale: string;
  completed?: boolean;
}

const getActionsForRiskType = (riskType: RiskType, riskLevel: string): Action[] => {
  const actionSets: Record<RiskType, Action[]> = {
    'Falls': [
      { id: '1', label: 'Verify bed alarm status', priority: 'high', rationale: 'Primary fall prevention measure for high-risk patients' },
      { id: '2', label: 'Assess mobility with PT', priority: 'high', rationale: 'Baseline mobility assessment informs intervention plan' },
      { id: '3', label: 'Review sedation timing', priority: 'medium', rationale: 'Recent sedation increases fall risk window' },
      { id: '4', label: 'Update fall risk signage', priority: 'low', rationale: 'Visual cues support team awareness', completed: true },
    ],
    'Pressure Injury': [
      { id: '1', label: 'Document repositioning schedule', priority: 'high', rationale: 'Pressure relief is primary prevention strategy' },
      { id: '2', label: 'Assess skin integrity', priority: 'high', rationale: 'Early detection enables timely intervention' },
      { id: '3', label: 'Evaluate nutritional status', priority: 'medium', rationale: 'Albumin and nutrition affect tissue healing' },
      { id: '4', label: 'Review support surface', priority: 'low', rationale: 'Specialized surfaces reduce pressure points', completed: true },
    ],
    'Device Complication': [
      { id: '1', label: 'Inspect device insertion site', priority: 'high', rationale: 'Site assessment detects early complications' },
      { id: '2', label: 'Verify device necessity', priority: 'high', rationale: 'Daily review supports timely removal' },
      { id: '3', label: 'Document dwell time', priority: 'medium', rationale: 'Duration correlates with complication risk' },
      { id: '4', label: 'Reinforce aseptic technique', priority: 'low', rationale: 'Consistent technique prevents infection', completed: true },
    ],
  };

  return actionSets[riskType] || [];
};

export const SuggestedActions = ({ patient }: SuggestedActionsProps) => {
  const actions = getActionsForRiskType(patient.riskType, patient.riskLevel);

  const priorityStyles = {
    high: 'border-l-risk-high bg-risk-high/5',
    medium: 'border-l-risk-medium bg-risk-medium/5',
    low: 'border-l-risk-low bg-risk-low/5',
  };

  return (
    <TooltipProvider>
      <div className="bg-card rounded-xl border border-border/50 p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Suggested Action Pathways
          </h3>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Workflow-aware recommendations based on interpretable AI analysis
        </p>

        <div className="space-y-2">
          {actions.map((action, index) => (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border-l-2 transition-all duration-200",
                    "hover:translate-x-1 cursor-default",
                    priorityStyles[action.priority],
                    action.completed && "opacity-60"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {action.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-risk-low flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={cn(
                    "text-sm text-foreground flex-1",
                    action.completed && "line-through"
                  )}>
                    {action.label}
                  </span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-xs">{action.rationale}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground mt-4 italic">
          * Human-in-the-loop judgment required for all clinical decisions
        </p>
      </div>
    </TooltipProvider>
  );
};
