import { Shield, WifiOff, Globe, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const points = [
  { icon: WifiOff, text: "Works without bedside monitors — ideal for deployed and austere environments" },
  { icon: Shield, text: "FedRAMP-aligned architecture with HIPAA-compliant data handling" },
  { icon: Globe, text: "Compatible with VistA, MHS GENESIS, and Cerner Millennium" },
];

export const MilitaryHealthSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 px-6 bg-foreground text-primary-foreground">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary text-xs">
              <Shield className="w-3 h-3 mr-1" /> DoD & Military Health
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-4">
              Ready for the Military Health System
            </h2>
            <p className="text-primary-foreground/60 leading-relaxed mb-6">
              VitaSignal's equipment-independent design makes it uniquely suited for VA medical centers,
              military treatment facilities, and deployed medical units where traditional monitoring
              equipment may be unavailable.
            </p>
            <Button asChild variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
              <Link to="/solutions/military">
                Learn More <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {points.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <p.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-primary-foreground/70 leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
