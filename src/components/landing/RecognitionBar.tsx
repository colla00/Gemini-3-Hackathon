import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const recognitions = [
  { label: "NIH AIM-AHEAD", detail: "CLINAQ Fellowship" },
  { label: "NIH Award", detail: "No. 1OT2OD032581" },
  { label: "ANIA 2026", detail: "Invited Webinar" },
  { label: "Stanford AI+Health", detail: "2025 Presenter" },
  { label: "SIIM 2025", detail: "Selected Abstract" },
  { label: "11 Patents", detail: "U.S. Provisional Filed" },
];

export const RecognitionBar = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className="py-8 px-6 border-y border-border/20 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center mb-5"
        >
          Research & Recognition
        </motion.p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {recognitions.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
              className="text-center"
            >
              <p className="text-sm font-semibold text-foreground">{r.label}</p>
              <p className="text-[11px] text-muted-foreground">{r.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
