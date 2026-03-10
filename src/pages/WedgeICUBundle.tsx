import { motion } from 'framer-motion';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { Activity, Shield, TrendingUp, ArrowRight, CheckCircle2, Heart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const WedgeICUBundle = () => {
  const navigate = useNavigate();

  return (
    <SiteLayout
      title="ICU Mortality + Equity Monitoring | VitaSignal"
      description="Equipment-independent ICU mortality prediction with built-in algorithmic fairness monitoring. Validated across international databases."
    >
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 text-xs">
            <Activity className="w-3 h-3 mr-1" /> ICU Safety Bundle
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            Predict ICU Deterioration.<br />
            <span className="text-primary">Monitor Algorithmic Fairness.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            The only validated clinical AI that predicts ICU mortality from EHR documentation patterns
            while continuously monitoring for algorithmic bias across patient demographics.
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
              { icon: Activity, title: 'Mortality Risk Prediction', desc: 'Real-time risk scoring from documentation timing patterns. Clinically validated across international ICU databases.' },
              { icon: Shield, title: 'Equity Monitoring Dashboard', desc: 'Continuous fairness metrics across race, gender, and age. Automatic alerts when disparities are detected.' },
              { icon: BarChart3, title: 'SHAP Explainability', desc: 'Transparent reasoning for every prediction. Clinicians see why a patient is flagged, not just that they are.' },
              { icon: Heart, title: 'Zero Hardware Required', desc: 'Works with EHR data already being generated. No sensors, wearables, or capital expenditure.' },
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
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Why This Matters Now</h2>
          <div className="space-y-4">
            {[
              'CMS requires health equity reporting for hospital accreditation',
              'Algorithmic bias lawsuits are increasing across healthcare AI',
              'Traditional early warning systems miss 40-60% of deterioration events',
              'Equipment-dependent monitoring creates care disparities in under-resourced units',
            ].map(point => (
              <div key={point} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Ready to Explore?</h2>
          <p className="text-muted-foreground">Start with a 90-day pilot in one ICU. No commitment beyond the evaluation period.</p>
          <Button size="lg" onClick={() => navigate('/contact')}>
            Schedule a Conversation <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-[10px] text-muted-foreground/60">Pre-market research prototype. Not FDA cleared. Simulated data only.</p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default WedgeICUBundle;
