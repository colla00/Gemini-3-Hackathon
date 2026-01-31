import { useState, useEffect, useCallback } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX,
  Presentation, ChevronRight, Clock, LayoutDashboard, Users,
  BarChart3, GitBranch, Target, Database, TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DemoStep {
  id: string;
  title: string;
  view: string;
  narration: string;
  duration: number; // seconds
  icon: React.ReactNode;
  highlights?: string[];
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: 'intro',
    title: 'Welcome',
    view: 'dashboard',
    narration: "Welcome to the CareGuard Clinical Dashboard. This research prototype demonstrates AI-powered predictive analytics for nurse-sensitive outcomes. Let's explore the key features.",
    duration: 8,
    icon: <Presentation className="w-4 h-4" />,
    highlights: ['Real-time risk monitoring', 'SHAP explainability', 'Clinical workflow integration']
  },
  {
    id: 'overview',
    title: 'Dashboard Overview',
    view: 'dashboard',
    narration: "The overview shows unit-level risk aggregates across Falls, Pressure Injuries, and CAUTI. Each card displays confidence scores, trend indicators, and contributing factors identified by our ML models.",
    duration: 12,
    icon: <LayoutDashboard className="w-4 h-4" />,
    highlights: ['Risk categories', 'Confidence indicators', 'Priority queue']
  },
  {
    id: 'patients',
    title: 'Patient Worklist',
    view: 'patients',
    narration: "The patient worklist prioritizes patients by composite risk score. High-risk patients are highlighted with immediate intervention suggestions. Each patient card shows multi-outcome risk profiles.",
    duration: 10,
    icon: <Users className="w-4 h-4" />,
    highlights: ['Risk-based prioritization', 'Intervention tracking', 'Trend analysis']
  },
  {
    id: 'shap',
    title: 'SHAP Explainability',
    view: 'shap',
    narration: "SHAP values provide transparent risk attribution. Positive values indicate factors increasing risk, while negative values are protective. This enables clinicians to understand why the AI made its prediction.",
    duration: 12,
    icon: <BarChart3 className="w-4 h-4" />,
    highlights: ['Feature importance', 'Directional attribution', 'Clinical interpretability']
  },
  {
    id: 'workflow',
    title: 'Clinical Workflow',
    view: 'workflow',
    narration: "The workflow demo shows how predictions integrate into clinical processes. From EHR data ingestion through risk stratification to suggested interventions and handoff reports.",
    duration: 10,
    icon: <GitBranch className="w-4 h-4" />,
    highlights: ['EHR integration', 'Real-time updates', 'Handoff automation']
  },
  {
    id: 'validation',
    title: 'Model Validation',
    view: 'validation',
    narration: "This dashboard shows our target performance metrics. We are aiming for an AUC above 0.85, with approximately 80% sensitivity and specificity. These are illustrative targets for our planned validation study.",
    duration: 12,
    icon: <Target className="w-4 h-4" />,
    highlights: ['Target AUC-ROC', 'Planned calibration', 'Stability goals']
  },
  {
    id: 'integration',
    title: 'EHR Integration',
    view: 'integration',
    narration: "The architecture is designed for enterprise EHR integration via HL7 FHIR and HL7v2. The system is built to support Epic and Cerner with sub-30-second latency targets for real-time predictions.",
    duration: 10,
    icon: <Database className="w-4 h-4" />,
    highlights: ['FHIR R4 architecture', 'Epic/Cerner compatible', 'HIPAA-ready design']
  },
  {
    id: 'outcomes',
    title: 'Clinical Outcomes',
    view: 'outcomes',
    narration: "These are design targets, not validated results. We aim for approximately 40% reduction in preventable events. No clinical trials have been conducted. Annual savings projections require validation.",
    duration: 12,
    icon: <TrendingDown className="w-4 h-4" />,
    highlights: ['Design target: ~40% reduction', 'Not validated', 'Requires clinical study']
  },
  {
    id: 'closing',
    title: 'Questions?',
    view: 'dashboard',
    narration: "Thank you for watching this demo. The methodology chatbot in the bottom right can answer technical questions. This technology is protected by 4 U.S. patent applications.",
    duration: 8,
    icon: <Presentation className="w-4 h-4" />,
    highlights: ['4 patents filed', 'Research prototype', 'Human-in-the-loop']
  }
];

interface GuidedDemoProps {
  onViewChange: (view: string) => void;
  currentView: string;
}

export const GuidedDemo = ({ onViewChange, currentView }: GuidedDemoProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const currentStep = DEMO_STEPS[currentStepIndex];
  const totalDuration = DEMO_STEPS.reduce((acc, s) => acc + s.duration, 0);
  const elapsedDuration = DEMO_STEPS.slice(0, currentStepIndex).reduce((acc, s) => acc + s.duration, 0) + 
    (stepProgress / 100) * currentStep.duration;

  // Progress timer
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setStepProgress(prev => {
        const increment = 100 / (currentStep.duration * 10); // Update every 100ms
        if (prev + increment >= 100) {
          // Move to next step
          if (currentStepIndex < DEMO_STEPS.length - 1) {
            setCurrentStepIndex(i => i + 1);
            return 0;
          } else {
            setIsActive(false);
            return 100;
          }
        }
        return prev + increment;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isPaused, currentStepIndex, currentStep.duration]);

  // Change view when step changes
  useEffect(() => {
    if (isActive && currentStep.view !== currentView) {
      onViewChange(currentStep.view);
    }
  }, [currentStepIndex, isActive, currentStep.view, currentView, onViewChange]);

  // Text-to-speech narration
  useEffect(() => {
    if (!isActive || isMuted || isPaused) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentStep.narration);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStepIndex, isActive, isMuted, isPaused, currentStep.narration]);

  const startDemo = () => {
    setIsActive(true);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setStepProgress(0);
  };

  const stopDemo = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setStepProgress(0);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const nextStep = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex(i => i + 1);
      setStepProgress(0);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1);
      setStepProgress(0);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if ('speechSynthesis' in window) {
      if (isPaused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.pause();
      }
    }
  };

  if (!isActive) {
    return (
      <Button
        onClick={() => window.location.href = '/presentation'}
        variant="outline"
        size="sm"
        className="gap-1.5 bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 text-xs"
      >
        <Presentation className="w-3.5 h-3.5" />
        <span className="hidden md:inline">45-Min Walkthrough</span>
        <span className="md:hidden">Demo</span>
      </Button>
    );
  }

  return (
    <Card className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl shadow-2xl border-primary/30 bg-background/95 backdrop-blur">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Presentation className="w-3 h-3 mr-1" />
              Guided Demo
            </Badge>
            <span className="text-xs text-muted-foreground">
              Step {currentStepIndex + 1} of {DEMO_STEPS.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {Math.floor(elapsedDuration / 60)}:{String(Math.floor(elapsedDuration % 60)).padStart(2, '0')} / 
              {Math.floor(totalDuration / 60)}:{String(totalDuration % 60).padStart(2, '0')}
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={stopDemo}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Current Step */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            {currentStep.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm">{currentStep.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{currentStep.narration}</p>
          </div>
        </div>

        {/* Highlights */}
        {currentStep.highlights && (
          <div className="flex flex-wrap gap-1 mb-3">
            {currentStep.highlights.map((h, idx) => (
              <Badge key={idx} variant="outline" className="text-[10px] py-0">
                <ChevronRight className="w-2.5 h-2.5 mr-0.5" />
                {h}
              </Badge>
            ))}
          </div>
        )}

        {/* Progress */}
        <Progress value={stepProgress} className="h-1 mb-3" />

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevStep} disabled={currentStepIndex === 0}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={togglePause}>
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextStep} disabled={currentStepIndex === DEMO_STEPS.length - 1}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1 mt-3 justify-center">
          {DEMO_STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => { setCurrentStepIndex(idx); setStepProgress(0); }}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === currentStepIndex ? "bg-primary w-4" :
                idx < currentStepIndex ? "bg-primary/50" : "bg-muted"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
