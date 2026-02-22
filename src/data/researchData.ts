// Research data and constants for DRALEXIS Clinical Intelligence Platform
// IMPORTANT: All metrics are DESIGN TARGETS or ILLUSTRATIVE values for demonstration purposes
// No clinical validation has been conducted - this is a research prototype
// Copyright © Dr. Alexis Collier - U.S. Patent Filed

export interface ValidationData {
  // ILLUSTRATIVE - These are design targets, not validated results
  targetPatients: number;       // Planned validation cohort size
  targetHospitals: number;      // Planned external validation sites
  targetInternalAUC: number;    // Design goal for internal validation
  targetExternalAUC: number;    // Design goal for external validation
  targetCorrelation: number;    // Expected correlation target
  targetCohensD: number;        // Expected effect size target
  targetConfidenceInterval: [number, number]; // Expected CI range
  isValidated: false;           // Flag indicating no validation conducted
}

export interface QuartileData {
  name: string;
  patients: number;
  percentage: number;
  staffingRatio: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: string;
}

export interface DBSFeature {
  name: string;
  weight: number;
}

export interface DBSCalculationFactor {
  name: string;
  min: number;
  max: number;
  default: number;
  weight: number;
}

export interface PatentInfo {
  number: string;
  title: string;
  filed: string;
  status: string;
  description: string;
}

export interface PublicationInfo {
  title: string;
  venue: string;
  date: string;
  type: string;
}

// VALIDATED RESULTS - Updated to match manuscript & ANIA 2026 presentation
// Patent #5 DBS: AUROC 0.802 (MIMIC-IV, N=24,689) → 0.857 (eICU, N=297,030, 208 hospitals)
export const RESEARCH_DATA = {
  // DBS VALIDATED RESULTS
  validation: {
    targetPatients: 321719,       // Total validated cohort (MIMIC-IV + eICU)
    targetHospitals: 208,         // External validation hospitals (eICU)
    targetInternalAUC: 0.802,     // Validated internal AUROC (MIMIC-IV)
    targetExternalAUC: 0.857,     // Validated external AUROC (eICU)
    targetCorrelation: 0.40,      // Expected correlation
    targetCohensD: 3.2,           // Expected effect size
    targetConfidenceInterval: [0.79, 0.81] as [number, number],
    isValidated: true,            // Externally validated
  },
  
  // ILLUSTRATIVE - Based on literature review, not empirical data
  dbs: {
    quartiles: [
      { name: 'Q1: Low', patients: 2847, percentage: 28.47, staffingRatio: '1:2' },
      { name: 'Q2: Moderate', patients: 2615, percentage: 26.15, staffingRatio: '1:1' },
      { name: 'Q3: High', patients: 2389, percentage: 23.89, staffingRatio: '1:1 Enhanced' },
      { name: 'Q4: Very High', patients: 2149, percentage: 21.49, staffingRatio: '1:1 + Senior RN' },
    ] as QuartileData[],
    overtimeReduction: [15, 20],  // Projected range (%)
    features: [
      { name: 'APACHE II Score', weight: 0.25 },
      { name: 'SOFA Score', weight: 0.20 },
      { name: 'Comorbidities', weight: 0.18 },
      { name: 'Active Medications', weight: 0.15 },
      { name: 'Age', weight: 0.12 },
      { name: 'Mechanical Ventilation', weight: 0.10 },
      { name: 'Continuous Monitoring', weight: 0.08 },
      { name: 'Admission Type', weight: 0.06 },
    ] as DBSFeature[],
  },
  
  // DESIGN TARGETS - Based on literature review
  risk: {
    targetSepsisAUC: 0.87,        // Design goal based on published benchmarks
    targetRespiratoryAUC: 0.84,   // Design goal based on published benchmarks
    projectedFalsePositiveReduction: [40, 70],  // Projected improvement range
    projectedAdvanceWarning: [6, 48],           // Projected hours of advance warning
  },
  
  // PROJECTED IMPROVEMENTS - Based on literature review
  alerts: {
    projectedReductionRate: 0.87, // Projected alert reduction
    illustrativeBeforeAlerts: 27, // Illustrative scenario
    illustrativeAfterAlerts: 7,   // Illustrative scenario
    targetSensitivity: 1.00,      // Design target
    projectedTimeSaved: 2.3,      // Projected minutes per decision
    targetTrustScore: 0.94,       // Design target
    targetEquityDisparity: 0.005, // Design target (<0.5%)
  },
  
  // PROJECTED ROI - Based on industry estimates
  roi: {
    projectedROI: [180000, 360000],  // Projected annual savings range
    projectedPaybackMonths: [4, 6],  // Projected payback period
    projectedOvertimeReduction: 0.175, // Projected reduction
    projectedTransferReduction: 0.115, // Projected reduction
    projectedMortalityReduction: 0.14, // Projected reduction based on literature
  },
  
  framework: {
    principles: [
      {
        icon: '🔍',
        title: 'Human-Centered Explainability',
        description: 'Every prediction includes clear explanations of contributing factors using SHAP analysis',
      },
      {
        icon: '🤝',
        title: 'Trust Through Transparency',
        description: 'Trust scores, model performance metrics, and data sources always visible',
      },
      {
        icon: '🧠',
        title: 'Cognitive Load Optimization',
        description: 'Target: 87% reduction in non-actionable alerts, saving 2.3 minutes per decision (simulated)',
      },
      {
        icon: '⚖️',
        title: 'Equity Monitoring',
        description: 'Target: real-time bias detection maintaining <0.5% demographic disparity (design goal)',
      },
      {
        icon: '👩‍⚕️',
        title: 'Nurse-Led Design',
        description: 'Co-designed with frontline nurses through clinical fellowship',
      },
    ],
  },
};

export const TIMELINE: TimelineItem[] = [
  {
    year: '2022',
    title: 'DHA Dissertation',
    description: 'Foundational research on nursing burnout and workload measurement',
    icon: '🎓',
  },
  {
    year: 'Dec 2025',
    title: 'Patent Filings #1 & #2',
    description: 'Trust-Based Alert System & Clinical Risk Intelligence patent applications filed',
    icon: '⚖️',
  },
  {
    year: '2024',
    title: 'Clinical AI Fellowship',
    description: 'Focus on AI for clinical decision support',
    icon: '🏆',
  },
  {
    year: '2025 Oct',
    title: 'SIIM Conference',
    description: 'AI Nursing poster presentation',
    icon: '📊',
  },
  {
    year: '2025 Dec',
    title: 'Stanford AI+Health',
    description: 'AI-Assisted Clinical Judgment Framework demonstration',
    icon: '🎯',
  },
  {
    year: '2025 Dec',
    title: 'Patent Filing #2',
    description: 'Trust-Based Alert System (U.S. Patent Filed)',
    icon: '⚖️',
  },
  {
    year: '2026 Feb',
    title: 'ANIA 2026',
    description: 'DBS research presentation (Abstract #185)',
    icon: '🎤',
  },
  {
    year: '2026+',
    title: 'Platform Launch',
    description: 'Full DRALEXIS Clinical Intelligence Platform deployment',
    icon: '🚀',
  },
];

export const DEMO_PATIENT = {
  id: 'ICU-2401',
  name: 'John Doe',
  age: 75,
  gender: 'Male',
  admissionDate: '2026-01-18',
  diagnosis: 'Septic Shock',
  riskScore: 87,
  dbsScore: 42,
  criticalAlerts: 2,
  urgentAlerts: 5,
  vitals: {
    heartRate: 118,
    bloodPressure: '92/58',
    temperature: 38.9,
    respiratoryRate: 26,
    oxygenSaturation: 89,
  },
  labs: {
    lactate: 4.2,
    whiteBloodCells: 18.5,
    creatinine: 2.1,
    procalcitonin: 8.3,
  },
  interventions: [
    'Broad-spectrum antibiotics initiated',
    'Fluid resuscitation 30ml/kg',
    'Norepinephrine infusion',
    'Continuous cardiac monitoring',
  ],
};

export const DBS_CALCULATION_FACTORS: DBSCalculationFactor[] = [
  { name: 'APACHE II Score', min: 0, max: 71, default: 25, weight: 0.25 },
  { name: 'SOFA Score', min: 0, max: 24, default: 8, weight: 0.20 },
  { name: 'Number of Comorbidities', min: 0, max: 10, default: 3, weight: 0.18 },
  { name: 'Active Medications', min: 0, max: 30, default: 12, weight: 0.15 },
  { name: 'Age', min: 18, max: 100, default: 65, weight: 0.12 },
];

export const PATENTS: PatentInfo[] = [
  {
    number: 'Patent Pending',
    title: 'Trust-Based Alert Prioritization',
    filed: '2025',
    status: 'Filed',
    description: 'Clinical decision support with trust-based alert prioritization and equity monitoring',
  },
  {
    number: 'Patent Pending',
    title: 'Clinical Risk Intelligence',
    filed: '2025',
    status: 'Filed',
    description: 'ML-based system for predicting clinical deterioration with SHAP explainability',
  },
  {
    number: 'Patent Pending',
    title: 'Unified Nursing Intelligence Platform',
    filed: '2026',
    status: 'Filed',
    description: 'Three-module integration: DBS, Risk Intelligence, Trust-Based Alerts with Equity Monitoring',
  },
  {
    number: 'Patent Pending',
    title: 'DBS System',
    filed: '2026',
    status: 'Filed',
    description: 'ML-based documentation burden prediction with quartile staffing recommendations',
  },
];

export const PUBLICATIONS: PublicationInfo[] = [
  {
    title: 'Development and Validation of the Intensive Documentation Index for ICU Mortality Prediction: A Temporal Validation Study',
    venue: 'medRxiv (Preprint)',
    date: 'February 2026',
    type: 'Manuscript',
  },
  {
    title: 'ANIA 2026 - Documentation Burden Score System',
    venue: 'ANIA Annual Conference',
    date: 'February 2026',
    type: 'Conference Presentation',
  },
  {
    title: 'AI-Assisted Clinical Judgment Framework',
    venue: 'Stanford AI+Health Conference',
    date: 'December 2025',
    type: 'Framework Demonstration',
  },
  {
    title: 'AI in Nursing Informatics',
    venue: 'SIIM Conference',
    date: 'October 2025',
    type: 'Poster',
  },
  {
    title: 'IT Governance in Healthcare AI',
    venue: 'ISACA Journal',
    date: '2025',
    type: 'Publication',
  },
];
