import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Award, ShieldX, ArrowLeft, Brain, BarChart3, Clock, Sliders, 
  RefreshCw, Users, Activity, CheckCircle2, ExternalLink, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

const ACCESS_KEY = 'patent2025';
const EXPIRATION_DATE = new Date('2026-12-31T23:59:59');

interface PatentClaim {
  number: number;
  title: string;
  description: string;
  category: 'system' | 'explainability' | 'forecasting' | 'thresholds' | 'feedback' | 'workflow';
  implementation: string;
  componentPath: string;
  status: 'implemented' | 'demonstrated' | 'prototype';
}

const PATENT_CLAIMS: PatentClaim[] = [
  // System Claims (1-4)
  {
    number: 1,
    title: 'Clinical Risk Intelligence System',
    description: 'A clinical risk intelligence system for predicting nurse-sensitive patient outcomes, comprising: a data ingestion module configured to receive real-time patient data from electronic health record systems; a multi-outcome risk prediction engine utilizing machine learning models trained on nurse-sensitive outcomes.',
    category: 'system',
    implementation: 'Full dashboard system with real-time EHR data integration, multi-outcome risk scoring for Falls, HAPI, CAUTI, and device complications.',
    componentPath: 'src/components/dashboard/Dashboard.tsx',
    status: 'demonstrated'
  },
  {
    number: 2,
    title: 'SHAP Explainability Integration',
    description: 'The system of claim 1, wherein the explainability module utilizes SHapley Additive exPlanations (SHAP) to decompose predicted risk scores into individual feature contributions.',
    category: 'explainability',
    implementation: 'Interactive SHAP waterfall charts showing how each clinical factor (mobility, medications, vitals) contributes to the final risk score.',
    componentPath: 'src/components/quality/ShapExplainability.tsx',
    status: 'implemented'
  },
  {
    number: 3,
    title: 'Waterfall Visualization',
    description: 'The system of claim 2, further comprising a waterfall visualization component that displays cumulative risk attribution from baseline through each contributing factor.',
    category: 'explainability',
    implementation: 'Animated waterfall bars with cumulative risk tracking, color-coded risk/protective factors, and interactive tooltips explaining each contribution.',
    componentPath: 'src/components/quality/ShapExplainability.tsx',
    status: 'implemented'
  },
  {
    number: 4,
    title: 'Confidence Scoring',
    description: 'The system of claim 1, wherein each risk prediction includes a confidence interval based on model uncertainty quantification.',
    category: 'system',
    implementation: 'Confidence indicators displayed on each risk score, with visual representation of prediction certainty.',
    componentPath: 'src/components/quality/ConfidenceIndicator.tsx',
    status: 'implemented'
  },
  // Temporal Forecasting Claims (5)
  {
    number: 5,
    title: 'Multi-Horizon Temporal Forecasting',
    description: 'A method for temporal risk forecasting comprising: generating risk predictions at multiple time horizons including 4-hour, 12-hour, 24-hour, and 48-hour intervals; calculating trajectory classifications for each horizon.',
    category: 'forecasting',
    implementation: 'Interactive forecast charts showing risk trajectories at 4h, 12h, 24h, 48h horizons with confidence bands and trajectory classification (improving/stable/deteriorating).',
    componentPath: 'src/components/quality/TemporalForecasting.tsx',
    status: 'implemented'
  },
  // Adaptive Thresholds Claims (6)
  {
    number: 6,
    title: 'Patient-Adaptive Alert Thresholds',
    description: 'A system for adaptive alert threshold management comprising: calculating patient-specific baseline risk patterns; adjusting alert thresholds based on individual patient variability.',
    category: 'thresholds',
    implementation: 'Dynamic threshold visualization showing patient-specific adaptations, alert prevention counts, and personalized sensitivity adjustments.',
    componentPath: 'src/components/quality/AdaptiveThresholds.tsx',
    status: 'implemented'
  },
  // Closed-Loop Feedback Claims (7)
  {
    number: 7,
    title: 'Closed-Loop Intervention Feedback',
    description: 'A closed-loop feedback system comprising: automatic detection of clinical interventions from data streams; application of intervention-specific effect delays; recalculation of risk scores post-intervention.',
    category: 'feedback',
    implementation: 'Animated feedback loop demonstration showing intervention detection → baseline capture → effect delay → risk recalculation → effectiveness quantification.',
    componentPath: 'src/components/quality/ClosedLoopFeedback.tsx',
    status: 'implemented'
  },
  // Priority & Workflow Claims (8-10)
  {
    number: 8,
    title: 'Priority Scoring Algorithm',
    description: 'The system of claim 1, further comprising a priority scoring module that ranks patients based on composite risk across multiple nurse-sensitive outcomes.',
    category: 'workflow',
    implementation: 'Priority queue with composite scoring, dynamic reordering based on risk changes, and visual priority badges.',
    componentPath: 'src/components/dashboard/PriorityQueue.tsx',
    status: 'implemented'
  },
  {
    number: 9,
    title: 'Suggested Actions Generation',
    description: 'The system of claim 8, further comprising an intervention recommendation engine that generates suggested actions based on identified risk factors.',
    category: 'workflow',
    implementation: 'Context-aware suggested actions panel with evidence-based intervention recommendations tied to specific risk factors.',
    componentPath: 'src/components/dashboard/SuggestedActions.tsx',
    status: 'implemented'
  },
  {
    number: 10,
    title: 'Intervention Timer',
    description: 'The system of claim 9, including intervention timing tracking to monitor time since last assessment and intervention windows.',
    category: 'workflow',
    implementation: 'Visual intervention timers showing time since last action, upcoming assessment windows, and overdue alerts.',
    componentPath: 'src/components/dashboard/InterventionTimer.tsx',
    status: 'implemented'
  },
  // Dependent Claims (11-20)
  {
    number: 11,
    title: 'Risk Trend Visualization',
    description: 'The system of claim 5, further comprising sparkline visualizations showing risk trends over configurable time windows.',
    category: 'forecasting',
    implementation: 'Compact sparkline charts embedded in patient cards showing 24-hour risk trends with trend direction indicators.',
    componentPath: 'src/components/quality/RiskSparkline.tsx',
    status: 'implemented'
  },
  {
    number: 12,
    title: 'Multi-Outcome Comparison',
    description: 'The system of claim 1, further comprising a comparison view for analyzing risk patterns across multiple nurse-sensitive outcomes simultaneously.',
    category: 'system',
    implementation: 'Side-by-side outcome comparison panel showing Falls, HAPI, CAUTI, and device complication risks with comparative analysis.',
    componentPath: 'src/components/dashboard/MultiOutcomeComparison.tsx',
    status: 'implemented'
  },
  {
    number: 13,
    title: 'Clinical Workflow Integration',
    description: 'The system of claim 9, wherein suggested actions are integrated into clinical workflow stages.',
    category: 'workflow',
    implementation: 'Workflow sequence visualization showing progression from risk identification through intervention to outcome tracking.',
    componentPath: 'src/components/quality/ClinicalWorkflowView.tsx',
    status: 'implemented'
  },
  {
    number: 14,
    title: 'Efficacy Badge System',
    description: 'The system of claim 7, further comprising efficacy badges indicating intervention effectiveness categories.',
    category: 'feedback',
    implementation: 'Visual efficacy indicators (High/Moderate/Low) based on historical intervention success rates.',
    componentPath: 'src/components/dashboard/EfficacyBadge.tsx',
    status: 'implemented'
  },
  {
    number: 15,
    title: 'Unit-Level Dashboard Overview',
    description: 'The system of claim 1, further comprising an aggregate dashboard view showing unit-level risk distributions and metrics.',
    category: 'system',
    implementation: 'Dashboard overview with unit-wide statistics, risk category distributions, and aggregate performance metrics.',
    componentPath: 'src/components/quality/DashboardOverview.tsx',
    status: 'implemented'
  },
  {
    number: 16,
    title: 'Patient List View with Filtering',
    description: 'The system of claim 8, further comprising a filterable patient list with risk-based sorting and categorization.',
    category: 'workflow',
    implementation: 'Interactive patient list with risk level filters, outcome type filters, and dynamic sorting by priority score.',
    componentPath: 'src/components/quality/PatientListView.tsx',
    status: 'implemented'
  },
  {
    number: 17,
    title: 'Clinical Tooltip System',
    description: 'The system of claim 2, further comprising contextual tooltips providing clinical definitions and metric explanations.',
    category: 'explainability',
    implementation: 'Hover-activated tooltips explaining clinical terms (SHAP, MRN, LOS, AUROC) with plain-language descriptions.',
    componentPath: 'src/components/quality/ClinicalTooltip.tsx',
    status: 'implemented'
  },
  {
    number: 18,
    title: 'Grouped SHAP Analysis',
    description: 'The system of claim 2, further comprising grouped SHAP visualizations organizing factors by clinical category.',
    category: 'explainability',
    implementation: 'SHAP charts with categorical grouping (vitals, mobility, medications, history) for clearer clinical interpretation.',
    componentPath: 'src/components/dashboard/GroupedShapChart.tsx',
    status: 'implemented'
  },
  {
    number: 19,
    title: 'Live Simulation Mode',
    description: 'The system of claim 1, further comprising a demonstration mode with simulated real-time data updates.',
    category: 'system',
    implementation: 'Live simulation engine generating realistic risk fluctuations for demonstration and training purposes.',
    componentPath: 'src/hooks/useLiveSimulation.ts',
    status: 'implemented'
  },
  {
    number: 20,
    title: 'Research Disclaimer System',
    description: 'The system of claim 1, further comprising integrated research disclaimers and patent notices throughout the interface.',
    category: 'system',
    implementation: 'Persistent research banners, patent notices, and synthetic data disclaimers ensuring appropriate use context.',
    componentPath: 'src/components/ResearchDisclaimer.tsx',
    status: 'implemented'
  },
];

const categoryConfig = {
  system: { label: 'System Architecture', icon: Brain, color: 'text-primary bg-primary/10 border-primary/30' },
  explainability: { label: 'SHAP Explainability', icon: BarChart3, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  forecasting: { label: 'Temporal Forecasting', icon: Clock, color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' },
  thresholds: { label: 'Adaptive Thresholds', icon: Sliders, color: 'text-accent bg-accent/10 border-accent/30' },
  feedback: { label: 'Closed-Loop Feedback', icon: RefreshCw, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
  workflow: { label: 'Clinical Workflow', icon: Activity, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
};

export const PatentEvidence = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const accessKey = searchParams.get('key');
  const isExpired = new Date() > EXPIRATION_DATE;
  const hasAccess = accessKey === ACCESS_KEY && !isExpired;

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Helmet>
          <title>Access Restricted | Patent Evidence</title>
        </Helmet>
        <div className="text-center max-w-md px-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/20 border-2 border-destructive/40 flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            {isExpired ? 'Link Expired' : 'Access Restricted'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isExpired 
              ? 'This access link has expired.' 
              : 'This page contains confidential patent evidence and requires a valid access link.'}
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const filteredClaims = selectedCategory 
    ? PATENT_CLAIMS.filter(c => c.category === selectedCategory)
    : PATENT_CLAIMS;

  const categories = Object.entries(categoryConfig);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Patent Evidence Documentation | Clinical Risk Intelligence System</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                <span className="font-semibold text-foreground">Patent Evidence Documentation</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30">
              <FileText className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">Confidential</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Patent Info Banner */}
        <div className="bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 rounded-xl border border-accent/30 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
              <Award className="w-7 h-7 text-accent" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Clinical Risk Intelligence System
              </h1>
              <p className="text-sm text-muted-foreground mb-3">
                With Integrated Explainability, Temporal Forecasting, Adaptive Thresholds, and Closed-Loop Intervention Feedback
              </p>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Inventor:</span>
                  <span className="text-foreground font-medium">Alexis Collier, PhD, RN</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Filing:</span>
                  <span className="text-foreground font-medium">U.S. Provisional Application</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-foreground font-medium">December 2025</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Claims:</span>
                  <span className="text-foreground font-medium">20 Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                !selectedCategory 
                  ? "bg-foreground text-background border-foreground" 
                  : "bg-secondary text-muted-foreground border-border hover:border-foreground/50"
              )}
            >
              All Claims ({PATENT_CLAIMS.length})
            </button>
            {categories.map(([key, config]) => {
              const Icon = config.icon;
              const count = PATENT_CLAIMS.filter(c => c.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5",
                    selectedCategory === key 
                      ? config.color
                      : "bg-secondary text-muted-foreground border-border hover:border-foreground/50"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Claims Grid */}
        <div className="grid gap-4">
          {filteredClaims.map((claim, index) => {
            const config = categoryConfig[claim.category];
            const Icon = config.icon;
            
            return (
              <div 
                key={claim.number}
                className="bg-card rounded-xl border border-border/50 p-5 hover:border-border transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Claim Number */}
                  <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-accent">{claim.number}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                          Claim {claim.number}: {claim.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium border flex items-center gap-1", config.color)}>
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-medium",
                            claim.status === 'implemented' ? "bg-risk-low/20 text-risk-low" :
                            claim.status === 'demonstrated' ? "bg-primary/20 text-primary" :
                            "bg-muted text-muted-foreground"
                          )}>
                            <CheckCircle2 className="w-3 h-3 inline mr-1" />
                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Patent Language */}
                    <div className="mb-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide block mb-1">
                        Patent Claim Language
                      </span>
                      <p className="text-xs text-foreground leading-relaxed">
                        {claim.description}
                      </p>
                    </div>
                    
                    {/* Implementation */}
                    <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                      <span className="text-[10px] font-medium text-accent uppercase tracking-wide block mb-1">
                        Working Implementation
                      </span>
                      <p className="text-xs text-foreground leading-relaxed mb-2">
                        {claim.implementation}
                      </p>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-muted-foreground">Source:</span>
                        <code className="px-1.5 py-0.5 rounded bg-secondary text-primary font-mono">
                          {claim.componentPath}
                        </code>
                        <a 
                          href={`https://github.com/your-repo/${claim.componentPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          View Code <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
            <Award className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">
              U.S. Provisional Patent Application • December 2025 • 20 Claims
            </span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground max-w-xl mx-auto">
            This document serves as evidence of working implementations for the patent claims described above.
            All implementations are demonstrated in the accompanying software prototype.
          </p>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Confidential • Attorney-Client Privilege • Do Not Distribute
          </p>
        </div>
      </main>
    </div>
  );
};