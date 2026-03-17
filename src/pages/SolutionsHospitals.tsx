import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, TrendingDown, Clock, ShieldCheck, DollarSign, ArrowRight, CheckCircle2, Users } from "lucide-react";

const outcomes = [
  { icon: TrendingDown, stat: "0.758", label: "External AUROC (DBS)", detail: "Validated across 172 hospitals (eICU)" },
  { icon: Clock, stat: "0.683", label: "IDI AUC", detail: "Equipment-independent mortality prediction" },
  { icon: DollarSign, stat: "$0", label: "Hardware Cost", detail: "Uses existing EHR data only" },
  { icon: Users, stat: "93K+", label: "Patients Validated", detail: "65K IDI + 28K DBS across MIMIC-IV, HiRID, eICU" },
];

const useCases = [
  { title: "ICU Mortality Prediction", desc: "Identify deteriorating patients earlier — from documentation timing alone. No new equipment, sensors, or workflow changes.", link: "/solutions/icu-mortality" },
  { title: "Nursing Documentation Burden", desc: "Quantify and reduce documentation load with the DBS™ system — validated across 28,362 patients in 172 hospitals.", link: "/solutions/nurse-workload" },
  { title: "CMS Compliance & Health Equity", desc: "Meet CMS equity requirements with built-in fairness monitoring and disparity detection across demographic subgroups.", link: "/solutions/cms-compliance" },
  { title: "Alert Fatigue Reduction", desc: "Trust-based alert filtering replaces alarm floods with clinically actionable notifications — patent-pending technology.", link: "/demo" },
];

const SolutionsHospitals = () => (
  <SiteLayout
    title="For Hospitals & Health Systems | VitaSignal"
    description="Equipment-independent clinical AI for hospitals. Reduce ICU mortality, cut nursing documentation burden, and meet CMS equity requirements — no new hardware needed."
  >
    <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Building2 className="w-3 h-3 mr-1" /> For Hospitals & Health Systems
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-['DM_Serif_Display']">
              Clinical Intelligence<br />
              <span className="text-primary">From Data You Already Collect</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              VitaSignal works with your existing EHR — no new hardware, no new sensors, no integration burden.
              Deploy across your ICU in weeks, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <Link to="/pilot-request">Request Pilot Assessment <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/roi-calculator">Calculate Your ROI</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {outcomes.map((o, i) => (
              <motion.div
                key={o.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center"
              >
                <o.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{o.stat}</p>
                <p className="text-sm font-semibold text-white/80">{o.label}</p>
                <p className="text-xs text-white/40 mt-1">{o.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10 font-['DM_Serif_Display']">
            Four Systems, One Platform
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-primary/30 transition-colors"
              >
                <h3 className="text-lg font-bold text-white mb-2">{uc.title}</h3>
                <p className="text-sm text-white/60 mb-4">{uc.desc}</p>
                <Button asChild variant="link" className="text-primary p-0 h-auto text-sm">
                  <Link to={uc.link}>Learn more <ArrowRight className="w-3 h-3 ml-1" /></Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why VitaSignal */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8 font-['DM_Serif_Display']">Why CNOs & CMOs Choose VitaSignal</h2>
          <div className="space-y-3">
            {[
              "Zero capital expenditure — uses existing EHR data only",
              "Software-only deployment — no new hardware or sensors",
              "Fairness-preserving AI with equity monitoring across demographic subgroups",
              "HIPAA-aware architecture with encryption at rest and in transit",
              "11 patent applications filed — strong defensible IP moat",
              "NIH-supported research (Award No. 1OT2OD032581)",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-white/70">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4 font-['DM_Serif_Display']">Ready to See It In Action?</h2>
          <p className="text-white/60 mb-6 text-sm">Schedule a personalized assessment with synthetic patient data tailored to your facility type and bed count.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/pilot-request">Start Pilot Assessment</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/demo">Try Product Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  </SiteLayout>
);

export default SolutionsHospitals;
