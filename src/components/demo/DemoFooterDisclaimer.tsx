import { AlertTriangle, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const DemoFooterDisclaimer = () => {
  return (
    <footer className="space-y-4 mt-8">
      <Alert variant="destructive" className="border-destructive/40">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm leading-relaxed">
          <strong>RESEARCH PROTOTYPE DISCLAIMER:</strong> This demonstration uses simulated/de-identified
          data for educational purposes only. VitaSignal is NOT FDA-cleared, NOT approved for clinical use,
          and NOT a medical device. All clinical decisions require qualified healthcare professionals. Only
          VitaSignal Mortality (Patent #1) has completed validation on n=26,153 ICU patients.
        </AlertDescription>
      </Alert>

      <div className="text-center space-y-2 text-xs text-muted-foreground pb-6">
        <div className="flex flex-wrap justify-center gap-6">
          <span>
            For All Inquiries:{' '}
            <a href="mailto:info@alexiscollier.com" className="text-primary hover:underline">
              info@alexiscollier.com
            </a>
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-3 w-3" />
          <span>&copy; 2024-2026 Dr. Alexis M. Collier. All Rights Reserved. &bull; 5 U.S. Patents Filed</span>
        </div>
      </div>
    </footer>
  );
};
