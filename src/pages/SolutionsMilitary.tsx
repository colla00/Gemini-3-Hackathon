import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle2, Globe, Wifi, WifiOff, Zap, Building2, Heart } from "lucide-react";

const dodAdvantages = [
  { icon: WifiOff, title: "Equipment-Independent Design", desc: "Works in austere environments, field hospitals, and deployed medical units where bedside monitors may be unavailable or unreliable." },
  { icon: Shield, title: "FedRAMP-Aligned Architecture", desc: "HIPAA-compliant, encryption at rest and in transit, SOC 2 architecture. Designed for compliance with DoD cybersecurity frameworks." },
  { icon: Heart, title: "Nurse-Centric Workflows", desc: "Military nursing faces unique documentation burdens. DBS™ quantifies and reduces documentation load, freeing medics for patient care." },
  { icon: Globe, title: "Deployable Worldwide", desc: "No hardware dependencies means VitaSignal works in any theater — from Landstuhl to Camp Humphreys to deployed Role 3 facilities." },
];

const militaryUseCases = [
  { title: "VA Medical Centers", desc: "Integrate with VistA/Cerner Millennium to provide real-time mortality prediction and workload optimization across the nation's largest health system." },
  { title: "Military Treatment Facilities", desc: "Deploy in CONUS and OCONUS MTFs for ICU patient surveillance without additional capital equipment procurement." },
  { title: "Combat Support Hospitals", desc: "Equipment-independent design enables deployment in field hospitals and deployed medical units where traditional monitors are impractical." },
  { title: "DHA Health Readiness", desc: "Support the Defense Health Agency's modernization goals with AI-driven clinical decision support that scales across the Military Health System." },
];

const complianceItems = [
  "HIPAA-compliant data handling and encryption",
  "Designed for FedRAMP and NIST 800-53 alignment",
  "No PHI leaves the clinical environment",
  "Compatible with VistA, Cerner Millennium, and MHS GENESIS",
  "Section 508 accessibility compliance",
  "ITAR and EAR review not required (software-only, no controlled technology)",
];

const SolutionsMilitary = () => (
  <SiteLayout
    title="DoD & Military Health | VitaSignal — Equipment-Independent Clinical AI"
    description="Clinical AI for VA, MTFs, and deployed medical units. Equipment-independent design works in austere environments. No new hardware — just existing EHR data."
  >
    <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="mb-4 border-emerald-400/30 text-emerald-400">
              <Shield className="w-3 h-3 mr-1" /> DoD & Military Health Systems
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-['DM_Serif_Display']">
              Clinical Intelligence for the<br />
              <span className="text-emerald-400">Military Health System</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              Equipment-independent AI that works in garrison and deployed settings alike.
              No new hardware procurement — integrate with existing EHR infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <a href="mailto:info@vitasignal.ai">Contact for DoD Evaluation <ArrowRight className="w-4 h-4 ml-2" /></a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Military */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10 font-['DM_Serif_Display']">
            Built for Austere Environments
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {dodAdvantages.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-emerald-400/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                    <a.icon className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-white">{a.title}</h3>
                </div>
                <p className="text-sm text-white/60">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10 font-['DM_Serif_Display']">
            Deployment Scenarios
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {militaryUseCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="text-lg font-bold text-white mb-2">{uc.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8 font-['DM_Serif_Display']">Security & Compliance</h2>
          <div className="space-y-3">
            {complianceItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
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
            className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-8"
          >
            <h2 className="text-xl font-bold text-white mb-3 font-['DM_Serif_Display']">Interested in a DoD Evaluation?</h2>
            <p className="text-sm text-white/60 mb-6 max-w-xl mx-auto">
              We work with DHA, VA, and military health system stakeholders to evaluate VitaSignal for specific clinical environments.
              All discussions available under NDA.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <a href="mailto:info@vitasignal.ai">Request Evaluation</a>
              </Button>
              <Button asChild variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/trust">View Trust Center</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  </SiteLayout>
);

export default SolutionsMilitary;
