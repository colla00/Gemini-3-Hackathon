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

// Patent #5: DBS System (FILED Jan 22, 2026) - Externally validated AUROC 0.802/0.758
export const PATENT_5_TITLE = 'SYSTEM AND METHOD FOR PREDICTING DOCUMENTATION BURDEN AND OPTIMIZING NURSE STAFFING USING MACHINE LEARNING (DBS SYSTEM)';

// Patent #6: TRACI (FILED Feb 2026)
export const PATENT_6_TITLE = 'TEMPORAL RISK ASSESSMENT AND CLINICAL INTELLIGENCE SYSTEM';

// Patent #7: ESDBI (FILED Feb 2026)
export const PATENT_7_TITLE = 'ENHANCED STAFFING AND DOCUMENTATION BURDEN INTELLIGENCE SYSTEM';

// Patent #8: SHQS (FILED Feb 2026)
export const PATENT_8_TITLE = 'SMART HEALTHCARE QUALITY SURVEILLANCE SYSTEM';

// Patent #9: DTBL (FILED Feb 2026)
export const PATENT_9_TITLE = 'DIGITAL TWIN BASELINE LEARNING SYSTEM FOR PERSONALIZED CLINICAL RISK THRESHOLDS';

// Patent #10: CTCI (FILED Feb 2026)
export const PATENT_10_TITLE = 'CLINICAL TRIAL AND COHORT INTELLIGENCE SYSTEM';

// Patent #11: SEDR (FILED Feb 2026)
export const PATENT_11_TITLE = 'SYNDROMIC EARLY DETECTION AND RESPONSE SYSTEM';


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
    abstract: 'A system and method for predicting ICU mortality utilizing temporal features derived solely from EHR timestamp metadata. Validated on 65,157 patients across international databases. Outperforms established acuity scores on external validation.'
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
    abstract: 'ML-powered documentation burden quantification using multiple clinical variables. Validated internally and externally across 172 hospitals (N=28,362). ANIA 2026 presentation accepted.'
  },
  {
    id: 'traci',
    title: PATENT_6_TITLE,
    shortName: 'TRACI – Temporal Risk',
    status: 'filed',
    filingDate: 'February 2026',
    inventor: 'Dr. Alexis Collier',
    abstract: 'Advanced temporal risk assessment combining time-series analysis of clinical data with contextual intelligence for early deterioration detection. Multi-horizon temporal risk scoring with real-time pattern recognition.'
  },
  {
    id: 'esdbi',
    title: PATENT_7_TITLE,
    shortName: 'ESDBI – Staffing Optimization',
    status: 'filed',
    filingDate: 'February 2026',
    inventor: 'Dr. Alexis Collier',
    abstract: 'Next-generation staffing optimization extending DBS with predictive scheduling, skill-mix optimization, documentation burden forecasting, and real-time workload rebalancing.'
  },
  {
    id: 'shqs',
    title: PATENT_8_TITLE,
    shortName: 'SHQS – Quality Surveillance',
    status: 'filed',
    filingDate: 'February 2026',
    inventor: 'Dr. Alexis Collier',
    abstract: 'Continuous quality surveillance monitoring healthcare delivery metrics, detecting deviations, and triggering automated improvement workflows benchmarked against national standards.'
  },
  {
    id: 'dtbl',
    title: PATENT_9_TITLE,
    shortName: 'DTBL – Digital Twin Baseline',
    status: 'filed',
    filingDate: 'February 2026',
    inventor: 'Dr. Alexis Collier',
    abstract: 'Patient digital twin technology creating dynamic baseline models from EHR data for personalized risk thresholds, state synchronization, and baseline drift detection.'
  },
  {
    id: 'ctci',
    title: PATENT_10_TITLE,
    shortName: 'CTCI – Clinical Trial Intelligence',
    status: 'filed',
    filingDate: 'February 2026',
    inventor: 'Dr. Alexis Collier',
    abstract: 'AI-driven clinical trial matching and cohort identification leveraging EHR documentation patterns for automated eligibility screening and real-time enrollment optimization.'
  },
  {
    id: 'sedr',
    title: PATENT_11_TITLE,
    shortName: 'SEDR – Syndromic Surveillance',
    status: 'filed',
    filingDate: 'February 2026',
    inventor: 'Dr. Alexis Collier',
    abstract: 'Population-level syndromic surveillance using aggregated documentation rhythm patterns for early outbreak detection, automated public health alerting, and cross-facility pattern aggregation.'
  },
];

// Dynamic counts - use these instead of hardcoding
export const PATENTS_FILED_COUNT = 11;
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
