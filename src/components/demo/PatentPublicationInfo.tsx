import { FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const infoRows = [
  { label: 'Patent #1', value: 'U.S. Provisional Patent Application Filed (2026)' },
  { label: 'Manuscript', value: 'Development and Validation of the Intensive Documentation Index for ICU Mortality Prediction: A Temporal Validation Study' },
  { label: 'Status', value: 'Submitted to medRxiv. Targeting Critical Care Medicine' },
  { label: 'Funding', value: 'NIH-funded research' },
  { label: 'Inventor', value: 'Dr. Alexis Collier, DHA. University of North Georgia' },
];

export const PatentPublicationInfo = () => {
  return (
    <div className="grid md:grid-cols-2 gap-16 items-start">
      {/* Left: Narrative */}
      <div>
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Publications & IP
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-6">
          Patent & Publication
        </h2>
        <p className="text-primary-foreground/70 mb-8 leading-relaxed">
          VitaSignal's intellectual property portfolio is grounded in rigorous academic
          research and NIH-funded validation studies, with publications targeting
          top-tier critical care journals.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/patents" className="gap-2">
              <FileText className="w-4 h-4" />
              View Patent Portfolio
            </Link>
          </Button>
          <Button variant="outline" className="border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10" asChild>
            <Link to="/about" className="gap-2">
              About the Inventor
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Right: Details */}
      <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary-foreground">Research & IP Status</h3>
        </div>
        <div className="space-y-0">
          {infoRows.map((row) => (
            <div key={row.label} className="py-3 border-b border-primary-foreground/10 last:border-0">
              <span className="font-semibold text-sm text-primary-foreground">{row.label}: </span>
              <span className="text-sm text-primary-foreground/60">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};