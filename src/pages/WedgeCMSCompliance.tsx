import { motion } from 'framer-motion';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { Shield, FileCheck, ArrowRight, CheckCircle2, AlertTriangle, Scale, BarChart3, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const WedgeCMSCompliance = () => {
  const navigate = useNavigate();

  return (
    <SiteLayout
      title="CMS Health Equity Compliance Suite | VitaSignal"
      description="Automated health equity monitoring and CMS compliance reporting for hospital systems using AI-powered algorithmic fairness analysis."
    >
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 text-xs">
            <Scale className="w-3 h-3 mr-1" /> Compliance Suite
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            CMS Health Equity.<br />
            <span className="text-primary">Automated Compliance.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            VitaSignal continuously monitors your clinical AI systems for algorithmic bias,
            generates CMS-ready equity reports, and provides real-time demographic disparity alerts.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={() => navigate('/contact')}>
              Discuss Compliance Needs <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
              View Technology Demo
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: 'Real-Time Bias Detection', desc: 'Continuous monitoring of clinical AI predictions across race, ethnicity, gender, age, and insurance status.' },
              { icon: FileCheck, title: 'CMS-Ready Reports', desc: 'Automated equity reports formatted for CMS submission. Reduce compliance preparation from weeks to hours.' },
              { icon: BarChart3, title: 'Fairness Dashboards', desc: 'Visual dashboards showing equalized odds, calibration equity, and predictive parity across demographic groups.' },
              { icon: AlertTriangle, title: 'Disparity Alerts', desc: 'Automatic notifications when algorithmic performance diverges across demographic groups beyond acceptable thresholds.' },
            ].map(item => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
                <item.icon className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">The Regulatory Reality</h2>
          <div className="space-y-4">
            {[
              'CMS requires health equity data collection and reporting starting 2024',
              'Hospital accreditation now includes algorithmic fairness assessments',
              'Algorithmic bias lawsuits have resulted in $100M+ settlements',
              'Most hospitals have zero infrastructure for AI fairness monitoring',
            ].map(point => (
              <div key={point} className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">Who This Is For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Building2, title: 'Hospital Systems', desc: 'Meeting CMS health equity requirements across multiple facilities' },
              { icon: Shield, title: 'Compliance Officers', desc: 'Automating equity reporting and reducing audit preparation time' },
              { icon: Scale, title: 'Quality Leaders', desc: 'Ensuring clinical AI tools meet fairness standards before deployment' },
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

      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Don't Wait for the Audit</h2>
          <p className="text-muted-foreground">Proactive compliance is cheaper than reactive remediation. Let's discuss your equity monitoring needs.</p>
          <Button size="lg" onClick={() => navigate('/contact')}>
            Schedule a Conversation <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-[10px] text-muted-foreground/60">Pre-market research prototype. Not FDA cleared. Simulated data only.</p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default WedgeCMSCompliance;
