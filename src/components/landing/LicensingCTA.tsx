import { Mail, ArrowRight, Target, BarChart3, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const pilotEndpoints = [
  "Predefined clinical endpoint: failure-to-rescue rate reduction",
  "Predefined operational endpoint: nurse documentation time per shift",
  "Predefined financial endpoint: denial rework volume and cost",
  "Measurement plan with baseline, intervention, and accountable owner",
];

export const LicensingCTA = () => (
  <motion.section aria-labelledby="licensing-cta-heading" className="py-20 px-6 bg-primary" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 id="licensing-cta-heading" className="font-display text-2xl md:text-3xl text-primary-foreground mb-4">
            Start with a Structured Pilot — Not an Open-Ended Partnership
          </h2>
          <p className="text-primary-foreground/80 mb-6 text-sm leading-relaxed">
            Every VitaSignal engagement begins with predefined operational and clinical endpoints,
            a measurement plan, and clear accountability — so your team knows exactly what success looks like before deployment.
          </p>
          <div className="space-y-2.5 mb-8">
            {pilotEndpoints.map((ep, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary-foreground/70 mt-0.5 shrink-0" />
                <p className="text-sm text-primary-foreground/70">{ep}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="secondary" size="lg" className="text-base w-full justify-center" asChild>
            <Link to="/pilot-request" className="gap-2">
              <Target className="w-5 h-5" />
              Request a Structured Pilot
            </Link>
          </Button>
          <Button variant="secondary" size="lg" className="text-base w-full justify-center" asChild>
            <Link to="/roi-calculator" className="gap-2">
              <BarChart3 className="w-5 h-5" />
              Run Budget-Line ROI Model
            </Link>
          </Button>
          <Button variant="secondary" size="lg" className="text-base w-full justify-center" asChild>
            <Link to="/licensing" className="gap-2">
              View Licensing Options
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="secondary" size="lg" className="text-base w-full justify-center" asChild>
            <a href="mailto:licensing@vitasignal.ai" className="gap-2">
              <Mail className="w-5 h-5" />
              licensing@vitasignal.ai
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  </motion.section>
);
