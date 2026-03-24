import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Clock, Server } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    stat: "87%",
    label: "Alert False Positive Rate",
    description: "Clinicians ignore life-saving alerts because nearly 9 in 10 are noise — creating a dangerous trust deficit at the bedside.",
    source: "Published ICU alert fatigue literature",
  },
  {
    icon: DollarSign,
    stat: "$75K",
    label: "Per Adverse Event",
    description: "Each preventable adverse event costs hospitals an average of $75,000 in extended stays, liability, and lost reimbursement.",
    source: "AHRQ adverse event cost estimates",
  },
  {
    icon: Clock,
    stat: "6–12 hr",
    label: "Detection Delay",
    description: "Critical deterioration often goes undetected for 6 to 12 hours — a window where earlier intervention could change outcomes.",
    source: "ICU deterioration detection studies",
  },
  {
    icon: Server,
    stat: "$10K–$50K",
    label: "Per-Bed Hardware Cost",
    description: "Traditional monitoring requires expensive proprietary hardware at every bedside — creating massive capital barriers to clinical AI adoption.",
    source: "Industry infrastructure estimates",
  },
];

export const ProblemSection = () => (
  <section aria-labelledby="problem-heading" className="py-24 px-6 bg-background">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold text-destructive uppercase tracking-wider mb-3">
          The Problem
        </p>
        <h2 id="problem-heading" className="font-display text-3xl md:text-4xl text-foreground mb-4">
          Critical Care's Blind Spot
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ICUs generate massive volumes of data — yet clinicians lack timely, trustworthy signals 
          when it matters most. The result: missed deterioration, wasted resources, and preventable harm.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {problems.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 flex flex-col"
          >
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
              <p.icon className="w-5 h-5 text-destructive" aria-hidden="true" />
            </div>
            <p className="font-display text-3xl font-bold text-foreground mb-1">{p.stat}</p>
            <p className="text-sm font-semibold text-destructive mb-3">{p.label}</p>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.description}</p>
            <p className="text-xs text-muted-foreground/60 mt-4 pt-3 border-t border-border/30 italic">
              {p.source}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center text-sm text-muted-foreground mt-12 max-w-xl mx-auto"
      >
        VitaSignal™ was built to close this gap — extracting clinical intelligence from data that already exists, 
        without adding hardware, cost, or complexity.
      </motion.p>
    </div>
  </section>
);
