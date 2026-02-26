import { useState } from 'react';
import { ListOrdered, TrendingUp, Activity, AlertCircle, Clock, Eye, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { patients } from '@/data/nursingOutcomes';

interface PriorityComponent {
  name: string;
  icon: React.ElementType;
  weight: number;
  value: number;
  maxValue: number;
  contribution: number;
}

interface PatientPriority {
  patientId: string;
  compositeScore: number;
  rank: number;
  components: PriorityComponent[];
}

const calculatePriority = (patient: typeof patients[0], index: number): PatientPriority => {
  // Simulate component values based on patient data
  const currentRisk = patient.fallsRisk;
  const trajectorySlope = patient.fallsLevel === 'HIGH' ? 15 : patient.fallsLevel === 'MODERATE' ? 5 : -5;
  const forecastUncertainty = 100 - patient.fallsConfidence;
  const volatility = Math.abs(trajectorySlope) + Math.random() * 10;
  const thresholdExceedance = patient.fallsLevel === 'HIGH' ? 3 : patient.fallsLevel === 'MODERATE' ? 1 : 0;
  const timeSinceReview = Math.floor(Math.random() * 120) + 15; // 15-135 minutes

  const components: PriorityComponent[] = [
    { name: 'Current Risk', icon: AlertCircle, weight: 0.30, value: currentRisk, maxValue: 100, contribution: currentRisk * 0.30 },
    { name: 'Trajectory Slope', icon: TrendingUp, weight: 0.25, value: trajectorySlope, maxValue: 30, contribution: Math.max(0, trajectorySlope) * 0.25 * 3.33 },
    { name: 'Forecast Uncertainty', icon: Activity, weight: 0.15, value: forecastUncertainty, maxValue: 50, contribution: forecastUncertainty * 0.15 * 2 },
    { name: 'Temporal Volatility', icon: Activity, weight: 0.15, value: volatility, maxValue: 30, contribution: volatility * 0.15 * 3.33 },
    { name: 'Threshold Frequency', icon: AlertCircle, weight: 0.10, value: thresholdExceedance, maxValue: 5, contribution: thresholdExceedance * 0.10 * 20 },
    { name: 'Time Since Review', icon: Clock, weight: 0.05, value: timeSinceReview, maxValue: 180, contribution: (timeSinceReview / 180) * 100 * 0.05 },
  ];

  const compositeScore = components.reduce((sum, c) => sum + c.contribution, 0);

  return {
    patientId: patient.mrn,
    compositeScore: Math.min(100, Math.round(compositeScore)),
    rank: index + 1,
    components,
  };
};

const ComponentBar = ({ component, animated }: { component: PriorityComponent; animated: boolean }) => {
  const Icon = component.icon;
  const percentage = (component.value / component.maxValue) * 100;

  return (
    <div className="flex items-center gap-2 py-1">
      <div className="w-24 flex items-center gap-1.5 text-[10px] text-muted-foreground shrink-0">
        <Icon className="w-3 h-3" />
        <span className="truncate">{component.name}</span>
      </div>
      <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary/60 rounded-full transition-all duration-700"
          style={{ width: animated ? `${Math.min(100, percentage)}%` : '0%' }}
        />
      </div>
      <div className="w-12 text-right text-[10px] font-mono">
        <span className="text-foreground">{component.contribution.toFixed(1)}</span>
        <span className="text-muted-foreground/70">×{component.weight}</span>
      </div>
    </div>
  );
};

const PriorityCard = ({ priority, index, isExpanded, onToggle }: { 
  priority: PatientPriority; 
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const [animated, setAnimated] = useState(false);

  useState(() => {
    const timer = setTimeout(() => setAnimated(true), index * 100);
    return () => clearTimeout(timer);
  });

  return (
    <div 
      className={cn(
        "border rounded-lg overflow-hidden transition-all duration-300 opacity-0 animate-fade-in",
        priority.rank === 1 ? "border-risk-high/40 bg-risk-high/5" : "border-border/30 bg-secondary/20"
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
            priority.rank === 1 ? "bg-risk-high text-white" :
            priority.rank <= 3 ? "bg-risk-medium text-white" :
            "bg-muted text-muted-foreground"
          )}>
            {priority.rank}
          </div>
          <span className="text-sm font-medium text-foreground">{priority.patientId}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-lg font-bold text-foreground tabular-nums">{priority.compositeScore}</span>
            <span className="text-[10px] text-muted-foreground">/100</span>
          </div>
          <Eye className={cn(
            "w-4 h-4 transition-transform",
            isExpanded ? "rotate-180 text-primary" : "text-muted-foreground"
          )} />
        </div>
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 border-t border-border/20">
          <div className="pt-3 space-y-1">
            {priority.components.map((component, i) => (
              <ComponentBar key={component.name} component={component} animated={animated} />
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-border/20 flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Composite Priority Score</span>
            <span className="font-bold text-foreground">{priority.compositeScore} points</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const PriorityScoring = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Calculate priorities for all patients
  const priorities = patients
    .map((patient, index) => calculatePriority(patient, index))
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .map((p, index) => ({ ...p, rank: index + 1 }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-primary" />
            Composite Workload Prioritization
          </h3>
          <p className="text-[10px] text-muted-foreground">Multi-factor ranking optimizes clinical attention allocation</p>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/10 border border-accent/30">
          <Award className="w-3 h-3 text-accent" />
          <span className="text-[9px] text-accent font-medium">Patent Claim 9</span>
        </div>
      </div>

      {/* Formula */}
      <div className="p-3 rounded bg-primary/5 border border-primary/20 text-[10px]">
        <span className="font-medium text-primary">Priority Score = </span>
        <span className="text-muted-foreground font-mono">
          0.30×Risk + 0.25×Slope + 0.15×Uncertainty + 0.15×Volatility + 0.10×Threshold + 0.05×TimeSinceReview
        </span>
      </div>

      {/* Priority List */}
      <div className="space-y-2">
        {priorities.slice(0, 5).map((priority, index) => (
          <PriorityCard
            key={priority.patientId}
            priority={priority}
            index={index}
            isExpanded={expandedIndex === index}
            onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        ))}
      </div>

      {/* Patent Note */}
      <div className="p-3 rounded bg-accent/10 border border-accent/30 text-[10px]">
        <div className="flex items-start gap-2">
          <Award className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-accent">Novel Innovation:</span>
            <span className="text-muted-foreground ml-1">
              Weighted composite scoring integrates current risk, trajectory dynamics, forecast uncertainty, 
              and temporal factors to optimize allocation of limited clinical attention.
            </span>
            <p className="text-accent mt-1">U.S. Patent Application Filed</p>
          </div>
        </div>
      </div>
    </div>
  );
};
