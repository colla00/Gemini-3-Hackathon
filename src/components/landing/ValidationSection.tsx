import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const metrics = [
  { label: "Patent #1 AUC", value: "0.683", detail: "ICU Mortality (n=26,153)" },
  { label: "Patent #5 AUROC", value: "0.857", detail: "DBS external (208 hospitals)" },
  { label: "Strongest Predictor", value: "OR 1.53", detail: "Documentation rhythm (CV)" },
  { label: "Total Validated", value: "321K+", detail: "Patients across both systems" },
];

const differentiators = [
  "Zero hardware cost — uses existing EHR data only",
  "Two independently validated systems (Patent #1 & #5)",
  "External validation across 208 hospitals (eICU)",
  "13-feature XGBoost model + 9 temporal IDI features",
  "SHAP-based explainability for every prediction",
  "ANIA 2026 presentation accepted — Boston, MA",
];

export const ValidationSection = () => (
  <section className="relative py-24 px-6 overflow-hidden">
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
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Validated Performance
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-6">
            Research-Backed Results
          </h2>
          <p className="text-primary-foreground/70 mb-8 leading-relaxed">
           Two patent systems have been validated on large-scale
            clinical datasets with NIH-funded research support: ICU Mortality Prediction (AUC 0.683, n=26,153)
            and DBS (AUROC 0.802→0.857, N=321,719 across 208 hospitals).
          </p>

          <div className="space-y-3">
            {differentiators.map((d, i) => (
              <motion.div
                key={d}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                <p className="text-sm text-primary-foreground/70">{d}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 text-center"
            >
              <p className="font-display text-3xl text-primary mb-1">{m.value}</p>
              <p className="text-sm font-semibold text-primary-foreground mb-0.5">{m.label}</p>
              <p className="text-xs text-primary-foreground/50">{m.detail}</p>
            </motion.div>
          ))}

          {/* Why AUC 0.683 Matters Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="col-span-2 p-5 rounded-xl bg-primary/10 border border-primary/30"
          >
            <p className="text-sm font-semibold text-primary mb-2">
              Why AUC 0.683 Matters
            </p>
            <p className="text-xs text-primary-foreground/70 leading-relaxed">
              Unlike APACHE IV, SOFA, and other ICU models that require vitals, labs, and bedside equipment, 
              Patent #1 achieves mortality prediction using <span className="text-primary-foreground font-medium">zero physiological data</span> — only 
              the timing and rhythm of routine EHR documentation. This is the first demonstration that 
              nurse charting patterns alone carry a mortality signal, enabling risk detection in 
              resource-limited settings with no additional hardware cost. Temporal validation held stable 
              (mean AUC 0.684) across 11 years (2008–2019).
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);
