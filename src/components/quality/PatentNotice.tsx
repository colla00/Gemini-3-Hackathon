import { FileText, Award, Shield, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PatentNotice = () => {
  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" aria-hidden="true" />
            <CardTitle className="text-base">Patent Documentation</CardTitle>
          </div>
          <span className="text-xs text-accent font-medium px-2 py-0.5 rounded bg-accent/20 border border-accent/30">
            Patent Pending
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-medium block text-foreground">IP Protected</span>
              <span className="text-muted-foreground">Patent pending status</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-medium block text-foreground">Novel Methods</span>
              <span className="text-muted-foreground">Key innovations</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-medium block text-foreground">Status</span>
              <span className="text-muted-foreground">Application filed</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-center text-muted-foreground">
          Patent pending - proprietary technology
        </p>
      </CardContent>
    </Card>
  );
};

export const PatentBadge = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center gap-1 px-2 py-1 rounded bg-accent/10 border border-accent/30 ${className}`}>
    <Award className="w-3 h-3 text-accent" aria-hidden="true" />
    <span className="text-[10px] text-accent font-medium">
      Patent Pending
    </span>
  </div>
);
