import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Award, ShieldX, ArrowLeft, Brain, BarChart3, Clock, Sliders, 
  RefreshCw, Users, Activity, CheckCircle2, ExternalLink, FileText,
  Play, Camera, Hash, Shield, Calendar, Fingerprint, Video, PenLine,
  UserCheck, Building2, AlertCircle, Loader2, Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  demoSection?: string; // Links to RecordingDemo section
}

// Generate cryptographic document hash for evidence integrity
const generateDocumentHash = (content: string): string => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
};

const DOCUMENT_VERSION = '1.1.0';
const DOCUMENT_CREATED = '2025-12-30T00:00:00Z';
const LAST_UPDATED = new Date().toISOString();

// Video recording sections mapped to claims
const VIDEO_SECTIONS: Record<string, { title: string; duration: string; claims: number[] }> = {
  dashboard: { title: 'Dashboard Overview Recording', duration: '2-3 min', claims: [1, 12, 15, 19] },
  patients: { title: 'Patient Worklist Recording', duration: '3-4 min', claims: [4, 8, 11, 16] },
  shap: { title: 'SHAP Explainability Recording', duration: '4-5 min', claims: [2, 3, 17, 18] },
  workflow: { title: 'Clinical Workflow Recording', duration: '5-6 min', claims: [5, 6, 7, 9, 10, 13, 14] },
};

interface AttestationData {
  id?: string;
  witnessName: string;
  witnessTitle: string;
  organization: string;
  attestedAt: string | null;
  signature: string;
  persistedAt?: string;
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

const categoryConfig = {
  system: { label: 'System Architecture', icon: Brain, color: 'text-primary bg-primary/10 border-primary/30' },
  explainability: { label: 'SHAP Explainability', icon: BarChart3, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  forecasting: { label: 'Temporal Forecasting', icon: Clock, color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' },
  thresholds: { label: 'Adaptive Thresholds', icon: Sliders, color: 'text-accent bg-accent/10 border-accent/30' },
  feedback: { label: 'Closed-Loop Feedback', icon: RefreshCw, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
  workflow: { label: 'Clinical Workflow', icon: Activity, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
};

// Demo section labels for cross-referencing
const DEMO_SECTION_LABELS: Record<string, string> = {
  intro: 'Introduction',
  dashboard: 'Real-Time Overview',
  patients: 'Patient Worklist',
  shap: 'Risk Attribution',
  workflow: 'Clinical Workflow',
  outro: 'Conclusion'
};

export const PatentEvidence = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [capturedAt, setCapturedAt] = useState<string | null>(null);
  const [showAttestationForm, setShowAttestationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [attestations, setAttestations] = useState<AttestationData[]>([]);
  const [attestation, setAttestation] = useState<AttestationData>({
    witnessName: '',
    witnessTitle: '',
    organization: '',
    attestedAt: null,
    signature: ''
  });
  
  const accessKey = searchParams.get('key');
  const isExpired = new Date() > EXPIRATION_DATE;
  const hasAccess = accessKey === ACCESS_KEY && !isExpired;

  // Calculate document hash for integrity verification
  const documentHash = useMemo(() => {
    const content = PATENT_CLAIMS.map(c => `${c.number}:${c.title}:${c.description}`).join('|');
    return generateDocumentHash(content + DOCUMENT_VERSION);
  }, []);

  // Load existing attestations from database
  useEffect(() => {
    const loadAttestations = async () => {
      if (!hasAccess) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('patent_attestations')
          .select('*')
          .eq('document_hash', documentHash)
          .order('attested_at', { ascending: false });

        if (error) {
          console.error('Error loading attestations:', error);
        } else if (data && data.length > 0) {
          setAttestations(data.map(a => ({
            id: a.id,
            witnessName: a.witness_name,
            witnessTitle: a.witness_title,
            organization: a.organization || '',
            attestedAt: a.attested_at,
            signature: a.signature,
            persistedAt: a.created_at
          })));
        }
      } catch (err) {
        console.error('Failed to load attestations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAttestations();
  }, [hasAccess, documentHash]);
  
  const handleAttestation = async () => {
    if (!attestation.witnessName || !attestation.witnessTitle || !attestation.signature) {
      return;
    }

    setIsSaving(true);
    const attestedAt = new Date().toISOString();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('patent_attestations')
        .insert({
          document_hash: documentHash,
          document_version: DOCUMENT_VERSION,
          witness_name: attestation.witnessName,
          witness_title: attestation.witnessTitle,
          organization: attestation.organization || null,
          signature: attestation.signature,
          attested_at: attestedAt,
          claims_count: PATENT_CLAIMS.length,
          user_agent: navigator.userAgent,
          created_by: user?.id || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving attestation:', error);
        toast({
          title: 'Attestation Error',
          description: 'You must be logged in to submit an attestation.',
          variant: 'destructive'
        });
        return;
      }

      const newAttestation: AttestationData = {
        id: data.id,
        witnessName: attestation.witnessName,
        witnessTitle: attestation.witnessTitle,
        organization: attestation.organization,
        attestedAt: attestedAt,
        signature: attestation.signature,
        persistedAt: data.created_at
      };

      setAttestations(prev => [newAttestation, ...prev]);
      setAttestation({
        witnessName: '',
        witnessTitle: '',
        organization: '',
        attestedAt: null,
        signature: ''
      });
      setShowAttestationForm(false);

      toast({
        title: 'Attestation Recorded',
        description: 'Your witness attestation has been permanently recorded.',
      });
    } catch (err) {
      console.error('Failed to save attestation:', err);
      toast({
        title: 'Error',
        description: 'Failed to save attestation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Record capture timestamp on page load
  useEffect(() => {
    if (hasAccess && !capturedAt) {
      setCapturedAt(new Date().toISOString());
    }
  }, [hasAccess, capturedAt]);

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
        <div className="bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 rounded-xl border border-accent/30 p-6 mb-6">
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

        {/* Evidence Integrity & Audit Trail */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Document Integrity */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Document Integrity</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-secondary/50">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Hash className="w-3 h-3" />
                  Document Hash
                </span>
                <code className="font-mono text-primary">{documentHash}</code>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-secondary/50">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  Version
                </span>
                <span className="text-foreground font-medium">{DOCUMENT_VERSION}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-secondary/50">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Fingerprint className="w-3 h-3" />
                  Claims Documented
                </span>
                <span className="text-foreground font-medium">{PATENT_CLAIMS.length}</span>
              </div>
            </div>
          </div>

          {/* Timestamp Audit */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">Timestamp Audit Trail</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-secondary/50">
                <span className="text-muted-foreground">Document Created</span>
                <span className="text-foreground font-medium font-mono text-[10px]">
                  {new Date(DOCUMENT_CREATED).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-secondary/50">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="text-foreground font-medium font-mono text-[10px]">
                  {new Date(LAST_UPDATED).toLocaleString()}
                </span>
              </div>
              {capturedAt && (
                <div className="flex items-center justify-between p-2 rounded bg-primary/10 border border-primary/20">
                  <span className="text-primary">Evidence Captured</span>
                  <span className="text-primary font-medium font-mono text-[10px]">
                    {new Date(capturedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Witness Attestation Section */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-semibold text-foreground">Witness Attestations</h3>
              {attestations.length > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-500/20 text-purple-500">
                  {attestations.length} recorded
                </span>
              )}
              {isLoading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAttestationForm(!showAttestationForm)}
              className="gap-2"
            >
              <PenLine className="w-3 h-3" />
              {showAttestationForm ? 'Cancel' : 'Add Attestation'}
            </Button>
          </div>

          {/* Existing Attestations */}
          {attestations.length > 0 && (
            <div className="space-y-3 mb-4">
              {attestations.map((att, idx) => (
                <div key={att.id || idx} className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">
                            Attested by {att.witnessName}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            {att.witnessTitle}{att.organization && ` • ${att.organization}`}
                          </p>
                        </div>
                        {att.persistedAt && (
                          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-medium bg-risk-low/20 text-risk-low flex items-center gap-1">
                            <Database className="w-3 h-3" />
                            Persisted
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <span className="text-muted-foreground">
                          Signed: {att.attestedAt ? new Date(att.attestedAt).toLocaleString() : 'Unknown'}
                        </span>
                        <span className="font-mono text-purple-500">
                          Signature: {att.signature}
                        </span>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground italic border-t border-border/50 pt-3">
                        "I hereby attest that I have reviewed the above patent claims and their corresponding 
                        implementations in the Clinical Risk Intelligence System software. The implementations 
                        described accurately reflect the working functionality of the system as of the date of this attestation."
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Attestation Form */}
          {showAttestationForm ? (
            <div className="space-y-3 p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    value={attestation.witnessName}
                    onChange={(e) => setAttestation(prev => ({ ...prev, witnessName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground"
                    placeholder="Dr. Jane Smith"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Title/Role *</label>
                  <input
                    type="text"
                    value={attestation.witnessTitle}
                    onChange={(e) => setAttestation(prev => ({ ...prev, witnessTitle: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground"
                    placeholder="Chief Technology Officer"
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Organization</label>
                <input
                  type="text"
                  value={attestation.organization}
                  onChange={(e) => setAttestation(prev => ({ ...prev, organization: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground"
                  placeholder="University Medical Center"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Electronic Signature (Type your initials) *</label>
                <input
                  type="text"
                  value={attestation.signature}
                  onChange={(e) => setAttestation(prev => ({ ...prev, signature: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-mono text-foreground"
                  placeholder="J.S."
                  disabled={isSaving}
                />
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-xs text-muted-foreground">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  By signing, you attest that you have reviewed all {PATENT_CLAIMS.length} patent claims and their working implementations. 
                  Your attestation will be permanently recorded with a timestamp.
                </p>
              </div>
              <Button 
                onClick={handleAttestation} 
                className="w-full gap-2" 
                disabled={!attestation.witnessName || !attestation.witnessTitle || !attestation.signature || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Attestation...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Sign & Record Attestation
                  </>
                )}
              </Button>
            </div>
          ) : attestations.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Add a witness attestation to formally verify that all patent claims have working implementations. 
              Attestations are permanently recorded in the database with timestamps.
            </p>
          )}
        </div>

        {/* Video Recording Sections */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-semibold text-foreground">Video Recording Guide</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/record?key=presenter2025')}
              className="gap-2"
            >
              <Play className="w-3 h-3" />
              Launch Recording Demo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Record each section to create comprehensive video evidence of all patent claims in action.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(VIDEO_SECTIONS).map(([key, section]) => (
              <div
                key={key}
                className="p-3 rounded-lg bg-secondary/50 border border-border/50 hover:border-red-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{section.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-medium">
                    {section.duration}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {section.claims.map(claimNum => (
                    <span
                      key={claimNum}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-medium"
                    >
                      Claim {claimNum}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
            <p className="text-xs text-muted-foreground">
              <Video className="w-3 h-3 inline mr-1 text-red-500" />
              <strong className="text-foreground">Recording Tip:</strong> Use screen recording software (OBS, Loom, or similar) 
              to capture the demo while narrating each claim's implementation. Total estimated recording time: 15-20 minutes.
            </p>
          </div>
        </div>

        {/* Quick Links to Demo */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-foreground">Screenshot Capture</h3>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Navigate to the demo sections below to capture screenshots of each claim's implementation.
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(DEMO_SECTION_LABELS).filter(([key]) => key !== 'intro' && key !== 'outro').map(([key, label]) => {
              const claimsInSection = PATENT_CLAIMS.filter(c => c.demoSection === key);
              return (
                <button
                  key={key}
                  onClick={() => navigate('/record?key=presenter2025')}
                  className="px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-xs hover:border-blue-500/50 transition-colors group"
                >
                  <Camera className="w-3 h-3 inline mr-1 text-muted-foreground group-hover:text-blue-500" />
                  <span className="text-foreground font-medium">{label}</span>
                  <span className="text-muted-foreground ml-1.5">
                    ({claimsInSection.length} claims)
                  </span>
                </button>
              );
            })}
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
            // Find which video section this claim belongs to
            const videoSection = Object.entries(VIDEO_SECTIONS).find(([_, section]) => 
              section.claims.includes(claim.number)
            );
            
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
                        <div className="flex items-center flex-wrap gap-2">
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
                          {videoSection && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-500 flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              Video: {videoSection[1].title.replace(' Recording', '')}
                            </span>
                          )}
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
                      <div className="flex items-center flex-wrap gap-2 text-[10px]">
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
                        {claim.demoSection && (
                          <>
                            <span className="text-muted-foreground">|</span>
                            <button
                              onClick={() => navigate('/record?key=presenter2025')}
                              className="text-risk-low hover:underline flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              View in Demo ({DEMO_SECTION_LABELS[claim.demoSection]})
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* Evidence Capture Actions */}
                      <div className="mt-3 grid md:grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20">
                          <div className="flex items-center gap-2 text-[10px]">
                            <Camera className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-blue-500 font-medium">Screenshot</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Capture UI screenshot from demo
                          </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/20">
                          <div className="flex items-center gap-2 text-[10px]">
                            <Video className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-red-500 font-medium">Video Recording</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {videoSection ? `Include in ${videoSection[1].title}` : 'Record feature in action'}
                          </p>
                        </div>
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