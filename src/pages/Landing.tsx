import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Bell, TrendingUp, DollarSign, Clock, Shield, Award, Mail, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { WalkthroughRequestModal } from "@/components/WalkthroughRequestModal";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Landing = () => {
  return (
    <div className="min-h-screen bg-background">

      {/* Alert Banner */}
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-center text-sm">
        <span className="font-semibold text-destructive">⚠️ RESEARCH PROTOTYPE</span>
        <span className="text-muted-foreground mx-2">•</span>
        <span className="text-muted-foreground">Not FDA cleared or approved. Not a medical device. Not for clinical use. Simulated data only.</span>
        <span className="text-muted-foreground mx-2">•</span>
        <Link to="/about" className="text-primary hover:underline font-medium">Learn More</Link>
      </div>

      {/* Header */}
      <header className="border-b border-border/40 bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">VitaSignal</h1>
                <p className="text-xs text-muted-foreground">Clinical Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex gap-1 text-xs">
                <Shield className="w-3 h-3" />
                5 U.S. Patents Filed
              </Badge>
              <ThemeToggle />
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:licensing@dralexis.ceo">Licensing Inquiries</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Recognition Badge */}
      <div className="bg-secondary/50 border-b border-border/30 py-2">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-sm text-muted-foreground">
            🎓 Presented at Stanford AI+Health 2025 • Dec 2025
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Detecting Life-Saving Signals Before Crisis
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Equipment-Independent AI for ICU Mortality Prediction, Nursing Optimization, and Real-Time Risk Intelligence
          </p>
          <p className="text-sm text-muted-foreground mb-10 max-w-2xl mx-auto">
            5 U.S. provisional patent applications covering novel analytical methods for clinical documentation pattern analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/about">Learn More →</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:licensing@dralexis.ceo">Licensing Inquiries</a>
            </Button>
            <WalkthroughRequestModal
              trigger={
                <Button variant="secondary" size="lg">Request Walkthrough</Button>
              }
            />
          </div>
        </div>
      </section>

      {/* What is VitaSignal */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            What is VitaSignal?
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
            VitaSignal is a suite of patent-pending AI systems that analyze clinical documentation patterns to predict
            patient deterioration and optimize nursing workflows without requiring any additional monitoring equipment.
          </p>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="font-semibold text-foreground mb-2">The Innovation:</p>
              <p className="text-muted-foreground">
                While traditional systems rely on expensive sensors and vital signs, VitaSignal detects subtle signals in the
                timing and rhythm of routine clinical documentation, enabling earlier intervention at zero hardware cost.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Platform Overview - Patent #1 Featured */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Platform Components
          </h3>

          {/* Featured: Patent #1 - Validated */}
          <Card className="border-2 border-risk-low/40 bg-risk-low/5 mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <Badge className="bg-risk-low text-white px-3 py-1.5 text-xs">
                  ✓ VALIDATED PERFORMANCE • MOST RECENT FILING
                </Badge>
                <Badge variant="outline" className="text-xs border-risk-low/50 text-risk-low">
                  Patent #1 • Filed Feb 5, 2026
                </Badge>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Activity className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">VitaSignal Mortality</CardTitle>
                  <CardDescription className="text-base">
                    ICU mortality prediction using temporal documentation analysis
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    <strong className="text-foreground">Only VitaSignal component with validated research performance.</strong> Predicts ICU mortality
                    risk by analyzing temporal patterns in routine clinical documentation without requiring additional sensors
                    or monitoring equipment.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Validated AUC", value: "0.741", sub: "95% CI: 0.712-0.769" },
                  { label: "Dataset Size", value: "26,153", sub: "ICU admissions" },
                  { label: "Temporal Validation", value: "11 years", sub: "Mean AUC: 0.684" },
                  { label: "Equity Validated", value: "✓ Pass", sub: "AUC parity maintained" },
                ].map((m) => (
                  <div key={m.label} className="bg-card p-3 rounded-lg border border-risk-low/20">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-xl font-bold text-risk-low">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.sub}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <Button size="sm" asChild>
                  <Link to="/patents">View Full Technical Details</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/licensing">Licensing Inquiries</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Other Patents (Design Phase) */}
          <div className="bg-secondary/50 p-6 rounded-xl border border-border/50">
            <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              Additional Patent-Pending Systems (Design Phase)
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, name: "VitaSignal Nursing", desc: "Unified nursing intelligence and workload optimization", num: 2, date: "Jan 22, 2026" },
                { icon: FileText, name: "VitaSignal DBS", desc: "Documentation burden scoring and staffing recommendations", num: 3, date: "Jan 22, 2026" },
                { icon: Bell, name: "VitaSignal Alerts", desc: "Trust-based alert prioritization to reduce fatigue", num: 4, date: "Dec 21, 2025" },
                { icon: TrendingUp, name: "VitaSignal Risk", desc: "Real-time risk stratification with explainable AI", num: 5, date: "Dec 6, 2025" },
              ].map((p) => (
                <Card key={p.num} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p.icon className="w-5 h-5 text-primary" />
                      <Badge variant="outline" className="text-xs">Design Phase</Badge>
                    </div>
                    <CardTitle className="text-sm">{p.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">{p.desc}</p>
                    <Badge variant="secondary" className="text-xs">Patent #{p.num} • {p.date}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 bg-accent/50 border border-accent p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Patents #2-5 are in design phase with projected performance goals.
                Clinical validation studies planned. Performance metrics are NOT validated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 px-6 bg-secondary/30">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">Key Benefits</h3>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: DollarSign, title: "Zero Hardware Cost", desc: "Works with existing EHR systems. No sensors, wearables, or monitoring devices required." },
            { icon: Clock, title: "Early Detection", desc: "Identifies deterioration signals hours before traditional vital sign alerts." },
            { icon: Bell, title: "Reduced Alert Fatigue", desc: "Adaptive algorithms minimize false alarms while maintaining patient safety." },
            { icon: Users, title: "Equity-Focused", desc: "Validated for fairness across patient populations." },
            { icon: Award, title: "NIH-Funded Research", desc: "Backed by rigorous scientific validation and federal research support." },
            { icon: Shield, title: "Patent-Protected", desc: "5 U.S. provisional patent applications covering novel analytical methods." },
          ].map((b) => (
            <Card key={b.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{b.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About the Inventor */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">About the Inventor</h3>
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-xl font-bold text-foreground mb-4">Dr. Alexis M. Collier, DHA</h4>
              <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                <p>• <strong className="text-foreground">NIH CLINAQ Fellow</strong> (K12 HL138039-06)</p>
                <p>• <strong className="text-foreground">AIM-AHEAD Researcher</strong> (1OT2OD032581, $55,475)</p>
                <p>• <strong className="text-foreground">Stanford AI+Health Presenter</strong> (December 2025)</p>
                <p>• <strong className="text-foreground">Sole Inventor:</strong> 5 U.S. provisional patent applications filed (2025-2026)</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Dr. Collier specializes in equipment-independent clinical AI systems validated on large-scale datasets.
                Research focuses on temporal pattern analysis, clinical phenotype discovery, and equity in algorithmic decision-making.
              </p>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                <p className="text-xs font-semibold text-foreground mb-1">Affiliations:</p>
                <p className="text-xs text-muted-foreground">
                  University of North Georgia, College of Health Sciences & Professions
                  <br />NIH CLINAQ Fellowship Program • AIM-AHEAD Consortium
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-20 px-6 bg-secondary/30">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">Recognition</h3>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Stanford AI+Health 2025", sub: "Presented research findings (December 2025)" },
            { title: "NIH CLINAQ Fellowship", sub: "K12 HL138039-06" },
            { title: "AIM-AHEAD Grant", sub: "$55,475 for nursing workload optimization research" },
            { title: "Large-Scale Validation", sub: "Validated on extensive ICU datasets" },
          ].map((r) => (
            <Card key={r.title} className="text-center">
              <CardHeader>
                <CardTitle className="text-base">{r.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{r.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Licensing & Partnerships</h3>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            VitaSignal is available for licensing to EHR vendors, hospital systems, healthcare AI companies, and strategic investors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:licensing@dralexis.ceo">
                <Mail className="w-5 h-5 mr-2" />
                Licensing Inquiries
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="mailto:contact@dralexis.ceo">General Contact</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">Contact</h3>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          {[
            { label: "For Licensing Inquiries", email: "licensing@dralexis.ceo" },
            { label: "For Research Collaborations", email: "research@dralexis.ceo" },
            { label: "For Media & Press", email: "media@dralexis.ceo" },
            { label: "General Inquiries", email: "contact@dralexis.ceo" },
          ].map((c) => (
            <Card key={c.email}>
              <CardHeader>
                <CardTitle className="text-base">{c.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <a href={`mailto:${c.email}`} className="text-primary hover:underline">{c.email}</a>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-6">Response Time: 2-3 business days</p>
      </section>

      {/* Legal Disclaimers */}
      <section className="py-12 px-6 bg-destructive/5 border-t border-destructive/20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-foreground text-center mb-8 flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-destructive" />
            Important Legal Disclaimers
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <Card>
              <CardContent className="pt-4">
                <p className="font-semibold text-foreground mb-2">RESEARCH PROTOTYPE STATUS</p>
                <p className="mb-2">VitaSignal systems are research prototypes for demonstration and validation purposes only.</p>
                <ul className="space-y-1">
                  <li>• NOT FDA cleared, approved, or authorized</li>
                  <li>• NOT medical devices</li>
                  <li>• NOT for clinical decision-making</li>
                  <li>• NOT validated for actual patient care</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="font-semibold text-foreground mb-2">Performance Data</p>
                <p>All metrics are from retrospective research studies using de-identified datasets. Results do not represent prospective clinical trial outcomes.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="font-semibold text-foreground mb-2">IP Status</p>
                <p>All patents are provisional applications subject to USPTO examination. Final patent grants are not guaranteed.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="font-semibold text-foreground mb-2">Government Rights</p>
                <p>Research supported by NIH grants K12 HL138039-06 and 1OT2OD032581. The U.S. Government retains certain non-commercial use rights under the Bayh-Dole Act.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/30 bg-secondary/30">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">VitaSignal</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2024–2026 Dr. Alexis M. Collier, DHA. All Rights Reserved.</p>
          <p className="text-xs text-muted-foreground">NIH CLINAQ Fellow (K12 HL138039-06) | AIM-AHEAD Researcher (1OT2OD032581)</p>
          <p className="text-xs text-primary font-medium">5 U.S. Provisional Patent Applications Filed</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
            <span className="text-border">|</span>
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Technology</Link>
            <span className="text-border">|</span>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            <span className="text-border">|</span>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Use</Link>
            <span className="text-border">|</span>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
          <div className="text-[10px] text-muted-foreground/60 max-w-lg">
            <p>VitaSignal and associated marks are property of Dr. Alexis M. Collier.</p>
            <p className="mt-1">Research supported by NIH CLINAQ Fellowship (K12 HL138039-06) and AIM-AHEAD Program (1OT2OD032581)</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
