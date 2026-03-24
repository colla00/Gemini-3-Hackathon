import { SiteLayout } from "@/components/layout/SiteLayout";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, ShieldCheck, BarChart3, Users, Clock, FileText, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const scorecardDomains = [
  {
    icon: FileText,
    title: "Documentation Completeness",
    question: "Does the AI system change the completeness, accuracy, or timing of clinical documentation?",
    metrics: [
      "Note completion rate before/after deployment",
      "Documentation timeliness (time from event to entry)",
      "Information density and structured data capture",
      "Omission rate for critical clinical findings",
    ],
  },
  {
    icon: Clock,
    title: "Escalation Timing",
    question: "Does the system affect how quickly clinical deterioration is recognized and escalated?",
    metrics: [
      "Time from first abnormal signal to clinical response",
      "Rapid Response Team activation latency",
      "Missed escalation rate (deterioration without timely response)",
      "Alert-to-action interval across shift types",
    ],
  },
  {
    icon: BarChart3,
    title: "Mortality-Risk Signal Quality",
    question: "Does the system preserve or improve the predictive signal embedded in clinical workflows?",
    metrics: [
      "AUROC/AUPRC of risk models before and after AI deployment",
      "Calibration stability across deployment periods",
      "Signal degradation monitoring (temporal drift detection)",
      "Feature contribution stability via SHAP analysis",
    ],
  },
  {
    icon: Users,
    title: "Subgroup Fairness",
    question: "Does the system perform equitably across demographic and clinical subgroups?",
    metrics: [
      "Discrimination parity across age, sex, race/ethnicity",
      "Calibration equity (predicted vs. observed by subgroup)",
      "Alert distribution fairness across patient populations",
      "Documentation burden equity across nursing demographics",
    ],
  },
];

const principles = [
  {
    icon: ShieldCheck,
    title: "Measure Before and After",
    description: "Every deployment should include pre/post measurement across all four domains. Claims without comparative evidence are insufficient.",
  },
  {
    icon: Scale,
    title: "Equity as a First-Class Metric",
    description: "Subgroup fairness is not a post-deployment audit. It is a validation requirement embedded in every evaluation protocol.",
  },
  {
    icon: FileText,
    title: "Documentation Is Clinical Data",
    description: "Changes to documentation workflows change the data substrate for downstream analytics, risk models, and quality reporting.",
  },
  {
    icon: BarChart3,
    title: "Signal Preservation Over Efficiency",
    description: "Efficiency gains that degrade predictive signal quality create hidden safety risks. Both must be monitored simultaneously.",
  },
];

export default function GovernanceFramework() {
  return (
    <SiteLayout
      title="Clinical AI Governance Framework"
      description="A practical evaluation framework for assessing whether ambient and workflow AI in clinical settings changes documentation completeness, escalation timing, signal quality, and subgroup fairness."
    >
      <Helmet>
        <meta name="keywords" content="clinical AI governance, ambient AI evaluation, healthcare AI scorecard, documentation quality, clinical decision support fairness, AI safety framework" />
      </Helmet>

      {/* Hero */}
      <section className="py-16 md:py-24 px-6 border-b border-border/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Governance Framework
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-foreground mb-5 leading-tight">
            Evaluating AI That Touches
            <br />
            <span className="text-primary">Clinical Documentation</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed mb-6">
            As ambient AI and workflow automation enter clinical settings, health systems need practical
            frameworks to evaluate whether these tools help or harm. This scorecard tests four domains
            where AI-assisted documentation and decision support can change patient safety outcomes.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">Public Framework</Badge>
            <Badge variant="outline" className="text-xs">VitaSignal Research</Badge>
            <Badge variant="outline" className="text-xs">Dr. Alexis M. Collier, DHA</Badge>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">Why This Matters</h2>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-3xl">
            Clinical documentation is not just administrative output — it is the data substrate for risk prediction,
            quality measurement, and operational intelligence. When AI changes how documentation is created, it changes
            the downstream signal that every other system depends on.
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            Most evaluation frameworks for clinical AI focus on the AI system's direct outputs. This framework asks a
            different question: <em className="text-foreground font-medium">what happens to the broader clinical intelligence
            ecosystem when AI changes the documentation layer?</em>
          </p>
        </div>
      </section>

      {/* Scorecard Domains */}
      <section className="py-16 px-6 bg-muted/20 border-y border-border/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3">Evaluation Scorecard</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Four domains for assessing AI impact on clinical documentation ecosystems.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {scorecardDomains.map((d) => (
              <Card key={d.title} className="border-border/50 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <d.icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">{d.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">{d.question}</p>
                  <ul className="space-y-2">
                    {d.metrics.map((m) => (
                      <li key={m} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Governing Principles */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8">Governing Principles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((p) => (
              <div key={p.title} className="flex gap-4 p-5 rounded-xl border border-border/50 bg-card">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <p.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
            Apply This Framework
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            VitaSignal's validated systems — IDI, DBS, and SEDR — were designed with these evaluation
            principles built in. See how documentation-derived intelligence maps to this framework.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" asChild>
              <Link to="/research" className="gap-2">
                View Research <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/pilot-request">Request a Pilot</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
