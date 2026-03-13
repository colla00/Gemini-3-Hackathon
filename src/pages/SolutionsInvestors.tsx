import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Shield, Brain, DollarSign, Globe, FileText, CheckCircle2 } from "lucide-react";

const highlights = [
  { icon: FileText, stat: "11", label: "Patent Applications", detail: "U.S. Provisional — strong IP moat" },
  { icon: Brain, stat: "357K+", label: "Patients Validated", detail: "MIMIC-IV, HiRID, eICU databases" },
  { icon: Globe, stat: "172", label: "Hospitals", detail: "External validation cohort" },
  { icon: DollarSign, stat: "—", label: "TAM", detail: "Clinical decision support market (est.)" },
];

const investorReasons = [
  { title: "Equipment-Independent Moat", desc: "The only validated clinical AI that predicts ICU mortality from documentation patterns alone — zero hardware dependency. 11 patent applications protect this novel approach." },
  { title: "Validated, Not Vaporware", desc: "Two systems independently validated on large-scale datasets. ICU Mortality: 65,157 patients. DBS™: 28,362 patients across 172 hospitals. Research supported by NIH." },
  { title: "Platform, Not Point Solution", desc: "Four product lines (Mortality, Nursing, Alerts, Risk) from a single data source — nursing documentation timestamps. Each additional module has near-zero marginal cost." },
  { title: "Regulatory Clarity", desc: "Classified as Non-Device CDS under §520(o)(1)(E). No 510(k) required for initial market entry. ISO 14971, IEC 62304, and HIPAA compliance frameworks documented." },
];

const SolutionsInvestors = () => (
  <SiteLayout
    title="For Investors | VitaSignal — Clinical AI Investment Opportunity"
    description="VitaSignal: 11 patent applications, 357K+ patients validated, $12B TAM. Equipment-independent clinical AI platform seeking strategic partners and investors."
  >
    <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="mb-4 border-amber-400/30 text-amber-400">
              <TrendingUp className="w-3 h-3 mr-1" /> For Investors & Strategic Partners
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-['DM_Serif_Display']">
              The Only Clinical AI That<br />
              <span className="text-amber-400">Needs No Equipment</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              Patent-protected, NIH-validated clinical intelligence platform.
              Every hospital has nurses and an EHR — that's our entire install base.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <Link to="/licensing">Explore Partnership <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="mailto:info@vitasignal.ai">Contact Founder</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center"
              >
                <h.icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{h.stat}</p>
                <p className="text-sm font-semibold text-white/80">{h.label}</p>
                <p className="text-xs text-white/40 mt-1">{h.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Thesis */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10 font-['DM_Serif_Display']">
            Investment Thesis
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {investorReasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Traction */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8 font-['DM_Serif_Display']">Traction & Milestones</h2>
          <div className="space-y-3">
            {[
              "11 U.S. provisional patent applications filed (2025–2026)",
              "NIH AIM-AHEAD CLINAQ Fellowship (Award No. 1OT2OD032581)",
              "ANIA 2026 presentation accepted — Boston, MA (March 26–28)",
              "Stanford AI+Health 2025 symposium presentation",
              "Manuscripts submitted to peer-reviewed journals",
              "Live interactive prototype with synthetic patient demonstrations",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-white/70">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-8"
          >
            <h2 className="text-xl font-bold text-white mb-3 font-['DM_Serif_Display']">Ready to Learn More?</h2>
            <p className="text-sm text-white/60 mb-6 max-w-xl mx-auto">
              We share detailed financials, patent claims, and validation methodology with qualified investors under NDA.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <a href="mailto:info@vitasignal.ai">Schedule a Call</a>
              </Button>
              <Button asChild variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  </SiteLayout>
);

export default SolutionsInvestors;
