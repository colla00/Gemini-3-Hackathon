import { motion } from "framer-motion";
import { Globe, Wifi, Heart, Building2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  "No bedside monitors, wearables, or sensors required",
  "Works with any EHR system that records timestamped entries",
  "Validated across 208 hospitals with diverse patient populations",
  "Deployable via cloud or on-premise — no hardware installation",
  "Equity-validated to minimize bias across demographics",
];

export const GlobalHealthSection = () => (
  <section className="py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs gap-1.5">
              <Globe className="w-3 h-3" />
              Global Health
            </Badge>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            Clinical AI for
            <br />
            <span className="text-primary">Resource-Limited Settings</span>
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Most clinical AI requires expensive hardware that 80% of the world's hospitals
            can't afford. VitaSignal™ is different — it turns routine nursing documentation
            into actionable clinical intelligence, making validated mortality prediction
            accessible to any facility with basic EHR capability.
          </p>

          <div className="space-y-3">
            {capabilities.map((c, i) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{c}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { icon: Wifi, label: "Zero Hardware", detail: "Software-only deployment" },
            { icon: Building2, label: "208 Hospitals", detail: "Multi-center validated" },
            { icon: Heart, label: "382K+ Patients", detail: "Large-scale evidence" },
            { icon: Globe, label: "Any EHR", detail: "Universal compatibility" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className="p-5 rounded-xl border border-border/50 bg-card text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);
