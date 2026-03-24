import { BookOpen, Microscope, Award, ArrowRight, FileText, Activity, Brain, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const researchThemes = [
  {
    title: "Documentation-Derived Intelligence",
    description: "The core thesis: routine EHR documentation generates temporal signals — timing, rhythm, frequency, and clustering — that carry clinical information comparable to bedside physiological monitoring. VitaSignal's research demonstrates that these documentation patterns can be systematically extracted and translated into predictive intelligence without additional hardware or clinician burden.",
    badge: "Core Thesis",
  },
  {
    title: "Temporal Pattern Analysis",
    description: "Novel feature engineering methods that extract multiple distinct temporal domains from EHR timestamps: documentation density, inter-event patterns, circadian rhythmicity, burst detection, entropy measures, activity sequencing, shift-level patterns, temporal acceleration, and cross-system temporal correlation.",
    badge: "Methodology",
  },
  {
    title: "Fairness-Preserving Clinical AI",
    description: "Standing equity monitoring across demographic subgroups is built into every validation protocol. SHAP-based explainability provides transparent attribution for every prediction. Bias detection is a first-class validation requirement, not a post-deployment audit.",
    badge: "Equity",
  },
  {
    title: "Operational Signal Extraction",
    description: "Beyond patient risk prediction, VitaSignal research explores documentation burden quantification, shift-level workload intelligence, and workflow visibility metrics that surface operational signals already embedded in routine care delivery.",
    badge: "Operations",
  },
];

const validatedSystems = [
  {
    name: "ICU Mortality Prediction (Patent #1 · IDI)",
    status: "Externally Validated",
    details: [
      "65K+ patients across MIMIC-IV and HiRID",
      "Multiple temporal features from EHR timestamps only",
      "Equipment-independent design — no bedside monitors",
      "SHAP-based explainability for every prediction",
    ],
  },
  {
    name: "Documentation Burden Score™ (Patent #5 · DBS)",
    status: "Externally Validated",
    details: [
      "28K+ patients validated across 172 hospitals (eICU)",
      "ML-powered documentation burden quantification",
      "Statistically validated with strong discrimination",
      "ANIA 2026 presentation accepted — Boston, MA",
    ],
  },
  {
    name: "SEDR – Syndromic Surveillance (Patent #11)",
    status: "Externally Validated",
    details: [
      "131,420 ICU stays validated across MIMIC-IV and eICU databases",
      "9-feature temporal signal model for population-level surveillance",
      "Five held-out three-year validation periods (LOPO-CV) + multi-site external validation",
      "Statistically significant discrimination across all periods and sites",
      "Enriched temporal validation with Elixhauser comorbidity burden",
      "MLHC 2026 manuscript submitted — March 2026",
    ],
  },
];

const portfolioConcepts = [
  { name: "IDI", full: "ICU Documentation Index", status: "Validated" },
  { name: "DBS", full: "Documentation Burden Score", status: "Validated" },
  { name: "SEDR", full: "Shift-End Documentation Burden Index", status: "Validated" },
  { name: "CRIS-E", full: "Clinical Risk Intelligence System", status: "Design Phase" },
  { name: "NurseRhythm", full: "Temporal Nursing Intelligence", status: "Design Phase" },
  { name: "UNIP", full: "Unified Nursing Intelligence Platform", status: "Design Phase" },
];

export default function Research() {
  return (
    <SiteLayout
      title="Research & Publications"
      description="VitaSignal's documentation-derived clinical intelligence research: validated systems, research themes, and the translational evidence behind implementation-ready healthcare AI."
    >
      <Helmet>
        <meta name="keywords" content="clinical AI research, documentation-derived intelligence, ICU mortality prediction, documentation burden score, healthcare AI validation, nursing informatics" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ResearchProject",
          "name": "VitaSignal Clinical Intelligence Research",
          "description": "Documentation-driven clinical intelligence systems for risk prediction, workflow visibility, and equitable decision support.",
          "funder": { "@type": "Organization", "name": "National Institutes of Health (NIH)" },
          "url": "https://vitasignal.ai/research"
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="py-16 md:py-24 px-6 border-b border-border/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Research & Validation
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-foreground mb-5 leading-tight">
            Translational Evidence for
            <br />
            <span className="text-primary">Documentation-Driven Intelligence</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed mb-6">
            VitaSignal's research demonstrates that routine EHR documentation — timestamps, entry frequency,
            and workflow patterns — carries predictive clinical signal comparable to bedside physiological
            monitoring. This work bridges informatics research and implementation-ready healthcare AI.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline" className="text-xs">Dr. Alexis M. Collier, DHA</Badge>
            <Badge variant="outline" className="text-xs">AIM-AHEAD CLINAQ Fellow</Badge>
            <Badge variant="outline" className="text-xs">University of North Georgia</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Informed by NIH-supported research associated with Award No. 1OT2OD032581.
            Built in the context of the AIM-AHEAD CLINAQ fellowship and NIH-supported research experience.
          </p>
        </div>
      </section>

      {/* Research Themes */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8">Research Themes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {researchThemes.map((t) => (
              <Card key={t.title} className="border-border/50">
                <CardContent className="p-6">
                  <Badge variant="secondary" className="text-xs mb-3">{t.badge}</Badge>
                  <h3 className="text-lg font-bold text-foreground mb-2">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Validated Systems */}
      <section className="py-16 px-6 bg-muted/20 border-y border-border/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3">Validated Systems</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Systems that have completed formal validation on large-scale, multi-site clinical datasets.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {validatedSystems.map((s) => (
              <Card key={s.name} className="border-border/50 bg-card">
                <CardContent className="p-6">
                  <Badge className="text-xs mb-3 bg-primary/10 text-primary border-primary/20">{s.status}</Badge>
                  <h3 className="text-base font-bold text-foreground mb-3">{s.name}</h3>
                  <ul className="space-y-2">
                    {s.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Concepts */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3">Research Portfolio</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Named concepts across the VitaSignal patent portfolio, spanning validated systems and design-phase architectures.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolioConcepts.map((c) => (
              <div key={c.name} className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm font-bold text-foreground">{c.name}</span>
                  <Badge variant={c.status === "Validated" ? "default" : "secondary"} className="text-[10px]">
                    {c.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{c.full}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Context */}
      <section className="py-16 px-6 bg-muted/20 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">About the Researcher</h2>
          <div className="p-6 rounded-xl border border-border/50 bg-card">
            <h3 className="text-lg font-bold text-foreground mb-2">Dr. Alexis M. Collier, DHA</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Founder & CEO of VitaSignal LLC. AIM-AHEAD CLINAQ Fellow. Adjunct Professor in Healthcare
              Services and Informatics Administration at the University of North Georgia. A clinical AI
              researcher working at the intersection of nursing informatics, health equity, predictive
              analytics, and translational healthcare innovation.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Her work is informed by NIH-supported research associated with Award No. 1OT2OD032581,
              built in the context of the AIM-AHEAD CLINAQ fellowship and NIH-supported research experience.
              As sole inventor of 11 U.S. patent applications, Dr. Collier's research focuses on extracting
              clinical intelligence from data already embedded in care delivery — creating implementation-ready
              systems that don't add burden to care teams.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/about">Full Bio</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://alexiscollier.com" target="_blank" rel="noopener noreferrer">alexiscollier.com</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Publications & Preprints */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3">Publications & Preprints</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Peer-reviewed manuscripts, conference presentations, and publicly available preprints.
          </p>
          <div className="space-y-4">
            {[
              {
                title: "Development and Validation of the Intensive Documentation Index for ICU Mortality Prediction",
                venue: "JAMIA (under review) · medRxiv Preprint v3",
                date: "February 2026",
                url: "https://www.medrxiv.org/content/10.1101/2026.02.15.345827v3",
              },
              {
                title: "Multinational Validation of the Intensive Documentation Index: Temporal Resolution and ICU Mortality",
                venue: "npj Digital Medicine (under review)",
                date: "March 2026",
              },
              {
                title: "SEDR: Shift-End Documentation Rate for ICU Syndromic Surveillance",
                venue: "MLHC 2026 (submitted)",
                date: "March 2026",
              },
              {
                title: "Documentation Burden Score System — ANIA 2026",
                venue: "ANIA Annual Conference · Abstract #185",
                date: "February 2026",
              },
              {
                title: "AI-Assisted Clinical Judgment Framework",
                venue: "Stanford AI+Health Conference",
                date: "December 2025",
              },
              {
                title: "IT Governance in Healthcare AI",
                venue: "ISACA Journal",
                date: "2025",
              },
            ].map((pub) => (
              <div key={pub.title} className="p-4 rounded-lg border border-border/50 bg-card flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-1 leading-snug">{pub.title}</h3>
                  <p className="text-xs text-muted-foreground">{pub.venue} · {pub.date}</p>
                </div>
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Preprint
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance Framework */}
      <section className="py-16 px-6 bg-muted/20 border-y border-border/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">Clinical AI Governance</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
            VitaSignal has developed a practical evaluation framework for assessing whether ambient and
            workflow AI changes documentation completeness, escalation timing, signal quality, and subgroup fairness.
          </p>
          <Button variant="outline" asChild>
            <Link to="/governance-framework" className="gap-2">
              View Governance Framework <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
            Interested in Research Collaboration?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            We welcome conversations with researchers, health systems, and innovation teams exploring
            documentation-derived intelligence, workflow analytics, or equity-aware clinical AI.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" asChild>
              <a href="mailto:licensing@vitasignal.ai" className="gap-2">
                Research Inquiries <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/pilot-request">Pilot Assessment</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
