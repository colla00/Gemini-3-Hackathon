import { ShieldCheck, FileText, Users, Scale } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const pillars = [
  {
    icon: Scale,
    title: "Fairness as Measurable Infrastructure",
    description:
      "Equalized odds and calibration equity validated across demographic subgroups. Disparity metrics are tracked, alerted, and auditable — not aspirational.",
  },
  {
    icon: FileText,
    title: "Data Capture for Higher-Value Intelligence",
    description:
      "Routine EHR documentation becomes the signal source for clinical risk and operational insight — the most universal, equitable data in any hospital.",
  },
  {
    icon: ShieldCheck,
    title: "Continuous Bias Surveillance",
    description:
      "Real-time disparity detection with patent-pending <0.5% threshold alerts. Bias review results are documented for governance committees and CMS equity mandates.",
  },
  {
    icon: Users,
    title: "Multi-Center Validation at Scale",
    description:
      "Validated across 225K+ patients in international datasets — diverse populations, hospital sizes, and healthcare systems. Evidence, not claims.",
  },
];

export const FairnessCommitment = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      aria-labelledby="fairness-heading"
      className="py-20 px-6 bg-secondary/30"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Health Equity
          </p>
          <h2
            id="fairness-heading"
            className="font-display text-3xl md:text-4xl text-foreground mb-4"
          >
            Fairness-Preserving, Documentation-Driven AI
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            VitaSignal is built on the principle that clinical AI must work equitably for every
            patient — regardless of demographics, hospital size, or available equipment.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <p.icon className="w-4.5 h-4.5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{p.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
