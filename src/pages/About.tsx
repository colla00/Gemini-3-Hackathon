import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, Building2, Mail, Linkedin, BookOpen, Microscope, Heart, FileText, Shield, ExternalLink, BarChart3, Users, DollarSign, Calendar } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import alexisPhoto from "@/assets/alexis-collier.png";
import { WalkthroughScheduleModal } from "@/components/WalkthroughScheduleModal";

function About() {
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  return (
    <SiteLayout title="About" description="Dr. Alexis Collier, DHA. Founder & CEO of VitaSignal LLC. Inventor and Principal Investigator of the VitaSignal™ Clinical Intelligence Platform.">
      {/* Hero - biographical focus */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/20 border border-primary/30 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
                <span className="text-primary font-medium">Nurse Scientist & AI Researcher</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 leading-[1.05]">
                Dr. Alexis
                <br />
                <span className="text-primary">Collier, DHA</span>
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mb-6 opacity-80 leading-relaxed">
                From bedside nursing to clinical AI research. 
                A career dedicated to reducing the burden on frontline healthcare workers through intelligent systems.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/20 border-primary/30 text-primary">Founder & CEO, VitaSignal LLC</Badge>
                <Badge className="bg-primary/20 border-primary/30 text-primary">NIH AIM-AHEAD CLINAQ Fellow</Badge>
                <Badge className="bg-primary/20 border-primary/30 text-primary">11 U.S. Patent Applications Filed</Badge>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src={alexisPhoto}
                alt="Dr. Alexis Collier"
                className="w-48 h-48 rounded-2xl object-cover border-2 border-primary/30 shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* VitaSignal LLC Section */}
      <section className="py-16 px-6 bg-primary/5 border-b border-primary/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="font-display text-2xl text-foreground">VitaSignal LLC</h2>
              <p className="text-sm text-muted-foreground mt-1">Clinical Intelligence Without Equipment™</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://dralexis.ceo" target="_blank" rel="noopener noreferrer" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  dralexis.ceo
                </a>
              </Button>
              <Button variant="default" size="sm" onClick={() => setWalkthroughOpen(true)} className="gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Guided Walkthrough
              </Button>
            </div>
          </div>

          {/* Patent Portfolio */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Intellectual Property Portfolio</CardTitle>
              </div>
              <CardDescription>11 U.S. Provisional Patent Applications Filed — February 28, 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* IDI */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border/40">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Intensive Documentation Index (IDI)</p>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-foreground font-bold text-xl">AUROC 0.9063</p>
                    <p className="text-muted-foreground text-xs">Best performance (HiRID external validation)</p>
                    <p className="text-muted-foreground text-xs">Cohort: <strong className="text-foreground">65,157</strong> patients</p>
                    <p className="text-muted-foreground text-xs">Outperforms APACHE IV & SAPS III (DeLong p &lt; 0.001)</p>
                  </div>
                </div>
                {/* DBS */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border/40">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Documentation Burden Score™ (DBS)</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex gap-3">
                      <div>
                        <p className="text-foreground font-bold text-xl">0.802</p>
                        <p className="text-muted-foreground text-[10px]">Internal AUROC</p>
                      </div>
                      <div>
                        <p className="text-foreground font-bold text-xl">0.758</p>
                        <p className="text-muted-foreground text-[10px]">External AUROC</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs">Cohort: <strong className="text-foreground">28,362</strong> patients · <strong className="text-foreground">172</strong> hospitals validated</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: DollarSign, value: "$2,847", label: "Savings / Patient" },
              { icon: BarChart3, value: "1,240%", label: "ROI" },
              { icon: Calendar, value: "90 min", label: "Saved / Shift" },
            ].map((m) => (
              <Card key={m.label} className="border-border/40">
                <CardContent className="p-4 text-center">
                  <m.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-lg font-bold text-foreground">{m.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* NIH Funding & Co-PI */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong className="text-foreground">NIH AIM-AHEAD</strong> · Award No. 1OT2OD032581
                  </p>
                  <p>
                    Co-Investigator: <strong className="text-foreground">Dr. Sophia Z. Shalhout, PhD</strong> — Harvard Medical School / Massachusetts Eye and Ear
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Clinical Journey */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-8">Clinical Journey</h2>
          <Card>
            <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Dr. Collier's path to clinical AI began at the bedside. Years of frontline nursing experience
                revealed a critical gap: clinicians spend more time documenting care than delivering it,
                while existing alert systems generate noise rather than actionable insight.
              </p>
              <p>
                This firsthand understanding of clinical workflow challenges led to doctoral research
                on nursing burnout and workload measurement, ultimately culminating in the development
                of the <strong className="text-foreground">VitaSignal™ Clinical Intelligence Platform</strong> —
                a suite of AI systems designed by a nurse, for nurses.
              </p>
              <p>
                Unlike traditional clinical AI that requires expensive sensors or additional hardware,
                Dr. Collier's research demonstrates that predictive signals already exist within the
                temporal patterns of routine clinical documentation — waiting to be unlocked.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Credentials & Affiliation */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-8">Credentials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <CardTitle>Academic Background</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p><strong className="text-foreground">Doctor of Health Administration (DHA)</strong></p>
                <p>Dissertation: Nursing burnout and workload measurement in acute care settings</p>
                <p className="text-xs text-muted-foreground/70">
                  Specialized in clinical informatics, artificial intelligence, and healthcare systems optimization
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <CardTitle>Current Affiliations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <div>
                  <p><strong className="text-foreground">Founder & CEO, VitaSignal LLC</strong></p>
                  <p className="text-xs text-muted-foreground/70">Clinical intelligence platform company</p>
                </div>
                <div>
                  <p><strong className="text-foreground">Adjunct Faculty, University of North Georgia</strong></p>
                  <p className="text-xs text-muted-foreground/70">College of Health Sciences & Professions</p>
                </div>
                <div>
                  <p><strong className="text-foreground">NIH AIM-AHEAD CLINAQ Fellow</strong></p>
                  <p className="text-xs text-muted-foreground/70">Morehouse School of Medicine</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Speaking & Events */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-8">Speaking & Events</h2>
          <div className="space-y-4">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/15 shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <Badge className="mb-2 bg-primary/20 border-primary/30 text-primary text-[10px]">Upcoming</Badge>
                    <p className="font-semibold text-foreground">ANIA 2026 Annual Conference</p>
                    <p className="text-sm text-muted-foreground">Boston, MA — March 26–28, 2026</p>
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      "Human-Centered AI to Reduce Nursing Workload: Two-Stage Validation of a Documentation Burden Score"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary shrink-0">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Stanford AI+Health Symposium</p>
                    <p className="text-sm text-muted-foreground">December 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Funding */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-8">Research Funding</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <CardTitle>NIH AIM-AHEAD CLINAQ Fellowship</CardTitle>
                </div>
                <CardDescription>National Institutes of Health · Award No. 1OT2OD032581</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AIM-AHEAD CLINAQ Consortium fellowship through Morehouse School of Medicine, 
                  supporting clinical AI research for equity-centered healthcare quality improvement.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-primary" />
                  <CardTitle>NIH Research Grant</CardTitle>
                </div>
                <CardDescription>NIH Research Consortium</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-foreground">Project: "Human-Centered AI for Clinical Decision Support"</p>
                <p className="text-sm text-muted-foreground">
                  Funded research examining AI-driven approaches to reduce nursing documentation burden
                  and optimize staffing decisions using temporal pattern analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Methodology */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-8">Research Methodology</h2>
          <Card>
            <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
              <p>
                Dr. Collier's methodology centers on extracting clinically meaningful signals from data
                that already exists in every hospital — the timestamps and patterns of routine documentation.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {[
                  { icon: BookOpen, label: "Temporal Pattern Analysis", desc: "11 features extracted from documentation timing metadata" },
                  { icon: Heart, label: "Clinical Phenotype Discovery", desc: "Unsupervised clustering to identify documentation behavior archetypes" },
                  { icon: Microscope, label: "Equity Validation", desc: "Systematic fairness testing across demographic subgroups" },
                  { icon: Award, label: "SHAP Explainability", desc: "Every prediction accompanied by interpretable feature attributions" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/30">
                    <item.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Compliance & Transparency */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-foreground mb-8">Compliance & Transparency</h2>
          <p className="text-sm text-muted-foreground mb-6">
            VitaSignal™ is built with regulatory readiness and scientific transparency at its core —
            even at the research prototype stage.
          </p>
          <div className="max-w-lg">
            <Link to="/regulatory" className="group">
              <Card className="h-full transition-colors group-hover:border-primary/40">
                <CardContent className="pt-6 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Regulatory Readiness</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Progress across FDA SaMD, HIPAA, ISO 13485, AI transparency, and equity standards
                      with milestone tracking.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
          <h2 className="font-display text-2xl mb-4">Work With Dr. Collier</h2>
          <p className="opacity-80 mb-8">
            Interested in research collaborations, licensing partnerships, or speaking engagements?
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <a href="https://dralexis.ceo" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5 mr-2" />
                dralexis.ceo
              </a>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:Alexis.Collier@ung.edu">
                <Mail className="w-5 h-5 mr-2" />
                Alexis.Collier@ung.edu
              </a>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a href="https://www.linkedin.com/in/alexiscollier/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </a>
            </Button>
          </div>
          <p className="text-xs opacity-50 mt-6">
            VitaSignal™ technology is patent-pending. USPTO patent applications filed. All rights reserved.
          </p>
        </div>
      </section>
      <WalkthroughScheduleModal open={walkthroughOpen} onOpenChange={setWalkthroughOpen} />
    </SiteLayout>
  );
}

export default About;
