import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

const metrics = [
  { label: "AUC", value: "0.683", detail: "95% CI: 0.631-0.732" },
  { label: "Temporal Stability", value: "0.684", detail: "Mean AUC over 11 years" },
  { label: "Dataset", value: "26,153", detail: "ICU admissions" },
  { label: "Strongest Predictor", value: "OR 1.53", detail: "Documentation rhythm (CV)" },
];

const differentiators = [
  "Zero hardware cost - uses existing EHR data only",
  "Equity-validated across patient populations",
  "SHAP-based explainability for every prediction",
  "Designed for real-time EHR integration",
];

export const ValidationSection = () => (
  <section className="relative py-24 px-6 overflow-hidden">
    {/* Dark background for contrast */}
    <div className="absolute inset-0 bg-foreground" />
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `radial-gradient(circle at 30% 50%, hsl(173 58% 29% / 0.4) 0%, transparent 50%),
                         radial-gradient(circle at 70% 50%, hsl(217 91% 35% / 0.3) 0%, transparent 50%)`,
      }}
    />

    <div className="relative max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Left: narrative */}
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Validated Performance
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-6">
            Research-Backed Results
          </h2>
          <p className="text-primary-foreground/70 mb-8 leading-relaxed">
            The ICU Mortality Prediction system has been validated on large-scale
            clinical datasets with NIH-funded research support, demonstrating
            consistent performance across an 11-year temporal validation window.
          </p>

          <div className="space-y-3">
            {differentiators.map((d) => (
              <div key={d} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                <p className="text-sm text-primary-foreground/70">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: metrics */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-6 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 text-center"
            >
              <p className="font-display text-3xl text-primary mb-1">{m.value}</p>
              <p className="text-sm font-semibold text-primary-foreground mb-0.5">{m.label}</p>
              <p className="text-xs text-primary-foreground/50">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
