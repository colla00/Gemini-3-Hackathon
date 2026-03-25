import { SiteLayout } from "@/components/layout/SiteLayout";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calendar, Award, Newspaper, Mic2, FileText, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const timelineEvents = [
  {
    date: "March 2026",
    category: "milestone",
    title: "Patent #11 (SEDR) Externally Validated",
    description: "Syndromic Electronic Documentation Rate system achieves external validation across multi-site ICU data, joining Patents #1 and #5 as validated clinical AI systems.",
    badge: "Validated",
    badgeColor: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
  },
  {
    date: "March 2026",
    category: "event",
    title: "Gemini 3 Hackathon 2026 Submission",
    description: "VitaSignal demonstrates AI-powered clinical decision support using Gemini 3 dual-model integration for risk narratives, clinical notes analysis, and health equity insights.",
    link: "/watch",
    linkLabel: "Watch the demo",
  },
  {
    date: "February 2026",
    category: "milestone",
    title: "11 U.S. Patent Applications Filed",
    description: "Completed filing of 11 provisional patent applications covering ICU mortality prediction, documentation burden scoring, nursing workload optimization, and syndromic surveillance.",
    link: "/patents",
    linkLabel: "View patent portfolio",
  },
  {
    date: "January 2026",
    category: "milestone",
    title: "Documentation Burden Score™ Validated (Patent #5)",
    description: "DBS externally validated across international multi-center ICU databases, demonstrating equipment-independent nursing workload quantification with strong discrimination.",
    badge: "Validated",
    badgeColor: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
  },
  {
    date: "December 2025",
    category: "event",
    title: "Stanford AI+HEALTH 2025 Conference",
    description: "Dr. Alexis Collier presents 'EHR-Driven Quality Dashboard for Nurse-Sensitive Outcomes' at Stanford's inaugural AI+Health conference, showcasing documentation-driven clinical intelligence.",
    link: "/watch",
    linkLabel: "Watch the presentation",
  },
  {
    date: "December 2025",
    category: "milestone",
    title: "ICU Mortality Prediction Validated (Patent #1)",
    description: "Core mortality prediction system externally validated across international ICU databases, demonstrating strong discriminative performance using only EHR timestamp data.",
    badge: "Validated",
    badgeColor: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
  },
  {
    date: "November 2025",
    category: "news",
    title: "ANIA 2026 Abstract #185 Accepted",
    description: "Research abstract on documentation-driven clinical intelligence accepted for the American Nursing Informatics Association 2026 annual conference.",
    link: "/ania2026",
    linkLabel: "View poster",
  },
  {
    date: "October 2025",
    category: "news",
    title: "VitaSignal Platform Development Begins",
    description: "Initial development of the equipment-independent clinical AI platform, focusing on extracting temporal features from routine EHR documentation patterns.",
  },
];

const categoryConfig: Record<string, { icon: typeof Calendar; label: string; color: string }> = {
  milestone: { icon: Award, label: "Milestone", color: "text-primary" },
  event: { icon: Mic2, label: "Conference", color: "text-accent" },
  news: { icon: Newspaper, label: "News", color: "text-amber-500" },
};

const industryInsights = [
  {
    title: "CMS Equity Requirements & Clinical AI",
    summary: "New CMS mandates require hospitals to address health equity in quality reporting. VitaSignal's fairness-preserving algorithms are designed to meet these evolving standards.",
    date: "March 2026",
  },
  {
    title: "The Documentation Burden Crisis",
    summary: "Nurses spend up to 40% of their shift on documentation. Equipment-independent AI offers a path to quantify and reduce this burden without adding new devices.",
    date: "February 2026",
  },
  {
    title: "FHIR R4 Adoption Accelerates",
    summary: "ONC's TEFCA framework is driving FHIR R4 adoption across health systems. VitaSignal's FHIR-native architecture positions it for seamless integration.",
    date: "January 2026",
  },
];

const NewsEvents = () => {
  return (
    <SiteLayout
      title="News & Events"
      description="VitaSignal news, conference appearances, research milestones, and industry insights in clinical AI and healthcare technology."
    >
      <Helmet>
        <meta name="keywords" content="VitaSignal news, clinical AI events, healthcare AI conferences, Stanford AI Health, ANIA 2026, documentation-driven intelligence" />
      </Helmet>

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-xs uppercase tracking-widest text-primary mb-3">Newsroom</p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">News & Events</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Research milestones, conference appearances, and industry perspectives from the VitaSignal team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-10">Timeline</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {timelineEvents.map((event, i) => {
                const cfg = categoryConfig[event.category];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    className="relative pl-12"
                  >
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center">
                      <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                    </div>
                    <div className="rounded-xl border border-border/50 bg-card p-5">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">{event.date}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{cfg.label}</Badge>
                        {event.badge && (
                          <Badge className={`text-[10px] px-1.5 py-0 ${event.badgeColor}`}>{event.badge}</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                      {event.link && (
                        <Link to={event.link} className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                          {event.linkLabel} <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Insights */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2">Industry Insights</h2>
          <p className="text-sm text-muted-foreground mb-8">VitaSignal's perspective on emerging trends in clinical AI and healthcare technology.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {industryInsights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="rounded-xl border border-border/50 bg-card p-5"
              >
                <span className="text-[10px] text-muted-foreground">{insight.date}</span>
                <h3 className="font-semibold text-foreground text-sm mt-1 mb-2">{insight.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.summary}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <p className="text-muted-foreground text-sm mb-4">For press inquiries and media requests</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/press-kit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <FileText className="w-4 h-4" /> Press Kit
          </Link>
          <a href="mailto:info@vitasignal.ai" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors">
            <ExternalLink className="w-4 h-4" /> Contact Media Team
          </a>
        </div>
      </section>
    </SiteLayout>
  );
};

export default NewsEvents;
