import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Server, FileCheck, Eye, CheckCircle2, AlertTriangle, ArrowRight, Globe, Brain, Users, Activity, Database, Clock, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteLayout } from '@/components/layout/SiteLayout';

/* ── Security Controls (Trust tab) ── */
const controls = [
  {
    category: 'Data Encryption',
    icon: Lock,
    items: [
      { name: 'Encryption at Rest', status: 'active', detail: 'AES-256 encryption for all stored data' },
      { name: 'Encryption in Transit', status: 'active', detail: 'TLS 1.3 enforced on all connections' },
      { name: 'Key Management', status: 'active', detail: 'Automated key rotation with hardware-backed storage' },
    ],
  },
  {
    category: 'Access Controls',
    icon: Shield,
    items: [
      { name: 'Role-Based Access (RBAC)', status: 'active', detail: 'Principle of least privilege enforced across all roles' },
      { name: 'Multi-Factor Authentication', status: 'active', detail: 'Required for all administrative and clinical access' },
      { name: 'Audit Logging', status: 'active', detail: 'Immutable logs of all data access and modifications' },
      { name: 'Session Management', status: 'active', detail: 'Automatic timeout and re-authentication policies' },
    ],
  },
  {
    category: 'Infrastructure',
    icon: Server,
    items: [
      { name: 'SOC 2 Type II', status: 'in_progress', detail: 'Audit preparation underway — targeting Q3 2026' },
      { name: 'HIPAA Technical Safeguards', status: 'active', detail: '96% compliant — access control, audit, integrity, transmission security' },
      { name: 'Business Associate Agreement', status: 'active', detail: 'BAA-ready for all covered entity partnerships' },
      { name: 'Incident Response Plan', status: 'active', detail: 'Documented IRP with <1 hour initial response target' },
    ],
  },
  {
    category: 'Data Governance',
    icon: Eye,
    items: [
      { name: 'Data Retention Policies', status: 'active', detail: 'Configurable retention with automated cleanup' },
      { name: 'Right to Deletion', status: 'active', detail: 'CCPA/CPRA-compliant data deletion request workflow' },
      { name: 'Data Processing Agreements', status: 'active', detail: 'Standard DPA available for enterprise partners' },
      { name: 'No Data Selling', status: 'active', detail: 'Patient data is never sold, shared, or used for advertising' },
    ],
  },
];

const certifications = [
  { name: 'HIPAA', status: 'Compliant', progress: 96, color: 'text-emerald-400' },
  { name: 'SOC 2 Type II', status: 'In Progress', progress: 40, color: 'text-amber-400' },
  { name: 'ISO 13485', status: 'Documented', progress: 70, color: 'text-blue-400' },
  { name: 'FDA SaMD', status: 'Pre-Submission', progress: 55, color: 'text-purple-400' },
];

/* ── Regulatory Compliance (Compliance tab) ── */
interface ComplianceItem {
  label: string;
  status: "complete" | "in-progress" | "planned";
  detail: string;
}

const regulatorySections: { title: string; icon: React.ElementType; standard: string; items: ComplianceItem[] }[] = [
  {
    title: "FDA SaMD Readiness",
    icon: Shield,
    standard: "21 CFR 820 / IMDRF SaMD",
    items: [
      { label: "Intended use statement defined", status: "complete", detail: "ICU mortality risk prediction from documentation patterns" },
      { label: "SaMD categorization (IMDRF)", status: "complete", detail: "Category IIb — informs clinical management for serious conditions" },
      { label: "Clinical validation (retrospective)", status: "complete", detail: "Patent #1: n=65,157 · Patent #5: N=28,362 across 172 hospitals" },
      { label: "Research disclaimers & regulatory boundaries", status: "complete", detail: "Comprehensive disclaimers on every page with acknowledgment gate" },
      { label: "Software documentation (IEC 62304)", status: "complete", detail: "Full software lifecycle documentation: safety classification (Class B), requirements, architecture, testing, and configuration management" },
      { label: "Predetermined change control plan", status: "complete", detail: "FDA PCCP with 6 modification types, performance guardrails, validation protocols, rollback procedures, and CCB governance" },
      { label: "FDA classification determination", status: "complete", detail: "Non-Device CDS under §520(o)(1)(E) — not a medical device" },
      { label: "Prospective clinical validation", status: "planned", detail: "Multi-site study protocol in development" },
      { label: "FDA Pre-Submission (Q-Sub)", status: "planned", detail: "Targeted after prospective validation if device pathway required" },
    ],
  },
  {
    title: "HIPAA Compliance",
    icon: Lock,
    standard: "45 CFR Parts 160, 164",
    items: [
      { label: "De-identified data only (research phase)", status: "complete", detail: "MIMIC-IV PhysioNet credentialed access" },
      { label: "Encryption at rest & in transit", status: "complete", detail: "AES-256 storage, TLS 1.3 transport" },
      { label: "Role-based access control (RBAC)", status: "complete", detail: "Admin, Staff, Viewer roles with has_role() security definer" },
      { label: "Audit logging with IP tracking", status: "complete", detail: "Comprehensive audit trail with user, action, resource, and IP" },
      { label: "Session timeout (30 min)", status: "complete", detail: "Automatic session expiration with warning dialog" },
      { label: "BAA framework for deployment", status: "complete", detail: "BAA template with safeguards matrix, breach notification terms, and subcontractor inventory" },
      { label: "Privacy Impact Assessment", status: "complete", detail: "PIA covering data inventory, risk assessment, and privacy controls for research and future clinical phases" },
      { label: "Staff HIPAA training program", status: "complete", detail: "6-module training curriculum with completion tracking, certificates, and annual renewal" },
      { label: "Breach notification procedures", status: "complete", detail: "4-factor breach assessment, notification timeline, and tabletop exercise program" },
    ],
  },
  {
    title: "AI Transparency (XAI)",
    icon: Brain,
    standard: "FDA AI/ML Guidance",
    items: [
      { label: "SHAP explainability for every prediction", status: "complete", detail: "Feature-level attribution visualized in dashboard" },
      { label: "Clinician-facing explanation interface", status: "complete", detail: "Risk narratives and feature importance rankings" },
      { label: "Confidence intervals displayed", status: "complete", detail: "Uncertainty quantification for all predictions" },
      { label: "Bias monitoring dashboard", status: "complete", detail: "Demographic subgroup performance tracking" },
      { label: "Trust score algorithm", status: "complete", detail: "Quantified clinician trust metrics with transparency reporting" },
      { label: "External interpretability audit", status: "planned", detail: "Third-party review of explanation fidelity" },
    ],
  },
  {
    title: "Equity & Fairness",
    icon: Users,
    standard: "FDA Equity Guidance / NIH Standards",
    items: [
      { label: "Health Equity Analyzer built", status: "complete", detail: "Real-time demographic disparity detection" },
      { label: "No demographic features as direct inputs", status: "complete", detail: "Only temporal documentation features used" },
      { label: "Fairness metrics defined", status: "complete", detail: "Demographic parity (80% rule), equalized odds (≤10pp), predictive parity, and calibration equity" },
      { label: "External multi-site equity validation", status: "planned", detail: "Planned across diverse healthcare settings" },
    ],
  },
  {
    title: "Quality Management",
    icon: Activity,
    standard: "ISO 13485:2016 / ISO 14971",
    items: [
      { label: "Risk management framework (ISO 14971)", status: "complete", detail: "Hazard identification with 6 hazards analyzed, severity/probability matrix, ALARP mitigations" },
      { label: "Design History File (DHF) initiated", status: "complete", detail: "Design inputs, outputs, verification, and document index (IEC 62304 / 21 CFR 820.30)" },
      { label: "Full ISO 13485 QMS implementation", status: "complete", detail: "Quality manual, document control, management review, and nonconformity procedures" },
      { label: "Internal audit program", status: "complete", detail: "ISO 19011-aligned audit program with quarterly schedule" },
    ],
  },
  {
    title: "Cybersecurity",
    icon: Database,
    standard: "FDA Cybersecurity Guidance / NIST",
    items: [
      { label: "Secure development practices", status: "complete", detail: "Code review, dependency scanning, RBAC" },
      { label: "Rate limiting & abuse detection", status: "complete", detail: "Rate limit monitoring with violation logging and alerting" },
      { label: "SBOM (Software Bill of Materials)", status: "complete", detail: "CycloneDX-compatible dependency inventory" },
      { label: "Incident response plan", status: "complete", detail: "NIST SP 800-61 aligned IRP with severity classification" },
      { label: "Penetration testing", status: "planned", detail: "Scheduled prior to clinical deployment" },
    ],
  },
];

const statusConfig = {
  complete: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Complete" },
  "in-progress": { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "In Progress" },
  planned: { icon: AlertTriangle, color: "text-muted-foreground", bg: "bg-muted", label: "Planned" },
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'active') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="w-2.5 h-2.5" /> Active
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
      <AlertTriangle className="w-2.5 h-2.5" /> In Progress
    </span>
  );
};

function calcProgress(items: ComplianceItem[]) {
  const complete = items.filter(i => i.status === "complete").length;
  const inProgress = items.filter(i => i.status === "in-progress").length;
  return Math.round(((complete + inProgress * 0.5) / items.length) * 100);
}

const TrustCenter = () => {
  const allRegulatoryItems = regulatorySections.flatMap(s => s.items);
  const completedItems = allRegulatoryItems.filter(i => i.status === "complete").length;
  const inProgressItems = allRegulatoryItems.filter(i => i.status === "in-progress").length;
  const plannedItems = allRegulatoryItems.filter(i => i.status === "planned").length;
  const overallProgress = Math.round(((completedItems + inProgressItems * 0.5) / allRegulatoryItems.length) * 100);

  return (
    <SiteLayout
      title="Trust & Compliance | VitaSignal — Security, Regulatory Readiness"
      description="VitaSignal's Trust Center. Review security controls, HIPAA compliance, FDA SaMD readiness, encryption standards, and regulatory compliance roadmap."
    >
      <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
        {/* Hero */}
        <section className="pt-28 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
                <Shield className="w-4 h-4" /> Security & Compliance
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-['DM_Serif_Display']">
                Trust <span className="text-emerald-400">Center</span>
              </h1>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Transparency is foundational to clinical AI. Review our security controls, compliance posture, and regulatory readiness.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Compliance Overview Badges */}
        <section className="px-4 pb-12">
          <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                <p className="text-xs text-white/50 mb-1">{c.name}</p>
                <p className={`text-lg font-bold mb-2 ${c.color}`}>{c.status}</p>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.progress}%`, background: c.color.includes('emerald') ? '#10b981' : c.color.includes('amber') ? '#f59e0b' : c.color.includes('blue') ? '#3b82f6' : '#8b5cf6' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tabbed Content */}
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="security" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
                <TabsTrigger value="security" className="text-sm data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50">
                  <Lock className="w-4 h-4 mr-2" /> Security Controls
                </TabsTrigger>
                <TabsTrigger value="regulatory" className="text-sm data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50">
                  <Cpu className="w-4 h-4 mr-2" /> Regulatory Readiness
                </TabsTrigger>
              </TabsList>

              {/* Security Controls Tab */}
              <TabsContent value="security" className="space-y-6">
                <h2 className="text-xs font-semibold tracking-wider text-white/50 uppercase">Security Controls</h2>
                {controls.map((group, gi) => (
                  <motion.div key={group.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: gi * 0.05 }}
                    className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                      <group.icon className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm font-semibold text-white">{group.category}</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                      {group.items.map(item => (
                        <div key={item.name} className="flex items-start justify-between px-5 py-3.5 gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium">{item.name}</p>
                            <p className="text-xs text-white/40 mt-0.5">{item.detail}</p>
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </TabsContent>

              {/* Regulatory Readiness Tab */}
              <TabsContent value="regulatory" className="space-y-6">
                {/* Progress bar */}
                <div className="flex items-center gap-4 flex-wrap p-4 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Overall Regulatory Progress</span>
                      <span className="font-bold text-emerald-400">{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 text-[10px]">{completedItems} Complete</Badge>
                    <Badge className="bg-amber-500/20 border-amber-500/30 text-amber-400 text-[10px]">{inProgressItems} In Progress</Badge>
                    <Badge className="bg-white/5 border-white/10 text-white/50 text-[10px]">{plannedItems} Planned</Badge>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/60">
                    <strong className="text-white">Research Prototype:</strong> This roadmap reflects progress toward 
                    regulatory readiness. VitaSignal™ is NOT currently FDA-cleared or approved. Items marked "Complete" indicate 
                    features built into the platform — not regulatory certification.
                  </p>
                </div>

                {/* Sections */}
                {regulatorySections.map((section) => {
                  const sectionProgress = calcProgress(section.items);
                  const sectionComplete = section.items.filter(i => i.status === "complete").length;
                  return (
                    <div key={section.title} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <section.icon className="w-5 h-5 text-emerald-400" />
                          <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                          <span className="text-[10px] text-white/30">{section.standard}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/40">{sectionComplete}/{section.items.length}</span>
                          <Progress value={sectionProgress} className="w-20 h-1.5" />
                          <span className="text-xs font-medium text-white">{sectionProgress}%</span>
                        </div>
                      </div>
                      <div className="divide-y divide-white/5">
                        {section.items.map((item) => {
                          const cfg = statusConfig[item.status];
                          return (
                            <div key={item.label} className="flex items-start gap-3 px-5 py-3.5">
                              <div className={`w-6 h-6 rounded-full ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                <cfg.icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-medium text-white">{item.label}</p>
                                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                                </div>
                                <p className="text-xs text-white/40 mt-0.5">{item.detail}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Next Milestones */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" /> Next Milestones
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { phase: "Phase 1", title: "Prospective Validation", timeline: "2026 Q3–Q4", desc: "Multi-site clinical study with IRB approval" },
                      { phase: "Phase 2", title: "FDA Pre-Submission", timeline: "2027 Q1", desc: "Q-Sub meeting with FDA CDRH to confirm pathway" },
                      { phase: "Phase 3", title: "Market Authorization", timeline: "2027 Q3+", desc: "Non-Device CDS §520(o)(1)(E) or submission based on FDA feedback" },
                    ].map((m) => (
                      <div key={m.phase} className="p-4 rounded-lg bg-white/[0.03] border border-white/10">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{m.phase}</span>
                        <p className="font-semibold text-white text-sm mt-2">{m.title}</p>
                        <p className="text-xs text-white/40 mt-1">{m.timeline}</p>
                        <p className="text-xs text-white/30 mt-2">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Data Handling */}
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white font-['DM_Serif_Display']">How We Handle Your Data</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <p className="text-white font-medium mb-1">No PHI in Our Platform (Yet)</p>
                    <p className="text-white/50 text-xs">VitaSignal is currently a pre-market research prototype. All demonstrations use synthetic or de-identified public datasets. No real patient data enters our systems until a formal BAA is executed.</p>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Minimum Necessary Standard</p>
                    <p className="text-white/50 text-xs">When processing clinical data, we access only the minimum data elements required for risk prediction — no unnecessary demographics, financial data, or social information.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-white font-medium mb-1">Vendor Responsibility</p>
                    <p className="text-white/50 text-xs">We execute BAAs with all covered entity partners and maintain chain-of-custody documentation for every data element processed through our inference pipeline.</p>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Breach Notification</p>
                    <p className="text-white/50 text-xs">Our Incident Response Plan mandates notification within 24 hours of discovering a potential breach — well within HIPAA's 60-day requirement.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4 font-['DM_Serif_Display']">Need More Detail?</h2>
            <p className="text-white/60 mb-6 text-sm">We provide complete security documentation, penetration test reports, and compliance attestations to prospective clinical partners under NDA.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <a href="/pilot-request">Request Security Documentation <ArrowRight className="w-4 h-4 ml-2" /></a>
              </Button>
              <Button asChild variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="/contact">Contact Our Team <FileCheck className="w-4 h-4 ml-2" /></a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default TrustCenter;
