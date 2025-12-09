import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { patients, getRiskLevelColor } from '@/data/nursingOutcomes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FeatureDetail {
  id: string;
  name: string;
  contribution: number;
  value: string;
  normalRange: string;
  confidenceInterval: [number, number];
  importance: number;
  description: string;
  clinicalContext: string;
  evidence: string;
  dataSource: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

const featureDetails: FeatureDetail[] = [
  {
    id: 'mobility',
    name: 'Mobility Status',
    contribution: 0.28,
    value: 'Impaired - Requires assistance',
    normalRange: 'Independent ambulation',
    confidenceInterval: [0.22, 0.34],
    importance: 95,
    description: 'Assessment of patient\'s ability to move independently and safely',
    clinicalContext: 'Patient requires 2-person assist for transfers. Uses walker when ambulatory. History of unsteady gait documented.',
    evidence: 'Strong predictor based on clinical literature (illustrative model)',
    dataSource: 'Nursing Assessment (q4h)',
    lastUpdated: '2 hours ago',
    trend: 'stable'
  },
  {
    id: 'medications',
    name: 'High-Risk Medications',
    contribution: 0.18,
    value: '4 medications flagged',
    normalRange: '0-1 high-risk medications',
    confidenceInterval: [0.14, 0.22],
    importance: 88,
    description: 'Count and type of medications associated with increased fall risk',
    clinicalContext: 'Opioids (Morphine PRN), Benzodiazepines (Lorazepam), Antihypertensives (Lisinopril), Diuretics (Furosemide)',
    evidence: 'High-risk medications associated with increased fall risk (literature-based)',
    dataSource: 'Pharmacy/MAR',
    lastUpdated: '45 mins ago',
    trend: 'up'
  },
  {
    id: 'age',
    name: 'Age Factor',
    contribution: 0.12,
    value: '78 years',
    normalRange: '<65 years (low risk)',
    confidenceInterval: [0.09, 0.15],
    importance: 72,
    description: 'Age-related risk adjustment based on population statistics',
    clinicalContext: 'Age >75 places patient in highest risk category for age-related falls',
    evidence: 'Age is a known risk factor for falls in clinical literature',
    dataSource: 'Demographics',
    lastUpdated: 'Static',
    trend: 'stable'
  },
  {
    id: 'cognition',
    name: 'Cognitive Status',
    contribution: 0.15,
    value: 'Mild impairment (CAM-)',
    normalRange: 'Oriented x4, no impairment',
    confidenceInterval: [0.11, 0.19],
    importance: 82,
    description: 'Assessment of cognitive function and delirium risk',
    clinicalContext: 'Patient occasionally confused about date. Follows simple commands. CAM negative for delirium.',
    evidence: 'Cognitive impairment is a recognized fall risk factor (literature-based)',
    dataSource: 'Nursing Assessment',
    lastUpdated: '4 hours ago',
    trend: 'stable'
  },
  {
    id: 'vitals',
    name: 'Vital Sign Instability',
    contribution: -0.08,
    value: 'Stable - WNL',
    normalRange: 'All vitals within normal limits',
    confidenceInterval: [-0.11, -0.05],
    importance: 45,
    description: 'Presence of orthostatic hypotension or vital sign abnormalities',
    clinicalContext: 'No orthostatic changes noted. BP 128/76, HR 72, RR 16, SpO2 97% RA',
    evidence: 'Stable vitals reduce predicted risk (protective factor)',
    dataSource: 'Vital Signs Monitor',
    lastUpdated: '30 mins ago',
    trend: 'down'
  },
  {
    id: 'prior_falls',
    name: 'Fall History',
    contribution: 0.22,
    value: '2 falls in past 6 months',
    normalRange: 'No falls in past year',
    confidenceInterval: [0.17, 0.27],
    importance: 91,
    description: 'History of previous falls as strongest single predictor',
    clinicalContext: 'Fall at home 3 months ago (hip contusion). Fall during previous admission 5 months ago (no injury).',
    evidence: 'Prior falls are the strongest predictor in clinical literature',
    dataSource: 'Medical History / Incident Reports',
    lastUpdated: 'Admission',
    trend: 'stable'
  },
  {
    id: 'environment',
    name: 'Environmental Risk',
    contribution: -0.05,
    value: 'Optimized',
    normalRange: 'Room safety measures in place',
    confidenceInterval: [-0.08, -0.02],
    importance: 35,
    description: 'Room environment and safety equipment status',
    clinicalContext: 'Bed alarm active, side rails up x2, call light in reach, non-slip footwear provided, room near nursing station',
    evidence: 'Environmental modifications reduce falls by 15-25%',
    dataSource: 'Safety Checklist',
    lastUpdated: '1 hour ago',
    trend: 'down'
  },
  {
    id: 'elimination',
    name: 'Elimination Needs',
    contribution: 0.10,
    value: 'Frequent - q2h',
    normalRange: 'Normal voiding pattern',
    confidenceInterval: [0.06, 0.14],
    importance: 65,
    description: 'Urinary urgency/frequency as fall risk factor',
    clinicalContext: 'Patient on Lasix, voiding frequently. Wakes 2-3x/night for bathroom. Urgency reported.',
    evidence: 'Urinary urgency increases fall risk during ambulation to bathroom (OR 1.8)',
    dataSource: 'I&O Records',
    lastUpdated: '2 hours ago',
    trend: 'up'
  }
];

const ConfidenceBar = ({ value, interval, maxValue = 0.5 }: { value: number; interval: [number, number]; maxValue?: number }) => {
  const centerPercent = ((value + maxValue) / (maxValue * 2)) * 100;
  const lowPercent = ((interval[0] + maxValue) / (maxValue * 2)) * 100;
  const highPercent = ((interval[1] + maxValue) / (maxValue * 2)) * 100;
  const isPositive = value >= 0;
  
  return (
    <div className="relative h-6 bg-muted/30 rounded overflow-hidden">
      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border z-10" />
      
      {/* Confidence interval range */}
      <div 
        className={cn(
          "absolute top-1 bottom-1 opacity-30 rounded",
          isPositive ? "bg-risk-high" : "bg-risk-low"
        )}
        style={{ 
          left: `${lowPercent}%`, 
          width: `${highPercent - lowPercent}%` 
        }}
      />
      
      {/* Main bar */}
      <div 
        className={cn(
          "absolute top-1.5 bottom-1.5 rounded transition-all duration-500",
          isPositive ? "bg-risk-high" : "bg-risk-low"
        )}
        style={{ 
          left: isPositive ? '50%' : `${centerPercent}%`,
          width: `${Math.abs(centerPercent - 50)}%`
        }}
      />
      
      {/* Value marker */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-foreground z-20"
        style={{ left: `${centerPercent}%` }}
      />
    </div>
  );
};

const FeatureRow = ({ feature, isExpanded, onToggle }: { 
  feature: FeatureDetail; 
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const isPositive = feature.contribution >= 0;
  const TrendIcon = feature.trend === 'up' ? TrendingUp : feature.trend === 'down' ? TrendingDown : Minus;
  
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className={cn(
        "border border-border/30 rounded-lg overflow-hidden transition-all",
        isExpanded && "ring-1 ring-primary/30"
      )}>
        <CollapsibleTrigger asChild>
          <div className="p-3 cursor-pointer hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              {/* Expand Icon */}
              <div className="shrink-0">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-primary" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              
              {/* Feature Name & Value */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{feature.name}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-xs">{feature.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-xs text-muted-foreground truncate block">{feature.value}</span>
              </div>
              
              {/* Contribution Badge */}
              <div className={cn(
                "px-2 py-1 rounded text-xs font-bold tabular-nums shrink-0",
                isPositive ? "bg-risk-high/20 text-risk-high" : "bg-risk-low/20 text-risk-low"
              )}>
                {isPositive ? '+' : ''}{(feature.contribution * 100).toFixed(0)}%
              </div>
              
              {/* Importance Bar */}
              <div className="w-20 shrink-0 hidden sm:block">
                <div className="text-[9px] text-muted-foreground mb-0.5">Importance</div>
                <Progress value={feature.importance} className="h-1.5" />
              </div>
              
              {/* Trend */}
              <TrendIcon className={cn(
                "w-4 h-4 shrink-0",
                feature.trend === 'up' ? 'text-risk-high' :
                feature.trend === 'down' ? 'text-risk-low' : 'text-muted-foreground'
              )} />
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-3 pb-3 space-y-3 border-t border-border/30 pt-3 bg-secondary/10">
            {/* Confidence Interval Visualization */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground">Contribution with 95% CI</span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  [{(feature.confidenceInterval[0] * 100).toFixed(0)}%, {(feature.confidenceInterval[1] * 100).toFixed(0)}%]
                </span>
              </div>
              <ConfidenceBar 
                value={feature.contribution} 
                interval={feature.confidenceInterval} 
              />
              <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                <span>Risk Reducing</span>
                <span>Risk Increasing</span>
              </div>
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="p-2 rounded bg-background/50 border border-border/20">
                  <div className="text-[10px] text-muted-foreground mb-1">Current Value</div>
                  <div className="text-xs font-medium text-foreground">{feature.value}</div>
                </div>
                <div className="p-2 rounded bg-background/50 border border-border/20">
                  <div className="text-[10px] text-muted-foreground mb-1">Normal Range</div>
                  <div className="text-xs text-foreground">{feature.normalRange}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded bg-background/50 border border-border/20">
                  <div className="text-[10px] text-muted-foreground mb-1">Data Source</div>
                  <div className="text-xs text-foreground">{feature.dataSource}</div>
                </div>
                <div className="p-2 rounded bg-background/50 border border-border/20">
                  <div className="text-[10px] text-muted-foreground mb-1">Last Updated</div>
                  <div className="text-xs text-foreground">{feature.lastUpdated}</div>
                </div>
              </div>
            </div>
            
            {/* Clinical Context */}
            <div className="p-2.5 rounded bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-semibold text-primary">Clinical Context</span>
              </div>
              <p className="text-[11px] text-foreground leading-relaxed">{feature.clinicalContext}</p>
            </div>
            
            {/* Evidence */}
            <div className="p-2.5 rounded bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-1.5 mb-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] font-semibold text-accent">Evidence Base</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{feature.evidence}</p>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export const ShapDeepDive = () => {
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set(['mobility']));
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [sortBy, setSortBy] = useState<'importance' | 'contribution'>('contribution');
  
  const selectedPatient = patients[selectedPatientIndex];
  
  const sortedFeatures = [...featureDetails].sort((a, b) => {
    if (sortBy === 'importance') return b.importance - a.importance;
    return Math.abs(b.contribution) - Math.abs(a.contribution);
  });
  
  const toggleFeature = (id: string) => {
    setExpandedFeatures(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  const expandAll = () => {
    setExpandedFeatures(new Set(featureDetails.map(f => f.id)));
  };
  
  const collapseAll = () => {
    setExpandedFeatures(new Set());
  };
  
  const totalPositive = featureDetails.filter(f => f.contribution > 0).reduce((sum, f) => sum + f.contribution, 0);
  const totalNegative = featureDetails.filter(f => f.contribution < 0).reduce((sum, f) => sum + f.contribution, 0);
  const baseRisk = 0.15;
  const finalRisk = baseRisk + totalPositive + totalNegative;
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Interactive SHAP Deep-Dive
          </h2>
          <p className="text-[11px] text-muted-foreground">Explore individual feature contributions with confidence intervals</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPatientIndex}
            onChange={(e) => setSelectedPatientIndex(Number(e.target.value))}
            className="text-xs py-1 px-2 rounded bg-secondary border border-border/50 text-foreground"
          >
            {patients.map((p, i) => (
              <option key={p.id} value={i}>{p.mrn} ({p.fallsLevel})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Feature List */}
        <div className="lg:col-span-2 space-y-3">
          {/* Controls */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'importance' | 'contribution')}
                className="text-xs py-1 px-2 rounded bg-secondary border border-border/50 text-foreground"
              >
                <option value="contribution">Contribution</option>
                <option value="importance">Importance</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={expandAll}
                className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
              >
                Expand All
              </button>
              <button 
                onClick={collapseAll}
                className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] p-2 rounded bg-secondary/30 border border-border/20">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-risk-high" />
              <span className="text-muted-foreground">Risk Increasing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-risk-low" />
              <span className="text-muted-foreground">Risk Reducing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-3 rounded bg-muted/50" />
              <span className="text-muted-foreground">95% Confidence Interval</span>
            </div>
          </div>
          
          {/* Feature List */}
          <div className="space-y-2">
            {sortedFeatures.map((feature) => (
              <FeatureRow
                key={feature.id}
                feature={feature}
                isExpanded={expandedFeatures.has(feature.id)}
                onToggle={() => toggleFeature(feature.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Summary Panel */}
        <div className="space-y-4">
          {/* Risk Calculation Summary */}
          <div className="glass-card rounded-lg p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-primary" />
              Risk Calculation Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-xs text-muted-foreground">Base Risk</span>
                <span className="text-sm font-bold text-foreground">{(baseRisk * 100).toFixed(0)}%</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-risk-high" />
                  <span className="text-xs text-muted-foreground">Risk Factors</span>
                </div>
                <span className="text-sm font-bold text-risk-high">+{(totalPositive * 100).toFixed(0)}%</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-risk-low" />
                  <span className="text-xs text-muted-foreground">Protective Factors</span>
                </div>
                <span className="text-sm font-bold text-risk-low">{(totalNegative * 100).toFixed(0)}%</span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-medium text-foreground">Final Predicted Risk</span>
                <span className={cn(
                  "text-2xl font-bold tabular-nums",
                  finalRisk >= 0.65 ? 'text-risk-high' :
                  finalRisk >= 0.35 ? 'text-risk-medium' : 'text-risk-low'
                )}>
                  {(finalRisk * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Patient Context */}
          <div className="glass-card rounded-lg p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3">Patient Context</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Patient</span>
                <span className="font-medium text-foreground">{selectedPatient.mrn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit/Room</span>
                <span className="font-medium text-foreground">{selectedPatient.unit} / {selectedPatient.bed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk Level</span>
                <span className={cn("font-semibold", getRiskLevelColor(selectedPatient.fallsLevel))}>
                  {selectedPatient.fallsLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model Confidence</span>
                <span className="font-medium text-primary">{selectedPatient.fallsConfidence}%</span>
              </div>
            </div>
          </div>
          
          {/* Interpretation Guide */}
          <div className="glass-card rounded-lg p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-accent" />
              How to Interpret
            </h3>
            <div className="space-y-2 text-[10px] text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-risk-low shrink-0 mt-0.5" />
                <span>Green bars = factors reducing risk</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-3 h-3 text-risk-high shrink-0 mt-0.5" />
                <span>Red bars = factors increasing risk</span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                <span>Shaded area = 95% confidence interval</span>
              </div>
              <div className="flex items-start gap-2">
                <BarChart3 className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                <span>Importance = feature weight in model</span>
              </div>
            </div>
          </div>
          
          {/* Clinical Actions */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold text-primary block mb-1">Top Actionable Factors</span>
                <ul className="text-[10px] text-foreground space-y-1">
                  <li>• Medication review (4 high-risk meds)</li>
                  <li>• Increase toileting rounds (q2h)</li>
                  <li>• Maintain environmental controls</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
