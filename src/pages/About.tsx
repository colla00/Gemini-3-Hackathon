import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, FileText, Users, Target, Lightbulb, Shield, Brain, TrendingUp, Home, BarChart3, AlertTriangle } from 'lucide-react';
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
                <span className="text-[10px] text-muted-foreground">Patent-Pending Research</span>
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
              Patent-Pending Technology
            </Badge>
            <Badge variant="outline" className="gap-1">
              <FileText className="w-3 h-3" />
              IRB #2025-001
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">NSO Quality Dashboard</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Novel AI/ML System for Nurse-Sensitive Outcomes Risk Prediction with 
            SHAP-Based Explainability and Clinical Workflow Integration
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Patent-Worthy Innovations */}
        <Card className="border-accent/30">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-accent" />
              <CardTitle>Patent-Pending Innovations</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Novel technical contributions to healthcare AI/ML systems
            </p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Real-Time SHAP Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    First-of-its-kind system integrating SHapley Additive exPlanations (SHAP) 
                    with real-time EHR data streams. Enables sub-5-minute interpretable risk 
                    attribution updates integrated directly into clinical workflows.
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    US Patent Pending (2024)
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Clinical Context Mapping</h3>
                  <p className="text-sm text-muted-foreground">
                    Novel algorithm translating SHAP feature attributions into actionable 
                    clinical interventions. Maps ML predictions to evidence-based nursing 
                    protocols with confidence scoring.
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Patent Claim #2
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Intervention Efficacy Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Closed-loop validation system measuring real-world intervention outcomes. 
                    Enables continuous model refinement based on actual clinical effectiveness 
                    rather than retrospective data alone.
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Patent Claim #3
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Temporal Stability Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Novel confidence quantification method analyzing prediction consistency 
                    across 24-hour windows. Flags unreliable predictions requiring additional 
                    human assessment.
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Patent Claim #4
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
              <CardTitle>Clinical Validation & Research Protocol</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Disclaimer Banner */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-600 dark:text-amber-400">
                <strong>Important:</strong> All metrics below are illustrative targets based on synthetic demonstration data. 
                No clinical validation studies have been completed yet. Actual performance will be determined through planned prospective studies.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">IRB Protocol</p>
                <p className="text-2xl font-bold">Planned</p>
                <p className="text-xs text-muted-foreground mt-1">Submission in preparation</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Target Validation Cohort</p>
                <p className="text-2xl font-bold">N≈3,000</p>
                <p className="text-xs text-muted-foreground mt-1">Multi-site patients (planned)</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Target Outcome</p>
                <p className="text-2xl font-bold">30-40% ↓</p>
                <p className="text-xs text-muted-foreground mt-1">Fall reduction goal</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-3">Illustrative Model Performance Targets</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Target AUC-ROC</p>
                  <p className="text-xl font-bold">0.85+</p>
                  <p className="text-xs text-amber-500 mt-1">Goal metric</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Target Sensitivity</p>
                  <p className="text-xl font-bold">80%+</p>
                  <p className="text-xs text-amber-500 mt-1">Goal metric</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Target Specificity</p>
                  <p className="text-xl font-bold">80%+</p>
                  <p className="text-xs text-amber-500 mt-1">Goal metric</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Target PPV</p>
                  <p className="text-xl font-bold">70%+</p>
                  <p className="text-xs text-amber-500 mt-1">Goal metric</p>
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
              <CardTitle>Technical Methodology</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-foreground font-semibold text-base">Proposed Machine Learning Pipeline</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <strong className="text-foreground">Algorithm:</strong> XGBoost ensemble with SHAP post-hoc explainability (proposed)
                </li>
                <li>
                  <strong className="text-foreground">Planned Training Set:</strong> Target ~45,000 patient-days from multiple academic medical centers
                </li>
                <li>
                  <strong className="text-foreground">Features:</strong> ~127 EHR-derived variables including vitals, labs, medications, mobility assessments
                </li>
                <li>
                  <strong className="text-foreground">Target Outcomes:</strong> Falls, pressure injuries, hospital-acquired infections
                </li>
                <li>
                  <strong className="text-foreground">Real-Time Integration:</strong> Designed for sub-5-minute data refresh via HL7 FHIR streams
                </li>
              </ul>

              <h3 className="text-foreground font-semibold mt-6 text-base">Novel SHAP Integration</h3>
              <p className="text-muted-foreground text-sm">
                Traditional SHAP implementations operate on static batch predictions. This system introduces 
                a novel streaming SHAP computation architecture that:
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>Computes Shapley values incrementally as new EHR data arrives</li>
                <li>Maps feature attributions to clinical terminology and intervention protocols</li>
                <li>Maintains temporal consistency scoring to quantify prediction reliability</li>
                <li>Integrates directly into nursing workflow tools with sub-second latency</li>
              </ul>

              <h3 className="text-foreground font-semibold mt-6 text-base">Human-in-the-Loop Design</h3>
              <p className="text-muted-foreground text-sm">
                Critical to clinical safety and patent claims is the explicit human validation loop:
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>All predictions require nurse acknowledgment before triggering alerts</li>
                <li>Clinical overrides are captured and feed back into model refinement</li>
                <li>Intervention outcomes are tracked to validate prediction accuracy</li>
                <li>System emphasizes decision support, not autonomous action</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Team & Contact */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle>Research Team & Collaborators</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Principal Investigator</h3>
                <p className="text-sm text-muted-foreground">
                  Alexis Collier, PhD, RN<br />
                  University of North Georgia<br />
                  <a href="mailto:alexis.collier@ung.edu" className="text-primary hover:underline">
                    alexis.collier@ung.edu
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Institutional Partners</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Stanford Medicine - Clinical validation</li>
                  <li>• UCSF Health - Implementation site</li>
                  <li>• University of North Georgia - Lead institution</li>
                </ul>
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
              <strong className="text-foreground">Research Prototype:</strong> This system is a research prototype under active 
              development and IRB oversight. It is not FDA-cleared and not approved for clinical use 
              without supervision.
            </p>
            <p>
              <strong className="text-foreground">Synthetic Data:</strong> All patient data shown in demos is synthetic or 
              de-identified per IRB protocol. No real patient information is displayed or stored.
            </p>
            <p>
              <strong className="text-foreground">Patent Status:</strong> Technology described herein is subject to pending 
              US patent applications filed in 2024. Unauthorized reproduction or commercial use 
              is prohibited.
            </p>
            <p>
              <strong className="text-foreground">Conference Presentation:</strong> This demonstration is prepared for the 
              Stanford AI+HEALTH 2025 conference and represents work-in-progress.
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
            <span>© 2025 All Rights Reserved</span>
            <span className="text-border">|</span>
            <span className="text-primary font-medium flex items-center gap-1">
              <Award className="w-3 h-3" />
              Patent Pending
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
