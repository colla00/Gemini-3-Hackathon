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
        <Badge className="text-xs bg-primary/10 text-primary border-primary/20">Patent Application Filed</Badge>
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
              Shift-end documentation burden is a known contributor to nurse fatigue, charting backlogs,
              and care quality risk — but it has historically been invisible to health system operations.
              There has been no systematic, data-driven way to quantify when documentation workload
              concentrates at the end of shifts.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">What SEDR Measures</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SEDR quantifies shift-end documentation burden using enriched temporal features from EHR
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
                <span className="text-muted-foreground">Mean AUROC</span>
                <span className="font-bold text-primary text-lg">0.782</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pooled AUROC</span>
                <span className="font-bold text-primary text-lg">0.805</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Comparator Pooled</span>
                <span className="text-muted-foreground">≈0.753</span>
              </div>
              <p className="text-[10px] text-muted-foreground/70 pt-1">
                One-sided DeLong testing significant in 5/5 periods
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Significance */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { title: "Operational Signal", text: "Demonstrates that VitaSignal can extract workforce-level intelligence — not just patient-level risk — from routine EHR activity." },
          { title: "Implementation Proof", text: "SEDR uses data already embedded in care delivery. No new hardware, no new documentation requirements, no added clinician burden." },
          { title: "Platform Credibility", text: "Validates the documentation-driven intelligence thesis across a third independent system, strengthening the case for the broader VitaSignal platform." },
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
