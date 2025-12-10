import { Award, ChevronDown, FileText, Scale } from 'lucide-react';
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
}

const patentClaims: PatentClaim[] = [
  {
    id: 1,
    title: 'Computer-Implemented Method for NSO Prediction',
    type: 'independent',
    summary: 'A computer-implemented method for predicting nurse-sensitive outcomes (NSOs) in hospitalized patients using machine learning with explainable AI.',
    details: [
      'Receiving continuous patient data streams from EHR systems',
      'Preprocessing data using clinical domain knowledge',
      'Applying gradient boosting machine learning model',
      'Generating SHAP values for interpretable risk attribution',
      'Multi-horizon temporal forecasting (4h, 12h, 24h, 48h)',
      'Adaptive threshold mechanism for personalized alerts',
      'Closed-loop feedback integration for intervention tracking',
    ],
  },
  {
    id: 2,
    title: 'Gradient Boosting Trees Implementation',
    type: 'dependent',
    dependsOn: 1,
    summary: 'The machine learning model comprises gradient boosting trees trained on labeled clinical datasets.',
    details: [
      'Gradient boosting architecture (XGBoost/LightGBM)',
      'Training on HiRID, MIMIC-IV, and eICU datasets',
      'Hyperparameter optimization via cross-validation',
      'AUROC 0.89, Sensitivity 0.87, Specificity 0.86',
    ],
  },
  {
    id: 3,
    title: 'Multi-Horizon Temporal Forecasting',
    type: 'dependent',
    dependsOn: 1,
    summary: 'Generates risk predictions at multiple time horizons with trajectory classification.',
    details: [
      'Risk trajectories at 4h, 12h, 24h, and 48h horizons',
      'Confidence intervals using quantile regression',
      'Trajectory classification: stable, improving, deteriorating, volatile',
      'Inflection point detection for proactive intervention',
    ],
  },
  {
    id: 4,
    title: 'Adaptive Threshold Mechanism',
    type: 'dependent',
    dependsOn: 1,
    summary: 'Calculates patient-specific alert thresholds based on individual baseline risk and volatility.',
    details: [
      'Formula: Threshold = Baseline + (k × σ)',
      'k adjusts based on clinical context and patient history',
      'Reduces false positive alerts by 40-70%',
      'Addresses alert fatigue in clinical settings',
    ],
  },
  {
    id: 5,
    title: 'Closed-Loop Feedback Integration',
    type: 'dependent',
    dependsOn: 1,
    summary: 'Automatically detects interventions and quantifies their effectiveness.',
    details: [
      'Real-time intervention detection from clinical data streams',
      'Pre-intervention risk state capture',
      'Intervention-specific effect delay periods',
      'Post-intervention risk recalculation',
      'Before/after effectiveness quantification',
    ],
  },
  {
    id: 6,
    title: 'Non-Transitory Computer-Readable Medium',
    type: 'independent',
    summary: 'A non-transitory computer-readable medium storing instructions for predicting nurse-sensitive outcomes.',
    details: [
      'Executable instructions for NSO prediction system',
      'Data structures for patient risk profiles',
      'SHAP value computation algorithms',
      'Threshold adaptation parameters',
    ],
  },
  {
    id: 7,
    title: 'SHAP Value Generation Method',
    type: 'dependent',
    dependsOn: 6,
    summary: 'Generating SHAP values comprises calculating individual feature contributions to risk scores.',
    details: [
      'TreeSHAP algorithm for gradient boosting models',
      'Individual feature contribution quantification',
      'Cumulative risk attribution visualization',
      'Clinical interpretation mapping',
    ],
  },
  {
    id: 8,
    title: 'System for NSO Prediction',
    type: 'independent',
    summary: 'A system comprising processors, memory, and modules for predicting nurse-sensitive outcomes.',
    details: [
      'Data ingestion module for EHR integration',
      'Preprocessing module with clinical validation',
      'ML inference engine with gradient boosting',
      'Explainability module with SHAP generation',
      'Alert generation with adaptive thresholds',
      'Feedback module for intervention tracking',
    ],
  },
  {
    id: 9,
    title: 'Clinical Workflow Integration Module',
    type: 'dependent',
    dependsOn: 8,
    summary: 'Integration module that embeds predictions into clinical workflows.',
    details: [
      'EHR dashboard integration',
      'Shift handoff report generation',
      'Priority queue for nursing rounds',
      'Intervention recommendation engine',
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
              <div className="ml-11 space-y-3">
                <p className="text-sm text-foreground">{claim.summary}</p>
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Key Elements:</span>
                  <ul className="space-y-1">
                    {claim.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
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
