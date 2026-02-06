import { DollarSign, Clock, Target, Scale, FlaskConical, FileText } from 'lucide-react';

const benefits = [
  { icon: DollarSign, title: 'Zero Hardware Cost', description: 'Works with existing EHR systems. No sensors, wearables, or monitoring devices required.' },
  { icon: Clock, title: 'Early Detection', description: 'Identifies deterioration signals hours before traditional vital sign alerts.' },
  { icon: Target, title: 'Reduced Alert Fatigue', description: 'Adaptive algorithms minimize false alarms while maintaining patient safety.' },
  { icon: Scale, title: 'Equity-Focused', description: 'Validated for fairness across patient populations.' },
  { icon: FlaskConical, title: 'NIH-Funded Research', description: 'Backed by rigorous scientific validation and federal research support.' },
  { icon: FileText, title: 'Patent-Protected', description: '5 U.S. provisional patent applications covering novel analytical methods.' },
];

export const KeyBenefits = () => (
  <section className="py-20 px-6 bg-secondary/30">
    <div className="max-w-6xl mx-auto">
      <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
        Key Benefits
      </h3>
      <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-12" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="p-6 rounded-xl bg-card border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <benefit.icon className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
            <p className="text-sm text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
