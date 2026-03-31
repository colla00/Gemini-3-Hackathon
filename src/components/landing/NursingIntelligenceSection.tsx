import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, Clock, ShieldAlert, BarChart3, FileText, Users, ArrowRight } from "lucide-react";

const capabilities = [
  {
    icon: Clock,
    title: "Documentation Burden Quantification",
    desc: "DBS™ measures the real documentation load per nurse per shift — not estimates, not surveys. Validated across 131K patient-stays.",
  },
  {
    icon: ShieldAlert,
    title: "Early Deterioration Visibility",
    desc: "IDI™ detects mortality risk from documentation timing patterns, giving nurses earlier signal without additional alarms or hardware.",
  },
  {
    icon: BarChart3,
    title: "Workload Strain & Staffing Visibility",
    desc: "SEDR™ quantifies shift-end documentation rates to surface workload strain patterns — actionable data for staffing and resource decisions.",
  },
  {
    icon: Users,
    title: "Equity Across Patient Populations",
    desc: "Fairness monitoring ensures predictions perform equitably across demographics — critical when nurse-patient ratios vary by unit and shift.",
  },
];

export const NursingIntelligenceSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} aria-labelledby="nursing-intel-heading" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-primary mb-2">
            Nursing Intelligence
          </p>
          <h2
            id="nursing-intel-heading"
            className="font-display text-3xl md:text-4xl text-foreground mb-4"
          >
            Nurse-Sensitive Clinical AI — Built for the Bedside
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm">
            Most clinical AI is designed for physicians. VitaSignal is built from the documentation
            patterns nurses already generate — making frontline workflow the signal source, not an afterthought.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className="rounded-xl border border-border/50 bg-card p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <c.icon className="w-4.5 h-4.5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{c.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="rounded-xl bg-primary/5 border border-primary/20 p-6 max-w-3xl mx-auto"
        >
          <div className="flex items-start gap-4">
            <Heart className="w-6 h-6 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-foreground mb-1">Why Nursing Intelligence Matters</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                AI adoption fails when bedside workflow, trust, and equity are ignored.
                The next wave of healthcare AI will be won by teams that make AI usable,
                governable, and trustworthy inside real clinical workflows — especially
                at the nursing and operational layer.
              </p>
              <Link
                to="/for-leaders#cnos"
                className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
              >
                See CNO-specific outcomes <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};