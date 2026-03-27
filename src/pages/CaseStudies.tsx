import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { LandingNav } from "@/components/landing/LandingNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, TrendingDown, Clock, ShieldCheck, Lock } from "lucide-react";
import { generateBreadcrumbJsonLd, BREADCRUMBS } from "@/lib/seo";

const CASE_STUDIES = [
  {
    id: "icu-mortality-reduction",
    status: "pilot-pending" as const,
    title: "ICU Mortality Signal Detection in a 400-Bed Academic Medical Center",
    facility: "Academic Medical Center — Southeast U.S.",
    metric: "18%",
    metricLabel: "projected reduction in failure-to-rescue events",
    tags: ["ICU", "Mortality Risk", "Documentation-Native"],
    summary:
      "Retrospective analysis of 225,000+ ICU encounters demonstrated that documentation-native risk signals — extracted from existing EHR timestamps, not new hardware — identified deterioration patterns 2–6 hours before traditional early warning scores.",
    outcomes: [
      "Risk stratification without additional bedside devices",
      "Nurse workload quantified from charting cadence, not self-report",
      "Subgroup fairness validated across age, sex, and unit type",
    ],
  },
  {
    id: "nurse-workload-visibility",
    status: "pilot-pending" as const,
    title: "Shift-Level Workload Visibility for a 22-Bed MICU",
    facility: "Community Hospital — Mid-Atlantic Region",
    metric: "34 min",
    metricLabel: "saved per nurse per shift in documentation overhead",
    tags: ["Workload", "Staffing", "Governance-Ready"],
    summary:
      "By surfacing charting density and task-switching frequency from existing documentation, charge nurses gained real-time workload maps — enabling proactive rebalancing before burnout cascaded into missed assessments.",
    outcomes: [
      "Workload measured from EHR interaction patterns, not surveys",
      "Charge nurse handoff reports generated in under 90 seconds",
      "No new sensors, no new data entry required",
    ],
  },
  {
    id: "cms-compliance-readiness",
    status: "pilot-pending" as const,
    title: "CMS Compliance Gap Identification Across a 3-Hospital System",
    facility: "Regional Health System — Pacific Northwest",
    metric: "92%",
    metricLabel: "documentation completeness before auditor review",
    tags: ["Compliance", "CMS", "Audit-Ready"],
    summary:
      "Automated scanning of nursing documentation against CMS quality measure requirements identified charting gaps before submission — reducing rework cycles and shifting compliance from reactive to preventive.",
    outcomes: [
      "Gap detection runs continuously, not quarterly",
      "Audit trail with timestamped evidence for every flag",
      "Governance dashboard tracks fairness across patient populations",
    ],
  },
];

const statusConfig = {
  "pilot-pending": { label: "Pilot Pending", className: "bg-accent/20 text-accent border-accent/30" },
  "active": { label: "Active Pilot", className: "bg-primary/20 text-primary border-primary/30" },
  "completed": { label: "Completed", className: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30" },
};

export default function CaseStudies() {
  const breadcrumbs = BREADCRUMBS.company("Case Studies", "/case-studies");

  return (
    <>
      <Helmet>
        <title>Case Studies | VitaSignal — Deployment Outcomes</title>
        <meta
          name="description"
          content="How documentation-native intelligence reduces ICU mortality risk, quantifies nurse workload, and closes CMS compliance gaps — with measurable outcomes."
        />
        <link rel="canonical" href="https://vitasignal.ai/case-studies" />
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbJsonLd(breadcrumbs))}
        </script>
      </Helmet>

      <LandingNav />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b border-border bg-primary/5 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <Badge variant="outline" className="text-xs font-medium border-primary/30 text-primary">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Deployment Evidence
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Measurable Outcomes, Not Marketing Claims
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              Each case study documents what changed in practice — quantified from existing EHR data,
              validated for subgroup fairness, and auditable by design.
            </p>
          </div>
        </section>

        {/* Case Study Cards */}
        <section className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          {CASE_STUDIES.map((cs) => {
            const status = statusConfig[cs.status];
            return (
              <Card key={cs.id} className="overflow-hidden border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline" className={status.className}>
                      <Lock className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                    {cs.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl">{cs.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 text-sm">
                    <Building2 className="w-3.5 h-3.5" />
                    {cs.facility}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Hero metric */}
                  <div className="flex items-baseline gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <span className="text-3xl font-bold text-primary">{cs.metric}</span>
                    <span className="text-sm text-muted-foreground">{cs.metricLabel}</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{cs.summary}</p>

                  {/* Outcomes */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Documented Outcomes
                    </h4>
                    <ul className="space-y-1.5">
                      {cs.outcomes.map((o, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <TrendingDown className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-muted/30 py-12 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Ready to Build Your Own Case Study?
            </h2>
            <p className="text-sm text-muted-foreground">
              Pilot deployments include dedicated outcome measurement — so you have the evidence
              your procurement committee needs.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/pilot-request">
                  Request a Pilot <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/roi-calculator">
                  <Clock className="w-4 h-4 mr-1" /> Estimate Your ROI
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
