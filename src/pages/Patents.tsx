import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, CheckCircle2, Clock, Mail, ChevronDown, ChevronUp, TrendingUp, Shield, Brain, Activity, Gauge } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import heroBg from "@/assets/hero-bg.jpg";
import { cn } from "@/lib/utils";

const ipSummary = [
  { label: "Patents Filed", value: "6", sub: "U.S. Provisional" },
  { label: "Total Claims", value: "175+", sub: "Across all filings" },
  { label: "AUC", value: "0.741", sub: "Validated (Patent #1)" },
  { label: "Filing Period", value: "2025-26", sub: "Dec 2025 - Feb 2026" },
];

const patentSystems = [
  {
    number: 1,
    title: "ICU Mortality Prediction System",
    icon: TrendingUp,
    status: "validated" as const,
    oneLiner: "Predicts ICU mortality from documentation rhythm patterns using 9 temporal features",
    validated: true,
    metrics: [
      "AUC 0.741 (95% CI: 0.712-0.769)",
      "Mean temporal AUC 0.684 over 11 years",
      "n = 26,153 ICU admissions (MIMIC-IV)",
      "Documentation rhythm (CV) strongest predictor: OR 1.82",
    ],
    innovation: "Analyzes temporal patterns in routine clinical documentation to predict ICU mortality risk without requiring additional physiological sensors or monitoring equipment.",
  },
  {
    number: 2,
    title: "Trust-Based Alert Prioritization",
    icon: Shield,
    status: "design" as const,
    oneLiner: "Adaptive clinical alerts with provider trust scoring to reduce alarm fatigue",
    validated: false,
    innovation: "Dynamic alert thresholds that learn from provider response patterns, targeting 40-70% reduction in non-actionable alerts.",
  },
  {
    number: 3,
    title: "Unified Nursing Intelligence Platform",
    icon: Activity,
    status: "design" as const,
    oneLiner: "Integrated workload prediction and staffing optimization for nursing units",
    validated: false,
    innovation: "Three-module integration combining Documentation Burden Score, Risk Intelligence, and Trust-Based Alerts with continuous equity monitoring.",
  },
  {
    number: 4,
    title: "Documentation Burden & Staffing System",
    icon: FileText,
    status: "design" as const,
    oneLiner: "ML-based documentation burden prediction with quartile staffing recommendations",
    validated: false,
    innovation: "Predicts documentation workload intensity to enable proactive staffing adjustments before burden escalates.",
  },
  {
    number: 5,
    title: "Clinical Risk Intelligence",
    icon: Brain,
    status: "design" as const,
    oneLiner: "Multi-outcome risk stratification with SHAP-based explainable AI",
    validated: false,
    innovation: "Predicts nurse-sensitive outcomes (falls, pressure injuries, CAUTI) with interpretable feature attributions for clinical trust.",
  },
  {
    number: 6,
    title: "ChartMinder Alert Governance",
    icon: Gauge,
    status: "design" as const,
    oneLiner: "Mobile-first alert governance with trust scoring, equity monitoring, and cognitive load optimization",
    validated: false,
    innovation: "Human-factors-engineered mobile dashboard combining trust-based alert prioritization, real-time equity monitoring across demographics, explainable AI reasoning with attention weights and literature evidence, and adaptive cognitive load optimization.",
  },
];

function Patents() {
  const [expandedPatent, setExpandedPatent] = useState<number | null>(1);

  const toggle = (num: number) => {
    setExpandedPatent(expandedPatent === num ? null : num);
  };

  return (
    <SiteLayout title="Technology Portfolio" description="6 U.S. provisional patent applications covering equipment-independent clinical AI for ICU mortality prediction and nursing workflow optimization.">
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-24 md:pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/20 border border-primary/30 text-sm">
            <FileText className="w-3 h-3 text-primary" />
            <span className="text-primary font-medium">6 U.S. Provisional Patent Applications Filed</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 leading-[1.05] max-w-4xl">
            VitaSignal
            <br />
            <span className="text-primary">Technology Portfolio</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-4 opacity-80 leading-relaxed">
            Patent-protected equipment-independent AI systems for clinical risk prediction and nursing workflow optimization.
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
                            <p className="text-xs font-semibold text-foreground mb-2">Validated Performance:</p>
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
            Application numbers, filing dates, and detailed claims available to qualified partners under NDA.
          </p>
          <Button variant="outline" size="sm" className="mt-3" asChild>
            <a href="mailto:info@alexiscollier.com">
              <Mail className="w-4 h-4 mr-2" />
              Request Details Under NDA
            </a>
          </Button>
        </div>
      </section>

      {/* Core Innovation */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-8">Why Equipment-Independent?</h2>
          <Card>
            <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
              <p>
                Traditional clinical AI requires expensive sensors, wearables, or continuous physiological monitoring.
                VitaSignal extracts predictive signals from data that already exists in every hospital --
                the temporal patterns of routine clinical documentation.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  { label: "Zero Hardware Cost", desc: "Works with existing EHR systems" },
                  { label: "Passive Monitoring", desc: "No additional burden on staff" },
                  { label: "Universal Applicability", desc: "Any setting with electronic documentation" },
                  { label: "Equity-Focused", desc: "Validated for fairness across populations" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 border border-border/30">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* IP Disclaimers */}
      <section className="py-12 px-6 bg-destructive/5 border-t border-destructive/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">Important:</p>
              <p>All six applications are provisional patents. Final patent grants are subject to USPTO examination and are not guaranteed.</p>
              <p>NIH-funded research. The U.S. Government retains certain non-commercial use rights under the Bayh-Dole Act.</p>
              <p className="text-destructive">
                VitaSignal systems are research prototypes and are NOT FDA cleared, approved, or authorized for clinical use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Licensing CTA */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground py-16 px-6">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/80" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl mb-4">Interested in Licensing VitaSignal Technology?</h2>
          <p className="opacity-80 mb-8 max-w-2xl mx-auto">
            We're seeking strategic partnerships with EHR vendors, hospital systems, and investors
            to bring VitaSignal to clinical practice.
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
