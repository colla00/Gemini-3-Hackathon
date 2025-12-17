import { FileText, Award, Shield, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PATENT_APP_NUMBER = '63/932,953';
const FILING_DATE = 'December 2024';

export const PatentNotice = () => {
  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            <CardTitle className="text-base">Patent Documentation</CardTitle>
          </div>
          <span className="text-xs text-accent font-medium px-2 py-0.5 rounded bg-accent/20 border border-accent/30">
            U.S. Prov. Pat. App. {PATENT_APP_NUMBER}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-medium block text-foreground">IP Protected</span>
              <span className="text-muted-foreground">Patent pending status</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-medium block text-foreground">Novel Methods</span>
              <span className="text-muted-foreground">5 key innovations</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-medium block text-foreground">Filed</span>
              <span className="text-muted-foreground">{FILING_DATE}</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded bg-muted/20 border border-border/30 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Covered Innovations:</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>Real-time SHAP integration for clinical workflows</li>
            <li>Multi-outcome NSO risk prediction system</li>
            <li>AI-guided intervention suggestion framework</li>
            <li>Intervention efficacy tracking methodology</li>
            <li>Confidence-based risk stratification</li>
          </ul>
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
    <Award className="w-3 h-3 text-accent" />
    <span className="text-[10px] text-accent font-medium">
      U.S. Pat. App. 63/932,953
    </span>
  </div>
);
