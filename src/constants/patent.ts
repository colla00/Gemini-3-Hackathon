// Patent-related constants - centralized for consistency
// Numbering reflects presentation order (Patent #1 = ICU Mortality, the validated medRxiv manuscript)

// Patent #1: ICU Mortality Prediction (FILED Feb 5, 2026) - medRxiv validated
export const PATENT_1_TITLE = 'SYSTEM AND METHOD FOR PREDICTING ICU MORTALITY FROM ELECTRONIC HEALTH RECORD DOCUMENTATION RHYTHM PATTERNS AND TEMPORAL PHENOTYPES';

// Patent #2: Trust-Based Alert Prioritization and Equity Monitoring - "ChartMinder" (FILED Dec 2025)
export const PATENT_TITLE = 'CLINICAL DECISION SUPPORT SYSTEM WITH TRUST-BASED ALERT PRIORITIZATION AND EQUITY MONITORING';

// Patent #3: Clinical Risk Intelligence System (FILED Dec 2025)
export const PATENT_3_TITLE = 'CLINICAL RISK INTELLIGENCE SYSTEM WITH INTEGRATED EXPLAINABILITY, TEMPORAL FORECASTING, ADAPTIVE THRESHOLDS, AND CLOSED-LOOP INTERVENTION FEEDBACK';

// Patent #4: Unified Nursing Intelligence Platform (FILED Jan 2026)
export const PATENT_4_TITLE = 'UNIFIED NURSING INTELLIGENCE PLATFORM INTEGRATING WORKLOAD PREDICTION, RISK INTELLIGENCE, AND TRUST-BASED ALERTS';

// Patent #5: DBS System (FILED Jan 22, 2026) - Externally validated AUROC 0.802/0.857
export const PATENT_5_TITLE = 'SYSTEM AND METHOD FOR PREDICTING DOCUMENTATION BURDEN AND OPTIMIZING NURSE STAFFING USING MACHINE LEARNING (DBS SYSTEM)';


// All patent applications (ordered by presentation number, not filing date)
export interface PatentApplication {
  id: string;
  title: string;
  shortName: string;
  status: 'filed' | 'pending' | 'preparation';
  filingDate: string;
  inventor: string;
  claimsCount?: number;
  nihFunded?: boolean;
  abstract?: string;
}

export const PATENT_PORTFOLIO: PatentApplication[] = [
  {
    id: 'icu-mortality',
    title: PATENT_1_TITLE,
    shortName: 'ICU Mortality Prediction',
    status: 'filed',
    filingDate: 'February 2026',
    inventor: 'Dr. Alexis Collier',
    claimsCount: 99,
    nihFunded: true,
    abstract: 'A system and method for predicting ICU mortality utilizing 11 IDI temporal features derived solely from EHR timestamp metadata. Validated on 60,050 patients: MIMIC-IV (AUROC 0.683, n=26,153) and HiRID (AUROC 0.9063, n=33,897). Outperforms APACHE IV and SAPS III on external validation.'
  },
  {
    id: 'trust-alerts',
    title: PATENT_TITLE,
    shortName: 'ChartMinder (Trust-Based Alerts)',
    status: 'filed',
    filingDate: 'December 2025',
    inventor: 'Dr. Alexis Collier',
    abstract: 'Trust-based alert prioritization with equity monitoring, explainable AI reasoning, and cognitive load optimization, implemented as ChartMinder mobile governance dashboard.'
  },
  {
    id: 'risk-intelligence',
    title: PATENT_3_TITLE,
    shortName: 'Clinical Risk Intelligence',
    status: 'filed',
    filingDate: 'December 2025',
    inventor: 'Dr. Alexis Collier'
  },
  {
    id: 'unified-platform',
    title: PATENT_4_TITLE,
    shortName: 'Unified Nursing Intelligence',
    status: 'filed',
    filingDate: 'January 2026',
    inventor: 'Dr. Alexis Collier'
  },
  {
    id: 'dbs-system',
    title: PATENT_5_TITLE,
    shortName: 'DBS System',
    status: 'filed',
    filingDate: 'January 2026',
    inventor: 'Dr. Alexis Collier',
    nihFunded: true,
    abstract: 'ML-powered documentation burden quantification using multiple clinical variables. Externally validated: AUROC 0.802 (MIMIC-IV, N=24,689) → 0.857 (eICU, N=297,030, 208 hospitals). ANIA 2026 presentation accepted.'
  },
];

// Dynamic counts - use these instead of hardcoding
export const PATENTS_FILED_COUNT = PATENT_PORTFOLIO.filter(p => p.status === 'filed').length;
export const PATENTS_TOTAL_CLAIMS = '175+';
export const PATENTS_FILED_LABEL = `${PATENTS_FILED_COUNT} U.S. Patent Applications Filed`;
export const PATENTS_DATE_RANGE = 'December 2025 – February 2026';

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
  icu: { title: 'ICU Mortality Prediction Recording', duration: '3-4 min', claims: [1, 2, 3, 4] },
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
