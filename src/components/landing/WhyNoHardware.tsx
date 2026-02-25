import { motion } from "framer-motion";
import { Cpu, Server, Stethoscope, FileText, ArrowRight, Zap } from "lucide-react";

const comparisons = [
  { traditional: "Bedside monitors & sensors", vitasignal: "Existing EHR timestamps", icon: Cpu },
  { traditional: "Proprietary hardware install", vitasignal: "Software-only deployment", icon: Server },
  { traditional: "$50K–$200K per unit rollout", vitasignal: "Zero incremental hardware cost", icon: Stethoscope },
];

export const WhyNoHardware = () => (
  <section className="py-24 px-6 bg-secondary/30">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Equipment-Independent AI
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
          Why No Hardware?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Every nurse already documents care in the EHR. VitaSignal™'s insight is that the
          <span className="text-foreground font-semibold"> timing, rhythm, and frequency</span> of
          those entries carry a clinical signal as powerful as bedside monitors — without any
          additional equipment.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {comparisons.map((c, i) => (
          <motion.div
            key={c.traditional}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="rounded-xl border border-border/50 bg-card overflow-hidden"
          >
            <div className="p-4 bg-destructive/5 border-b border-border/30">
              <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-1">Traditional</p>
              <p className="text-sm text-muted-foreground">{c.traditional}</p>
            </div>
            <div className="p-4 flex items-center gap-3">
              <ArrowRight className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">VitaSignal™</p>
                <p className="text-sm font-medium text-foreground">{c.vitasignal}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex items-start gap-4 p-6 rounded-xl bg-primary/5 border border-primary/20 max-w-3xl mx-auto"
      >
        <Zap className="w-6 h-6 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground mb-1">The Bottom Line</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If a hospital has nurses and an EHR, it already has everything VitaSignal™ needs.
            No capital expenditure. No installation. No maintenance contracts. Just validated
            clinical intelligence from the data that's already being generated.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);
