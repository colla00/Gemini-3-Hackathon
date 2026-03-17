import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Scale, FileCheck, Eye, Server, ArrowRight } from "lucide-react";

const trustPillars = [
  {
    icon: Shield,
    title: "HIPAA-Aware Architecture",
    desc: "Designed from the ground up with HIPAA security and privacy principles. All data flows use encryption at rest and in transit.",
  },
  {
    icon: Scale,
    title: "Fairness-Preserving AI",
    desc: "Every algorithm undergoes subgroup analysis across demographic categories. SHAP-based explainability ensures transparency in every prediction.",
  },
  {
    icon: Lock,
    title: "Non-Device CDS Classification",
    desc: "Classified under §520(o)(1)(E) of the 21st Century Cures Act. Designed to support — never replace — clinical decision-making.",
  },
  {
    icon: FileCheck,
    title: "Externally Validated",
    desc: "Core algorithms validated on 65,157 patients (IDI) and 28,362 patients (DBS) across international multi-site databases including MIMIC-IV, eICU, and HiRID.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    desc: "No black boxes. Every risk score includes feature-level explanations so clinicians understand what drives each prediction.",
  },
  {
    icon: Server,
    title: "Equipment-Independent",
    desc: "Zero hardware dependencies. No sensors, wearables, or proprietary monitors required — reducing attack surface and vendor lock-in.",
  },
];

export const TrustLanguageSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-primary mb-2">Trust & Compliance</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Built for the Conversations That Matter
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Security, fairness, and transparency aren't features — they're foundations. Here's how VitaSignal earns trust at every level.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trustPillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
              className="rounded-xl border border-border/50 bg-card p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <pillar.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{pillar.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            to="/trust"
            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            Explore the full Trust Center <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
