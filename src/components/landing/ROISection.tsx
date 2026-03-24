import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DollarSign, TrendingDown, ShieldCheck, FileText } from "lucide-react";

const stats = [
  { icon: FileText, value: "11", label: "Patent Applications", detail: "U.S. Provisional — filed 2025–2026" },
  { icon: TrendingDown, value: "172", label: "Hospitals Validated", detail: "Multi-center external validation" },
  { icon: ShieldCheck, value: "225K+", label: "Patients Validated", detail: "IDI + DBS + SEDR · 3 databases" },
  { icon: DollarSign, value: "$0", label: "Hardware Cost", detail: "Uses existing EHR data only" },
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
          <p className="text-xs uppercase tracking-widest text-primary mb-2">Value Proposition</p>
          <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-3">
            Zero Hardware. Validated Results.
          </h2>
          <p className="text-primary-foreground/60 max-w-xl mx-auto text-sm">
            No capital expenditure. No new sensors. Software-only deployment using existing EHR documentation data,
            validated across multiple international databases.
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
          All metrics from validated research. VitaSignal is a pre-market research prototype — not FDA cleared or approved.
        </p>
      </div>
    </section>
  );
};
