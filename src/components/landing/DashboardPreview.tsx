import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Activity, AlertTriangle, TrendingDown, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const mockPatients = [
  { id: "P-4821", name: "Patient A", risk: 0.87, trend: "rising", dbs: 12.4, status: "critical" },
  { id: "P-3102", name: "Patient B", risk: 0.42, trend: "stable", dbs: 6.1, status: "moderate" },
  { id: "P-7490", name: "Patient C", risk: 0.23, trend: "falling", dbs: 3.8, status: "low" },
  { id: "P-1567", name: "Patient D", risk: 0.71, trend: "rising", dbs: 9.7, status: "high" },
];

const statusColor = (status: string) => {
  if (status === "critical") return "bg-destructive/20 text-destructive border-destructive/30";
  if (status === "high") return "bg-orange-500/20 text-orange-400 border-orange-500/30";
  if (status === "moderate") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-primary/20 text-primary border-primary/30";
};

export const DashboardPreview = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="dashboard-preview" ref={ref} className="py-20 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-primary mb-2">Interactive Demo</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Real-Time Patient Intelligence
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            One dashboard. Every ICU patient. Risk scores, documentation burden, and trust-filtered alerts — all from existing EHR data.
          </p>
        </motion.div>

        {/* Mock Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-2xl border border-border/50 bg-card shadow-xl overflow-hidden"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/30 bg-muted/30">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">VitaSignal Dashboard</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">LIVE</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Unit: Medical ICU · 12 patients</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-px bg-border/20">
            {[
              { label: "High Risk", value: "3", icon: AlertTriangle, accent: "text-destructive" },
              { label: "Avg DBS™", value: "7.8", icon: TrendingDown, accent: "text-primary" },
              { label: "Active Alerts", value: "4", icon: Activity, accent: "text-orange-400" },
              { label: "Census", value: "12", icon: Users, accent: "text-foreground" },
            ].map((s) => (
              <div key={s.label} className="bg-card p-4 text-center">
                <s.icon className={`w-4 h-4 ${s.accent} mx-auto mb-1`} />
                <p className={`text-xl font-bold ${s.accent}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Patient table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20">
                  <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium">Patient</th>
                  <th className="text-center px-4 py-2 text-xs text-muted-foreground font-medium">Mortality Risk</th>
                  <th className="text-center px-4 py-2 text-xs text-muted-foreground font-medium">DBS™ Score</th>
                  <th className="text-center px-4 py-2 text-xs text-muted-foreground font-medium">Trend</th>
                  <th className="text-center px-4 py-2 text-xs text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockPatients.map((p) => (
                  <tr key={p.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${p.risk > 0.7 ? 'text-destructive' : p.risk > 0.4 ? 'text-orange-400' : 'text-primary'}`}>
                        {(p.risk * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-foreground">{p.dbs}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs ${p.trend === 'rising' ? 'text-destructive' : p.trend === 'falling' ? 'text-primary' : 'text-muted-foreground'}`}>
                        {p.trend === 'rising' ? '↑' : p.trend === 'falling' ? '↓' : '→'} {p.trend}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-2 border-t border-border/30 bg-muted/20 text-center">
            <p className="text-[10px] text-muted-foreground">
              ⚠️ Simulated data for demonstration purposes only. Not for clinical use.
            </p>
          </div>
        </motion.div>

        {/* Pilot CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Sign up to access the full platform — licensing options, partnership opportunities, research evidence, and more.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/dashboard">
              Access the Full Platform <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
