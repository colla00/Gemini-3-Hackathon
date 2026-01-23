// Research data and constants for DRALEXIS Clinical Intelligence Platform
// All data from actual research: 10,000 patients, 201 hospitals validation
// Copyright © Dr. Alexis Collier - U.S. Patent Filed

export interface ValidationData {
  internalPatients: number;
  externalHospitals: number;
  internalAUC: number;
  externalAUC: number;
  correlation: number;
  cohensD: number;
  confidenceInterval: [number, number];
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

export const RESEARCH_DATA = {
  validation: {
    internalPatients: 10000,
    externalHospitals: 201,
    internalAUC: 0.78,
    externalAUC: 0.74,
    correlation: 0.40,
    cohensD: 3.2,
    confidenceInterval: [0.76, 0.80] as [number, number],
  },
  
  dbs: {
    quartiles: [
      { name: 'Q1: Low', patients: 2847, percentage: 28.47, staffingRatio: '1:2' },
      { name: 'Q2: Moderate', patients: 2615, percentage: 26.15, staffingRatio: '1:1' },
      { name: 'Q3: High', patients: 2389, percentage: 23.89, staffingRatio: '1:1 Enhanced' },
      { name: 'Q4: Very High', patients: 2149, percentage: 21.49, staffingRatio: '1:1 + Senior RN' },
    ] as QuartileData[],
    overtimeReduction: [15, 20],
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
  
  risk: {
    sepsisAUC: 0.87,
    respiratoryAUC: 0.84,
    falsePositiveReduction: [40, 70],
    advanceWarning: [6, 48],
  },
  
  alerts: {
    reductionRate: 0.87,
    beforeAlerts: 27,
    afterAlerts: 7,
    sensitivity: 1.00,
    timeSaved: 2.3,
    trustScore: 0.94,
    equityDisparity: 0.005,
  },
  
  roi: {
    baseROI: [180000, 360000],
    paybackMonths: [4, 6],
    overtimeReduction: 0.175,
    transferReduction: 0.115,
    mortalityReduction: 0.14,
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
        description: '87% reduction in non-actionable alerts, saving 2.3 minutes per decision',
      },
      {
        icon: '⚖️',
        title: 'Equity Monitoring',
        description: 'Real-time bias detection maintaining <0.5% demographic disparity',
      },
      {
        icon: '👩‍⚕️',
        title: 'Nurse-Led Design',
        description: 'Co-designed with nurses through AIM-AHEAD CLINAQ Fellowship',
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
    year: '2023',
    title: 'Patent Filing #1',
    description: 'Clinical Risk Intelligence System (Patent #63/932,953)',
    icon: '⚖️',
  },
  {
    year: '2024',
    title: 'AIM-AHEAD Fellowship',
    description: 'CLINAQ Cohort 2 - Focus on AI for nursing workload optimization',
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
    number: '63/932,953',
    title: 'Clinical Risk Intelligence System',
    filed: '2023',
    status: 'Filed',
    description: 'ML-based system for predicting clinical deterioration with SHAP explainability',
  },
  {
    number: 'Pending',
    title: 'Unified Nursing Intelligence Platform',
    filed: 'Jan 2026',
    status: 'Pending',
    description: 'Three-module integration: DBS, Risk Intelligence, Trust-Based Alerts with Equity Monitoring',
  },
  {
    number: 'Pending',
    title: 'DBS System for Staffing Optimization',
    filed: 'Feb 2026',
    status: 'Pending',
    description: 'ML-based documentation burden prediction with quartile staffing recommendations',
  },
];

export const PUBLICATIONS: PublicationInfo[] = [
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
