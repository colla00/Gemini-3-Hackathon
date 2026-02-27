import { SiteLayout } from "@/components/layout/SiteLayout";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calendar, MapPin, Award, ExternalLink, FileText, Users, BarChart3, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export const PressRelease = () => (
  <SiteLayout
    title="Press Release — ANIA 2026 & Stanford AI+Health"
    description="VitaSignal™ press release: ANIA 2026 presentation acceptance and Stanford AI+Health 2025 conference recap. Documentation Burden Score research validated on 382K+ patients."
  >
    <Helmet>
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": "VitaSignal™ DBS Research Accepted for ANIA 2026 Annual Conference",
        "datePublished": "2026-01-15",
        "author": { "@type": "Person", "name": "Dr. Alexis Collier" },
        "publisher": { "@type": "Organization", "name": "VitaSignal™" }
      })}</script>
    </Helmet>

    <article className="max-w-4xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Header */}
      <motion.header {...fade} transition={{ duration: 0.5 }} className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="default" className="text-xs">Press Release</Badge>
          <Badge variant="outline" className="text-xs">January 2026</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
          VitaSignal™ DBS Research Accepted for Presentation at ANIA 2026 Annual Conference
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Documentation Burden Score system validated on 321,719 ICU patients across 208+ hospitals — the largest external validation of a nursing documentation burden predictor to date.
        </p>
      </motion.header>

      <Separator className="mb-10" />

      {/* ANIA 2026 Section */}
      <motion.section {...fade} transition={{ delay: 0.1, duration: 0.5 }} className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">ANIA 2026 — Boston, MA</h2>
        </div>

        <Card className="mb-6 border-primary/20 bg-primary/[0.03]">
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">March 26–28, 2026</p>
                  <p className="text-muted-foreground text-xs">ANIA Annual Conference</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Boston, Massachusetts</p>
                  <p className="text-muted-foreground text-xs">In-person presentation</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Abstract #185</p>
                  <p className="text-muted-foreground text-xs">Peer-reviewed acceptance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
          <p>
            <strong>Dr. Alexis Collier, DHA</strong>, has been accepted to present research on the <strong>Documentation Burden Score (DBS)</strong> system at the American Nursing Informatics Association (ANIA) 2026 Annual Conference in Boston. The presentation will detail an ML-powered approach to quantifying and predicting nursing documentation burden in intensive care settings.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-8 mb-3">Validated Performance</h3>
          <div className="grid sm:grid-cols-2 gap-4 not-prose">
            <StatCard
              label="Internal Validation"
              value="AUROC 0.802"
              detail="MIMIC-IV · n = 24,689"
              sub="Sensitivity 0.714 · Specificity 0.732"
            />
            <StatCard
              label="External Validation"
              value="AUROC 0.857"
              detail="eICU-CRD · n = 297,030 · 208 hospitals"
              sub="Sensitivity 0.768 · Specificity 0.785"
            />
          </div>

          <p className="mt-6">
            The DBS system represents the largest external validation of a nursing documentation burden predictor to date, demonstrating improved discrimination on multi-center external data — a hallmark of robust generalizability. The system is covered by <strong>U.S. Patent Application (Patent #5)</strong>, filed January 22, 2026 as part of a five-application intellectual property portfolio.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-8 mb-3">Research Impact</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Quantifies documentation burden using clinical variables available in any EHR</li>
            <li>Produces quartile-based staffing recommendations for charge nurse workflow</li>
            <li>Equipment-independent: requires no additional hardware or sensors</li>
            <li>NIH-funded research through a federal clinical AI training program</li>
          </ul>
        </div>
      </motion.section>

      <Separator className="mb-10" />

      {/* Stanford Section */}
      <motion.section {...fade} transition={{ delay: 0.2, duration: 0.5 }} className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Stanford AI+Health 2025 — Recap</h2>
        </div>

        <Card className="mb-6 border-border/50">
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">December 2025</p>
                  <p className="text-muted-foreground text-xs">Stanford University</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Palo Alto, California</p>
                  <p className="text-muted-foreground text-xs">Stanford campus</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">AI-Assisted Clinical Judgment</p>
                  <p className="text-muted-foreground text-xs">Framework demonstration</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
          <p>
            At the Stanford AI+Health Conference in December 2025, Dr. Collier presented the <strong>AI-Assisted Clinical Judgment Framework</strong> — a conceptual model for integrating explainable AI into nursing workflows while maintaining clinician autonomy and trust. The presentation introduced three core principles that underpin the VitaSignal™ platform:
          </p>

          <div className="not-prose grid sm:grid-cols-3 gap-4 my-6">
            <PrincipleCard
              title="Human-Centered Explainability"
              description="Every AI prediction includes SHAP-based explanations of contributing factors, keeping clinicians informed rather than automated."
            />
            <PrincipleCard
              title="Trust Through Transparency"
              description="Real-time trust scores, model performance metrics, and data provenance always visible to the end user."
            />
            <PrincipleCard
              title="Equity Monitoring"
              description="Continuous demographic fairness checks maintaining < 0.5% disparity across patient populations (design target)."
            />
          </div>

          <p>
            The framework directly informed the design of <strong>ChartMinder™</strong> (Patent #2), the trust-based alert prioritization system with integrated equity monitoring. The Stanford presentation also previewed early findings from the <strong>Intensive Documentation Index (IDI)</strong> — 11 temporal features derived solely from EHR timestamp metadata that would later form the basis of the ICU mortality prediction patent (Patent #1).
          </p>

          <h3 className="text-base font-semibold text-foreground mt-8 mb-3">IDI Validation Highlights (Patent #1)</h3>
          <div className="not-prose grid sm:grid-cols-2 gap-4">
            <StatCard
              label="JAMIA Manuscript"
              value="AUROC 0.683"
              detail="MIMIC-IV · n = 26,153 · Baseline 0.658"
              sub="95% CI 0.631–0.732 · Key feature OR 1.53"
            />
            <StatCard
              label="HiRID External"
              value="AUROC 0.9063"
              detail="HiRID · n = 33,897 · Switzerland"
              sub="Outperforms APACHE IV (0.8421) & SAPS III (0.8389)"
            />
          </div>

          <h3 className="text-base font-semibold text-foreground mt-8 mb-3">Cohort Demographics (JAMIA)</h3>
          <div className="not-prose">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <p className="text-2xl font-bold text-foreground">15.99%</p>
                    <p className="text-xs text-muted-foreground">In-hospital mortality</p>
                    <p className="text-[10px] text-muted-foreground/70">4,182 deaths</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">69.8</p>
                    <p className="text-xs text-muted-foreground">Mean age (years)</p>
                    <p className="text-[10px] text-muted-foreground/70">± 13.8 SD</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">1,119</p>
                    <p className="text-xs text-muted-foreground">Median events/24h</p>
                    <p className="text-[10px] text-muted-foreground/70">~46.6/hour</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">11</p>
                    <p className="text-xs text-muted-foreground">IDI features</p>
                    <p className="text-[10px] text-muted-foreground/70">Temporal phenotypes</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-wrap gap-3 justify-center text-xs text-muted-foreground">
                  <span>White 69.0%</span>
                  <span>·</span>
                  <span>Black 13.5%</span>
                  <span>·</span>
                  <span>Hispanic 8.0%</span>
                  <span>·</span>
                  <span>Asian 4.5%</span>
                  <span>·</span>
                  <span>Other 5.0%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>

      <Separator className="mb-10" />

      {/* Patent Portfolio Summary */}
      <motion.section {...fade} transition={{ delay: 0.3, duration: 0.5 }} className="mb-14">
        <h2 className="text-xl font-bold text-foreground mb-4">Intellectual Property Portfolio</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Five U.S. patent applications filed between December 2025 and February 2026, covering the full clinical intelligence stack from documentation burden quantification to trust-based alert governance.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          {[
            { num: '#1', name: 'ICU Mortality Prediction (IDI)', date: 'Feb 2026' },
            { num: '#2', name: 'ChartMinder™ Trust-Based Alerts', date: 'Dec 2025' },
            { num: '#3', name: 'Clinical Risk Intelligence', date: 'Dec 2025' },
            { num: '#4', name: 'Unified Nursing Intelligence', date: 'Jan 2026' },
            { num: '#5', name: 'Documentation Burden Score', date: 'Jan 2026' },
          ].map((p) => (
            <div key={p.num} className="flex items-start gap-2 p-3 rounded-lg border border-border/50 bg-card">
              <Badge variant="secondary" className="text-[10px] shrink-0">{p.num}</Badge>
              <div>
                <p className="font-medium text-foreground text-xs">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">Filed {p.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Footer CTA */}
      <motion.div {...fade} transition={{ delay: 0.4, duration: 0.5 }} className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          For licensing inquiries, research collaboration, or media requests:
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/licensing">Licensing Information</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/ania2026">ANIA 2026 Poster</Link>
          </Button>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <div className="mt-16 pt-6 border-t border-border/30">
        <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed">
          VitaSignal™, ChartMinder™, and Documentation Burden Score™ are trademarks of Dr. Alexis M. Collier. 
          Pre-market research prototype. Not FDA cleared. Not a medical device. All validation metrics are from peer-reviewed manuscripts submitted for publication.
          © 2025–2026 Dr. Alexis Collier, DHA. All rights reserved.
        </p>
      </div>
    </article>
  </SiteLayout>
);

/* ── Helper components ── */

function StatCard({ label, value, detail, sub }: { label: string; value: string; detail: string; sub: string }) {
  return (
    <Card className="border-border/50">
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{detail}</p>
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  );
}

function PrincipleCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-border/50">
      <CardContent className="pt-5 pb-4">
        <p className="text-sm font-semibold text-foreground mb-1.5">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

export default PressRelease;
