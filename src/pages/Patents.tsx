import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, FileText, Shield, Users, AlertCircle, CheckCircle2, Clock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

function Patents() {
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
          <Badge variant="secondary" className="mb-4 gap-1">
            <FileText className="w-3 h-3" />
            5 U.S. Provisional Patent Applications Filed
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">VitaSignal Technology Portfolio</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Patent-protected equipment-independent AI systems for clinical risk prediction and nursing workflow optimization
          </p>
          <p className="text-sm text-muted-foreground">
            Sole Inventor: Dr. Alexis M. Collier, DHA • Filed December 2025 - February 2026
          </p>
        </div>
      </section>

      {/* Patent Portfolio */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Patent #1 - Validated */}
          <Card className="border-risk-low/30">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-risk-low" />
                  <Badge className="bg-risk-low/10 text-risk-low border-risk-low/30" variant="outline">VALIDATED PERFORMANCE</Badge>
                </div>
                <Badge variant="secondary">Patent #1</Badge>
              </div>
              <CardTitle className="mt-2">ICU Mortality Prediction System</CardTitle>
              <CardDescription>Temporal documentation analysis for early prediction of ICU patient mortality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Application Number</p>
                  <p className="font-medium text-foreground">63/976,293</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Filing Date</p>
                  <p className="font-medium text-foreground">February 5, 2026</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Non-Provisional Due</p>
                  <p className="font-medium text-foreground">February 5, 2027</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Validated Research Performance:</p>
                <ul className="space-y-1">
                  <li>• Validated on large-scale ICU research datasets (n=26,153 admissions)</li>
                  <li>• Strong predictive performance (AUC 0.741, 95% CI: 0.712-0.769)</li>
                  <li>• 11-year temporal validation demonstrating consistency</li>
                  <li>• Equity validation across race/ethnicity (AUC parity maintained)</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Core Innovation:</strong> Analyzes temporal patterns in routine clinical documentation to predict
                ICU mortality risk without requiring additional physiological sensors or monitoring equipment.
              </p>
            </CardContent>
          </Card>

          {/* Patents #2-5 */}
          {[
            { num: 2, title: "Unified Nursing Intelligence Platform", desc: "Integrated system for nursing workload prediction and staffing optimization", app: "63/966,117", date: "January 22, 2026", due: "January 22, 2027", innovation: "Unified predictive platform integrating patient risk assessment with nursing workload forecasting to optimize staffing decisions and reduce burnout.", extra: "Funded by AIM-AHEAD Grant (1OT2OD032581, $55,475)" },
            { num: 3, title: "Documentation Burden & Staffing System", desc: "ML-based prediction of documentation burden with real-time staffing recommendations", app: "63/966,099", date: "January 22, 2026", due: "January 22, 2027", innovation: "Predicts nursing documentation burden and provides quantified staffing recommendations to reduce administrative workload and improve work-life balance." },
            { num: 4, title: "Trust-Based Alert Prioritization System", desc: "Adaptive clinical alert system with provider trust scoring to reduce alarm fatigue", app: "63/946,187", date: "December 21, 2025", due: "December 21, 2026", innovation: "Patient-specific adaptive thresholds with trust-based prioritization projected to reduce alert fatigue by 40-70% while maintaining patient safety." },
            { num: 5, title: "Clinical Risk Intelligence System", desc: "Real-time multi-outcome risk stratification with explainable AI and temporal forecasting", app: "63/932,953", date: "December 6, 2025", due: "December 6, 2026", innovation: "Unified risk prediction system with SHAP-based explainability, multi-horizon temporal forecasting (4h, 12h, 24h, 48h), and equity monitoring capabilities." },
          ].map((p) => (
            <Card key={p.num}>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <Badge variant="outline">DESIGN PHASE</Badge>
                  </div>
                  <Badge variant="secondary">Patent #{p.num}</Badge>
                </div>
                <CardTitle className="mt-2">{p.title}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Application Number</p>
                    <p className="font-medium text-foreground">{p.app}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Filing Date</p>
                    <p className="font-medium text-foreground">{p.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Non-Provisional Due</p>
                    <p className="font-medium text-foreground">{p.due}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Core Innovation:</strong> {p.innovation}
                </p>
                {p.extra && (
                  <Badge variant="secondary" className="text-xs">{p.extra}</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technical Overview */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Core Technical Innovation</h2>
          <Card>
            <CardHeader>
              <CardTitle>Equipment-Independent Clinical AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                VitaSignal represents a paradigm shift in clinical AI: rather than requiring expensive sensors,
                wearables, or continuous physiological monitoring, the platform extracts predictive signals from
                the temporal patterns in routine clinical documentation.
              </p>
              <div>
                <p className="font-semibold text-foreground mb-2">Key Advantages:</p>
                <ul className="space-y-1">
                  <li>• <strong className="text-foreground">Zero Hardware Cost:</strong> Works with existing EHR systems without additional infrastructure</li>
                  <li>• <strong className="text-foreground">Passive Monitoring:</strong> No additional burden on clinical staff or patients</li>
                  <li>• <strong className="text-foreground">Universal Applicability:</strong> Any healthcare setting with electronic documentation</li>
                  <li>• <strong className="text-foreground">Equity-Focused:</strong> Validated for fairness across patient populations</li>
                  <li>• <strong className="text-foreground">Explainable AI:</strong> SHAP-based interpretability for clinical trust</li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground/70">
                Note: Detailed technical specifications, training methodologies, and performance
                metrics are available to qualified licensing partners under Non-Disclosure Agreement (NDA).
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Research Collaboration */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Research Collaboration Opportunities</h2>
          <Card>
            <CardHeader>
              <CardTitle>Clinical Validation Studies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                VitaSignal technology is available for clinical validation through academic research partnerships.
                We welcome collaborations with:
              </p>
              <ul className="space-y-1">
                <li>• <strong className="text-foreground">Academic Medical Centers:</strong> Retrospective validation studies using de-identified EHR data</li>
                <li>• <strong className="text-foreground">Clinical Informatics Researchers:</strong> Prospective observational studies without clinical intervention</li>
                <li>• <strong className="text-foreground">Quality Improvement Teams:</strong> Interventional trials measuring impact on nurse-sensitive outcomes</li>
              </ul>
              <div>
                <p className="font-semibold text-foreground mb-1">Requirements for Collaboration:</p>
                <ul className="space-y-1">
                  <li>• Institutional affiliation with IRB oversight capability</li>
                  <li>• Access to EHR system (Epic, Cerner, Meditech, or similar)</li>
                  <li>• Executed Data Use Agreement (DUA)</li>
                  <li>• Co-investigator with clinical informatics expertise</li>
                  <li>• CITI Human Subjects Research certification</li>
                </ul>
              </div>
              <Button variant="outline" asChild>
                <a href="mailto:research@dralexis.ceo">Inquire About Research Collaboration</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* IP Status & Disclaimers */}
      <section className="py-12 px-6 bg-destructive/5 border-t border-destructive/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">Important IP Status Information:</p>
              <p>
                All five applications are provisional patents filed under 35 U.S.C. § 111(b).
                Non-provisional applications must be filed by December 2026 - February 2027 to maintain priority dates.
              </p>
              <p>Final patent grants are subject to USPTO examination and are not guaranteed.</p>
              <p>
                Research supported by NIH grants K12 HL138039-06 and 1OT2OD032581. The U.S. Government retains
                certain non-commercial use rights under the Bayh-Dole Act.
              </p>
              <p className="text-destructive">
                VitaSignal systems are research prototypes and are NOT FDA cleared, approved, or authorized for clinical use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Licensing CTA */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Interested in Licensing VitaSignal Technology?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            We're seeking strategic partnerships with EHR vendors, hospital systems, healthcare AI companies,
            and investors to bring VitaSignal to clinical practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:licensing@dralexis.ceo">View Licensing Information</a>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/contact">Contact Us</Link>
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

export default Patents;
