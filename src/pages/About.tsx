import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, FileText, Home, Brain, TrendingUp, Clock, Target, RefreshCw,
  Shield, Database, Users, Zap
} from 'lucide-react';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuditLog } from '@/hooks/useAuditLog';

function About() {
  const { logAction } = useAuditLog();

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
