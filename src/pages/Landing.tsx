import { Link } from 'react-router-dom';
import { 
  BarChart3, Shield, Activity, Users, ArrowRight, 
  Brain, Sparkles, Lock, FileText, Presentation, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';
import { TermsAcceptanceModal } from '@/components/TermsAcceptanceModal';
import { QuickStartLauncher } from '@/components/presentation/QuickStartLauncher';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Risk Prediction',
    description: 'Machine learning models analyze patient data to predict nursing-sensitive outcomes.',
  },
  {
    icon: BarChart3,
    title: 'SHAP Explainability',
    description: 'Transparent AI with interpretable risk factor attribution for clinical trust.',
  },
  {
    icon: Activity,
    title: 'Real-Time Monitoring',
    description: 'Continuous risk assessment with live updates and trend analysis.',
  },
  {
    icon: Users,
    title: 'Workflow Integration',
    description: 'Designed for clinical workflows with actionable intervention recommendations.',
  },
];

const pages = [
  {
    to: '/dashboard',
    icon: BarChart3,
    title: 'Quality Dashboard',
    description: 'Explore the clinical dashboard interface',
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  {
    to: '/presentation',
    icon: Presentation,
    title: 'Watch Demo',
    description: '45-minute interactive walkthrough',
    color: 'bg-risk-medium/10 text-risk-medium border-risk-medium/20',
  },
  {
    to: '/about',
    icon: FileText,
    title: 'About & Methodology',
    description: 'Research context and approach',
    color: 'bg-risk-low/10 text-risk-low border-risk-low/20',
  },
];

export const Landing = () => {
  const { isAdmin } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Terms Acceptance Modal */}
      <TermsAcceptanceModal />
      
      {/* Research Prototype Disclaimer */}
      <ResearchDisclaimer />

      {/* Patent Notice Header */}
      <div className="bg-primary/5 border-b border-primary/20 py-2 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-primary">
            <Lock className="w-3 h-3" />
            <span className="font-medium">U.S. Provisional Patent Application No. 63/932,953</span>
            <span className="text-primary/60">•</span>
            <span className="text-primary/80">Patent Pending</span>
          </div>
          
          {/* Auth Status Indicator */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-risk-low/20 border border-risk-low/30">
                <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
                <span className="text-xs font-medium text-risk-low">Admin</span>
              </div>
              <Link 
                to="/auth" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={async (e) => {
                  e.preventDefault();
                  const { supabase } = await import('@/integrations/supabase/client');
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
              >
                Sign Out
              </Link>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, hsl(var(--primary) / 0.05) 0%, transparent 50%)`,
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-primary" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground">NSO Quality Dashboard</h1>
                <span className="text-sm text-muted-foreground">Nurse-Sensitive Outcomes</span>
              </div>
            </div>

            {/* Tagline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              AI-Assisted
              <span className="text-primary"> Nursing Quality</span>
              <br />Monitoring
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
              A research prototype demonstrating predictive analytics for Falls, Pressure Injuries, 
              CAUTI, and Device Complications with explainable AI attribution.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/presentation"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all border border-border"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </Link>
            </div>

            {/* Conference Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Stanford AI+HEALTH 2025
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Start Presentation Section - Only visible to admins */}
      {isAdmin && (
        <section className="py-12 px-6 bg-gradient-to-b from-primary/5 to-transparent border-b border-primary/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Present?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Launch your 45-minute presentation with one click. Includes presenter controls, 
                  audience sync, and pacing timer.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-risk-low" />
                    Auto-opens audience window for screen sharing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-risk-low" />
                    Pre-flight checklist ensures you're ready
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-risk-low" />
                    Visual countdown alerts at 60s, 30s, 10s
                  </li>
                </ul>
              </div>
              <QuickStartLauncher />
            </div>
          </div>
        </section>
      )}

      {/* Navigation Cards */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground text-center mb-10">
            Explore the Prototype
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Link
                key={page.to}
                to={page.to}
                className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 border",
                  page.color
                )}>
                  <page.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {page.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {page.description}
                </p>
                <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground text-center mb-4">
            Key Capabilities
          </h3>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Combining clinical expertise with machine learning for proactive patient safety
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Disclaimer */}
      <section className="py-12 px-6 bg-risk-high/5 border-t border-risk-high/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-risk-high/10 border border-risk-high/20 mb-4">
            <Shield className="w-4 h-4 text-risk-high" />
            <span className="text-sm font-medium text-risk-high">Research Prototype</span>
          </div>
          <p className="text-muted-foreground">
            This is a demonstration prototype using <strong>synthetic data only</strong>. 
            Not connected to any EHR system. Not FDA cleared. All clinical decisions require 
            human verification. <strong>Human-in-the-loop required.</strong>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/30 bg-secondary/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2024–2025 Alexis Collier. All Rights Reserved.</span>
            <span className="text-border">|</span>
            <span className="text-primary font-medium">U.S. Pat. App. 63/932,953 Pending</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link 
              to="/terms" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Use
            </Link>
            <span className="text-border">|</span>
            <a 
              href="mailto:alexis.collier@ung.edu" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              alexis.collier@ung.edu
            </a>
            <span className="text-border">|</span>
            <span className="text-muted-foreground">Research Prototype v0.1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};