import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Briefcase, Globe, CheckCircle2, Mail, FileText, Shield, Users, Heart, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const tracks = [
  {
    id: "ehr",
    icon: Briefcase,
    title: "EHR Vendors",
    subtitle: "Embed VitaSignal™ into your platform",
    badge: "Exclusive Available",
    badgeVariant: "default" as const,
    description: "Integrate equipment-independent clinical AI directly into your EHR platform, giving your customers validated mortality prediction and workload optimization without additional hardware.",
    idealFor: "Epic, Cerner, Meditech, Allscripts, and other EHR system providers seeking competitive differentiation.",
    includes: [
      "Exclusive or non-exclusive license within EHR field of use",
      "Full patent license (5 provisional applications, 175+ claims)",
      "Algorithm specifications and integration documentation",
      "Technical transfer and co-development support",
      "Rights to sublicense to your customers (negotiable)",
      "Priority access to new patent filings and improvements",
    ],
    cta: "Discuss EHR Integration",
    email: "info@alexiscollier.com?subject=EHR%20Vendor%20Licensing%20-%20VitaSignal",
  },
  {
    id: "hospital",
    icon: Building2,
    title: "Hospital Systems",
    subtitle: "Deploy VitaSignal™ in your facilities",
    badge: "Non-Exclusive",
    badgeVariant: "secondary" as const,
    description: "Bring validated clinical AI to your nursing units. Predict mortality risk and documentation burden using the EHR data your nurses already generate — zero hardware, zero installation.",
    idealFor: "Academic medical centers, regional health systems, and hospital networks with 50+ ICU beds.",
    includes: [
      "Non-exclusive license for organizational deployment",
      "Core algorithms and implementation documentation",
      "Technical support during deployment (90 days)",
      "Clinical validation protocol support",
      "Quarterly updates and model improvements",
      "Access to Dr. Collier for technical consultation",
    ],
    cta: "Request Hospital Demo",
    email: "info@alexiscollier.com?subject=Hospital%20System%20Licensing%20-%20VitaSignal",
  },
  {
    id: "global",
    icon: Globe,
    title: "Global Health & Humanitarian",
    subtitle: "Clinical AI for resource-limited settings",
    badge: "Impact License",
    badgeVariant: "outline" as const,
    description: "Most clinical AI excludes the hospitals that need it most. VitaSignal™'s zero-hardware architecture makes validated mortality prediction accessible to any facility with basic EHR capability — anywhere in the world.",
    idealFor: "NGOs, ministries of health, WHO/UNICEF programs, and global health organizations operating in low- and middle-income countries.",
    includes: [
      "Humanitarian pricing or grant-funded deployment",
      "Simplified licensing for non-commercial use",
      "Cloud-based or on-premise deployment options",
      "Multi-language implementation support",
      "Co-publication rights on validation studies",
      "Research collaboration for local clinical validation",
    ],
    cta: "Explore Impact Licensing",
    email: "info@alexiscollier.com?subject=Global%20Health%20Licensing%20-%20VitaSignal",
  },
];

const processSteps = [
  { step: 1, title: "Initial Inquiry & NDA", desc: "Contact us with your organization details and intended use case. We'll execute a mutual Non-Disclosure Agreement to enable detailed technical discussions." },
  { step: 2, title: "Technical Due Diligence", desc: "Review technical documentation, patent applications, validation data, and system architecture. Schedule demonstration and Q&A sessions with Dr. Collier." },
  { step: 3, title: "License Negotiation", desc: "Negotiate license scope, field of use, territory, financial terms, and support requirements. Typical negotiation period: 4-8 weeks." },
  { step: 4, title: "Agreement & Deployment", desc: "Execute license agreement, receive full technical package, and begin implementation with ongoing technical transfer support." },
];

const faqs = [
  { q: "What is the current IP status?", a: "Five U.S. provisional patent applications have been filed (December 2025 - February 2026). Non-provisional applications will be filed by December 2026 - February 2027. Licensing partners benefit from priority dates." },
  { q: "Is VitaSignal™ FDA cleared?", a: "No. VitaSignal™ is currently a research prototype. Licensing partners seeking clinical deployment will need to conduct their own FDA submission process (likely 510(k) pathway for Class II medical device software)." },
  { q: "What clinical validation has been completed?", a: "Patent #1 (ICU Mortality) validated on 26,153 patients (AUC 0.683). Patent #5 (DBS) validated on 321,719 patients across 208 hospitals (AUROC 0.857). Detailed performance data available under NDA." },
  { q: "Can we customize for our use case?", a: "Yes. License agreements can include co-development provisions for custom features, integration with proprietary systems, or adaptation to specific clinical workflows." },
  { q: "What about government rights under Bayh-Dole?", a: "Research was partially funded by NIH federal grants. Under the Bayh-Dole Act, the U.S. Government retains certain non-commercial use rights. Commercial licenses are unaffected." },
];

function Licensing() {
  return (
    <SiteLayout
      title="Licensing | Equipment-Independent Clinical AI"
      description="License VitaSignal's patent-pending clinical AI technology. Three licensing tracks: EHR Vendors, Hospital Systems, and Global Health organizations."
    >
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-24 md:pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/20 border border-primary/30 text-sm">
            <FileText className="w-3 h-3 text-primary" />
            <span className="text-primary font-medium">Technology Licensing</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-4 leading-[1.05] max-w-4xl">
            License
            <br />
            <span className="text-primary">VitaSignal™ Technology</span>
          </h1>
          <p className="text-base font-semibold text-primary mb-4">
            Three tracks. Zero hardware. Validated clinical AI.
          </p>
          <p className="text-lg md:text-xl max-w-2xl opacity-80 leading-relaxed">
            Partner with us to bring equipment-independent clinical AI to healthcare organizations worldwide — from
            major EHR platforms to resource-limited settings.
          </p>
        </div>
      </section>

      {/* Three Licensing Tracks */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Licensing Tracks</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Choose Your Path</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each track is tailored to your organization's needs, scale, and mission.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {tracks.map((track, i) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className={`h-full flex flex-col ${i === 0 ? 'border-primary/30 shadow-lg' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <track.icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant={track.badgeVariant} className="text-[10px]">{track.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{track.title}</CardTitle>
                    <CardDescription className="text-sm">{track.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4">{track.description}</p>
                    <div className="bg-secondary/50 rounded-lg p-3 mb-4">
                      <p className="text-xs font-semibold text-foreground mb-1">Ideal for</p>
                      <p className="text-xs text-muted-foreground">{track.idealFor}</p>
                    </div>
                    <div className="mb-6 flex-1">
                      <p className="text-xs font-semibold text-foreground mb-2">Includes</p>
                      <ul className="space-y-1.5">
                        {track.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full gap-2" asChild>
                      <a href={`mailto:${track.email}`}>
                        <Mail className="w-4 h-4" />
                        {track.cta}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">What Every License Includes</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Technical Assets</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Patent license for all 5 provisional applications</li>
                    <li>• Core algorithm specifications and training methodologies</li>
                    <li>• Model architectures and feature engineering pipelines</li>
                    <li>• Validation protocols and performance benchmarks</li>
                    <li>• Implementation guides and integration documentation</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Support & Services</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Technical transfer and training sessions</li>
                    <li>• Implementation support during deployment</li>
                    <li>• Quarterly updates and improvement releases</li>
                    <li>• Access to Dr. Collier for technical consultation</li>
                    <li>• Priority notification of new patent filings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">Licensing Process</h2>
          <div className="space-y-4">
            {processSteps.map((s) => (
              <Card key={s.step}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {s.step}
                    </div>
                    <CardTitle className="text-base">{s.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground py-16 px-6">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/80" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Explore Licensing?</h2>
          <p className="opacity-80 mb-8 max-w-2xl mx-auto">
            Whether you're an EHR vendor, hospital system, or global health organization — VitaSignal™'s
            equipment-independent architecture makes validated clinical AI accessible at any scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:info@alexiscollier.com" className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                info@alexiscollier.com
              </a>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:info@alexiscollier.com?subject=Schedule%20a%20Call%20-%20VitaSignal%20Licensing">Schedule a Call</a>
            </Button>
          </div>
          <p className="text-xs opacity-50 mt-6">
            All licensing discussions are conducted under mutual NDA. Initial consultations are provided at no cost.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Licensing;
