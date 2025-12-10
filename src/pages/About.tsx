import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, FileText, Users, Target, Lightbulb, Shield, Brain, TrendingUp, Home, BarChart3, AlertTriangle, Clock, Zap, RefreshCw } from 'lucide-react';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';

function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Research Prototype Disclaimer */}
      <ResearchDisclaimer />
      {/* Header */}
      <header className="border-b border-border/40 bg-secondary/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="p-2 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">About & Methodology</h1>
                <span className="text-[10px] text-muted-foreground">U.S. Pat. App. 63/932,953 Pending</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              View Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-r from-primary/10 via-accent/5 to-background">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="gap-1">
              <Award className="w-3 h-3" />
              U.S. Provisional Patent Application No. 63/932,953
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Clinical Risk Intelligence System</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            Integrated Explainability, Temporal Forecasting, Adaptive Thresholds, and Closed-Loop Intervention Feedback
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Patent-Worthy Innovations */}
        <Card className="border-accent/30">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-accent" />
              <CardTitle>Key Patent Claims</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Novel technical contributions combining real-time risk prediction, explainability, forecasting, and closed-loop feedback
            </p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Integrated Explainability Engine</h3>
                  <p className="text-sm text-muted-foreground">
                    Computes feature attributions using SHAP values for each risk prediction and generates 
                    clinician-readable explanations mapping said attributions to clinical concepts. Extends 
                    to both current predictions and temporal forecasts.
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Claims 1, 4, 8, 17
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Multi-Horizon Temporal Forecasting</h3>
                  <p className="text-sm text-muted-foreground">
                    Generates risk forecasts at 4, 12, 24, and 48-hour intervals. Classifies trajectory 
                    patterns as stable, improving, deteriorating, or volatile. Identifies inflection 
                    points for timely intervention.
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Claims 1, 5, 22, 24
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Patient-Adaptive Alert Thresholds</h3>
                  <p className="text-sm text-muted-foreground">
                    Adjusts alert thresholds for individual patients based on patient-specific baseline 
                    risk, historical volatility, and clinical context. Achieves 40-70% reduction in 
                    false-positive alerts compared to fixed thresholds.
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Claims 1, 6, 18, 23
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Closed-Loop Intervention Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically detects clinical interventions, captures pre-intervention state, 
                    recalculates risk after intervention-specific delays, and provides quantified 
                    impact assessments to clinicians.
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Claims 1, 7, 19, 25
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Multi-Outcome Risk Prediction</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensemble ML architecture generating predictions for multiple outcomes: sepsis, 
                    respiratory failure, cardiac arrest, acute kidney injury, falls, pressure injuries, 
                    and catheter-associated infections.
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Claims 1, 2, 3, 15
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Intelligent Workload Prioritization</h3>
                  <p className="text-sm text-muted-foreground">
                    Ranks patients by composite priority scores incorporating current risk level, 
                    trajectory slope, forecast uncertainty, temporal volatility, and time since 
                    last clinical review.
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Claims 1, 9
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinical Validation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle>Validation & Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Disclaimer Banner */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-600 dark:text-amber-400">
                <strong>Important:</strong> Metrics represent observed results in controlled validation studies using synthetic data. 
                Actual performance may vary based on institutional implementation, clinical workflows, and deployment contexts.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">False Positive Reduction</p>
                <p className="text-2xl font-bold">40-70%</p>
                <p className="text-xs text-muted-foreground mt-1">vs. fixed thresholds</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Advance Warning</p>
                <p className="text-2xl font-bold">6-48 hrs</p>
                <p className="text-xs text-muted-foreground mt-1">before deterioration</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Clinician Trust</p>
                <p className="text-2xl font-bold">&gt;80%</p>
                <p className="text-xs text-muted-foreground mt-1">vs. &lt;50% for black-box</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Forecast Horizons</p>
                <p className="text-2xl font-bold">4-48 hrs</p>
                <p className="text-xs text-muted-foreground mt-1">multi-horizon prediction</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-3">Target Clinical Outcomes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-risk-low" />
                  <span className="text-muted-foreground">Reduced unplanned ICU transfers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-risk-low" />
                  <span className="text-muted-foreground">Reduced sepsis mortality</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-risk-low" />
                  <span className="text-muted-foreground">Reduced preventable falls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-risk-low" />
                  <span className="text-muted-foreground">Reduced pressure injuries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-risk-low" />
                  <span className="text-muted-foreground">Reduced catheter-associated infections</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-risk-low" />
                  <span className="text-muted-foreground">Faster intervention escalation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Architecture */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <CardTitle>System Architecture</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-foreground font-semibold text-base">Core Components</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <strong className="text-foreground">Unified Data Ingestion:</strong> HL7 messages, FHIR resources, direct database queries, and real-time monitoring feeds aligned to patient-specific timelines
                </li>
                <li>
                  <strong className="text-foreground">Ensemble ML Architecture:</strong> Gradient boosting, recurrent neural networks, and transformer models with confidence intervals and uncertainty quantification
                </li>
                <li>
                  <strong className="text-foreground">SHAP Explainability:</strong> Feature attributions translated into clinical narratives using familiar terminology
                </li>
                <li>
                  <strong className="text-foreground">Real-Time Processing:</strong> Sub-second latency with streaming message queues for continuous monitoring
                </li>
                <li>
                  <strong className="text-foreground">Immutable Audit Trail:</strong> Comprehensive logging linking data inputs → predictions → explanations → interventions → outcomes
                </li>
              </ul>

              <h3 className="text-foreground font-semibold mt-6 text-base">Inventive Step</h3>
              <p className="text-muted-foreground text-sm">
                The novelty lies not in individual algorithms, but in how components are integrated:
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><strong className="text-foreground">Synergistic Integration:</strong> Modules actively enhance one another—explainability works on predictions and forecasts, intervention detection triggers recalculation</li>
                <li><strong className="text-foreground">Closed-Loop Feedback:</strong> Continuous cycle where interventions modify predictions, and updated predictions inform subsequent interventions</li>
                <li><strong className="text-foreground">Temporal Explainability:</strong> Explains how risk changes over time and identifies which factors drive trajectory shifts</li>
                <li><strong className="text-foreground">Human-Factors Design:</strong> Risk explanations use clinical terminology; thresholds adapt to individual patients</li>
              </ul>

              <h3 className="text-foreground font-semibold mt-6 text-base">Human-in-the-Loop Design</h3>
              <p className="text-muted-foreground text-sm">
                Critical to clinical safety—the system emphasizes decision support, not autonomous action:
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>All predictions require clinician acknowledgment before triggering escalation</li>
                <li>Clinical overrides are captured and feed back into model refinement</li>
                <li>Intervention outcomes are tracked to validate prediction accuracy</li>
                <li>Role-specific explanations tailored to nurses, physicians, and rapid response teams</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Team & Contact */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle>Inventor</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Alexis Collier</h3>
                <p className="text-sm text-muted-foreground">
                  Individual Inventor (Pro se filing)<br />
                  University of North Georgia<br />
                  <a href="mailto:alexis.collier@ung.edu" className="text-primary hover:underline">
                    alexis.collier@ung.edu
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Patent Information</h3>
                <p className="text-sm text-muted-foreground">
                  U.S. Provisional Patent Application<br />
                  No. 63/932,953<br />
                  Filed: December 2025
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader>
            <CardTitle className="text-warning flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Important Disclaimers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong className="text-foreground">Research Prototype:</strong> This system is a research prototype 
              demonstrating patent-pending technology. It is not FDA cleared and not approved for clinical use.
              All clinical decisions require qualified human judgment.
            </p>
            <p>
              <strong className="text-foreground">Synthetic Data:</strong> All patient data shown in demonstrations is 
              synthetic and contains no protected health information. The system preserves statistical properties 
              and temporal dependencies of real clinical data for validation purposes.
            </p>
            <p>
              <strong className="text-foreground">Patent Status:</strong> Technology described herein is subject to 
              U.S. Provisional Patent Application No. 63/932,953 filed December 2025. Unauthorized reproduction 
              or commercial use is prohibited.
            </p>
            <p>
              <strong className="text-foreground">Conference Presentation:</strong> This demonstration is prepared for 
              Stanford AI+HEALTH 2025 and represents a research prototype under active development.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center pt-8">
          <h3 className="text-xl font-bold text-foreground mb-4">Ready to Explore?</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            See the prototype in action with our interactive dashboard or guided presentation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Dashboard</span>
            </Link>
            <Link
              to="/presentation"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors border border-border"
            >
              <FileText className="w-4 h-4" />
              <span>Watch Demo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/30 bg-secondary/30 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2024-2025 Alexis Collier. All Rights Reserved.</span>
            <span className="text-border">|</span>
            <span className="text-primary font-medium flex items-center gap-1">
              <Award className="w-3 h-3" />
              U.S. Pat. App. 63/932,953 Pending
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a 
              href="mailto:alexis.collier@ung.edu" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              alexis.collier@ung.edu
            </a>
            <span className="text-border">|</span>
            <span className="text-muted-foreground">Stanford AI+HEALTH 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;
