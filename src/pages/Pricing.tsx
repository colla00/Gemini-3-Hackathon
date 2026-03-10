import { motion } from 'framer-motion';
import { Check, ArrowRight, HelpCircle, Shield, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteLayout } from '@/components/layout/SiteLayout';

const tiers = [
  {
    name: 'Clinical Pilot',
    price: '$2,500',
    unit: '/month',
    duration: '3–6 month engagement',
    description: 'Validate VitaSignal in a single unit with full support. Designed for clinical evaluation before enterprise commitment.',
    color: 'border-cyan-500/30',
    accent: 'text-cyan-400',
    bg: 'bg-cyan-500/5',
    features: [
      'Single ICU or step-down unit',
      'Up to 30 monitored beds',
      'EHR integration (read-only FHIR)',
      'Real-time risk dashboard',
      'Dedicated implementation support',
      'Weekly performance reports',
      'Clinical validation metrics',
      'Transition to annual pricing on success',
    ],
    cta: 'Apply for Pilot',
    ctaLink: '/pilot-request',
    highlight: false,
  },
  {
    name: 'Annual License',
    price: '$8',
    unit: '/bed/month',
    duration: 'Annual commitment',
    description: 'Full platform access across multiple units. Includes all modules, integrations, and ongoing clinical support.',
    color: 'border-emerald-500/40',
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/5',
    features: [
      'Multi-unit deployment',
      'Unlimited monitored beds',
      'Full FHIR + HL7 integration',
      'Risk prediction + nurse workload + equity monitoring',
      'ChartMinder™ documentation analysis',
      'Custom alert thresholds',
      'Quarterly business reviews',
      'BAA included',
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '',
    duration: 'Multi-year agreements available',
    description: 'For health systems deploying across multiple hospitals. Includes custom integrations, dedicated support, and strategic partnership.',
    color: 'border-purple-500/30',
    accent: 'text-purple-400',
    bg: 'bg-purple-500/5',
    features: [
      'Multi-hospital system deployment',
      'Custom EHR integration engineering',
      'Dedicated customer success manager',
      'On-site implementation support',
      'Custom model training on your data',
      'Executive dashboards and reporting',
      'Priority feature development',
      'Volume pricing available',
    ],
    cta: 'Schedule a Conversation',
    ctaLink: '/contact',
    highlight: false,
  },
];

const faqs = [
  {
    q: 'What\'s included in the pilot?',
    a: 'The pilot includes full platform deployment on a single unit, EHR integration, staff training, and weekly performance reports. We measure clinical impact together before any long-term commitment.',
  },
  {
    q: 'How does per-bed pricing work?',
    a: 'Annual licensing is based on the number of beds actively monitored by VitaSignal. Beds can be added or removed quarterly. This scales cost proportionally to the clinical value delivered.',
  },
  {
    q: 'Is there a setup fee?',
    a: 'Pilot engagements include implementation at no additional cost. Annual and enterprise licenses may include a one-time integration fee depending on EHR complexity — we\'ll scope this transparently during evaluation.',
  },
  {
    q: 'What if the pilot doesn\'t show results?',
    a: 'We publish our validation data openly. If VitaSignal doesn\'t demonstrate measurable clinical impact during your pilot, you walk away with no further obligation. We succeed when you succeed.',
  },
  {
    q: 'Do you sign a BAA?',
    a: 'Yes. A Business Associate Agreement is executed before any PHI enters our systems. BAA is included at no additional cost for all engagement levels.',
  },
];

const Pricing = () => (
  <SiteLayout
    title="Pricing | VitaSignal — Transparent Clinical AI Pricing"
    description="VitaSignal offers transparent pricing for clinical AI deployment. Start with a pilot, scale to annual licensing, or explore enterprise partnerships."
  >
    <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
      {/* Hero */}
      <section className="pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white/70 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" /> Transparent Pricing
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-['DM_Serif_Display']">
              Pricing That Scales With <span className="text-emerald-400">Your Impact</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Start with a focused pilot. Expand when you see results. No hidden fees, no long-term lock-in before validation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div key={tier.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border ${tier.color} ${tier.bg} p-6 md:p-7 flex flex-col ${tier.highlight ? 'ring-1 ring-emerald-500/30 relative' : ''}`}>
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-5">
                <p className={`text-sm font-semibold ${tier.accent} mb-1`}>{tier.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{tier.price}</span>
                  {tier.unit && <span className="text-sm text-white/40">{tier.unit}</span>}
                </div>
                <p className="text-xs text-white/40 mt-1">{tier.duration}</p>
              </div>
              <p className="text-xs text-white/50 mb-5 leading-relaxed">{tier.description}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map(f => (
                  <li key={f} className="text-xs text-white/60 flex items-start gap-2">
                    <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tier.accent}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className={`w-full ${tier.highlight ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'}`}>
                <a href={tier.ctaLink}>{tier.cta} <ArrowRight className="w-4 h-4 ml-2" /></a>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What's Included */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10">
            <h2 className="text-xl font-bold text-white mb-6 font-['DM_Serif_Display']">Included With Every Engagement</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: 'HIPAA Compliance', desc: 'BAA execution, encrypted data handling, audit logging, and breach notification protocols.' },
                { icon: Building2, title: 'Implementation Support', desc: 'Dedicated team for EHR integration, staff training, and clinical workflow optimization.' },
                { icon: Zap, title: 'Continuous Updates', desc: 'Model improvements, new features, and security patches included — no upgrade fees.' },
              ].map(item => (
                <div key={item.title} className="flex gap-3">
                  <item.icon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white mb-1">{item.title}</p>
                    <p className="text-xs text-white/50">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-semibold tracking-wider text-white/50 uppercase flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </h2>
          {faqs.map(faq => (
            <div key={faq.q} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-white mb-2">{faq.q}</p>
              <p className="text-xs text-white/50 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/40 text-sm mb-4">Not sure which plan fits? We'll help you scope the right engagement.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <a href="/roi-calculator">Calculate Your ROI <ArrowRight className="w-4 h-4 ml-2" /></a>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <a href="/contact">Talk to Our Team</a>
            </Button>
          </div>
          <p className="text-[11px] text-white/25 mt-6">VitaSignal is a pre-market research prototype. Pricing reflects projected commercial terms and may evolve as we approach FDA clearance.</p>
        </div>
      </section>
    </main>
  </SiteLayout>
);

export default Pricing;
