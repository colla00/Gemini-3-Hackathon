import { Activity, Brain, Shield, FileText, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const systems = [
  {
    icon: Activity,
    name: "ICU Mortality Prediction",
    patent: "#1",
    desc: "Predicts mortality risk from documentation rhythm patterns. 9 temporal features extracted from routine EHR timestamps.",
    status: "Validated",
    highlight: true,
    metric: "AUC 0.683",
  },
  {
    icon: Shield,
    name: "ChartMinder - Trust-Based Alerts",
    patent: "#2",
    desc: "Mobile alert governance with trust scoring, equity monitoring, explainable AI, and cognitive load optimization.",
    status: "Patent Filed",
    metric: "Target: 87% alert reduction",
  },
  {
    icon: Brain,
    name: "Clinical Risk Intelligence",
    patent: "#3",
    desc: "Integrated explainability with SHAP, temporal forecasting, adaptive thresholds, and closed-loop intervention feedback.",
    status: "Patent Filed",
    metric: "Designed: 4-48h forecasting",
  },
  {
    icon: BarChart3,
    name: "Unified Nursing Intelligence",
    patent: "#4",
    desc: "Integrated platform combining workload prediction, risk intelligence, and trust-based alerts with equity monitoring.",
    status: "Patent Filed",
    metric: "Target: 3.8M RNs",
  },
  {
    icon: FileText,
    name: "Documentation Burden Scoring (DBS)",
    patent: "#5",
    desc: "ML-powered documentation burden quantification with 13 clinical variables (XGBoost). Externally validated across 208 hospitals (N=321,719).",
    status: "Validated",
    highlight: true,
    metric: "AUROC 0.802 → 0.857",
  },
];

export const TechnologyPortfolio = () => (
  <section className="py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Patent Portfolio
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
          Five Patent-Pending Systems
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A comprehensive platform for equipment-independent clinical AI, from
          mortality prediction through documentation optimization.
        </p>
      </motion.div>

      <div className="space-y-3">
        {systems.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`group flex items-start gap-5 p-5 rounded-xl border transition-all hover:shadow-md ${
              s.highlight
                ? "border-primary/30 bg-primary/[0.04]"
                : "border-border/50 bg-card hover:border-primary/20"
            }`}
          >
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                s.highlight
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors"
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
            <div className="text-right shrink-0 hidden sm:block">
              <span className="text-xs text-muted-foreground/50 font-mono block">
                Patent {s.patent}
              </span>
              {s.metric && (
                <span className="text-xs font-semibold text-primary mt-1 block">
                  {s.metric}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
