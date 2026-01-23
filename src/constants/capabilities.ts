import { 
  Brain, BarChart3, Clock, Target, Shield, RefreshCw, Scale, Zap, FileText,
  type LucideIcon
} from 'lucide-react';

// Patent family definitions with colors
export interface PatentFamily {
  id: string;
  name: string;
  shortName: string;
  patentNumber: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  dotClass: string;
}

export const PATENT_FAMILIES: Record<string, PatentFamily> = {
  'trust-alerts': {
    id: 'trust-alerts',
    name: 'Trust-Based Alert System',
    shortName: 'Trust-Based Alerts',
    patentNumber: '63/946,187',
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
    borderClass: 'border-primary/30',
    dotClass: 'bg-primary',
  },
  'risk-intelligence': {
    id: 'risk-intelligence',
    name: 'Clinical Risk Intelligence',
    shortName: 'Clinical Risk Intelligence',
    patentNumber: '63/932,953',
    colorClass: 'text-risk-high',
    bgClass: 'bg-risk-high/10',
    borderClass: 'border-risk-high/30',
    dotClass: 'bg-risk-high',
  },
  'unified-platform': {
    id: 'unified-platform',
    name: 'Unified Nursing Intelligence',
    shortName: 'Unified Platform',
    patentNumber: '63/966,117',
    colorClass: 'text-accent',
    bgClass: 'bg-accent/10',
    borderClass: 'border-accent/30',
    dotClass: 'bg-accent',
  },
  'dbs-system': {
    id: 'dbs-system',
    name: 'Documentation Burden Scoring',
    shortName: 'DBS System',
    patentNumber: '63/966,099',
    colorClass: 'text-warning',
    bgClass: 'bg-warning/10',
    borderClass: 'border-warning/30',
    dotClass: 'bg-warning',
  },
};

// Capability definition
export interface Capability {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  patentFamilyId: string;
}

// All 9 core capabilities mapped to patent families
export const CAPABILITIES: Capability[] = [
  // Patent #2: Clinical Risk Intelligence (63/932,953)
  {
    id: 'risk-prediction',
    icon: Brain,
    title: 'Risk Prediction',
    description: 'ML models identify early warning signs of patient complications.',
    patentFamilyId: 'risk-intelligence',
  },
  {
    id: 'shap-explainability',
    icon: BarChart3,
    title: 'SHAP Explainability',
    description: 'Transparent AI with interpretable risk factor attribution.',
    patentFamilyId: 'risk-intelligence',
  },
  {
    id: 'temporal-forecasting',
    icon: Clock,
    title: 'Temporal Forecasting',
    description: 'Multi-horizon risk trajectories at 4h, 12h, 24h, and 48h.',
    patentFamilyId: 'risk-intelligence',
  },
  // Patent #1: Trust-Based Alert System (63/946,187)
  {
    id: 'adaptive-alerts',
    icon: Target,
    title: 'Adaptive Alerts',
    description: 'Patient-specific thresholds reduce false positives by 40-70%.',
    patentFamilyId: 'trust-alerts',
  },
  {
    id: 'trust-prioritization',
    icon: Shield,
    title: 'Trust-Based Prioritization',
    description: 'Prioritizes alerts based on provider trust scores.',
    patentFamilyId: 'trust-alerts',
  },
  // Patent #3: Unified Nursing Intelligence (63/966,117)
  {
    id: 'intervention-tracking',
    icon: RefreshCw,
    title: 'Intervention Tracking',
    description: 'Closed-loop feedback with before/after quantification.',
    patentFamilyId: 'unified-platform',
  },
  {
    id: 'equity-monitoring',
    icon: Scale,
    title: 'Equity Monitoring',
    description: 'Monitors for disparities in risk scores and interventions.',
    patentFamilyId: 'unified-platform',
  },
  {
    id: 'workload-optimization',
    icon: Zap,
    title: 'Workload Optimization',
    description: 'Unified prediction integrating risk and staffing needs.',
    patentFamilyId: 'unified-platform',
  },
  // Patent #4: DBS System (63/966,099)
  {
    id: 'dbs',
    icon: FileText,
    title: 'Documentation Burden Scoring',
    description: 'ML-based DBS prediction with quartile recommendations.',
    patentFamilyId: 'dbs-system',
  },
];

// Group capabilities by patent family
export const getCapabilitiesByFamily = () => {
  const grouped: Record<string, Capability[]> = {};
  
  CAPABILITIES.forEach(cap => {
    if (!grouped[cap.patentFamilyId]) {
      grouped[cap.patentFamilyId] = [];
    }
    grouped[cap.patentFamilyId].push(cap);
  });
  
  return grouped;
};

// Get patent family for a capability
export const getPatentFamily = (patentFamilyId: string): PatentFamily | undefined => {
  return PATENT_FAMILIES[patentFamilyId];
};
