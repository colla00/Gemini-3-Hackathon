import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Activity, FileText, Shield, BarChart3, TrendingUp, ArrowRight, Building2, GraduationCap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "357,080", label: "Patients Validated", icon: Activity },
  { value: "11", label: "Patent Applications Filed", icon: FileText },
  { value: "175+", label: "Patent Claims", icon: Shield },
  { value: "3", label: "Validated Systems", icon: TrendingUp },
];

const highlights = [
  {
    title: "ICU Mortality Prediction (Patent #1 · IDI)",
    desc: "9 temporal features from routine EHR timestamps. AUC 0.683 validated on 65,157 patients across MIMIC-IV and HiRID. Equipment-independent — no bedside monitors.",
    badge: "Externally Validated",
  },
  {
    title: "Documentation Burden Score™ (Patent #5 · DBS)",
    desc: "ML-powered documentation burden quantification. AUROC 0.802 internal, 0.758 external. Validated across 172 hospitals (N=28,362). ANIA 2026 presentation accepted.",
    badge: "Externally Validated",
  },
  {
    title: "Shift-End Documentation Burden Index (SEDR)",
    desc: "Shift-end documentation burden quantification. Pooled AUROC 0.805 across 94,444 ICU stays (MIMIC-IV). Enriched temporal validation across five held-out periods.",
    badge: "Validated",
  },
  {
    title: "Trust-Based Alert Governance (Patent #2)",
    desc: "Mobile alert governance with trust scoring, equity monitoring, and cognitive load optimization.",
    badge: "Design Phase",
  },
];

export default function Investors() {
  return (
    <SiteLayout
      title="Investor Overview | VitaSignal™ Clinical AI"
      description="VitaSignal: 11 patent-pending clinical AI systems validated on 357,000+ patients. Equipment-independent, EHR-native intelligence."
    >
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "#0f1729" }}>
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(15,23,41,0.85), rgba(15,23,41,0.95))" }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <Badge className="mb-6 text-xs" style={{ background: "rgba(0,200,180,0.15)", color: "#00c8b4", border: "1px solid rgba(0,200,180,0.3)" }}>
            Pre-Seed · Patent Pending
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.1]">
            Documentation-Driven Clinical Intelligence
            <br />
            <span style={{ color: "#00c8b4" }}>Implementation-Ready · Patent-Pending</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            VitaSignal turns routine EHR activity into actionable insight for risk prediction,
            workflow visibility, and equitable decision support — without requiring new hardware
            or adding burden to care teams. Three independently validated systems. 11 patent applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="gap-2" style={{ background: "#00c8b4", color: "#0f1729" }} asChild>
              <Link to="/licensing">
                <ArrowRight className="w-4 h-4" /> View Licensing Options
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/15 font-semibold" asChild>
              <a href="mailto:licensing@vitasignal.ai">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6" style={{ background: "#f8f9fb" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="text-center border-border/50">
                <CardContent className="pt-6 pb-4">
                  <s.icon className="w-6 h-6 mx-auto mb-2" style={{ color: "#00c8b4" }} />
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Systems */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#00c8b4" }}>Validated Technology</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Lead Patent Systems</h2>
          </div>
          <div className="space-y-4">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{h.title}</h3>
                      <Badge
                        variant={h.badge === "Externally Validated" ? "default" : "secondary"}
                        className="text-[10px] shrink-0"
                      >
                        {h.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{h.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Market */}
      <section className="py-16 px-6" style={{ background: "#0f1729" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Market Opportunity</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Building2, title: "6,000+ U.S. Hospitals", desc: "Every hospital with an EHR is a potential customer — no hardware installation required." },
              { icon: BarChart3, title: "$24B Clinical AI Market", desc: "Growing 38% CAGR. VitaSignal targets the decision-support segment with proven IP moats." },
              { icon: GraduationCap, title: "NIH-Funded Research", desc: "Built on AIM-AHEAD consortium data (Award No. 1OT2OD032581). Academic credibility built in." },
            ].map((item) => (
              <Card key={item.title} className="bg-white/5 border-white/10 text-left">
                <CardContent className="pt-6">
                  <item.icon className="w-8 h-8 mb-3" style={{ color: "#00c8b4" }} />
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Learn More?</h2>
          <p className="text-muted-foreground mb-8">
            Request our full investor deck under NDA, or schedule a 30-minute walkthrough of the platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild style={{ background: "#0f1729" }}>
              <a href="mailto:licensing@vitasignal.ai?subject=Investor%20Deck%20Request">Request Investor Deck</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/licensing">View Licensing Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer disclaimer */}
      <section className="py-6 px-6 border-t">
        <p className="max-w-4xl mx-auto text-center text-xs text-muted-foreground">
          Pre-Market · Patent Pending · Not FDA-cleared · Not a Medical Device.
          © {new Date().getFullYear()} VitaSignal LLC. All rights reserved.
        </p>
      </section>
    </SiteLayout>
  );
}
