import { SiteLayout } from "@/components/layout/SiteLayout";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { 
  FileText, Shield, Handshake, Server, Activity, CheckCircle2, 
  Clock, ArrowRight, Download, Users, Building2, Globe, 
  Stethoscope, Lock, Zap, BookOpen, MessageSquare, HeartPulse
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImplementationTimeline } from "@/components/integration/ImplementationTimeline";
import { IntegrationChecklist } from "@/components/integration/IntegrationChecklist";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

const phases = [
  {
    phase: "Phase 1",
    title: "Discovery & Evaluation",
    duration: "1–2 weeks",
    icon: BookOpen,
    steps: [
      "Submit licensing inquiry via vitasignal.ai/licensing",
      "Receive VitaSignal Technology Brief & investor deck",
      "Schedule a live walkthrough with the founding team",
      "Review patent portfolio and validation data",
      "Identify target use case (mortality prediction, DBS™, or both)",
    ],
  },
  {
    phase: "Phase 2",
    title: "NDA & Legal Framework",
    duration: "1–2 weeks",
    icon: Shield,
    steps: [
      "Execute mutual NDA (VitaSignal provides standard template)",
      "Gain access to confidential Data Room",
      "Review full technical specifications and architecture docs",
      "Legal review of licensing terms (Exclusive, Non-Exclusive, or Research)",
      "Identify integration scope and regulatory classification",
    ],
  },
  {
    phase: "Phase 3",
    title: "Technical Integration",
    duration: "4–8 weeks",
    icon: Server,
    steps: [
      "Receive sandbox API credentials and FHIR R4 endpoint access",
      "Map EHR timestamp fields to VitaSignal input schema",
      "Validate HL7 FHIR R4 message format with test payloads",
      "Configure SMART on FHIR launch context (if applicable)",
      "Run integration test suite against sandbox environment",
    ],
  },
  {
    phase: "Phase 4",
    title: "Clinical Validation Pilot",
    duration: "8–12 weeks",
    icon: Stethoscope,
    steps: [
      "Deploy to single-unit pilot environment",
      "Establish IRB protocol (if required by institution)",
      "Train clinical champions and nursing informatics staff",
      "Run parallel validation against existing EWS",
      "Collect DBS™ baseline metrics across pilot unit",
    ],
  },
  {
    phase: "Phase 5",
    title: "Production & Scale",
    duration: "Ongoing",
    icon: Globe,
    steps: [
      "Complete BAA execution and HIPAA compliance verification",
      "Production deployment with trust-calibrated alert governance",
      "Enterprise rollout across additional units / facilities",
      "Continuous model monitoring and performance reporting",
      "Quarterly business review and roadmap alignment",
    ],
  },
];

const licenseeTypes = [
  {
    icon: Building2,
    title: "EHR Vendors",
    subtitle: "Exclusive Integration",
    description: "Embed VitaSignal directly into your EHR platform. White-label mortality prediction and DBS™ as native features — no additional hardware required for your customers.",
    cta: "Explore Exclusive Licensing",
    benefits: ["First-mover advantage", "White-label ready", "Joint patent protection"],
  },
  {
    icon: HeartPulse,
    title: "Hospital Systems",
    subtitle: "Enterprise Deployment",
    description: "Deploy across your ICUs with existing EHR infrastructure. Integrate via standard FHIR R4 interfaces and quantify nursing documentation burden system-wide.",
    cta: "Start Pilot Program",
    benefits: ["90-day implementation", "$0 hardware cost", "Nurse-centered design"],
  },
  {
    icon: Globe,
    title: "Global Health",
    subtitle: "Resource-Limited Access",
    description: "Bring ICU-grade clinical intelligence to settings where bedside monitors aren't available. Equipment-independent by design, VitaSignal works wherever nurses document care.",
    cta: "Discuss Humanitarian Access",
    benefits: ["No infrastructure needed", "Offline-capable scoring", "Grant-eligible"],
  },
];

const IntegrationGuide = () => {
  return (
    <SiteLayout
      title="Integration Guide — Smooth Onboarding for Licensees"
      description="Step-by-step integration guide for EHR vendors, hospital systems, and research partners evaluating VitaSignal clinical AI technology."
    >
      <Helmet>
        <meta name="keywords" content="VitaSignal integration, EHR integration guide, FHIR R4 onboarding, clinical AI licensing, hospital system deployment" />
      </Helmet>

      {/* Hero */}
      <section className="relative py-24 px-6 bg-foreground text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div {...fadeUp}>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Integration Guide</p>
            <h1 className="font-display text-3xl md:text-5xl mb-4">
              From Inquiry to Production in{" "}
              <span className="text-primary">90 Days</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl text-base md:text-lg leading-relaxed mb-8">
              A clear, structured path for EHR vendors, hospital systems, and research partners 
              to evaluate, integrate, and deploy VitaSignal clinical AI technology.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/licensing">Start Licensing Inquiry <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">Talk to Our Team</Link>
              </Button>
            </div>
          </motion.div>

          {/* Quick stats */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { value: "90", unit: "days", label: "Pilot to production" },
              { value: "$0", unit: "", label: "Additional hardware" },
              { value: "FHIR R4", unit: "", label: "Standard interface" },
              { value: "172", unit: "", label: "Hospitals validated" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}<span className="text-lg text-primary/70">{stat.unit}</span>
                </p>
                <p className="text-xs text-primary-foreground/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Licensee Types */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Choose Your Path</p>
            <h2 className="font-display text-2xl md:text-4xl text-foreground mb-3">Three Integration Tracks</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each track includes dedicated onboarding support, sandbox access, and a named integration engineer.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {licenseeTypes.map((type, i) => (
              <motion.div
                key={type.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border/50 p-6 bg-card hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <type.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{type.subtitle}</p>
                <h3 className="text-lg font-bold text-foreground mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{type.description}</p>
                <div className="space-y-2 mb-6">
                  {type.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-xs text-foreground/80">{b}</span>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/licensing">{type.cta} <ArrowRight className="w-3 h-3 ml-1" /></Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Implementation Roadmap</p>
            <h2 className="font-display text-2xl md:text-4xl text-foreground mb-3">Five Phases to Deployment</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A transparent, milestone-driven process — no surprises, no hidden requirements.
            </p>
          </motion.div>

          <ImplementationTimeline phases={phases} />
        </div>
      </section>

      {/* Technical Requirements Checklist */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Technical Readiness</p>
            <h2 className="font-display text-2xl md:text-4xl text-foreground mb-3">Integration Checklist</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ensure your environment is ready before kickoff. Most organizations already meet 80%+ of these requirements.
            </p>
          </motion.div>

          <IntegrationChecklist />
        </div>
      </section>

      {/* Support & Resources */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Onboarding Support</p>
            <h2 className="font-display text-2xl md:text-4xl text-foreground mb-3">We're With You Every Step</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Dedicated Engineer", desc: "Named integration contact from day one through production launch." },
              { icon: MessageSquare, title: "Weekly Syncs", desc: "Standing check-ins during active integration with async Slack support." },
              { icon: FileText, title: "Full Documentation", desc: "API reference, FHIR mapping guide, deployment runbooks, and SDKs." },
              { icon: Lock, title: "Security Review", desc: "Collaborative BAA execution, pen test results, and SOC 2 roadmap." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="text-center p-6 rounded-xl border border-border/30 bg-card"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-foreground text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl mb-3">Ready to Get Started?</h2>
            <p className="text-primary-foreground/60 mb-8 max-w-xl mx-auto">
              Submit a licensing inquiry and we'll schedule your live walkthrough within 48 hours.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/licensing">Begin Licensing Inquiry <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/integrations">View FHIR Sandbox</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default IntegrationGuide;
