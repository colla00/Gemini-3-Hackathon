import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, CheckCircle2, Mail, ChevronDown, ChevronUp, TrendingUp, Shield, Brain, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Helmet } from "react-helmet-async";
import heroBg from "@/assets/hero-bg.jpg";
import { cn } from "@/lib/utils";

const ipSummary = [
  { label: "Patent Applications Filed", value: "11", sub: "U.S. Provisional" },
  { label: "Total Claims", value: "175+", sub: "Across all filings" },
  { label: "Validation Status", value: "2", sub: "Systems validated" },
  { label: "Filing Period", value: "2025-26", sub: "Dec 2025 - Feb 2026" },
];

const patentSystems = [
  {
    number: 1,
    title: "ICU Mortality Prediction System",
    icon: TrendingUp,
    status: "validated" as const,
    oneLiner: "Predicts ICU mortality from proprietary analysis of routine clinical documentation",
    validated: true,
    metrics: [
      "Validated across multiple international databases",
      "Statistically superior to established acuity scores",
      "Novel patent-pending feature extraction methodology",
    ],
    innovation: "Proprietary analysis of routine clinical documentation to predict ICU mortality risk without requiring additional physiological sensors or monitoring equipment. Validated across multiple international databases.",
  },
  {
    number: 2,
    title: "Trust-Based Alert Governance",
    icon: Shield,
    status: "design" as const,
    oneLiner: "Mobile alert governance with trust scoring, equity monitoring, explainable AI, and cognitive load optimization",
    validated: false,
    innovation: "Human-factors-engineered mobile dashboard combining trust-based alert prioritization, real-time equity monitoring, explainable AI reasoning, and adaptive cognitive load optimization.",
  },
  {
    number: 3,
    title: "Clinical Risk Intelligence System",
    icon: Brain,
    status: "design" as const,
    oneLiner: "Integrated explainability with multi-horizon forecasting, adaptive thresholds, and closed-loop feedback",
    validated: false,
    innovation: "Multi-outcome risk stratification with explainable AI, temporal forecasting, adaptive thresholds, and closed-loop intervention feedback for nurse-sensitive outcomes.",
  },
  {
    number: 4,
    title: "Unified Nursing Intelligence Platform",
    icon: Activity,
    status: "design" as const,
    oneLiner: "Integrated platform combining workload prediction, risk intelligence, and trust-based alerts",
    validated: false,
    innovation: "Multi-module integration combining documentation burden analysis, risk intelligence, and trust-based alerts with continuous equity monitoring across nursing units.",
  },
  {
    number: 5,
    title: "Documentation Burden & Staffing System (DBS)",
    icon: FileText,
    status: "validated" as const,
    oneLiner: "ML-powered documentation burden quantification. Externally validated across multiple hospitals.",
    validated: true,
    metrics: [
      "Validated internally and externally across multiple hospital systems",
      "Multi-site external validation cohort",
      "ANIA 2026 Presentation — Boston, MA",
    ],
    innovation: "ML-powered documentation burden quantification using proprietary clinical feature engineering. Validated internally and externally across multiple hospital systems. ANIA 2026 presentation accepted.",
  },
  {
    number: 6,
    title: "Temporal Risk Assessment & Clinical Intelligence (TRACI)",
    icon: TrendingUp,
    status: "design" as const,
    oneLiner: "Advanced risk assessment combining clinical data analysis with contextual intelligence for early deterioration detection",
    validated: false,
    innovation: "Multi-horizon risk scoring with context-aware clinical state estimation and automated risk trajectory classification.",
  },
  {
    number: 7,
    title: "Enhanced Staffing & Documentation Burden Intelligence (ESDBI)",
    icon: Activity,
    status: "design" as const,
    oneLiner: "Next-generation staffing optimization with predictive scheduling and skill-mix optimization",
    validated: false,
    innovation: "Predictive staffing demand modeling with skill-mix optimization and workload rebalancing capabilities.",
  },
  {
    number: 8,
    title: "Smart Healthcare Quality Surveillance (SHQS)",
    icon: Shield,
    status: "design" as const,
    oneLiner: "Continuous quality surveillance monitoring healthcare delivery metrics and triggering improvement workflows",
    validated: false,
    innovation: "Automated quality deviation detection with multi-dimensional quality scoring and improvement workflow automation.",
  },
  {
    number: 9,
    title: "Digital Twin Baseline Learning (DTBL)",
    icon: Brain,
    status: "design" as const,
    oneLiner: "Patient digital twin technology creating dynamic baseline models for personalized risk thresholds",
    validated: false,
    innovation: "Dynamic patient baseline modeling with personalized risk threshold generation and baseline drift detection.",
  },
  {
    number: 10,
    title: "Clinical Trial & Cohort Intelligence (CTCI)",
    icon: FileText,
    status: "design" as const,
    oneLiner: "AI-driven clinical trial matching and cohort identification",
    validated: false,
    innovation: "Automated trial eligibility screening with documentation-based cohort identification and enrollment optimization.",
  },
  {
    number: 11,
    title: "Syndromic Early Detection & Response (SEDR)",
    icon: Activity,
    status: "design" as const,
    oneLiner: "Population-level syndromic surveillance for early outbreak detection",
    validated: false,
    innovation: "Population-level syndromic scoring with automated public health alerting and cross-facility pattern aggregation.",
  },
];

function Patents() {
  const [expandedPatent, setExpandedPatent] = useState<number | null>(1);

  const toggle = (num: number) => {
    setExpandedPatent(expandedPatent === num ? null : num);
  };

  return (
    <SiteLayout title="Technology Portfolio" description="11 U.S. provisional patent applications covering equipment-independent clinical AI for ICU mortality prediction and nursing workflow optimization.">
      <Helmet>
        <meta property="og:image" content="https://vitasignal.ai/og-patents.png" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1080" />
        <meta name="twitter:image" content="https://vitasignal.ai/og-patents.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "VitaSignal Patent Portfolio",
          "description": "11 U.S. provisional patent applications for equipment-independent clinical AI",
          "numberOfItems": 11,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "ICU Mortality Prediction System", "description": "Predicts ICU mortality from proprietary analysis of clinical documentation. Multi-database validated." },
            { "@type": "ListItem", "position": 5, "name": "Documentation Burden Score (DBS)", "description": "ML-powered documentation burden quantification. Multi-site externally validated." }
          ]
        })}</script>
      </Helmet>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-24 md:pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/20 border border-primary/30 text-sm">
            <FileText className="w-3 h-3 text-primary" />
            <span className="text-primary font-medium">11 U.S. Provisional Patent Applications Filed</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 leading-[1.05] max-w-4xl">
            VitaSignal™
            <br />
            <span className="text-primary">Technology Portfolio</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-4 opacity-80 leading-relaxed">
            Patent-pending equipment-independent AI systems for clinical risk prediction and nursing workflow optimization.
          </p>
          <p className="text-sm opacity-60">
            Sole Inventor: Dr. Alexis Collier, DHA
          </p>
        </div>
      </section>

      {/* Executive IP Summary */}
      <section className="py-12 px-6 border-b border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ipSummary.map((s) => (
              <div key={s.label} className="text-center p-5 rounded-xl bg-secondary/50 border border-border/30">
                <p className="font-display text-3xl text-primary mb-1">{s.value}</p>
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patent Portfolio - Accordion */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-6">
            Patent Portfolio
          </p>
          <div className="space-y-3">
            {patentSystems.map((patent) => {
              const isExpanded = expandedPatent === patent.number;
              return (
                <div
                  key={patent.number}
                  className={cn(
                    "rounded-xl border transition-all",
                    patent.validated
                      ? "border-primary/30 bg-primary/[0.02]"
                      : "border-border/50 bg-card"
                  )}
                >
                  <button
                    onClick={() => toggle(patent.number)}
                    className="w-full flex items-center gap-4 p-5 text-left"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      patent.validated ? "bg-primary/10" : "bg-secondary"
                    )}>
                      <patent.icon className={cn(
                        "w-5 h-5",
                        patent.validated ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-muted-foreground">#{patent.number}</span>
                        <span className="text-sm font-bold text-foreground">{patent.title}</span>
                        {patent.validated ? (
                          <Badge className="bg-risk-low/10 text-risk-low border-risk-low/30 text-[10px]" variant="outline">VALIDATED</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">DESIGN PHASE</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{patent.oneLiner}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 border-t border-border/20 mt-0 animate-fade-in">
                      <div className="ml-14 space-y-3 pt-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          <strong className="text-foreground">Core Innovation:</strong> {patent.innovation}
                        </p>
                        {patent.metrics && (
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-2">Validation Highlights:</p>
                            <ul className="space-y-1">
                              {patent.metrics.map((m) => (
                                <li key={m} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <CheckCircle2 className="w-3 h-3 text-risk-low mt-0.5 shrink-0" />
                                  {m}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Application numbers, filing dates, technical specifications, and detailed claims available to qualified partners under NDA.
          </p>
          <Button variant="outline" size="sm" className="mt-3" asChild>
            <a href="mailto:licensing@vitasignal.ai">
              <Mail className="w-4 h-4 mr-2" />
              Request Details Under NDA
            </a>
          </Button>
        </div>
      </section>

      {/* Licensing CTA */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground py-16 px-6">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/80" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl mb-4">Interested in Licensing?</h2>
          <p className="opacity-80 mb-8 max-w-2xl mx-auto">
            Detailed patent claims, technical specifications, and performance data available to qualified partners under NDA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/licensing">View Licensing Options</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Patents;
