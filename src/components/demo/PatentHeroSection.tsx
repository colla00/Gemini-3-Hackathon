import { Link } from 'react-router-dom';
import { Activity, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const metrics = [
  { label: 'Validated', value: '✓', detail: 'Multi-database cohort' },
  { label: 'External Validation', value: '✓', detail: 'International database' },
  { label: 'Databases', value: '2+', detail: 'Independent cohorts' },
  { label: 'Proprietary Features', value: 'Patent-Pending', detail: 'Novel extraction method' },
];

const differentiators = [
  'Zero hardware cost - uses existing EHR data only',
  'Equity-validated across patient populations',
  'SHAP-based explainability for every prediction',
  'Designed for real-time EHR integration',
];

export const PatentHeroSection = () => {
  return (
    <div className="grid md:grid-cols-2 gap-16 items-start">
      {/* Left: Narrative */}
      <div>
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Validated Technology
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
          VitaSignal™ Mortality
        </h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          ICU Mortality Prediction via proprietary analysis of routine clinical documentation.
          Validated across multiple international databases. Patent-pending features
          are automatically computable from existing EHR data — no additional hardware or sensors required.
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Badge className="bg-primary/15 text-primary border border-primary/30 font-semibold">
            Patent Application Filed
          </Badge>
          <Badge className="bg-chart-2/15 text-chart-2 border border-chart-2/30 font-semibold gap-1">
            <CheckCircle2 className="h-3 w-3" />
            VALIDATED
          </Badge>
        </div>

        <div className="space-y-3 mb-8">
          {differentiators.map((d) => (
            <div key={d} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        {/* Key Finding */}
        <div className="p-5 rounded-xl border border-primary/20 bg-primary/[0.04] mb-8">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Key Finding</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
               Proprietary documentation analysis methods outperform traditional approaches.
               Technical details available under NDA.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/patents" className="gap-2">
              View Portfolio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/licensing">Licensing Inquiries</Link>
          </Button>
        </div>
      </div>

      {/* Right: Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-6 rounded-xl border border-border/50 bg-card text-center hover:border-primary/20 hover:shadow-md transition-all"
          >
            <p className="font-display text-3xl text-primary mb-1">{m.value}</p>
            <p className="text-sm font-semibold text-foreground mb-0.5">{m.label}</p>
            <p className="text-xs text-muted-foreground">{m.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
