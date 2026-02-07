import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const metrics = [
  { label: "AUC", value: "0.684", detail: "95% CI: 0.653–0.715" },
  { label: "Dataset", value: "26,153", detail: "ICU admissions" },
  { label: "Validation Span", value: "11 years", detail: "Temporal split 2008–2019" },
  { label: "Strongest Predictor", value: "OR 1.82", detail: "Documentation rhythm (CV)" },
];

const differentiators = [
  "Zero hardware cost — uses existing EHR data only",
  "Equity-validated across patient populations",
  "SHAP-based explainability for every prediction",
  "Real-time deployment with sub-second inference",
];

export const ValidationSection = () => (
  <section className="py-20 px-6 bg-secondary/40">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Validated Performance
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
          Research-Backed Results
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The ICU Mortality Prediction system has been validated on large-scale clinical datasets
          with NIH-funded research support.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {metrics.map((m) => (
          <Card key={m.label} className="text-center">
            <CardContent className="pt-6 pb-5">
              <p className="text-3xl md:text-4xl font-bold text-primary font-display mb-1">
                {m.value}
              </p>
              <p className="text-sm font-semibold text-foreground mb-0.5">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Differentiators */}
      <Card>
        <CardContent className="pt-6 pb-5">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs">Why It Matters</Badge>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {differentiators.map((d) => (
              <div key={d} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
);
