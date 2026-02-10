import { ArrowRight, Presentation } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoAccessModal } from "@/components/WalkthroughRequestModal";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "0.683", label: "AUC", detail: "Predictive Performance" },
  { value: "26,153", label: "ICU Admissions", detail: "Validation Cohort" },
  { value: "5", label: "Applications Filed", detail: "175+ Claims" },
  { value: "11yr", label: "Temporal Span", detail: "2008-2019" },
];

export const LandingHero = () => (
  <section className="relative overflow-hidden bg-foreground text-primary-foreground">
    {/* Background image with overlay */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
    </div>

    <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
      {/* Stanford credential */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-primary/20 border border-primary/30 text-sm"
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-primary font-medium">Presented at Stanford AI+Health 2025</span>
      </motion.div>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-[1.05] max-w-4xl"
      >
        Clinical Intelligence
        <br />
        <span className="text-primary">Without Equipment</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-lg md:text-xl max-w-2xl mb-8 opacity-80 leading-relaxed"
      >
        Patent-pending AI that predicts ICU mortality from documentation
        patterns alone. No sensors. No wearables. No added cost.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="space-y-2"
      >
        <p className="text-[11px] uppercase tracking-wider text-primary-foreground/50 font-semibold text-center">
          Patent #1 — ICU Mortality Prediction · Manuscript Validation Results
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary-foreground/10 rounded-xl overflow-hidden">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="bg-foreground/80 backdrop-blur-sm p-5 text-center"
          >
            <p className="font-display text-2xl md:text-3xl text-primary mb-1">{s.value}</p>
            <p className="text-sm font-semibold opacity-90">{s.label}</p>
            <p className="text-xs opacity-50 mt-0.5">{s.detail}</p>
          </motion.div>
        ))}
        </div>
      </motion.div>
    </div>
  </section>
);
