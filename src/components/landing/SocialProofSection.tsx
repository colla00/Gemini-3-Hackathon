import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award } from "lucide-react";

const recognitions = [
  { label: "NIH AIM-AHEAD", detail: "Research Fellowship" },
  { label: "ANIA 2026", detail: "Accepted Presentation" },
  { label: "Stanford AI+Health", detail: "Symposium Speaker" },
  { label: "SIIM 2025", detail: "Selected Abstract" },
];

const highlights = [
  "Equipment-independent design — no new hardware, sensors, or wearables required",
  "Two independently validated systems across 357K+ patients and 172 hospitals",
  "Fairness-preserving AI with equity monitoring across demographic subgroups",
  "11 U.S. provisional patent applications filed (2025–2026)",
  "NIH-supported research (Award No. 1OT2OD032581)",
  "FHIR R4 native architecture designed for EHR integration",
];

export const SocialProofSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 px-6 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Recognized By</p>
          <div className="flex flex-wrap justify-center gap-6">
            {recognitions.map((l) => (
              <div key={l.label} className="text-center">
                <p className="text-sm font-semibold text-foreground">{l.label}</p>
                <p className="text-xs text-muted-foreground">{l.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key differentiators */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-8">
            Why VitaSignal Is Different
          </h2>
          <div className="space-y-3">
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <Award className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-foreground/80 leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
