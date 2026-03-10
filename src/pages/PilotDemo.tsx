import { useState } from 'react';
import { motion } from 'framer-motion';
import { SiteLayout } from '@/components/layout/SiteLayout';
import {
  Activity, Shield, TrendingUp, CheckCircle2, ArrowRight,
  Building2, Stethoscope, BarChart3, Clock, DollarSign, FileText,
  ChevronRight, Users, Zap, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const PilotValueProp = ({ icon: Icon, title, metric, description }: {
  icon: React.ElementType; title: string; metric: string; description: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="rounded-2xl border border-border/50 bg-card p-6 space-y-3"
  >
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <div className="text-2xl font-bold text-primary">{metric}</div>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

const TimelineStep = ({ step, title, description, active }: {
  step: number; title: string; description: string; active?: boolean;
}) => (
  <div className={`flex gap-4 ${active ? 'opacity-100' : 'opacity-60'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
      active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
    }`}>
      {step}
    </div>
    <div className="pb-8 border-l border-border/30 pl-4 -ml-4">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

const PilotDemo = () => {
  const navigate = useNavigate();

  return (
    <SiteLayout
      title="VitaSignal Pilot Program | Equipment-Independent Clinical AI"
      description="Deploy validated clinical AI with zero hardware costs. 90-day pilot program for hospital systems seeking to improve patient safety and reduce nursing burden."
    >
      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Badge variant="outline" className="mb-4 text-xs">
            <Activity className="w-3 h-3 mr-1" /> Pilot Program
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            Deploy Clinical AI<br />
            <span className="text-primary">Without Buying Hardware</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            VitaSignal works with your existing EHR. No sensors. No wearables. No capital expenditure.
            Just validated AI that predicts patient deterioration from documentation patterns
            your nurses are already generating.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={() => navigate('/contact')}>
              Schedule Pilot Discussion <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
              View Technology Demo <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            The Problems We Solve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: 'Missed Deterioration', stat: '80%', desc: 'of ICU cardiac arrests have warning signs hours before the event that current systems miss' },
              { icon: Users, title: 'Nursing Burnout', stat: '45%', desc: 'of ICU nurses report burnout related to documentation burden and alarm fatigue' },
              { icon: DollarSign, title: 'Hardware Costs', stat: '$50K+', desc: 'per bed for traditional continuous monitoring systems, creating access disparities' },
            ].map(item => (
              <div key={item.title} className="rounded-xl border border-border/50 bg-card p-6 text-center space-y-3">
                <item.icon className="w-8 h-8 text-destructive mx-auto" />
                <div className="text-3xl font-bold text-foreground">{item.stat}</div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            Validated Outcomes
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-xl mx-auto">
            Clinically validated across international ICU databases. Pre-market research prototype — not FDA cleared.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PilotValueProp
              icon={Shield}
              title="Equipment-Independent"
              metric="Zero Hardware Cost"
              description="Works with EHR data your nurses already generate. No sensors, wearables, or capital expenditure required."
            />
            <PilotValueProp
              icon={TrendingUp}
              title="Clinically Validated"
              metric="Multi-Site Proven"
              description="Validated across international ICU databases with statistically significant predictive performance."
            />
            <PilotValueProp
              icon={BarChart3}
              title="Health Equity Built-In"
              metric="Zero Racial Disparities"
              description="Fairness-preserving algorithms maintain equalized odds and calibration equity across demographics."
            />
            <PilotValueProp
              icon={Clock}
              title="Rapid Deployment"
              metric="90-Day Pilot"
              description="EHR-integrated deployment with structured evaluation framework and defined success metrics."
            />
            <PilotValueProp
              icon={Stethoscope}
              title="Nurse-Centered Design"
              metric="Burden Reduction"
              description="Quantifies and optimizes documentation burden, directly addressing nursing burnout at the source."
            />
            <PilotValueProp
              icon={FileText}
              title="Patent-Protected"
              metric="11 Patent Applications"
              description="Comprehensive IP portfolio ensuring exclusive access to equipment-independent clinical AI methodology."
            />
          </div>
        </div>
      </section>

      {/* Pilot Timeline */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            90-Day Pilot Structure
          </h2>
          <div className="space-y-0">
            <TimelineStep step={1} title="Discovery & Scoping (Week 1-2)" description="Align on clinical objectives, identify target units, and define success metrics with your clinical informatics team." active />
            <TimelineStep step={2} title="EHR Integration (Week 3-4)" description="Connect to your EHR's data feeds. VitaSignal processes documentation timestamps — no PHI extraction required." active />
            <TimelineStep step={3} title="Validation Phase (Week 5-8)" description="Run VitaSignal in shadow mode alongside existing workflows. Compare predictions against actual outcomes." />
            <TimelineStep step={4} title="Clinical Workflow Integration (Week 9-10)" description="Integrate risk scores into nursing handoff reports and shift-change workflows." />
            <TimelineStep step={5} title="Evaluation & Results (Week 11-12)" description="Comprehensive analysis of prediction accuracy, workflow impact, and ROI documentation for expansion decision." />
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">Ideal Pilot Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Building2, title: 'Health Systems', desc: 'Multi-hospital systems seeking to standardize early warning capabilities across facilities' },
              { icon: Stethoscope, title: 'Academic Medical Centers', desc: 'Teaching hospitals interested in clinical AI research collaboration with publication opportunities' },
              { icon: Zap, title: 'EHR Vendors', desc: 'Electronic health record companies exploring embedded clinical AI as a platform differentiator' },
            ].map(item => (
              <div key={item.title} className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
                <item.icon className="w-8 h-8 text-primary mx-auto" />
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Ready to Explore a Pilot?
          </h2>
          <p className="text-muted-foreground">
            Let's discuss how VitaSignal can integrate with your clinical workflows.
            No commitment required — just a conversation about your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/contact')}>
              Schedule a Conversation <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/licensing')}>
              View Licensing Options
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/60 mt-4">
            Pre-market research prototype. Not FDA cleared or approved. Not a medical device. Simulated data only.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default PilotDemo;
