// Types for Nurse-Sensitive Outcomes Dashboard
export type RiskLevel = 'HIGH' | 'MODERATE' | 'LOW';
export type RiskCategory = 'FALLS' | 'HAPI' | 'CAUTI';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface ContributingFactor {
  label: string;
  value: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface RiskTrendPoint {
  hour: string;
  value: number;
}

export interface SuggestedIntervention {
  action: string;
  priority: 'immediate' | 'routine' | 'monitor';
  category: RiskCategory;
}

export interface RiskCategoryData {
  category: RiskCategory;
  label: string;
  score: number;
  level: RiskLevel;
  trend: TrendDirection;
  confidence: number;
  factors: ContributingFactor[];
}

export interface PatientData {
  id: string;
  unit: string;
  bed: string;
  fallsRisk: number;
  fallsLevel: RiskLevel;
  fallsConfidence: number;
  fallsTrend: RiskTrendPoint[];
  hapiRisk: number;
  hapiLevel: RiskLevel;
  hapiConfidence: number;
  cautiRisk: number;
  cautiLevel: RiskLevel;
  cautiConfidence: number;
  lastUpdated: string;
  vitals: {
    heartRate: number;
    bp: string;
    o2Sat: string;
    temp: string;
  };
  interventions: SuggestedIntervention[];
}

export interface ShapFactor {
  factor: string;
  contribution: number;
  cumulative: number;
  type: 'base' | 'risk' | 'protective';
}

export interface WorkflowStage {
  id: 'alert' | 'assessment' | 'action';
  label: string;
  items: { label: string; completed: boolean }[];
}

// Helper to generate trend data
const generateTrend = (baseRisk: number, direction: TrendDirection): RiskTrendPoint[] => {
  const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'];
  const variance = direction === 'up' ? 15 : direction === 'down' ? -10 : 5;
  return hours.map((hour, i) => ({
    hour,
    value: Math.max(5, Math.min(95, baseRisk - variance + (i * variance / 6) + (Math.random() * 8 - 4)))
  }));
};

// Sample Risk Categories for Dashboard Overview
export const riskCategories: RiskCategoryData[] = [
  {
    category: 'FALLS',
    label: 'Falls Risk',
    score: 68,
    level: 'HIGH',
    trend: 'up',
    confidence: 87,
    factors: [
      { label: 'Recent sedation administration', value: 'Lorazepam 2mg', impact: 'negative' },
      { label: 'Mobility status', value: 'Ambulates with assist', impact: 'negative' },
      { label: 'Bed alarm status', value: 'Not activated', impact: 'negative' },
    ],
  },
  {
    category: 'HAPI',
    label: 'Pressure Injury Risk',
    score: 45,
    level: 'MODERATE',
    trend: 'stable',
    confidence: 82,
    factors: [
      { label: 'Braden score', value: '14 (High Risk)', impact: 'negative' },
      { label: 'Repositioning frequency', value: 'q2h compliant', impact: 'positive' },
      { label: 'Skin assessment', value: 'Due in 2 hours', impact: 'neutral' },
    ],
  },
  {
    category: 'CAUTI',
    label: 'Catheter-Associated UTI Risk',
    score: 32,
    level: 'LOW',
    trend: 'down',
    confidence: 91,
    factors: [
      { label: 'Catheter days', value: '2 days', impact: 'neutral' },
      { label: 'Assessment compliance', value: '100% documented', impact: 'positive' },
      { label: 'Alternative voiding', value: 'Evaluated', impact: 'positive' },
    ],
  },
];

// Sample Patients for Patient List View (expanded to 10)
export const patients: PatientData[] = [
  {
    id: 'Patient 4C-bed06',
    unit: '4C',
    bed: '06',
    fallsRisk: 68,
    fallsLevel: 'HIGH',
    fallsConfidence: 87,
    fallsTrend: generateTrend(68, 'up'),
    hapiRisk: 45,
    hapiLevel: 'MODERATE',
    hapiConfidence: 82,
    cautiRisk: 32,
    cautiLevel: 'LOW',
    cautiConfidence: 91,
    lastUpdated: '06:00',
    vitals: { heartRate: 88, bp: '124/82', o2Sat: '97%', temp: '37.1°C' },
    interventions: [
      { action: 'Activate bed alarm immediately', priority: 'immediate', category: 'FALLS' },
      { action: 'Reassess mobility status', priority: 'immediate', category: 'FALLS' },
      { action: 'Document sedation effects', priority: 'routine', category: 'FALLS' },
    ],
  },
  {
    id: 'Patient 4C-bed14',
    unit: '4C',
    bed: '14',
    fallsRisk: 51,
    fallsLevel: 'MODERATE',
    fallsConfidence: 79,
    fallsTrend: generateTrend(51, 'stable'),
    hapiRisk: 38,
    hapiLevel: 'MODERATE',
    hapiConfidence: 84,
    cautiRisk: 18,
    cautiLevel: 'LOW',
    cautiConfidence: 93,
    lastUpdated: '06:15',
    vitals: { heartRate: 76, bp: '118/74', o2Sat: '98%', temp: '36.8°C' },
    interventions: [
      { action: 'Continue fall precautions', priority: 'routine', category: 'FALLS' },
      { action: 'Complete skin assessment', priority: 'routine', category: 'HAPI' },
    ],
  },
  {
    id: 'Patient 4C-bed22',
    unit: '4C',
    bed: '22',
    fallsRisk: 24,
    fallsLevel: 'LOW',
    fallsConfidence: 92,
    fallsTrend: generateTrend(24, 'down'),
    hapiRisk: 22,
    hapiLevel: 'LOW',
    hapiConfidence: 88,
    cautiRisk: 12,
    cautiLevel: 'LOW',
    cautiConfidence: 95,
    lastUpdated: '05:45',
    vitals: { heartRate: 72, bp: '122/78', o2Sat: '99%', temp: '36.6°C' },
    interventions: [
      { action: 'Standard monitoring', priority: 'monitor', category: 'FALLS' },
    ],
  },
  {
    id: 'Patient 4C-bed03',
    unit: '4C',
    bed: '03',
    fallsRisk: 72,
    fallsLevel: 'HIGH',
    fallsConfidence: 84,
    fallsTrend: generateTrend(72, 'up'),
    hapiRisk: 61,
    hapiLevel: 'MODERATE',
    hapiConfidence: 78,
    cautiRisk: 45,
    cautiLevel: 'MODERATE',
    cautiConfidence: 81,
    lastUpdated: '05:30',
    vitals: { heartRate: 92, bp: '138/88', o2Sat: '95%', temp: '37.4°C' },
    interventions: [
      { action: 'Implement 1:1 supervision', priority: 'immediate', category: 'FALLS' },
      { action: 'Reposition patient q2h', priority: 'immediate', category: 'HAPI' },
      { action: 'Evaluate catheter necessity', priority: 'routine', category: 'CAUTI' },
    ],
  },
  {
    id: 'Patient 4C-bed08',
    unit: '4C',
    bed: '08',
    fallsRisk: 44,
    fallsLevel: 'MODERATE',
    fallsConfidence: 76,
    fallsTrend: generateTrend(44, 'stable'),
    hapiRisk: 28,
    hapiLevel: 'LOW',
    hapiConfidence: 89,
    cautiRisk: 15,
    cautiLevel: 'LOW',
    cautiConfidence: 94,
    lastUpdated: '06:30',
    vitals: { heartRate: 68, bp: '116/72', o2Sat: '98%', temp: '36.7°C' },
    interventions: [
      { action: 'Maintain current precautions', priority: 'routine', category: 'FALLS' },
    ],
  },
  {
    id: 'Patient 4C-bed11',
    unit: '4C',
    bed: '11',
    fallsRisk: 58,
    fallsLevel: 'MODERATE',
    fallsConfidence: 81,
    fallsTrend: generateTrend(58, 'up'),
    hapiRisk: 52,
    hapiLevel: 'MODERATE',
    hapiConfidence: 77,
    cautiRisk: 28,
    cautiLevel: 'LOW',
    cautiConfidence: 86,
    lastUpdated: '06:00',
    vitals: { heartRate: 84, bp: '128/84', o2Sat: '96%', temp: '37.0°C' },
    interventions: [
      { action: 'Verify non-slip footwear', priority: 'routine', category: 'FALLS' },
      { action: 'Apply pressure-relief surface', priority: 'routine', category: 'HAPI' },
    ],
  },
  {
    id: 'Patient 4C-bed17',
    unit: '4C',
    bed: '17',
    fallsRisk: 31,
    fallsLevel: 'LOW',
    fallsConfidence: 88,
    fallsTrend: generateTrend(31, 'down'),
    hapiRisk: 19,
    hapiLevel: 'LOW',
    hapiConfidence: 91,
    cautiRisk: 8,
    cautiLevel: 'LOW',
    cautiConfidence: 96,
    lastUpdated: '05:15',
    vitals: { heartRate: 70, bp: '120/76', o2Sat: '99%', temp: '36.5°C' },
    interventions: [
      { action: 'Continue standard care', priority: 'monitor', category: 'FALLS' },
    ],
  },
  {
    id: 'Patient 4C-bed19',
    unit: '4C',
    bed: '19',
    fallsRisk: 76,
    fallsLevel: 'HIGH',
    fallsConfidence: 89,
    fallsTrend: generateTrend(76, 'up'),
    hapiRisk: 55,
    hapiLevel: 'MODERATE',
    hapiConfidence: 80,
    cautiRisk: 62,
    cautiLevel: 'MODERATE',
    cautiConfidence: 75,
    lastUpdated: '06:45',
    vitals: { heartRate: 96, bp: '142/90', o2Sat: '94%', temp: '37.6°C' },
    interventions: [
      { action: 'Initiate fall bundle protocol', priority: 'immediate', category: 'FALLS' },
      { action: 'Consult wound care team', priority: 'routine', category: 'HAPI' },
      { action: 'Discuss catheter removal', priority: 'immediate', category: 'CAUTI' },
    ],
  },
  {
    id: 'Patient 4C-bed24',
    unit: '4C',
    bed: '24',
    fallsRisk: 39,
    fallsLevel: 'MODERATE',
    fallsConfidence: 83,
    fallsTrend: generateTrend(39, 'stable'),
    hapiRisk: 34,
    hapiLevel: 'LOW',
    hapiConfidence: 85,
    cautiRisk: 21,
    cautiLevel: 'LOW',
    cautiConfidence: 90,
    lastUpdated: '05:50',
    vitals: { heartRate: 74, bp: '124/80', o2Sat: '97%', temp: '36.8°C' },
    interventions: [
      { action: 'Review medication list', priority: 'routine', category: 'FALLS' },
    ],
  },
  {
    id: 'Patient 4C-bed27',
    unit: '4C',
    bed: '27',
    fallsRisk: 18,
    fallsLevel: 'LOW',
    fallsConfidence: 94,
    fallsTrend: generateTrend(18, 'down'),
    hapiRisk: 14,
    hapiLevel: 'LOW',
    hapiConfidence: 93,
    cautiRisk: 6,
    cautiLevel: 'LOW',
    cautiConfidence: 97,
    lastUpdated: '06:20',
    vitals: { heartRate: 66, bp: '118/74', o2Sat: '99%', temp: '36.4°C' },
    interventions: [
      { action: 'Routine ambulation encouraged', priority: 'monitor', category: 'FALLS' },
    ],
  },
];

// SHAP Waterfall Data
export const shapFactors: ShapFactor[] = [
  { factor: 'Base Risk', contribution: 15, cumulative: 15, type: 'base' },
  { factor: 'Sedation', contribution: 32, cumulative: 47, type: 'risk' },
  { factor: 'Mobility', contribution: 28, cumulative: 75, type: 'risk' },
  { factor: 'Bed Alarm', contribution: -15, cumulative: 60, type: 'protective' },
];

// Clinical Workflow Stages
export const workflowStages: WorkflowStage[] = [
  {
    id: 'alert',
    label: 'ALERT',
    items: [
      { label: 'Risk Escalation Detected', completed: true },
    ],
  },
  {
    id: 'assessment',
    label: 'ASSESSMENT',
    items: [
      { label: 'Mobility assessment completed', completed: true },
      { label: 'Alert status verified', completed: true },
      { label: 'Bed alarm checked', completed: true },
    ],
  },
  {
    id: 'action',
    label: 'ACTION',
    items: [
      { label: 'Bed alarm activated', completed: true },
      { label: 'Fall precautions implemented', completed: true },
      { label: 'Increased monitoring frequency', completed: true },
    ],
  },
];

// Utility functions
export const getRiskLevelColor = (level: RiskLevel): string => {
  switch (level) {
    case 'HIGH':
      return 'text-risk-high';
    case 'MODERATE':
      return 'text-risk-medium';
    case 'LOW':
      return 'text-risk-low';
  }
};

export const getRiskLevelBg = (level: RiskLevel): string => {
  switch (level) {
    case 'HIGH':
      return 'bg-risk-high';
    case 'MODERATE':
      return 'bg-risk-medium';
    case 'LOW':
      return 'bg-risk-low';
  }
};

export const getRiskLevelBorder = (level: RiskLevel): string => {
  switch (level) {
    case 'HIGH':
      return 'border-risk-high';
    case 'MODERATE':
      return 'border-risk-medium';
    case 'LOW':
      return 'border-risk-low';
  }
};

export const getPriorityColor = (priority: SuggestedIntervention['priority']): string => {
  switch (priority) {
    case 'immediate':
      return 'text-risk-high bg-risk-high/10 border-risk-high/30';
    case 'routine':
      return 'text-primary bg-primary/10 border-primary/30';
    case 'monitor':
      return 'text-muted-foreground bg-muted/20 border-border/30';
  }
};
