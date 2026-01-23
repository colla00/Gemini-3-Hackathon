import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, FileText, Home, Brain, TrendingUp, Clock, Target, RefreshCw,
  Shield, Database, Users, ChevronDown, ChevronUp, Mail, Linkedin,
  GraduationCap, Scale, Cpu, CheckCircle2
} from 'lucide-react';
import { CAPABILITIES, PATENT_FAMILIES, getPatentFamily } from '@/constants/capabilities';
import { cn } from '@/lib/utils';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuditLog } from '@/hooks/useAuditLog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PATENT_PORTFOLIO } from '@/constants/patent';
import alexisPhoto from '@/assets/alexis-collier.png';

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
    answer: "For research collaboration or licensing inquiries, please contact Dr. Alexis Collier at info@alexiscollier.com. Note that this technology is protected by 4 U.S. patent applications."
  }
];

function About() {
  const { logAction } = useAuditLog();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const filedPatents = PATENT_PORTFOLIO.filter(p => p.status === 'filed');

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
                <span className="text-[10px] text-muted-foreground">{filedPatents.length} U.S. Patents Filed</span>
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
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge variant="outline" className="gap-1">
              <Award className="w-3 h-3" aria-hidden="true" />
              Research Prototype
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Shield className="w-3 h-3" aria-hidden="true" />
              {filedPatents.length} U.S. Patents Filed
            </Badge>
            <Badge variant="secondary" className="gap-1 bg-accent/10 text-accent border-accent/30">
              <FileText className="w-3 h-3" aria-hidden="true" />
              80+ Claims
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">NSO Quality Dashboard</h1>
          <p className="text-base text-muted-foreground max-w-2xl mb-4">
            With Integrated Explainability, Temporal Forecasting, Adaptive Thresholds, and Closed-Loop Intervention Feedback
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl">
            A patent-protected AI-powered system designed to help nurses identify and respond to patient deterioration 
            through predictive analytics and real-time monitoring. {filedPatents.length} U.S. patent applications filed under 35 U.S.C. § 111(b).
          </p>
        </div>
      </div>

      <main id="main-content" className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Patent Portfolio */}
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" aria-hidden="true" />
                <CardTitle className="text-base">U.S. Patent Portfolio</CardTitle>
              </div>
              <Badge variant="outline" className="bg-risk-low/10 border-risk-low/30 text-risk-low">
                {filedPatents.length} Patents Filed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Patent List - Simplified for IP Protection */}
            <div className="grid gap-2">
              {PATENT_PORTFOLIO.map((patent) => (
                <div 
                  key={patent.id} 
                  className="p-3 rounded-lg bg-background/50 border border-border/30 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {patent.shortName}
                    </h4>
                    {patent.status === 'filed' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-risk-low shrink-0" />
                    )}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={patent.status === 'filed' 
                      ? 'bg-risk-low/10 border-risk-low/30 text-risk-low text-[10px]' 
                      : 'bg-warning/10 border-warning/30 text-warning text-[10px]'
                    }
                  >
                    {patent.status === 'filed' ? 'Filed' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-background/50 border border-border/30">
                <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-medium block text-foreground">IP Protected</span>
                  <span className="text-muted-foreground">35 U.S.C. § 111(b)</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-background/50 border border-border/30">
                <Cpu className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-medium block text-foreground">80+ Claims</span>
                  <span className="text-muted-foreground">4 integrated systems</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-background/50 border border-border/30">
                <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-medium block text-foreground">Inventor</span>
                  <span className="text-muted-foreground">Dr. Alexis Collier</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <img 
                  src={alexisPhoto} 
                  alt="Dr. Alexis Collier" 
                  className="w-20 h-20 rounded-full object-cover object-top border-2 border-primary/40 shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">Dr. Alexis Collier</h3>
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
                      <a href="mailto:info@alexiscollier.com">
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

        {/* Core Capabilities - Using Centralized Config */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-primary" aria-hidden="true" />
              <CardTitle>Core Capabilities</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Key features designed to support clinical decision-making
            </p>
            {/* Patent Family Legend */}
            <div className="flex flex-wrap gap-3 mt-3">
              {Object.values(PATENT_FAMILIES).map((family) => (
                <div key={family.id} className="flex items-center gap-1.5 text-xs">
                  <span className={cn("w-2 h-2 rounded-full", family.dotClass)} />
                  <span className="text-muted-foreground">{family.shortName}</span>
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {CAPABILITIES.map((capability) => {
              const family = getPatentFamily(capability.patentFamilyId);
              const IconComponent = capability.icon;
              
              return (
                <div 
                  key={capability.id}
                  className={cn(
                    "p-4 rounded-lg border bg-secondary/30",
                    family?.borderClass || "border-border"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className={cn("w-5 h-5 mt-1", family?.colorClass || "text-primary")} aria-hidden="true" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{capability.title}</h3>
                        <span className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded border",
                          family?.bgClass,
                          family?.borderClass,
                          family?.colorClass
                        )}>
                          {family?.shortName}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {capability.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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

        {/* Target Outcomes - All Patents */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" aria-hidden="true" />
              <CardTitle>Target Outcomes & Applications</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Integrated capabilities across all 4 patent filings
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Clinical Risk Intelligence - Patent #2 */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-risk-high" />
                Clinical Risk Outcomes
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Falls Prevention</Badge>
                <Badge variant="secondary">Pressure Injury Prevention</Badge>
                <Badge variant="secondary">CAUTI Prevention</Badge>
                <Badge variant="secondary">CLABSI Prevention</Badge>
                <Badge variant="secondary">Sepsis Early Detection</Badge>
                <Badge variant="secondary">Respiratory Deterioration</Badge>
              </div>
            </div>
            
            {/* Trust-Based Alert System - Patent #1 */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Alert Optimization
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Trust Score Calibration</Badge>
                <Badge variant="secondary">Alert Fatigue Reduction</Badge>
                <Badge variant="secondary">Provider Response Patterns</Badge>
                <Badge variant="secondary">Cognitive Load Management</Badge>
              </div>
            </div>
            
            {/* Unified Nursing Intelligence - Patent #3 */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Unified Intelligence
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Multi-Outcome Prediction</Badge>
                <Badge variant="secondary">Workload Optimization</Badge>
                <Badge variant="secondary">Staffing Recommendations</Badge>
                <Badge variant="secondary">Equity Monitoring</Badge>
              </div>
            </div>
            
            {/* DBS System - Patent #4 */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-warning" />
                Documentation Burden
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">DBS Prediction</Badge>
                <Badge variant="secondary">Quartile Classification</Badge>
                <Badge variant="secondary">Administrative Burden Reduction</Badge>
                <Badge variant="secondary">Real-Time Workload Scoring</Badge>
              </div>
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
                <li>• Not FDA cleared or approved</li>
                <li>• Requires IRB approval and clinical trials before deployment</li>
                <li>• All intellectual property rights reserved</li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025–2026 Dr. Alexis Collier. All rights reserved. {filedPatents.length} U.S. Patents Filed pursuant to 35 U.S.C. § 111(b). 
              For licensing inquiries or research collaboration, please contact info@alexiscollier.com.
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-border bg-secondary/30 py-6">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-muted-foreground space-y-1">
          <p>© {new Date().getFullYear()} Dr. Alexis Collier. All Rights Reserved.</p>
          <p>NSO Quality Dashboard • {filedPatents.length} U.S. Patents Filed · 35 U.S.C. § 111(b) • Not for Clinical Use</p>
        </div>
      </footer>
    </div>
  );
}

export default About;
