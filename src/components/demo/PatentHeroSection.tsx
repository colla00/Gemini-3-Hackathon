import { Link } from 'react-router-dom';
import { Activity, CheckCircle2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const PatentHeroSection = () => {
  return (
    <section className="space-y-6">
      <div className="mb-2">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Validated Technology
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
          VitaSignal Mortality
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          ICU Mortality Prediction via the Intensive Documentation Index (IDI)
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-primary/15 text-primary border border-primary/30 font-semibold">
          Patent #1 &bull; Filed Feb 5, 2026
        </Badge>
        <Badge className="bg-chart-2/15 text-chart-2 border border-chart-2/30 font-semibold gap-1">
          <CheckCircle2 className="h-3 w-3" />
          VALIDATED PERFORMANCE
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Validated AUC"
          value="0.684"
          detail="95% CI: 0.653-0.715"
        />
        <MetricCard
          label="Cohort Size"
          value="n=26,153"
          detail="ICU admissions"
        />
        <MetricCard
          label="Temporal Validation"
          value="11 years"
          detail="2008-2019"
        />
        <MetricCard
          label="Equity Validated"
          value="Pass"
          detail="AUC parity maintained"
          icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
        />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
        The Intensive Documentation Index (IDI) extracts 9 features from nursing documentation timestamps
        to predict ICU mortality. Unlike traditional risk scores requiring manual data entry, IDI features
        are automatically computable from existing EHR data.
      </p>

      {/* Key Finding */}
      <div className="p-5 rounded-xl border border-primary/20 bg-primary/[0.04]">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Key Finding</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Documentation rhythm irregularity (Coefficient of Variation) is the
              strongest predictor (OR 1.82, p&lt;0.001), while documentation volume is not independently
              predictive (OR 0.98, p=0.74).
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/patents">View Full Technical Details</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/licensing">Licensing Inquiries</Link>
        </Button>
      </div>
    </section>
  );
};

const MetricCard = ({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon?: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border/50 bg-card p-5 hover:border-primary/20 hover:shadow-md transition-all">
    <p className="text-xs text-muted-foreground font-medium mb-1.5">{label}</p>
    <div className="flex items-center gap-1.5">
      {icon}
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
    <p className="text-xs text-muted-foreground mt-1">{detail}</p>
  </div>
);
