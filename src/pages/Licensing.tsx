import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Building2, Briefcase, Users, CheckCircle2, Mail, FileText, Shield, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

function Licensing() {
  return (
    <div className="min-h-screen bg-background">

      {/* Alert Banner */}
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-center text-sm">
        <span className="font-semibold text-destructive">⚠️ RESEARCH PROTOTYPE</span>
        <span className="text-muted-foreground mx-2">•</span>
        <span className="text-muted-foreground">Not FDA cleared or approved. Not a medical device. Not for clinical use.</span>
      </div>

      {/* Header */}
      <header className="border-b border-border/40 bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">VitaSignal</p>
                <p className="text-xs text-muted-foreground">Clinical Intelligence</p>
              </div>
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:inline">Technology</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:inline">About</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:inline">Contact</Link>
              <ThemeToggle />
              <Button variant="default" size="sm" asChild>
                <Link to="/licensing">Licensing</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-transparent text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 gap-1">
            <FileText className="w-3 h-3" />
            Technology Licensing Opportunities
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">License VitaSignal Technology</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Partner with us to bring equipment-independent clinical AI to healthcare organizations worldwide
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            VitaSignal is protected by 5 U.S. provisional patent applications. We're seeking strategic partnerships
            with organizations ready to advance clinical AI innovation.
          </p>
        </div>
      </section>

      {/* Target Partners */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">Ideal Licensing Partners</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, title: "EHR Vendors", desc: "Epic, Cerner, Meditech, Allscripts, and other electronic health record system providers" },
              { icon: Shield, title: "Hospital Systems", desc: "Academic medical centers, health systems, and hospital networks seeking innovative patient safety solutions" },
              { icon: Briefcase, title: "Healthcare AI Companies", desc: "Clinical decision support, patient monitoring, and healthcare analytics platforms" },
              { icon: Users, title: "Strategic Investors", desc: "Venture capital, healthcare innovation funds, and technology transfer organizations" },
            ].map((p) => (
              <Card key={p.title}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <p.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why License VitaSignal */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">Why License VitaSignal?</h2>
          <div className="space-y-4">
            {[
              { icon: CheckCircle2, title: "Zero Hardware Requirements", desc: "Works with existing EHR infrastructure—no sensors, wearables, or monitoring devices required. Dramatically lowers implementation costs and deployment barriers." },
              { icon: Shield, title: "Patent-Protected Innovation", desc: "5 U.S. provisional patent applications covering novel methods for temporal documentation analysis, trust-based alerting, and nursing workload optimization." },
              { icon: CheckCircle2, title: "Validated Research Foundation", desc: "VitaSignal Mortality validated on large-scale ICU datasets with strong predictive performance. NIH-funded research with rigorous equity validation across patient populations." },
              { icon: Briefcase, title: "Comprehensive Platform", desc: "Four integrated systems addressing mortality prediction, nursing optimization, alert fatigue, and risk intelligence—a complete clinical AI ecosystem." },
              { icon: Users, title: "Equity & Explainability Built-In", desc: "Designed with fairness validation and SHAP-based explainability from the ground up. Meets emerging regulatory requirements for transparent, equitable AI." },
              { icon: Lightbulb, title: "First-Mover Advantage", desc: "Equipment-independent clinical AI represents a paradigm shift. License now to establish market leadership before competitors develop similar approaches." },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Licensing Models */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">Licensing Models Available</h2>
          <div className="space-y-6">
            <Card className="border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle>Exclusive License</CardTitle>
                  <Badge>Preferred</Badge>
                </div>
                <CardDescription>Full exclusive rights within defined field of use or geographic territory</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>Best for: EHR vendors, healthcare AI companies, or hospital systems seeking competitive differentiation and market leadership.</p>
                <div>
                  <p className="font-semibold text-foreground mb-1">Includes:</p>
                  <ul className="space-y-1">
                    <li>• Exclusive rights to VitaSignal technology within defined scope</li>
                    <li>• Access to all patent claims and provisional applications</li>
                    <li>• Technical transfer and implementation support</li>
                    <li>• Co-development opportunities for future enhancements</li>
                    <li>• Rights to sublicense (negotiable)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Non-Exclusive License</CardTitle>
                <CardDescription>Shared licensing rights with multiple partners</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>Best for: Hospital systems, regional health networks, or specialized clinical applications where exclusivity is not required.</p>
                <div>
                  <p className="font-semibold text-foreground mb-1">Includes:</p>
                  <ul className="space-y-1">
                    <li>• License to use VitaSignal technology within your organization</li>
                    <li>• Access to core algorithms and implementation documentation</li>
                    <li>• Technical support during deployment</li>
                    <li>• Updates and improvements during license term</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Research Collaboration Agreement</CardTitle>
                <CardDescription>Joint development and clinical validation partnership</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>Best for: Academic medical centers and research institutions conducting clinical validation studies with potential path to commercial licensing.</p>
                <div>
                  <p className="font-semibold text-foreground mb-1">Includes:</p>
                  <ul className="space-y-1">
                    <li>• Access to VitaSignal technology for IRB-approved clinical trials</li>
                    <li>• Co-investigator status on validation studies</li>
                    <li>• Joint publication rights on research findings</li>
                    <li>• Option to convert to commercial license post-validation</li>
                    <li>• Shared IP rights on jointly developed improvements (negotiable)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technology Evaluation Agreement</CardTitle>
                <CardDescription>Limited-term assessment under NDA</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>Best for: Organizations conducting due diligence before committing to licensing terms.</p>
                <div>
                  <p className="font-semibold text-foreground mb-1">Includes:</p>
                  <ul className="space-y-1">
                    <li>• 30-90 day evaluation period</li>
                    <li>• Access to technical documentation and performance data</li>
                    <li>• Live demonstration with simulated data</li>
                    <li>• Technical feasibility assessment support</li>
                    <li>• Option to negotiate full license upon successful evaluation</li>
                  </ul>
                </div>
                <p className="text-xs text-muted-foreground/70">
                  Requires executed NDA and commitment to licensing discussions if evaluation is positive.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">What's Included in a License</h2>
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
                    <li>• Sample code and reference implementations</li>
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
                    <li>• Co-marketing opportunities (negotiable)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Licensing Process */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">Licensing Process</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Initial Inquiry & NDA", desc: "Contact info@alexiscollier.com with your organization details, intended use case, and timeline. We'll execute a mutual Non-Disclosure Agreement to enable detailed technical discussions." },
              { step: 2, title: "Technical Due Diligence", desc: "Review technical documentation, patent applications, validation data, and system architecture. Schedule demonstration and Q&A sessions with Dr. Collier." },
              { step: 3, title: "License Negotiation", desc: "Negotiate license scope (exclusive/non-exclusive), field of use, territory, financial terms, milestones, and support requirements. Typical negotiation period: 4-8 weeks." },
              { step: 4, title: "Agreement Execution", desc: "Execute license agreement, transfer initial payment, and receive full technical package. Begin implementation planning and technical transfer sessions." },
              { step: 5, title: "Implementation & Support", desc: "Deploy VitaSignal within your organization with ongoing technical support. Conduct clinical validation studies (if required) and prepare for FDA submission (if applicable)." },
            ].map((s) => (
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

      {/* Financial Considerations */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Financial Terms</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Licensing fees are structured based on license type, exclusivity, field of use, and organization size. Terms typically include:
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "Upfront Fee", desc: "One-time payment upon agreement execution" },
              { title: "Royalty Structure", desc: "Revenue-based royalties or per-deployment fees" },
              { title: "Milestone Payments", desc: "Performance-based payments tied to validation or deployment" },
            ].map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6">
            Specific financial terms are confidential and provided under NDA during licensing negotiations.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What is the current IP status?", a: "Five U.S. provisional patent applications have been filed (December 2025 - February 2026). Non-provisional applications will be filed by December 2026 - February 2027. Licensing partners will benefit from priority dates and can participate in patent prosecution strategy." },
              { q: "Is VitaSignal FDA cleared?", a: "No. VitaSignal is currently a research prototype and has NOT been submitted to the FDA. Licensing partners seeking clinical deployment will need to conduct their own FDA submission process (likely 510(k) pathway for Class II medical device software)." },
              { q: "What clinical validation has been completed?", a: "VitaSignal Mortality has been validated on large-scale ICU datasets (n=26,153) with strong predictive performance (AUC 0.684, 95% CI: 0.653-0.715) and equity validation across 11 years of temporal validation (2008-2019). Other systems are in design phase requiring clinical validation studies. Detailed performance data available under NDA." },
              { q: "Can we customize VitaSignal for our specific use case?", a: "Yes. License agreements can include co-development provisions for custom features, integration with proprietary systems, or adaptation to specific clinical workflows. Joint IP arrangements are negotiable." },
              { q: "What about government rights under Bayh-Dole?", a: "Research was partially funded by NIH grants K12 HL138039-06 and 1OT2OD032581. Under the Bayh-Dole Act, the U.S. Government retains certain non-commercial use rights. Commercial licenses are unaffected, but licensees should be aware of government rights. Details provided during licensing discussions." },
              { q: "How long does the licensing process take?", a: "Typical timeline from initial inquiry to signed agreement: 2-4 months. This includes NDA execution (1-2 weeks), technical due diligence (4-6 weeks), and license negotiation (4-8 weeks). Expedited timelines available for qualified partners." },
            ].map((faq) => (
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
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Explore Licensing?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Contact us today to schedule a confidential discussion about how VitaSignal can strengthen
            your clinical AI portfolio and deliver equipment-independent predictive intelligence to your customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:info@alexiscollier.com" className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                info@alexiscollier.com
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="mailto:info@alexiscollier.com">Schedule a Call</a>
            </Button>
          </div>
          <p className="text-xs text-primary-foreground/60 mt-6">
            All licensing discussions are conducted under mutual NDA. Initial consultations are provided at no cost.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/30 bg-secondary/30">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">VitaSignal</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2024–2026 Dr. Alexis Collier, DHA. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-border">|</span>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
            <span className="text-border">|</span>
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Technology</Link>
            <span className="text-border">|</span>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            <span className="text-border">|</span>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <span className="text-border">|</span>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Licensing;
