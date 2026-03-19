import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Zap, Heart, Shield, ArrowRight, Users, Rocket, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SiteLayout } from '@/components/layout/SiteLayout';

const roles = [
  {
    id: 'cto',
    title: 'CTO / Technical Co-Founder',
    type: 'Co-Founder',
    location: 'Remote (U.S.)',
    equity: '15–25%',
    timing: 'Immediate',
    priority: 'critical',
    description: 'Lead architecture, EHR integration, and cloud deployment. Build the engineering foundation from validated research to production clinical AI.',
    requirements: [
      'Experience deploying ML systems in healthcare or regulated environments',
      'FHIR/HL7 integration knowledge or willingness to learn rapidly',
      'Comfort with ambiguity — this is a 0→1 build, not a scale role',
      'Alignment with health equity mission',
    ],
    compensation: 'Deferred salary until seed funding (~$2M target). Equity vests over 4 years with 1-year cliff.',
  },
  {
    id: 'clinical-ops',
    title: 'Clinical Operations Lead',
    type: 'Early Team',
    location: 'Remote (U.S.)',
    equity: '3–5%',
    timing: 'Q3 2026',
    priority: 'high',
    description: 'Lead hospital pilot deployments, clinical workflow integration, and serve as the bridge between engineering and clinical staff.',
    requirements: [
      'ICU nursing or clinical informatics background',
      'Experience with EHR workflow optimization',
      'Comfortable navigating hospital procurement and compliance',
      'Strong communicator who can translate between clinical and technical teams',
    ],
    compensation: 'Below-market salary + meaningful equity. Full market rate post-Series A.',
  },
  {
    id: 'ml-engineer',
    title: 'Lead ML Engineer',
    type: 'Post-Funding',
    location: 'Remote (U.S.)',
    equity: '1–3%',
    timing: 'Q4 2026',
    priority: 'planned',
    description: 'Own the ML pipeline from research models to production inference. Optimize clinical prediction models for real-time deployment.',
    requirements: [
      'Strong Python/PyTorch experience with tabular clinical data',
      'Experience with model deployment, monitoring, and drift detection',
      'Understanding of fairness metrics and bias mitigation in ML',
      'Healthcare data experience preferred (MIMIC, eICU, clinical NLP)',
    ],
    compensation: 'Competitive salary + equity. Funded position.',
  },
  {
    id: 'bd-lead',
    title: 'Business Development Lead',
    type: 'Post-Funding',
    location: 'Remote (U.S.)',
    equity: '1–2%',
    timing: 'Q1 2027',
    priority: 'planned',
    description: 'Drive hospital partnerships, manage the sales pipeline, and convert pilot programs into annual contracts.',
    requirements: [
      'Health IT or medical device sales experience',
      'Existing relationships with hospital C-suite or IT leadership',
      'Understanding of hospital procurement cycles and budget processes',
      'Comfort with consultative, long-cycle enterprise sales',
    ],
    compensation: 'Base + commission + equity. Funded position.',
  },
  {
    id: 'hipaa-compliance',
    title: 'HIPAA Compliance Officer',
    type: 'Early Team',
    location: 'Remote (U.S.)',
    equity: '2–4%',
    timing: 'Q3 2026',
    priority: 'high',
    description: 'Own VitaSignal\'s HIPAA compliance program end-to-end — from policies and risk assessments to staff training and breach response. Ensure our clinical AI platform meets the highest standards of patient data protection.',
    requirements: [
      'CHPC, CHPS, or equivalent healthcare compliance certification',
      'Experience building HIPAA compliance programs at health tech or digital health companies',
      'Deep knowledge of the HIPAA Privacy Rule, Security Rule, and Breach Notification Rule',
      'Familiarity with FDA SaMD regulatory requirements and their intersection with HIPAA',
      'Experience conducting security risk assessments and managing BAAs with vendors',
    ],
    compensation: 'Below-market salary + meaningful equity. Full market rate post-Series A.',
  },
];

const values = [
  { icon: Heart, title: 'Health Equity First', desc: 'Every algorithm is fairness-audited. We build for all patients, not just the ones who look like our training data.' },
  { icon: Shield, title: 'Radical Transparency', desc: 'We publish our limitations alongside our results. Trustworthy AI requires honesty about what we don\'t know.' },
  { icon: Zap, title: 'Zero-Hardware Philosophy', desc: 'Clinical AI should work with what hospitals already have — an EHR and a nurse. No new devices, no new workflows.' },
  { icon: Rocket, title: 'Research-Grade Rigor', desc: 'NIH-funded, peer-reviewed, externally validated. We hold ourselves to academic standards, not just industry benchmarks.' },
];

const priorityColor = (p: string) => {
  if (p === 'critical') return 'text-red-400 bg-red-500/10 border-red-500/20';
  if (p === 'high') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
};

const priorityLabel = (p: string) => {
  if (p === 'critical') return 'Hiring Now';
  if (p === 'high') return 'Coming Soon';
  return 'Post-Funding';
};

const Careers = () => {
  const { toast } = useToast();
  const [expandedRole, setExpandedRole] = useState<string | null>('cto');
  const [applying, setApplying] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: '', message: '' });

  const handleApply = async () => {
    if (!form.name || !form.email || !form.role) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    setApplying(true);
    try {
      const { error } = await supabase.from('contact_inquiries').insert({
        name: form.name,
        email: form.email,
        inquiry_type: 'career_application',
        message: JSON.stringify({ role: form.role, note: form.message }),
      });
      if (error) throw error;
      toast({ title: 'Application received!', description: 'We\'ll review your interest and reach out soon.' });
      setForm({ name: '', email: '', role: '', message: '' });
    } catch {
      toast({ title: 'Submission failed', description: 'Please email info@vitasignal.ai directly.', variant: 'destructive' });
    } finally {
      setApplying(false);
    }
  };

  return (
    <SiteLayout
      title="Careers | VitaSignal — Join the Team Building Equitable Clinical AI"
      description="Join VitaSignal's founding team. We're hiring a CTO/Co-Founder, Clinical Operations Lead, ML Engineer, and BD Lead to bring validated clinical AI to hospitals."
    >
      <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
        {/* Hero */}
        <section className="pt-28 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6">
                <Users className="w-4 h-4" /> We're Building a Team
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-['DM_Serif_Display']">
                Help Us Make Clinical AI <span className="text-cyan-400">Equitable</span>
              </h1>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                VitaSignal is transitioning from NIH-funded research to a commercial clinical AI platform. We're looking for mission-driven builders ready to join early.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="px-4 pb-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-white/10 bg-white/5 p-5">
                <v.icon className="w-6 h-6 text-cyan-400 mb-3" />
                <p className="text-sm font-semibold text-white mb-1">{v.title}</p>
                <p className="text-xs text-white/50">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Open Roles */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-xs font-semibold tracking-wider text-white/50 uppercase">Open Positions</h2>
            {roles.map(role => {
              const expanded = expandedRole === role.id;
              return (
                <motion.div key={role.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <button onClick={() => setExpandedRole(expanded ? null : role.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-white font-semibold text-sm">{role.title}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColor(role.priority)}`}>
                          {priorityLabel(role.priority)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{role.type}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{role.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{role.timing}</span>
                      </div>
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                  </button>
                  {expanded && (
                    <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                      <p className="text-sm text-white/60">{role.description}</p>
                      <div>
                        <p className="text-xs font-semibold text-white/70 mb-2">What We're Looking For</p>
                        <ul className="space-y-1.5">
                          {role.requirements.map(r => (
                            <li key={r} className="text-xs text-white/50 flex items-start gap-2">
                              <span className="text-cyan-400 mt-0.5">→</span> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
                        <p className="text-xs text-white/40"><span className="text-white/60 font-medium">Equity:</span> {role.equity}</p>
                        <p className="text-xs text-white/40 mt-1"><span className="text-white/60 font-medium">Compensation:</span> {role.compensation}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Application Form */}
        <section className="px-4 pb-20">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white font-['DM_Serif_Display']">Express Interest</h2>
                <p className="text-xs text-white/50 mt-1">No formal application required — tell us who you are and what excites you about this mission.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Name *</Label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name" className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Email *</Label>
                  <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Role of Interest *</Label>
                <Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  placeholder="e.g. CTO / Co-Founder, or propose your own role" className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Why VitaSignal?</Label>
                <Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="What draws you to this mission? Link to your LinkedIn, GitHub, or portfolio if you'd like."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]" />
              </div>
              <Button onClick={handleApply} disabled={applying} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                {applying ? 'Sending...' : 'Submit Interest'} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-[11px] text-white/30 text-center">We respond to every submission. Your information is kept confidential.</p>
            </motion.div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default Careers;
