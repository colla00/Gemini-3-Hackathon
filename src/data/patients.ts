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
  attendingPhysician?: string;
  nurseAssigned?: string;
  interventions?: Intervention[];
  vitals?: Vital[];
  nursingOutcomes?: {
    metric: string;
    baseline: number;
    current: number;
    target: number;
    unit: string;
  }[];
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
    room: '412A',
    diagnosis: 'Post-operative Hip Replacement',
    attendingPhysician: 'Dr. Martinez',
    nurseAssigned: 'RN Johnson',
    riskSummary: 'Sedation 4h ago + mobility deficits → ↑ fall risk',
    riskFactors: [
      { name: 'Recent sedation administration', icon: '💊', contribution: 0.32 },
      { name: 'Mobility limitations present', icon: '🚶', contribution: 0.28 },
      { name: 'Previous fall history documented', icon: '📋', contribution: 0.10 },
      { name: 'Advanced age (>65)', icon: '👤', contribution: 0.12 },
      { name: 'Bed alarm system active', icon: '🔔', contribution: -0.08 },
    ],
    clinicalNotes: 'Post-op Day 3. Received opioid analgesia ~4h ago. PT assessment shows significant mobility deficits. History of prior falls documented. Call light within reach, bed alarm active.',
    interventions: [
      { date: 'Day 1', type: 'Fall Prevention Protocol', description: 'Initiated fall bundle - bed alarm, non-slip socks, call light education', outcome: 'Ongoing' },
      { date: 'Day 2', type: 'PT Consult', description: 'Physical therapy evaluation ordered', outcome: 'Completed - requires assist x2' },
      { date: 'Day 3', type: 'Pain Management Adjustment', description: 'Switched from IV to PO opioids', outcome: 'In progress' },
    ],
    vitals: [
      { name: 'BP', value: '138/82', status: 'warning' },
      { name: 'HR', value: '78', status: 'normal' },
      { name: 'SpO2', value: '96%', status: 'normal' },
      { name: 'Temp', value: '98.4°F', status: 'normal' },
    ],
    nursingOutcomes: [
      { metric: 'Morse Fall Scale', baseline: 65, current: 55, target: 25, unit: 'points' },
      { metric: 'Pain Score', baseline: 8, current: 5, target: 3, unit: '/10' },
    ],
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
    room: '408B',
    diagnosis: 'Total Knee Arthroplasty',
    attendingPhysician: 'Dr. Chen',
    nurseAssigned: 'RN Williams',
    riskSummary: 'Extended bed rest + early stage I sacral area noted',
    riskFactors: [
      { name: 'Extended bed rest duration', icon: '🛏️', contribution: 0.25 },
      { name: 'Advanced age (>65)', icon: '👤', contribution: 0.15 },
      { name: 'Regular repositioning protocol', icon: '🔄', contribution: -0.12 },
      { name: 'Bed alarm system active', icon: '🔔', contribution: -0.10 },
    ],
    clinicalNotes: 'Orthopedic surgery patient. Limited mobility due to hip precautions. Repositioning q2h documented. Braden score 16. Early stage I pressure area noted on sacrum.',
    interventions: [
      { date: 'Day 3', type: 'Wound Care Consult', description: 'Wound care nurse evaluated sacral area', outcome: 'Stage I identified - preventive measures initiated' },
      { date: 'Day 4', type: 'Specialty Mattress', description: 'Upgraded to pressure-redistribution surface', outcome: 'Implemented' },
      { date: 'Day 5', type: 'Nutrition Consult', description: 'Dietary assessment for wound healing optimization', outcome: 'Protein supplements ordered' },
    ],
    vitals: [
      { name: 'BP', value: '124/76', status: 'normal' },
      { name: 'HR', value: '72', status: 'normal' },
      { name: 'SpO2', value: '97%', status: 'normal' },
      { name: 'Temp', value: '98.6°F', status: 'normal' },
    ],
    nursingOutcomes: [
      { metric: 'Braden Scale', baseline: 14, current: 16, target: 19, unit: 'points' },
      { metric: 'Protein Intake', baseline: 45, current: 62, target: 80, unit: 'g/day' },
    ],
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
    room: '415A',
    diagnosis: 'Laparoscopic Cholecystectomy',
    attendingPhysician: 'Dr. Patel',
    nurseAssigned: 'RN Garcia',
    riskSummary: 'Good awareness + ambulating independently',
    riskFactors: [
      { name: 'High call light usage', icon: '📞', contribution: -0.20 },
      { name: 'Good mobility status', icon: '🚶', contribution: -0.12 },
      { name: 'Age factor (<65)', icon: '👤', contribution: -0.08 },
    ],
    clinicalNotes: 'Day 2 post-laparoscopic procedure. Ambulating independently. High call light usage indicates good awareness. IV site clean, no infiltration signs. Expected discharge soon.',
    interventions: [
      { date: 'Day 1', type: 'Early Mobilization', description: 'Up to chair POD0, ambulating halls POD1', outcome: 'Successful' },
      { date: 'Day 2', type: 'IV Assessment', description: 'Peripheral IV checked for patency and site integrity', outcome: 'Site clean, functioning well' },
    ],
    vitals: [
      { name: 'BP', value: '118/74', status: 'normal' },
      { name: 'HR', value: '68', status: 'normal' },
      { name: 'SpO2', value: '98%', status: 'normal' },
      { name: 'Temp', value: '98.2°F', status: 'normal' },
    ],
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
    room: '420A',
    diagnosis: 'Cardiac Catheterization',
    attendingPhysician: 'Dr. Thompson',
    nurseAssigned: 'RN Davis',
    riskSummary: 'Post-procedure sedation + advanced age → elevated risk',
    riskFactors: [
      { name: 'Recent sedation administration', icon: '💊', contribution: 0.28 },
      { name: 'Advanced age (>65)', icon: '👤', contribution: 0.18 },
      { name: 'Mobility limitations present', icon: '🚶', contribution: 0.22 },
      { name: 'High call light usage', icon: '📞', contribution: -0.10 },
    ],
    clinicalNotes: 'Patient with history of hypertension. Sedation given for procedure earlier. Requires assistance with ambulation. Alert and oriented but unsteady gait observed.',
    interventions: [
      { date: 'Day 2', type: 'Fall Risk Assessment', description: 'Morse Fall Scale completed', outcome: 'Score: 60 - High Risk' },
      { date: 'Day 3', type: 'Bed Alarm Activation', description: 'Continuous bed alarm monitoring initiated', outcome: 'Active' },
      { date: 'Day 4', type: 'Post-Procedure Monitoring', description: 'Hourly neuro checks post-sedation', outcome: 'Ongoing' },
    ],
    vitals: [
      { name: 'BP', value: '142/88', status: 'warning' },
      { name: 'HR', value: '76', status: 'normal' },
      { name: 'SpO2', value: '95%', status: 'normal' },
      { name: 'Temp', value: '98.8°F', status: 'normal' },
    ],
    nursingOutcomes: [
      { metric: 'Morse Fall Scale', baseline: 60, current: 60, target: 25, unit: 'points' },
    ],
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
    room: '405B',
    diagnosis: 'Stroke - Left MCA Territory',
    attendingPhysician: 'Dr. Nguyen',
    nurseAssigned: 'RN Martinez',
    riskSummary: 'Long-term immobility + extended admission duration',
    riskFactors: [
      { name: 'Mobility limitations present', icon: '🛏️', contribution: 0.28 },
      { name: 'Extended bed rest duration', icon: '⏱️', contribution: 0.18 },
      { name: 'Regular repositioning protocol', icon: '🔄', contribution: -0.08 },
    ],
    clinicalNotes: 'Long-term bed rest patient. Skin integrity maintained with 2-hour turn schedule. Nutrition consult completed. Braden score 14. Heels off-loaded.',
    interventions: [
      { date: 'Day 2', type: 'OT/PT Evaluation', description: 'Comprehensive therapy evaluation', outcome: 'Daily PT/OT ordered' },
      { date: 'Day 5', type: 'Heel Protectors', description: 'Prophylactic heel protection applied', outcome: 'No breakdown observed' },
      { date: 'Day 6', type: 'Braden Reassessment', description: 'Weekly Braden scale update', outcome: 'Score improved 14→15' },
    ],
    vitals: [
      { name: 'BP', value: '132/78', status: 'normal' },
      { name: 'HR', value: '74', status: 'normal' },
      { name: 'SpO2', value: '96%', status: 'normal' },
      { name: 'Temp', value: '98.4°F', status: 'normal' },
    ],
    nursingOutcomes: [
      { metric: 'Braden Scale', baseline: 12, current: 15, target: 19, unit: 'points' },
      { metric: 'Turn Compliance', baseline: 75, current: 95, target: 100, unit: '%' },
    ],
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
    room: '418A',
    diagnosis: 'Pneumonia - Community Acquired',
    attendingPhysician: 'Dr. Roberts',
    nurseAssigned: 'RN Anderson',
    riskSummary: 'New device placement + clean site assessment',
    riskFactors: [
      { name: 'Patient awareness level', icon: '👁️', contribution: 0.10 },
      { name: 'Short device duration', icon: '⏱️', contribution: -0.15 },
      { name: 'Frequent monitoring protocol', icon: '📊', contribution: -0.08 },
    ],
    clinicalNotes: 'Central line placed recently. Site clean and dry. Patient educated on device care. No signs of infiltration or infection. Dressing intact.',
    interventions: [
      { date: 'Day 1', type: 'CLABSI Bundle', description: 'Central line insertion bundle completed', outcome: 'All elements documented' },
      { date: 'Day 1', type: 'Daily Line Assessment', description: 'Necessity review initiated', outcome: 'Continue - active IV antibiotics' },
    ],
    vitals: [
      { name: 'BP', value: '122/76', status: 'normal' },
      { name: 'HR', value: '82', status: 'normal' },
      { name: 'SpO2', value: '94%', status: 'warning' },
      { name: 'Temp', value: '99.8°F', status: 'warning' },
    ],
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
    room: '402A',
    diagnosis: 'Acute Delirium - UTI',
    attendingPhysician: 'Dr. Wilson',
    nurseAssigned: 'RN Taylor',
    riskSummary: 'Acute confusion + attempts to ambulate unassisted',
    riskFactors: [
      { name: 'Confusion/Delirium present', icon: '🧠', contribution: 0.35 },
      { name: 'Mobility limitations present', icon: '🚶', contribution: 0.30 },
      { name: 'Recent sedation administration', icon: '💊', contribution: 0.20 },
      { name: 'Bed alarm system active', icon: '🔔', contribution: -0.05 },
    ],
    clinicalNotes: 'Patient with acute confusion. Attempting to get out of bed unassisted. Bed alarm activated. Sitter ordered. Family at bedside when available.',
    interventions: [
      { date: 'Day 1', type: 'CAM Assessment', description: 'Confusion Assessment Method completed', outcome: 'Positive for delirium' },
      { date: 'Day 1', type: 'Sitter Ordered', description: '1:1 continuous observation initiated', outcome: 'Active' },
      { date: 'Day 2', type: 'Delirium Protocol', description: 'Non-pharmacological interventions started', outcome: 'Clock, reorientation, sleep hygiene' },
    ],
    vitals: [
      { name: 'BP', value: '108/62', status: 'warning' },
      { name: 'HR', value: '92', status: 'warning' },
      { name: 'SpO2', value: '95%', status: 'normal' },
      { name: 'Temp', value: '100.2°F', status: 'warning' },
    ],
    nursingOutcomes: [
      { metric: 'CAM Score', baseline: 4, current: 3, target: 0, unit: '/4' },
      { metric: 'Sleep Duration', baseline: 2, current: 4, target: 7, unit: 'hours' },
    ],
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
    room: '410B',
    diagnosis: 'COPD Exacerbation',
    attendingPhysician: 'Dr. Lee',
    nurseAssigned: 'RN Brown',
    riskSummary: 'Improving with PT intervention + appropriate call light use',
    riskFactors: [
      { name: 'Advanced age (>65)', icon: '👤', contribution: 0.20 },
      { name: 'Mobility limitations present', icon: '🚶', contribution: 0.15 },
      { name: 'High call light usage', icon: '📞', contribution: -0.12 },
      { name: 'Bed alarm system active', icon: '🔔', contribution: -0.08 },
    ],
    clinicalNotes: 'Post-operative Day 2. Physical therapy initiated. Using call light appropriately. Steady improvement noted. Ambulating with assistance x2.',
    interventions: [
      { date: 'Day 1', type: 'Respiratory Therapy', description: 'Nebulizer treatments q4h', outcome: 'Improved breath sounds' },
      { date: 'Day 2', type: 'PT Evaluation', description: 'Mobility assessment completed', outcome: 'Progressed to walker' },
      { date: 'Day 3', type: 'Fall Risk Reduction', description: 'Non-slip footwear provided', outcome: 'Patient educated' },
    ],
    vitals: [
      { name: 'BP', value: '128/80', status: 'normal' },
      { name: 'HR', value: '78', status: 'normal' },
      { name: 'SpO2', value: '92%', status: 'warning' },
      { name: 'Temp', value: '98.6°F', status: 'normal' },
    ],
    nursingOutcomes: [
      { metric: 'Morse Fall Scale', baseline: 55, current: 45, target: 25, unit: 'points' },
      { metric: '6-Min Walk Distance', baseline: 150, current: 280, target: 400, unit: 'meters' },
    ],
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
    room: '416A',
    diagnosis: 'Elective Hernia Repair',
    attendingPhysician: 'Dr. Adams',
    nurseAssigned: 'RN Miller',
    riskSummary: 'Ambulatory + independent with ADLs',
    riskFactors: [
      { name: 'Good mobility status', icon: '🚶', contribution: -0.18 },
      { name: 'Regular repositioning protocol', icon: '🔄', contribution: -0.12 },
      { name: 'High patient awareness', icon: '👁️', contribution: -0.10 },
    ],
    clinicalNotes: 'Patient ambulatory and independent. No pressure areas identified. Braden score 21. Discharge planning initiated.',
    interventions: [
      { date: 'Day 2', type: 'Early Mobilization', description: 'Independent ambulation achieved', outcome: 'Successful' },
      { date: 'Day 3', type: 'Discharge Planning', description: 'Home care instructions provided', outcome: 'Patient verbalized understanding' },
    ],
    vitals: [
      { name: 'BP', value: '120/72', status: 'normal' },
      { name: 'HR', value: '66', status: 'normal' },
      { name: 'SpO2', value: '99%', status: 'normal' },
      { name: 'Temp', value: '98.2°F', status: 'normal' },
    ],
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
    room: '404B',
    diagnosis: 'Sepsis - Recovering',
    attendingPhysician: 'Dr. Kim',
    nurseAssigned: 'RN Jackson',
    riskSummary: 'Extended device duration + mild site redness observed',
    riskFactors: [
      { name: 'Extended device duration', icon: '⏱️', contribution: 0.22 },
      { name: 'Site assessment findings', icon: '👁️', contribution: 0.15 },
      { name: 'Frequent monitoring protocol', icon: '📊', contribution: -0.10 },
    ],
    clinicalNotes: 'PICC line Day 6. Site shows mild redness - monitoring closely. Blood cultures pending. Daily necessity review documented.',
    interventions: [
      { date: 'Day 4', type: 'Site Assessment', description: 'Mild erythema noted at insertion site', outcome: 'Increased monitoring' },
      { date: 'Day 5', type: 'Blood Cultures', description: 'Peripheral cultures drawn for comparison', outcome: 'Pending results' },
      { date: 'Day 6', type: 'Line Necessity Review', description: 'Daily assessment of continued need', outcome: 'Continue - antibiotics ongoing' },
    ],
    vitals: [
      { name: 'BP', value: '116/68', status: 'normal' },
      { name: 'HR', value: '84', status: 'normal' },
      { name: 'SpO2', value: '97%', status: 'normal' },
      { name: 'Temp', value: '99.2°F', status: 'warning' },
    ],
  },
  // NEW PATIENTS WITH DIVERSE SCENARIOS
  {
    id: 'Patient L11',
    riskLevel: 'HIGH',
    riskScore: 78,
    riskType: 'CAUTI',
    trend: 'up',
    lastUpdated: '~3h',
    lastUpdatedMinutes: 3,
    ageRange: '72-76',
    admissionDate: 'Day 8',
    room: '401A',
    diagnosis: 'Spinal Cord Injury - Incomplete',
    attendingPhysician: 'Dr. Hernandez',
    nurseAssigned: 'RN White',
    riskSummary: 'Foley catheter Day 8 + cloudy urine + low-grade fever',
    riskFactors: [
      { name: 'Extended catheter duration (>7 days)', icon: '⏱️', contribution: 0.35 },
      { name: 'Urinary changes noted', icon: '🔬', contribution: 0.25 },
      { name: 'Immunocompromised status', icon: '🛡️', contribution: 0.15 },
      { name: 'Daily catheter necessity review', icon: '📋', contribution: -0.08 },
    ],
    clinicalNotes: 'Foley catheter in place since admission. Day 8 - cloudy urine noted with low-grade temp 99.8°F. UA and culture ordered. CAUTI bundle compliance documented. Discussing intermittent cath with urology.',
    interventions: [
      { date: 'Day 1', type: 'CAUTI Bundle', description: 'Insertion with sterile technique, securement device applied', outcome: 'Compliant' },
      { date: 'Day 5', type: 'Catheter Necessity Review', description: 'Urology consulted for removal options', outcome: 'Continue due to retention' },
      { date: 'Day 8', type: 'UA/Culture Ordered', description: 'Symptomatic - workup initiated', outcome: 'Pending' },
    ],
    vitals: [
      { name: 'BP', value: '126/74', status: 'normal' },
      { name: 'HR', value: '88', status: 'normal' },
      { name: 'SpO2', value: '97%', status: 'normal' },
      { name: 'Temp', value: '99.8°F', status: 'warning' },
    ],
    nursingOutcomes: [
      { metric: 'Catheter Days', baseline: 0, current: 8, target: 0, unit: 'days' },
      { metric: 'CAUTI Bundle Compliance', baseline: 100, current: 100, target: 100, unit: '%' },
    ],
  },
  {
    id: 'Patient M12',
    riskLevel: 'HIGH',
    riskScore: 82,
    riskType: 'Pressure Injury',
    trend: 'stable',
    lastUpdated: '~4h',
    lastUpdatedMinutes: 4,
    ageRange: '78-82',
    admissionDate: 'Day 12',
    room: '403A',
    diagnosis: 'Multi-System Organ Failure - ICU Stepdown',
    attendingPhysician: 'Dr. Foster',
    nurseAssigned: 'RN Clark',
    riskSummary: 'Stage II sacral wound + critically low albumin + profound weakness',
    riskFactors: [
      { name: 'Existing pressure injury (Stage II)', icon: '🩹', contribution: 0.30 },
      { name: 'Severe malnutrition (Albumin 2.1)', icon: '🍽️', contribution: 0.28 },
      { name: 'Complete immobility', icon: '🛏️', contribution: 0.25 },
      { name: 'Wound care protocol active', icon: '🔄', contribution: -0.10 },
    ],
    clinicalNotes: 'ICU stepdown patient. Stage II pressure injury sacrum measuring 4x3cm with shallow depth. Wound care q12h with foam dressing. Nutritional support via TPN. Braden score 10. Air-fluidized bed in use.',
    interventions: [
      { date: 'Day 8', type: 'Wound Care Team', description: 'Wound care specialist evaluation', outcome: 'Treatment plan established' },
      { date: 'Day 9', type: 'Air-Fluidized Bed', description: 'Specialty bed ordered for pressure redistribution', outcome: 'Implemented' },
      { date: 'Day 10', type: 'TPN Initiated', description: 'Parenteral nutrition for wound healing', outcome: 'Albumin trending up' },
      { date: 'Day 12', type: 'Weekly Wound Measurement', description: 'Photo documentation and measurement', outcome: 'Stable - no progression' },
    ],
    vitals: [
      { name: 'BP', value: '98/58', status: 'warning' },
      { name: 'HR', value: '94', status: 'warning' },
      { name: 'SpO2', value: '94%', status: 'warning' },
      { name: 'Temp', value: '98.4°F', status: 'normal' },
    ],
    nursingOutcomes: [
      { metric: 'Braden Scale', baseline: 9, current: 10, target: 15, unit: 'points' },
      { metric: 'Wound Size', baseline: 4.5, current: 4.0, target: 0, unit: 'cm²' },
      { metric: 'Albumin', baseline: 1.8, current: 2.1, target: 3.5, unit: 'g/dL' },
    ],
  },
  {
    id: 'Patient N13',
    riskLevel: 'MEDIUM',
    riskScore: 55,
    riskType: 'CAUTI',
    trend: 'down',
    lastUpdated: '~6h',
    lastUpdatedMinutes: 6,
    ageRange: '64-68',
    admissionDate: 'Day 4',
    room: '411A',
    diagnosis: 'Post-TURP Retention',
    attendingPhysician: 'Dr. Reynolds',
    nurseAssigned: 'RN Lopez',
    riskSummary: 'Post-surgical catheter Day 4 + removal trial planned',
    riskFactors: [
      { name: 'Catheter duration (4-7 days)', icon: '⏱️', contribution: 0.22 },
      { name: 'Post-surgical status', icon: '🏥', contribution: 0.15 },
      { name: 'Planned removal trial', icon: '📅', contribution: -0.12 },
      { name: 'Daily catheter care documented', icon: '✅', contribution: -0.08 },
    ],
    clinicalNotes: 'Post-TURP Day 4. Catheter irrigation discontinued. Urine clearing. Void trial planned for tomorrow AM. Patient educated on post-void residual assessment.',
    interventions: [
      { date: 'Day 1', type: 'Continuous Bladder Irrigation', description: 'CBI initiated post-op', outcome: 'Completed Day 2' },
      { date: 'Day 3', type: 'Urology Review', description: 'Assessment for catheter removal', outcome: 'Void trial Day 5' },
      { date: 'Day 4', type: 'Patient Education', description: 'Taught Kegel exercises and void diary', outcome: 'Patient demonstrates understanding' },
    ],
    vitals: [
      { name: 'BP', value: '134/82', status: 'normal' },
      { name: 'HR', value: '72', status: 'normal' },
      { name: 'SpO2', value: '98%', status: 'normal' },
      { name: 'Temp', value: '98.4°F', status: 'normal' },
    ],
    nursingOutcomes: [
      { metric: 'Catheter Days', baseline: 0, current: 4, target: 0, unit: 'days' },
      { metric: 'Urine Output', baseline: 30, current: 60, target: 50, unit: 'mL/hr' },
    ],
  },
  {
    id: 'Patient P14',
    riskLevel: 'LOW',
    riskScore: 25,
    riskType: 'Falls',
    trend: 'stable',
    lastUpdated: '~14h',
    lastUpdatedMinutes: 14,
    ageRange: '42-46',
    admissionDate: 'Day 2',
    room: '422A',
    diagnosis: 'Appendectomy - Laparoscopic',
    attendingPhysician: 'Dr. Collins',
    nurseAssigned: 'RN Turner',
    riskSummary: 'Young, alert, ambulating independently - low baseline risk',
    riskFactors: [
      { name: 'Age <65', icon: '👤', contribution: -0.15 },
      { name: 'Oriented x4', icon: '🧠', contribution: -0.12 },
      { name: 'Independent mobility', icon: '🚶', contribution: -0.10 },
      { name: 'Post-anesthesia (resolved)', icon: '💊', contribution: 0.08 },
    ],
    clinicalNotes: 'POD 1 from laparoscopic appendectomy. Alert and oriented. Ambulating independently to bathroom. Tolerating regular diet. Anticipate discharge today.',
    interventions: [
      { date: 'Day 1', type: 'ERAS Protocol', description: 'Enhanced recovery pathway initiated', outcome: 'All milestones met' },
      { date: 'Day 2', type: 'Discharge Planning', description: 'Instructions reviewed, prescriptions sent', outcome: 'Ready for discharge' },
    ],
    vitals: [
      { name: 'BP', value: '118/72', status: 'normal' },
      { name: 'HR', value: '70', status: 'normal' },
      { name: 'SpO2', value: '99%', status: 'normal' },
      { name: 'Temp', value: '98.6°F', status: 'normal' },
    ],
  },
  {
    id: 'Patient Q15',
    riskLevel: 'HIGH',
    riskScore: 70,
    riskType: 'Device Complication',
    trend: 'up',
    lastUpdated: '~2h',
    lastUpdatedMinutes: 2,
    ageRange: '56-60',
    admissionDate: 'Day 9',
    room: '406A',
    diagnosis: 'Diabetic Foot Infection',
    attendingPhysician: 'Dr. Murphy',
    nurseAssigned: 'RN Hall',
    riskSummary: 'PICC line with positive blood cultures + septic presentation',
    riskFactors: [
      { name: 'Positive blood cultures', icon: '🔬', contribution: 0.32 },
      { name: 'Extended line duration (>7 days)', icon: '⏱️', contribution: 0.22 },
      { name: 'Diabetes mellitus', icon: '💉', contribution: 0.15 },
      { name: 'ID consult active', icon: '👨‍⚕️', contribution: -0.08 },
    ],
    clinicalNotes: 'PICC Day 9. Blood cultures returned positive for CoNS. ID consulted - likely line infection vs contamination. Peripheral cultures pending for comparison. Line removal being discussed.',
    interventions: [
      { date: 'Day 7', type: 'Surveillance Cultures', description: 'Routine blood cultures drawn', outcome: 'CoNS positive x1 bottle' },
      { date: 'Day 8', type: 'ID Consult', description: 'Infectious disease evaluation', outcome: 'Repeat cultures ordered' },
      { date: 'Day 9', type: 'Line Removal Discussion', description: 'Risk/benefit analysis with team', outcome: 'Pending culture results' },
    ],
    vitals: [
      { name: 'BP', value: '104/62', status: 'warning' },
      { name: 'HR', value: '98', status: 'warning' },
      { name: 'SpO2', value: '96%', status: 'normal' },
      { name: 'Temp', value: '100.8°F', status: 'critical' },
    ],
    nursingOutcomes: [
      { metric: 'WBC Count', baseline: 12.5, current: 14.2, target: 10, unit: 'K/µL' },
      { metric: 'Blood Glucose', baseline: 245, current: 180, target: 140, unit: 'mg/dL' },
    ],
  },
  {
    id: 'Patient R16',
    riskLevel: 'MEDIUM',
    riskScore: 48,
    riskType: 'Falls',
    trend: 'down',
    lastUpdated: '~20h',
    lastUpdatedMinutes: 20,
    ageRange: '70-74',
    admissionDate: 'Day 5',
    room: '419B',
    diagnosis: 'CHF Exacerbation',
    attendingPhysician: 'Dr. Bennett',
    nurseAssigned: 'RN Green',
    riskSummary: 'Diuretic therapy → orthostatic hypotension risk + improving strength',
    riskFactors: [
      { name: 'Diuretic-induced orthostasis', icon: '💊', contribution: 0.22 },
      { name: 'Advanced age (>65)', icon: '👤', contribution: 0.15 },
      { name: 'Improving mobility', icon: '📈', contribution: -0.12 },
      { name: 'Fall prevention education completed', icon: '📚', contribution: -0.10 },
    ],
    clinicalNotes: 'CHF patient on IV Lasix. Weight down 8 lbs. Orthostatic precautions in place. PT working on sit-to-stand exercises. Uses call light appropriately.',
    interventions: [
      { date: 'Day 2', type: 'Orthostatic Protocol', description: 'BP checks with position changes', outcome: 'Orthostatic present' },
      { date: 'Day 3', type: 'PT Evaluation', description: 'Balance and strength assessment', outcome: 'Progressing well' },
      { date: 'Day 4', type: 'Fall Prevention Teaching', description: 'Rise slowly, use assistive device', outcome: 'Patient demonstrates techniques' },
    ],
    vitals: [
      { name: 'BP', value: '108/64', status: 'warning' },
      { name: 'HR', value: '82', status: 'normal' },
      { name: 'SpO2', value: '95%', status: 'normal' },
      { name: 'Temp', value: '98.0°F', status: 'normal' },
    ],
    nursingOutcomes: [
      { metric: 'Daily Weight', baseline: 198, current: 190, target: 185, unit: 'lbs' },
      { metric: 'Orthostatic BP Drop', baseline: 30, current: 18, target: 10, unit: 'mmHg' },
    ],
  },
  {
    id: 'Patient S17',
    riskLevel: 'LOW',
    riskScore: 20,
    riskType: 'CAUTI',
    trend: 'down',
    lastUpdated: '~16h',
    lastUpdatedMinutes: 16,
    ageRange: '38-42',
    admissionDate: 'Day 2',
    room: '421A',
    diagnosis: 'Cesarean Section',
    attendingPhysician: 'Dr. Campbell',
    nurseAssigned: 'RN Adams',
    riskSummary: 'Post-surgical catheter removed < 24h + voiding spontaneously',
    riskFactors: [
      { name: 'Catheter removed early (<24h)', icon: '✅', contribution: -0.18 },
      { name: 'Voiding spontaneously', icon: '💧', contribution: -0.12 },
      { name: 'Ambulatory', icon: '🚶', contribution: -0.08 },
      { name: 'Post-surgical status', icon: '🏥', contribution: 0.10 },
    ],
    clinicalNotes: 'POD 1 C-section. Foley removed at 12 hours per protocol. Voiding spontaneously. Ambulating to chair and bathroom. Bonding well with newborn. Anticipate discharge POD 2.',
    interventions: [
      { date: 'Day 1', type: 'Early Catheter Removal', description: 'Foley removed per ERAS protocol', outcome: 'Successful void' },
      { date: 'Day 2', type: 'PVR Assessment', description: 'Post-void residual bladder scan', outcome: '<50mL - adequate emptying' },
    ],
    vitals: [
      { name: 'BP', value: '116/74', status: 'normal' },
      { name: 'HR', value: '76', status: 'normal' },
      { name: 'SpO2', value: '99%', status: 'normal' },
      { name: 'Temp', value: '98.4°F', status: 'normal' },
    ],
  },
  {
    id: 'Patient T18',
    riskLevel: 'HIGH',
    riskScore: 85,
    riskType: 'Falls',
    trend: 'stable',
    lastUpdated: '~1h',
    lastUpdatedMinutes: 1,
    ageRange: '86-90',
    admissionDate: 'Day 6',
    room: '400A',
    diagnosis: 'Parkinson Disease - Pneumonia',
    attendingPhysician: 'Dr. Morgan',
    nurseAssigned: 'RN Phillips',
    riskSummary: 'Parkinson tremor + gait freezing + acute illness → extreme fall risk',
    riskFactors: [
      { name: 'Parkinson disease - gait disorder', icon: '🧠', contribution: 0.35 },
      { name: 'Acute illness deconditioning', icon: '🤒', contribution: 0.25 },
      { name: 'Advanced age (>85)', icon: '👤', contribution: 0.20 },
      { name: 'Dopaminergic medication timing', icon: '💊', contribution: 0.15 },
      { name: '1:1 sitter in place', icon: '👁️', contribution: -0.10 },
    ],
    clinicalNotes: 'Parkinson patient with pneumonia. Experiencing "off" periods with freezing of gait. Carbidopa/levodopa timing optimized with neurology. Sitter at bedside 24/7. Unable to use call light reliably during tremor.',
    interventions: [
      { date: 'Day 1', type: 'Neurology Consult', description: 'Medication timing optimization', outcome: 'Adjusted dosing schedule' },
      { date: 'Day 2', type: '1:1 Sitter', description: 'Continuous observation ordered', outcome: 'Active' },
      { date: 'Day 4', type: 'PT Evaluation', description: 'Gait assessment and assistive device trial', outcome: 'Requires max assist + gait belt' },
      { date: 'Day 6', type: 'Multidisciplinary Rounds', description: 'Fall prevention strategy review', outcome: 'Continue current interventions' },
    ],
    vitals: [
      { name: 'BP', value: '138/78', status: 'warning' },
      { name: 'HR', value: '80', status: 'normal' },
      { name: 'SpO2', value: '93%', status: 'warning' },
      { name: 'Temp', value: '99.4°F', status: 'warning' },
    ],
    nursingOutcomes: [
      { metric: 'Morse Fall Scale', baseline: 80, current: 85, target: 25, unit: 'points' },
      { metric: 'On/Off Time Ratio', baseline: 40, current: 65, target: 80, unit: '% on' },
    ],
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
