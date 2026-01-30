import { cn } from '@/lib/utils';
import { GraduationCap, Calendar, FileText } from 'lucide-react';
import type { ViewType } from '@/hooks/useAutoDemo';

interface SectionMeta {
  title: string;
  subtitle: string;
  citation?: string;
}

const sectionMeta: Record<ViewType, SectionMeta> = {
  dashboard: {
    title: 'System Architecture & Real-Time Monitoring',
    subtitle: 'Aggregate Risk Visualization for Nurse-Sensitive Outcomes',
    citation: 'Design: Real-time EHR integration with sub-5-minute data refresh (illustrative)',
  },
  patients: {
    title: 'Individual Risk Stratification',
    subtitle: 'Patient-Level Predictive Analytics with Confidence Intervals',
    citation: 'Illustrative metrics — Validation study planned',
  },
  shap: {
    title: 'Explainable Artificial Intelligence',
    subtitle: 'SHAP-Based Feature Attribution for Clinical Transparency',
    citation: 'Framework: Lundberg & Lee (2017) unified approach to model interpretation',
  },
  workflow: {
    title: 'Clinical Validation & Human-in-the-Loop',
    subtitle: 'Real-World Intervention Workflow Demonstration',
    citation: 'Design target: 30-40% reduction in preventable falls (not validated)',
  },
  'ehr-flow': {
    title: 'EHR Data Flow Architecture',
    subtitle: 'Standards-Based Integration for Any Compliant System',
    citation: 'Standards: HL7 FHIR R4, HL7v2, CDA/C-CDA',
  },
  'alert-timeline': {
    title: 'Real-Time Alert Pipeline',
    subtitle: 'From EHR Event to Clinical Action in Under 30 Seconds',
    citation: 'Target latency: <30s end-to-end',
  },
  'comparison': {
    title: 'Traditional vs Predictive Monitoring',
    subtitle: 'Paradigm Shift in Quality Measurement',
    citation: 'Projected outcomes based on literature review',
  },
  'patient-journey': {
    title: 'Patient Journey Visualization',
    subtitle: 'Complete Care Episode with Risk Tracking',
    citation: 'Illustrative scenario for demonstration',
  },
  'roi': {
    title: 'Return on Investment Analysis',
    subtitle: 'Projected Cost Savings from NSO Prevention',
    citation: 'Estimates based on AHRQ and CMS data',
  },
  'ml-features': {
    title: 'Machine Learning Feature Set',
    subtitle: '47 Clinical Features Across 7 Categories',
    citation: 'Features from validated scales and EHR data',
  },
  'video-demo': {
    title: 'Recorded Presentation',
    subtitle: '45-Minute Walkthrough Video',
    citation: 'Conference Presentation',
  },
  'research-validation': {
    title: 'Clinical Validation at Scale',
    subtitle: '10,000 Patients • 201 Hospitals',
    citation: 'AIM-AHEAD CLINAQ Fellowship Research',
  },
  'patent-portfolio': {
    title: 'Patent Portfolio Overview',
    subtitle: 'Four Complementary Patents · Defensible IP Moat',
    citation: '4 U.S. Provisional Applications Filed',
  },
  'patent-trust-alerts': {
    title: 'Trust-Based Alert System',
    subtitle: 'U.S. Patent Filed · Dynamic Precision Thresholds',
    citation: '87% alert reduction with 100% sensitivity',
  },
  'patent-equity': {
    title: 'Real-Time Equity Monitoring Engine',
    subtitle: 'U.S. Patent Filed · Demographic Bias Auditing',
    citation: '<0.5% disparity threshold maintained',
  },
  'patent-dbs-breakdown': {
    title: 'DBS Calculation Breakdown',
    subtitle: 'U.S. Patent Filed · Weighted Feature Analysis',
    citation: 'Validated on 10,000 patients, 201 hospitals',
  },
  'patent-validation-charts': {
    title: 'Research Validation Visualizations',
    subtitle: 'Patent Figures 2-8 · Comprehensive Analytics',
    citation: 'AUC 0.78, r=0.40 correlation, Cohen\'s d=3.2',
  },
  'patent-neural-reasoning': {
    title: 'Neural Reasoning Engine',
    subtitle: 'U.S. Patent Filed · Chain-of-Thought Clinical AI',
    citation: '94% expert agreement rate',
  },
  'patent-cognitive-load': {
    title: 'Cognitive Load Optimizer',
    subtitle: 'U.S. Patent Filed · Workload-Adaptive Thresholds',
    citation: '2.3 minutes saved per decision',
  },
  'patent-trust-score': {
    title: 'Trust Score Algorithm',
    subtitle: 'U.S. Patent Filed · Composite Reliability Scoring',
    citation: 'Weighted reliability composite',
  },
  'patent-performance': {
    title: 'Performance Comparison',
    subtitle: 'U.S. Patent Filed · Validated Results',
    citation: '87% alert reduction, 12 hospital sites',
  },
};

interface AcademicHeaderProps {
  currentView: ViewType;
  isVisible?: boolean;
}

export const AcademicHeader = ({
  currentView,
  isVisible = true,
}: AcademicHeaderProps) => {
  if (!isVisible) return null;

  const meta = sectionMeta[currentView];

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/20 px-4 py-3 print:hidden">
      <div className="max-w-7xl mx-auto">
        {/* Research badge */}
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30">
            <GraduationCap className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-semibold text-primary uppercase tracking-wider">
              Research Prototype
            </span>
          </div>
          <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Research Presentation
            </span>
          </div>
        </div>

        {/* Section title */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground leading-tight">
              {meta.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {meta.subtitle}
            </p>
          </div>

          {/* Citation badge */}
          {meta.citation && (
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50 border border-border/50">
              <FileText className="w-3 h-3 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground font-mono">
                {meta.citation}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
