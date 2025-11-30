import { ReactNode } from 'react';
import { HelpCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ClinicalTermDefinition {
  term: string;
  definition: string;
  source?: string;
}

const clinicalTerms: Record<string, ClinicalTermDefinition> = {
  'SHAP': {
    term: 'SHAP Values',
    definition: 'SHapley Additive exPlanations - A method to explain model predictions by attributing contributions to each feature.',
    source: 'Lundberg & Lee, 2017',
  },
  'Falls Risk': {
    term: 'Falls Risk Score',
    definition: 'Predicted probability of a patient fall within the next 24 hours based on clinical factors.',
  },
  'HAPI': {
    term: 'Hospital-Acquired Pressure Injury',
    definition: 'Skin or tissue damage from sustained pressure, typically in bedridden patients.',
  },
  'CAUTI': {
    term: 'Catheter-Associated UTI',
    definition: 'Urinary tract infection associated with indwelling catheter use.',
  },
  'NSO': {
    term: 'Nurse-Sensitive Outcomes',
    definition: 'Patient outcomes directly influenced by nursing care quality and interventions.',
  },
  'Confidence': {
    term: 'Model Confidence',
    definition: 'Statistical certainty of the prediction. Higher values indicate more reliable predictions.',
  },
  'LOS': {
    term: 'Length of Stay',
    definition: 'Number of days the patient has been admitted to the hospital.',
  },
  'MRN': {
    term: 'Medical Record Number',
    definition: 'Unique identifier for patient records within the healthcare system.',
  },
  'Morse Scale': {
    term: 'Morse Fall Scale',
    definition: 'Validated assessment tool for identifying patients at risk of falling. Scores ≥45 indicate high risk.',
  },
  'Braden Score': {
    term: 'Braden Scale',
    definition: 'Assessment tool for pressure ulcer risk. Lower scores indicate higher risk.',
  },
  'RLS': {
    term: 'Risk Level Status',
    definition: 'Categorization of patient risk: HIGH (>65%), MODERATE (35-65%), LOW (<35%).',
  },
  'Sedation': {
    term: 'Sedative Medications',
    definition: 'Medications that can impair alertness and increase fall risk. Common agents include benzodiazepines and opioids.',
  },
};

interface ClinicalTooltipProps {
  term: keyof typeof clinicalTerms | string;
  children?: ReactNode;
  showIcon?: boolean;
  iconSize?: 'sm' | 'md';
  className?: string;
}

export const ClinicalTooltip = ({ 
  term, 
  children, 
  showIcon = true, 
  iconSize = 'sm',
  className 
}: ClinicalTooltipProps) => {
  const definition = clinicalTerms[term];
  
  if (!definition) {
    return <>{children || term}</>;
  }

  const iconClasses = iconSize === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("inline-flex items-center gap-1 cursor-help border-b border-dotted border-muted-foreground/50", className)}>
            {children || term}
            {showIcon && <HelpCircle className={cn(iconClasses, "text-muted-foreground/70")} />}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-3 glass-card border-primary/30"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-xs font-semibold text-foreground">{definition.term}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {definition.definition}
            </p>
            {definition.source && (
              <p className="text-[9px] text-muted-foreground/70 italic">
                Source: {definition.source}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Metric tooltip for showing calculation details
interface MetricTooltipProps {
  label: string;
  value: string | number;
  details: string;
  trend?: 'up' | 'down' | 'stable';
  children: ReactNode;
}

export const MetricTooltip = ({ label, value, details, trend, children }: MetricTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{children}</span>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-3 glass-card border-primary/30"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
              <span className="text-sm font-bold text-foreground">{value}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{details}</p>
            {trend && (
              <div className={cn(
                "text-[9px] font-medium",
                trend === 'up' ? 'text-risk-high' : trend === 'down' ? 'text-risk-low' : 'text-muted-foreground'
              )}>
                Trend: {trend === 'up' ? '↑ Increasing' : trend === 'down' ? '↓ Decreasing' : '→ Stable'}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
