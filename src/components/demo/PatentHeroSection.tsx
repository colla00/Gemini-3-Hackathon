import { Link } from 'react-router-dom';
import { Activity, CheckCircle2, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const PatentHeroSection = () => {
  return (
    <Card className="border-4 border-risk-low/60 bg-gradient-to-br from-card via-card to-secondary/40 shadow-lg">
      <CardContent className="p-6 md:p-8 space-y-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-primary/15 text-primary border border-primary/30 font-semibold">
            Patent #1 &bull; Filed Feb 5, 2026
          </Badge>
          <Badge className="bg-risk-low/15 text-risk-low border border-risk-low/30 font-semibold gap-1">
            <CheckCircle2 className="h-3 w-3" />
            VALIDATED PERFORMANCE
          </Badge>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">VitaSignal Mortality</h2>
            <p className="text-sm text-muted-foreground">
              ICU Mortality Prediction via the Intensive Documentation Index (IDI)
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          The Intensive Documentation Index (IDI) extracts 9 features from nursing documentation timestamps
          to predict ICU mortality. Unlike traditional risk scores requiring manual data entry, IDI features
          are automatically computable from existing EHR data.
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="Validated AUC"
            value="0.684"
            detail="95% CI: 0.653-0.715"
            color="text-risk-low"
            bg="bg-risk-low/10 border-risk-low/20"
          />
          <MetricCard
            label="Cohort Size"
            value="n=26,153"
            detail="ICU admissions"
            color="text-primary"
            bg="bg-primary/10 border-primary/20"
          />
          <MetricCard
            label="Temporal Validation"
            value="11 years"
            detail="2008-2019"
            color="text-accent"
            bg="bg-accent/10 border-accent/20"
          />
          <MetricCard
            label="Equity Validated"
            value="Pass"
            detail="AUC parity maintained"
            color="text-risk-low"
            bg="bg-risk-low/10 border-risk-low/20"
            icon={<CheckCircle2 className="h-4 w-4 text-risk-low" />}
          />
        </div>

        {/* Key Finding */}
        <Alert className="bg-primary/5 border-primary/30">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-foreground">
            <strong>Key Finding:</strong> Documentation rhythm irregularity (Coefficient of Variation) is the
            strongest predictor (OR 1.82, p&lt;0.001), while documentation volume is not independently
            predictive (OR 0.98, p=0.74).
          </AlertDescription>
        </Alert>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/patents">View Full Technical Details</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/licensing">Licensing Inquiries</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const MetricCard = ({
  label,
  value,
  detail,
  color,
  bg,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  color: string;
  bg: string;
  icon?: React.ReactNode;
}) => (
  <div className={`rounded-xl border p-4 ${bg}`}>
    <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
    <div className="flex items-center gap-1.5">
      {icon}
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
    <p className="text-[11px] text-muted-foreground mt-0.5">{detail}</p>
  </div>
);
