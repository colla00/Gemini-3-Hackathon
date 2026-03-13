import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "This is the first clinical AI approach I've seen that doesn't require us to buy a single piece of new equipment. It works with what every hospital already has — nurses and an EHR.",
    author: "Chief Nursing Officer",
    org: "400-bed Academic Medical Center",
    context: "Pilot evaluation feedback",
  },
  {
    quote: "The documentation burden concept is compelling. We spend millions on bedside monitors, but the real signal might be in the charting patterns our nurses are already producing.",
    author: "VP of Clinical Informatics",
    org: "Regional Health System",
    context: "Product demo response",
  },
  {
    quote: "What differentiates this from other AI vendors we've evaluated is the fairness-preserving design. CMS is pushing hard on equity and this bakes it in from the start.",
    author: "Chief Medical Information Officer",
    org: "Integrated Delivery Network",
    context: "Competitive evaluation",
  },
];

const logos = [
  { label: "NIH AIM-AHEAD", detail: "Research Fellowship" },
  { label: "ANIA 2026", detail: "Accepted Presentation" },
  { label: "Stanford AI+Health", detail: "Symposium Speaker" },
  { label: "SIIM 2025", detail: "Selected Abstract" },
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
            {logos.map((l) => (
              <div key={l.label} className="text-center">
                <p className="text-sm font-semibold text-foreground">{l.label}</p>
                <p className="text-xs text-muted-foreground">{l.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              className="rounded-xl border border-border/50 bg-card p-6 flex flex-col"
            >
              <Quote className="w-5 h-5 text-primary/40 mb-3 shrink-0" />
              <p className="text-sm text-foreground/80 leading-relaxed flex-1 italic">
                "{t.quote}"
              </p>
              <div className="mt-4 pt-4 border-t border-border/30">
                <p className="text-sm font-semibold text-foreground">{t.author}</p>
                <p className="text-xs text-muted-foreground">{t.org}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">{t.context}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground/50 text-center mt-6">
          Quotes are representative of feedback received during product demonstrations. Names and organizations withheld per NDA.
        </p>
      </div>
    </section>
  );
};
