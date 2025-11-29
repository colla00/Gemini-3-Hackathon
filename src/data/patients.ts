export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type RiskType = 'Falls' | 'Pressure Injury' | 'Device Complication';
export type TrendDirection = 'up' | 'down';

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
  ageRange: string;
  admissionDate: string;
  riskFactors: RiskFactor[];
  clinicalNotes: string;
}

export const patients: Patient[] = [
  {
    id: 'PT-2847',
    riskLevel: 'HIGH',
    riskScore: 72,
    riskType: 'Falls',
    trend: 'up',
    lastUpdated: '45 min ago',
    ageRange: '78-82',
    admissionDate: '2025-01-15',
    riskFactors: [
      { name: 'Recent sedation', icon: '💊', contribution: 0.32 },
      { name: 'Mobility limitations', icon: '🛏️', contribution: 0.28 },
      { name: 'Age >65', icon: '👴', contribution: 0.12 },
      { name: 'Previous fall history', icon: '📋', contribution: 0.10 },
      { name: 'Bed alarm status', icon: '🔔', contribution: -0.15 },
      { name: 'Call light usage', icon: '📞', contribution: -0.10 },
    ],
    clinicalNotes: 'Patient admitted for hip replacement surgery. Post-operative day 2. Received IV sedation for pain management at 0600. Ambulating with PT assistance only. Fall risk precautions in place. Family at bedside during evening hours.',
  },
  {
    id: 'PT-1923',
    riskLevel: 'MEDIUM',
    riskScore: 48,
    riskType: 'Pressure Injury',
    trend: 'down',
    lastUpdated: '2 hours ago',
    ageRange: '68-72',
    admissionDate: '2025-01-12',
    riskFactors: [
      { name: 'Mobility limitations', icon: '🛏️', contribution: 0.25 },
      { name: 'Age >65', icon: '👴', contribution: 0.15 },
      { name: 'Nutritional status', icon: '🍽️', contribution: 0.08 },
      { name: 'Bed alarm status', icon: '🔔', contribution: -0.10 },
      { name: 'Turning schedule adherence', icon: '🔄', contribution: -0.12 },
    ],
    clinicalNotes: 'Patient with limited mobility secondary to stroke. Braden score: 14. Turning every 2 hours per protocol. Pressure-relieving mattress in use. Skin assessment shows intact skin with stage I redness to sacrum - resolving with interventions.',
  },
  {
    id: 'PT-5612',
    riskLevel: 'LOW',
    riskScore: 18,
    riskType: 'Device Complication',
    trend: 'down',
    lastUpdated: '30 min ago',
    ageRange: '45-49',
    admissionDate: '2025-01-18',
    riskFactors: [
      { name: 'Call light usage', icon: '📞', contribution: -0.20 },
      { name: 'Mobility limitations', icon: '🛏️', contribution: -0.12 },
      { name: 'Device type', icon: '⚙️', contribution: 0.05 },
      { name: 'Insertion duration', icon: '⏱️', contribution: 0.03 },
    ],
    clinicalNotes: 'Central line placed 3 days ago. Site clean, dry, intact. No signs of infection. Patient ambulatory and self-caring. Dressing change performed per protocol. Line to be reassessed for removal tomorrow.',
  },
  {
    id: 'PT-3391',
    riskLevel: 'HIGH',
    riskScore: 85,
    riskType: 'Falls',
    trend: 'up',
    lastUpdated: '15 min ago',
    ageRange: '82-86',
    admissionDate: '2025-01-17',
    riskFactors: [
      { name: 'Recent sedation', icon: '💊', contribution: 0.38 },
      { name: 'Previous fall history', icon: '📋', contribution: 0.25 },
      { name: 'Mobility limitations', icon: '🛏️', contribution: 0.22 },
      { name: 'Age >65', icon: '👴', contribution: 0.15 },
      { name: 'Cognitive impairment', icon: '🧠', contribution: 0.10 },
      { name: 'Bed alarm status', icon: '🔔', contribution: -0.08 },
    ],
    clinicalNotes: 'Patient with dementia, admitted for UTI. Attempting to get OOB without assistance. Sitter ordered. Fall in previous admission documented. Current medications include sedatives for agitation. Close monitoring required.',
  },
  {
    id: 'PT-7284',
    riskLevel: 'MEDIUM',
    riskScore: 52,
    riskType: 'Falls',
    trend: 'down',
    lastUpdated: '1 hour ago',
    ageRange: '65-69',
    admissionDate: '2025-01-14',
    riskFactors: [
      { name: 'Mobility limitations', icon: '🛏️', contribution: 0.22 },
      { name: 'Recent sedation', icon: '💊', contribution: 0.18 },
      { name: 'Age >65', icon: '👴', contribution: 0.10 },
      { name: 'Call light usage', icon: '📞', contribution: -0.15 },
      { name: 'PT engagement', icon: '🏃', contribution: -0.12 },
    ],
    clinicalNotes: 'Post-operative day 4 following knee arthroplasty. Progressing well with physical therapy. Sedation weaned. Patient using call light appropriately. Discharge planning initiated for rehab facility.',
  },
  {
    id: 'PT-4456',
    riskLevel: 'LOW',
    riskScore: 22,
    riskType: 'Pressure Injury',
    trend: 'down',
    lastUpdated: '3 hours ago',
    ageRange: '55-59',
    admissionDate: '2025-01-16',
    riskFactors: [
      { name: 'Turning schedule adherence', icon: '🔄', contribution: -0.18 },
      { name: 'Nutritional status', icon: '🍽️', contribution: -0.12 },
      { name: 'Mobility limitations', icon: '🛏️', contribution: 0.08 },
      { name: 'Age >65', icon: '👴', contribution: 0.02 },
    ],
    clinicalNotes: 'Patient recovering from abdominal surgery. Ambulatory with assistance. Good nutritional intake. Braden score: 19. No pressure areas noted. Encouraged to ambulate TID.',
  },
  {
    id: 'PT-8821',
    riskLevel: 'HIGH',
    riskScore: 78,
    riskType: 'Pressure Injury',
    trend: 'up',
    lastUpdated: '20 min ago',
    ageRange: '75-79',
    admissionDate: '2025-01-10',
    riskFactors: [
      { name: 'Mobility limitations', icon: '🛏️', contribution: 0.35 },
      { name: 'Nutritional status', icon: '🍽️', contribution: 0.22 },
      { name: 'Age >65', icon: '👴', contribution: 0.12 },
      { name: 'Incontinence', icon: '💧', contribution: 0.15 },
      { name: 'Turning schedule adherence', icon: '🔄', contribution: -0.10 },
    ],
    clinicalNotes: 'Patient bedbound with advanced COPD. Braden score: 11. Stage II pressure ulcer to coccyx noted yesterday - wound care consulted. NPO for procedure, TPN initiated. Specialty mattress in use. Requires 2-person assist for repositioning.',
  },
  {
    id: 'PT-6093',
    riskLevel: 'MEDIUM',
    riskScore: 41,
    riskType: 'Device Complication',
    trend: 'up',
    lastUpdated: '4 hours ago',
    ageRange: '62-66',
    admissionDate: '2025-01-13',
    riskFactors: [
      { name: 'Device type', icon: '⚙️', contribution: 0.18 },
      { name: 'Insertion duration', icon: '⏱️', contribution: 0.15 },
      { name: 'Immunocompromised', icon: '🛡️', contribution: 0.12 },
      { name: 'Site assessment frequency', icon: '👁️', contribution: -0.08 },
      { name: 'Dressing integrity', icon: '🩹', contribution: -0.06 },
    ],
    clinicalNotes: 'Patient with leukemia, PICC line in place for 12 days. Receiving chemotherapy. Mild erythema noted at insertion site - being monitored closely. Blood cultures pending. Temperature 99.8°F this morning.',
  },
  {
    id: 'PT-2156',
    riskLevel: 'LOW',
    riskScore: 15,
    riskType: 'Falls',
    trend: 'down',
    lastUpdated: '5 hours ago',
    ageRange: '38-42',
    admissionDate: '2025-01-19',
    riskFactors: [
      { name: 'Call light usage', icon: '📞', contribution: -0.22 },
      { name: 'Mobility limitations', icon: '🛏️', contribution: -0.15 },
      { name: 'Age >65', icon: '👴', contribution: -0.08 },
      { name: 'Recent sedation', icon: '💊', contribution: 0.05 },
    ],
    clinicalNotes: 'Young patient admitted for appendectomy. Post-operative day 1. Ambulatory independently. Pain well controlled with oral medications. Anticipated discharge tomorrow.',
  },
  {
    id: 'PT-9547',
    riskLevel: 'MEDIUM',
    riskScore: 55,
    riskType: 'Device Complication',
    trend: 'down',
    lastUpdated: '1.5 hours ago',
    ageRange: '70-74',
    admissionDate: '2025-01-11',
    riskFactors: [
      { name: 'Device type', icon: '⚙️', contribution: 0.20 },
      { name: 'Age >65', icon: '👴', contribution: 0.12 },
      { name: 'Insertion duration', icon: '⏱️', contribution: 0.18 },
      { name: 'Dressing integrity', icon: '🩹', contribution: -0.10 },
      { name: 'Site assessment frequency', icon: '👁️', contribution: -0.15 },
    ],
    clinicalNotes: 'Patient with Foley catheter in place for 8 days. UTI symptoms developed - catheter changed and urine culture obtained. Started on antibiotics. Assessing for catheter removal candidacy.',
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
