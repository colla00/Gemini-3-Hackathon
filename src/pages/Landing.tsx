import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Brain,
  BarChart3,
  Network,
  Heart,
  ShieldCheck,
  Eye,
  Plug,
  Lock,
  Handshake,
  FileText,
  Search,
  Building2,
  ArrowRight,
  ExternalLink,
  Mail,
  Send,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* ─── JSON-LD ─── */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VitaSignal",
  url: "https://vitasignal.ai",
  description:
    "Clinical intelligence platform translating patented healthcare innovations into interoperable decision-support, risk stratification, workflow intelligence, and analytics solutions.",
  founder: { "@type": "Person", name: "Dr. Alexis Collier", jobTitle: "Founder & CEO" },
};

/* ─── Feature cards ─── */
const features = [
  {
    icon: Brain,
    title: "Clinical Intelligence",
    desc: "Translating clinical data patterns into actionable insight that supports safer, more informed decision-making at the point of care.",
  },
  {
    icon: BarChart3,
    title: "Workflow-Aware Analytics",
    desc: "Surfacing operational and clinical visibility across care workflows to help teams anticipate needs and allocate resources more effectively.",
  },
  {
    icon: Network,
    title: "Interoperability-Ready Design",
    desc: "Architected to integrate with existing health IT infrastructure, supporting standards-based data exchange and enterprise deployment.",
  },
  {
    icon: Heart,
    title: "Responsible, Human-Centered AI",
    desc: "Designed with fairness, transparency, and clinical stewardship at the core — supporting equitable outcomes across diverse patient populations.",
  },
];

/* ─── Value pillars ─── */
const values = [
  {
    icon: ShieldCheck,
    title: "Safer Decision Support",
    desc: "Solutions designed to augment clinical judgment with timely, context-aware intelligence — not replace it.",
  },
  {
    icon: Eye,
    title: "Earlier Risk Visibility",
    desc: "Helping organizations detect deterioration signals and operational risks before they escalate into adverse events.",
  },
  {
    icon: Plug,
    title: "Enterprise-Aligned Integration",
    desc: "Built for real-world deployment within existing EHR ecosystems, security frameworks, and governance structures.",
  },
];

/* ─── Collaboration types ─── */
const collabTypes = [
  { icon: Handshake, label: "Strategic Partnerships" },
  { icon: FileText, label: "Licensing Discussions" },
  { icon: Search, label: "Pilot Exploration" },
  { icon: Network, label: "Interoperability Planning" },
  { icon: Building2, label: "Enterprise Collaboration" },
];

/* ─── Inquiry types ─── */
const inquiryTypes = [
  "Partnership Inquiry",
  "Licensing Discussion",
  "Pilot Exploration",
  "Interoperability Planning",
  "General Inquiry",
];

/* ─── Contact Form ─── */
const ContactForm = () => {
  const [form, setForm] = useState({ name: "", organization: "", email: "", inquiryType: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_inquiries").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        organization: form.organization.trim() || null,
        inquiry_type: form.inquiryType || "general",
        message: form.message.trim(),
      });
      if (error) throw error;
      toast.success("Thank you — we'll be in touch soon.");
      setForm({ name: "", organization: "", email: "", inquiryType: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="cf-name">Name *</Label>
        <Input id="cf-name" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cf-org">Organization</Label>
        <Input id="cf-org" maxLength={150} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Company or institution" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cf-email">Email *</Label>
        <Input id="cf-email" type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@organization.com" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cf-type">Inquiry Type</Label>
        <select
          id="cf-type"
          value={form.inquiryType}
          onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Select…</option>
          {inquiryTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2 space-y-1.5">
        <Label htmlFor="cf-msg">Message *</Label>
        <Textarea id="cf-msg" required maxLength={2000} rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={loading} className="gap-2">
          <Send className="w-4 h-4" />
          {loading ? "Sending…" : "Send Message"}
        </Button>
      </div>
    </form>
  );
};

/* ─── Section wrapper ─── */
const Section = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`py-20 md:py-28 px-6 ${className}`}>
    <div className="max-w-5xl mx-auto">{children}</div>
  </section>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3">{children}</h2>
);

const Divider = () => <div className="w-12 h-0.5 bg-primary rounded-full mb-8" />;

/* ─── NAV ANCHORS for smooth scroll ─── */
const anchors = [
  { href: "#about", label: "About" },
  { href: "#why", label: "Why It Matters" },
  { href: "#innovation", label: "Innovation" },
  { href: "#partnerships", label: "Partnerships" },
  { href: "#leadership", label: "Leadership" },
  { href: "#contact", label: "Contact" },
];

/* ─────────────────── PAGE ─────────────────── */
export const Landing = () => {
  return (
    <SiteLayout
      title="VitaSignal | Clinical Intelligence for Safer, Smarter Healthcare"
      description="VitaSignal is being developed to translate patented healthcare innovations into interoperable decision-support, risk stratification, workflow intelligence, and analytics solutions for health systems and enterprise partners."
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      </Helmet>

      {/* Sticky section nav */}
      <nav aria-label="Page sections" className="sticky top-[57px] z-40 bg-card/90 backdrop-blur border-b border-border/30 hidden md:block">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-6 py-2">
          {anchors.map((a) => (
            <a key={a.href} href={a.href} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
              {a.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── 1. HERO ── */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        {/* Subtle radial overlay */}
        <div className="absolute inset-0 opacity-40" aria-hidden="true" style={{
          backgroundImage: `radial-gradient(ellipse at 30% 20%, hsl(173 58% 29% / 0.15) 0%, transparent 60%),
                           radial-gradient(ellipse at 80% 80%, hsl(217 91% 35% / 0.10) 0%, transparent 50%)`,
        }} />
        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-36">
          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-6">Healthcare Innovation · Clinical Intelligence</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.08] mb-6 max-w-3xl">
            Clinical Intelligence for Safer,{" "}
            <span className="text-primary">Smarter Healthcare</span>
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/70 max-w-2xl mb-4 leading-relaxed">
            VitaSignal is being developed to translate patented healthcare innovations into interoperable
            decision-support, risk stratification, workflow intelligence, and analytics solutions for
            health systems and enterprise partners.
          </p>
          <p className="text-sm text-primary-foreground/40 mb-10">Founded by Dr. Alexis Collier</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="text-base px-7 h-12 shadow-lg gap-2" asChild>
              <a href="#contact">
                Request a Conversation
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-7 h-12 border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10"
              asChild
            >
              <a href="#partnerships">Explore Partnership Opportunities</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 2. ABOUT / POSITIONING ── */}
      <Section id="about">
        <SectionTitle>What VitaSignal Is Building</SectionTitle>
        <Divider />
        <p className="text-muted-foreground leading-relaxed max-w-3xl mb-14">
          VitaSignal is a healthcare innovation company focused on developing clinically informed,
          interoperable solutions that help organizations surface risk earlier, support safer decisions,
          and improve visibility across care and operational workflows. The company is being shaped
          around a growing portfolio of patent-pending innovations spanning clinical decision support,
          healthcare intelligence, workflow optimization, and equitable AI-enabled care.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
              <f.icon className="w-6 h-6 text-primary mb-4" aria-hidden="true" />
              <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 3. WHY IT MATTERS ── */}
      <Section id="why" className="bg-muted/50">
        <SectionTitle>Built for Real Healthcare Environments</SectionTitle>
        <Divider />
        <p className="text-muted-foreground leading-relaxed max-w-3xl mb-14">
          Healthcare organizations need solutions that fit existing workflows, support safer
          decision-making, and align with the realities of data stewardship, security,
          interoperability, and implementation at scale.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v) => (
            <div key={v.title} className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <v.icon className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 4. PATENT / STRATEGIC ASSET ── */}
      <Section id="innovation">
        <SectionTitle>Built Around Defensible Innovation</SectionTitle>
        <Divider />
        <div className="max-w-3xl">
          <p className="text-muted-foreground leading-relaxed mb-6">
            VitaSignal is being shaped around a growing portfolio of patent-pending healthcare
            innovations designed to support strategic commercialization, enterprise deployment, and
            long-term platform value. The company's focus includes clinically relevant intelligence,
            workflow-integrated decision support, and scalable healthcare data applications.
          </p>
          <div className="flex items-start gap-3 p-5 rounded-xl bg-card border border-border/50">
            <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Detailed materials regarding the patent portfolio, strategic roadmap, and technical
              architecture are available to share in the context of appropriate business discussions
              under mutual non-disclosure.
            </p>
          </div>
        </div>
      </Section>

      {/* ── 5. PARTNERSHIPS / LICENSING ── */}
      <Section id="partnerships" className="bg-muted/50">
        <SectionTitle>Partnerships, Licensing &amp; Strategic Collaboration</SectionTitle>
        <Divider />
        <p className="text-muted-foreground leading-relaxed max-w-3xl mb-10">
          VitaSignal is open to conversations with health systems, enterprise healthcare technology
          companies, strategic collaborators, licensing partners, and interoperability and platform
          partners who share a commitment to safer, more effective healthcare.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {collabTypes.map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-3 p-5 rounded-xl bg-card border border-border/50 text-center">
              <c.icon className="w-5 h-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">{c.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 6. FOUNDER ── */}
      <Section id="leadership">
        <SectionTitle>Leadership</SectionTitle>
        <Divider />
        <div className="max-w-3xl">
          <h3 className="text-lg font-semibold text-foreground mb-1">Dr. Alexis Collier</h3>
          <p className="text-sm text-primary font-medium mb-4">Founder &amp; CEO</p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Dr. Alexis Collier is a clinical AI researcher, healthcare informatics leader, and founder
            of VitaSignal. Her work sits at the intersection of clinical decision support, nursing
            informatics, health equity, cybersecurity, and healthcare innovation. She has contributed
            to research, scholarship, and innovation efforts focused on safer, more transparent, and
            more effective healthcare systems.
          </p>
          <a
            href="https://alexiscollier.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Visit alexiscollier.com
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </Section>

      {/* ── 7. CONTACT ── */}
      <Section id="contact" className="bg-muted/50">
        <SectionTitle>Start the Conversation</SectionTitle>
        <Divider />
        <p className="text-muted-foreground leading-relaxed max-w-2xl mb-10">
          For partnership, licensing, interoperability, or strategic collaboration inquiries,
          reach out below.
        </p>
        <div className="max-w-2xl">
          <ContactForm />
          <div className="flex items-center gap-2 mt-8 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 text-primary" />
            <span>
              Prefer email?{" "}
              <a href="mailto:info@alexiscollier.com" className="text-primary font-medium hover:underline">
                info@alexiscollier.com
              </a>
            </span>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
};
