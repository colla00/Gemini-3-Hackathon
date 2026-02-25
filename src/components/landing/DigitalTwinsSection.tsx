import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Activity, Brain, FileText, ArrowRight, Layers } from "lucide-react";

const layers = [
  {
    patent: "#1",
    icon: Activity,
    name: "Mortality Signal Layer",
    desc: "Temporal documentation patterns predict ICU mortality risk — the foundational vital sign of the care process digital twin.",
    metric: "AUC 0.683",
  },
  {
    patent: "#3",
    icon: Brain,
    name: "Risk Intelligence Layer",
    desc: "Real-time risk stratification with SHAP explainability, adaptive thresholds, and closed-loop intervention tracking.",
    metric: "4–48h forecasting",
  },
  {
    patent: "#5",
    icon: FileText,
    name: "Workload Signal Layer",
    desc: "Documentation Burden Score™ quantifies and predicts nursing workload before each shift — the operational twin of patient complexity.",
    metric: "AUROC 0.857",
  },
];

export const DigitalTwinsSection = () => (
  <section className="relative py-24 px-6 overflow-hidden">
    <div className="absolute inset-0 bg-foreground" />
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `radial-gradient(circle at 25% 40%, hsl(173 58% 29% / 0.5) 0%, transparent 50%),
                         radial-gradient(circle at 75% 60%, hsl(217 91% 35% / 0.3) 0%, transparent 50%)`,
      }}
    />

    <div className="relative max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant="outline" className="text-xs gap-1.5 border-primary/30 text-primary">
            <Layers className="w-3 h-3" />
            Digital Twin Architecture
          </Badge>
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-4">
          The Care Process Signal Layer
        </h2>
        <p className="text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
          Patient digital twins need more than vitals and labs. VitaSignal™ provides the
          missing layer — <span className="text-primary-foreground font-semibold">the signal embedded in how care is documented</span>,
          not just what's documented.
        </p>
      </motion.div>

      <div className="space-y-4">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.patent}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="flex items-start gap-5 p-5 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <layer.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-primary-foreground">{layer.name}</h3>
                <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                  Patent {layer.patent}
                </Badge>
              </div>
              <p className="text-sm text-primary-foreground/60">{layer.desc}</p>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <span className="text-xs font-semibold text-primary">{layer.metric}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-10 p-6 rounded-xl bg-primary/10 border border-primary/20 max-w-3xl mx-auto text-center"
      >
        <p className="text-sm text-primary-foreground/80 leading-relaxed">
          <span className="font-semibold text-primary-foreground">Why this matters:</span> Existing
          digital twin platforms model anatomy and physiology. VitaSignal™ models the
          <span className="text-primary font-medium"> care delivery process itself</span> —
          creating a complete picture that includes the human element of nursing workflow.
        </p>
      </motion.div>
    </div>
  </section>
);
