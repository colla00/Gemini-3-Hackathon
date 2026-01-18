// Patient domain types - centralized for reuse across components

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type RiskType = 'Falls' | 'Pressure Injury' | 'Device Complication' | 'CAUTI';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface Intervention {
  date: string;
  type: string;
  description: string;
  outcome?: string;
}

export interface Vital {
  name: string;
  value: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface RiskFactor {
  name: string;
  icon: string;
  contribution: number;
}

export interface NursingOutcome {
  metric: string;
  baseline: number;
  current: number;
  target: number;
  unit: string;
}

export interface Patient {
  id: string;
  riskLevel: RiskLevel;
  riskScore: number;
  riskType: RiskType;
  trend: TrendDirection;
  lastUpdated: string;
  lastUpdatedMinutes: number;
  ageRange: string;
  admissionDate: string;
  riskFactors: RiskFactor[];
  clinicalNotes: string;
  isDemo?: boolean;
  riskSummary: string;
  room?: string;
  diagnosis?: string;
  interventions?: Intervention[];
  vitals?: Vital[];
  nursingOutcomes?: NursingOutcome[];
}
