// Patent-related constants - centralized for consistency

// Patent #1: Trust-Based Alert Prioritization and Equity Monitoring (FILED)
export const PATENT_NUMBER = '63/946,187';
export const PATENT_TITLE = 'CLINICAL DECISION SUPPORT SYSTEM WITH TRUST-BASED ALERT PRIORITIZATION AND EQUITY MONITORING';

// Patent #2: Clinical Risk Intelligence System (FILED Dec 2025)
export const PATENT_2_NUMBER = '63/932,953';
export const PATENT_2_TITLE = 'CLINICAL RISK INTELLIGENCE SYSTEM WITH INTEGRATED EXPLAINABILITY, TEMPORAL FORECASTING, ADAPTIVE THRESHOLDS, AND CLOSED-LOOP INTERVENTION FEEDBACK';

// Patent #3: Unified Nursing Intelligence Platform
export const PATENT_3_TITLE = 'UNIFIED NURSING INTELLIGENCE PLATFORM';

// Patent #4: DBS System (FILED Jan 22, 2026)
export const PATENT_4_NUMBER = '63/966,099';
export const PATENT_4_TITLE = 'SYSTEM AND METHOD FOR PREDICTING DOCUMENTATION BURDEN AND OPTIMIZING NURSE STAFFING USING MACHINE LEARNING (DBS SYSTEM)';

// All patent applications
export interface PatentApplication {
  id: string;
  number?: string;
  title: string;
  shortName: string;
  status: 'filed' | 'pending' | 'preparation';
  filingDate: string;
  inventor: string;
}

export const PATENT_PORTFOLIO: PatentApplication[] = [
  {
    id: 'trust-alerts',
    number: '63/946,187',
    title: PATENT_TITLE,
    shortName: 'Trust-Based Alert System',
    status: 'filed',
    filingDate: 'December 21, 2025',
    inventor: 'Dr. Alexis Collier'
  },
  {
    id: 'risk-intelligence',
    number: '63/932,953',
    title: PATENT_2_TITLE,
    shortName: 'Clinical Risk Intelligence',
    status: 'filed',
    filingDate: 'December 2025',
    inventor: 'Dr. Alexis Collier'
  },
  {
    id: 'unified-platform',
    title: PATENT_3_TITLE,
    shortName: 'Unified Nursing Intelligence',
    status: 'pending',
    filingDate: 'Q1 2026',
    inventor: 'Dr. Alexis Collier'
  },
  {
    id: 'dbs-system',
    number: '63/966,099',
    title: PATENT_4_TITLE,
    shortName: 'DBS System',
    status: 'filed',
    filingDate: 'January 22, 2026',
    inventor: 'Dr. Alexis Collier'
  }
];

export const PATENT_ACCESS_KEY = 'patent2025';
export const PATENT_EXPIRATION_DATE = new Date('2026-12-31T23:59:59');
export const DOCUMENT_VERSION = '1.1.0';
export const DOCUMENT_CREATED = '2025-12-30T00:00:00Z';

// Generate cryptographic document hash for evidence integrity
export const generateDocumentHash = (content: string): string => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
};

// Video recording sections mapped to claims
export const VIDEO_SECTIONS: Record<string, { title: string; duration: string; claims: number[] }> = {
  dashboard: { title: 'Dashboard Overview Recording', duration: '2-3 min', claims: [1, 12, 15, 19] },
  patients: { title: 'Patient Worklist Recording', duration: '3-4 min', claims: [4, 8, 11, 16] },
  shap: { title: 'SHAP Explainability Recording', duration: '4-5 min', claims: [2, 3, 17, 18] },
  workflow: { title: 'Clinical Workflow Recording', duration: '5-6 min', claims: [5, 6, 7, 9, 10, 13, 14] },
};

// Demo section labels for cross-referencing
export const DEMO_SECTION_LABELS: Record<string, string> = {
  intro: 'Introduction',
  dashboard: 'Real-Time Overview',
  patients: 'Patient Worklist',
  shap: 'Risk Attribution',
  workflow: 'Clinical Workflow',
  outro: 'Conclusion'
};
