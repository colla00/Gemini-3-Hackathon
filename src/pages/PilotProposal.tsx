import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Building2, Printer, ArrowRight, CheckCircle2, Clock, DollarSign, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { SiteLayout } from '@/components/layout/SiteLayout';

const calculateROI = (beds: number, icuBeds: number) => {
  const annualAdmissions = beds * 365 * 0.7 / 4.5;
  const haiSavings = annualAdmissions * 0.032 * 0.23 * 28400;
  const nurseSavings = icuBeds * 0.45 * 365 * 3 * 45;
  const total = haiSavings + nurseSavings;
  const cost = beds * 850 + 75000;
  return { annual: Math.round(total), cost: Math.round(cost), payback: Math.round((cost / total) * 12 * 10) / 10, fiveYear: Math.round(((total * 5 - cost) / cost) * 100) };
};

const PilotProposal = () => {
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('lead');
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (leadId) {
      supabase.from('contact_inquiries').select('*').eq('id', leadId).single()
        .then(({ data }) => { setLead(data); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [leadId]);

  const parsed = lead ? (() => { try { return JSON.parse(lead.message); } catch { return {}; } })() : {};
  const beds = parseInt(parsed.bedCount) || 300;
  const icuBeds = parseInt(parsed.icuBeds) || 40;
  const roi = calculateROI(beds, icuBeds);
  const orgName = lead?.organization || 'Your Hospital';
  const contactName = lead?.name || 'Hospital Partner';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const phases = [
    { name: 'Discovery & Scoping', weeks: '1–2', items: ['Technical environment assessment', 'EHR integration planning', 'Unit selection and staff identification', 'Success metrics agreement'] },
    { name: 'Integration & Setup', weeks: '3–4', items: ['FHIR API connection (read-only)', 'Risk dashboard configuration', 'Staff training sessions', 'BAA execution'] },
    { name: 'Live Pilot', weeks: '5–16', items: ['Real-time risk scoring on selected unit', 'Weekly performance reviews', 'Clinical workflow optimization', 'Equity monitoring reports'] },
    { name: 'Evaluation & Transition', weeks: '17–18', items: ['Clinical impact analysis', 'ROI validation report', 'Annual contract discussion', 'Expansion planning'] },
  ];

  if (loading) return <SiteLayout title="Loading..."><div className="min-h-screen bg-[hsl(220,25%,8%)] flex items-center justify-center text-white/30">Loading...</div></SiteLayout>;

  return (
    <SiteLayout title={`Pilot Proposal — ${orgName} | VitaSignal`}>
      <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)] print:bg-white print:text-black">
        <section className="pt-28 pb-6 px-4 print:pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs text-white/40 print:text-gray-500 uppercase tracking-wider">Confidential Proposal</p>
                <h1 className="text-2xl md:text-3xl font-bold text-white print:text-black font-['DM_Serif_Display'] mt-1">
                  VitaSignal™ Clinical AI Pilot
                </h1>
                <p className="text-lg text-emerald-400 print:text-emerald-600 font-medium mt-1">Prepared for {orgName}</p>
              </div>
              <Button onClick={() => window.print()} className="print:hidden bg-white/10 hover:bg-white/20 text-white border border-white/20">
                <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-8">
              {[
                { label: 'Prepared For', value: contactName },
                { label: 'Date', value: today },
                { label: 'Facility Size', value: `${beds} beds / ${icuBeds} ICU` },
                { label: 'EHR System', value: parsed.ehrSystem || 'TBD' },
              ].map(d => (
                <div key={d.label} className="rounded-lg border border-white/10 bg-white/5 print:border-gray-200 print:bg-gray-50 p-3">
                  <p className="text-white/40 print:text-gray-500 text-[10px]">{d.label}</p>
                  <p className="text-white print:text-black font-medium mt-0.5 capitalize">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Projected Impact */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 print:border-emerald-200 print:bg-emerald-50 p-6 mb-8">
              <h2 className="text-lg font-bold text-white print:text-black mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" /> Projected Annual Impact
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Annual Savings', value: `$${(roi.annual / 1000).toFixed(0)}K`, color: 'text-emerald-400' },
                  { label: 'Payback Period', value: `${roi.payback} mo`, color: 'text-amber-400' },
                  { label: '5-Year ROI', value: `${roi.fiveYear}%`, color: 'text-purple-400' },
                  { label: 'Implementation', value: `$${(roi.cost / 1000).toFixed(0)}K`, color: 'text-cyan-400' },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <p className={`text-2xl font-bold ${m.color} print:text-black`}>{m.value}</p>
                    <p className="text-[10px] text-white/40 print:text-gray-500">{m.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white/30 print:text-gray-400 mt-4">Based on CDC HAI cost benchmarks and BLS nurse labor rates. Actual results depend on implementation scope.</p>
            </motion.div>

            {/* Pilot Pricing */}
            <div className="rounded-2xl border border-white/10 bg-white/5 print:border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-bold text-white print:text-black mb-4">Proposed Engagement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-cyan-400 print:text-cyan-600 mb-2">Clinical Pilot — 3 Month</p>
                  <ul className="space-y-1.5 text-xs text-white/60 print:text-gray-600">
                    {['Single ICU or step-down unit', `Up to ${icuBeds} monitored beds`, 'Full EHR integration (read-only FHIR)', 'Dedicated implementation support', 'Weekly performance reports', 'Transition to annual license on success'].map(f => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-center rounded-xl border border-white/10 bg-white/[0.03] print:border-gray-200 p-6">
                  <p className="text-3xl font-bold text-white print:text-black">$2,500</p>
                  <p className="text-sm text-white/40 print:text-gray-500">/month × 3 months</p>
                  <p className="text-xs text-white/30 print:text-gray-400 mt-2">Total pilot investment: $7,500</p>
                </div>
              </div>
            </div>

            {/* Implementation Timeline */}
            <div className="rounded-2xl border border-white/10 bg-white/5 print:border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-bold text-white print:text-black mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" /> Implementation Timeline
              </h2>
              <div className="space-y-4">
                {phases.map((phase, i) => (
                  <div key={phase.name} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 print:border-blue-300">
                        {i + 1}
                      </div>
                      {i < phases.length - 1 && <div className="w-px flex-1 bg-white/10 print:bg-gray-200 mt-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white print:text-black">{phase.name}</p>
                        <span className="text-xs text-white/40 print:text-gray-500">Weeks {phase.weeks}</span>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {phase.items.map(item => (
                          <li key={item} className="text-xs text-white/50 print:text-gray-600 flex items-start gap-1.5">
                            <span className="text-white/20">→</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="rounded-2xl border border-white/10 bg-white/5 print:border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-bold text-white print:text-black mb-4">Included With This Pilot</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Shield, title: 'HIPAA Compliance', desc: 'BAA execution, encrypted data handling, audit logging' },
                  { icon: Users, title: 'Clinical Support', desc: 'Staff training, workflow optimization, weekly check-ins' },
                  { icon: FileText, title: 'Impact Reporting', desc: 'Clinical validation metrics, ROI analysis, equity audit' },
                ].map(item => (
                  <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.02] print:border-gray-200 p-4">
                    <item.icon className="w-5 h-5 text-emerald-400 mb-2" />
                    <p className="text-sm font-medium text-white print:text-black mb-1">{item.title}</p>
                    <p className="text-xs text-white/50 print:text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 print:border-emerald-300 p-6 mb-8">
              <h2 className="text-lg font-bold text-white print:text-black mb-3">Next Steps</h2>
              <ol className="space-y-2 text-sm text-white/60 print:text-gray-600">
                <li className="flex items-start gap-2"><span className="font-bold text-emerald-400">1.</span> Schedule a 30-minute technical scoping call</li>
                <li className="flex items-start gap-2"><span className="font-bold text-emerald-400">2.</span> We'll assess your EHR environment and select the optimal deployment unit</li>
                <li className="flex items-start gap-2"><span className="font-bold text-emerald-400">3.</span> Execute BAA and begin integration (weeks 1–2)</li>
                <li className="flex items-start gap-2"><span className="font-bold text-emerald-400">4.</span> Go live with real-time clinical AI within 30 days</li>
              </ol>
            </div>

            <div className="text-center print:hidden">
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <a href="/contact">Schedule Scoping Call <ArrowRight className="w-4 h-4 ml-2" /></a>
              </Button>
            </div>

            <p className="text-[10px] text-white/20 print:text-gray-400 text-center mt-8">
              This proposal is confidential and intended solely for {orgName}. VitaSignal is a pre-market research prototype — not FDA cleared or approved.
              © {new Date().getFullYear()} VitaSignal LLC. All rights reserved.
            </p>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default PilotProposal;
