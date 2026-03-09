import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2, Shield, Key, FileText, Server, TestTube, Zap,
  Clock, Users, AlertTriangle, Copy, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ── Onboarding Steps ─────────────────────────────── */
const onboardingSteps = [
  { id: "nda", icon: Shield, label: "Execute Mutual NDA", detail: "Both parties sign a mutual non-disclosure agreement before any technical data is exchanged.", category: "legal" },
  { id: "baa", icon: FileText, label: "Execute BAA", detail: "Business Associate Agreement required for any PHI access per HIPAA §164.502(e).", category: "legal" },
  { id: "sandbox", icon: TestTube, label: "Provision Sandbox Environment", detail: "VitaSignal provisions a dedicated sandbox with test API keys and synthetic patient data.", category: "technical" },
  { id: "apikey", icon: Key, label: "Exchange API Credentials", detail: "Vendor receives x-api-key for the webhook endpoint. VitaSignal receives SMART on FHIR client credentials.", category: "technical" },
  { id: "fhir", icon: Server, label: "Configure FHIR R4 Endpoints", detail: "Map vendor-specific FHIR endpoints. Test Patient, Observation, Encounter, and Condition resources.", category: "technical" },
  { id: "smart", icon: Zap, label: "SMART on FHIR Authorization", detail: "Register VitaSignal as a SMART app. Configure OAuth 2.0 scopes and launch context.", category: "technical" },
  { id: "test", icon: TestTube, label: "Integration Testing", detail: "End-to-end testing with synthetic data. Validate data flow, error handling, and latency.", category: "validation" },
  { id: "security", icon: Shield, label: "Security Review", detail: "Vendor security questionnaire, penetration test results, SOC 2 report exchange.", category: "validation" },
  { id: "pilot", icon: Users, label: "Pilot Deployment", detail: "Limited deployment to 1-2 units with real (de-identified) data under clinical supervision.", category: "validation" },
  { id: "golive", icon: CheckCircle2, label: "Production Go-Live", detail: "Full production deployment with monitoring, alerting, and SLA commitments.", category: "validation" },
];

/* ── Sandbox Documentation ────────────────────────── */
const sandboxEndpoint = "https://itgnlmhypwufwrgguvav.supabase.co/functions/v1/fhir-webhook";

const curlExample = `curl -X POST "${sandboxEndpoint}" \\
  -H "Content-Type: application/fhir+json" \\
  -H "x-api-key: YOUR_SANDBOX_KEY" \\
  -H "x-fhir-vendor: epic" \\
  -H "x-fhir-signature: sha256=YOUR_HMAC_SIGNATURE" \\
  -d '{
    "resourceType": "Observation",
    "id": "vitals-001",
    "status": "final",
    "subject": { "reference": "Patient/test-12345" },
    "code": {
      "coding": [{
        "system": "http://loinc.org",
        "code": "8867-4",
        "display": "Heart rate"
      }]
    },
    "valueQuantity": { "value": 88, "unit": "beats/min" }
  }'`;

/* ── SMART on FHIR Docs ──────────────────────────── */
const smartScopes = [
  { scope: "launch", desc: "EHR launch context" },
  { scope: "patient/Patient.read", desc: "Read patient demographics" },
  { scope: "patient/Observation.read", desc: "Read vital signs & labs" },
  { scope: "patient/Encounter.read", desc: "Read encounter data" },
  { scope: "patient/Condition.read", desc: "Read active conditions" },
  { scope: "patient/RiskAssessment.write", desc: "Write VitaSignal risk scores" },
  { scope: "openid fhirUser", desc: "User identity for audit trail" },
];

const smartFlow = [
  { step: 1, title: "EHR Launch", detail: "Clinician opens VitaSignal from within EHR (patient-view hook)" },
  { step: 2, title: "Authorization", detail: "OAuth 2.0 authorization code flow with PKCE" },
  { step: 3, title: "Token Exchange", detail: "VitaSignal receives access_token + patient context" },
  { step: 4, title: "Data Retrieval", detail: "Fetch Patient, Observations, Conditions via FHIR R4" },
  { step: 5, title: "Risk Analysis", detail: "VitaSignal temporal pattern engine generates risk score" },
  { step: 6, title: "CDS Response", detail: "Risk card returned via CDS Hooks or embedded in EHR" },
];

/* ── NDA/BAA Framework ────────────────────────────── */
const baaRequirements = [
  "Permitted uses and disclosures of PHI",
  "Safeguards to prevent unauthorized use or disclosure",
  "Reporting obligations for security incidents",
  "Subcontractor BAA flow-down requirements",
  "Return/destruction of PHI upon termination",
  "Individual access rights to PHI",
  "Amendment rights for PHI",
  "Accounting of disclosures",
  "Compliance with HITECH Act requirements",
  "Breach notification procedures (60-day window)",
];

export function VendorOnboardingChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const progress = Math.round((completed.size / onboardingSteps.length) * 100);

  return (
    <div className="space-y-12">
      {/* ── Vendor Onboarding Checklist ────────── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">Vendor Onboarding Checklist</h3>
            <p className="text-sm text-muted-foreground">10-step process from NDA to production go-live</p>
          </div>
          <Badge variant="outline" className="text-sm font-mono">
            {completed.size}/{onboardingSteps.length} — {progress}%
          </Badge>
        </div>

        <div className="w-full bg-secondary rounded-full h-2 mb-6">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid gap-3">
          {onboardingSteps.map((step, i) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                completed.has(step.id) ? "bg-primary/5 border-primary/20" : "bg-card border-border"
              }`}
            >
              <Checkbox
                checked={completed.has(step.id)}
                onCheckedChange={() => toggle(step.id)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <step.icon className={`w-4 h-4 shrink-0 ${completed.has(step.id) ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${completed.has(step.id) ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {i + 1}. {step.label}
                  </span>
                  <Badge variant="secondary" className="text-[9px]">{step.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sandbox & API Keys ─────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TestTube className="w-5 h-5 text-primary" />
            Sandbox Environment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="font-medium text-foreground mb-1">Endpoint</p>
              <code className="text-xs text-muted-foreground break-all">POST /functions/v1/fhir-webhook</code>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="font-medium text-foreground mb-1">Rate Limit</p>
              <p className="text-xs text-muted-foreground">120 requests/min per IP</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="font-medium text-foreground mb-1">Max Payload</p>
              <p className="text-xs text-muted-foreground">500 KB per request</p>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-foreground text-primary-foreground rounded-lg p-4 text-xs font-mono overflow-x-auto">
              {curlExample}
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 text-primary-foreground/60 hover:text-primary-foreground"
              onClick={() => { navigator.clipboard.writeText(curlExample); toast.success("Copied to clipboard"); }}
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-800 dark:text-amber-200">
              <p className="font-medium">Sandbox API Keys</p>
              <p>API keys are provisioned per-vendor during onboarding. Contact the integration team to request sandbox credentials. Production keys require completed BAA.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── SMART on FHIR ──────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-primary" />
            SMART on FHIR Authorization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Authorization Flow</p>
            <div className="grid md:grid-cols-3 gap-3">
              {smartFlow.map(s => (
                <div key={s.step} className="flex items-start gap-2 p-2.5 bg-secondary/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{s.title}</p>
                    <p className="text-[10px] text-muted-foreground">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">Required OAuth Scopes</p>
            <div className="grid gap-2">
              {smartScopes.map(s => (
                <div key={s.scope} className="flex items-center gap-3 text-sm">
                  <code className="text-xs font-mono bg-secondary/80 px-2 py-0.5 rounded text-primary">{s.scope}</code>
                  <span className="text-xs text-muted-foreground">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── NDA / BAA Framework ────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            NDA & BAA Framework
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Mutual NDA</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />Standard mutual NDA covering proprietary algorithms and patient data</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />3-year term with automatic renewal</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />Covers IP, trade secrets, and technical specifications</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />Carve-outs for publicly available information</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">BAA Requirements (HIPAA §164.502(e))</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {baaRequirements.slice(0, 5).map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-muted-foreground mt-2 italic">
                + {baaRequirements.length - 5} additional provisions per HIPAA/HITECH
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              VitaSignal maintains template NDA and BAA documents reviewed by healthcare IP counsel. 
              Contact <strong>legal@vitasignal.ai</strong> to initiate the agreement process. 
              Typical turnaround: 5-10 business days.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
