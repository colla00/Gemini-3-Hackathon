import { useState, useEffect, useCallback } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Maximize2, Minimize2, Clock, ChevronRight, CheckCircle,
  BookOpen, Mic, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface DemoStep {
  id: string;
  title: string;
  duration: number; // seconds
  narration: string;
  presenterNotes: string;
  keyPoints: string[];
  patentClaim?: string;
}

const demoSteps: DemoStep[] = [
  {
    id: 'intro',
    title: 'Introduction & Problem Statement',
    duration: 45,
    narration: 'Welcome to the VitaSignal™ demonstration. Today we present a patent-pending approach to predictive analytics in nursing care.',
    presenterNotes: 'Start with the problem: 7-15% of hospitalized patients experience adverse events. Traditional monitoring is reactive.',
    keyPoints: [
      'Hospital adverse events affect millions annually',
      'Current systems lack predictive capability',
      'Nursing-sensitive outcomes are often preventable'
    ],
    patentClaim: 'Claim 1: Real-time integration of SHAP values with clinical decision support'
  },
  {
    id: 'architecture',
    title: 'System Architecture Overview',
    duration: 60,
    narration: 'Our system employs a novel three-layer architecture combining real-time data ingestion, multi-variable machine learning, and explainable AI outputs.',
    presenterNotes: 'Emphasize the novelty of real-time SHAP computation at bedside. Mention patent-pending status.',
    keyPoints: [
      'Real-time EHR data integration',
      'Multi-variable ML with proprietary architecture',
      'Novel SHAP attribution pipeline',
      'Sub-second prediction latency'
    ],
    patentClaim: 'Claim 2: Continuous temporal stability monitoring of prediction confidence'
  },
  {
    id: 'risk-stratification',
    title: 'Dynamic Risk Stratification',
    duration: 90,
    narration: 'The dashboard demonstrates dynamic risk stratification with color-coded severity levels and trending indicators.',
    presenterNotes: 'Show the priority queue. Point out real-time updates. Demonstrate trending arrows.',
    keyPoints: [
      'Multi-dimensional risk scoring',
      'Temporal trend analysis',
      'Automated priority sorting',
      'Visual severity mapping'
    ],
    patentClaim: 'Claim 3: Automated clinical workflow triggering based on risk thresholds'
  },
  {
    id: 'shap-explainability',
    title: 'SHAP-Based Explainability',
    duration: 120,
    narration: 'Our patent-pending SHAP integration provides real-time feature attribution, enabling clinicians to understand why the AI made each prediction.',
    presenterNotes: 'THIS IS THE KEY INNOVATION. Emphasize real-time SHAP, not batch. Show feature importance.',
    keyPoints: [
      'Real-time SHAP computation',
      'Top contributing factors displayed',
      'Bidirectional attribution (risk vs protective)',
      'Clinical context mapping'
    ],
    patentClaim: 'Claim 4: Real-time SHAP feature attribution with clinical terminology mapping'
  },
  {
    id: 'intervention-workflow',
    title: 'AI-Guided Intervention Workflow',
    duration: 90,
    narration: 'The system guides clinical interventions through evidence-based recommendations tied to specific risk factors.',
    presenterNotes: 'Show intervention panel. Emphasize human-in-the-loop design. AI suggests, nurse decides.',
    keyPoints: [
      'Evidence-based recommendations',
      'Human-in-the-loop validation',
      'Outcome tracking integration',
      'Intervention efficacy feedback'
    ],
    patentClaim: 'Claim 5: Closed-loop intervention tracking with efficacy measurement'
  },
  {
    id: 'validation',
    title: 'Clinical Validation Results',
    duration: 60,
    narration: 'These illustrative metrics demonstrate the target performance goals for our predictive system.',
    presenterNotes: 'Present illustrative metrics: AUC-ROC 0.847, Sensitivity 0.82. Emphasize these are targets, not validated results.',
    keyPoints: [
      'Target AUC-ROC: 0.847 (illustrative)',
      'Target Sensitivity: 82% at 85% specificity',
      'Earlier detection goal: 4+ hours',
      'Validation studies planned'
    ]
  },
  {
    id: 'conclusion',
    title: 'Conclusion & Future Work',
    duration: 45,
    narration: 'In conclusion, our patent-pending system represents a significant advancement in predictive clinical decision support.',
    presenterNotes: 'Summarize key claims. Mention ongoing prospective study. Thank audience.',
    keyPoints: [
      '5 novel patent claims submitted',
      'Prospective validation underway',
      'Multi-site deployment planned',
      'Technology transfer opportunities'
    ]
  }
];

interface GuidedDemoPanelProps {
  onNavigateToView?: (view: string) => void;
}

export const GuidedDemoPanel = ({ onNavigateToView }: GuidedDemoPanelProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const currentStep = demoSteps[currentStepIndex];
  const totalDuration = demoSteps.reduce((sum, step) => sum + step.duration, 0);
  const completedDuration = demoSteps.slice(0, currentStepIndex).reduce((sum, step) => sum + step.duration, 0) + elapsed;
  const overallProgress = (completedDuration / totalDuration) * 100;

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setElapsed(prev => {
        if (prev >= currentStep.duration) {
          // Move to next step
          if (currentStepIndex < demoSteps.length - 1) {
            setCurrentStepIndex(i => i + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return prev;
          }
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentStep.duration, currentStepIndex]);

  // Web Speech API narration
  useEffect(() => {
    if (!isPlaying || !audioEnabled || !('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(currentStep.narration);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentStepIndex, isPlaying, audioEnabled, currentStep.narration]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1);
      setElapsed(0);
    }
  }, [currentStepIndex]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < demoSteps.length - 1) {
      setCurrentStepIndex(i => i + 1);
      setElapsed(0);
    }
  }, [currentStepIndex]);

  const handleStepClick = useCallback((index: number) => {
    setCurrentStepIndex(index);
    setElapsed(0);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Main Control Panel */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Guided Demo Mode</CardTitle>
                <p className="text-xs text-muted-foreground">Patent-Pending Presentation • {demoSteps.length} Sections</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(totalDuration)} total
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Overall Progress</span>
              <span>{formatTime(Math.round(completedDuration))} / {formatTime(totalDuration)}</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Current Step Display */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-primary">
                    Step {currentStepIndex + 1}/{demoSteps.length}
                  </span>
                  {currentStep.patentClaim && (
                    <Badge className="bg-amber-500/20 text-amber-500 text-[10px]">
                      Patent Claim
                    </Badge>
                  )}
                </div>
                <h3 className="text-base font-semibold text-foreground">{currentStep.title}</h3>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono text-foreground">
                  {formatTime(currentStep.duration - elapsed)}
                </div>
                <div className="text-[10px] text-muted-foreground">remaining</div>
              </div>
            </div>

            {/* Step Progress */}
            <Progress 
              value={(elapsed / currentStep.duration) * 100} 
              className="h-1.5 mb-4"
            />

            {/* Narration Text */}
            <div className="p-3 rounded bg-background/50 border border-border/30 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-medium text-primary uppercase tracking-wide">Narration Script</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{currentStep.narration}</p>
            </div>

            {/* Key Points */}
            <div className="space-y-1.5">
              {currentStep.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ChevronRight className="w-3 h-3 text-primary" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              className="w-14 h-14 rounded-full"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentStepIndex === demoSteps.length - 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <div className="border-l border-border/50 pl-3 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={audioEnabled ? 'text-primary' : 'text-muted-foreground'}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotes(!showNotes)}
                className={showNotes ? 'text-primary' : 'text-muted-foreground'}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      {isExpanded && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Presentation Outline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {demoSteps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(idx)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all",
                    idx === currentStepIndex
                      ? "bg-primary/10 border border-primary/30"
                      : idx < currentStepIndex
                        ? "bg-secondary/30 border border-transparent"
                        : "hover:bg-secondary/50 border border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    idx < currentStepIndex
                      ? "bg-risk-low/20 text-risk-low"
                      : idx === currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                  )}>
                    {idx < currentStepIndex ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      idx === currentStepIndex ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{formatTime(step.duration)}</p>
                  </div>
                  {step.patentClaim && (
                    <Badge variant="outline" className="text-[9px] shrink-0">
                      Claim {idx + 1}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Presenter Notes Panel */}
      {showNotes && isExpanded && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <CardTitle className="text-sm text-amber-500">Presenter Notes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">{currentStep.presenterNotes}</p>
            {currentStep.patentClaim && (
              <div className="mt-3 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs font-medium text-amber-500">{currentStep.patentClaim}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
