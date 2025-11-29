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
    id: 'PT-2847',
    riskLevel: 'HIGH',
    riskScore: 72,
    riskType: 'Falls',
    trend: 'up',
    lastUpdated: '2 min ago',
    lastUpdatedMinutes: 2,
    ageRange: '65-70',
    admissionDate: '3 days ago',
    isDemo: true,
    riskSummary: 'Sedation 4h ago + mobility deficits → ↑ fall risk',
    riskFactors: [
      { name: 'Recent sedation administration', icon: '💊', contribution: 0.32 },
      { name: 'Mobility limitations present', icon: '🚶', contribution: 0.28 },
      { name: 'Previous fall history documented', icon: '📋', contribution: 0.10 },
      { name: 'Advanced age (>65)', icon: '👤', contribution: 0.12 },
      { name: 'Bed alarm system active', icon: '🔔', contribution: -0.08 },
    ],
    clinicalNotes: 'Post-op day 3. Received opioid analgesia 4 hours ago. PT assessment shows significant mobility deficits. History of 2 falls in past year. Call light within reach, bed alarm active.',
  },
  {
    id: 'PT-1923',
    riskLevel: 'MEDIUM',
    riskScore: 48,
    riskType: 'Pressure Injury',
    trend: 'down',
    lastUpdated: '15 min ago',
    lastUpdatedMinutes: 15,
    ageRange: '70-74',
    admissionDate: '5 days ago',
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
    id: 'PT-5612',
    riskLevel: 'LOW',
    riskScore: 18,
    riskType: 'Device Complication',
    trend: 'down',
    lastUpdated: '8 min ago',
    lastUpdatedMinutes: 8,
    ageRange: '52-56',
    admissionDate: '2 days ago',
    isDemo: true,
    riskSummary: 'Good awareness + ambulating independently',
    riskFactors: [
      { name: 'High call light usage', icon: '📞', contribution: -0.20 },
      { name: 'Good mobility status', icon: '🚶', contribution: -0.12 },
      { name: 'Age factor (<65)', icon: '👤', contribution: -0.08 },
    ],
    clinicalNotes: 'Day 2 post-laparoscopic procedure. Ambulating independently. High call light usage indicates good awareness. IV site clean, no infiltration signs. Expected discharge tomorrow.',
  },
  {
    id: 'PT-3391',
    riskLevel: 'HIGH',
    riskScore: 68,
    riskType: 'Falls',
    trend: 'up',
    lastUpdated: '5 min ago',
    lastUpdatedMinutes: 5,
    ageRange: '74-78',
    admissionDate: '4 days ago',
    riskSummary: 'Post-procedure sedation + advanced age → elevated risk',
    riskFactors: [
      { name: 'Recent sedation administration', icon: '💊', contribution: 0.28 },
      { name: 'Advanced age (>65)', icon: '👤', contribution: 0.18 },
      { name: 'Mobility limitations present', icon: '🚶', contribution: 0.22 },
      { name: 'High call light usage', icon: '📞', contribution: -0.10 },
    ],
    clinicalNotes: 'Patient with history of hypertension. Sedation given for procedure this morning. Requires assistance with ambulation. Alert and oriented but unsteady gait observed.',
  },
  {
    id: 'PT-7845',
    riskLevel: 'MEDIUM',
    riskScore: 52,
    riskType: 'Pressure Injury',
    trend: 'stable',
    lastUpdated: '22 min ago',
    lastUpdatedMinutes: 22,
    ageRange: '68-72',
    admissionDate: '7 days ago',
    riskSummary: 'Long-term immobility + extended admission duration',
    riskFactors: [
      { name: 'Mobility limitations present', icon: '🛏️', contribution: 0.28 },
      { name: 'Extended bed rest duration', icon: '⏱️', contribution: 0.18 },
      { name: 'Regular repositioning protocol', icon: '🔄', contribution: -0.08 },
    ],
    clinicalNotes: 'Long-term bed rest patient. Skin integrity maintained with 2-hour turn schedule. Nutrition consult completed. Braden score 14. Heels off-loaded.',
  },
  {
    id: 'PT-4521',
    riskLevel: 'LOW',
    riskScore: 22,
    riskType: 'Device Complication',
    trend: 'down',
    lastUpdated: '12 min ago',
    lastUpdatedMinutes: 12,
    ageRange: '45-49',
    admissionDate: '1 day ago',
    riskSummary: 'New device placement + clean site assessment',
    riskFactors: [
      { name: 'Patient awareness level', icon: '👁️', contribution: 0.10 },
      { name: 'Short device duration', icon: '⏱️', contribution: -0.15 },
      { name: 'Frequent monitoring protocol', icon: '📊', contribution: -0.08 },
    ],
    clinicalNotes: 'Central line placed yesterday. Site clean and dry. Patient educated on device care. No signs of infiltration or infection. Dressing intact.',
  },
  {
    id: 'PT-9034',
    riskLevel: 'HIGH',
    riskScore: 75,
    riskType: 'Falls',
    trend: 'up',
    lastUpdated: '1 min ago',
    lastUpdatedMinutes: 1,
    ageRange: '80-84',
    admissionDate: '2 days ago',
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
    id: 'PT-2156',
    riskLevel: 'MEDIUM',
    riskScore: 45,
    riskType: 'Falls',
    trend: 'down',
    lastUpdated: '18 min ago',
    lastUpdatedMinutes: 18,
    ageRange: '66-70',
    admissionDate: '3 days ago',
    riskSummary: 'Improving with PT intervention + appropriate call light use',
    riskFactors: [
      { name: 'Advanced age (>65)', icon: '👤', contribution: 0.20 },
      { name: 'Mobility limitations present', icon: '🚶', contribution: 0.15 },
      { name: 'High call light usage', icon: '📞', contribution: -0.12 },
      { name: 'Bed alarm system active', icon: '🔔', contribution: -0.08 },
    ],
    clinicalNotes: 'Post-operative day 2. Physical therapy initiated. Using call light appropriately. Steady improvement noted. Ambulating with assistance x2.',
  },
  {
    id: 'PT-6783',
    riskLevel: 'LOW',
    riskScore: 15,
    riskType: 'Pressure Injury',
    trend: 'down',
    lastUpdated: '25 min ago',
    lastUpdatedMinutes: 25,
    ageRange: '58-62',
    admissionDate: '4 days ago',
    riskSummary: 'Ambulatory + independent with ADLs',
    riskFactors: [
      { name: 'Good mobility status', icon: '🚶', contribution: -0.18 },
      { name: 'Regular repositioning protocol', icon: '🔄', contribution: -0.12 },
      { name: 'High patient awareness', icon: '👁️', contribution: -0.10 },
    ],
    clinicalNotes: 'Patient ambulatory and independent. No pressure areas identified. Braden score 21. Discharge planning initiated for tomorrow.',
  },
  {
    id: 'PT-8429',
    riskLevel: 'MEDIUM',
    riskScore: 50,
    riskType: 'Device Complication',
    trend: 'stable',
    lastUpdated: '10 min ago',
    lastUpdatedMinutes: 10,
    ageRange: '62-66',
    admissionDate: '6 days ago',
    riskSummary: 'Extended device duration + mild site redness observed',
    riskFactors: [
      { name: 'Extended device duration', icon: '⏱️', contribution: 0.22 },
      { name: 'Site assessment findings', icon: '👁️', contribution: 0.15 },
      { name: 'Frequent monitoring protocol', icon: '📊', contribution: -0.10 },
    ],
    clinicalNotes: 'PICC line day 6. Site shows mild redness - monitoring closely. Blood cultures pending. Daily necessity review documented.',
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
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 120) return '1 hour ago';
  return `${Math.floor(minutes / 60)} hours ago`;
};
