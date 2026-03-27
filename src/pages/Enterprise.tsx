import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Activity,
  BarChart3,
  Users,
  Handshake,
  Brain,
  Layers,
  HeartPulse,
  ArrowRight,
  ExternalLink,
  Mail,
  ChevronUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  NAV                                                                */
/* ------------------------------------------------------------------ */
const navLinks = [
  { label: "About", href: "#about" },
  { label: "Why It Matters", href: "#why" },
  { label: "Innovation", href: "#innovation" },
  { label: "Partnerships", href: "#partnerships" },
  { label: "Leadership", href: "#leadership" },
  { label: "Contact", href: "#contact" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[hsl(173,58%,29%)] flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[hsl(222,47%,11%)] text-lg tracking-tight">
            VitaSignal
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-slate-500 hover:text-[hsl(222,47%,11%)] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm font-medium px-5 py-2 rounded-lg bg-[hsl(173,58%,29%)] text-white hover:bg-[hsl(173,58%,24%)] transition-colors"
          >
            Request a Conversation
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-slate-600"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-slate-600 hover:text-[hsl(222,47%,11%)]"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-center px-5 py-2.5 rounded-lg bg-[hsl(173,58%,29%)] text-white"
          >
            Request a Conversation
          </a>
        </div>
      )}
    </nav>
  );
};

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */
const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
    {/* Subtle pattern */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, hsl(222 47% 11%) 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }}
    />
    <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[hsl(222,47%,11%)] leading-[1.12] mb-6 max-w-3xl mx-auto">
        Documentation-Native Intelligence for{" "}
        <span className="text-[hsl(173,58%,29%)]">Health System Leaders</span>
      </h1>
      <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
        VitaSignal extracts measurable clinical and operational signal from routine
        EHR documentation — risk reduction, burden visibility, equity monitoring,
        and governance-ready reporting for health systems and enterprise partners.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
        <a
          href="#contact"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[hsl(173,58%,29%)] text-white font-medium hover:bg-[hsl(173,58%,24%)] transition-colors shadow-sm"
        >
          Request a Conversation
          <ArrowRight className="w-4 h-4" />
        </a>
        <a
          href="#partnerships"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-slate-200 text-[hsl(222,47%,11%)] font-medium hover:bg-slate-50 transition-colors"
        >
          Explore Partnership Opportunities
        </a>
      </div>
      <p className="text-sm text-slate-400">
        Founded by{" "}
        <a href="#leadership" className="text-[hsl(173,58%,29%)] hover:underline">
          Dr. Alexis Collier
        </a>
      </p>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  ABOUT / POSITIONING                                                */
/* ------------------------------------------------------------------ */
const featureCards = [
  {
    icon: Brain,
    title: "Documentation-Native Signal",
    desc: "Extracts mortality risk, documentation burden, and shift-end patterns from EHR timestamps — signal that ambient scribes and generic copilots miss.",
  },
  {
    icon: BarChart3,
    title: "Operational Visibility",
    desc: "Quantifies care-team workload and documentation patterns to give CNOs and unit managers staffing evidence they can act on.",
  },
  {
    icon: Layers,
    title: "Standards-Based Integration",
    desc: "FHIR R4, SMART v2, HL7 — built to plug into your existing EHR stack without new hardware or workflow disruption.",
  },
  {
    icon: Shield,
    title: "Governance by Design",
    desc: "Auditability, subgroup fairness monitoring, human-in-the-loop controls, and committee-ready reporting built into every system.",
  },
];

const AboutSection = () => (
  <section id="about" className="py-20 md:py-28 bg-white">
    <div className="max-w-5xl mx-auto px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(173,58%,29%)] mb-3">
        About
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-[hsl(222,47%,11%)] mb-5 max-w-2xl">
        What VitaSignal Is Building
      </h2>
      <p className="text-base text-slate-500 leading-relaxed max-w-3xl mb-14">
        VitaSignal is a documentation-native intelligence company. We extract
        clinical and operational signal from the EHR data hospitals already
        generate — nursing documentation timestamps, shift-end patterns, and
        documentation burden metrics. Three independently validated systems.
        11 patent applications. Zero new hardware required.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        {featureCards.map((f) => (
          <div
            key={f.title}
            className="group p-6 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-[hsl(173,58%,29%)/20] hover:shadow-sm transition-all"
          >
            <f.icon className="w-5 h-5 text-[hsl(173,58%,29%)] mb-3" />
            <h3 className="font-semibold text-[hsl(222,47%,11%)] mb-1.5">{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  WHY IT MATTERS                                                     */
/* ------------------------------------------------------------------ */
const valuePillars = [
  {
    icon: HeartPulse,
    title: "Safer Decision Support",
    desc: "Clinically grounded intelligence that augments — never replaces — human judgment at the point of care.",
  },
  {
    icon: Activity,
    title: "Earlier Risk Visibility",
    desc: "Detecting subtle deterioration signals from existing documentation patterns before traditional early-warning systems.",
  },
  {
    icon: Layers,
    title: "Enterprise-Aligned Integration",
    desc: "Designed around the realities of hospital IT — existing workflows, data governance, security requirements, and interoperability standards.",
  },
];

const WhySection = () => (
  <section id="why" className="py-20 md:py-28 bg-slate-50/60">
    <div className="max-w-5xl mx-auto px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(173,58%,29%)] mb-3">
        Why It Matters
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-[hsl(222,47%,11%)] mb-5 max-w-2xl">
        Built for Real Healthcare Environments
      </h2>
      <p className="text-base text-slate-500 leading-relaxed max-w-3xl mb-14">
        Healthcare organizations need solutions that fit existing workflows,
        support safer decision-making, and align with data stewardship, security,
        interoperability, and implementation realities — not theoretical demos or
        disconnected proofs of concept.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {valuePillars.map((v) => (
          <div key={v.title} className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-[hsl(173,58%,29%)/8] flex items-center justify-center mb-4">
              <v.icon className="w-5 h-5 text-[hsl(173,58%,29%)]" />
            </div>
            <h3 className="font-semibold text-[hsl(222,47%,11%)] mb-2">{v.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  INNOVATION / PATENT                                                */
/* ------------------------------------------------------------------ */
const InnovationSection = () => (
  <section id="innovation" className="py-20 md:py-28 bg-white">
    <div className="max-w-5xl mx-auto px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(173,58%,29%)] mb-3">
        Strategic Assets
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-[hsl(222,47%,11%)] mb-5 max-w-2xl">
        Built Around Defensible Innovation
      </h2>
      <p className="text-base text-slate-500 leading-relaxed max-w-3xl mb-6">
        VitaSignal is being shaped around a growing portfolio of patent-pending
        healthcare innovations designed to support strategic commercialization,
        enterprise deployment, and long-term platform value. The company's focus
        includes clinically relevant intelligence, workflow-integrated decision
        support, and scalable healthcare data applications.
      </p>
      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 max-w-xl">
        <p className="text-sm text-slate-500 leading-relaxed">
          <span className="font-medium text-[hsl(222,47%,11%)]">11 U.S. patent applications filed.</span>{" "}
          Detailed technical and IP materials are available in appropriate
          business discussions under mutual NDA.
        </p>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  PARTNERSHIPS                                                       */
/* ------------------------------------------------------------------ */
const collaborationTypes = [
  "Strategic partnerships",
  "Licensing discussions",
  "Pilot exploration",
  "Interoperability planning",
  "Enterprise collaboration",
];

const audienceTypes = [
  "Health systems",
  "Enterprise healthcare technology companies",
  "Strategic collaborators",
  "Licensing partners",
  "Interoperability and platform partners",
];

const ehrPartners = [
  {
    name: "Oracle Health (Cerner)",
    status: "Sandbox Integrated",
    statusColor: "bg-emerald-100 text-emerald-700",
    desc: "FHIR R4 system integration via SMART v2 (sandbox/development). Confidential OAuth2 client_credentials flow with offline access. Production deployment pending BAA execution and tenant configuration.",
    capabilities: ["FHIR R4", "SMART v2", "System OAuth2", "Sandbox"],
  },
  {
    name: "Epic",
    status: "Design Ready",
    statusColor: "bg-blue-100 text-blue-700",
    desc: "SMART on FHIR R4 architecture validated. Licensees obtain their own client_id via open.epic.com for production deployment.",
    capabilities: ["FHIR R4", "SMART App Launch", "PKCE"],
  },
  {
    name: "MEDITECH",
    status: "Planned",
    statusColor: "bg-slate-100 text-slate-500",
    desc: "FHIR R4 interoperability roadmap aligned with MEDITECH Expanse platform capabilities.",
    capabilities: ["FHIR R4"],
  },
];

const PartnershipsSection = () => (
  <section id="partnerships" className="py-20 md:py-28 bg-slate-50/60">
    <div className="max-w-5xl mx-auto px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(173,58%,29%)] mb-3">
        Collaborate
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-[hsl(222,47%,11%)] mb-5 max-w-2xl">
        Partnerships, Licensing &amp; Strategic Collaboration
      </h2>
      <p className="text-base text-slate-500 leading-relaxed max-w-3xl mb-12">
        VitaSignal is open to conversations with organizations interested in
        building the future of clinical intelligence together.
      </p>

      {/* EHR Interoperability Partners */}
      <div className="mb-14">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-5">
          EHR Interoperability
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ehrPartners.map((p) => (
            <div
              key={p.name}
              className="group p-5 rounded-xl border border-slate-100 bg-white hover:border-[hsl(173,58%,29%)/20] hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[hsl(222,47%,11%)] text-sm">{p.name}</h4>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${p.statusColor}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.capabilities.map((c) => (
                  <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-500 font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-4">
            We're open to conversations with
          </h3>
          <ul className="space-y-3">
            {audienceTypes.map((a) => (
              <li key={a} className="flex items-start gap-2.5 text-sm text-slate-600">
                <Handshake className="w-4 h-4 mt-0.5 text-[hsl(173,58%,29%)] shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-4">
            Collaboration types
          </h3>
          <ul className="space-y-3">
            {collaborationTypes.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-sm text-slate-600">
                <ArrowRight className="w-4 h-4 mt-0.5 text-[hsl(173,58%,29%)] shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  LEADERSHIP                                                         */
/* ------------------------------------------------------------------ */
const LeadershipSection = () => (
  <section id="leadership" className="py-20 md:py-28 bg-white">
    <div className="max-w-5xl mx-auto px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(173,58%,29%)] mb-3">
        Leadership
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-[hsl(222,47%,11%)] mb-10">
        Founded with Purpose
      </h2>
      <div className="max-w-3xl">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-[hsl(173,58%,29%)]" />
          </div>
          <div>
            <h3 className="font-bold text-[hsl(222,47%,11%)] text-lg">Dr. Alexis Collier</h3>
            <p className="text-sm text-slate-400 mb-3">Founder &amp; CEO</p>
          </div>
        </div>
        <p className="text-base text-slate-500 leading-relaxed mb-6">
          Dr. Alexis Collier is a clinical AI researcher, healthcare informatics
          leader, and founder of VitaSignal. Her work sits at the intersection of
          clinical decision support, nursing informatics, health equity,
          cybersecurity, and healthcare innovation. She has contributed to
          research, scholarship, and innovation efforts focused on safer, more
          transparent, and more effective healthcare systems.
        </p>
        <a
          href="https://alexiscollier.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(173,58%,29%)] hover:underline"
        >
          Visit alexiscollier.com
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  CONTACT FORM                                                       */
/* ------------------------------------------------------------------ */
const inquiryTypes = [
  "Partnership Inquiry",
  "Licensing Discussion",
  "Interoperability Planning",
  "Pilot Exploration",
  "Strategic Collaboration",
  "General Inquiry",
];

const ContactSection = () => {
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string).trim();
    const organization = (fd.get("organization") as string).trim();
    const email = (fd.get("email") as string).trim();
    const inquiryType = (fd.get("inquiry_type") as string).trim();
    const message = (fd.get("message") as string).trim();

    if (!name || !email || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSending(true);
    const { error } = await supabase.from("contact_inquiries").insert({
      name,
      organization,
      email,
      inquiry_type: inquiryType || "General Inquiry",
      message,
    });
    setSending(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Thank you — we'll be in touch shortly.");
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-slate-50/60">
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(173,58%,29%)] mb-3 text-center">
            Get in Touch
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[hsl(222,47%,11%)] mb-3 text-center">
            Start the Conversation
          </h2>
          <p className="text-sm text-slate-500 text-center mb-10 leading-relaxed">
            For partnership, licensing, interoperability, or strategic
            collaboration inquiries, reach out below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="ent-name" className="text-slate-600">Name *</Label>
                <Input id="ent-name" name="name" required className="mt-1.5 bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="ent-org" className="text-slate-600">Organization</Label>
                <Input id="ent-org" name="organization" className="mt-1.5 bg-white border-slate-200" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="ent-email" className="text-slate-600">Email *</Label>
                <Input id="ent-email" name="email" type="email" required className="mt-1.5 bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="ent-type" className="text-slate-600">Inquiry Type</Label>
                <select
                  id="ent-type"
                  name="inquiry_type"
                  className="mt-1.5 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-[hsl(222,47%,11%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(173,58%,29%)] focus-visible:ring-offset-2"
                >
                  {inquiryTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="ent-msg" className="text-slate-600">Message *</Label>
              <Textarea
                id="ent-msg"
                name="message"
                required
                rows={5}
                className="mt-1.5 bg-white border-slate-200 resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={sending}
              className="w-full bg-[hsl(173,58%,29%)] hover:bg-[hsl(173,58%,24%)] text-white h-12"
            >
              {sending ? "Sending…" : "Send Inquiry"}
            </Button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            Prefer email?{" "}
            <a href="mailto:info@vitasignal.ai" className="text-[hsl(173,58%,29%)] hover:underline">
              info@vitasignal.ai
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  FOOTER                                                             */
/* ------------------------------------------------------------------ */
const Footer = () => (
  <footer className="bg-[hsl(222,47%,11%)] text-slate-400 py-12">
    <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <p className="text-white font-semibold text-lg mb-1">VitaSignal</p>
        <p className="text-sm">Healthcare innovation for safer systems.</p>
      </div>
      <div className="flex flex-wrap items-center gap-6 text-sm">
        {navLinks.map((l) => (
          <a key={l.href} href={l.href} className="hover:text-white transition-colors">
            {l.label}
          </a>
        ))}
        <a
          href="https://alexiscollier.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          alexiscollier.com
        </a>
      </div>
    </div>
    <div className="max-w-5xl mx-auto px-6 mt-8 pt-6 border-t border-slate-700/50">
      <p className="text-xs text-slate-500">
        © {new Date().getFullYear()} VitaSignal. Pre-market research prototype — not FDA cleared or approved.
        Not a medical device. All data shown is simulated.
      </p>
    </div>
  </footer>
);

/* ------------------------------------------------------------------ */
/*  BACK TO TOP                                                        */
/* ------------------------------------------------------------------ */
const BackToTop = () => (
  <a
    href="#"
    className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-[hsl(173,58%,29%)] text-white flex items-center justify-center shadow-lg hover:bg-[hsl(173,58%,24%)] transition-colors"
    aria-label="Back to top"
  >
    <ChevronUp className="w-5 h-5" />
  </a>
);

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
const Enterprise = () => (
  <>
    <Helmet>
      <title>VitaSignal — Clinical Intelligence for Safer, Smarter Healthcare</title>
      <meta
        name="description"
        content="VitaSignal is being developed to translate patented healthcare innovations into interoperable decision-support, risk stratification, and analytics solutions for health systems."
      />
    </Helmet>
    <div className="min-h-screen bg-white text-[hsl(222,47%,11%)]" style={{ scrollBehavior: "smooth" }}>
      <Nav />
      <Hero />
      <AboutSection />
      <WhySection />
      <InnovationSection />
      <PartnershipsSection />
      <LeadershipSection />
      <ContactSection />
      <Footer />
      <BackToTop />
    </div>
  </>
);

export default Enterprise;
