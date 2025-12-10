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
  mrn: string;
  age: number;
  sex: 'M' | 'F';
  unit: string;
  bed: string;
  admitDate: string;
  los: number;
  diagnosis: string;
  assignedNurse: string;
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
  lastAssessed: string;
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
    score: 58,
    level: 'MODERATE',
    trend: 'up',
    confidence: 84,
    factors: [
      { label: 'Extended catheter duration', value: '>5 days avg', impact: 'negative' },
      { label: 'High-risk patient (Bed 05)', value: '78% CAUTI risk', impact: 'negative' },
      { label: 'Daily necessity reviews', value: '85% compliant', impact: 'positive' },
    ],
  },
];

// Sample Patients for Patient List View (expanded to 11 with high-risk CAUTI)
export const patients: PatientData[] = [
  {
    id: 'Patient 4C-bed05',
    mrn: '762918',
    age: 76,
    sex: 'M',
    unit: '4C',
    bed: '05',
    admitDate: '11/22',
    los: 8,
    diagnosis: 'Neurogenic Bladder - Spinal Injury',
    assignedNurse: 'RN Martinez',
    fallsRisk: 42,
    fallsLevel: 'MODERATE',
    fallsConfidence: 79,
    fallsTrend: generateTrend(42, 'stable'),
    hapiRisk: 48,
    hapiLevel: 'MODERATE',
    hapiConfidence: 81,
    cautiRisk: 78,
    cautiLevel: 'HIGH',
    cautiConfidence: 86,
    lastAssessed: '06:00',
    lastUpdated: '06:15',
    vitals: { heartRate: 94, bp: '128/84', o2Sat: '96%', temp: '38.2°C' },
    interventions: [
      { action: 'Urgent: Evaluate catheter removal', priority: 'immediate', category: 'CAUTI' },
      { action: 'Obtain UA and urine culture STAT', priority: 'immediate', category: 'CAUTI' },
      { action: 'Review alternative voiding methods', priority: 'routine', category: 'CAUTI' },
      { action: 'Maintain repositioning schedule', priority: 'routine', category: 'HAPI' },
    ],
  },
  {
    id: 'Patient 4C-bed06',
    mrn: '849201',
    age: 78,
    sex: 'F',
    unit: '4C',
    bed: '06',
    admitDate: '11/28',
    los: 2,
    diagnosis: 'CHF Exacerbation',
    assignedNurse: 'RN Martinez',
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
    lastAssessed: '05:45',
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
    mrn: '736482',
    age: 65,
    sex: 'M',
    unit: '4C',
    bed: '14',
    admitDate: '11/27',
    los: 3,
    diagnosis: 'Post-Op Hip Replacement',
    assignedNurse: 'RN Thompson',
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
    lastAssessed: '06:00',
    lastUpdated: '06:15',
    vitals: { heartRate: 76, bp: '118/74', o2Sat: '98%', temp: '36.8°C' },
    interventions: [
      { action: 'Continue fall precautions', priority: 'routine', category: 'FALLS' },
      { action: 'Complete skin assessment', priority: 'routine', category: 'HAPI' },
    ],
  },
  {
    id: 'Patient 4C-bed22',
    mrn: '582914',
    age: 52,
    sex: 'F',
    unit: '4C',
    bed: '22',
    admitDate: '11/29',
    los: 1,
    diagnosis: 'Pneumonia',
    assignedNurse: 'RN Chen',
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
    lastAssessed: '05:30',
    lastUpdated: '05:45',
    vitals: { heartRate: 72, bp: '122/78', o2Sat: '99%', temp: '36.6°C' },
    interventions: [
      { action: 'Standard monitoring', priority: 'monitor', category: 'FALLS' },
    ],
  },
  {
    id: 'Patient 4C-bed03',
    mrn: '921847',
    age: 84,
    sex: 'M',
    unit: '4C',
    bed: '03',
    admitDate: '11/25',
    los: 5,
    diagnosis: 'Acute Stroke',
    assignedNurse: 'RN Martinez',
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
    lastAssessed: '05:15',
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
    mrn: '374629',
    age: 71,
    sex: 'F',
    unit: '4C',
    bed: '08',
    admitDate: '11/28',
    los: 2,
    diagnosis: 'COPD Exacerbation',
    assignedNurse: 'RN Thompson',
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
    lastAssessed: '06:15',
    lastUpdated: '06:30',
    vitals: { heartRate: 68, bp: '116/72', o2Sat: '98%', temp: '36.7°C' },
    interventions: [
      { action: 'Maintain current precautions', priority: 'routine', category: 'FALLS' },
    ],
  },
  {
    id: 'Patient 4C-bed11',
    mrn: '648291',
    age: 68,
    sex: 'M',
    unit: '4C',
    bed: '11',
    admitDate: '11/26',
    los: 4,
    diagnosis: 'Diabetic Ketoacidosis',
    assignedNurse: 'RN Chen',
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
    lastAssessed: '05:45',
    lastUpdated: '06:00',
    vitals: { heartRate: 84, bp: '128/84', o2Sat: '96%', temp: '37.0°C' },
    interventions: [
      { action: 'Verify non-slip footwear', priority: 'routine', category: 'FALLS' },
      { action: 'Apply pressure-relief surface', priority: 'routine', category: 'HAPI' },
    ],
  },
  {
    id: 'Patient 4C-bed17',
    mrn: '193847',
    age: 45,
    sex: 'F',
    unit: '4C',
    bed: '17',
    admitDate: '11/29',
    los: 1,
    diagnosis: 'Chest Pain Observation',
    assignedNurse: 'RN Davis',
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
    lastAssessed: '05:00',
    lastUpdated: '05:15',
    vitals: { heartRate: 70, bp: '120/76', o2Sat: '99%', temp: '36.5°C' },
    interventions: [
      { action: 'Continue standard care', priority: 'monitor', category: 'FALLS' },
    ],
  },
  {
    id: 'Patient 4C-bed19',
    mrn: '847261',
    age: 82,
    sex: 'M',
    unit: '4C',
    bed: '19',
    admitDate: '11/24',
    los: 6,
    diagnosis: 'Sepsis',
    assignedNurse: 'RN Martinez',
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
    lastAssessed: '06:30',
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
    mrn: '529184',
    age: 59,
    sex: 'F',
    unit: '4C',
    bed: '24',
    admitDate: '11/27',
    los: 3,
    diagnosis: 'GI Bleed',
    assignedNurse: 'RN Davis',
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
    lastAssessed: '05:30',
    lastUpdated: '05:50',
    vitals: { heartRate: 74, bp: '124/80', o2Sat: '97%', temp: '36.8°C' },
    interventions: [
      { action: 'Review medication list', priority: 'routine', category: 'FALLS' },
    ],
  },
  {
    id: 'Patient 4C-bed27',
    mrn: '418726',
    age: 38,
    sex: 'M',
    unit: '4C',
    bed: '27',
    admitDate: '11/29',
    los: 1,
    diagnosis: 'Appendectomy Recovery',
    assignedNurse: 'RN Chen',
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
    lastAssessed: '06:00',
    lastUpdated: '06:20',
    vitals: { heartRate: 66, bp: '118/74', o2Sat: '99%', temp: '36.4°C' },
    interventions: [
      { action: 'Routine ambulation encouraged', priority: 'monitor', category: 'FALLS' },
    ],
  },
];

// SHAP Waterfall Data - Falls
export const shapFactorsFalls: ShapFactor[] = [
  { factor: 'Base Risk', contribution: 15, cumulative: 15, type: 'base' },
  { factor: 'Sedation', contribution: 32, cumulative: 47, type: 'risk' },
  { factor: 'Mobility', contribution: 28, cumulative: 75, type: 'risk' },
  { factor: 'Bed Alarm', contribution: -15, cumulative: 60, type: 'protective' },
];

// SHAP Waterfall Data - HAPI (Pressure Injury)
export const shapFactorsHAPI: ShapFactor[] = [
  { factor: 'Base Risk', contribution: 12, cumulative: 12, type: 'base' },
  { factor: 'Braden Score', contribution: 25, cumulative: 37, type: 'risk' },
  { factor: 'Immobility', contribution: 22, cumulative: 59, type: 'risk' },
  { factor: 'Malnutrition', contribution: 18, cumulative: 77, type: 'risk' },
  { factor: 'Turn Protocol', contribution: -12, cumulative: 65, type: 'protective' },
  { factor: 'Specialty Bed', contribution: -10, cumulative: 55, type: 'protective' },
];

// SHAP Waterfall Data - CAUTI (Catheter-Associated UTI)
export const shapFactorsCAUTI: ShapFactor[] = [
  { factor: 'Base Risk', contribution: 8, cumulative: 8, type: 'base' },
  { factor: 'Catheter Days (>7)', contribution: 35, cumulative: 43, type: 'risk' },
  { factor: 'Fever (38.2°C)', contribution: 22, cumulative: 65, type: 'risk' },
  { factor: 'Cloudy Urine', contribution: 18, cumulative: 83, type: 'risk' },
  { factor: 'Immunocompromised', contribution: 12, cumulative: 95, type: 'risk' },
  { factor: 'Bundle Compliance', contribution: -10, cumulative: 85, type: 'protective' },
  { factor: 'Daily Review', contribution: -7, cumulative: 78, type: 'protective' },
];

// Legacy export for backwards compatibility
export const shapFactors = shapFactorsFalls;

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
