// Types for Nurse-Sensitive Outcomes Dashboard
export type RiskLevel = 'HIGH' | 'MODERATE' | 'LOW';
export type RiskCategory = 'FALLS' | 'HAPI' | 'CAUTI';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface ContributingFactor {
  label: string;
  value: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface RiskCategoryData {
  category: RiskCategory;
  label: string;
  score: number;
  level: RiskLevel;
  trend: TrendDirection;
  factors: ContributingFactor[];
}

export interface PatientData {
  id: string;
  unit: string;
  bed: string;
  fallsRisk: number;
  fallsLevel: RiskLevel;
  hapiRisk: number;
  hapiLevel: RiskLevel;
  cautiRisk: number;
  cautiLevel: RiskLevel;
  lastUpdated: string;
  vitals: {
    heartRate: number;
    bp: string;
    o2Sat: string;
    temp: string;
  };
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

// Sample Risk Categories for Dashboard Overview
export const riskCategories: RiskCategoryData[] = [
  {
    category: 'FALLS',
    label: 'Falls Risk',
    score: 68,
    level: 'HIGH',
    trend: 'up',
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
    factors: [
      { label: 'Catheter days', value: '2 days', impact: 'neutral' },
      { label: 'Assessment compliance', value: '100% documented', impact: 'positive' },
      { label: 'Alternative voiding', value: 'Evaluated', impact: 'positive' },
    ],
  },
];

// Sample Patients for Patient List View
export const patients: PatientData[] = [
  {
    id: 'Patient 4C-bed06',
    unit: '4C',
    bed: '06',
    fallsRisk: 68,
    fallsLevel: 'HIGH',
    hapiRisk: 45,
    hapiLevel: 'MODERATE',
    cautiRisk: 32,
    cautiLevel: 'LOW',
    lastUpdated: '06:00',
    vitals: { heartRate: 88, bp: '124/82', o2Sat: '97%', temp: '37.1°C' },
  },
  {
    id: 'Patient 4C-bed14',
    unit: '4C',
    bed: '14',
    fallsRisk: 51,
    fallsLevel: 'MODERATE',
    hapiRisk: 38,
    hapiLevel: 'MODERATE',
    cautiRisk: 18,
    cautiLevel: 'LOW',
    lastUpdated: '06:15',
    vitals: { heartRate: 76, bp: '118/74', o2Sat: '98%', temp: '36.8°C' },
  },
  {
    id: 'Patient 4C-bed22',
    unit: '4C',
    bed: '22',
    fallsRisk: 24,
    fallsLevel: 'LOW',
    hapiRisk: 22,
    hapiLevel: 'LOW',
    cautiRisk: 12,
    cautiLevel: 'LOW',
    lastUpdated: '05:45',
    vitals: { heartRate: 72, bp: '122/78', o2Sat: '99%', temp: '36.6°C' },
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
