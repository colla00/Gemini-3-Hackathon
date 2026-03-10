import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Award, BookOpen, ShieldCheck, Globe, Users, FileText, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const publications = [
  { journal: 'JAMIA', title: 'Multi-Center Validation of Equipment-Independent ICU Mortality Prediction', status: 'Under Review', type: 'Original Research' },
  { journal: 'npj Digital Medicine', title: 'Fairness-Preserving Clinical AI Across International Datasets', status: 'Under Review', type: 'Original Research' },
  { journal: 'JAMA Network Open', title: 'Nursing Workload Optimization Through Clinical Decision Support', status: 'Under Review', type: 'Original Research' },
];

const validationPoints = [
  { icon: Users, stat: '55,000+', label: 'Patients Validated', desc: 'Multi-center external validation across international critical care databases' },
  { icon: Globe, stat: '3', label: 'International Datasets', desc: 'MIMIC-IV, HiRID, and eICU-CRD spanning U.S. and European healthcare systems' },
  { icon: ShieldCheck, stat: 'Zero', label: 'Racial Disparities', desc: 'Equalized odds and calibration equity maintained across all demographic groups' },
  { icon: Award, stat: 'NIH', label: 'Federal Validation', desc: 'CLINAQ Fellowship recipient — competitive federal research funding' },
];

const fairnessMetrics = [
  { name: 'Equalized Odds', result: 'Maintained', desc: 'True positive and false positive rates balanced across racial/ethnic groups' },
  { name: 'Calibration Equity', result: 'Preserved', desc: 'Predicted probabilities match observed outcomes regardless of demographics' },
  { name: 'Subgroup Performance', result: 'Consistent', desc: 'Model accuracy does not degrade for underrepresented populations' },
  { name: 'Feature Bias Audit', result: 'Clean', desc: 'No proxy variables for race or socioeconomic status in model inputs' },
];

const Evidence = () => (
  <>
    <Helmet>
      <title>Clinical Evidence | VitaSignal — Validated Across 55,000+ Patients</title>
      <meta name="description" content="VitaSignal's clinical AI is validated across 55,000+ patients with zero racial disparities. NIH-funded, peer-reviewed, and externally validated across 3 international datasets." />
    </Helmet>
    <Navbar />
    <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" /> Peer-Reviewed Clinical Validation
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-['DM_Serif_Display']">
              Built on <span className="text-blue-400">Science, Not Hype</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Every VitaSignal algorithm is externally validated, fairness-audited, and submitted for peer review at tier-1 medical journals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Validation Stats */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {validationPoints.map((v, i) => (
            <motion.div key={v.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <v.icon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <p className="text-3xl font-bold text-white mb-1">{v.stat}</p>
              <p className="text-sm font-medium text-blue-400 mb-2">{v.label}</p>
              <p className="text-xs text-white/50">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Fairness */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Health Equity Commitment</h2>
            </div>
            <p className="text-white/60 text-sm mb-6">
              VitaSignal was designed from day one to eliminate algorithmic bias in clinical AI. Our fairness monitoring is continuous, not an afterthought.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fairnessMetrics.map(f => (
                <div key={f.name} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{f.name}</span>
                    <span className="text-xs font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">{f.result}</span>
                  </div>
                  <p className="text-xs text-white/50">{f.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Publications */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-white/50" /> Publication Pipeline
          </h2>
          <div className="space-y-3">
            {publications.map(p => (
              <div key={p.title} className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">{p.journal}</span>
                  <span className="text-xs text-amber-400">{p.status}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{p.title}</p>
                  <p className="text-xs text-white/40">{p.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NIH */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Award className="w-10 h-10 text-blue-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-2">NIH CLINAQ Fellowship</h3>
              <p className="text-sm text-white/60 mb-1">Award No. 1OT2OD032581</p>
              <p className="text-sm text-white/50">Competitively awarded federal research funding validating VitaSignal's clinical AI methodology and health equity approach.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to See the Data Behind the Claims?</h2>
          <p className="text-white/60 mb-6">Request access to our full validation report, including methodology, statistical analysis, and subgroup performance data.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
              <a href="/pilot-request">Request Validation Report <ArrowRight className="w-4 h-4 ml-2" /></a>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <a href="/demo">Try the Interactive Demo <ExternalLink className="w-4 h-4 ml-2" /></a>
            </Button>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Evidence;
