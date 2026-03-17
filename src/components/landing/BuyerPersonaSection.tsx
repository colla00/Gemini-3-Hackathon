import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, Brain, DollarSign, Building2, Code2, Shield, ArrowRight } from "lucide-react";

const personas = [
  {
    icon: Heart,
    title: "Chief Nursing Officers",
    desc: "Quantify documentation burden, reduce alert fatigue, and give your nurses back time at the bedside — with data they're already generating.",
    link: "/for-leaders#cnos",
  },
  {
    icon: Brain,
    title: "CMIOs & Informatics Leaders",
    desc: "Equipment-independent AI that integrates via FHIR R4, works with existing EHR data, and provides SHAP-based explainability for every prediction.",
    link: "/for-leaders#cmios",
  },
  {
    icon: DollarSign,
    title: "CFOs & Financial Leaders",
    desc: "Zero capital expenditure. Software-only deployment. No new hardware procurement — ROI driven by existing EHR data utilization.",
    link: "/for-leaders#cfos",
  },
  {
    icon: Building2,
    title: "CEOs & COOs",
    desc: "Meet CMS equity requirements, differentiate your system with patent-pending clinical AI, and deploy in weeks — not months.",
    link: "/for-leaders#ceos",
  },
  {
    icon: Code2,
    title: "EHR Vendors & Partners",
    desc: "White-label license 11 patent-pending algorithms. FHIR R4 native, SMART on FHIR ready. Add clinical AI without building it.",
    link: "/for-leaders#ehr-vendors",
  },
  {
    icon: Shield,
    title: "VA & DoD Health Leaders",
    desc: "Equipment-independent design works in garrison and deployed settings. Compatible with VistA, MHS GENESIS, and Cerner Millennium.",
    link: "/solutions/military",
  },
];

export const BuyerPersonaSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 px-6 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-primary mb-2">Who It's For</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Built for Healthcare Decision-Makers
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Whether you lead nursing, technology, finance, or partnerships — VitaSignal addresses your specific priorities.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {personas.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
            >
              <Link
                to={p.link}
                className="block rounded-xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <p.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{p.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.desc}</p>
                <span className="text-xs text-primary font-medium inline-flex items-center gap-1">
                  Learn more <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
