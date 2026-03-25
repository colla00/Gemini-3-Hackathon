import { SiteLayout } from "@/components/layout/SiteLayout";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Play, Clock, ExternalLink, Sparkles, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const videos = [
  {
    id: "Z1Jhb_mGRnM",
    title: "AI-Powered Clinical Decision Support Demo",
    subtitle: "Gemini 3 Hackathon 2026 Submission",
    description: "VitaSignal demonstrates real-time clinical decision support using Gemini 3 for risk narratives, clinical notes analysis, intervention suggestions, and health equity insights.",
    duration: "3 min",
    date: "March 2026",
    badge: "Hackathon",
    badgeIcon: Sparkles,
    featured: true,
    timestamps: [
      { time: "0:00", label: "Introduction & Problem Statement" },
      { time: "0:30", label: "IDI & DBS Scoring Engine" },
      { time: "1:15", label: "Gemini 3 AI Modules Demo" },
      { time: "2:00", label: "Health Equity & Fairness" },
      { time: "2:30", label: "Architecture & Patent Portfolio" },
    ],
  },
  {
    id: "Md5Pw-_stanford",
    title: "EHR-Driven Quality Dashboard for Nurse-Sensitive Outcomes",
    subtitle: "Stanford AI+HEALTH 2025",
    description: "Dr. Alexis Collier presents VitaSignal's documentation-driven clinical intelligence platform at Stanford's inaugural AI+Health conference.",
    duration: "5 min",
    date: "December 2025",
    badge: "Conference",
    badgeIcon: GraduationCap,
    featured: false,
    timestamps: [],
  },
];

const Watch = () => {
  const featured = videos[0];

  return (
    <SiteLayout
      title="Watch"
      description="Watch VitaSignal product demos, conference presentations, and clinical AI technology overviews."
    >
      <Helmet>
        <meta name="keywords" content="VitaSignal demo, clinical AI demo, healthcare AI video, Gemini hackathon, Stanford AI Health" />
      </Helmet>

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-xs uppercase tracking-widest text-primary mb-3">Video Library</p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Watch VitaSignal</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Product demos, conference presentations, and technology deep-dives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Video */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
            <Card className="border-2 border-primary/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${featured.id}?rel=0&modestbranding=1`}
                    title={featured.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs gap-1">
                      <featured.badgeIcon className="w-3 h-3" />
                      {featured.badge}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featured.duration}
                    </span>
                    <span className="text-xs text-muted-foreground">{featured.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-1">{featured.title}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{featured.subtitle}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{featured.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => window.open(`https://youtu.be/${featured.id}`, '_blank')}
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Watch on YouTube
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* All Videos */}
      {videos.length > 1 && (
        <section className="py-12 px-6 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">All Videos</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {videos.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Card className="overflow-hidden h-full hover:border-primary/30 transition-colors">
                    <CardContent className="p-0">
                      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{video.badge}</Badge>
                          <span className="text-[10px] text-muted-foreground">{video.duration} • {video.date}</span>
                        </div>
                        <h3 className="font-semibold text-foreground text-sm">{video.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{video.subtitle}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="py-10 px-6 text-center">
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
          All demonstrations use simulated or de-identified data. VitaSignal is a pre-market research prototype classified as Non-Device CDS. Not FDA cleared. Not for clinical use.
        </p>
      </section>
    </SiteLayout>
  );
};

export default Watch;
