import { Shield, Lock, Eye, Server, Brain, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const principles = [
  {
    icon: Shield,
    title: "Security Philosophy",
    description: "VitaSignal is designed with a deny-by-default security posture. Every data access path requires explicit authorization. Row-level security policies enforce strict access controls at the database layer, ensuring data isolation between organizational contexts.",
    points: [
      "Deny-by-default access model across all data layers",
      "Row-level security enforced at the database engine",
      "Encryption at rest (AES-256) and in transit (TLS 1.3)",
      "Automated key rotation with hardware-backed storage",
    ],
  },
  {
    icon: Lock,
    title: "Privacy & Data Stewardship",
    description: "Patient data is never sold, shared for advertising, or used beyond the scope of the intended clinical intelligence functions. VitaSignal processes only EHR-derived metadata — documentation timestamps, frequency patterns, and workflow signals — not raw clinical notes or protected health information in its core analytics pipeline.",
    points: [
      "No patient data sold or shared for advertising",
      "Core analytics operate on temporal metadata, not raw PHI",
      "Configurable data retention with automated cleanup",
      "CCPA/CPRA-compliant deletion request workflows",
    ],
  },
  {
    icon: Brain,
    title: "Responsible AI & Governance",
    description: "Fairness-preserving design is built into VitaSignal's analytical systems from the ground up. Model outputs include SHAP-based explainability, equity monitoring across demographic subgroups, and bias detection as a standing validation requirement — not a post-hoc audit.",
    points: [
      "SHAP-based explainability for every prediction output",
      "Equity monitoring across demographic subgroups",
      "Standing bias detection in validation protocols",
      "Transparent methodology documentation",
    ],
  },
  {
    icon: Server,
    title: "Implementation & Deployment",
    description: "VitaSignal is designed for deployment within existing health system infrastructure. The platform operates on data already embedded in care delivery workflows — requiring no new hardware, no bedside sensors, and no additional documentation burden on care teams.",
    points: [
      "Software-only deployment — no new hardware required",
      "Designed for EHR-native integration via FHIR R4 and HL7",
      "Business Associate Agreement (BAA) readiness for covered entities",
      "Immutable audit logging of all data access and system actions",
    ],
  },
  {
    icon: Eye,
    title: "Compliance-Minded Design",
    description: "VitaSignal is designed with security, privacy, and responsible deployment in mind. The platform architecture follows HIPAA technical safeguard requirements including access controls, audit controls, integrity controls, and transmission security. Formal certification processes are part of our commercialization roadmap.",
    points: [
      "Architecture aligned with HIPAA technical safeguards",
      "IEC 62304 software lifecycle documentation maintained",
      "ISO 14971 clinical hazard analysis documented",
      "Pre-market research prototype — not FDA cleared or approved",
    ],
  },
  {
    icon: Users,
    title: "Access Controls & Audit",
    description: "Role-based access control enforces the principle of least privilege across all system functions. Every administrative action and data access event is logged in immutable audit records, supporting organizational compliance and forensic review requirements.",
    points: [
      "Role-based access control (RBAC) with least privilege",
      "Multi-factor authentication for administrative access",
      "Session management with automatic timeout policies",
      "Comprehensive incident response procedures documented",
    ],
  },
];

export default function Security() {
  return (
    <SiteLayout
      title="Security & Compliance"
      description="VitaSignal's approach to security, privacy, responsible AI, and compliance-minded design for clinical intelligence systems."
    >
      <Helmet>
        <meta name="keywords" content="healthcare AI security, clinical AI compliance, responsible AI governance, HIPAA aligned, patient data privacy" />
      </Helmet>

      {/* Hero */}
      <section className="py-16 md:py-24 px-6 border-b border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Security & Compliance
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-foreground mb-5 leading-tight">
            Designed with Security, Privacy,
            <br />
            <span className="text-primary">and Responsible Deployment in Mind</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            VitaSignal's architecture prioritizes data stewardship, fairness-preserving AI governance,
            and compliance-minded infrastructure from the ground up — not as an afterthought.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border/50 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            Pre-market research prototype · Not a medical device · Not FDA cleared
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {principles.map((p) => (
            <Card key={p.title} className="border-border/50 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <p.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{p.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.description}</p>
                <ul className="space-y-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground">{pt}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-muted/30 border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
            Questions About Security or Partnerships?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            We welcome conversations with security teams, compliance officers, and partnership leads
            evaluating VitaSignal for their organizations.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" asChild>
              <a href="mailto:licensing@vitasignal.ai" className="gap-2">
                Contact Security & Partnerships <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/trust">View Trust Center</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
