import { FileText } from 'lucide-react';

export const PatentPublicationInfo = () => {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Publications & IP
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
          Patent & Publication
        </h2>
      </div>

      <div className="rounded-xl border border-border/50 bg-card p-6 md:p-8">
        <div className="flex items-center gap-2 mb-5">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Research & IP Status</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <InfoRow label="Patent #1" value="U.S. Provisional Patent Application Filed (2026)" />
          <InfoRow
            label="Manuscript"
            value="Development and Validation of the Intensive Documentation Index for ICU Mortality Prediction: A Temporal Validation Study"
          />
          <InfoRow label="Status" value="Submitted to medRxiv &bull; Targeting Critical Care Medicine" />
          <InfoRow value="NIH-funded research" label="Funding" />
          <InfoRow
            label="Inventor"
            value="Dr. Alexis Collier, DHA &bull; University of North Georgia"
          />
        </div>
      </div>
    </section>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="py-2 border-b border-border/30 last:border-0">
    <span className="font-semibold text-foreground">{label}: </span>
    <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: value }} />
  </div>
);
