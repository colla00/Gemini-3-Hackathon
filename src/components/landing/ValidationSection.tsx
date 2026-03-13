import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { motion, useInView, useMotionValue, useTransform, animate, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

const AnimatedNumber = ({ value, suffix = "", prefix = "", fallback }: { value: number; suffix?: string; prefix?: string; fallback?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => {
    if (!inView && v === 0 && fallback) return fallback;
    if (value >= 1000) return Math.round(v).toLocaleString();
    if (value < 1) return v.toFixed(value < 0.01 ? 3 : value < 1 ? 4 : 0);
    return Math.round(v).toLocaleString();
  });

  useEffect(() => {
    if (inView) animate(motionVal, value, { duration: 2, ease: [0.25, 0.46, 0.45, 0.94] });
  }, [inView, motionVal, value]);

  return (
    <span ref={ref}>
      {prefix}<motion.span>{display}</motion.span>{suffix}
    </span>
  );
};

const metrics = [
  { label: "Patent #1 IDI", value: 65157, display: "65,157", detail: "Patients validated", prefix: "", suffix: "" },
  { label: "External Validation", value: 172, display: "172", detail: "Hospitals (eICU)", prefix: "", suffix: "" },
  { label: "Patent #5 DBS", value: 28362, display: "28,362", detail: "Patients validated", prefix: "", suffix: "" },
  { label: "Total Validated", value: 357, display: "357K+", detail: "Patients across both systems", prefix: "", suffix: "K+" },
];

const differentiators = [
  "Zero hardware cost — uses existing EHR data only",
  "Two independently validated systems (Patent #1 & #5)",
  "External validation across 172 hospitals (eICU)",
  "SHAP-based explainability for every prediction",
  "NIH AIM-AHEAD CLINAQ Fellowship (Award No. 1OT2OD032581)",
  "ANIA 2026 presentation accepted — Boston, MA",
  "Stanford AI+Health 2025 symposium presenter",
  "SIIM 2025 selected abstract",
];

export const ValidationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]), { stiffness: 100, damping: 30 });

  return (
    <motion.section
      ref={sectionRef}
      aria-labelledby="validation-heading"
      className="relative py-24 px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-foreground" aria-hidden="true" />
      <motion.div
        className="absolute inset-0 opacity-10"
        aria-hidden="true"
        style={{
          y: bgY,
          backgroundImage: `radial-gradient(circle at 30% 50%, hsl(173 58% 29% / 0.4) 0%, transparent 50%),
                           radial-gradient(circle at 70% 50%, hsl(217 91% 35% / 0.3) 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold text-primary uppercase tracking-wider mb-3"
            >
              Validated Performance
            </motion.p>
            <h2 id="validation-heading" className="font-display text-3xl md:text-4xl text-primary-foreground mb-6">
              Research-Backed Results
            </h2>
            <p className="text-primary-foreground/70 mb-8 leading-relaxed">
             Two patent systems have been validated on large-scale
              clinical datasets with research supported in part by NIH Award No. 1OT2OD032581: ICU Mortality Prediction (65,157 patients across international databases)
              and DBS (28,362 patients across 172 hospitals).
            </p>

            <div className="space-y-3">
              {differentiators.map((d, i) => (
                <motion.div
                  key={d}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" aria-hidden="true" />
                  </motion.div>
                  <p className="text-sm text-primary-foreground/70">{d}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.6, type: "spring", stiffness: 150 }}
                whileHover={{ scale: 1.04, boxShadow: "0 8px 30px -8px hsl(173 58% 39% / 0.25)" }}
                className="p-6 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 text-center cursor-default transition-colors hover:border-primary/30"
              >
                <p className="font-display text-3xl text-primary mb-1">
                  <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix} fallback={m.display} />
                </p>
                <p className="text-sm font-semibold text-primary-foreground mb-0.5">{m.label}</p>
                <p className="text-xs text-primary-foreground/50">{m.detail}</p>
              </motion.div>
            ))}

            {/* Why Equipment-Independent Matters */}
            <motion.div
              initial={{ opacity: 0, y: 25, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="col-span-2 p-5 rounded-xl bg-primary/10 border border-primary/30"
            >
              <p className="text-sm font-semibold text-primary mb-2">
                Why Equipment-Independent AI Matters
              </p>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                Unlike APACHE IV, SOFA, and other ICU models that require vitals, labs, and bedside equipment, 
                Patent #1 achieves mortality prediction using <span className="text-primary-foreground font-medium">zero physiological data</span> — only 
                the timing and rhythm of routine EHR documentation. Externally validated to outperform established
                acuity scores across international databases. Detailed performance metrics available under NDA.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
