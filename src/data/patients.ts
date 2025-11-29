export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type RiskType = 'Falls' | 'Pressure Injury' | 'Device Complication';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface RiskFactor {
  name: string;
  icon: string;
  contribution: number;
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
}

export const patients: Patient[] = [
  {
    id: 'Patient A01',
    riskLevel: 'HIGH',
    riskScore: 72,
    riskType: 'Falls',
    trend: 'up',
    lastUpdated: '~2h',
    lastUpdatedMinutes: 2,
    ageRange: '65-70',
    admissionDate: 'Day 3',
    isDemo: true,
    riskSummary: 'Sedation 4h ago + mobility deficits → ↑ fall risk',
    riskFactors: [
      { name: 'Recent sedation administration', icon: '💊', contribution: 0.32 },
      { name: 'Mobility limitations present', icon: '🚶', contribution: 0.28 },
      { name: 'Previous fall history documented', icon: '📋', contribution: 0.10 },
      { name: 'Advanced age (>65)', icon: '👤', contribution: 0.12 },
      { name: 'Bed alarm system active', icon: '🔔', contribution: -0.08 },
    ],
    clinicalNotes: 'Post-op Day 3. Received opioid analgesia ~4h ago. PT assessment shows significant mobility deficits. History of prior falls documented. Call light within reach, bed alarm active.',
  },
  {
    id: 'Patient B02',
    riskLevel: 'MEDIUM',
    riskScore: 48,
    riskType: 'Pressure Injury',
    trend: 'down',
    lastUpdated: '~15h',
    lastUpdatedMinutes: 15,
    ageRange: '70-74',
    admissionDate: 'Day 5',
    isDemo: true,
    riskSummary: 'Extended bed rest + early stage I sacral area noted',
    riskFactors: [
      { name: 'Extended bed rest duration', icon: '🛏️', contribution: 0.25 },
      { name: 'Advanced age (>65)', icon: '👤', contribution: 0.15 },
      { name: 'Regular repositioning protocol', icon: '🔄', contribution: -0.12 },
      { name: 'Bed alarm system active', icon: '🔔', contribution: -0.10 },
    ],
    clinicalNotes: 'Orthopedic surgery patient. Limited mobility due to hip precautions. Repositioning q2h documented. Braden score 16. Early stage I pressure area noted on sacrum.',
  },
  {
    id: 'Patient C03',
    riskLevel: 'LOW',
    riskScore: 18,
    riskType: 'Device Complication',
    trend: 'down',
    lastUpdated: '~8h',
    lastUpdatedMinutes: 8,
    ageRange: '52-56',
    admissionDate: 'Day 2',
    isDemo: true,
    riskSummary: 'Good awareness + ambulating independently',
    riskFactors: [
      { name: 'High call light usage', icon: '📞', contribution: -0.20 },
      { name: 'Good mobility status', icon: '🚶', contribution: -0.12 },
      { name: 'Age factor (<65)', icon: '👤', contribution: -0.08 },
    ],
    clinicalNotes: 'Day 2 post-laparoscopic procedure. Ambulating independently. High call light usage indicates good awareness. IV site clean, no infiltration signs. Expected discharge soon.',
  },
  {
    id: 'Patient D04',
    riskLevel: 'HIGH',
    riskScore: 68,
    riskType: 'Falls',
    trend: 'up',
    lastUpdated: '~5h',
    lastUpdatedMinutes: 5,
    ageRange: '74-78',
    admissionDate: 'Day 4',
    riskSummary: 'Post-procedure sedation + advanced age → elevated risk',
    riskFactors: [
      { name: 'Recent sedation administration', icon: '💊', contribution: 0.28 },
      { name: 'Advanced age (>65)', icon: '👤', contribution: 0.18 },
      { name: 'Mobility limitations present', icon: '🚶', contribution: 0.22 },
      { name: 'High call light usage', icon: '📞', contribution: -0.10 },
    ],
    clinicalNotes: 'Patient with history of hypertension. Sedation given for procedure earlier. Requires assistance with ambulation. Alert and oriented but unsteady gait observed.',
  },
  {
    id: 'Patient E05',
    riskLevel: 'MEDIUM',
    riskScore: 52,
    riskType: 'Pressure Injury',
    trend: 'stable',
    lastUpdated: '~22h',
    lastUpdatedMinutes: 22,
    ageRange: '68-72',
    admissionDate: 'Day 7',
    riskSummary: 'Long-term immobility + extended admission duration',
    riskFactors: [
      { name: 'Mobility limitations present', icon: '🛏️', contribution: 0.28 },
      { name: 'Extended bed rest duration', icon: '⏱️', contribution: 0.18 },
      { name: 'Regular repositioning protocol', icon: '🔄', contribution: -0.08 },
    ],
    clinicalNotes: 'Long-term bed rest patient. Skin integrity maintained with 2-hour turn schedule. Nutrition consult completed. Braden score 14. Heels off-loaded.',
  },
  {
    id: 'Patient F06',
    riskLevel: 'LOW',
    riskScore: 22,
    riskType: 'Device Complication',
    trend: 'down',
    lastUpdated: '~12h',
    lastUpdatedMinutes: 12,
    ageRange: '45-49',
    admissionDate: 'Day 1',
    riskSummary: 'New device placement + clean site assessment',
    riskFactors: [
      { name: 'Patient awareness level', icon: '👁️', contribution: 0.10 },
      { name: 'Short device duration', icon: '⏱️', contribution: -0.15 },
      { name: 'Frequent monitoring protocol', icon: '📊', contribution: -0.08 },
    ],
    clinicalNotes: 'Central line placed recently. Site clean and dry. Patient educated on device care. No signs of infiltration or infection. Dressing intact.',
  },
  {
    id: 'Patient G07',
    riskLevel: 'HIGH',
    riskScore: 75,
    riskType: 'Falls',
    trend: 'up',
    lastUpdated: '~1h',
    lastUpdatedMinutes: 1,
    ageRange: '80-84',
    admissionDate: 'Day 2',
    riskSummary: 'Acute confusion + attempts to ambulate unassisted',
    riskFactors: [
      { name: 'Confusion/Delirium present', icon: '🧠', contribution: 0.35 },
      { name: 'Mobility limitations present', icon: '🚶', contribution: 0.30 },
      { name: 'Recent sedation administration', icon: '💊', contribution: 0.20 },
      { name: 'Bed alarm system active', icon: '🔔', contribution: -0.05 },
    ],
    clinicalNotes: 'Patient with acute confusion. Attempting to get out of bed unassisted. Bed alarm activated. Sitter ordered. Family at bedside when available.',
  },
  {
    id: 'Patient H08',
    riskLevel: 'MEDIUM',
    riskScore: 45,
    riskType: 'Falls',
    trend: 'down',
    lastUpdated: '~18h',
    lastUpdatedMinutes: 18,
    ageRange: '66-70',
    admissionDate: 'Day 3',
    riskSummary: 'Improving with PT intervention + appropriate call light use',
    riskFactors: [
      { name: 'Advanced age (>65)', icon: '👤', contribution: 0.20 },
      { name: 'Mobility limitations present', icon: '🚶', contribution: 0.15 },
      { name: 'High call light usage', icon: '📞', contribution: -0.12 },
      { name: 'Bed alarm system active', icon: '🔔', contribution: -0.08 },
    ],
    clinicalNotes: 'Post-operative Day 2. Physical therapy initiated. Using call light appropriately. Steady improvement noted. Ambulating with assistance x2.',
  },
  {
    id: 'Patient J09',
    riskLevel: 'LOW',
    riskScore: 15,
    riskType: 'Pressure Injury',
    trend: 'down',
    lastUpdated: '~25h',
    lastUpdatedMinutes: 25,
    ageRange: '58-62',
    admissionDate: 'Day 4',
    riskSummary: 'Ambulatory + independent with ADLs',
    riskFactors: [
      { name: 'Good mobility status', icon: '🚶', contribution: -0.18 },
      { name: 'Regular repositioning protocol', icon: '🔄', contribution: -0.12 },
      { name: 'High patient awareness', icon: '👁️', contribution: -0.10 },
    ],
    clinicalNotes: 'Patient ambulatory and independent. No pressure areas identified. Braden score 21. Discharge planning initiated.',
  },
  {
    id: 'Patient K10',
    riskLevel: 'MEDIUM',
    riskScore: 50,
    riskType: 'Device Complication',
    trend: 'stable',
    lastUpdated: '~10h',
    lastUpdatedMinutes: 10,
    ageRange: '62-66',
    admissionDate: 'Day 6',
    riskSummary: 'Extended device duration + mild site redness observed',
    riskFactors: [
      { name: 'Extended device duration', icon: '⏱️', contribution: 0.22 },
      { name: 'Site assessment findings', icon: '👁️', contribution: 0.15 },
      { name: 'Frequent monitoring protocol', icon: '📊', contribution: -0.10 },
    ],
    clinicalNotes: 'PICC line Day 6. Site shows mild redness - monitoring closely. Blood cultures pending. Daily necessity review documented.',
  },
];

export const getRiskLevelColor = (level: RiskLevel): string => {
  switch (level) {
    case 'HIGH':
      return 'risk-high';
    case 'MEDIUM':
      return 'risk-medium';
    case 'LOW':
      return 'risk-low';
  }
};

export const getRiskLevelTextColor = (level: RiskLevel): string => {
  switch (level) {
    case 'HIGH':
      return 'text-risk-high';
    case 'MEDIUM':
      return 'text-risk-medium';
    case 'LOW':
      return 'text-risk-low';
  }
};

export const getRiskLevelLabel = (level: RiskLevel, riskType: RiskType): string => {
  switch (level) {
    case 'HIGH':
      return `Elevated ${riskType} Risk`;
    case 'MEDIUM':
      return 'Moderate Risk - Monitor Closely';
    case 'LOW':
      return 'Low Risk - Standard Monitoring';
  }
};

export const formatRelativeTime = (minutes: number): string => {
  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '~1h';
  if (minutes < 60) return `~${minutes}h`;
  if (minutes < 120) return '~1h';
  return `~${Math.floor(minutes / 60)}h`;
};
