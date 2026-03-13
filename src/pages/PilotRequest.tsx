import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Building2, Server, Users, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SiteLayout } from '@/components/layout/SiteLayout';

const steps = [
  { icon: Building2, title: 'Organization', desc: 'Tell us about your facility' },
  { icon: Server, title: 'Technical', desc: 'Your EHR and infrastructure' },
  { icon: Users, title: 'Needs', desc: 'Pain points and goals' },
  { icon: CheckCircle2, title: 'Submit', desc: 'Review and request' },
];

const PilotRequest = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    orgName: '', contactName: '', email: '', phone: '', title: '',
    facilityType: '', bedCount: '', icuBeds: '', state: '',
    ehrSystem: '', ehrVersion: '', hasFHIR: '', hasHL7: '', itTeamSize: '',
    primaryPain: '', secondaryPain: '', currentTools: '', timeline: '', budget: '',
    message: '', ndaAgreed: false,
  });

  const update = (field: string, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.orgName || !form.contactName || !form.email || !form.ndaAgreed) {
      toast({ title: 'Required fields missing', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_inquiries').insert({
        name: form.contactName,
        email: form.email,
        organization: form.orgName,
        role: form.title,
        inquiry_type: 'pilot_request',
        message: JSON.stringify({
          phone: form.phone, facilityType: form.facilityType, bedCount: form.bedCount,
          icuBeds: form.icuBeds, state: form.state, ehrSystem: form.ehrSystem,
          ehrVersion: form.ehrVersion, hasFHIR: form.hasFHIR, hasHL7: form.hasHL7,
          itTeamSize: form.itTeamSize, primaryPain: form.primaryPain,
          secondaryPain: form.secondaryPain, currentTools: form.currentTools,
          timeline: form.timeline, budget: form.budget, additionalNotes: form.message,
        }),
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: 'Pilot request submitted!', description: 'Our team will reach out within 2 business days.' });
    } catch {
      toast({ title: 'Submission failed', description: 'Please try again or email info@vitasignal.ai', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SiteLayout title="Pilot Request Submitted | VitaSignal">
        <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)] flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 font-['DM_Serif_Display']">Request Received</h1>
            <p className="text-white/60 mb-2">Thank you, {form.contactName}. We've received your pilot request for <strong className="text-white">{form.orgName}</strong>.</p>
            <p className="text-white/50 text-sm mb-6">Our clinical team will prepare a tailored assessment and reach out within 2 business days.</p>
            <div className="flex gap-3 justify-center">
              <Button asChild variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="/dashboard">Explore the Platform</a>
              </Button>
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <a href="/roi-calculator">Calculate Your ROI</a>
              </Button>
            </div>
          </motion.div>
        </main>
      </SiteLayout>
    );
  }

  const inputClass = "bg-white/5 border-white/10 text-white placeholder:text-white/30";

  return (
    <SiteLayout
      title="Request a Pilot | VitaSignal — Start Your Clinical AI Assessment"
      description="Apply for a VitaSignal pilot program. We'll assess your hospital's needs and provide a tailored implementation plan with projected ROI."
    >
      <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
        <section className="pt-28 pb-8 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-medium mb-6">
                <Rocket className="w-4 h-4" /> Pilot Program Application
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 font-['DM_Serif_Display']">
                Start Your <span className="text-purple-400">Clinical AI Pilot</span>
              </h1>
              <p className="text-white/60 max-w-xl mx-auto">
                Tell us about your facility and we'll prepare a tailored assessment with projected impact, implementation timeline, and resource requirements.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Step indicators */}
        <section className="px-4 pb-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => (
                <button key={i} onClick={() => setCurrentStep(i)}
                  className={`flex flex-col items-center gap-1 transition-all ${i <= currentStep ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    i === currentStep ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : i < currentStep ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'border-white/20 text-white/40'
                  }`}>
                    {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] text-white/50 hidden sm:block">{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Form Steps */}
        <section className="px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 space-y-6">

              {currentStep === 0 && (
                <>
                  <h2 className="text-lg font-semibold text-white">Organization Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Organization Name *</Label>
                      <Input value={form.orgName} onChange={e => update('orgName', e.target.value)} placeholder="e.g. Memorial Health System" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Your Name *</Label>
                      <Input value={form.contactName} onChange={e => update('contactName', e.target.value)} placeholder="Full name" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Email *</Label>
                      <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@hospital.org" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Title / Role</Label>
                      <Input value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. VP of Clinical Informatics" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Facility Type</Label>
                      <Select value={form.facilityType} onValueChange={v => update('facilityType', v)}>
                        <SelectTrigger className={inputClass}><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="community">Community Hospital</SelectItem>
                          <SelectItem value="academic">Academic Medical Center</SelectItem>
                          <SelectItem value="safety_net">Safety-Net Hospital</SelectItem>
                          <SelectItem value="va">VA / Military</SelectItem>
                          <SelectItem value="health_system">Multi-Hospital System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Total Beds</Label>
                      <Input type="number" value={form.bedCount} onChange={e => update('bedCount', e.target.value)} placeholder="e.g. 350" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">ICU Beds</Label>
                      <Input type="number" value={form.icuBeds} onChange={e => update('icuBeds', e.target.value)} placeholder="e.g. 48" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">State</Label>
                      <Input value={form.state} onChange={e => update('state', e.target.value)} placeholder="e.g. Georgia" className={inputClass} />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <h2 className="text-lg font-semibold text-white">Technical Environment</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">EHR System</Label>
                      <Select value={form.ehrSystem} onValueChange={v => update('ehrSystem', v)}>
                        <SelectTrigger className={inputClass}><SelectValue placeholder="Select EHR" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="epic">Epic</SelectItem>
                          <SelectItem value="cerner">Oracle Cerner</SelectItem>
                          <SelectItem value="meditech">MEDITECH</SelectItem>
                          <SelectItem value="allscripts">Allscripts</SelectItem>
                          <SelectItem value="athena">athenahealth</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">EHR Version (if known)</Label>
                      <Input value={form.ehrVersion} onChange={e => update('ehrVersion', e.target.value)} placeholder="e.g. Epic 2024" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">FHIR API Available?</Label>
                      <Select value={form.hasFHIR} onValueChange={v => update('hasFHIR', v)}>
                        <SelectTrigger className={inputClass}><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes — Active</SelectItem>
                          <SelectItem value="planned">Planned / In Progress</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="unknown">Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">IT Team Size</Label>
                      <Select value={form.itTeamSize} onValueChange={v => update('itTeamSize', v)}>
                        <SelectTrigger className={inputClass}><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">1-10</SelectItem>
                          <SelectItem value="medium">11-50</SelectItem>
                          <SelectItem value="large">51-200</SelectItem>
                          <SelectItem value="enterprise">200+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h2 className="text-lg font-semibold text-white">Your Needs & Goals</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Primary Challenge</Label>
                      <Select value={form.primaryPain} onValueChange={v => update('primaryPain', v)}>
                        <SelectTrigger className={inputClass}><SelectValue placeholder="Biggest pain point" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mortality">ICU Mortality / Early Warning</SelectItem>
                          <SelectItem value="hai">HAI Prevention</SelectItem>
                          <SelectItem value="nursing">Nurse Burnout / Staffing</SelectItem>
                          <SelectItem value="equity">Health Equity / CMS Compliance</SelectItem>
                          <SelectItem value="readmissions">Readmission Reduction</SelectItem>
                          <SelectItem value="sepsis">Sepsis Detection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Target Timeline</Label>
                      <Select value={form.timeline} onValueChange={v => update('timeline', v)}>
                        <SelectTrigger className={inputClass}><SelectValue placeholder="When to start" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediately (within 30 days)</SelectItem>
                          <SelectItem value="q2_2026">Q2 2026</SelectItem>
                          <SelectItem value="q3_2026">Q3 2026</SelectItem>
                          <SelectItem value="q4_2026">Q4 2026</SelectItem>
                          <SelectItem value="exploring">Just Exploring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">Current Tools / Systems in This Area</Label>
                    <Input value={form.currentTools} onChange={e => update('currentTools', e.target.value)} placeholder="e.g. Epic Sepsis Model, manual MEWS scoring" className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">Additional Notes</Label>
                    <Textarea value={form.message} onChange={e => update('message', e.target.value)} placeholder="Any specific goals, constraints, or questions..."
                      className={`${inputClass} min-h-[100px]`} />
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <h2 className="text-lg font-semibold text-white">Review & Submit</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {[
                      ['Organization', form.orgName], ['Contact', form.contactName], ['Email', form.email],
                      ['Facility Type', form.facilityType], ['Total Beds', form.bedCount], ['ICU Beds', form.icuBeds],
                      ['EHR System', form.ehrSystem], ['FHIR Available', form.hasFHIR],
                      ['Primary Challenge', form.primaryPain], ['Timeline', form.timeline],
                    ].filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-white/50">{k}</span>
                        <span className="text-white font-medium capitalize">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-start gap-3 mt-4">
                    <Checkbox checked={form.ndaAgreed} onCheckedChange={v => update('ndaAgreed', !!v)} id="nda" />
                    <label htmlFor="nda" className="text-xs text-white/60 cursor-pointer">
                      I understand this is a research prototype assessment and agree to keep shared information confidential. VitaSignal is not FDA cleared or approved.
                    </label>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <Button variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">Back</Button>
                {currentStep < 3 ? (
                  <Button onClick={() => setCurrentStep(currentStep + 1)} className="bg-purple-500 hover:bg-purple-600 text-white">
                    Continue <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting || !form.ndaAgreed} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    {submitting ? 'Submitting...' : 'Submit Pilot Request'} <Rocket className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </motion.div>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-white/30">
              <Shield className="w-3 h-3" /> Your information is encrypted and never shared without consent.
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default PilotRequest;
