import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useTransform, animate, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroBg from "@/assets/hero-bg.jpg";

const AnimatedNumber = ({ value, suffix = "", fallback }: { value: number; suffix?: string; fallback?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => {
    const r = Math.round(v);
    return r === 0 && !inView ? (fallback ?? value.toLocaleString()) : r.toLocaleString();
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

const parseStatValue = (val: string): { num: number; suffix: string } => {
  const match = val.match(/^([\d,]+)(.*)$/);
  if (!match) return { num: 0, suffix: val };
  return { num: parseInt(match[1].replace(/,/g, ""), 10), suffix: match[2] };
};

const stats = [
  { value: "11", label: "Applications Filed", detail: "U.S. Provisional Patents" },
  { value: "175+", label: "Total Claims", detail: "Across all filings" },
  { value: "357K+", label: "Patients Validated", detail: "MIMIC-IV, HiRID & eICU" },
  { value: "172", label: "Hospitals", detail: "External validation" },
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
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" aria-hidden="true" />

      {/* Floating ambient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-accent/10 blur-3xl"
        animate={{ x: [0, -25, 15, 0], y: [0, 25, -10, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        {/* Credential badges */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-2 mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-sm"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span className="text-primary font-medium">Presented at Stanford AI+Health 2025</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-sm"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
            <span className="text-primary font-medium">ANIA 2026 — Boston, MA · March 26–28</span>
          </motion.div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 leading-[1.05] max-w-4xl whitespace-nowrap"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block"
          >
            Fairness-Preserving Clinical AI
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            className="text-primary inline-block"
          >
            for Safer, Smarter Care
          </motion.span>
        </motion.h1>

        {/* Taglines */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="text-lg md:text-xl max-w-2xl mb-8 opacity-80 leading-relaxed"
        >
          VitaSignal develops documentation-driven intelligence systems that transform routine
          EHR activity into actionable insight for patient risk, workflow visibility, and more
          equitable clinical decision support.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22 }}
          className="flex flex-wrap gap-3 mb-16"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button size="lg" className="text-base px-6 h-12 shadow-lg" asChild>
              <Link to="/demo" className="gap-2">
                Request a Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-6 h-12 border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/dashboard">Explore the Platform</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-6 h-12 border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/evidence">View Research</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-6 h-12 border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/licensing">Talk Licensing</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-2"
        >
          <p className="text-[11px] uppercase tracking-wider text-primary-foreground/50 font-semibold text-center">
            11 Patent Applications Filed · ICU Mortality & Documentation Burden Systems
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary/20 rounded-xl overflow-hidden">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5, type: "spring", stiffness: 150 }}
              whileHover={{ backgroundColor: "hsl(var(--primary) / 0.08)" }}
              className="bg-background/95 backdrop-blur-md p-5 text-center transition-colors"
            >
              <p className="font-display text-2xl md:text-3xl text-primary mb-1 drop-shadow-md font-bold">
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
