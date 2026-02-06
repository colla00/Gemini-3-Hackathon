import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Award, ShieldX, ArrowLeft, Clock,
  Play, Hash, Shield, Calendar, Fingerprint, Video, PenLine,
  UserCheck, AlertCircle, Loader2, Database, Download, Mail, Image, QrCode,
  FileText, CheckCircle2, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generatePatentEvidencePDF } from '@/lib/pdfExport';
import { ClaimScreenshotUpload } from '@/components/patent/ClaimScreenshotUpload';
import { SignatureCanvas } from '@/components/patent/SignatureCanvas';
import { QRCodeVerification } from '@/components/patent/QRCodeVerification';
import { EvidenceTimeline } from '@/components/patent/EvidenceTimeline';
import { MultiWitnessPanel } from '@/components/patent/MultiWitnessPanel';
import { PrintLegalView } from '@/components/patent/PrintLegalView';
import { AttestationAnalytics } from '@/components/patent/AttestationAnalytics';
import { WitnessInvitationPanel } from '@/components/patent/WitnessInvitationPanel';
import { FullPDFExport } from '@/components/patent/FullPDFExport';
import { useAuditLog } from '@/hooks/useAuditLog';

// Import centralized types, constants, and data
import type { AttestationData, ClaimCategory } from '@/types/patent';
import { 
  PATENT_ACCESS_KEY, 
  PATENT_EXPIRATION_DATE, 
  DOCUMENT_VERSION,
  DOCUMENT_CREATED,
  generateDocumentHash,
  VIDEO_SECTIONS,
  DEMO_SECTION_LABELS
} from '@/constants/patent';
import { PATENT_CLAIMS, CATEGORY_CONFIG } from '@/data/patentClaims';
import type { CategoryConfig } from '@/types/patent';

const LAST_UPDATED = new Date().toISOString();

export const PatentEvidence = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { logAction } = useAuditLog();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [capturedAt, setCapturedAt] = useState<string | null>(null);
  const [showAttestationForm, setShowAttestationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [attestations, setAttestations] = useState<AttestationData[]>([]);
  const [claimScreenshots, setClaimScreenshots] = useState<Record<number, { id: string; file_path: string; caption?: string | null }[]>>({});
  const [useCanvasSignature, setUseCanvasSignature] = useState(false);
  const [attestation, setAttestation] = useState<AttestationData>({
    witnessName: '',
    witnessTitle: '',
    witnessEmail: '',
    organization: '',
    attestedAt: null,
    signature: '',
    signatureImage: ''
  });
  
  const accessKey = searchParams.get('key');
  const isExpired = new Date() > PATENT_EXPIRATION_DATE;
  const hasAccess = accessKey === PATENT_ACCESS_KEY && !isExpired;

  // Calculate document hash for integrity verification
  const documentHash = useMemo(() => {
    const content = PATENT_CLAIMS.map(c => `${c.number}:${c.title}:${c.description}`).join('|');
    return generateDocumentHash(content + DOCUMENT_VERSION);
  }, []);

  // Load existing attestations and screenshots from database
  useEffect(() => {
    const loadData = async () => {
      if (!hasAccess) return;
      
      setIsLoading(true);
      try {
        // Load attestations
        const { data: attestationData, error: attestationError } = await supabase
          .from('patent_attestations')
          .select('*')
          .eq('document_hash', documentHash)
          .order('attested_at', { ascending: false });

        if (attestationError) {
          console.error('Error loading attestations:', attestationError);
        } else if (attestationData && attestationData.length > 0) {
          setAttestations(attestationData.map(a => ({
            id: a.id,
            witnessName: a.witness_name,
            witnessTitle: a.witness_title,
            witnessEmail: '',
            organization: a.organization || '',
            attestedAt: a.attested_at,
            signature: a.signature,
            persistedAt: a.created_at
          })));
        }

        // Load screenshots for all claims
        const { data: screenshotData, error: screenshotError } = await supabase
          .from('patent_claim_screenshots')
          .select('id, claim_number, file_path')
          .eq('document_hash', documentHash);

        if (screenshotError) {
          console.error('Error loading screenshots:', screenshotError);
        } else if (screenshotData) {
          const grouped: Record<number, { id: string; file_path: string }[]> = {};
          screenshotData.forEach(s => {
            if (!grouped[s.claim_number]) grouped[s.claim_number] = [];
            grouped[s.claim_number].push({ id: s.id, file_path: s.file_path });
          });
          setClaimScreenshots(grouped);
        }

        // Log page access
        logAction({
          action: 'view',
          resource_type: 'patent_documentation',
          details: { document_hash: documentHash, claims_count: PATENT_CLAIMS.length }
        });
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [hasAccess, documentHash]);


  
  const handleAttestation = async () => {
    const hasValidSignature = attestation.signature || attestation.signatureImage;
    if (!attestation.witnessName || !attestation.witnessTitle || !hasValidSignature) {
      return;
    }

    // Check rate limit first
    try {
      const { data: rateLimitData, error: rateLimitError } = await supabase.functions.invoke('check-attestation-rate-limit');
      
      if (rateLimitError || !rateLimitData?.allowed) {
        toast({
          title: 'Rate Limit Exceeded',
          description: rateLimitData?.message || 'Too many attestation attempts. Please try again later.',
          variant: 'destructive'
        });
        return;
      }
    } catch (err) {
      console.warn('Rate limit check failed, continuing...', err);
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
          signature: attestation.signatureImage || attestation.signature,
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
        witnessEmail: attestation.witnessEmail,
        organization: attestation.organization,
        attestedAt: attestedAt,
        signature: attestation.signatureImage || attestation.signature,
        persistedAt: data.created_at
      };

      setAttestations(prev => [newAttestation, ...prev]);
      setAttestation({
        witnessName: '',
        witnessTitle: '',
        witnessEmail: '',
        organization: '',
        attestedAt: null,
        signature: '',
        signatureImage: ''
      });
      setUseCanvasSignature(false);
      setShowAttestationForm(false);

      // Log the attestation action
      logAction({
        action: 'create',
        resource_type: 'patent_documentation',
        resource_id: data.id,
        details: { 
          action_type: 'attestation',
          witness_name: attestation.witnessName,
          claims_count: PATENT_CLAIMS.length
        }
      });

      toast({
        title: 'Attestation Recorded',
        description: 'Your witness attestation has been permanently recorded.',
      });

      // Send email notification to patent attorney (fire and forget)
      supabase.functions.invoke('send-attestation-notification', {
        body: {
          witnessName: newAttestation.witnessName,
          witnessTitle: newAttestation.witnessTitle,
          organization: newAttestation.organization || null,
          claimsCount: PATENT_CLAIMS.length,
          attestedAt: attestedAt
        }
      });

      // Send confirmation email to witness if email provided
      if (attestation.witnessEmail) {
        supabase.functions.invoke('send-witness-confirmation', {
          body: {
            witnessName: newAttestation.witnessName,
            witnessTitle: newAttestation.witnessTitle,
            witnessEmail: attestation.witnessEmail,
            organization: newAttestation.organization || null,
            claimsCount: PATENT_CLAIMS.length,
            attestedAt: attestedAt,
            documentHash: documentHash
          }
        });
      }
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

  const categories = Object.entries(CATEGORY_CONFIG) as [ClaimCategory, CategoryConfig][];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Patent Evidence Documentation | NSO Quality Dashboard</title>
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generatePatentEvidencePDF(PATENT_CLAIMS, attestations, documentHash, DOCUMENT_VERSION)}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <PrintLegalView 
                claims={PATENT_CLAIMS}
                attestations={attestations}
                documentHash={documentHash}
                documentVersion={DOCUMENT_VERSION}
              />
              <div className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <span className="text-sm text-accent font-medium">Confidential</span>
              </div>
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
                NSO Quality Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mb-3">
                5 U.S. Patents Filed: Trust-Based Alerts • Clinical Risk Intelligence • Unified Platform • DBS System • ICU Mortality Prediction
              </p>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Inventor:</span>
                  <span className="text-foreground font-medium">Dr. Alexis Collier</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Filing:</span>
                  <span className="text-foreground font-medium">5 U.S. Provisional Applications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-foreground font-medium">December 2025 – February 2026</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Claims:</span>
                  <span className="text-foreground font-medium">175+ Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: ICU Mortality Patent Highlight */}
        <div className="bg-card rounded-xl border border-accent/30 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-2 py-0.5 rounded bg-risk-low/20 text-risk-low text-[10px] font-bold uppercase tracking-wider">New Filing</div>
            <span className="text-xs text-muted-foreground">February 5, 2026</span>
            <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-medium">NIH-Funded Research (K12 HL138039-06)</span>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            ICU Mortality Prediction from EHR Documentation Rhythm Patterns
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            A system and method for predicting ICU mortality and clinical deterioration utilizing documentation rhythm patterns and temporal phenotypes derived solely from EHR timestamp metadata. The invention eliminates the need for physiological monitoring equipment by analyzing the "human sensor" signal of nursing surveillance.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border/30 text-center">
              <div className="text-2xl font-bold text-foreground">99</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Claims Filed</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 border border-border/30 text-center">
              <div className="text-2xl font-bold text-foreground">15</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Temporal Features</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 border border-border/30 text-center">
              <div className="text-2xl font-bold text-foreground">0.741</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">AUC Performance</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 border border-border/30 text-center">
              <div className="text-2xl font-bold text-foreground">$0</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Equipment Cost</div>
            </div>
          </div>

          {/* Phenotype Table */}
          <div className="rounded-lg border border-border/30 overflow-hidden mb-4">
            <div className="bg-secondary/30 px-4 py-2 text-xs font-semibold text-foreground uppercase tracking-wider">
              4 Clinical Documentation Phenotypes
            </div>
            <div className="divide-y divide-border/20">
              {[
                { name: 'Steady Surveillance', mortality: '3.2%', desc: 'Low CV, Moderate Frequency, Stable', color: 'text-risk-low' },
                { name: 'Minimal Documentation', mortality: '12.3%', desc: 'Low Frequency, Large Gaps', color: 'text-warning' },
                { name: 'Escalating Crisis', mortality: '18.7%', desc: 'High Frequency, High Acceleration', color: 'text-risk-high' },
                { name: 'Chaotic Instability', mortality: '24.1%', desc: 'High Entropy, High CV, Irregular', color: 'text-destructive' },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <span className="text-sm font-medium text-foreground">{p.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{p.desc}</span>
                  </div>
                  <span className={`text-sm font-bold ${p.color}`}>{p.mortality}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Validated on MIMIC-IV dataset (n=26,153) · 7.5-fold mortality stratification · 11-year temporal validation</span>
          </div>
        </div>

        {/* Evidence Integrity & Audit Trail */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
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

          {/* QR Code Verification */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-foreground">Quick Verify</h3>
            </div>
            <QRCodeVerification 
              documentHash={documentHash} 
              documentVersion={DOCUMENT_VERSION} 
            />
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
                        implementations in the NSO Quality Dashboard software. The implementations 
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
                <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Your Email (for confirmation)
                </label>
                <input
                  type="email"
                  value={attestation.witnessEmail}
                  onChange={(e) => setAttestation(prev => ({ ...prev, witnessEmail: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground"
                  placeholder="jane.smith@hospital.org"
                  disabled={isSaving}
                />
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
              {/* Signature Options */}
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <label className="text-xs text-muted-foreground">Signature Method *</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUseCanvasSignature(false)}
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium transition-colors",
                        !useCanvasSignature ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      )}
                    >
                      Type Initials
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseCanvasSignature(true)}
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium transition-colors",
                        useCanvasSignature ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      )}
                    >
                      Draw Signature
                    </button>
                  </div>
                </div>
                
                {useCanvasSignature ? (
                  <SignatureCanvas
                    onSignatureComplete={(dataUrl) => setAttestation(prev => ({ ...prev, signatureImage: dataUrl, signature: '' }))}
                    disabled={isSaving}
                  />
                ) : (
                  <>
                    <label className="text-xs text-muted-foreground mb-1 block">Type your initials *</label>
                    <input
                      type="text"
                      value={attestation.signature}
                      onChange={(e) => setAttestation(prev => ({ ...prev, signature: e.target.value, signatureImage: '' }))}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-mono text-foreground"
                      placeholder="J.S."
                      disabled={isSaving}
                    />
                  </>
                )}
                {attestation.signatureImage && (
                  <div className="mt-2 p-2 bg-secondary/50 rounded-lg">
                    <p className="text-[10px] text-muted-foreground mb-1">Captured Signature:</p>
                    <img src={attestation.signatureImage} alt="Signature" className="max-h-12" />
                  </div>
                )}
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
                disabled={!attestation.witnessName || !attestation.witnessTitle || (!attestation.signature && !attestation.signatureImage) || isSaving}
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

        {/* Multi-Witness, Timeline, Invitations & Analytics Section */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-4">
            <MultiWitnessPanel 
              documentHash={documentHash} 
              onStartAttestation={() => setShowAttestationForm(true)} 
            />
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <WitnessInvitationPanel 
              documentHash={documentHash}
              documentVersion={DOCUMENT_VERSION}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-foreground">Activity Timeline</h3>
            </div>
            <EvidenceTimeline documentHash={documentHash} />
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <FullPDFExport
              claims={PATENT_CLAIMS}
              attestations={attestations}
              documentHash={documentHash}
              documentVersion={DOCUMENT_VERSION}
            />
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <AttestationAnalytics documentHash={documentHash} />
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
            const config = CATEGORY_CONFIG[claim.category];
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
                      
                      {/* Video Recording Info */}
                      {videoSection && (
                        <div className="mt-3 p-2.5 rounded-lg bg-red-500/5 border border-red-500/20">
                          <div className="flex items-center gap-2 text-[10px]">
                            <Video className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-red-500 font-medium">Video Recording</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Include in {videoSection[1].title}
                          </p>
                        </div>
                      )}

                      {/* Screenshot Upload */}
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <ClaimScreenshotUpload
                          claimNumber={claim.number}
                          documentHash={documentHash}
                          existingScreenshots={claimScreenshots[claim.number]}
                          onUploadComplete={() => {
                            // Refresh screenshots for this claim
                            supabase
                              .from('patent_claim_screenshots')
                              .select('id, file_path')
                              .eq('document_hash', documentHash)
                              .eq('claim_number', claim.number)
                              .then(({ data }) => {
                                if (data) {
                                  setClaimScreenshots(prev => ({
                                    ...prev,
                                    [claim.number]: data
                                  }));
                                }
                              });
                          }}
                        />
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