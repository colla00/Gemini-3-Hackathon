import { X, FlaskConical, AlertTriangle, GraduationCap, User, Building } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

export const InfoModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <Info className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <FlaskConical className="w-7 h-7 text-primary" />
            Research Prototype
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <p className="text-muted-foreground">
            Stanford AI+HEALTH 2025 Demonstration
          </p>
          
          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <FlaskConical className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">Interpretable AI with transparent risk factors</span>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">De-identified clinical data · Synthetic scenarios</span>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <GraduationCap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">Human-in-the-loop judgment remains central</span>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-risk-high/10 border border-risk-high/30">
              <X className="w-4 h-4 text-risk-high mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground font-medium">Research prototype · Not for clinical use</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-foreground font-semibold">Dr. Alexis Collier</p>
                <p className="text-sm text-muted-foreground">AIM-AHEAD CLINAQ Fellow (NIH)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-primary" />
              <p className="text-foreground">University of North Georgia</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
