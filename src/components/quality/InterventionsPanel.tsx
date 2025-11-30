import { cn } from '@/lib/utils';
import { AlertCircle, Clock, Eye, CheckCircle2 } from 'lucide-react';
import { type SuggestedIntervention, type PatientData, getPriorityColor } from '@/data/nursingOutcomes';

interface InterventionsPanelProps {
  patient: PatientData;
  compact?: boolean;
}

const PriorityIcon = ({ priority }: { priority: SuggestedIntervention['priority'] }) => {
  switch (priority) {
    case 'immediate':
      return <AlertCircle className="w-3 h-3" />;
    case 'routine':
      return <Clock className="w-3 h-3" />;
    case 'monitor':
      return <Eye className="w-3 h-3" />;
  }
};

export const InterventionsPanel = ({ patient, compact = false }: InterventionsPanelProps) => {
  const immediateCount = patient.interventions.filter(i => i.priority === 'immediate').length;
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {immediateCount > 0 && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-risk-high/10 text-risk-high border border-risk-high/30">
            <AlertCircle className="w-2.5 h-2.5" />
            {immediateCount} immediate
          </span>
        )}
        <span className="text-[9px] text-muted-foreground">
          {patient.interventions.length} total actions
        </span>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Suggested Interventions
        </h4>
        {immediateCount > 0 && (
          <span className="text-[9px] font-medium text-risk-high animate-pulse">
            {immediateCount} immediate
          </span>
        )}
      </div>
      
      <div className="space-y-1.5">
        {patient.interventions.map((intervention, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-2 p-2 rounded border text-[11px]",
              getPriorityColor(intervention.priority)
            )}
          >
            <PriorityIcon priority={intervention.priority} />
            <div className="flex-1">
              <span className="text-foreground">{intervention.action}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] opacity-70 uppercase">{intervention.priority}</span>
                <span className="text-[9px] opacity-50">•</span>
                <span className="text-[9px] opacity-70">{intervention.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Disclaimer */}
      <p className="text-[9px] text-muted-foreground italic pt-1">
        AI-suggested actions require clinical validation before implementation.
      </p>
    </div>
  );
};

// Summary version for dashboard
export const InterventionsSummary = ({ patients }: { patients: PatientData[] }) => {
  const allInterventions = patients.flatMap(p => p.interventions);
  const immediate = allInterventions.filter(i => i.priority === 'immediate').length;
  const routine = allInterventions.filter(i => i.priority === 'routine').length;
  
  return (
    <div className="glass-card rounded-lg p-4">
      <h3 className="text-xs font-semibold text-foreground mb-3">Pending Interventions</h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 rounded bg-risk-high/10 border border-risk-high/30">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-risk-high" />
            <span className="text-xs text-foreground">Immediate Actions</span>
          </div>
          <span className="text-lg font-bold text-risk-high">{immediate}</span>
        </div>
        
        <div className="flex items-center justify-between p-2 rounded bg-primary/10 border border-primary/30">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-xs text-foreground">Routine Actions</span>
          </div>
          <span className="text-lg font-bold text-primary">{routine}</span>
        </div>
      </div>
      
      <button className="w-full mt-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors">
        View All Interventions →
      </button>
    </div>
  );
};
