import { Award, FlaskConical, Trophy, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const recognitions = [
  { icon: Award, title: 'ANIA 2026 — Boston', subtitle: 'DBS presentation accepted · March 26–28, 2026', featured: true },
  { icon: Award, title: 'Stanford AI+Health 2025', subtitle: 'Presented research findings (December 2025)' },
  { icon: FlaskConical, title: 'NIH-Funded Research', subtitle: 'Federal clinical AI fellowship & funded research grants' },
  { icon: Award, title: 'SIIM 2025', subtitle: 'Society for Imaging Informatics in Medicine annual meeting' },
  { icon: BarChart3, title: 'Large-Scale Validation', subtitle: '357K+ patients across MIMIC-IV, HiRID & eICU' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 150 } },
};

export const RecognitionSection = () => (
  <motion.section
    aria-labelledby="recognition-heading"
    className="py-20 px-6 bg-secondary/30"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
  >
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 id="recognition-heading" className="text-2xl md:text-3xl font-display text-foreground text-center mb-4">
          Recognition
        </h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-16 h-1 bg-primary mx-auto rounded-full mb-12 origin-center"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {recognitions.map((item) => (
          <motion.div
            key={item.title}
            variants={cardVariants}
            whileHover={{
              y: -4,
              boxShadow: "0 12px 24px -8px hsl(var(--primary) / 0.15)",
              transition: { duration: 0.2 },
            }}
            className={`p-6 rounded-xl text-center transition-colors cursor-default ${
              (item as any).featured
                ? 'bg-primary/[0.06] border-2 border-primary/30 ring-1 ring-primary/10'
                : 'bg-card border border-border/50 hover:border-primary/20'
            }`}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                (item as any).featured ? 'bg-primary/20' : 'bg-primary/10'
              }`}
            >
              <item.icon className="w-6 h-6 text-primary" aria-hidden="true" />
            </motion.div>
            <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
            <p className="text-xs text-muted-foreground">{item.subtitle}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </motion.section>
);
