import { Brain, BarChart3, Clock, Sliders, RefreshCw, Activity, Shield, Heart, Users, FileText, Layers, Timer, Dna } from 'lucide-react';
import type { PatentClaim, CategoryConfig, ClaimCategory } from '@/types/patent';

// ========== PATENT #1: TRUST-BASED ALERT SYSTEM ==========
const TRUST_ALERT_CLAIMS: PatentClaim[] = [
  {
    number: 1,
    title: 'Trust-Based Alert Prioritization System',
    description: 'A clinical decision support system implementing trust-based alert prioritization through composite reliability scoring that integrates historical accuracy, clinician feedback, temporal relevance, and data quality metrics.',
    category: 'trust',
    implementation: 'TrustScoreAlgorithm component with interactive sliders showing composite trust calculation and threshold-based alert filtering.',
    componentPath: 'src/components/dashboard/TrustScoreAlgorithm.tsx',
    status: 'demonstrated',
    demoSection: 'patents',
    patentId: 'trust-alerts'
  },
  {
    number: 2,
    title: 'Workload-Adaptive Threshold Adjustment',
    description: 'The system of claim 1, wherein alert confidence thresholds dynamically adjust based on clinician cognitive load, with higher workload states triggering stricter filtering to reduce alert fatigue.',
    category: 'trust',
    implementation: 'TrustBasedAlertSystem with workload selector (low/moderate/high) adjusting confidence thresholds from 50% to 85%.',
    componentPath: 'src/components/dashboard/TrustBasedAlertSystem.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'trust-alerts'
  },
  {
    number: 3,
    title: 'Critical Alert Bypass Mechanism',
    description: 'The system of claim 2, wherein alerts classified as critical bypass all filtering thresholds to ensure patient safety while non-critical alerts are subject to trust-based suppression.',
    category: 'trust',
    implementation: 'Critical alerts (e.g., septic shock protocols) always display regardless of trust score or workload settings.',
    componentPath: 'src/components/dashboard/TrustBasedAlertSystem.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'trust-alerts'
  },
  {
    number: 4,
    title: 'Demographic Equity Monitoring Engine',
    description: 'A subsystem for monitoring alert system equity across demographic groups, calculating disparity indices and flagging potential algorithmic bias in real-time.',
    category: 'equity',
    implementation: 'EquityMonitoringEngine with demographic group analysis, disparity index calculation, and bias detection alerts.',
    componentPath: 'src/components/dashboard/EquityMonitoringEngine.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'trust-alerts'
  },
  {
    number: 5,
    title: 'Cognitive Load Index Calculation',
    description: 'A method for calculating real-time cognitive load index comprising response time percentile, interruption frequency, documentation velocity, and patient load weighted factors.',
    category: 'trust',
    implementation: 'CognitiveLoadOptimizer with animated gauge, factor breakdown, and adaptive threshold visualization.',
    componentPath: 'src/components/dashboard/CognitiveLoadOptimizer.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'trust-alerts'
  },
  {
    number: 6,
    title: 'Alert Grouping and Deferral',
    description: 'The system of claim 5, further comprising alert grouping for similar notifications and temporal deferral of non-urgent alerts during high cognitive load periods.',
    category: 'trust',
    implementation: 'Alert grouping consolidation (+N badges) and delay queuing for non-urgent alerts with countdown timers.',
    componentPath: 'src/components/dashboard/CognitiveLoadOptimizer.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'trust-alerts'
  },
];

// ========== PATENT #2: CLINICAL RISK INTELLIGENCE ==========
const RISK_INTELLIGENCE_CLAIMS: PatentClaim[] = [
  {
    number: 1,
    title: 'Clinical Risk Intelligence System',
    description: 'A clinical risk intelligence system for predicting nurse-sensitive patient outcomes, comprising: a data ingestion module configured to receive real-time patient data from electronic health record systems; a multi-outcome risk prediction engine utilizing machine learning models trained on nurse-sensitive outcomes.',
    category: 'system',
    implementation: 'Full dashboard system with real-time EHR data integration, multi-outcome risk scoring for Falls, HAPI, CAUTI, and device complications.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'demonstrated',
    demoSection: 'dashboard',
    patentId: 'risk-intelligence'
  },
  {
    number: 2,
    title: 'SHAP Explainability Integration',
    description: 'The system of claim 1, wherein the explainability module utilizes SHapley Additive exPlanations (SHAP) to decompose predicted risk scores into individual feature contributions.',
    category: 'explainability',
    implementation: 'Interactive SHAP waterfall charts showing how each clinical factor (mobility, medications, vitals) contributes to the final risk score.',
    componentPath: 'src/components/quality/ShapExplainability.tsx',
    status: 'implemented',
    demoSection: 'shap',
    patentId: 'risk-intelligence'
  },
  {
    number: 3,
    title: 'Waterfall Visualization',
    description: 'The system of claim 2, further comprising a waterfall visualization component that displays cumulative risk attribution from baseline through each contributing factor.',
    category: 'explainability',
    implementation: 'Animated waterfall bars with cumulative risk tracking, color-coded risk/protective factors, and interactive tooltips explaining each contribution.',
    componentPath: 'src/components/quality/ShapExplainability.tsx',
    status: 'implemented',
    demoSection: 'shap',
    patentId: 'risk-intelligence'
  },
  {
    number: 4,
    title: 'Confidence Scoring',
    description: 'The system of claim 1, wherein each risk prediction includes a confidence interval based on model uncertainty quantification.',
    category: 'system',
    implementation: 'Confidence indicators displayed on each risk score, with visual representation of prediction certainty.',
    componentPath: 'src/components/quality/ConfidenceIndicator.tsx',
    status: 'implemented',
    demoSection: 'patients',
    patentId: 'risk-intelligence'
  },
  {
    number: 5,
    title: 'Multi-Horizon Temporal Forecasting',
    description: 'A method for temporal risk forecasting comprising: generating risk predictions at multiple time horizons including 4-hour, 12-hour, 24-hour, and 48-hour intervals; calculating trajectory classifications for each horizon.',
    category: 'forecasting',
    implementation: 'Interactive forecast charts showing risk trajectories at 4h, 12h, 24h, 48h horizons with confidence bands and trajectory classification (improving/stable/deteriorating).',
    componentPath: 'src/components/quality/TemporalForecasting.tsx',
    status: 'implemented',
    demoSection: 'workflow',
    patentId: 'risk-intelligence'
  },
  {
    number: 6,
    title: 'Patient-Adaptive Alert Thresholds',
    description: 'A system for adaptive alert threshold management comprising: calculating patient-specific baseline risk patterns; adjusting alert thresholds based on individual patient variability.',
    category: 'thresholds',
    implementation: 'Dynamic threshold visualization showing patient-specific adaptations, alert prevention counts, and personalized sensitivity adjustments.',
    componentPath: 'src/components/quality/AdaptiveThresholds.tsx',
    status: 'implemented',
    demoSection: 'workflow',
    patentId: 'risk-intelligence'
  },
  {
    number: 7,
    title: 'Closed-Loop Intervention Feedback',
    description: 'A closed-loop feedback system comprising: automatic detection of clinical interventions from data streams; application of intervention-specific effect delays; recalculation of risk scores post-intervention.',
    category: 'feedback',
    implementation: 'Animated feedback loop demonstration showing intervention detection → baseline capture → effect delay → risk recalculation → effectiveness quantification.',
    componentPath: 'src/components/quality/ClosedLoopFeedback.tsx',
    status: 'implemented',
    demoSection: 'workflow',
    patentId: 'risk-intelligence'
  },
  {
    number: 8,
    title: 'Priority Scoring Algorithm',
    description: 'The system of claim 1, further comprising a priority scoring module that ranks patients based on composite risk across multiple nurse-sensitive outcomes.',
    category: 'workflow',
    implementation: 'Priority queue with composite scoring, dynamic reordering based on risk changes, and visual priority badges.',
    componentPath: 'src/components/dashboard/PriorityQueue.tsx',
    status: 'implemented',
    demoSection: 'patients',
    patentId: 'risk-intelligence'
  },
  {
    number: 9,
    title: 'Suggested Actions Generation',
    description: 'The system of claim 8, further comprising an intervention recommendation engine that generates suggested actions based on identified risk factors.',
    category: 'workflow',
    implementation: 'Context-aware suggested actions panel with evidence-based intervention recommendations tied to specific risk factors.',
    componentPath: 'src/components/dashboard/SuggestedActions.tsx',
    status: 'implemented',
    demoSection: 'workflow',
    patentId: 'risk-intelligence'
  },
  {
    number: 10,
    title: 'Intervention Timer',
    description: 'The system of claim 9, including intervention timing tracking to monitor time since last assessment and intervention windows.',
    category: 'workflow',
    implementation: 'Visual intervention timers showing time since last action, upcoming assessment windows, and overdue alerts.',
    componentPath: 'src/components/dashboard/InterventionTimer.tsx',
    status: 'implemented',
    demoSection: 'workflow',
    patentId: 'risk-intelligence'
  },
  {
    number: 11,
    title: 'Risk Trend Visualization',
    description: 'The system of claim 5, further comprising sparkline visualizations showing risk trends over configurable time windows.',
    category: 'forecasting',
    implementation: 'Compact sparkline charts embedded in patient cards showing 24-hour risk trends with trend direction indicators.',
    componentPath: 'src/components/quality/RiskSparkline.tsx',
    status: 'implemented',
    demoSection: 'patients',
    patentId: 'risk-intelligence'
  },
  {
    number: 12,
    title: 'Multi-Outcome Comparison',
    description: 'The system of claim 1, further comprising a comparison view for analyzing risk patterns across multiple nurse-sensitive outcomes simultaneously.',
    category: 'system',
    implementation: 'Side-by-side outcome comparison panel showing Falls, HAPI, CAUTI, and device complication risks with comparative analysis.',
    componentPath: 'src/components/dashboard/MultiOutcomeComparison.tsx',
    status: 'implemented',
    demoSection: 'dashboard',
    patentId: 'risk-intelligence'
  },
  {
    number: 13,
    title: 'Clinical Workflow Integration',
    description: 'The system of claim 9, wherein suggested actions are integrated into clinical workflow stages.',
    category: 'workflow',
    implementation: 'Workflow sequence visualization showing progression from risk identification through intervention to outcome tracking.',
    componentPath: 'src/components/quality/ClinicalWorkflowView.tsx',
    status: 'implemented',
    demoSection: 'workflow',
    patentId: 'risk-intelligence'
  },
  {
    number: 14,
    title: 'Efficacy Badge System',
    description: 'The system of claim 7, further comprising efficacy badges indicating intervention effectiveness categories.',
    category: 'feedback',
    implementation: 'Visual efficacy indicators (High/Moderate/Low) based on historical intervention success rates.',
    componentPath: 'src/components/dashboard/EfficacyBadge.tsx',
    status: 'implemented',
    demoSection: 'workflow',
    patentId: 'risk-intelligence'
  },
  {
    number: 15,
    title: 'Unit-Level Dashboard Overview',
    description: 'The system of claim 1, further comprising an aggregate dashboard view showing unit-level risk distributions and metrics.',
    category: 'system',
    implementation: 'Dashboard overview with unit-wide statistics, risk category distributions, and aggregate performance metrics.',
    componentPath: 'src/components/quality/DashboardOverview.tsx',
    status: 'implemented',
    demoSection: 'dashboard',
    patentId: 'risk-intelligence'
  },
  {
    number: 16,
    title: 'Patient List View with Filtering',
    description: 'The system of claim 8, further comprising a filterable patient list with risk-based sorting and categorization.',
    category: 'workflow',
    implementation: 'Interactive patient list with risk level filters, outcome type filters, and dynamic sorting by priority score.',
    componentPath: 'src/components/quality/PatientListView.tsx',
    status: 'implemented',
    demoSection: 'patients',
    patentId: 'risk-intelligence'
  },
  {
    number: 17,
    title: 'Clinical Tooltip System',
    description: 'The system of claim 2, further comprising contextual tooltips providing clinical definitions and metric explanations.',
    category: 'explainability',
    implementation: 'Hover-activated tooltips explaining clinical terms (SHAP, MRN, LOS, AUROC) with plain-language descriptions.',
    componentPath: 'src/components/quality/ClinicalTooltip.tsx',
    status: 'implemented',
    demoSection: 'shap',
    patentId: 'risk-intelligence'
  },
  {
    number: 18,
    title: 'Grouped SHAP Analysis',
    description: 'The system of claim 2, further comprising grouped SHAP visualizations organizing factors by clinical category.',
    category: 'explainability',
    implementation: 'SHAP charts with categorical grouping (vitals, mobility, medications, history) for clearer clinical interpretation.',
    componentPath: 'src/components/dashboard/GroupedShapChart.tsx',
    status: 'implemented',
    demoSection: 'shap',
    patentId: 'risk-intelligence'
  },
  {
    number: 19,
    title: 'Live Simulation Mode',
    description: 'The system of claim 1, further comprising a demonstration mode with simulated real-time data updates.',
    category: 'system',
    implementation: 'Live simulation engine generating realistic risk fluctuations for demonstration and training purposes.',
    componentPath: 'src/hooks/useLiveSimulation.ts',
    status: 'implemented',
    demoSection: 'dashboard',
    patentId: 'risk-intelligence'
  },
  {
    number: 20,
    title: 'Research Disclaimer System',
    description: 'The system of claim 1, further comprising integrated research disclaimers and patent notices throughout the interface.',
    category: 'system',
    implementation: 'Persistent research banners, patent notices, and synthetic data disclaimers ensuring appropriate use context.',
    componentPath: 'src/components/ResearchDisclaimer.tsx',
    status: 'implemented',
    demoSection: 'intro',
    patentId: 'risk-intelligence'
  },
];

// ========== PATENT #3: UNIFIED NURSING INTELLIGENCE ==========
const UNIFIED_PLATFORM_CLAIMS: PatentClaim[] = [
  {
    number: 1,
    title: 'Unified Nursing Intelligence Platform',
    description: 'An integrated platform combining workload prediction, clinical risk intelligence, and trust-based alert systems into a cohesive nursing decision support environment.',
    category: 'integration',
    implementation: 'Dashboard integrating DBS, risk scoring, and trust-based alerts with synchronized patient views.',
    componentPath: 'src/pages/Dashboard.tsx',
    status: 'demonstrated',
    demoSection: 'dashboard',
    patentId: 'unified-platform'
  },
  {
    number: 2,
    title: 'Cross-System Data Fusion',
    description: 'The platform of claim 1, wherein patient data from multiple clinical systems is fused to provide comprehensive nursing workload and risk assessments.',
    category: 'integration',
    implementation: 'EHR data integration diagram showing data flow from vitals, labs, medications, and documentation systems.',
    componentPath: 'src/components/quality/EHRIntegrationDiagram.tsx',
    status: 'implemented',
    demoSection: 'workflow',
    patentId: 'unified-platform'
  },
  {
    number: 3,
    title: 'Workload-Risk Correlation Analysis',
    description: 'The platform of claim 1, further comprising analytical tools correlating nursing workload metrics with patient risk outcomes.',
    category: 'workload',
    implementation: 'LinkedCalculatorView showing DBS and ROI metrics side-by-side with correlation indicators.',
    componentPath: 'src/components/dashboard/LinkedCalculatorView.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'unified-platform'
  },
  {
    number: 4,
    title: 'Shift Handoff Report Generation',
    description: 'A method for generating comprehensive shift handoff reports incorporating risk scores, workload metrics, and pending interventions.',
    category: 'workflow',
    implementation: 'Automated handoff report generator with risk summaries, intervention tracking, and priority patient lists.',
    componentPath: 'src/components/reports/HandoffReport.tsx',
    status: 'implemented',
    demoSection: 'workflow',
    patentId: 'unified-platform'
  },
  {
    number: 5,
    title: 'Neural Reasoning Engine',
    description: 'The platform of claim 1, incorporating a neural reasoning engine that provides clinical chain-of-thought explanations for risk predictions.',
    category: 'integration',
    implementation: 'NeuralReasoningEngine with attention visualization, confidence intervals, and reasoning chain display.',
    componentPath: 'src/components/dashboard/NeuralReasoningEngine.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'unified-platform'
  },
  {
    number: 6,
    title: 'Population Trend Aggregation',
    description: 'The platform of claim 1, further comprising population-level trend aggregation for unit-wide risk monitoring.',
    category: 'system',
    implementation: 'PopulationTrendAggregation showing unit-wide risk distributions and temporal trends.',
    componentPath: 'src/components/dashboard/PopulationTrendAggregation.tsx',
    status: 'implemented',
    demoSection: 'dashboard',
    patentId: 'unified-platform'
  },
];

// ========== PATENT #4: DBS SYSTEM ==========
const DBS_SYSTEM_CLAIMS: PatentClaim[] = [
  {
    number: 1,
    title: 'Documentation Burden Score System',
    description: 'A system and method for predicting documentation burden using machine learning, comprising weighted clinical acuity, organ dysfunction, comorbidity, medication complexity, and demographic factors.',
    category: 'dbs',
    implementation: 'DBSCalculator with interactive sliders for each factor, real-time score calculation, and quartile classification.',
    componentPath: 'src/components/dashboard/DBSCalculator.tsx',
    status: 'demonstrated',
    demoSection: 'patents',
    patentId: 'dbs-system'
  },
  {
    number: 2,
    title: 'DBS Quartile Classification',
    description: 'The system of claim 1, wherein calculated DBS scores are classified into quartiles (Q1-Q4) with associated staffing ratio recommendations.',
    category: 'dbs',
    implementation: 'Quartile visualization with color-coded complexity levels (Low/Moderate/High/Very High) and staffing ratios.',
    componentPath: 'src/components/dashboard/DBSCalculator.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'dbs-system'
  },
  {
    number: 3,
    title: 'Weighted Factor Calculation Method',
    description: 'The system of claim 1, implementing a proprietary weighted factor calculation combining clinical acuity, organ dysfunction, comorbidity, medication complexity, and demographic inputs normalized to a 0-100 scale.',
    category: 'dbs',
    implementation: 'DBSCalculationBreakdown showing per-factor contributions with interactive weight visualization.',
    componentPath: 'src/components/dashboard/DBSCalculationBreakdown.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'dbs-system'
  },
  {
    number: 4,
    title: 'Patient Profile Comparison',
    description: 'The system of claim 2, further comprising patient profile saving and comparison functionality for scenario analysis.',
    category: 'dbs',
    implementation: 'Save/compare patient profiles with up to 4 scenarios, including preset clinical profiles (Typical ICU, Post-Surgical, etc.).',
    componentPath: 'src/components/dashboard/DBSCalculator.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'dbs-system'
  },
  {
    number: 5,
    title: 'ROI Calculation Integration',
    description: 'The system of claim 1, integrated with return-on-investment calculations showing projected savings from optimized staffing based on DBS predictions.',
    category: 'dbs',
    implementation: 'ROICalculator linked to DBS scores with annual savings projections and payback period calculations.',
    componentPath: 'src/components/dashboard/ROICalculator.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'dbs-system'
  },
  {
    number: 6,
    title: 'Linked Calculator View',
    description: 'A unified interface presenting DBS calculation alongside hospital operational metrics for burden-adjusted impact analysis.',
    category: 'dbs',
    implementation: 'LinkedCalculatorView with side-by-side DBS and ROI calculators, linked presets, and scenario comparison.',
    componentPath: 'src/components/dashboard/LinkedCalculatorView.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'dbs-system'
  },
  {
    number: 7,
    title: 'Clinical Preset Profiles',
    description: 'The system of claim 4, including predefined clinical preset profiles representing common patient populations (ICU, Post-Surgical, Geriatric, Trauma, Cardiac, Sepsis).',
    category: 'dbs',
    implementation: 'Six preset patient profiles with one-click loading and visual complexity indicators.',
    componentPath: 'src/components/dashboard/DBSCalculator.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'dbs-system'
  },
  {
    number: 8,
    title: 'Research Validation Display',
    description: 'The system of claim 1, further comprising integrated research validation metrics including patient cohort size, outcome correlations, and statistical significance.',
    category: 'dbs',
    implementation: 'Research validation section showing 12,847 patient validation cohort, AUROC, and outcome correlations.',
    componentPath: 'src/components/dashboard/DBSCalculator.tsx',
    status: 'implemented',
    demoSection: 'patents',
    patentId: 'dbs-system'
  },
];

// ========== PATENT #5: ICU MORTALITY PREDICTION (Filed Feb 2026) ==========
const ICU_MORTALITY_CLAIMS: PatentClaim[] = [
  {
    number: 1,
    title: 'Documentation Rhythm Pattern Analysis System',
    description: 'A system and method for predicting ICU mortality utilizing documentation rhythm patterns derived from EHR timestamp metadata, implementing a "human sensor" approach that treats nursing documentation patterns as a physiological signal.',
    category: 'temporal',
    implementation: 'Temporal feature extraction pipeline analyzing documentation timestamps to detect rhythm patterns indicative of clinical status.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'demonstrated',
    demoSection: 'dashboard',
    patentId: 'icu-mortality'
  },
  {
    number: 2,
    title: 'Temporal Feature Extraction Module',
    description: 'The system of claim 1, comprising extraction of 9 IDI temporal features organized into three domains: event volume (total events, events per hour), rhythm regularity (coefficient of variation, standard deviation, mean inter-event interval, burstiness index), and surveillance gaps (gaps >60min, gaps >120min, maximum gap duration).',
    category: 'temporal',
    implementation: 'Feature extraction engine computing 9 IDI metrics from EHR timestamp data across volume, rhythm, and gap domains.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'prototype',
    demoSection: 'patents',
    patentId: 'icu-mortality'
  },
  {
    number: 3,
    title: 'Clinical Documentation Phenotype Clustering',
    description: 'An unsupervised clustering module identifying four distinct clinical documentation phenotypes: Steady Surveillance (3.2% mortality), Minimal Documentation (8.7% mortality), Escalating Crisis (15.3% mortality), and Chaotic Instability (24.1% mortality).',
    category: 'phenotype',
    implementation: 'K-means clustering visualization showing four phenotype clusters with mortality stratification and transition probabilities.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'demonstrated',
    demoSection: 'patents',
    patentId: 'icu-mortality'
  },
  {
    number: 4,
    title: 'Equipment-Independent Risk Stratification',
    description: 'The system of claim 1, achieving AUC of 0.683 (95% CI: 0.631-0.732) for mortality prediction using only EHR timestamp metadata without requiring physiological monitoring equipment, enabling deployment in resource-limited settings.',
    category: 'system',
    implementation: 'Risk stratification module operating on timestamp-only data, validated against MIMIC-IV with 26,153 heart failure ICU admissions.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'demonstrated',
    demoSection: 'patents',
    patentId: 'icu-mortality'
  },
  {
    number: 5,
    title: 'Documentation Entropy Calculator',
    description: 'A method for calculating documentation entropy as a measure of documentation pattern disorder, wherein higher entropy values correlate with clinical instability and adverse outcomes.',
    category: 'temporal',
    implementation: 'Shannon entropy calculation from documentation interval distributions with real-time monitoring and trend alerts.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'prototype',
    demoSection: 'patents',
    patentId: 'icu-mortality'
  },
  {
    number: 6,
    title: 'Phenotype Transition Detection',
    description: 'The system of claim 3, further comprising real-time phenotype transition detection that identifies patients moving between documentation phenotypes, with transitions to Chaotic Instability triggering early warning alerts.',
    category: 'phenotype',
    implementation: 'Phenotype state machine tracking transitions between clusters with alert generation on deterioration trajectories.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'prototype',
    demoSection: 'patents',
    patentId: 'icu-mortality'
  },
  {
    number: 7,
    title: 'Circadian Documentation Alignment',
    description: 'The system of claim 2, wherein circadian alignment scores quantify deviation from expected documentation patterns across day/night cycles, with misalignment serving as an independent mortality predictor.',
    category: 'temporal',
    implementation: 'Circadian rhythm visualization showing documentation density across 24-hour periods with alignment scoring.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'prototype',
    demoSection: 'patents',
    patentId: 'icu-mortality'
  },
  {
    number: 8,
    title: 'Zero-Cost Monitoring Deployment',
    description: 'A deployment method for the system of claim 4, requiring zero additional hardware or equipment costs, utilizing only existing EHR infrastructure to provide mortality risk stratification.',
    category: 'system',
    implementation: 'Deployment architecture leveraging existing EHR data streams with no additional sensor requirements.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'demonstrated',
    demoSection: 'patents',
    patentId: 'icu-mortality'
  },
  {
    number: 9,
    title: 'Multi-Variable ML Prediction',
    description: 'The system of claim 1, employing a multi-variable machine learning approach with model-specific feature importance extraction.',
    category: 'system',
    implementation: 'ML model comparison with feature importance rankings. Validated performance.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'demonstrated',
    demoSection: 'patents',
    patentId: 'icu-mortality'
  },
  {
    number: 10,
    title: 'MIMIC-IV Validated Cohort Analysis',
    description: 'The system of claim 4, validated on a cohort of 26,153 heart failure ICU admissions from the MIMIC-IV database (2008-2019) with 15.99% in-hospital mortality rate (n=4,181 deaths), demonstrating statistically significant phenotype-mortality associations (p < 0.001).',
    category: 'system',
    implementation: 'Research validation dashboard showing cohort demographics, mortality outcomes, and statistical significance metrics.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'demonstrated',
    demoSection: 'patents',
    patentId: 'icu-mortality'
  },
];

// Combined patent claims array
export const PATENT_CLAIMS: PatentClaim[] = [
  ...TRUST_ALERT_CLAIMS,
  ...RISK_INTELLIGENCE_CLAIMS,
  ...UNIFIED_PLATFORM_CLAIMS,
  ...DBS_SYSTEM_CLAIMS,
  ...ICU_MORTALITY_CLAIMS,
];

// Helper to get claims by patent ID
export const getClaimsByPatent = (patentId: PatentClaim['patentId']) => 
  PATENT_CLAIMS.filter(claim => claim.patentId === patentId);

// Category configuration with icons and colors
export const CATEGORY_CONFIG: Record<ClaimCategory, CategoryConfig> = {
  system: { label: 'System Architecture', icon: Brain, color: 'text-primary bg-primary/10 border-primary/30' },
  explainability: { label: 'SHAP Explainability', icon: BarChart3, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  forecasting: { label: 'Temporal Forecasting', icon: Clock, color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' },
  thresholds: { label: 'Adaptive Thresholds', icon: Sliders, color: 'text-accent bg-accent/10 border-accent/30' },
  feedback: { label: 'Closed-Loop Feedback', icon: RefreshCw, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
  workflow: { label: 'Clinical Workflow', icon: Activity, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
  trust: { label: 'Trust-Based Alerts', icon: Shield, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30' },
  equity: { label: 'Equity Monitoring', icon: Heart, color: 'text-pink-500 bg-pink-500/10 border-pink-500/30' },
  dbs: { label: 'Documentation Burden', icon: FileText, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30' },
  workload: { label: 'Workload Prediction', icon: Users, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
  integration: { label: 'Platform Integration', icon: Layers, color: 'text-violet-500 bg-violet-500/10 border-violet-500/30' },
  temporal: { label: 'Temporal Patterns', icon: Timer, color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' },
  phenotype: { label: 'Clinical Phenotypes', icon: Dna, color: 'text-teal-500 bg-teal-500/10 border-teal-500/30' },
};

// Patent metadata for display
export const PATENT_METADATA = {
  'trust-alerts': {
    shortName: 'Trust-Based Alert System',
    claimCount: TRUST_ALERT_CLAIMS.length,
  },
  'risk-intelligence': {
    shortName: 'Clinical Risk Intelligence',
    claimCount: RISK_INTELLIGENCE_CLAIMS.length,
  },
  'unified-platform': {
    shortName: 'Unified Nursing Intelligence',
    claimCount: UNIFIED_PLATFORM_CLAIMS.length,
  },
  'dbs-system': {
    shortName: 'DBS System',
    claimCount: DBS_SYSTEM_CLAIMS.length,
  },
  'icu-mortality': {
    shortName: 'ICU Mortality Prediction',
    claimCount: ICU_MORTALITY_CLAIMS.length,
  },
};
