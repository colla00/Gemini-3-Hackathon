import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const TERMS_ACCEPTED_KEY = 'nso_terms_accepted';
const TERMS_VERSION = '1.0'; // Increment this to require re-acceptance

export const TermsAcceptanceModal = () => {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const storedAcceptance = localStorage.getItem(TERMS_ACCEPTED_KEY);
    if (storedAcceptance !== TERMS_VERSION) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (accepted) {
      localStorage.setItem(TERMS_ACCEPTED_KEY, TERMS_VERSION);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="bg-card border-border max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Terms of Use
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Please review and accept before continuing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Research Prototype Warning */}
          <div className="p-4 rounded-lg bg-risk-high/10 border border-risk-high/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-risk-high flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">Research Prototype</p>
                <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                  <li>• Not FDA cleared or approved</li>
                  <li>• Not a medical device</li>
                  <li>• Not for clinical decision-making</li>
                  <li>• Simulated data only</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Terms Summary */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground space-y-2">
            <p>By using this software, you acknowledge that:</p>
            <ul className="space-y-1 text-xs">
              <li>• This is for educational and demonstration purposes only</li>
              <li>• All clinical decisions require qualified human judgment</li>
              <li>• The software is provided "AS IS" without warranties</li>
              <li>• You will not use this for actual patient care</li>
            </ul>
          </div>

          {/* Acceptance Checkbox */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border">
            <Checkbox 
              id="terms-accept" 
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="terms-accept" className="text-sm text-foreground cursor-pointer">
              I have read and agree to the{' '}
              <Link 
                to="/terms" 
                target="_blank"
                className="text-primary hover:underline font-medium"
              >
                Terms of Use
              </Link>
              , including the disclaimers regarding research prototype status and limitations.
            </label>
          </div>

          {/* Accept Button */}
          <Button 
            onClick={handleAccept} 
            disabled={!accepted}
            className="w-full"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Accept and Continue
          </Button>

          {/* Copyright Notice */}
          <p className="text-[10px] text-center text-muted-foreground">
            © 2024–2026 Dr. Alexis Collier. All Rights Reserved.<br />
            5 U.S. Patent Applications Filed
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
