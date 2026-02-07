import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, CheckCircle2, Clock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";

function Patents() {
  return (
    <SiteLayout title="Technology Portfolio" description="5 U.S. provisional patent applications covering equipment-independent clinical AI for ICU mortality prediction and nursing workflow optimization.">
      {/* Hero */}
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
            Sole Inventor: Dr. Alexis Collier, DHA · Filed 2025–2026
          </p>
        </div>
      </section>

      {/* Patent Portfolio */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Patent #1 */}
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
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Validated Research Performance:</p>
                <ul className="space-y-1">
                  <li>• Validated on large-scale ICU research datasets (n=26,153 admissions)</li>
                  <li>• Predictive performance: AUC 0.684 (95% CI: 0.653-0.715)</li>
                  <li>• 11-year temporal validation demonstrating consistency</li>
                  <li>• Equity validation across patient populations</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Core Innovation:</strong> Analyzes temporal patterns in routine clinical documentation to predict
                ICU mortality risk without requiring additional physiological sensors or monitoring equipment.
              </p>
            </CardContent>
          </Card>

          {/* Patents #2-5 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <Badge variant="outline">DESIGN PHASE</Badge>
              </div>
              <CardTitle className="mt-2">4 Additional Patent-Pending Systems</CardTitle>
              <CardDescription>Covering nursing intelligence, documentation burden, alert prioritization, and risk stratification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { title: "Unified Nursing Intelligence Platform", desc: "Integrated workload prediction and staffing optimization" },
                  { title: "Documentation Burden & Staffing System", desc: "ML-based documentation burden prediction with staffing recommendations" },
                  { title: "Trust-Based Alert Prioritization", desc: "Adaptive clinical alerts with provider trust scoring" },
                  { title: "Clinical Risk Intelligence", desc: "Multi-outcome risk stratification with explainable AI" },
                ].map((p) => (
                  <div key={p.title} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <p className="text-sm font-semibold text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Application numbers, filing dates, and detailed claims available to qualified partners under NDA.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:info@alexiscollier.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Request Details Under NDA
                </a>
              </Button>
            </CardContent>
          </Card>
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

      {/* IP Disclaimers */}
      <section className="py-12 px-6 bg-destructive/5 border-t border-destructive/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">Important:</p>
              <p>All five applications are provisional patents. Final patent grants are subject to USPTO examination and are not guaranteed.</p>
              <p>NIH-funded research. The U.S. Government retains certain non-commercial use rights under the Bayh-Dole Act.</p>
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
              <Link to="/licensing">View Licensing Options</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Patents;
