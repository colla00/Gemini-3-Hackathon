import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Link } from "react-router-dom";
import {
  Shield, CheckCircle2, Clock, AlertTriangle, FileText,
  Lock, Brain, Users, Activity, Database, Eye, Cpu
} from "lucide-react";

interface ComplianceItem {
  label: string;
  status: "complete" | "in-progress" | "planned";
  detail: string;
}

interface ComplianceSection {
  title: string;
  icon: React.ElementType;
  standard: string;
  progress: number;
  items: ComplianceItem[];
}

const sections: ComplianceSection[] = [
  {
    title: "FDA SaMD Readiness",
    icon: Shield,
    standard: "21 CFR 820 / IMDRF SaMD",
    progress: 35,
    items: [
      { label: "Intended use statement defined", status: "complete", detail: "ICU mortality risk prediction from documentation patterns" },
      { label: "SaMD categorization (IMDRF)", status: "complete", detail: "Category IIb — informs clinical management for serious conditions" },
      { label: "Clinical validation (retrospective)", status: "complete", detail: "n=26,153 ICU admissions, MIMIC-IV, AUC 0.683" },
      { label: "Software documentation (IEC 62304)", status: "in-progress", detail: "Software architecture and risk analysis underway" },
      { label: "Predetermined change control plan", status: "in-progress", detail: "Algorithm retraining triggers defined" },
      { label: "510(k) / De Novo pathway determination", status: "planned", detail: "Regulatory counsel engagement planned" },
      { label: "Prospective clinical validation", status: "planned", detail: "Multi-site study protocol in development" },
      { label: "FDA Pre-Submission (Q-Sub)", status: "planned", detail: "Targeted after prospective validation" },
    ],
  },
  {
    title: "HIPAA Compliance",
    icon: Lock,
    standard: "45 CFR Parts 160, 164",
    progress: 60,
    items: [
      { label: "De-identified data only (research phase)", status: "complete", detail: "MIMIC-IV PhysioNet credentialed access" },
      { label: "Encryption at rest & in transit", status: "complete", detail: "AES-256 storage, TLS 1.3 transport" },
      { label: "Role-based access control (RBAC)", status: "complete", detail: "Admin, Staff, Viewer roles implemented" },
      { label: "Audit logging with IP tracking", status: "complete", detail: "Comprehensive audit trail system active" },
      { label: "Session timeout (30 min)", status: "complete", detail: "Automatic session expiration enforced" },
      { label: "BAA framework for deployment", status: "planned", detail: "Template prepared for partner sites" },
      { label: "Privacy Impact Assessment", status: "planned", detail: "Scheduled prior to any PHI integration" },
    ],
  },
  {
    title: "AI Transparency (XAI)",
    icon: Brain,
    standard: "FDA AI/ML Guidance / Model Cards",
    progress: 75,
    items: [
      { label: "SHAP explainability for every prediction", status: "complete", detail: "Feature-level attribution visualized in dashboard" },
      { label: "Model Card published", status: "complete", detail: "Training data, metrics, limitations documented" },
      { label: "Clinician-facing explanation interface", status: "complete", detail: "Risk narratives and feature importance rankings" },
      { label: "Confidence intervals displayed", status: "complete", detail: "Uncertainty quantification for all predictions" },
      { label: "Bias monitoring dashboard", status: "complete", detail: "Demographic subgroup performance tracking" },
      { label: "External interpretability audit", status: "planned", detail: "Third-party review of explanation fidelity" },
    ],
  },
  {
    title: "Equity & Fairness",
    icon: Users,
    standard: "FDA Equity Guidance / AIM-AHEAD",
    progress: 55,
    items: [
      { label: "Health Equity Analyzer built", status: "complete", detail: "Real-time demographic disparity detection" },
      { label: "No demographic features as direct inputs", status: "complete", detail: "Only temporal documentation features used" },
      { label: "Subgroup performance analysis (MIMIC-IV)", status: "complete", detail: "Age, gender, race/ethnicity evaluated" },
      { label: "Fairness metrics defined", status: "in-progress", detail: "Demographic parity and equalized odds thresholds" },
      { label: "External multi-site equity validation", status: "planned", detail: "Planned across diverse healthcare settings" },
    ],
  },
  {
    title: "Quality Management",
    icon: Activity,
    standard: "ISO 13485:2016 / ISO 14971",
    progress: 30,
    items: [
      { label: "Risk management framework (ISO 14971)", status: "in-progress", detail: "Hazard identification and risk estimation ongoing" },
      { label: "Design History File (DHF) initiated", status: "in-progress", detail: "Design inputs and reviews documented" },
      { label: "CAPA procedures defined", status: "in-progress", detail: "Corrective/preventive action workflows established" },
      { label: "Full ISO 13485 QMS implementation", status: "planned", detail: "Targeted for post-seed funding phase" },
      { label: "Internal audit program", status: "planned", detail: "Annual audit schedule to be established" },
    ],
  },
  {
    title: "Cybersecurity",
    icon: Database,
    standard: "FDA Cybersecurity Guidance / NIST",
    progress: 50,
    items: [
      { label: "Secure development practices", status: "complete", detail: "Code review, dependency scanning, RBAC" },
      { label: "Rate limiting & abuse detection", status: "complete", detail: "Rate limit monitoring with violation logging" },
      { label: "Data encryption (rest + transit)", status: "complete", detail: "AES-256 and TLS 1.3 enforced" },
      { label: "SBOM (Software Bill of Materials)", status: "in-progress", detail: "Dependency inventory being formalized" },
      { label: "Penetration testing", status: "planned", detail: "Scheduled prior to clinical deployment" },
      { label: "Incident response plan", status: "planned", detail: "Formal IR procedures in development" },
    ],
  },
  {
    title: "Post-Market Surveillance",
    icon: Eye,
    standard: "21 CFR 803 / PMCF",
    progress: 40,
    items: [
      { label: "Real-time performance monitoring dashboard", status: "complete", detail: "AUC, sensitivity, specificity tracked live" },
      { label: "Model drift detection designed", status: "complete", detail: "Data and concept drift monitoring architecture" },
      { label: "Alert fatigue metrics tracked", status: "complete", detail: "Trust-based alert system with fatigue reduction" },
      { label: "MDR (Medical Device Reporting) procedures", status: "planned", detail: "To be established pre-market clearance" },
      { label: "PMCF plan", status: "planned", detail: "Post-market clinical follow-up protocol" },
    ],
  },
];

const statusConfig = {
  complete: { icon: CheckCircle2, color: "text-risk-low", bg: "bg-risk-low/10", label: "Complete" },
  "in-progress": { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "In Progress" },
  planned: { icon: AlertTriangle, color: "text-muted-foreground", bg: "bg-muted", label: "Planned" },
};

function Regulatory() {
  const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0);
  const completedItems = sections.reduce(
    (acc, s) => acc + s.items.filter((i) => i.status === "complete").length,
    0
  );
  const overallProgress = Math.round((completedItems / totalItems) * 100);

  return (
    <SiteLayout
      title="Regulatory Readiness"
      description="VitaSignal regulatory compliance roadmap — FDA SaMD, HIPAA, ISO 13485, AI transparency, and equity standards."
    >
      {/* Hero */}
      <section className="bg-foreground text-primary-foreground py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/20 border border-primary/30 text-sm">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">Compliance Framework</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4">
            Regulatory Readiness
          </h1>
          <p className="text-lg opacity-80 max-w-2xl mb-6">
            Tracking progress across FDA SaMD, HIPAA, ISO 13485, AI transparency, 
            equity, and cybersecurity standards for the VitaSignal platform.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-sm mb-1">
                <span className="opacity-70">Overall Progress</span>
                <span className="font-bold text-primary">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            <Badge className="bg-primary/20 border-primary/30 text-primary">
              {completedItems}/{totalItems} items addressed
            </Badge>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 px-6 bg-warning/10 border-b border-warning/20">
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Research Prototype:</strong> This roadmap reflects progress toward 
            regulatory readiness. VitaSignal is NOT currently FDA-cleared or approved. Items marked "Complete" indicate 
            features built into the platform — not regulatory certification.
          </p>
        </div>
      </section>

      {/* Compliance Sections */}
      {sections.map((section, idx) => (
        <section key={section.title} className={`py-12 px-6 ${idx % 2 === 0 ? "" : "bg-secondary/30"}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                  <section.icon className="w-5 h-5 text-primary" />
                  {section.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">{section.standard}</p>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={section.progress} className="w-24 h-2" />
                <span className="text-sm font-medium text-foreground">{section.progress}%</span>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-3">
                {section.items.map((item) => {
                  const cfg = statusConfig[item.status];
                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border/30 bg-card"
                    >
                      <div className={`w-6 h-6 rounded-full ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <cfg.icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <Badge variant="outline" className={`text-[10px] ${cfg.color} border-current/20`}>
                            {cfg.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </section>
      ))}

      {/* Next Steps */}
      <section className="py-12 px-6 bg-foreground text-primary-foreground">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-xl mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Next Milestones
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { phase: "Phase 1", title: "Prospective Validation", timeline: "2026 Q3–Q4", desc: "Multi-site clinical study with IRB approval" },
              { phase: "Phase 2", title: "FDA Pre-Submission", timeline: "2027 Q1", desc: "Q-Sub meeting with FDA CDRH to confirm pathway" },
              { phase: "Phase 3", title: "Market Authorization", timeline: "2027 Q3+", desc: "510(k) or De Novo submission based on FDA feedback" },
            ].map((m) => (
              <div key={m.phase} className="p-4 rounded-lg bg-primary-foreground/10 border border-primary/20">
                <Badge className="bg-primary/20 border-primary/30 text-primary text-[10px] mb-2">{m.phase}</Badge>
                <p className="font-semibold text-sm">{m.title}</p>
                <p className="text-xs opacity-70 mt-1">{m.timeline}</p>
                <p className="text-xs opacity-60 mt-2">{m.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-center opacity-50 mt-6">
            See our <Link to="/model-card" className="text-primary underline">Model Card</Link> for 
            detailed performance metrics and limitations.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Regulatory;
