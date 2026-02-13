import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/layout/SiteLayout";
import {
  Brain, Database, BarChart3, AlertTriangle, Shield, Users,
  Target, Clock, FileText, CheckCircle2, XCircle
} from "lucide-react";

const metrics = [
  { label: "AUC (C-statistic)", value: "0.683", context: "Temporal features only" },
  { label: "Dataset Size", value: "n = 26,153", context: "ICU admissions" },
  { label: "Temporal Span", value: "11 years", context: "2008–2019 MIMIC-IV" },
  { label: "Feature Count", value: "9", context: "Temporal documentation features" },
];

const features = [
  "Documentation frequency (notes per hour)",
  "Documentation timing patterns (day/night ratios)",
  "Note length variability over time",
  "Documentation gaps and irregularity indices",
  "Temporal clustering of clinical events",
  "Provider handoff documentation patterns",
  "Assessment frequency deviation from baseline",
  "Documentation completeness trajectory",
  "Care escalation documentation velocity",
];

const limitations = [
  "Validated only on MIMIC-IV (single-center, retrospective)",
  "AUC 0.683 reflects temporal-only features — not a replacement for full clinical models",
  "No prospective clinical validation completed yet",
  "Performance may vary across different EHR systems and institutions",
  "Documentation practices differ by institution, specialty, and care setting",
  "Model has not been validated on pediatric populations",
  "Training data represents a U.S. academic medical center — generalizability to community hospitals is unknown",
];

const ethicalConsiderations = [
  "Designed as a decision-support aid, not autonomous decision-maker",
  "SHAP explainability provided for every prediction",
  "Equity monitoring across demographic subgroups built into platform",
  "Clinician override always available — human-in-the-loop by design",
  "No patient-identifiable data used in training or demonstration",
  "Bias detection dashboard enables ongoing fairness monitoring",
];

function ModelCard() {
  return (
    <SiteLayout
      title="Model Card"
      description="Model Card for VitaSignal ICU Mortality Prediction System — training data, performance metrics, limitations, and ethical considerations."
    >
      {/* Hero */}
      <section className="bg-foreground text-primary-foreground py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/20 border border-primary/30 text-sm">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">Google Model Cards Framework</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4">
            Model Card
          </h1>
          <p className="text-lg opacity-80 max-w-2xl">
            Transparent documentation of the VitaSignal ICU Mortality Prediction model — 
            its intended use, training data, performance, limitations, and ethical considerations.
          </p>
          <Badge className="mt-4 bg-primary/20 border-primary/30 text-primary">
            Patent #1 — ICU Mortality Prediction
          </Badge>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Performance Metrics
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((m) => (
              <Card key={m.label}>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold text-primary">{m.value}</p>
                  <p className="text-sm font-medium text-foreground mt-1">{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.context}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Note:</strong> AUC 0.683 represents performance using 
                <em> only temporal documentation features</em> — no vitals, labs, or demographics. This 
                demonstrates that documentation rhythm alone carries predictive signal. Combined with 
                traditional clinical features, performance is expected to improve substantially.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Intended Use */}
      <section className="py-12 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Intended Use
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-risk-low" />
                  Intended Uses
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Clinical decision <em>support</em> for ICU care teams</p>
                <p>• Early warning layer complementing existing monitoring</p>
                <p>• Research tool for studying documentation-outcome relationships</p>
                <p>• Nursing workload and acuity assessment augmentation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" />
                  Out-of-Scope Uses
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Autonomous clinical decision-making</p>
                <p>• Replacement for clinical judgment or standard of care</p>
                <p>• Triage or resource allocation without clinician review</p>
                <p>• Use outside adult ICU settings (not validated)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Training Data */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Training Data
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-foreground mb-1">Source</p>
                  <p>MIMIC-IV (Medical Information Mart for Intensive Care)</p>
                  <p className="text-xs mt-1">Beth Israel Deaconess Medical Center, Boston MA</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Time Period</p>
                  <p>2008 – 2019 (11 years)</p>
                  <p className="text-xs mt-1">Temporal validation across full span</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Population</p>
                  <p>Adult ICU patients (≥18 years)</p>
                  <p className="text-xs mt-1">26,153 qualifying admissions</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">De-identification</p>
                  <p>PhysioNet Credentialed Health Data License</p>
                  <p className="text-xs mt-1">HIPAA Safe Harbor compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="font-display text-lg text-foreground mt-8 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Input Features (9 Temporal Features)
          </h3>
          <Card>
            <CardContent className="pt-6">
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-mono text-xs mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Fairness & Bias */}
      <section className="py-12 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Fairness & Bias Evaluation
          </h2>
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
              <p>
                The VitaSignal platform includes a built-in <strong className="text-foreground">Health Equity Analyzer</strong> and 
                <strong className="text-foreground"> Bias Monitor Dashboard</strong> that evaluate model performance 
                across demographic subgroups including age, gender, race/ethnicity, and comorbidity burden.
              </p>
              <p>
                By design, the model uses only temporal documentation features — no demographic variables are 
                direct inputs, reducing direct encoding of protected characteristics. However, documentation 
                patterns may correlate with systemic factors, and ongoing fairness monitoring is essential.
              </p>
              <p>
                <strong className="text-foreground">Subgroup analysis status:</strong> Retrospective 
                subgroup analysis completed on MIMIC-IV. External multi-site validation planned as a 
                next step before any clinical deployment.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Limitations */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Known Limitations
          </h2>
          <Card className="border-warning/30">
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {limitations.map((l, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ethical Considerations */}
      <section className="py-12 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Ethical Considerations
          </h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {ethicalConsiderations.map((e, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Regulatory Notice */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-destructive/20 bg-destructive/[0.03]">
            <CardContent className="pt-6 flex gap-4">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground">Research Prototype Status</p>
                <p>
                  This model is a research prototype. It is NOT FDA-cleared, NOT approved for clinical 
                  use, and NOT a medical device. All clinical decisions require qualified healthcare 
                  professionals. See our <a href="/regulatory" className="text-primary underline">Regulatory Readiness</a> page 
                  for the compliance roadmap.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Citation */}
      <section className="py-12 px-6 bg-foreground text-primary-foreground">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-xl mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Citation
          </h2>
          <div className="bg-primary-foreground/10 rounded-lg p-4 text-sm font-mono opacity-80 leading-relaxed">
            Collier, A. (2025). VitaSignal: Temporal Documentation Patterns as Predictors of ICU Mortality. 
            <em> medRxiv preprint</em>. Patent Application Filed: U.S. Provisional Patent, 35 U.S.C. § 111(b).
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default ModelCard;
