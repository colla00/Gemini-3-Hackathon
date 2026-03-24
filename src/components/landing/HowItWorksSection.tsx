import { motion } from "framer-motion";
import { Database, Waves, Brain, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Database,
    label: "EHR Data",
    title: "Behavioral Data Ingestion",
    description: "Ingests timestamps, entry frequency, and workflow patterns already captured in your EHR — no new hardware, sensors, or data entry required.",
  },
  {
    icon: Waves,
    label: "Signal Extraction",
    title: "Proprietary Feature Extraction",
    description: "Proprietary algorithms extract documentation rhythm features — density, circadian patterns, burst detection, shift-end patterns, and temporal correlation across systems.",
  },
  {
    icon: Brain,
    label: "Clinical Intelligence",
    title: "Actionable Behavioral Intelligence",
    description: "Mortality risk prediction, documentation burden scoring, and shift-end analysis — with SHAP explainability, equity monitoring, and HL7/FHIR integration.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 px-6 border-b border-border/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            How It Works
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">
            From Documentation to Intelligence
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-0 relative">
          {/* Connector arrows (desktop only) */}
          <div className="hidden md:flex absolute top-16 left-[33%] right-[33%] items-center justify-around z-10 pointer-events-none">
            <ArrowRight className="w-6 h-6 text-primary/40" />
            <ArrowRight className="w-6 h-6 text-primary/40" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.45 }}
              className="relative flex flex-col items-center text-center px-6"
            >
              {/* Step number */}
              <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-3">
                Step {i + 1}
              </span>

              {/* Icon circle */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <step.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Mobile arrow */}
              {i < steps.length - 1 && (
                <div className="md:hidden my-2">
                  <ArrowRight className="w-5 h-5 text-primary/30 rotate-90" />
                </div>
              )}

              <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
