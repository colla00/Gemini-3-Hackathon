import { SiteLayout } from "@/components/layout/SiteLayout";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Building2, Users, Calculator, BarChart3, Target, ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const keyMetrics = [
  { label: "TAM (U.S. ICU Beds)", value: "~105,000", sub: "American Hospital Association" },
  { label: "Year 1 Target", value: "500 beds", sub: "5 pilot hospitals" },
  { label: "Year 3 Target", value: "10,000 beds", sub: "40–60 hospitals" },
  { label: "Year 5 Target", value: "50,000+ beds", sub: "Multi-product expansion" },
];

const revenueStreams = [
  {
    icon: Building2,
    title: "Clinical Pilot",
    price: "$2,500/mo",
    desc: "90-day pilot engagement for single-unit deployment. Includes integration support, validation reporting, and outcome tracking.",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Annual License",
    price: "$8/bed/mo",
    desc: "Per-bed, per-month SaaS pricing for full platform access. Volume discounts at 500+ and 2,000+ bed tiers.",
    color: "text-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Enterprise / White-Label",
    price: "Custom",
    desc: "White-label licensing for EHR vendors and health systems. Revenue share or flat licensing fee structures available.",
    color: "text-amber-500",
  },
];

const unitEconomics = [
  { metric: "Average Contract Value (ACV)", year1: "$30K", year3: "$96K", year5: "$150K" },
  { metric: "Gross Margin (Software)", year1: "85%", year3: "88%", year5: "90%" },
  { metric: "CAC Payback Period", year1: "18 mo", year3: "12 mo", year5: "8 mo" },
  { metric: "Net Revenue Retention", year1: "100%", year3: "115%", year5: "125%" },
  { metric: "LTV:CAC Ratio", year1: "3:1", year3: "5:1", year5: "8:1" },
];

const projections = [
  { year: "Year 1", arr: "$150K", beds: "500", hospitals: "5", milestone: "Pilot validation & first renewals" },
  { year: "Year 2", arr: "$1.2M", beds: "3,000", hospitals: "15–20", milestone: "Regional expansion & EHR partnerships" },
  { year: "Year 3", arr: "$4.8M", beds: "10,000", hospitals: "40–60", milestone: "Multi-product launch & enterprise deals" },
  { year: "Year 4", arr: "$12M", beds: "25,000", hospitals: "100+", milestone: "National scale & white-label revenue" },
  { year: "Year 5", arr: "$30M+", beds: "50,000+", hospitals: "200+", milestone: "Platform dominance & international" },
];

const growthLevers = [
  {
    title: "Land & Expand",
    desc: "Start with ICU mortality prediction (Patent #1), expand to DBS™, alerts, and syndromic surveillance within the same health system.",
  },
  {
    title: "EHR Channel Partnerships",
    desc: "White-label licensing through Epic, Cerner, and Meditech marketplaces — leveraging vendor distribution for capital-efficient growth.",
  },
  {
    title: "Multi-Product Upsell",
    desc: "4 product lines (Mortality, Nursing, Alerts, Risk) create 3–4x expansion revenue per customer over 24 months.",
  },
  {
    title: "Federal & DoD",
    desc: "Equipment-independent design is uniquely suited for VA (1,298 facilities) and DoD (MHS GENESIS) — a $2B+ addressable segment.",
  },
];

const FinancialModel = () => {
  return (
    <SiteLayout
      title="Financial Model"
      description="VitaSignal's financial model: revenue projections, unit economics, pricing tiers, and growth assumptions for equipment-independent clinical AI."
    >
      <Helmet>
        <meta name="keywords" content="VitaSignal financial model, clinical AI revenue, healthcare SaaS pricing, hospital AI unit economics" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 mb-4">
              <Lock className="w-3 h-3 mr-1" /> Investor Materials
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Financial Model</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Revenue projections, unit economics, and growth assumptions for VitaSignal's equipment-independent clinical AI platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Market Opportunity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keyMetrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Card className="text-center">
                  <CardContent className="p-5">
                    <p className="text-2xl font-bold text-primary">{m.value}</p>
                    <p className="text-xs font-medium text-foreground mt-1">{m.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Streams */}
      <section className="py-12 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2">Revenue Streams</h2>
          <p className="text-sm text-muted-foreground mb-6">Three-tier pricing aligned with hospital procurement cycles.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {revenueStreams.map((stream, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <Card className="h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <stream.icon className={`w-4.5 h-4.5 ${stream.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{stream.title}</h3>
                        <p className={`text-lg font-bold ${stream.color}`}>{stream.price}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{stream.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Unit Economics Table */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Unit Economics</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-semibold text-foreground">Metric</th>
                    <th className="text-center p-3 font-semibold text-foreground">Year 1</th>
                    <th className="text-center p-3 font-semibold text-foreground">Year 3</th>
                    <th className="text-center p-3 font-semibold text-foreground">Year 5</th>
                  </tr>
                </thead>
                <tbody>
                  {unitEconomics.map((row, i) => (
                    <tr key={i} className="border-t border-border/50">
                      <td className="p-3 text-muted-foreground">{row.metric}</td>
                      <td className="p-3 text-center font-medium text-foreground">{row.year1}</td>
                      <td className="p-3 text-center font-medium text-foreground">{row.year3}</td>
                      <td className="p-3 text-center font-medium text-primary font-bold">{row.year5}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Projections */}
      <section className="py-12 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">5-Year Revenue Projections</h2>
          <div className="space-y-3">
            {projections.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="shrink-0">
                      <Badge variant="outline" className="text-xs font-bold">{p.year}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 flex-1 text-center">
                      <div>
                        <p className="text-lg font-bold text-primary">{p.arr}</p>
                        <p className="text-[10px] text-muted-foreground">ARR</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{p.beds}</p>
                        <p className="text-[10px] text-muted-foreground">Licensed Beds</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{p.hospitals}</p>
                        <p className="text-[10px] text-muted-foreground">Hospitals</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground sm:max-w-[200px]">{p.milestone}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Levers */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Growth Levers</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {growthLevers.map((lever, i) => (
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
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-foreground text-sm">{lever.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{lever.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Assumptions */}
      <section className="py-12 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">Key Assumptions</h2>
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Pilot-to-license conversion rate: 60–70% based on 90-day validation outcomes</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Average hospital expansion: 2.5 units within 18 months of initial deployment</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>EHR vendor partnerships begin generating channel revenue in Year 2</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Federal/DoD contracts modeled as 15% of Year 3+ revenue (conservative)</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Engineering team scales from 3 → 12 over 3 years; sales from 1 → 6</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>No hardware COGS — software-only model enables 85%+ gross margins from Year 1</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>IP portfolio (11 patents) provides defensible moat and licensing optionality</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">Detailed financial model available under NDA.</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button asChild>
            <Link to="/roi-calculator">
              <Calculator className="w-4 h-4 mr-1.5" /> ROI Calculator
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="mailto:info@vitasignal.ai">
              Request Full Model <ArrowRight className="w-4 h-4 ml-1.5" />
            </a>
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-6">
          Projections are forward-looking estimates based on current market data and internal assumptions. Actual results may vary. VitaSignal is a pre-market research prototype.
        </p>
      </section>
    </SiteLayout>
  );
};

export default FinancialModel;
