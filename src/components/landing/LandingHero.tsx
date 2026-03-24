import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useTransform, animate, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const AnimatedNumber = ({ value, suffix = "", fallback }: { value: number; suffix?: string; fallback?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => {
    const r = Math.round(v);
    return r === 0 ? (fallback ?? value.toLocaleString()) : r.toLocaleString();
  });

  useEffect(() => {
    if (inView) {
      animate(motionVal, value, { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] });
    }
  }, [inView, motionVal, value]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
};

const parseStatValue = (val: string): { num: number; suffix: string; prefix: string } => {
  const match = val.match(/^([^0-9]*?)([\d,]+)(.*)$/);
  if (!match) return { num: 0, suffix: val, prefix: "" };
  return { prefix: match[1], num: parseInt(match[2].replace(/,/g, ""), 10), suffix: match[3] };
};

const stats = [
  { value: "225K+", label: "Patients Validated", detail: "Across 3 international databases" },
  { value: "11", label: "Patent Applications Filed", detail: "U.S. Provisional · 2025–2026" },
  { value: "172", label: "Hospitals Validated", detail: "Multi-center external validation" },
  { value: "$0", label: "Hardware Cost", detail: "Software-only · uses existing EHR data" },
];

export const LandingHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), { stiffness: 100, damping: 30 });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={sectionRef} aria-label="Hero" className="relative overflow-hidden bg-foreground text-primary-foreground">
      {/* Parallax background image */}
      <motion.div className="absolute inset-0" aria-hidden="true" style={{ y: imgY, scale: imgScale }}>
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        {/* Credential strip — minimal, tasteful */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap items-center gap-2 mb-8 text-xs text-primary-foreground/60"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/15 border border-primary/20 text-primary font-medium">
            NIH AIM-AHEAD CLINAQ Fellow
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary-foreground/5 border border-primary-foreground/10">
            Stanford AI+Health 2025
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary-foreground/5 border border-primary-foreground/10">
            ANIA 2026 · Boston, MA
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary-foreground/5 border border-primary-foreground/10">
            11 U.S. Patent Applications Filed
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] mb-5 leading-[1.08] max-w-4xl"
        >
          Fairness-Aware Clinical AI
          <br />
          <span className="text-primary">for Safer Bedside Decisions</span>
        </motion.h1>

        {/* Subhero — the core differentiator */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="text-base md:text-lg max-w-2xl mb-4 text-primary-foreground/75 leading-relaxed"
        >
         VitaSignal turns routine EHR documentation into fairness-aware clinical intelligence
          for safer bedside and operational decisions — no new hardware required.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.22 }}
          className="text-sm max-w-xl mb-8 text-primary-foreground/50 leading-relaxed"
        >
          Informed by NIH-supported research.
          Validated on 225,000+ patients across international ICU databases.
          Deploys in weeks — not months.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.28 }}
          className="flex flex-wrap gap-3 mb-16"
        >
          <Button size="lg" className="text-base px-6 h-12 shadow-lg" asChild>
            <a href="#dashboard-preview" className="gap-2">
              See Interactive Demo
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-base px-6 h-12 border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10"
            asChild
          >
            <Link to="/pilot-request">Request Pilot Assessment</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-base px-6 h-12 border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10"
            asChild
          >
            <Link to="/licensing">Licensing Inquiries</Link>
          </Button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="space-y-2"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary/15 rounded-xl overflow-hidden">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                className="bg-background/95 backdrop-blur-md p-5 text-center"
              >
                <p className="font-display text-2xl md:text-3xl text-primary mb-1 font-bold">
                  {(() => { const { num, suffix } = parseStatValue(s.value); return <AnimatedNumber value={num} suffix={suffix} fallback={s.value} />; })()}
                </p>
                <p className="text-sm font-bold text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground/90 mt-0.5">{s.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
