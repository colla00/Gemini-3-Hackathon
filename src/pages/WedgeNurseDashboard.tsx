import { motion } from 'framer-motion';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { Users, Heart, TrendingDown, ArrowRight, CheckCircle2, BarChart3, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const WedgeNurseDashboard = () => {
  const navigate = useNavigate();

  return (
    <SiteLayout
      title="Nurse Workload + Burnout Risk Dashboard | VitaSignal"
      description="Quantify documentation burden, predict burnout risk, and optimize nurse staffing using existing EHR data."
    >
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 text-xs">
            <Users className="w-3 h-3 mr-1" /> Nursing Intelligence
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            Measure What Burns Out<br />
            <span className="text-primary">Your Nurses.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            VitaSignal's Documentation Burden Score™ quantifies the hidden workload in clinical documentation,
            enabling data-driven staffing decisions and targeted burnout prevention.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={() => navigate('/contact')}>
              Discuss a Pilot <ArrowRight className="w-4 h-4 ml-2" />
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
              { icon: BarChart3, title: 'Documentation Burden Score™', desc: 'Validated metric that quantifies documentation workload from EHR timestamp patterns. Multi-site validated.' },
              { icon: Heart, title: 'Burnout Risk Prediction', desc: 'Early warning for nurse burnout based on documentation patterns, shift intensity, and workload distribution.' },
              { icon: Users, title: 'Staffing Optimization', desc: 'Data-driven staffing recommendations based on real documentation burden, not just patient census.' },
              { icon: Clock, title: 'Shift Handoff Intelligence', desc: 'Automated risk-prioritized handoff reports that highlight high-burden patients and workload distribution.' },
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
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">The Nurse Burnout Crisis</h2>
          <div className="space-y-4">
            {[
              '100,000+ nurses left the profession during 2020-2023',
              'Documentation consumes up to 50% of nursing time in ICUs',
              'Burnout-related turnover costs hospitals $40K-$60K per nurse',
              'Current staffing models ignore documentation burden entirely',
            ].map(point => (
              <div key={point} className="flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Start Measuring Documentation Burden</h2>
          <p className="text-muted-foreground">Deploy in one unit. See results in 30 days. No hardware required.</p>
          <Button size="lg" onClick={() => navigate('/contact')}>
            Schedule a Conversation <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-[10px] text-muted-foreground/60">Pre-market research prototype. Not FDA cleared. Simulated data only.</p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default WedgeNurseDashboard;
