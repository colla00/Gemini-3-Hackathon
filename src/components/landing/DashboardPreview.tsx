import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const mockPatients = [
  { id: "P-4821", age: 67, sex: "M", los: "4d 12h", risk: 0.87, dbs: 12.4, trend: "rising", status: "critical", unit: "MICU-4A" },
  { id: "P-2283", age: 74, sex: "F", los: "6d 3h", risk: 0.91, dbs: 14.2, trend: "rising", status: "critical", unit: "MICU-4A" },
  { id: "P-1567", age: 58, sex: "M", los: "2d 8h", risk: 0.71, dbs: 9.7, trend: "rising", status: "high", unit: "MICU-4B" },
  { id: "P-3102", age: 45, sex: "F", los: "3d 1h", risk: 0.42, dbs: 6.1, trend: "stable", status: "moderate", unit: "MICU-4B" },
  { id: "P-7490", age: 52, sex: "M", los: "1d 19h", risk: 0.23, dbs: 3.8, trend: "falling", status: "low", unit: "MICU-4A" },
  { id: "P-8814", age: 61, sex: "F", los: "5d 6h", risk: 0.65, dbs: 8.9, trend: "stable", status: "high", unit: "MICU-4B" },
];

const riskColor = (r: number) =>
  r >= 0.8 ? "text-red-600 dark:text-red-400" :
  r >= 0.6 ? "text-amber-600 dark:text-amber-400" :
  r >= 0.4 ? "text-yellow-600 dark:text-yellow-400" :
  "text-foreground";

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    critical: "bg-red-600/10 text-red-700 dark:text-red-400 border-red-600/20",
    high: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    moderate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    low: "bg-muted text-muted-foreground border-border",
  };
  return map[s] || map.low;
};

export const DashboardPreview = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const now = new Date();
  const timestamp = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  return (
    <section id="dashboard-preview" ref={ref} className="py-24 px-6 bg-background relative">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-xs uppercase tracking-widest text-primary mb-2 font-semibold">Platform Preview</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Clinical Intelligence at the Point of Care
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
            A single view of every ICU patient — mortality risk, documentation burden, and trend data
            derived entirely from existing EHR activity. No additional hardware. No manual data entry.
          </p>
        </motion.div>

        {/* EHR-style Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="rounded-lg border border-border bg-card shadow-sm overflow-hidden"
        >
          {/* Application bar — EHR style */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-2 bg-muted/60 border-b border-border text-xs gap-1">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="font-semibold text-foreground">VitaSignal™ · Patient Risk Monitor</span>
              <span className="text-muted-foreground hidden sm:inline">Unit: MICU-4 · Floor 3</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-muted-foreground">
              <span>Census: <strong className="text-foreground">12</strong></span>
              <span>High Risk: <strong className="text-red-600 dark:text-red-400">3</strong></span>
              <span className="hidden sm:inline">Last Refresh: {timestamp}</span>
            </div>
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border text-xs">
            {[
              { label: "Avg Mortality Risk", value: "54.6%", sub: "Unit baseline: 38%" },
              { label: "Avg DBS™ Score", value: "9.2", sub: "Threshold: 8.0" },
              { label: "Trending Up", value: "3 patients", sub: "Past 4 hours" },
              { label: "Active Alerts", value: "6", sub: "4 high priority" },
            ].map((s, i) => (
              <div key={s.label} className={`px-4 py-3 border-b md:border-b-0 ${i % 2 === 0 ? 'border-r border-border' : ''} ${i < 2 ? 'md:border-r' : ''}`}>
                <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-0.5">{s.label}</p>
                <p className="text-sm font-semibold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Patient table */}
          <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {["Patient ID", "Age/Sex", "Unit", "LOS", "Mortality Risk", "DBS™ Score", "Trend (4h)", "Status"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockPatients.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.3 }}
                  className={`border-b border-border/50 cursor-default transition-colors ${
                    selectedRow === p.id ? 'bg-primary/5' : 'hover:bg-muted/30'
                  } ${p.status === 'critical' ? 'bg-red-500/[0.03]' : ''}`}
                  onClick={() => setSelectedRow(selectedRow === p.id ? null : p.id)}
                >
                  <td className="px-3 py-2.5 font-mono text-foreground font-medium">{p.id}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{p.age}{p.sex}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{p.unit}</td>
                  <td className="px-3 py-2.5 text-muted-foreground font-mono">{p.los}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            p.risk >= 0.8 ? 'bg-red-500' : p.risk >= 0.6 ? 'bg-amber-500' : p.risk >= 0.4 ? 'bg-yellow-500' : 'bg-primary'
                          }`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${p.risk * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.06 }}
                        />
                      </div>
                      <span className={`font-mono font-semibold tabular-nums ${riskColor(p.risk)}`}>
                        {(p.risk * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className={`px-3 py-2.5 font-mono font-semibold tabular-nums ${p.dbs > 10 ? 'text-red-600 dark:text-red-400' : p.dbs > 8 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
                    {p.dbs.toFixed(1)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center gap-0.5 ${
                      p.trend === 'rising' ? 'text-red-600 dark:text-red-400' : p.trend === 'falling' ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {p.trend === 'rising' ? '▲' : p.trend === 'falling' ? '▼' : '—'} {p.trend}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-medium uppercase tracking-wide ${statusBadge(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-muted/40 border-t border-border text-[10px] text-muted-foreground">
            <span>VitaSignal™ v2.4 · Patent-pending · Equipment-independent clinical AI</span>
            <span>⚠ Simulated data for demonstration only · Not for clinical use</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
            Sign up to access the full platform — 11 clinical intelligence modules,
            licensing options, and partnership opportunities.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild size="lg" className="gap-2 text-base px-8 h-11">
              <Link to="/dashboard">
                <Lock className="w-4 h-4" />
                Request Platform Access
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
