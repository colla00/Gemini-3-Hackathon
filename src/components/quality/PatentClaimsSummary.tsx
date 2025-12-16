import { Award, ChevronDown, FileText, Scale, Zap, Shield, TrendingUp, Target } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PatentClaim {
  id: number;
  title: string;
  type: 'independent' | 'dependent';
  dependsOn?: number;
  summary: string;
  details: string[];
  technicalNovelty: string[];
  priorArtDifferentiation: string;
  quantitativeMetrics?: string[];
}

const patentClaims: PatentClaim[] = [
  {
    id: 1,
    title: 'Computer-Implemented Method for NSO Prediction',
    type: 'independent',
    summary: 'A computer-implemented method for predicting nurse-sensitive outcomes (NSOs) in hospitalized patients using machine learning with explainable AI.',
    details: [
      'Receiving continuous patient data streams from EHR systems via HL7 FHIR R4',
      'Preprocessing data using clinical domain knowledge with automated imputation',
      'Applying gradient boosting machine learning model (XGBoost with n_estimators=500)',
      'Generating TreeSHAP values for mathematically exact risk attribution',
      'Multi-horizon temporal forecasting (4h, 12h, 24h, 48h) with quantile regression',
      'Adaptive threshold mechanism with patient-specific baseline calculation',
      'Closed-loop feedback integration for real-time intervention effectiveness tracking',
    ],
    technicalNovelty: [
      'Novel combination of TreeSHAP with clinical workflow integration',
      'Unique multi-horizon forecasting with trajectory classification',
      'First adaptive threshold system for NSO prediction',
      'Patentable closed-loop feedback quantification methodology',
    ],
    priorArtDifferentiation: 'Unlike Epic Sepsis Model (single outcome, black-box) and MEWS/NEWS (rule-based, manual), our method provides multi-NSO prediction with real-time explainability and adaptive thresholds.',
    quantitativeMetrics: [
      'AUROC 0.89 (95% CI: 0.87-0.91)',
      'Sensitivity 0.87, Specificity 0.86',
      'Inference latency <100ms per patient',
    ],
  },
  {
    id: 2,
    title: 'Gradient Boosting Trees Implementation',
    type: 'dependent',
    dependsOn: 1,
    summary: 'The machine learning model comprises gradient boosting trees trained on labeled clinical datasets with hyperparameter optimization.',
    details: [
      'XGBoost/LightGBM architecture with TreeSHAP integration',
      'Training on HiRID (33K ICU stays), MIMIC-IV (200K admissions), eICU (140K stays)',
      'Hyperparameter optimization via 5-fold stratified cross-validation',
      'Early stopping with validation loss monitoring',
      'Platt scaling for probability calibration',
    ],
    technicalNovelty: [
      'Specific hyperparameter configuration optimized for NSO prediction',
      'Multi-database training with domain adaptation',
      'Calibration methodology for clinical decision support',
    ],
    priorArtDifferentiation: 'Traditional clinical scores (Rothman Index, Braden Scale) use rule-based logic; our gradient boosting captures non-linear feature interactions across 50+ variables.',
    quantitativeMetrics: [
      '373,000+ patient encounters in training',
      'Feature stability >0.95 across folds',
      'Brier score 0.08 (well-calibrated)',
    ],
  },
  {
    id: 3,
    title: 'Multi-Horizon Temporal Forecasting',
    type: 'dependent',
    dependsOn: 1,
    summary: 'Generates risk predictions at multiple time horizons with trajectory classification and inflection point detection.',
    details: [
      'Risk trajectories at 4h, 12h, 24h, and 48h horizons',
      'Confidence intervals using quantile regression (5th, 50th, 95th percentiles)',
      'Trajectory classification: stable, improving, deteriorating, volatile via slope analysis',
      'Inflection point detection using second derivative analysis with smoothing',
      'Mann-Kendall trend test for statistical significance',
    ],
    technicalNovelty: [
      'Novel trajectory classification algorithm for clinical use',
      'Patentable inflection point detection methodology',
      'Multi-horizon confidence interval calibration',
    ],
    priorArtDifferentiation: 'Existing early warning scores provide point-in-time assessment; our forecasting predicts risk evolution enabling proactive rather than reactive interventions.',
    quantitativeMetrics: [
      '4h horizon AUROC: 0.91',
      '48h horizon AUROC: 0.84',
      'Trajectory accuracy: 87%',
    ],
  },
  {
    id: 4,
    title: 'Adaptive Threshold Mechanism',
    type: 'dependent',
    dependsOn: 1,
    summary: 'Calculates patient-specific alert thresholds based on individual baseline risk, volatility, and clinical context.',
    details: [
      'Formula: Threshold = μ_baseline + (k × σ_individual)',
      'k factor ranges from 1.5 to 3.0 based on clinical context',
      'Context adjustments: surgical (+0.3), chronic conditions (-0.2)',
      'Rolling 72-hour baseline window with exponential smoothing',
      'Dynamic recalibration based on patient trajectory',
    ],
    technicalNovelty: [
      'Patentable threshold formula with context-aware k-factor',
      'Novel approach to alert fatigue reduction in clinical AI',
      'Patient-specific rather than population-based thresholds',
    ],
    priorArtDifferentiation: 'Epic and Cerner systems use static population thresholds causing 55%+ false positive rates; our adaptive method reduces false positives by 40-70%.',
    quantitativeMetrics: [
      '40-70% false positive reduction',
      'Alert-to-intervention ratio: 3:1 (vs 8:1 baseline)',
      'Nurse satisfaction +2.1 points',
    ],
  },
  {
    id: 5,
    title: 'Closed-Loop Feedback Integration',
    type: 'dependent',
    dependsOn: 1,
    summary: 'Automatically detects interventions from EHR streams and quantifies their effectiveness using causal inference.',
    details: [
      'Real-time intervention detection from medication admin, procedures, assessments',
      'Pre-intervention risk state capture with timestamping',
      'Intervention-specific effect delay periods (repositioning: 15min, catheter removal: 2h)',
      'Post-intervention risk recalculation with attribution',
      'Propensity score matching for effectiveness estimation',
    ],
    technicalNovelty: [
      'Novel intervention detection algorithm from EHR event streams',
      'Patentable effectiveness quantification methodology',
      'Real-time causal inference for clinical feedback',
    ],
    priorArtDifferentiation: 'No existing CDSS provides automated intervention tracking with effectiveness quantification; traditional systems require manual outcome documentation.',
    quantitativeMetrics: [
      'Detection accuracy: 96% within 5 minutes',
      'Average risk reduction: 23% for timely interventions',
      'Feedback latency: <30 seconds',
    ],
  },
  {
    id: 6,
    title: 'Non-Transitory Computer-Readable Medium',
    type: 'independent',
    summary: 'A non-transitory computer-readable medium storing executable instructions and data structures for NSO prediction.',
    details: [
      'Executable instructions for complete NSO prediction pipeline',
      'ONNX model serialization for cross-platform deployment',
      'Protocol Buffer data structures for patient risk profiles',
      'Redis caching schemas for real-time SHAP value storage',
      'Configuration parameters for threshold adaptation',
    ],
    technicalNovelty: [
      'Specific data structure design for clinical AI deployment',
      'Novel serialization approach for explainable ML models',
      'Optimized storage for real-time clinical use',
    ],
    priorArtDifferentiation: 'Generic ML deployment frameworks lack clinical-specific optimizations; our medium includes NSO-specific data structures and clinical workflow integration.',
    quantitativeMetrics: [
      'Model artifact: <50MB',
      'Memory: <2GB for 500 patients',
      'Storage: 10KB per patient profile',
    ],
  },
  {
    id: 7,
    title: 'SHAP Value Generation Method',
    type: 'dependent',
    dependsOn: 6,
    summary: 'Generating TreeSHAP values with O(TLD) complexity for exact feature attribution in real-time clinical display.',
    details: [
      'TreeSHAP algorithm optimized for gradient boosting models',
      'O(TLD) complexity vs O(TL2^M) for kernel SHAP',
      'Clinical feature grouping (vitals, labs, assessments, devices)',
      'Risk/protective color mapping (red: >0.05, green: <-0.05 contribution)',
      'Cumulative waterfall visualization for nursing interpretation',
    ],
    technicalNovelty: [
      'Novel clinical interpretation mapping for SHAP values',
      'Patentable feature grouping methodology for healthcare',
      'Real-time SHAP display optimized for nursing workflows',
    ],
    priorArtDifferentiation: 'LIME provides approximations with instability; our TreeSHAP gives exact, consistent attributions in <50ms enabling real-time clinical use.',
    quantitativeMetrics: [
      'SHAP computation: <50ms per patient',
      'Top-5 features explain >80% variance',
      'Clinical agreement: 92%',
    ],
  },
  {
    id: 8,
    title: 'System for NSO Prediction',
    type: 'independent',
    summary: 'A system comprising distributed processors, memory, and microservices modules for scalable NSO prediction.',
    details: [
      'Data ingestion module with HL7 FHIR R4 and ADT feed support',
      'Preprocessing module with clinical validation and imputation',
      'ML inference engine with Kubernetes orchestration',
      'Explainability module with TreeSHAP generation',
      'Alert generation module with adaptive thresholds',
      'Feedback module for intervention tracking and effectiveness',
    ],
    technicalNovelty: [
      'Novel microservices architecture for clinical AI',
      'Patentable module integration for end-to-end NSO prediction',
      'Scalable design supporting 10,000+ concurrent patients',
    ],
    priorArtDifferentiation: 'Existing clinical systems are monolithic or require manual integration; our system provides automated, scalable, end-to-end NSO prediction with explainability.',
    quantitativeMetrics: [
      'Horizontal scaling: 10,000+ patients',
      'Uptime SLA: 99.9%',
      'End-to-end latency: <5 seconds',
    ],
  },
  {
    id: 9,
    title: 'Clinical Workflow Integration Module',
    type: 'dependent',
    dependsOn: 8,
    summary: 'Integration module that embeds predictions into clinical workflows via SMART on FHIR with role-based access.',
    details: [
      'SMART on FHIR launch context for EHR-embedded dashboard',
      'Shift handoff report generation with risk summaries',
      'Priority queue for nursing rounds with urgency ranking',
      'Intervention recommendation engine with evidence citations',
      'Role-based views (charge nurse, bedside RN, physician)',
    ],
    technicalNovelty: [
      'Novel clinical workflow embedding methodology',
      'Patentable priority queue algorithm for nursing rounds',
      'Automated handoff report generation with AI summaries',
    ],
    priorArtDifferentiation: 'Traditional CDSS provides alerts without workflow integration; our module embeds predictions into existing nursing workflows reducing cognitive burden.',
    quantitativeMetrics: [
      'Workflow integration: <3 clicks to detail',
      'Handoff generation: <10 seconds',
      'User adoption: 85% daily active',
    ],
  },
];

export const PatentClaimsSummary = () => {
  const independentClaims = patentClaims.filter(c => c.type === 'independent');
  const dependentClaims = patentClaims.filter(c => c.type === 'dependent');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Patent Claims Summary
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            U.S. Provisional Patent Application No. 63/932,953
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Award className="w-3 h-3 mr-1" />
            9 Claims
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">
            <FileText className="w-3 h-3 mr-1" />
            Patent Pending
          </Badge>
        </div>
      </div>

      {/* Claims Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
          <span className="text-2xl font-bold text-primary">{independentClaims.length}</span>
          <p className="text-[10px] text-muted-foreground">Independent Claims</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary border border-border/30 text-center">
          <span className="text-2xl font-bold text-foreground">{dependentClaims.length}</span>
          <p className="text-[10px] text-muted-foreground">Dependent Claims</p>
        </div>
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-center">
          <span className="text-2xl font-bold text-accent">4</span>
          <p className="text-[10px] text-muted-foreground">Key Innovations</p>
        </div>
        <div className="p-3 rounded-lg bg-risk-low/10 border border-risk-low/30 text-center">
          <span className="text-2xl font-bold text-risk-low">0.89</span>
          <p className="text-[10px] text-muted-foreground">AUROC Performance</p>
        </div>
      </div>

      {/* Claims Accordion */}
      <Accordion type="multiple" className="space-y-2">
        {patentClaims.map((claim) => (
          <AccordionItem
            key={claim.id}
            value={`claim-${claim.id}`}
            className={cn(
              "border rounded-lg overflow-hidden",
              claim.type === 'independent' 
                ? "border-primary/30 bg-primary/5" 
                : "border-border/50 bg-card"
            )}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/30">
              <div className="flex items-center gap-3 text-left">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  claim.type === 'independent'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {claim.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-sm">
                      Claim {claim.id}: {claim.title}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[9px] shrink-0",
                        claim.type === 'independent' 
                          ? "text-primary border-primary/30" 
                          : "text-muted-foreground"
                      )}
                    >
                      {claim.type === 'independent' ? 'Independent' : `Depends on Claim ${claim.dependsOn}`}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {claim.summary}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="ml-11 space-y-4">
                <p className="text-sm text-foreground">{claim.summary}</p>
                
                {/* Key Elements */}
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Key Elements:
                  </span>
                  <ul className="space-y-1">
                    {claim.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Novelty */}
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-risk-low flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Technical Novelty:
                  </span>
                  <ul className="space-y-1">
                    {claim.technicalNovelty.map((novelty, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-risk-low bg-risk-low/10 p-1.5 rounded">
                        <Target className="w-3 h-3 mt-0.5 shrink-0" />
                        {novelty}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prior Art Differentiation */}
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <span className="text-xs font-medium text-accent flex items-center gap-1 mb-1">
                    <Shield className="w-3 h-3" />
                    Prior Art Differentiation:
                  </span>
                  <p className="text-xs text-muted-foreground">{claim.priorArtDifferentiation}</p>
                </div>

                {/* Quantitative Metrics */}
                {claim.quantitativeMetrics && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-primary flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Quantitative Support:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {claim.quantitativeMetrics.map((metric, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] bg-primary/5">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Footer Note */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">About This Patent Application</p>
            <p>
              This provisional patent application covers novel methods, systems, and computer-readable media 
              for predicting nurse-sensitive outcomes using explainable AI with multi-horizon forecasting, 
              adaptive thresholds, and closed-loop feedback integration.
            </p>
            <p className="mt-2 text-primary">
              Filed: 2025 • Inventor: Alexis Collier • Status: Patent Pending
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
