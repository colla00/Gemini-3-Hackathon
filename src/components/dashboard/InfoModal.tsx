import { useState } from 'react';
import { X, FlaskConical, AlertTriangle, GraduationCap, User, Building, ShieldX, Database, Scale, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InfoModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export const InfoModal = ({ open, onOpenChange, showTrigger = true }: InfoModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <Info className="w-5 h-5" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="bg-card border-border max-w-lg max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <FlaskConical className="w-7 h-7 text-primary" />
            Research Prototype
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="mt-4 space-y-4">
            <p className="text-muted-foreground">
              Research Prototype Demonstration
            </p>
            
            {/* Key Features */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <FlaskConical className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">Interpretable AI with SHAP-based transparent risk factors</span>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <GraduationCap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">Human-in-the-loop judgment remains central to all decisions</span>
              </div>
            </div>

            {/* Regulatory Compliance Section */}
            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Regulatory Status</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-risk-high/10 border border-risk-high/30">
                  <ShieldX className="w-4 h-4 text-risk-high mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="text-foreground font-medium">Not FDA Cleared or Approved</span>
                    <p className="text-muted-foreground text-xs mt-0.5">This software has not been reviewed by the U.S. Food and Drug Administration</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-risk-high/10 border border-risk-high/30">
                  <X className="w-4 h-4 text-risk-high mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="text-foreground font-medium">Not a Medical Device</span>
                    <p className="text-muted-foreground text-xs mt-0.5">Not intended for diagnosis, treatment, or clinical decision-making</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="text-foreground font-medium">Educational & Research Purposes Only</span>
                    <p className="text-muted-foreground text-xs mt-0.5">Intended solely for academic demonstration and research exploration</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sources Section */}
            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Data Sources & Attribution</h4>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <Database className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground space-y-1.5">
                  <p><span className="text-foreground font-medium">Synthetic demonstration data</span> generated for illustration purposes.</p>
                  <p className="text-[10px]">Research methodology informed by publicly available critical care databases:</p>
                  <ul className="text-[10px] space-y-0.5 ml-2">
                    <li>• MIMIC-IV (PhysioNet, Beth Israel Deaconess Medical Center)</li>
                    <li>• eICU Collaborative Research Database (Philips/MIT)</li>
                    <li>• HiRID (ETH Zurich, Bern University Hospital)</li>
                  </ul>
                  <p className="text-[10px] italic">All patient data shown is synthetic. No real patient information is displayed.</p>
                </div>
              </div>
            </div>

            {/* Ethics Section */}
            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Research Ethics</h4>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <Scale className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p>This demonstration prototype uses only synthetic data and does not involve human subjects research requiring IRB oversight.</p>
                  <p className="mt-1">Conducted under the AIM-AHEAD Fellowship Program (NIH) mentorship framework.</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="pt-3 border-t border-border">
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    <strong>Disclaimer:</strong> This software is a research prototype provided "AS IS" for educational and demonstration purposes only. 
                    It has not been cleared or approved by the U.S. Food and Drug Administration (FDA). It is not a medical device under 21 CFR Part 820 
                    and is not intended for diagnosis, treatment, cure, mitigation, or prevention of any disease or condition. 
                    All data shown is simulated and does not represent real patients. All risk scores and predictions are illustrative only. 
                    Clinical judgment by qualified healthcare professionals is always required. 
                    The author(s) and affiliated institutions disclaim all liability for any use of this demonstration software.
                    <br /><br />
                    <strong>Intellectual Property:</strong> 4 U.S. Patents Filed. 
                    © 2024–2026 Dr. Alexis Collier. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Affiliation */}
            <div className="pt-3 border-t border-border space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Research</h4>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-foreground font-semibold">AIM-AHEAD CLINAQ Fellow</p>
                  <p className="text-xs text-muted-foreground">NIH-funded Research Initiative</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-foreground">University of North Georgia</p>
                  <p className="text-xs text-muted-foreground">College of Health Sciences & Professions</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};