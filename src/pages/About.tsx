import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, FileText, Home, Brain, TrendingUp, Clock, Target, RefreshCw,
  Shield, Database, Users, Zap, ChevronDown, ChevronUp, Mail, Linkedin,
  GraduationCap, BookOpen, ExternalLink
} from 'lucide-react';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuditLog } from '@/hooks/useAuditLog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const faqs = [
  {
    question: "What is the NSO Quality Dashboard?",
    answer: "It's a research prototype demonstrating how AI can help nurses identify patients at risk for nurse-sensitive outcomes like falls, pressure injuries, and hospital-acquired infections. All data shown is simulated for demonstration purposes."
  },
  {
    question: "Is this system ready for clinical use?",
    answer: "No. This is a research prototype intended for educational and demonstration purposes only. It has not been validated for clinical use and is not FDA cleared or approved."
  },
  {
    question: "How does the risk prediction work?",
    answer: "The system uses machine learning algorithms that analyze multiple patient factors to generate risk scores. SHAP (SHapley Additive exPlanations) values are used to explain which factors contribute most to each prediction."
  },
  {
    question: "What outcomes does the system track?",
    answer: "The prototype focuses on nurse-sensitive outcomes including falls, pressure injuries, CAUTI (catheter-associated urinary tract infections), CLABSI (central line-associated bloodstream infections), sepsis, and respiratory deterioration."
  },
  {
    question: "Can I use this for my research?",
    answer: "For research collaboration or licensing inquiries, please contact Alexis Collier at alexis.collier@ung.edu. Note that this technology is patent pending."
  }
];

const publications = [
  {
    title: "Predictive Analytics in Nursing: A Framework for Nurse-Sensitive Outcome Prediction",
    authors: "Collier, A.",
    venue: "University of North Georgia Research",
    year: "2024",
    type: "Working Paper",
    status: "In Progress"
  },
  {
    title: "Explainable AI for Clinical Decision Support: SHAP-Based Risk Visualization",
    authors: "Collier, A.",
    venue: "Healthcare Informatics Research",
    year: "2025",
    type: "Manuscript",
    status: "In Preparation"
  },
  {
    title: "System and Method for Predicting Nurse-Sensitive Patient Outcomes",
    authors: "Collier, A.",
    venue: "U.S. Patent Application",
    year: "2024",
    type: "Patent",
    status: "Pending"
  }
];


function About() {
  const { logAction } = useAuditLog();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    logAction({
      action: 'view',
      resource_type: 'about_page',
      details: {
        page: 'about',
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ResearchDisclaimer />
      
      {/* Header */}
      <header className="border-b border-border/40 bg-secondary/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="p-2 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to Home"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">About This Research</h1>
                <span className="text-[10px] text-muted-foreground">Patent Pending</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
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
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="gap-1">
              <Award className="w-3 h-3" aria-hidden="true" />
              Research Prototype
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Shield className="w-3 h-3" aria-hidden="true" />
              Patent Pending
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Clinical Risk Intelligence</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            An AI-powered system designed to help nurses identify and respond to patient deterioration 
            through predictive analytics and real-time monitoring.
          </p>
        </div>
      </div>

      <main id="main-content" className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Team Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-primary" aria-hidden="true" />
              <CardTitle>Research Team</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Meet the team behind this research
            </p>
          </CardHeader>
          <CardContent>
            <div className="p-6 rounded-lg border border-border bg-secondary/30">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-primary">AC</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">Alexis Collier</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Principal Investigator • University of North Georgia
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    College of Health Sciences & Professions. Research focuses on the intersection 
                    of artificial intelligence and nursing practice, with emphasis on improving 
                    patient outcomes through predictive analytics.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href="mailto:alexis.collier@ung.edu">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://linkedin.com/in/alexiscollier" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publications & Research */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
              <CardTitle>Publications & Research</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Academic work and intellectual property related to this project
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {publications.map((pub, index) => (
              <div key={index} className="p-4 rounded-lg border border-border bg-secondary/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={pub.type === "Patent" ? "default" : "secondary"} className="text-xs">
                        {pub.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {pub.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{pub.title}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{pub.authors}</p>
                    <p className="text-xs text-muted-foreground">
                      {pub.venue} • {pub.year}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-2">
              For citation requests or research collaboration inquiries, please contact the principal investigator.
            </p>
          </CardContent>
        </Card>

        {/* Core Capabilities */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-primary" aria-hidden="true" />
              <CardTitle>Core Capabilities</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Key features designed to support clinical decision-making
            </p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold mb-2">Risk Prediction</h3>
                  <p className="text-sm text-muted-foreground">
                    Machine learning models that analyze patient data to identify early warning signs 
                    of potential complications.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-primary mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold mb-2">Explainable AI</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear explanations of why the system flags certain patients, helping clinicians 
                    understand and trust the recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold mb-2">Temporal Forecasting</h3>
                  <p className="text-sm text-muted-foreground">
                    Projections of how patient risk may evolve over time, enabling proactive 
                    rather than reactive care.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold mb-2">Adaptive Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Personalized alert thresholds that reduce alarm fatigue while maintaining 
                    sensitivity to true clinical changes.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-primary mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold mb-2">Intervention Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitors the effectiveness of clinical interventions by tracking patient 
                    response over time.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold mb-2">Workload Prioritization</h3>
                  <p className="text-sm text-muted-foreground">
                    Helps nurses focus on patients who need attention most urgently based on 
                    multiple clinical factors.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
              <CardTitle>Frequently Asked Questions</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Common questions about this research prototype
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {faqs.map((faq, index) => (
              <Collapsible key={index} open={openFaq === index} onOpenChange={() => setOpenFaq(openFaq === index ? null : index)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto text-left hover:bg-secondary/50"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Target Outcomes */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" aria-hidden="true" />
              <CardTitle>Nurse-Sensitive Outcomes</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Focused on outcomes where nursing interventions can make a measurable difference
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Falls Prevention</Badge>
              <Badge variant="secondary">Pressure Injury Prevention</Badge>
              <Badge variant="secondary">CAUTI Prevention</Badge>
              <Badge variant="secondary">CLABSI Prevention</Badge>
              <Badge variant="secondary">Sepsis Early Detection</Badge>
              <Badge variant="secondary">Respiratory Deterioration</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Research Status */}
        <Card className="border-warning/30">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-warning" aria-hidden="true" />
              <CardTitle>Research Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border border-warning/30 bg-warning/5">
              <p className="text-sm font-medium mb-2">This is a Research Prototype</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Uses synthetic data for demonstration purposes</li>
                <li>• Not validated for clinical use</li>
                <li>• Requires IRB approval and clinical trials before deployment</li>
                <li>• Patent application pending</li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">
              For licensing inquiries or research collaboration, please contact us through appropriate channels.
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-border bg-secondary/30 py-6">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Research Prototype • Patent Pending • Not for Clinical Use</p>
        </div>
      </footer>
    </div>
  );
}

export default About;