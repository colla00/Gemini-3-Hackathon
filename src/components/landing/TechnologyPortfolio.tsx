import { Activity, Brain, Shield, FileText, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const systems = [
  {
    icon: Activity,
    name: "ICU Mortality Prediction",
    desc: "Predicts mortality risk from documentation rhythm patterns — 9 temporal features extracted from routine EHR timestamps.",
    status: "Validated",
    highlight: true,
  },
  {
    icon: Shield,
    name: "Trust-Based Alert Prioritization",
    desc: "Reduces alert fatigue through clinician trust scoring, adaptive thresholds, and equity-aware monitoring.",
    status: "Patent Filed",
  },
  {
    icon: Brain,
    name: "Clinical Risk Intelligence",
    desc: "Integrated explainability with SHAP, temporal forecasting, and closed-loop intervention feedback.",
    status: "Patent Filed",
  },
  {
    icon: BarChart3,
    name: "Nursing Intelligence Platform",
    desc: "Workload prediction, surge detection, and burnout risk monitoring using documentation signals.",
    status: "Patent Filed",
  },
  {
    icon: FileText,
    name: "Documentation Burden Scoring",
    desc: "ML-powered staffing optimization through real-time documentation burden quantification.",
    status: "Patent Filed",
  },
];

export const TechnologyPortfolio = () => (
  <section className="py-20 px-6">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Patent Portfolio
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
          Five Patent-Pending Systems
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A comprehensive platform for equipment-independent clinical AI, covering
          mortality prediction through documentation optimization.
        </p>
      </div>

      <div className="grid gap-4">
        {systems.map((s, i) => (
          <Card
            key={s.name}
            className={`transition-all hover:shadow-md ${
              s.highlight ? "border-primary/30 bg-primary/[0.03]" : ""
            }`}
          >
            <CardContent className="flex items-start gap-5 py-5 px-6">
              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                  s.highlight
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-foreground">{s.name}</h3>
                  <Badge
                    variant={s.highlight ? "default" : "secondary"}
                    className="text-[10px] px-2 py-0"
                  >
                    {s.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground/60 font-mono shrink-0 hidden sm:block">
                #{i + 1}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
