import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const PatentPublicationInfo = () => {
  return (
    <Card className="bg-secondary/50 border-border">
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground">Patent & Publication</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <InfoRow label="Patent #1" value="U.S. Provisional Patent Application Filed (2026)" />
          <InfoRow
            label="Manuscript"
            value="Development and Validation of the Intensive Documentation Index for ICU Mortality Prediction: A Temporal Validation Study"
          />
          <InfoRow label="Status" value="Submitted to medRxiv &bull; Targeting Critical Care Medicine" />
          <InfoRow
            label="Funding"
            value="NIH-funded research"
          />
          <InfoRow
            label="Inventor"
            value="Dr. Alexis Collier, DHA &bull; University of North Georgia"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="py-1.5">
    <span className="font-semibold text-foreground">{label}: </span>
    <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: value }} />
  </div>
);
