import { useState } from 'react';
import { 
  BookOpen, X, ChevronRight, Clock, MousePointer, Keyboard,
  Lightbulb, AlertTriangle, Award, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TalkingPoint {
  slide: string;
  duration: string;
  keyPoints: string[];
  demoAction?: string;
  patentRef?: string;
}

const talkingPoints: TalkingPoint[] = [
  {
    slide: 'Title',
    duration: '2m',
    keyPoints: [
      'Welcome, introduce yourself',
      'Thank organizers',
      'Research prototype, patent pending',
      'Solo researcher, limitations are mine',
    ],
  },
  {
    slide: 'Agenda',
    duration: '2m',
    keyPoints: [
      '38-minute roadmap',
      'Live demo is the highlight',
      'Questions welcome anytime',
    ],
  },
  {
    slide: 'Problem',
    duration: '5m',
    keyPoints: [
      '700K falls, 2.5M pressure injuries, 75K CAUTIs annually',
      '$50B+ in preventable costs',
      'Current monitoring is retrospective — too late',
      'My question: What if we could predict BEFORE?',
    ],
  },
  {
    slide: 'Comparison',
    duration: '4m',
    keyPoints: [
      'Traditional = reactive, post-event',
      'My approach = predictive, real-time',
      'Augments nursing judgment, does NOT replace',
      'DIFFERENTIATION: Real-time ML + Explainability (unlike Epic/Cerner basic alerts)',
    ],
    patentRef: 'Key Differentiator',
  },
  {
    slide: 'Methodology',
    duration: '8m',
    keyPoints: [
      'Real-time EHR data via HL7 FHIR',
      '47 clinical features from validated scales',
      'Gradient boosting for calibrated probabilities',
      'Target: updates within 5 minutes',
    ],
    patentRef: 'Claims 1-4',
  },
  {
    slide: 'Dashboard',
    duration: '5m',
    keyPoints: [
      'Unit-level snapshot for charge nurses',
      'Priority queue auto-ranks by risk',
      'Red = high, Yellow = elevated, Green = stable',
      'Live indicator confirms real-time updates',
    ],
    demoAction: 'Point out Live indicator and color coding',
    patentRef: 'Claim 6',
  },
  {
    slide: 'Patients',
    duration: '5m',
    keyPoints: [
      'Each row = complete risk profile',
      'Sparklines show 24-hour trends',
      'Confidence indicator = model certainty',
      'Click row for detailed breakdown',
    ],
    demoAction: 'Click a patient row to expand',
  },
  {
    slide: 'SHAP',
    duration: '8m',
    keyPoints: [
      'KEY DIFFERENTIATOR',
      'Most AI is a black box — no explanation',
      'SHAP shows exactly WHY patient is at risk',
      'Red bars = risk factors, Green = protective',
      'Actionable intelligence, not just a number',
    ],
    demoAction: 'Walk through the waterfall chart factors',
    patentRef: 'Claims 4, 8 (KEY)',
  },
  {
    slide: 'Workflow',
    duration: '5m',
    keyPoints: [
      'Human-in-the-loop: AI informs, nurse decides',
      '3-minute average alert-to-awareness',
      'Suggests actions, nurse has final authority',
      'GPS analogy: suggests route, you drive',
    ],
    demoAction: 'Show closed-loop feedback demonstration',
    patentRef: 'Claim 7 (KEY)',
  },
  {
    slide: 'Validation',
    duration: '5m',
    keyPoints: [
      'BE TRANSPARENT: 0.89 AUROC is synthetic data only',
      'NO clinical trial completed yet',
      'Targets are design goals, not proven results',
      'Prospective study in planning',
    ],
  },
  {
    slide: 'ROI',
    duration: '4m',
    keyPoints: [
      'Falls cost approximately $30K each',
      'Pressure injuries $20K-$150K each',
      'These are projections IF validated',
      'Strong financial case if proven',
    ],
  },
  {
    slide: 'Future',
    duration: '3m',
    keyPoints: [
      'Hospital validation study planned 2026',
      'Expand EHR compatibility',
      'Exploring FDA requirements',
      'Seeking partners and collaborators',
    ],
  },
  {
    slide: 'Conclusion',
    duration: '2m',
    keyPoints: [
      'Real-time, explainable risk prediction',
      'Human-in-the-loop design',
      'Research prototype, validation ahead',
      'Thank audience, welcome questions',
    ],
  },
];

const keyboardShortcuts = [
  { key: '←/→', action: 'Previous/Next slide' },
  { key: '1-4', action: 'Jump to dashboard tabs' },
  { key: 'D', action: 'Toggle auto-demo' },
  { key: 'L', action: 'Toggle live updates' },
  { key: 'P', action: 'Print view' },
  { key: 'Space', action: 'Practice mode' },
];

export const PresenterCheatSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-24 right-4 z-50 gap-2 bg-background/90 backdrop-blur-sm print:hidden"
      >
        <BookOpen className="w-4 h-4" />
        Cheat Sheet
      </Button>
    );
  }

  const currentPoint = talkingPoints[activeSlide];

  return (
    <div className="fixed inset-y-4 right-4 w-80 z-50 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden print:hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Presenter Cheat Sheet</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded hover:bg-secondary"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Selector */}
      <div className="p-2 border-b border-border overflow-x-auto">
        <div className="flex gap-1">
          {talkingPoints.map((point, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={cn(
                "px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap transition-colors",
                activeSlide === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              )}
            >
              {point.slide}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Current Slide Info */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">{currentPoint.slide}</h3>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {currentPoint.duration}
            </span>
          </div>

          {currentPoint.patentRef && (
            <div className="flex items-center gap-1 mb-3 px-2 py-1 rounded bg-accent/10 border border-accent/30 w-fit">
              <Award className="w-3 h-3 text-accent" />
              <span className="text-[10px] text-accent font-medium">{currentPoint.patentRef}</span>
            </div>
          )}
        </div>

        {/* Key Points */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Key Points
          </span>
          {currentPoint.keyPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className={cn(
                "text-foreground",
                point.includes('KEY') || point.includes('DIFFERENTIATOR') || point.includes('TRANSPARENT') || point.includes('DIFFERENTIATION') ? "font-bold text-primary" : ""
              )}>
                {point}
              </span>
            </div>
          ))}
        </div>

        {/* Demo Action */}
        {currentPoint.demoAction && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-2 mb-1">
              <MousePointer className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">Demo Action</span>
            </div>
            <p className="text-sm text-foreground">{currentPoint.demoAction}</p>
          </div>
        )}

        {/* Navigation Hint */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <button
            onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
            disabled={activeSlide === 0}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            ← Previous
          </button>
          <span className="text-[10px] text-muted-foreground">
            {activeSlide + 1} / {talkingPoints.length}
          </span>
          <button
            onClick={() => setActiveSlide(Math.min(talkingPoints.length - 1, activeSlide + 1))}
            disabled={activeSlide === talkingPoints.length - 1}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="p-3 border-t border-border bg-secondary/30">
        <div className="flex items-center gap-2 mb-2">
          <Keyboard className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Shortcuts
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          {keyboardShortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                {shortcut.key}
              </kbd>
              <span className="text-muted-foreground">{shortcut.action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Reminders */}
      <div className="p-3 border-t border-border bg-warning/10">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div className="text-[10px] text-warning">
            <strong>Remember:</strong> This is SYNTHETIC DATA. State "research prototype" and "patent pending" at the beginning. Be transparent about validation status.
          </div>
        </div>
      </div>
    </div>
  );
};
