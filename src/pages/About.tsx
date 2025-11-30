import { Link } from 'react-router-dom';
import { 
  BarChart3, Home, Brain, Shield, Activity, Users, 
  AlertTriangle, CheckCircle, ArrowRight, Lock, FileText,
  Lightbulb, Target, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

const riskCategories = [
  {
    name: 'Falls',
    icon: '🚶',
    description: 'Patient fall events during hospitalization',
    factors: ['Sedation timing', 'Mobility status', 'Age', 'Delirium', 'Medication effects'],
  },
  {
    name: 'Pressure Injuries',
    icon: '🛏️',
    description: 'Hospital-acquired pressure injuries (HAPI)',
    factors: ['Immobility duration', 'Braden score', 'Nutrition status', 'Moisture', 'Repositioning compliance'],
  },
  {
    name: 'CAUTI',
    icon: '⚕️',
    description: 'Catheter-Associated Urinary Tract Infections',
    factors: ['Catheter duration', 'Bundle compliance', 'Removal timing', 'Symptom presentation'],
  },
  {
    name: 'Device Complications',
    icon: '💉',
    description: 'Central line and device-related complications',
    factors: ['Dwell time', 'Site assessment', 'Aseptic technique', 'Daily necessity review'],
  },
];

const shapExplanation = [
  {
    title: 'What is SHAP?',
    content: 'SHAP (SHapley Additive exPlanations) is a game-theoretic approach to explain ML model outputs. It assigns each feature an importance value for a particular prediction.',
  },
  {
    title: 'Why SHAP for Clinical AI?',
    content: 'Healthcare requires explainable AI. Clinicians need to understand WHY a patient is flagged as high-risk, not just that they are. SHAP provides transparent, interpretable risk attribution.',
  },
  {
    title: 'How We Use It',
    content: 'Each risk factor shown in the dashboard has a SHAP contribution value. Positive values increase risk, negative values decrease it. This helps nurses prioritize interventions.',
  },
];

export const About = () => {
  return (
    <div className="min-h-screen bg-background">
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
                <span className="text-[10px] text-muted-foreground">Research Context</span>
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

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Introduction */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Project Overview</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              The <strong className="text-foreground">NSO Quality Dashboard</strong> is a research prototype 
              demonstrating the application of machine learning to predict and prevent nurse-sensitive outcomes 
              in acute care settings. By combining real-time patient data with explainable AI, the system aims 
              to support clinical decision-making while maintaining transparency and human oversight.
            </p>
          </div>
          
          <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Core Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Unlike black-box risk scores, this prototype uses SHAP-based explainability to show 
                  nurses exactly which factors contribute to each patient&apos;s risk level, enabling 
                  targeted interventions and building trust in AI-assisted clinical workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Categories */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Risk Categories</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {riskCategories.map((category) => (
              <div 
                key={category.name}
                className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.factors.map((factor) => (
                    <span 
                      key={factor}
                      className="text-[10px] px-2 py-1 rounded-full bg-secondary text-muted-foreground"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SHAP Explainability */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">SHAP Explainability</h2>
          </div>
          
          <div className="space-y-4">
            {shapExplanation.map((item, index) => (
              <div 
                key={item.title}
                className="p-5 rounded-xl bg-card border border-border/50"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual SHAP Example */}
          <div className="mt-8 p-6 rounded-xl bg-secondary/50 border border-border/50">
            <h4 className="font-semibold text-foreground mb-4">Example: Fall Risk Attribution</h4>
            <div className="space-y-3">
              {[
                { factor: 'Recent sedation (4h ago)', value: 0.32, direction: 'increases' },
                { factor: 'Mobility limitations', value: 0.28, direction: 'increases' },
                { factor: 'Age > 65', value: 0.12, direction: 'increases' },
                { factor: 'Bed alarm active', value: -0.08, direction: 'decreases' },
              ].map((item) => (
                <div key={item.factor} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{item.factor}</span>
                      <span className={cn(
                        "text-xs font-medium",
                        item.value > 0 ? "text-risk-high" : "text-risk-low"
                      )}>
                        {item.value > 0 ? '+' : ''}{(item.value * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          item.value > 0 ? "bg-risk-high" : "bg-risk-low"
                        )}
                        style={{ width: `${Math.abs(item.value) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Human-in-the-Loop */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Human-in-the-Loop Design</h2>
          </div>
          
          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-500 mb-2">Critical Design Principle</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This system is designed to <strong className="text-foreground">support</strong>, not replace, 
                  clinical judgment. Every AI-generated risk score and recommendation requires human verification 
                  before any clinical action is taken.
                </p>
                <ul className="space-y-2">
                  {[
                    'AI provides decision support, nurses make decisions',
                    'All predictions display confidence intervals',
                    'Risk factors are transparent and verifiable',
                    'Override and feedback mechanisms built-in',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-risk-low flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-16">
          <div className="p-6 rounded-xl bg-risk-high/10 border border-risk-high/30">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-risk-high flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-risk-high mb-2">Research Prototype Disclaimer</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• All data shown is <strong className="text-foreground">synthetic</strong> and for demonstration only</li>
                  <li>• Not connected to any Electronic Health Record system</li>
                  <li>• Not FDA cleared or approved for clinical use</li>
                  <li>• Intended for research and educational purposes only</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Patent Pending</span>
          </div>
          
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
              <Activity className="w-4 h-4" />
              <span>Watch Demo</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/30 bg-secondary/30 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 All Rights Reserved</span>
            <span className="text-border">|</span>
            <span className="text-primary font-medium">Patent Pending</span>
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
};