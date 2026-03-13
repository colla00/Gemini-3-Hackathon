import { motion, useInView, animate, useMotionValue, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Activity, AlertTriangle, TrendingDown, Users, ArrowRight, Shield, Lock, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const mockPatients = [
  { id: "P-4821", risk: 0.87, trend: "rising", dbs: 12.4, status: "critical", alertCount: 3 },
  { id: "P-3102", risk: 0.42, trend: "stable", dbs: 6.1, status: "moderate", alertCount: 1 },
  { id: "P-7490", risk: 0.23, trend: "falling", dbs: 3.8, status: "low", alertCount: 0 },
  { id: "P-1567", risk: 0.71, trend: "rising", dbs: 9.7, status: "high", alertCount: 2 },
  { id: "P-2283", risk: 0.91, trend: "rising", dbs: 14.2, status: "critical", alertCount: 4 },
];

const statusConfig: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  critical: { bg: "bg-destructive/15", text: "text-destructive", border: "border-destructive/40", glow: "shadow-[0_0_12px_hsl(var(--destructive)/0.3)]" },
  high: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/40", glow: "shadow-[0_0_8px_rgba(251,146,60,0.2)]" },
  moderate: { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30", glow: "" },
  low: { bg: "bg-primary/15", text: "text-primary", border: "border-primary/30", glow: "" },
};

const AnimatedValue = ({ value, delay = 0 }: { value: number; delay?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => v.toFixed(1));

  useEffect(() => {
    if (inView) animate(mv, value, { duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] });
  }, [inView, mv, value, delay]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

const PulsingDot = ({ color }: { color: string }) => (
  <span className="relative flex h-2.5 w-2.5">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
  </span>
);

const RiskBar = ({ value, delay }: { value: number; delay: number }) => {
  const color = value > 0.7 ? "bg-destructive" : value > 0.4 ? "bg-orange-400" : "bg-primary";
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
      <span className={`font-mono text-xs font-bold tabular-nums ${value > 0.7 ? 'text-destructive' : value > 0.4 ? 'text-orange-400' : 'text-primary'}`}>
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
};

export const DashboardPreview = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <section id="dashboard-preview" ref={ref} className="py-24 px-6 bg-foreground relative overflow-hidden">
      {/* Ambient glow effects */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-destructive/5 blur-[80px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm mb-4"
          >
            <PulsingDot color="bg-primary" />
            <span className="text-primary font-semibold tracking-wide">Live Preview</span>
          </motion.div>
          <h2 className="font-display text-3xl md:text-5xl text-primary-foreground mb-4">
            Real-Time Patient Intelligence
          </h2>
          <p className="text-primary-foreground/60 max-w-2xl mx-auto text-base leading-relaxed">
            One dashboard. Every ICU patient. Mortality risk, documentation burden,
            and trust-filtered alerts — powered entirely by existing EHR data.
            <span className="text-primary font-medium"> No new hardware required.</span>
          </p>
        </motion.div>

        {/* Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-2xl border border-primary/20 bg-card shadow-2xl shadow-primary/5 overflow-hidden relative"
        >
          {/* Glowing top border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/30 bg-muted/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-foreground tracking-tight">VitaSignal™ Dashboard</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <PulsingDot color="bg-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Shield className="w-3 h-3 text-primary/60" />
                <span>HIPAA Compliant</span>
              </div>
              <span className="text-[10px] text-muted-foreground/60">Medical ICU · 12 patients</span>
            </div>
          </div>

          {/* Stats row with animated counters */}
          <div className="grid grid-cols-4 gap-px bg-border/10">
            {[
              { label: "High Risk", value: "3", icon: AlertTriangle, accent: "text-destructive", subtext: "Requires attention" },
              { label: "Avg DBS™", value: "7.8", icon: TrendingDown, accent: "text-primary", subtext: "Documentation burden" },
              { label: "Active Alerts", value: "4", icon: Activity, accent: "text-orange-400", subtext: "Trust-filtered" },
              { label: "Census", value: "12", icon: Users, accent: "text-foreground", subtext: "Current unit" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                className="bg-card p-4 text-center group hover:bg-muted/10 transition-colors"
              >
                <s.icon className={`w-4 h-4 ${s.accent} mx-auto mb-1.5 group-hover:scale-110 transition-transform`} />
                <p className={`text-2xl font-bold ${s.accent} tabular-nums`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
                <p className="text-[9px] text-muted-foreground/50 mt-0.5">{s.subtext}</p>
              </motion.div>
            ))}
          </div>

          {/* Patient table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 bg-muted/10">
                  <th className="text-left px-4 py-2.5 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Patient</th>
                  <th className="text-left px-4 py-2.5 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Mortality Risk</th>
                  <th className="text-center px-4 py-2.5 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">DBS™</th>
                  <th className="text-center px-4 py-2.5 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Trend</th>
                  <th className="text-center px-4 py-2.5 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 py-2.5 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Alerts</th>
                </tr>
              </thead>
              <tbody>
                {mockPatients.map((p, i) => {
                  const sc = statusConfig[p.status];
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                      className={`border-b border-border/10 transition-all cursor-default ${
                        hoveredRow === p.id ? 'bg-primary/5' : 'hover:bg-muted/5'
                      } ${p.status === 'critical' ? sc.glow : ''}`}
                      onMouseEnter={() => setHoveredRow(p.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {p.status === 'critical' && <PulsingDot color="bg-destructive" />}
                          <span className="font-mono text-xs text-foreground font-medium">{p.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <RiskBar value={p.risk} delay={0.5 + i * 0.1} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`font-mono font-bold text-sm ${p.dbs > 10 ? 'text-destructive' : p.dbs > 7 ? 'text-orange-400' : 'text-foreground'}`}>
                          {p.dbs}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <motion.span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
                            p.trend === 'rising' ? 'text-destructive bg-destructive/10' :
                            p.trend === 'falling' ? 'text-primary bg-primary/10' :
                            'text-muted-foreground bg-muted/20'
                          }`}
                          animate={p.trend === 'rising' ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {p.trend === 'rising' ? '↑' : p.trend === 'falling' ? '↓' : '→'}
                          {p.trend}
                        </motion.span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold uppercase tracking-wider ${sc.bg} ${sc.text} ${sc.border}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {p.alertCount > 0 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-destructive/15 text-destructive text-xs font-bold">
                            {p.alertCount}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/30 text-xs">—</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer with blurred locked preview */}
          <div className="relative">
            <div className="px-5 py-3 border-t border-border/20 bg-gradient-to-b from-muted/10 to-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                  <Zap className="w-3 h-3 text-primary/40" />
                  <span>Patent-pending technology</span>
                </div>
                <span className="text-[10px] text-muted-foreground/40">|</span>
                <p className="text-[10px] text-muted-foreground/40">
                  ⚠️ Simulated data · Not for clinical use
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
                <Lock className="w-3 h-3" />
                <span>Sign up for full access</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-10"
        >
          <p className="text-sm text-primary-foreground/50 mb-5 max-w-lg mx-auto">
            This is just a preview. Sign up to access the full platform — 11 patent-pending clinical modules,
            licensing options, partnership opportunities, and more.
          </p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button asChild size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/20">
              <Link to="/dashboard">
                Access the Full Platform <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
