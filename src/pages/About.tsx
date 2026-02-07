import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, Building2, Mail, Linkedin, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import heroBg from "@/assets/hero-bg.jpg";

function About() {
  return (
    <SiteLayout title="About" description="Dr. Alexis Collier, DHA. Inventor and Principal Investigator of the VitaSignal Clinical Intelligence Platform.">
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-24 md:pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/20 border border-primary/30 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
            <span className="text-primary font-medium">NIH CLINAQ Fellow · AIM-AHEAD Researcher</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 leading-[1.05] max-w-4xl">
            About
            <br />
            <span className="text-primary">Dr. Alexis Collier</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 opacity-80 leading-relaxed">
            Inventor & Principal Investigator of the VitaSignal Clinical Intelligence Platform.
            Stanford AI+Health 2025 Presenter.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary/20 border-primary/30 text-primary">NIH CLINAQ Fellow</Badge>
            <Badge className="bg-primary/20 border-primary/30 text-primary">AIM-AHEAD Researcher</Badge>
            <Badge className="bg-primary/20 border-primary/30 text-primary">Stanford AI+Health Presenter</Badge>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Professional Credentials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <CardTitle>Academic Credentials</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p><strong className="text-foreground">DHA</strong> - Doctor of Health Administration</p>
                <p>Specialized in clinical informatics, artificial intelligence, and healthcare systems optimization</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <CardTitle>Current Affiliation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p><strong className="text-foreground">University of North Georgia</strong></p>
                <p>College of Health Sciences & Professions</p>
                <p>Faculty researcher specializing in AI applications for nursing practice</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Funding */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Research Funding & Fellowships</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <CardTitle>NIH CLINAQ Fellowship</CardTitle>
                </div>
                <CardDescription>NIH Training Fellowship</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Prestigious NIH training fellowship for clinical researchers advancing quality improvement
                  in cardiovascular and pulmonary care through innovative analytical methods.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <CardTitle>AIM-AHEAD Research Grant</CardTitle>
                </div>
                <CardDescription>NIH AIM-AHEAD Consortium</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-foreground">Project: "Human-Centered AI for Nursing Workload Optimization"</p>
                <p className="text-sm text-muted-foreground">
                  Funded research examining AI-driven approaches to reduce nursing documentation burden
                  and optimize staffing decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Focus */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Research Focus</h2>
          <Card>
            <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
              <p>
                Dr. Collier's research advances the concept of <strong className="text-foreground">equipment-independent clinical AI</strong> —
                predictive models that extract actionable insights from existing clinical workflows without requiring
                additional sensors, wearables, or monitoring devices.
              </p>
              <div>
                <p className="font-semibold text-foreground mb-2">Core Research Areas:</p>
                <ul className="space-y-1">
                  <li>• Temporal pattern analysis in clinical documentation</li>
                  <li>• Clinical phenotype discovery for risk stratification</li>
                  <li>• Equity validation in algorithmic decision-making</li>
                  <li>• Nursing workload optimization through predictive analytics</li>
                  <li>• Trust-based alert systems to reduce alarm fatigue</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* IP */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Intellectual Property Portfolio</h2>
          <Card>
            <CardHeader>
              <CardTitle>5 U.S. Provisional Patent Applications Filed</CardTitle>
              <CardDescription>2025–2026</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Dr. Collier is the sole inventor on all five provisional patent applications covering the VitaSignal platform,
                spanning ICU mortality prediction, nursing intelligence, documentation burden scoring, alert prioritization,
                and clinical risk intelligence.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Application numbers, detailed claims, and technical specifications are available to qualified partners under NDA.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:info@alexiscollier.com">Request Details Under NDA</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Presentations & Recognition</h2>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <CardTitle>Stanford AI+Health Conference 2025</CardTitle>
              </div>
              <CardDescription>December 2025 · Stanford University</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Presented VitaSignal research findings to leading healthcare AI researchers and clinicians at
                one of the nation's premier conferences on artificial intelligence in medicine.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground py-16 px-6">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/80" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Work With Dr. Collier</h2>
          <p className="opacity-80 mb-8">
            Interested in research collaborations, licensing partnerships, or speaking engagements?
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:info@alexiscollier.com">
                <Mail className="w-5 h-5 mr-2" />
                Get in Touch
              </a>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a href="https://www.linkedin.com/in/alexiscollier/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default About;
