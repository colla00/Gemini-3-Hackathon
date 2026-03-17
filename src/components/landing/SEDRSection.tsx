import { CheckCircle2, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const periods = [
  { range: "2008–2010", auroc: "0.741" },
  { range: "2011–2013", auroc: "0.749" },
  { range: "2014–2016", auroc: "0.782" },
  { range: "2017–2019", auroc: "0.818" },
  { range: "2020–2022", auroc: "0.821" },
];

export const SEDRSection = () => (
  <section className="py-20 px-6 bg-muted/20 border-y border-border/30" aria-labelledby="sedr-heading">
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="text-xs">Validated</Badge>
        <Badge className="text-xs bg-primary/10 text-primary border-primary/20">Syndromic Surveillance</Badge>
      </div>

      <h2 id="sedr-heading" className="font-display text-2xl md:text-3xl text-foreground mb-2">
        SEDR – Syndromic Surveillance
      </h2>
      <p className="text-muted-foreground max-w-2xl leading-relaxed mb-8">
        A validated syndromic surveillance system that demonstrates VitaSignal's ability to
        extract population-level intelligence from routine EHR documentation patterns — enabling
        early outbreak detection and response coordination. Patent application filed.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Problem + What SEDR Measures */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">The Problem</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Traditional syndromic surveillance relies on lagging indicators — lab confirmations,
              case reports, and manual signal detection. By the time conventional systems flag an
              emerging outbreak, critical response time has already been lost.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">What SEDR Measures</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SEDR detects syndromic patterns using enriched temporal features from EHR documentation
              timestamps, combined with Elixhauser comorbidity burden, ICU type, and admission variables.
              Modeled with LightGBM across five held-out three-year validation periods.
            </p>
          </div>
        </div>

        {/* Validation Results */}
        <Card className="border-border/50 bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Temporal Validation Results</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              94,444 ICU stays · MIMIC-IV · Five held-out three-year periods
            </p>
            <div className="space-y-2 mb-4">
              {periods.map((p) => (
                <div key={p.range} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-mono text-xs">{p.range}</span>
                  <span className="font-bold text-foreground">{p.auroc}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-border/30 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discrimination</span>
                <span className="font-bold text-primary text-lg">Strong</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">vs. Comparators</span>
                <span className="text-muted-foreground">Outperforms baseline &amp; IDI</span>
              </div>
              <p className="text-[10px] text-muted-foreground/70 pt-1">
                Statistically significant in 5/5 periods · CHITA 2026 · Metrics available under NDA
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Significance */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { title: "Population-Level Signal", text: "Demonstrates that VitaSignal can extract syndromic intelligence — not just patient-level risk — from routine EHR documentation patterns." },
          { title: "Implementation Proof", text: "SEDR uses data already embedded in care delivery. No new hardware, no new documentation requirements, no added clinician burden." },
          { title: "Patent-Pending", text: "Patent application filed. Validates the documentation-driven intelligence thesis across a third independent system, strengthening the broader VitaSignal platform." },
        ].map((item) => (
          <div key={item.title} className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="text-sm font-bold text-foreground mb-1.5">{item.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button size="sm" asChild>
          <Link to="/research" className="gap-2">
            Full Research Details <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/licensing">Licensing Inquiries</Link>
        </Button>
      </div>
    </div>
  </section>
);
