import { TrendingUp, DollarSign, Users, Hospital } from "lucide-react";
import { motion } from "framer-motion";

const opportunities = [
  {
    icon: Hospital,
    value: "$4.7B",
    label: "Clinical Decision Support Market",
    detail: "Projected by 2028 (Grand View Research)",
    qualifier: "Industry estimate",
  },
  {
    icon: Users,
    value: "3.8M",
    label: "Registered Nurses in U.S.",
    detail: "Potential platform users",
    qualifier: "Bureau of Labor Statistics",
  },
  {
    icon: DollarSign,
    value: "$0",
    label: "Hardware Cost",
    detail: "Works with existing EHR data",
    qualifier: "Core differentiator",
  },
  {
    icon: TrendingUp,
    value: "175+",
    label: "Patent Claims Filed",
    detail: "Across 5 provisional applications",
    qualifier: "Dec 2025 - Feb 2026",
  },
];

export const MarketOpportunitySection = () => (
  <section className="py-24 px-6 bg-secondary/30">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Market Opportunity
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
          Why VitaSignal™ Matters
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Equipment-independent AI addresses the largest unmet need in clinical
          decision support: cost-effective, deployable prediction that works with
          infrastructure hospitals already have.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {opportunities.map((o, i) => (
          <motion.div
            key={o.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="p-6 rounded-xl bg-card border border-border/50 text-center hover:border-primary/20 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <o.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="font-display text-2xl md:text-3xl text-primary mb-1">
              {o.value}
            </p>
            <p className="text-sm font-semibold text-foreground mb-1">{o.label}</p>
            <p className="text-xs text-muted-foreground">{o.detail}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1 italic">
              {o.qualifier}
            </p>
          </motion.div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground/50 text-center mt-6">
        Market estimates are from publicly available industry reports and do not represent validated projections.
      </p>
    </div>
  </section>
);
