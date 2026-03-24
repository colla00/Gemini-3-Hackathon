import { SiteLayout } from "@/components/layout/SiteLayout";
import { Helmet } from "react-helmet-async";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Globe, Heart, Scale, Wifi, WifiOff, Building, Stethoscope, Users, ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "47%", label: "of ICU beds globally lack continuous monitoring", source: "WHO" },
  { value: "4.5B", label: "people lack access to essential health services", source: "World Bank" },
  { value: "Multi-site", label: "external validation across international hospitals", source: "VitaSignal Research" },
  { value: "0", label: "additional hardware required for deployment", source: "VitaSignal" },
];

const challenges = [
  {
    icon: WifiOff,
    title: "No Bedside Monitors",
    desc: "Most ICUs in low- and middle-income countries operate without continuous electronic monitoring. Clinical deterioration goes undetected until it's too late.",
  },
  {
    icon: Users,
    title: "Severe Nursing Shortages",
    desc: "The WHO estimates a global shortage of 5.9 million nurses. Overburdened staff can't manually track every patient's trajectory across a shift.",
  },
  {
    icon: Building,
    title: "Infrastructure Gaps",
    desc: "Deploying hardware-dependent AI requires capital expenditure, maintenance contracts, and technical support that resource-limited facilities can't sustain.",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "EHR Data Only",
    desc: "VitaSignal extracts temporal features from the timing and frequency of routine documentation entries — vital signs, medication administration, nursing assessments.",
  },
  {
    step: "2",
    title: "Pattern Recognition",
    desc: "Algorithms detect shifts in documentation cadence that correlate with patient deterioration. No waveform data, no sensors, no hardware interfaces.",
  },
  {
    step: "3",
    title: "Risk Stratification",
    desc: "Clinicians receive real-time risk scores with SHAP-based explanations — enabling triage decisions even in settings with limited monitoring capacity.",
  },
];

const equityPrinciples = [
  {
    icon: Scale,
    title: "Fairness-Preserving Design",
    desc: "Every algorithm undergoes subgroup analysis across race, ethnicity, sex, age, and insurance status. We measure calibration, equalized odds, and predictive parity.",
  },
  {
    icon: Heart,
    title: "Designed for Underserved Populations",
    desc: "Equipment-independent architecture ensures the same clinical AI available to well-resourced systems is accessible to safety-net hospitals, rural facilities, and global health contexts.",
  },
  {
    icon: Globe,
    title: "Cross-Cultural Validation",
    desc: "Validated across multiple international ICU databases — demonstrating robustness across diverse patient populations, care settings, and documentation practices.",
  },
  {
    icon: Stethoscope,
    title: "CMS Equity Alignment",
    desc: "Designed to support hospitals meeting CMS health equity requirements with documented fairness evidence, transparent model behavior, and audit-ready reporting.",
  },
];

const useCases = [
  {
    region: "Sub-Saharan Africa",
    context: "ICUs with basic EHR systems but no continuous monitoring",
    impact: "Early warning for patient deterioration using documentation timing patterns",
  },
  {
    region: "Rural United States",
    context: "Critical access hospitals with limited ICU capacity",
    impact: "Risk stratification to optimize transfer decisions and reduce preventable deaths",
  },
  {
    region: "Military & Deployed Settings",
    context: "Field hospitals and garrison clinics with constrained equipment",
    impact: "Clinical AI that works with MHS GENESIS / VistA without bedside monitors",
  },
  {
    region: "Southeast Asia & India",
    context: "High patient-to-nurse ratios with growing EHR adoption",
    impact: "Documentation burden quantification to support nursing workforce planning",
  },
];

const GlobalHealth = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <SiteLayout
      title="Global Health & Equity"
      description="VitaSignal's equipment-independent clinical AI is designed for resource-limited settings where traditional monitoring isn't available. Fairness-preserving algorithms ensure equitable care."
    >
      <Helmet>
        <meta name="keywords" content="global health AI, health equity clinical AI, resource-limited ICU, equipment-independent, fairness-preserving algorithms, WHO nursing shortage" />
      </Helmet>

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
              <Globe className="w-3 h-3 mr-1" /> Global Impact
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              Clinical AI That Works Where It's Needed Most
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Nearly half the world's ICU beds lack continuous monitoring. VitaSignal's equipment-independent AI brings clinical intelligence to every setting — not just the ones with the most resources.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-b border-border/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              <p className="text-[10px] text-muted-foreground/50">{s.source}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2">The Global Challenge</h2>
          <p className="text-sm text-muted-foreground mb-8">Traditional clinical AI depends on hardware that most of the world doesn't have.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {challenges.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <Card className="h-full border-destructive/20 bg-destructive/[0.02]">
                  <CardContent className="p-5">
                    <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center mb-3">
                      <c.icon className="w-4.5 h-4.5 text-destructive" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{c.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={ref} className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2">The Equipment-Independent Approach</h2>
          <p className="text-sm text-muted-foreground mb-8">VitaSignal works with data every facility already generates.</p>
          <div className="space-y-4">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{step.step}</span>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-4 flex-1">
                  <h3 className="font-semibold text-foreground text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equity Principles */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2">Health Equity Principles</h2>
          <p className="text-sm text-muted-foreground mb-8">Fairness isn't a feature — it's the architecture.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {equityPrinciples.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Card className="h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <p.icon className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">{p.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases by Region */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Deployment Scenarios</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {useCases.map((uc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Card className="h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <h3 className="font-semibold text-foreground text-sm">{uc.region}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{uc.context}</p>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-foreground font-medium">{uc.impact}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-3">Partner With Us</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-6">
          We're seeking research collaborators, NGO partners, and global health organizations interested in equipment-independent clinical AI for underserved populations.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button asChild>
            <Link to="/contact">
              Start a Conversation <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/research">
              View Research
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
};

export default GlobalHealth;
