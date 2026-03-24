import { SiteLayout } from "@/components/layout/SiteLayout";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Heart, Brain, DollarSign, Building2, Code2, Shield, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const personas = [
  {
    id: "cnos",
    icon: Heart,
    title: "Chief Nursing Officers",
    headline: "Give Your Nurses Back Time at the Bedside",
    subtitle: "Quantify documentation burden with data they're already generating.",
    painPoints: [
      "Nurses spend up to 40% of shift time on documentation",
      "Alert fatigue leads to missed deterioration signals",
      "No objective measure of documentation workload",
      "Staffing decisions lack data-driven support",
    ],
    solutions: [
      "Documentation Burden Score™ quantifies workload per nurse, per shift",
      "ChartMinder™ flags at-risk patients without adding alerts",
      "Externally validated across international ICU databases",
      "Zero additional devices or workflow changes required",
    ],
    cta: { label: "See Nurse Workload Solution", link: "/solutions/nurse-workload" },
    metrics: [
      { value: "172", label: "Hospitals Validated" },
      { value: "40%", label: "Documentation Time" },
      { value: "0", label: "New Devices Required" },
    ],
  },
  {
    id: "cmios",
    icon: Brain,
    title: "CMIOs & Informatics Leaders",
    headline: "Equipment-Independent AI That Speaks FHIR",
    subtitle: "Integrate with existing EHR data. SHAP-based explainability for every prediction.",
    painPoints: [
      "Clinical AI requires proprietary hardware dependencies",
      "Black-box models fail clinician trust requirements",
      "FHIR integration is often an afterthought",
      "Vendor lock-in across monitoring equipment",
    ],
    solutions: [
      "FHIR R4 native, SMART on FHIR ready architecture",
      "SHAP-based feature explanations for every prediction",
      "Works with any EHR that produces timestamped data",
      "Equipment-independent — no monitor vendor dependencies",
    ],
    cta: { label: "View Integration Guide", link: "/integrations" },
    metrics: [
      { value: "FHIR R4", label: "Native Integration" },
      { value: "SHAP", label: "Explainability" },
      { value: "11", label: "Patent Applications" },
    ],
  },
  {
    id: "cfos",
    icon: DollarSign,
    title: "CFOs & Financial Leaders",
    headline: "Zero Capital Expenditure. Software-Only ROI.",
    subtitle: "No hardware procurement. ROI from data you already own.",
    painPoints: [
      "Clinical AI requires large capital expenditure on hardware",
      "Unclear ROI timelines for health IT investments",
      "Hidden costs in sensor maintenance and calibration",
      "Budget pressure to justify every technology spend",
    ],
    solutions: [
      "Software-only deployment — zero hardware procurement",
      "ROI driven by existing EHR data utilization",
      "Reduced unnecessary escalations and ICU readmissions",
      "Transparent per-bed pricing with measurable outcomes",
    ],
    cta: { label: "Calculate Your ROI", link: "/roi-calculator" },
    metrics: [
      { value: "$0", label: "Hardware Cost" },
      { value: "Weeks", label: "Time to Deploy" },
      { value: "Measurable", label: "Outcome ROI" },
    ],
  },
  {
    id: "ceos",
    icon: Building2,
    title: "CEOs & COOs",
    headline: "Differentiate Your System with Patent-Pending AI",
    subtitle: "Meet CMS equity requirements. Deploy in weeks, not months.",
    painPoints: [
      "Competitive pressure to adopt clinical AI responsibly",
      "CMS equity requirements demand fairness documentation",
      "Long deployment cycles slow innovation adoption",
      "Risk of choosing technology that becomes obsolete",
    ],
    solutions: [
      "11 patent-pending algorithms — competitive differentiation",
      "Fairness-preserving design meets CMS equity mandates",
      "Weeks-to-deploy, not months — software-only rollout",
      "Equipment-independent design ensures long-term viability",
    ],
    cta: { label: "Explore Hospital Solutions", link: "/solutions/hospitals" },
    metrics: [
      { value: "11", label: "Patents Filed" },
      { value: "CMS", label: "Equity Ready" },
      { value: "Weeks", label: "Deployment" },
    ],
  },
  {
    id: "ehr-vendors",
    icon: Code2,
    title: "EHR Vendors & Partners",
    headline: "White-Label Clinical AI Without Building It",
    subtitle: "License 11 patent-pending algorithms. FHIR R4 native. SMART on FHIR ready.",
    painPoints: [
      "Building clinical AI in-house requires massive R&D investment",
      "Regulatory burden of developing SaMD from scratch",
      "Customers demanding AI features on shorter timelines",
      "Lack of validated, equipment-independent algorithms",
    ],
    solutions: [
      "White-label licensing of validated clinical AI algorithms",
      "FHIR R4 native — designed for EHR integration",
      "SMART on FHIR compliant launch framework",
      "Pre-validated on 93K+ patients across two studies — reduces regulatory burden",
    ],
    cta: { label: "Explore EHR Partnership", link: "/solutions/ehr-vendors" },
    metrics: [
      { value: "93K+", label: "Patients Validated" },
      { value: "FHIR R4", label: "Native" },
      { value: "White-Label", label: "Licensing" },
    ],
  },
  {
    id: "military",
    icon: Shield,
    title: "VA & DoD Health Leaders",
    headline: "Clinical AI for Garrison and Deployed Settings",
    subtitle: "Compatible with VistA, MHS GENESIS, and Cerner Millennium.",
    painPoints: [
      "Deployed settings lack bedside monitoring equipment",
      "Multiple EHR systems across branches and VA",
      "Need for ruggedized, equipment-independent solutions",
      "Health equity requirements across diverse populations",
    ],
    solutions: [
      "Equipment-independent — works without bedside monitors",
      "Compatible with VistA, MHS GENESIS, Cerner Millennium",
      "Designed for resource-limited and deployed environments",
      "Fairness-preserving across demographic subgroups",
    ],
    cta: { label: "Explore Military Solutions", link: "/solutions/military" },
    metrics: [
      { value: "0", label: "Hardware Needed" },
      { value: "3+", label: "EHR Compatible" },
      { value: "Global", label: "Deployable" },
    ],
  },
];

const ForLeaders = () => {
  const location = useLocation();
  const hash = location.hash.replace('#', '') || 'cnos';
  const defaultTab = personas.find(p => p.id === hash) ? hash : 'cnos';

  return (
    <SiteLayout
      title="For Healthcare Decision-Makers"
      description="VitaSignal addresses the specific priorities of CNOs, CMIOs, CFOs, CEOs, EHR vendors, and military health leaders with equipment-independent clinical AI."
    >
      <Helmet>
        <meta name="keywords" content="clinical AI for CNOs, healthcare CFO ROI, EHR vendor AI licensing, military health AI, documentation burden, equipment-independent" />
      </Helmet>

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-xs uppercase tracking-widest text-primary mb-3">Built for You</p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              Your Role. Your Priorities. Your Solution.
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you lead nursing, technology, finance, operations, or partnerships — VitaSignal is designed to address what matters most to you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Persona Tabs */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-xl mb-8">
              {personas.map((p) => (
                <TabsTrigger key={p.id} value={p.id} className="text-xs gap-1.5 data-[state=active]:bg-card">
                  <p.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{p.title.split(' ').slice(0, 2).join(' ')}</span>
                  <span className="sm:hidden">{p.id.toUpperCase()}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {personas.map((persona) => (
              <TabsContent key={persona.id} value={persona.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <persona.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{persona.headline}</h2>
                        <p className="text-sm text-muted-foreground">{persona.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {persona.metrics.map((m, i) => (
                      <div key={i} className="rounded-xl border border-border/50 bg-card p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{m.value}</p>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pain Points + Solutions */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="rounded-xl border border-destructive/20 bg-destructive/[0.03] p-5">
                      <h3 className="text-sm font-semibold text-foreground mb-3">The Challenge</h3>
                      <ul className="space-y-2.5">
                        {persona.painPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-destructive mt-0.5">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5">
                      <h3 className="text-sm font-semibold text-foreground mb-3">The VitaSignal Solution</h3>
                      <ul className="space-y-2.5">
                        {persona.solutions.map((sol, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            {sol}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-3">
                    <Button asChild>
                      <Link to={persona.cta.link}>
                        {persona.cta.label} <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/contact">
                        <ExternalLink className="w-4 h-4 mr-1.5" /> Schedule a Conversation
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </SiteLayout>
  );
};

export default ForLeaders;
