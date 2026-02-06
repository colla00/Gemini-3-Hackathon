import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, GraduationCap, Award, Building2, FileText, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

function About() {
  return (
    <div className="min-h-screen bg-background">

      {/* Alert Banner */}
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-center text-sm">
        <span className="font-semibold text-destructive">⚠️ RESEARCH PROTOTYPE</span>
        <span className="text-muted-foreground mx-2">•</span>
        <span className="text-muted-foreground">Not FDA cleared or approved. Not a medical device. Not for clinical use. Simulated data only.</span>
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
              <Link to="/about" className="text-sm text-primary font-medium">About</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:inline">Contact</Link>
              <ThemeToggle />
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:licensing@dralexis.ceo">Licensing</a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-transparent text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">About Dr. Alexis M. Collier</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Inventor & Principal Investigator, VitaSignal Clinical Intelligence Platform
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary">NIH CLINAQ Fellow</Badge>
            <Badge variant="secondary">AIM-AHEAD Researcher</Badge>
            <Badge variant="secondary">Stanford AI+Health Presenter</Badge>
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
                <CardDescription>K12 HL138039-06</CardDescription>
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
                <CardDescription>1OT2OD032581 • $55,475 • Oct 2025 - Jul 2026</CardDescription>
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
                Dr. Collier's research pioneered the concept of <strong className="text-foreground">equipment-independent clinical AI</strong> —
                predictive models that extract actionable insights from existing clinical workflows without requiring
                additional sensors, wearables, or monitoring devices.
              </p>
              <p>
                This work challenges the prevailing paradigm that AI-driven early warning systems must rely on
                continuous physiological monitoring. By analyzing temporal patterns in routine clinical documentation,
                VitaSignal systems detect deterioration signals at zero hardware cost.
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
              <p>
                All research methods are validated on large-scale de-identified datasets with rigorous attention
                to fairness, transparency, and clinical applicability.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Intellectual Property */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Intellectual Property Portfolio</h2>
          <Card>
            <CardHeader>
              <CardTitle>5 U.S. Provisional Patent Applications Filed</CardTitle>
              <CardDescription>December 2025 - February 2026</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Dr. Collier is the sole inventor on all five provisional patent applications covering the VitaSignal platform.
              </p>
              <div className="space-y-3">
                {[
                  { num: 1, title: "ICU Mortality Prediction", date: "Feb 5, 2026", app: "63/976,293", validated: true },
                  { num: 2, title: "Unified Nursing Intelligence Platform", date: "Jan 22, 2026", app: "63/966,117" },
                  { num: 3, title: "Documentation Burden & Staffing System", date: "Jan 22, 2026", app: "63/966,099" },
                  { num: 4, title: "Trust-Based Alert Prioritization", date: "Dec 21, 2025", app: "63/946,187" },
                  { num: 5, title: "Clinical Risk Intelligence", date: "Dec 6, 2025", app: "63/932,953" },
                ].map((p) => (
                  <div key={p.num} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Patent #{p.num}: {p.title}</p>
                        <p className="text-xs text-muted-foreground">Filed {p.date} • Application No. {p.app}</p>
                      </div>
                      {p.validated && <Badge className="bg-risk-low/10 text-risk-low border-risk-low/30" variant="outline">Validated Performance</Badge>}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Non-provisional applications due December 2026 - February 2027 under 35 U.S.C. § 111(b)
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Presentations & Recognition */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Presentations & Recognition</h2>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <CardTitle>Stanford AI+Health Conference 2025</CardTitle>
              </div>
              <CardDescription>December 2025 • Stanford University</CardDescription>
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

      {/* Contact CTA */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Work With Dr. Collier</h2>
          <p className="text-primary-foreground/80 mb-8">
            Interested in research collaborations, licensing partnerships, or speaking engagements?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:contact@dralexis.ceo">
                <Mail className="w-5 h-5 mr-2" />
                Get in Touch
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="mailto:licensing@dralexis.ceo">Licensing Inquiries</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/30 bg-secondary/30">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">VitaSignal</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2024–2026 Dr. Alexis M. Collier, DHA. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-border">|</span>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
            <span className="text-border">|</span>
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Technology</Link>
            <span className="text-border">|</span>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;
