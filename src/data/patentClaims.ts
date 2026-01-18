import { Brain, BarChart3, Clock, Sliders, RefreshCw, Activity } from 'lucide-react';
import type { PatentClaim, CategoryConfig, ClaimCategory } from '@/types/patent';

export const PATENT_CLAIMS: PatentClaim[] = [
  // System Claims (1-4)
  {
    number: 1,
    title: 'Clinical Risk Intelligence System',
    description: 'A clinical risk intelligence system for predicting nurse-sensitive patient outcomes, comprising: a data ingestion module configured to receive real-time patient data from electronic health record systems; a multi-outcome risk prediction engine utilizing machine learning models trained on nurse-sensitive outcomes.',
    category: 'system',
    implementation: 'Full dashboard system with real-time EHR data integration, multi-outcome risk scoring for Falls, HAPI, CAUTI, and device complications.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'demonstrated',
    demoSection: 'dashboard'
  },
  {
    number: 2,
    title: 'SHAP Explainability Integration',
    description: 'The system of claim 1, wherein the explainability module utilizes SHapley Additive exPlanations (SHAP) to decompose predicted risk scores into individual feature contributions.',
    category: 'explainability',
    implementation: 'Interactive SHAP waterfall charts showing how each clinical factor (mobility, medications, vitals) contributes to the final risk score.',
    componentPath: 'src/components/quality/ShapExplainability.tsx',
    status: 'implemented',
    demoSection: 'shap'
  },
  {
    number: 3,
    title: 'Waterfall Visualization',
    description: 'The system of claim 2, further comprising a waterfall visualization component that displays cumulative risk attribution from baseline through each contributing factor.',
    category: 'explainability',
    implementation: 'Animated waterfall bars with cumulative risk tracking, color-coded risk/protective factors, and interactive tooltips explaining each contribution.',
    componentPath: 'src/components/quality/ShapExplainability.tsx',
    status: 'implemented',
    demoSection: 'shap'
  },
  {
    number: 4,
    title: 'Confidence Scoring',
    description: 'The system of claim 1, wherein each risk prediction includes a confidence interval based on model uncertainty quantification.',
    category: 'system',
    implementation: 'Confidence indicators displayed on each risk score, with visual representation of prediction certainty.',
    componentPath: 'src/components/quality/ConfidenceIndicator.tsx',
    status: 'implemented',
    demoSection: 'patients'
  },
  // Temporal Forecasting Claims (5)
  {
    number: 5,
    title: 'Multi-Horizon Temporal Forecasting',
    description: 'A method for temporal risk forecasting comprising: generating risk predictions at multiple time horizons including 4-hour, 12-hour, 24-hour, and 48-hour intervals; calculating trajectory classifications for each horizon.',
    category: 'forecasting',
    implementation: 'Interactive forecast charts showing risk trajectories at 4h, 12h, 24h, 48h horizons with confidence bands and trajectory classification (improving/stable/deteriorating).',
    componentPath: 'src/components/quality/TemporalForecasting.tsx',
    status: 'implemented',
    demoSection: 'workflow'
  },
  // Adaptive Thresholds Claims (6)
  {
    number: 6,
    title: 'Patient-Adaptive Alert Thresholds',
    description: 'A system for adaptive alert threshold management comprising: calculating patient-specific baseline risk patterns; adjusting alert thresholds based on individual patient variability.',
    category: 'thresholds',
    implementation: 'Dynamic threshold visualization showing patient-specific adaptations, alert prevention counts, and personalized sensitivity adjustments.',
    componentPath: 'src/components/quality/AdaptiveThresholds.tsx',
    status: 'implemented',
    demoSection: 'workflow'
  },
  // Closed-Loop Feedback Claims (7)
  {
    number: 7,
    title: 'Closed-Loop Intervention Feedback',
    description: 'A closed-loop feedback system comprising: automatic detection of clinical interventions from data streams; application of intervention-specific effect delays; recalculation of risk scores post-intervention.',
    category: 'feedback',
    implementation: 'Animated feedback loop demonstration showing intervention detection → baseline capture → effect delay → risk recalculation → effectiveness quantification.',
    componentPath: 'src/components/quality/ClosedLoopFeedback.tsx',
    status: 'implemented',
    demoSection: 'workflow'
  },
  // Priority & Workflow Claims (8-10)
  {
    number: 8,
    title: 'Priority Scoring Algorithm',
    description: 'The system of claim 1, further comprising a priority scoring module that ranks patients based on composite risk across multiple nurse-sensitive outcomes.',
    category: 'workflow',
    implementation: 'Priority queue with composite scoring, dynamic reordering based on risk changes, and visual priority badges.',
    componentPath: 'src/components/dashboard/PriorityQueue.tsx',
    status: 'implemented',
    demoSection: 'patients'
  },
  {
    number: 9,
    title: 'Suggested Actions Generation',
    description: 'The system of claim 8, further comprising an intervention recommendation engine that generates suggested actions based on identified risk factors.',
    category: 'workflow',
    implementation: 'Context-aware suggested actions panel with evidence-based intervention recommendations tied to specific risk factors.',
    componentPath: 'src/components/dashboard/SuggestedActions.tsx',
    status: 'implemented',
    demoSection: 'workflow'
  },
  {
    number: 10,
    title: 'Intervention Timer',
    description: 'The system of claim 9, including intervention timing tracking to monitor time since last assessment and intervention windows.',
    category: 'workflow',
    implementation: 'Visual intervention timers showing time since last action, upcoming assessment windows, and overdue alerts.',
    componentPath: 'src/components/dashboard/InterventionTimer.tsx',
    status: 'implemented',
    demoSection: 'workflow'
  },
  // Dependent Claims (11-20)
  {
    number: 11,
    title: 'Risk Trend Visualization',
    description: 'The system of claim 5, further comprising sparkline visualizations showing risk trends over configurable time windows.',
    category: 'forecasting',
    implementation: 'Compact sparkline charts embedded in patient cards showing 24-hour risk trends with trend direction indicators.',
    componentPath: 'src/components/quality/RiskSparkline.tsx',
    status: 'implemented',
    demoSection: 'patients'
  },
  {
    number: 12,
    title: 'Multi-Outcome Comparison',
    description: 'The system of claim 1, further comprising a comparison view for analyzing risk patterns across multiple nurse-sensitive outcomes simultaneously.',
    category: 'system',
    implementation: 'Side-by-side outcome comparison panel showing Falls, HAPI, CAUTI, and device complication risks with comparative analysis.',
    componentPath: 'src/components/dashboard/MultiOutcomeComparison.tsx',
    status: 'implemented',
    demoSection: 'dashboard'
  },
  {
    number: 13,
    title: 'Clinical Workflow Integration',
    description: 'The system of claim 9, wherein suggested actions are integrated into clinical workflow stages.',
    category: 'workflow',
    implementation: 'Workflow sequence visualization showing progression from risk identification through intervention to outcome tracking.',
    componentPath: 'src/components/quality/ClinicalWorkflowView.tsx',
    status: 'implemented',
    demoSection: 'workflow'
  },
  {
    number: 14,
    title: 'Efficacy Badge System',
    description: 'The system of claim 7, further comprising efficacy badges indicating intervention effectiveness categories.',
    category: 'feedback',
    implementation: 'Visual efficacy indicators (High/Moderate/Low) based on historical intervention success rates.',
    componentPath: 'src/components/dashboard/EfficacyBadge.tsx',
    status: 'implemented',
    demoSection: 'workflow'
  },
  {
    number: 15,
    title: 'Unit-Level Dashboard Overview',
    description: 'The system of claim 1, further comprising an aggregate dashboard view showing unit-level risk distributions and metrics.',
    category: 'system',
    implementation: 'Dashboard overview with unit-wide statistics, risk category distributions, and aggregate performance metrics.',
    componentPath: 'src/components/quality/DashboardOverview.tsx',
    status: 'implemented',
    demoSection: 'dashboard'
  },
  {
    number: 16,
    title: 'Patient List View with Filtering',
    description: 'The system of claim 8, further comprising a filterable patient list with risk-based sorting and categorization.',
    category: 'workflow',
    implementation: 'Interactive patient list with risk level filters, outcome type filters, and dynamic sorting by priority score.',
    componentPath: 'src/components/quality/PatientListView.tsx',
    status: 'implemented',
    demoSection: 'patients'
  },
  {
    number: 17,
    title: 'Clinical Tooltip System',
    description: 'The system of claim 2, further comprising contextual tooltips providing clinical definitions and metric explanations.',
    category: 'explainability',
    implementation: 'Hover-activated tooltips explaining clinical terms (SHAP, MRN, LOS, AUROC) with plain-language descriptions.',
    componentPath: 'src/components/quality/ClinicalTooltip.tsx',
    status: 'implemented',
    demoSection: 'shap'
  },
  {
    number: 18,
    title: 'Grouped SHAP Analysis',
    description: 'The system of claim 2, further comprising grouped SHAP visualizations organizing factors by clinical category.',
    category: 'explainability',
    implementation: 'SHAP charts with categorical grouping (vitals, mobility, medications, history) for clearer clinical interpretation.',
    componentPath: 'src/components/dashboard/GroupedShapChart.tsx',
    status: 'implemented',
    demoSection: 'shap'
  },
  {
    number: 19,
    title: 'Live Simulation Mode',
    description: 'The system of claim 1, further comprising a demonstration mode with simulated real-time data updates.',
    category: 'system',
    implementation: 'Live simulation engine generating realistic risk fluctuations for demonstration and training purposes.',
    componentPath: 'src/hooks/useLiveSimulation.ts',
    status: 'implemented',
    demoSection: 'dashboard'
  },
  {
    number: 20,
    title: 'Research Disclaimer System',
    description: 'The system of claim 1, further comprising integrated research disclaimers and patent notices throughout the interface.',
    category: 'system',
    implementation: 'Persistent research banners, patent notices, and synthetic data disclaimers ensuring appropriate use context.',
    componentPath: 'src/components/ResearchDisclaimer.tsx',
    status: 'implemented',
    demoSection: 'intro'
  },
];

export const CATEGORY_CONFIG: Record<ClaimCategory, CategoryConfig> = {
  system: { label: 'System Architecture', icon: Brain, color: 'text-primary bg-primary/10 border-primary/30' },
  explainability: { label: 'SHAP Explainability', icon: BarChart3, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  forecasting: { label: 'Temporal Forecasting', icon: Clock, color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' },
  thresholds: { label: 'Adaptive Thresholds', icon: Sliders, color: 'text-accent bg-accent/10 border-accent/30' },
  feedback: { label: 'Closed-Loop Feedback', icon: RefreshCw, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
  workflow: { label: 'Clinical Workflow', icon: Activity, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
};
