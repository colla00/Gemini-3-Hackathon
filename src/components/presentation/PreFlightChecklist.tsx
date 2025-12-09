import { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, Circle, Monitor, Volume2, Timer, Wifi, 
  Play, X, AlertTriangle, Rocket, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  check: () => Promise<boolean>;
  required: boolean;
}

interface PreFlightChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: () => void;
}

export const PreFlightChecklist = ({ isOpen, onClose, onLaunch }: PreFlightChecklistProps) => {
  const [checkResults, setCheckResults] = useState<Record<string, 'pending' | 'checking' | 'pass' | 'fail'>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [allChecked, setAllChecked] = useState(false);

  const checklistItems: ChecklistItem[] = [
    {
      id: 'audio',
      label: 'Audio System',
      description: 'Text-to-speech and sound effects available',
      icon: Volume2,
      required: false,
      check: async () => {
        return 'speechSynthesis' in window;
      },
    },
    {
      id: 'screen',
      label: 'Display Ready',
      description: 'Screen resolution optimal for presentation',
      icon: Monitor,
      required: true,
      check: async () => {
        return window.innerWidth >= 1024;
      },
    },
    {
      id: 'timer',
      label: 'Timer System',
      description: 'Presentation timer initialized',
      icon: Timer,
      required: true,
      check: async () => {
        return true; // Always passes
      },
    },
    {
      id: 'connection',
      label: 'Network Status',
      description: 'Internet connection for live features',
      icon: Wifi,
      required: false,
      check: async () => {
        return navigator.onLine;
      },
    },
  ];

  const runChecks = useCallback(async () => {
    setIsChecking(true);
    const results: Record<string, 'pending' | 'checking' | 'pass' | 'fail'> = {};
    
    // Initialize all as checking
    checklistItems.forEach(item => {
      results[item.id] = 'checking';
    });
    setCheckResults({ ...results });

    // Run checks sequentially with delay for visual effect
    for (const item of checklistItems) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const passed = await item.check();
      results[item.id] = passed ? 'pass' : 'fail';
      setCheckResults({ ...results });
    }

    setIsChecking(false);
    
    // Check if all required items passed
    const allRequiredPassed = checklistItems
      .filter(item => item.required)
      .every(item => results[item.id] === 'pass');
    setAllChecked(allRequiredPassed);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCheckResults({});
      setAllChecked(false);
      // Auto-run checks when modal opens
      const timer = setTimeout(runChecks, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, runChecks]);

  const passedCount = Object.values(checkResults).filter(r => r === 'pass').length;
  const progress = (passedCount / checklistItems.length) * 100;

  const getStatusIcon = (status: string, required: boolean) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-risk-low" />;
      case 'fail':
        return required 
          ? <AlertTriangle className="w-5 h-5 text-risk-high" />
          : <Circle className="w-5 h-5 text-risk-medium" />;
      case 'checking':
        return <RefreshCw className="w-5 h-5 text-primary animate-spin" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Pre-Flight Checklist
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">System Check Progress</span>
              <span className="font-medium">{passedCount}/{checklistItems.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Checklist Items */}
          <div className="space-y-2">
            {checklistItems.map((item) => {
              const status = checkResults[item.id] || 'pending';
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    status === 'pass' && "bg-risk-low/5 border-risk-low/30",
                    status === 'fail' && item.required && "bg-risk-high/5 border-risk-high/30",
                    status === 'fail' && !item.required && "bg-risk-medium/5 border-risk-medium/30",
                    status === 'checking' && "bg-primary/5 border-primary/30",
                    status === 'pending' && "bg-secondary border-border"
                  )}
                >
                  {getStatusIcon(status, item.required)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      {item.label}
                      {!item.required && (
                        <span className="text-xs text-muted-foreground">(optional)</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              );
            })}
          </div>

          {/* Status Message */}
          {allChecked && !isChecking && (
            <div className="p-3 rounded-lg bg-risk-low/10 border border-risk-low/30 text-center">
              <p className="text-sm font-medium text-risk-low">
                ✓ All systems ready for presentation!
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={onLaunch}
            disabled={!allChecked || isChecking}
            className="flex-1 bg-risk-low hover:bg-risk-low/90"
          >
            <Play className="w-4 h-4 mr-1" />
            Go Live
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
