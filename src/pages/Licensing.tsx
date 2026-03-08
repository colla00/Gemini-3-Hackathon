import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Building2, Briefcase, GraduationCap, CheckCircle2, Mail, FileText, Shield, CreditCard, Loader2, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";

const systemOptions = [
  { id: "idi", label: "Patent #1 IDI — ICU Mortality" },
  { id: "dbs", label: "Patent #5 DBS — Documentation Burden" },
  { id: "full", label: "Full Platform License" },
  { id: "research", label: "Research Only" },
];

function Licensing() {
  const [formData, setFormData] = useState({
    organization_name: "",
    contact_name: "",
    email: "",
    phone: "",
    organization_type: "",
    systems_of_interest: [] as string[],
    message: "",
    nda_agreed: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleSystemToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      systems_of_interest: prev.systems_of_interest.includes(id)
        ? prev.systems_of_interest.filter(s => s !== id)
        : [...prev.systems_of_interest, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organization_name || !formData.contact_name || !formData.email || !formData.organization_type) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-licensing-inquiry", {
        body: formData,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Inquiry submitted! We'll respond within 2 business days.");
    } catch (err: any) {
      toast.error(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePilotCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-pilot-checkout", {
        body: {
          email: formData.email || undefined,
          organization_name: formData.organization_name || undefined,
          contact_name: formData.contact_name || undefined,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not start checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const paymentStatus = searchParams.get("payment");

  return (
    <SiteLayout
      title="Licensing Portal | VitaSignal™ Clinical AI Systems"
      description="License VitaSignal's patent-pending clinical AI technology. EHR integration, hospital pilot programs, and research collaboration."
    >
      {/* Payment status banner */}
      {paymentStatus === "success" && (
        <div className="bg-emerald-600 text-white text-center py-3 text-sm font-medium">
          ✓ Payment received — our team will reach out within 24 hours to begin your pilot onboarding.
        </div>
      )}
      {paymentStatus === "canceled" && (
        <div className="bg-amber-600 text-white text-center py-3 text-sm font-medium">
          Payment was canceled. You can restart the process anytime.
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "#0f1729" }}>
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(15,23,41,0.85), rgba(15,23,41,0.95))" }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-24 md:pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border text-sm" style={{ borderColor: "rgba(0,200,180,0.3)", background: "rgba(0,200,180,0.1)" }}>
            <FileText className="w-3 h-3" style={{ color: "#00c8b4" }} />
            <span className="font-medium" style={{ color: "#00c8b4" }}>Licensing Portal</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-4 leading-[1.05] max-w-4xl text-white">
            VitaSignal™
            <br />
            <span style={{ color: "#00c8b4" }}>Licensing Portal</span>
          </h1>
          <p className="text-base font-semibold mb-4" style={{ color: "#00c8b4" }}>
            Clinical AI Systems — Equipment-Independent
          </p>
          <p className="text-lg md:text-xl max-w-2xl opacity-80 leading-relaxed text-gray-300">
            Three licensing tiers for EHR vendors, health systems, and research institutions.
            Validated on 357,000+ patients. 11 patent applications filed.
          </p>
        </div>
      </section>

      {/* Section 1 — Licensing Tiers */}
      <section className="py-20 px-6" style={{ background: "#f8f9fb" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#00c8b4" }}>Licensing Tiers</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Choose Your Tier</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Tier 1 — EHR Integration */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <Card className="h-full flex flex-col border-border">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,200,180,0.1)" }}>
                      <Briefcase className="w-6 h-6" style={{ color: "#00c8b4" }} />
                    </div>
                    <Badge variant="outline" className="text-[10px]">Enterprise</Badge>
                  </div>
                  <CardTitle className="text-xl">EHR Integration License</CardTitle>
                  <CardDescription>For EHR vendors embedding IDI/DBS into their platform</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-2xl font-bold text-foreground mb-1">Contact for pricing</p>
                  <p className="text-xs text-muted-foreground mb-6">Enterprise licensing terms</p>
                  <Button className="w-full gap-2 mt-auto" asChild>
                    <a href="mailto:info@vitasignal.ai?subject=EHR%20Integration%20License%20Inquiry">
                      <Mail className="w-4 h-4" />
                      Request License Terms
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tier 2 — Hospital Pilot */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5 }}>
              <Card className="h-full flex flex-col border-2" style={{ borderColor: "#00c8b4" }}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,200,180,0.15)" }}>
                      <Building2 className="w-6 h-6" style={{ color: "#00c8b4" }} />
                    </div>
                    <Badge style={{ background: "#00c8b4", color: "#0f1729" }} className="text-[10px] font-bold">Most Popular</Badge>
                  </div>
                  <CardTitle className="text-xl">Hospital System Pilot</CardTitle>
                  <CardDescription>6-month supervised pilot for health systems</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-2xl font-bold text-foreground mb-1">$15,000</p>
                  <p className="text-xs text-muted-foreground mb-6">One-time pilot fee · 6 months</p>
                  <Button
                    className="w-full gap-2 mt-auto"
                    style={{ background: "#00c8b4", color: "#0f1729" }}
                    onClick={handlePilotCheckout}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    Start Pilot Application
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tier 3 — Research */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}>
              <Card className="h-full flex flex-col border-border">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,200,180,0.1)" }}>
                      <GraduationCap className="w-6 h-6" style={{ color: "#00c8b4" }} />
                    </div>
                    <Badge variant="secondary" className="text-[10px]">Academic</Badge>
                  </div>
                  <CardTitle className="text-xl">Research Collaboration</CardTitle>
                  <CardDescription>Academic / research institutions</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-2xl font-bold text-foreground mb-1">MTA/DUA required</p>
                  <p className="text-xs text-muted-foreground mb-6">Material Transfer / Data Use Agreement</p>
                  <Button className="w-full gap-2 mt-auto" variant="outline" asChild>
                    <a href="mailto:info@vitasignal.ai?subject=Research%20Collaboration%20Inquiry">
                      <GraduationCap className="w-4 h-4" />
                      Submit Research Inquiry
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2 — Licensing Inquiry Form */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#00c8b4" }}>Inquiry Form</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Submit a Licensing Inquiry</h2>
            <p className="text-muted-foreground">Complete the form below and our licensing team will respond within 2 business days.</p>
          </div>

          {submitted ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: "#00c8b4" }} />
                <h3 className="text-xl font-bold mb-2">Inquiry Submitted</h3>
                <p className="text-muted-foreground">Thank you for your interest. We'll be in touch within 2 business days.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org">Organization Name *</Label>
                      <Input id="org" value={formData.organization_name} onChange={e => setFormData(p => ({ ...p, organization_name: e.target.value }))} required maxLength={200} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Name *</Label>
                      <Input id="contact" value={formData.contact_name} onChange={e => setFormData(p => ({ ...p, contact_name: e.target.value }))} required maxLength={100} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} required maxLength={255} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} maxLength={20} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Organization Type *</Label>
                    <Select value={formData.organization_type} onValueChange={v => setFormData(p => ({ ...p, organization_type: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hospital System">Hospital System</SelectItem>
                        <SelectItem value="EHR Vendor">EHR Vendor</SelectItem>
                        <SelectItem value="Research Institution">Research Institution</SelectItem>
                        <SelectItem value="Investor">Investor</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Which system interests you?</Label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {systemOptions.map(opt => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <Checkbox
                            id={opt.id}
                            checked={formData.systems_of_interest.includes(opt.id)}
                            onCheckedChange={() => handleSystemToggle(opt.id)}
                          />
                          <Label htmlFor={opt.id} className="text-sm font-normal cursor-pointer">{opt.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} maxLength={2000} rows={4} placeholder="Describe your use case, timeline, or questions..." />
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="nda"
                      checked={formData.nda_agreed}
                      onCheckedChange={(checked) => setFormData(p => ({ ...p, nda_agreed: checked === true }))}
                    />
                    <Label htmlFor="nda" className="text-sm font-normal cursor-pointer leading-relaxed">
                      I agree to review materials under NDA. I understand that VitaSignal™ technology details shared during the licensing process are confidential.
                    </Label>
                  </div>

                  <Button type="submit" className="w-full gap-2" style={{ background: "#0f1729" }} disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    Submit Licensing Inquiry
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Section 3 — What's Included */}
      <section className="py-16 px-6" style={{ background: "#0f1729" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">What's Included</h2>
            <p className="text-gray-400">Every licensing engagement includes the following resources.</p>
          </div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {[
                  { icon: FileText, text: "Full system documentation under NDA" },
                  { icon: Shield, text: "Validation datasets summary (N=357,080 patients)" },
                  { icon: Briefcase, text: "Integration specs and API documentation" },
                  { icon: CheckCircle2, text: "Regulatory overview (FDA §520(o)(1)(E) non-device CDS)" },
                  { icon: GraduationCap, text: "NIH grant context (Award 1OT2OD032581)" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#00c8b4" }} />
                    <span className="text-gray-200">{item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            VitaSignal™ systems are pre-market. Not FDA-cleared. Not a medical device. Patent-pending (11 U.S. provisional applications filed).
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Licensing;
