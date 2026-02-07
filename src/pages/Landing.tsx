import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Shield, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Landing = () => {
  return (
    <div className="min-h-screen bg-background">

      {/* Subtle Research Disclaimer */}
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-1.5 text-center text-xs">
        <span className="text-muted-foreground">Research Prototype · Not FDA cleared · Simulated data only</span>
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
            <nav className="flex items-center gap-4">
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:inline">Technology</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:inline">About</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:inline">Contact</Link>
              <ThemeToggle />
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:info@alexiscollier.com">Licensing</a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 md:py-32 px-6 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 gap-1 text-xs">
            <Shield className="w-3 h-3" />
            5 U.S. Patents Filed
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Detecting Life-Saving Signals Before Crisis
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Equipment-independent AI for ICU mortality prediction using temporal documentation pattern analysis. Zero hardware cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link to="/dashboard">View Demo</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:info@alexiscollier.com">
                <Mail className="w-4 h-4 mr-2" />
                Licensing Inquiries
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Validated Performance — single highlight */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-risk-low/30 bg-risk-low/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge className="bg-risk-low text-white text-xs">VALIDATED PERFORMANCE</Badge>
                <Badge variant="outline" className="text-xs">Patent #1</Badge>
              </div>
              <CardTitle className="text-xl mt-2">ICU Mortality Prediction (IDI Framework)</CardTitle>
              <CardDescription>
                9 automatically extractable features from routine EHR nursing documentation timestamps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "AUC", value: "0.684", sub: "95% CI: 0.653–0.715" },
                  { label: "Dataset", value: "26,153", sub: "ICU stays" },
                  { label: "Validation", value: "11 years", sub: "Temporal split" },
                  { label: "Top Predictor", value: "OR 1.82", sub: "Documentation rhythm" },
                ].map((m) => (
                  <div key={m.label} className="bg-card p-3 rounded-lg border border-risk-low/20">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="text-xl font-bold text-risk-low">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.sub}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                4 additional patent-pending systems in design phase. Details available under NDA.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-3">Licensing & Partnerships</h3>
          <p className="text-primary-foreground/80 mb-8">
            Available for licensing to EHR vendors, hospital systems, and healthcare AI companies.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <a href="mailto:info@alexiscollier.com">
              <Mail className="w-5 h-5 mr-2" />
              Contact for Licensing
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/30 bg-secondary/30">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">VitaSignal</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2024–2026 Dr. Alexis Collier, DHA. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Technology</Link>
            <Link to="/patents" className="hover:text-primary transition-colors">Patents</Link>
            <Link to="/licensing" className="hover:text-primary transition-colors">Licensing</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
