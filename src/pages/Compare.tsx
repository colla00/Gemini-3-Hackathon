import { Helmet } from 'react-helmet-async';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Check, X, Minus, Shield, Zap, DollarSign, Clock, Brain, HeartPulse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const competitors = [
  { name: 'VitaSignal™', highlight: true },
  { name: 'Epic Sepsis Model' },
  { name: 'CLEW Medical' },
  { name: 'Philips IntelliSpace' },
];

type CellValue = 'yes' | 'no' | 'partial' | string;

interface ComparisonRow {
  label: string;
  icon: React.ElementType;
  values: CellValue[];
  tooltip?: string;
}

const rows: ComparisonRow[] = [
  {
    label: 'Equipment-Independent',
    icon: Zap,
    values: ['yes', 'no', 'no', 'no'],
  },
  {
    label: 'Validated AUROC',
    icon: Brain,
    values: ['0.683–0.802', 'undisclosed', 'undisclosed', 'undisclosed'],
    tooltip: 'VitaSignal: IDI AUC 0.683 (65K pts), DBS AUROC 0.802 internal / 0.758 external (28K pts, 172 hospitals)',
  },
  {
    label: 'Health Equity / Bias Testing',
    icon: HeartPulse,
    values: ['yes', 'no', 'no', 'no'],
  },
  {
    label: 'No Proprietary Hardware',
    icon: DollarSign,
    values: ['yes', 'no', 'no', 'no'],
  },
  {
    label: 'Implementation Time',
    icon: Clock,
    values: ['< 2 weeks', '3–6 months', '2–4 months', '4–8 months'],
  },
  {
    label: 'Nurse Documentation Burden Reduction',
    icon: Shield,
    values: ['yes', 'no', 'no', 'partial'],
  },
  {
    label: 'Alert Fatigue Mitigation',
    icon: Shield,
    values: ['yes', 'no', 'partial', 'partial'],
  },
  {
    label: 'Cost per Bed/Year',
    icon: DollarSign,
    values: ['$2,400', '$15,000+', '$12,000+', '$18,000+'],
  },
  {
    label: 'Patent-Protected IP',
    icon: Shield,
    values: ['11 filed', 'no', 'partial', 'yes'],
  },
  {
    label: 'FHIR R4 Native',
    icon: Zap,
    values: ['yes', 'partial', 'no', 'partial'],
  },
];

const renderCell = (value: CellValue, isHighlight: boolean) => {
  if (value === 'yes') return <Check className="w-5 h-5 text-primary mx-auto" />;
  if (value === 'no') return <X className="w-5 h-5 text-destructive/60 mx-auto" />;
  if (value === 'partial') return <Minus className="w-5 h-5 text-muted-foreground mx-auto" />;
  return (
    <span className={`text-sm font-medium ${isHighlight ? 'text-primary' : 'text-foreground'}`}>
      {value}
    </span>
  );
};

const Compare = () => (
  <>
    <Helmet>
      <title>VitaSignal vs Competitors | Clinical AI Comparison</title>
      <meta name="description" content="Compare VitaSignal against Epic Sepsis Model, CLEW Medical, and Philips IntelliSpace across cost, accuracy, bias testing, and deployment speed." />
    </Helmet>
    <LandingNav />
    <main className="min-h-screen bg-background pb-24">
      <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-background border-b border-border/30">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Competitive Analysis</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
            Why VitaSignal?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how VitaSignal compares against leading clinical AI platforms on the metrics that matter most to hospitals.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pt-10">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 text-sm font-semibold text-foreground min-w-[200px]">Feature</th>
                {competitors.map((c) => (
                  <th
                    key={c.name}
                    className={`p-4 text-center text-sm font-semibold min-w-[140px] ${
                      c.highlight ? 'bg-primary/10 text-primary' : 'text-foreground'
                    }`}
                  >
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <row.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{row.label}</span>
                    </div>
                  </td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className={`p-4 text-center ${competitors[j].highlight ? 'bg-primary/5' : ''}`}
                    >
                      {renderCell(val, !!competitors[j].highlight)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20">
          <h2 className="text-lg font-bold text-foreground mb-2">Bottom Line</h2>
          <p className="text-sm text-muted-foreground">
            VitaSignal is the only clinical AI platform that combines equipment-independent mortality prediction (AUROC &gt; 0.90), 
            built-in health equity bias testing, FHIR R4 native architecture, and nurse documentation burden reduction — 
            all at a fraction of the cost and deployment time of legacy systems. Backed by 11 U.S. patent applications.
          </p>
        </div>
      </div>
    </main>
    <LandingFooter />
  </>
);

export default Compare;
