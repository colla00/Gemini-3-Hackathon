import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DollarSign, TrendingUp, PiggyBank, ShieldCheck } from "lucide-react";

const stats = [
  { icon: DollarSign, value: "$2,847", label: "Saved per Patient", detail: "From reduced LOS & adverse events" },
  { icon: PiggyBank, value: "$2.1M", label: "Saved per Hospital", detail: "Annualized projected savings" },
  { icon: TrendingUp, value: "1,240%", label: "Return on Investment", detail: "Based on implementation model" },
  { icon: ShieldCheck, value: "0.947", label: "NPV", detail: "Negative predictive value (DBS)" },
];

export const ROISection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 px-6 bg-foreground text-primary-foreground">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-primary mb-2">Financial Impact</p>
          <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-3">
            Measurable Value, Minimal Investment
          </h2>
          <p className="text-primary-foreground/60 max-w-xl mx-auto text-sm">
            Zero hardware cost. Software-only deployment. Projected ROI based on validated workload reduction and adverse event prevention models.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5 text-center"
            >
              <s.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-primary-foreground">{s.value}</p>
              <p className="text-sm font-semibold text-primary-foreground/80 mt-1">{s.label}</p>
              <p className="text-xs text-primary-foreground/40 mt-0.5">{s.detail}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-[10px] text-primary-foreground/30 text-center mt-6">
          Projections based on published literature and implementation modeling. Not based on clinical trial results. VitaSignal is a pre-market research prototype.
        </p>
      </div>
    </section>
  );
};
