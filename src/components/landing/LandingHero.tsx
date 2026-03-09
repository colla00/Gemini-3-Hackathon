import { ArrowRight, Presentation } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoAccessModal } from "@/components/WalkthroughRequestModal";
import heroBg from "@/assets/hero-bg.jpg";

const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v).toLocaleString());

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

export const LandingHero = () => (
  <section aria-label="Hero" className="relative overflow-hidden bg-foreground text-primary-foreground">
    {/* Background image with overlay */}
    <div className="absolute inset-0" aria-hidden="true">
      <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
    </div>

    <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
      {/* Stanford credential */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-2 mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <span className="text-primary font-medium">Presented at Stanford AI+Health 2025</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
          <span className="text-primary font-medium">ANIA 2026 — Boston, MA · March 26–28</span>
        </div>
      </motion.div>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 leading-[1.05] max-w-4xl"
      >
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-block"
        >
          Clinical Intelligence
        </motion.span>
        <br />
        <motion.span
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
          className="text-primary inline-block"
        >
          Without Equipment
        </motion.span>
      </motion.h1>

      {/* One-liner tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="text-base md:text-lg font-semibold text-primary mb-4 max-w-2xl tracking-tight"
      >
        The only validated clinical AI that works with nothing but a nurse and an EHR.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.18 }}
        className="text-lg md:text-xl max-w-2xl mb-8 opacity-80 leading-relaxed"
      >
        Patent-pending AI that predicts ICU mortality and documentation burden
        from EHR patterns alone. No sensors. No wearables. No added cost.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.22 }}
        className="flex flex-col sm:flex-row gap-3 mb-16"
      >
        <Button size="lg" className="text-base px-8 h-12 shadow-lg" asChild>
          <Link to="/licensing" className="gap-2">
            Explore Licensing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <DemoAccessModal
          trigger={
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 h-12 border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10"
            >
              <Presentation className="w-4 h-4 mr-2" />
              Request Dashboard Access
            </Button>
          }
        />
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="space-y-2"
      >
        <p className="text-[11px] uppercase tracking-wider text-primary-foreground/50 font-semibold text-center">
          11 Patent Applications Filed · ICU Mortality & Documentation Burden Systems
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary/20 rounded-xl overflow-hidden">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 + i * 0.05 }}
            className="bg-background/95 backdrop-blur-md p-5 text-center"
          >
            <p className="font-display text-2xl md:text-3xl text-primary mb-1 drop-shadow-md font-bold">
              {(() => { const { num, suffix } = parseStatValue(s.value); return <AnimatedNumber value={num} suffix={suffix} />; })()}
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
