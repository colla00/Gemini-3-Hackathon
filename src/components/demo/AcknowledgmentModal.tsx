import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ACKNOWLEDGMENTS = [
  'This platform is NOT FDA-cleared or approved for any clinical use.',
  'This is NOT intended for clinical decision-making of any kind.',
  'All data shown is SIMULATED DATA ONLY and does not represent real patients.',
  'Patent #1 (ICU Mortality, n=26,153) and Patent #5 (DBS, N=321,719) have completed validation.',
  'Other components (Nursing, Alerts, Risk) are in the DESIGN PHASE with no clinical validation.',
  'This platform is for RESEARCH AND EDUCATIONAL PURPOSES ONLY.',
];

interface AcknowledgmentModalProps {
  open: boolean;
  onAccept: () => void;
}

export const AcknowledgmentModal = ({ open, onAccept }: AcknowledgmentModalProps) => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<boolean[]>(new Array(ACKNOWLEDGMENTS.length).fill(false));

  const allChecked = checked.every(Boolean);

  const toggleCheck = (index: number) => {
    setChecked(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg font-bold text-foreground">
              VitaSignal Technology Demo
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">Research Prototype Access Agreement</p>
        </DialogHeader>

        <Alert variant="destructive" className="my-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-semibold text-sm">
            IMPORTANT: This is a RESEARCH PROTOTYPE demonstration only
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Please acknowledge each item below before proceeding:
          </p>
          {ACKNOWLEDGMENTS.map((text, i) => (
            <label
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg border border-border bg-secondary/30 cursor-pointer hover:bg-secondary/60 transition-colors"
            >
              <Checkbox
                checked={checked[i]}
                onCheckedChange={() => toggleCheck(i)}
                className="mt-0.5"
              />
              <span className="text-sm text-foreground leading-snug">{text}</span>
            </label>
          ))}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Decline &mdash; Return Home
          </Button>
          <Button
            onClick={onAccept}
            disabled={!allChecked}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            I Agree &mdash; Enter Demo
          </Button>
        </DialogFooter>

        <div className="text-center text-xs text-muted-foreground mt-2 space-x-3">
          <Link to="/terms" className="underline hover:text-foreground">Terms of Use</Link>
          <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};
