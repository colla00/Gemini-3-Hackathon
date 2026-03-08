import { Activity, Brain, Shield, FileText, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const systems = [
  {
    icon: Activity,
    name: "ICU Mortality Prediction",
    patent: "#1",
    desc: "Predicts mortality risk from documentation rhythm patterns. 9 temporal features extracted from routine EHR timestamps. Validated on 65,157 patients (MIMIC-IV + HiRID).",
    status: "Validated",
    highlight: true,
    metric: "65,157 patients validated",
  },
  {
    icon: Shield,
    name: "Trust-Based Alert Governance",
    patent: "#2",
    desc: "Mobile alert governance with trust scoring, equity monitoring, explainable AI, and cognitive load optimization.",
    status: "Patent Application Filed",
    metric: "Patent #2 · Target: 87% alert reduction",
  },
  {
    icon: Brain,
    name: "Clinical Risk Intelligence",
    patent: "#3",
    desc: "Integrated explainability with SHAP, temporal forecasting, adaptive thresholds, and closed-loop intervention feedback.",
    status: "Patent Application Filed",
    metric: "Designed: 4-48h forecasting",
  },
  {
    icon: BarChart3,
    name: "Unified Nursing Intelligence",
    patent: "#4",
    desc: "Integrated platform combining workload prediction, risk intelligence, and trust-based alerts with equity monitoring.",
    status: "Patent Application Filed",
    metric: "Target: 3.8M RNs",
  },
  {
    icon: FileText,
    name: "Documentation Burden Score™ (DBS)",
    patent: "#5",
    desc: "ML-powered documentation burden quantification with multiple clinical variables. Externally validated across 172 hospitals (N=28,362).",
    status: "Validated",
    highlight: true,
    metric: "28,362 patients · 172 hospitals",
  },
  {
    icon: Activity,
    name: "TRACI – Temporal Risk Assessment",
    patent: "#6",
    desc: "Advanced temporal risk assessment combining time-series analysis of clinical data with contextual intelligence for early deterioration detection.",
    status: "Patent Application Filed",
    metric: "Multi-horizon scoring",
  },
  {
    icon: BarChart3,
    name: "ESDBI – Staffing Optimization",
    patent: "#7",
    desc: "Next-generation staffing optimization extending DBS with predictive scheduling, skill-mix optimization, and documentation burden forecasting.",
    status: "Patent Application Filed",
    metric: "Predictive scheduling",
  },
  {
    icon: Shield,
    name: "SHQS – Healthcare Quality Surveillance",
    patent: "#8",
    desc: "Continuous quality surveillance monitoring healthcare delivery metrics, detecting deviations, and triggering automated improvement workflows.",
    status: "Patent Application Filed",
    metric: "Automated quality scoring",
  },
  {
    icon: Brain,
    name: "DTBL – Digital Twin Baseline Learning",
    patent: "#9",
    desc: "Patient digital twin technology creating dynamic baseline models from EHR data for personalized risk thresholds and deviation detection.",
    status: "Patent Application Filed",
    metric: "Personalized baselines",
  },
  {
    icon: FileText,
    name: "CTCI – Clinical Trial Intelligence",
    patent: "#10",
    desc: "AI-driven clinical trial matching and cohort identification leveraging EHR documentation patterns for automated eligibility screening.",
    status: "Patent Application Filed",
    metric: "Automated screening",
  },
  {
    icon: Activity,
    name: "SEDR – Syndromic Surveillance",
    patent: "#11",
    desc: "Population-level syndromic surveillance using aggregated documentation rhythm patterns for early outbreak detection and response coordination.",
    status: "Patent Application Filed",
    metric: "Population-level detection",
  },
];

export const TechnologyPortfolio = () => (
  <section aria-labelledby="tech-portfolio-heading" className="py-24 px-6">
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
        <h2 id="tech-portfolio-heading" className="font-display text-3xl md:text-4xl text-foreground mb-4">
          11 Patent-Pending Systems
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
              <s.icon className="w-5 h-5" aria-hidden="true" />
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
