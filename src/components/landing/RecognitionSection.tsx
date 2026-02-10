import { Award, FlaskConical, Trophy, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const recognitions = [
  { icon: Award, title: 'Stanford AI+Health 2025', subtitle: 'Presented research findings (December 2025)' },
  { icon: FlaskConical, title: 'NIH CLINAQ Fellowship', subtitle: 'Federal research fellowship' },
  { icon: Trophy, title: 'AIM-AHEAD Grant', subtitle: 'NIH-funded clinical AI research' },
  { icon: BarChart3, title: 'Large-Scale Validation', subtitle: 'Validated on extensive ICU datasets' },
];

export const RecognitionSection = () => (
  <section className="py-20 px-6 bg-secondary/30">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
          Recognition
        </h3>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-12" />
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recognitions.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="p-6 rounded-xl bg-card border border-border/50 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <item.icon className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
            <p className="text-xs text-muted-foreground">{item.subtitle}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
