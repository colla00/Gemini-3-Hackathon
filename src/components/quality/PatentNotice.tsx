import { FileText, Award, Shield, Lightbulb, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PatentNotice = () => {
  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" aria-hidden="true" />
            <CardTitle className="text-base">U.S. Provisional Patent Application</CardTitle>
          </div>
          <span className="text-xs text-accent font-medium px-2 py-0.5 rounded bg-accent/20 border border-accent/30">
            Patent Pending
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded bg-background/50 border border-border/30">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Clinical Risk Intelligence System with Integrated Explainability, Temporal Forecasting, Adaptive Thresholds, and Closed-Loop Intervention Feedback
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" aria-hidden="true" />
              <span>Inventor: Alexis Collier</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              <span>Filed: December 2025</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-medium block text-foreground">IP Protected</span>
              <span className="text-muted-foreground">35 U.S.C. § 111(b)</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-medium block text-foreground">20 Claims</span>
              <span className="text-muted-foreground">Novel integrated system</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-medium block text-foreground">Status</span>
              <span className="text-muted-foreground">Provisional filed</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-center text-muted-foreground">
          © 2025 Alexis Collier. All rights reserved. Patent pending pursuant to 35 U.S.C. § 111(b).
        </p>
      </CardContent>
    </Card>
  );
};

export const PatentBadge = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center gap-1 px-2 py-1 rounded bg-accent/10 border border-accent/30 ${className}`}>
    <Award className="w-3 h-3 text-accent" aria-hidden="true" />
    <span className="text-[10px] text-accent font-medium">
      Patent Pending · Alexis Collier · Dec 2025
    </span>
  </div>
);
