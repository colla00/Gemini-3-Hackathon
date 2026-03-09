import { SiteLayout } from "@/components/layout/SiteLayout";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2, Shield, Server, Zap, ArrowRight, Code2, Database,
  Activity, FileText, Lock, Globe, Clock, Users
} from "lucide-react";
import { Link } from "react-router-dom";

/* ── Vendor data ─────────────────────────────────── */
const vendors = [
  {
    id: "epic",
    name: "Epic",
    share: "~38%",
    overview:
      "VitaSignal connects through Epic's App Orchard marketplace and FHIR R4 APIs. Support for CDS Hooks enables real-time clinical decision support embedded directly within the Epic workflow.",
    methods: [
      { name: "FHIR R4 API", desc: "Read patient demographics, observations, encounters, and conditions via RESTful FHIR endpoints." },
      { name: "CDS Hooks", desc: "Trigger VitaSignal risk assessments at key clinical decision points (patient-view, order-select)." },
      { name: "SMART on FHIR", desc: "Launch VitaSignal as an embedded app within the Epic EHR using SMART authorization." },
      { name: "App Orchard", desc: "Distributed through Epic's App Orchard marketplace for streamlined hospital onboarding." },
    ],
    endpoints: [
      { method: "GET", path: "/fhir/r4/Patient/{id}", desc: "Patient demographics" },
      { method: "GET", path: "/fhir/r4/Observation?patient={id}&category=vital-signs", desc: "Vital sign observations" },
      { method: "GET", path: "/fhir/r4/Encounter?patient={id}&status=in-progress", desc: "Active encounters" },
      { method: "POST", path: "/fhir/r4/$vitasignal-risk", desc: "Request risk assessment" },
    ],
  },
  {
    id: "cerner",
    name: "Oracle Health (Cerner)",
    share: "~25%",
    overview:
      "Integration with Oracle Health leverages Millennium Open APIs and FHIR R4 endpoints. VitaSignal ingests timestamped documentation data in real-time for continuous risk monitoring.",
    methods: [
      { name: "FHIR R4 API", desc: "Standard FHIR resources for patient data retrieval and observation submission." },
      { name: "Millennium Open APIs", desc: "Access Cerner's proprietary APIs for deeper EHR integration beyond FHIR." },
      { name: "SMART on FHIR", desc: "Embedded launch within PowerChart using SMART authorization flows." },
      { name: "CDS Hooks", desc: "Real-time decision support triggered during charting workflows." },
    ],
    endpoints: [
      { method: "GET", path: "/fhir/r4/Patient/{id}", desc: "Patient demographics" },
      { method: "GET", path: "/fhir/r4/DocumentReference?patient={id}", desc: "Clinical documents" },
      { method: "GET", path: "/fhir/r4/Condition?patient={id}&clinical-status=active", desc: "Active conditions" },
      { method: "POST", path: "/fhir/r4/ClinicalImpression", desc: "Submit risk assessment" },
    ],
  },
  {
    id: "meditech",
    name: "MEDITECH",
    share: "Community hospitals",
    overview:
      "MEDITECH Expanse supports FHIR R4 and provides web-based APIs for data exchange. VitaSignal's equipment-independent approach is particularly valuable for MEDITECH sites that may have limited bedside monitoring infrastructure.",
    methods: [
      { name: "FHIR R4 API", desc: "Patient, Observation, Encounter, and Condition resources via Expanse FHIR server." },
      { name: "Expanse Platform", desc: "Direct integration with MEDITECH Expanse for real-time documentation pattern analysis." },
      { name: "BCA Toolkit", desc: "Business & Clinical Analytics toolkit for batch data extraction and retrospective analysis." },
    ],
    endpoints: [
      { method: "GET", path: "/fhir/r4/Patient/{id}", desc: "Patient demographics" },
      { method: "GET", path: "/fhir/r4/Observation?patient={id}", desc: "All observations" },
      { method: "GET", path: "/fhir/r4/Encounter?patient={id}", desc: "Encounter history" },
    ],
  },
  {
    id: "allscripts",
    name: "Allscripts / Veradigm",
    share: "Mid-market",
    overview:
      "Allscripts Unity and Veradigm's open platform provide FHIR R4 endpoints and a developer-friendly API. VitaSignal integrates through standard FHIR and the Allscripts Open API for comprehensive data access.",
    methods: [
      { name: "FHIR R4 API", desc: "Standard FHIR resources for interoperability across Allscripts products." },
      { name: "Open API", desc: "RESTful API for accessing clinical, financial, and operational data." },
      { name: "Unity Platform", desc: "Deep integration with Allscripts Unity for ambulatory and acute care settings." },
    ],
    endpoints: [
      { method: "GET", path: "/fhir/r4/Patient/{id}", desc: "Patient demographics" },
      { method: "GET", path: "/fhir/r4/Observation?patient={id}&category=vital-signs", desc: "Vital signs" },
      { method: "POST", path: "/fhir/r4/RiskAssessment", desc: "Submit risk assessment" },
    ],
  },
];

const architectureSteps = [
  { icon: Database, label: "EHR System", detail: "Epic · Cerner · MEDITECH · Allscripts" },
  { icon: Shield, label: "FHIR R4 Gateway", detail: "SMART on FHIR auth + TLS 1.3" },
  { icon: Activity, label: "VitaSignal Engine", detail: "Temporal pattern analysis" },
  { icon: FileText, label: "Risk Output", detail: "CDS Hooks + dashboard alerts" },
];

const securityFeatures = [
  { icon: Lock, label: "End-to-End Encryption", detail: "TLS 1.3 in transit, AES-256 at rest" },
  { icon: Shield, label: "HIPAA Compliant", detail: "BAA-ready architecture, audit logging" },
  { icon: Users, label: "RBAC", detail: "Role-based access with OAuth 2.0 / SMART scopes" },
  { icon: Clock, label: "Audit Trail", detail: "Immutable logs for every data access event" },
  { icon: Globe, label: "SOC 2 Aligned", detail: "Controls mapped to SOC 2 Type II framework" },
  { icon: Server, label: "Zero-Footprint", detail: "No on-premise installation required" },
];

const EndpointRow = ({ method, path, desc }: { method: string; path: string; desc: string }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
    <Badge
      variant="outline"
      className={`text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
        method === "GET" ? "text-primary border-primary/30" : "text-accent border-accent/30"
      }`}
    >
      {method}
    </Badge>
    <div className="min-w-0">
      <code className="text-xs font-mono text-foreground break-all">{path}</code>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
  </div>
);

export const Integrations = () => (
  <SiteLayout
    title="EHR Integration Documentation | VitaSignal"
    description="Technical integration guides for connecting VitaSignal clinical AI with Epic, Oracle Health (Cerner), MEDITECH, and Allscripts EHR systems via FHIR R4."
  >
    <Helmet>
      <meta
        name="keywords"
        content="FHIR R4 integration, Epic EHR API, Cerner integration, MEDITECH API, Allscripts FHIR, clinical AI integration, EHR interoperability, SMART on FHIR, CDS Hooks"
      />
    </Helmet>

    {/* Hero */}
    <section className="relative py-20 px-6 bg-foreground text-primary-foreground overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, hsl(173 58% 29% / 0.5) 0%, transparent 50%),
                           radial-gradient(circle at 70% 60%, hsl(217 91% 35% / 0.3) 0%, transparent 50%)`,
        }}
      />
      <div className="relative max-w-5xl mx-auto text-center">
        <Badge variant="outline" className="mb-4 border-primary/40 text-primary bg-primary/10">
          FHIR R4 Compliant
        </Badge>
        <h1 className="font-display text-3xl md:text-5xl mb-4">
          EHR Integration
        </h1>
        <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
          Connect VitaSignal to your hospital's EHR in days, not months.
          Standards-based FHIR R4 APIs with vendor-specific optimization.
        </p>
      </div>
    </section>

    {/* Architecture overview */}
    <motion.section
      className="py-16 px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8 text-center">
          Integration Architecture
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {architectureSteps.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-3">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                {i < architectureSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-4 -right-8 w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm font-bold text-foreground">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* Vendor tabs */}
    <motion.section
      className="py-16 px-6 bg-secondary/30"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8 text-center">
          Vendor-Specific Guides
        </h2>

        <Tabs defaultValue="epic" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8">
            {vendors.map((v) => (
              <TabsTrigger key={v.id} value={v.id} className="text-xs md:text-sm">
                {v.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {vendors.map((v) => (
            <TabsContent key={v.id} value={v.id}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left — overview + methods */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{v.name}</CardTitle>
                      <Badge variant="outline" className="text-[10px]">
                        {v.share}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {v.overview}
                    </p>
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                        Integration Methods
                      </p>
                      {v.methods.map((m) => (
                        <div key={m.name} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{m.name}</p>
                            <p className="text-xs text-muted-foreground">{m.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Right — endpoints */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      API Endpoints
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {v.endpoints.map((e, idx) => (
                      <EndpointRow key={idx} {...e} />
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </motion.section>

    {/* Security */}
    <motion.section
      className="py-16 px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8 text-center">
          Security & Compliance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {securityFeatures.map((f) => (
            <Card key={f.label} className="text-center p-5">
              <f.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">{f.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{f.detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </motion.section>

    {/* Sample FHIR payload */}
    <motion.section
      className="py-16 px-6 bg-foreground text-primary-foreground"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl mb-6 text-center">
          Sample FHIR R4 Response
        </h2>
        <pre className="bg-background/10 backdrop-blur-sm rounded-xl p-6 text-sm font-mono overflow-x-auto text-primary-foreground/90 border border-primary/20">
{`{
  "resourceType": "RiskAssessment",
  "id": "vitasignal-icu-001",
  "status": "final",
  "subject": { "reference": "Patient/12345" },
  "occurrence": { "dateTime": "2026-03-09T14:30:00Z" },
  "method": {
    "coding": [{
      "system": "https://vitasignal.ai/fhir/method",
      "code": "IDI-temporal-v2",
      "display": "VitaSignal IDI Temporal Pattern Analysis"
    }]
  },
  "prediction": [{
    "outcome": {
      "coding": [{
        "system": "http://snomed.info/sct",
        "code": "419099009",
        "display": "Dead"
      }]
    },
    "probabilityDecimal": 0.73,
    "qualitativeRisk": {
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/risk-probability",
        "code": "high",
        "display": "High likelihood"
      }]
    }
  }]
}`}
        </pre>
      </div>
    </motion.section>

    {/* CTA */}
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
          Ready to Integrate?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Contact our integration team to discuss your EHR environment and start the onboarding process.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild className="gap-2">
            <Link to="/licensing">
              Explore Licensing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/contact">Contact Integration Team</Link>
          </Button>
        </div>
      </div>
    </section>
  </SiteLayout>
);

export default Integrations;
