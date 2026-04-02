import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Scale, FileCheck, Eye, Server, ArrowRight, ClipboardCheck, Users, BarChart3 } from "lucide-react";

const trustPillars = [
  {
    icon: ClipboardCheck,
    title: "Human Oversight by Design",
    desc: "Every prediction is advisory-only. Override tracking, escalation logs, and intended-use boundaries ensure clinicians remain the decision-makers.",
  },
  {
    icon: Eye,
    title: "Audit Trails for Procurement",
    desc: "Complete prediction lineage — from data ingestion through feature extraction to output — documented for compliance and governance committees.",
  },
  {
    icon: BarChart3,
    title: "Continuous Model Monitoring",
    desc: "Real-time performance drift detection, data quality checks, and retraining triggers. Every model version is logged and traceable.",
  },
  {
    icon: Scale,
    title: "Bias Review & Fairness Surveillance",
    desc: "Subgroup fairness analysis across age, sex, and race with patent-pending <0.5% disparity alerts. SHAP explainability for every prediction.",
  },
  {
    icon: FileCheck,
    title: "Governance-Ready Documentation",
    desc: "Pre-built artifacts for governance committees: validation summaries, intended-use statements, fairness reports, and risk-benefit analyses that procurement can reuse.",
  },
  {
    icon: Shield,
    title: "Intended-Use Boundaries",
    desc: "Clear scope definitions per algorithm. Non-Device CDS under §520(o)(1)(E). Designed to support — never replace — clinical decision-making.",
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
          <p className="text-xs uppercase tracking-widest text-primary mb-2">Documentation Reliability & AI-Readiness Controls</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Governance-Ready Infrastructure, Not Retrofit
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Before downstream AI can be trusted, documentation must be reliable. VitaSignal scores documentation
            trustworthiness, monitors model drift, and ships the audit trails, bias reviews, and governance artifacts
            that make clinical AI procurement defensible — not just possible.
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
