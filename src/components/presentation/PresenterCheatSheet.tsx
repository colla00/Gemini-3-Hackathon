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
      'Say hi, introduce yourself',
      'Thank everyone for coming',
      'This is a prototype - still research',
      'Patent pending - my own work',
    ],
  },
  {
    slide: 'Agenda',
    duration: '2m',
    keyPoints: [
      'Quick roadmap of 38 minutes',
      'Demo is the fun part',
      'Questions welcome anytime',
    ],
  },
  {
    slide: 'Problem',
    duration: '5m',
    keyPoints: [
      '700K falls, 2.5M bed sores, 75K catheter infections per year',
      '$50 billion in costs',
      'Current systems tell us AFTER bad stuff happens',
      'What if we could predict problems BEFORE?',
    ],
  },
  {
    slide: 'Comparison',
    duration: '4m',
    keyPoints: [
      'Old way: react after the fact',
      'My way: predict and prevent',
      'NOT replacing nurses - helping them',
      'COMPETITIVE EDGE: Unlike Epic/Cerner reminders - this is real-time ML with explainability',
    ],
    patentRef: 'Differentiation',
  },
  {
    slide: 'Methodology',
    duration: '8m',
    keyPoints: [
      'Pulls data from medical records in real-time',
      '47 clinical factors analyzed',
      'Uses gradient boosting AI',
      'Updates within 5 minutes of new data',
    ],
    patentRef: 'Claims 1-4',
  },
  {
    slide: 'Dashboard',
    duration: '5m',
    keyPoints: [
      'Quick stats at top for whole unit',
      'Priority queue auto-ranks patients by risk',
      'Red = danger, Yellow = watch, Green = okay',
      'Updates every 5 minutes',
    ],
    demoAction: 'Point out Live indicator, color coding',
    patentRef: 'Claim 6',
  },
  {
    slide: 'Patients',
    duration: '5m',
    keyPoints: [
      'Each row shows all risks for one patient',
      'Mini charts show 24-hour trends',
      'Confidence indicator = how sure AI is',
      'Click any row for details',
    ],
    demoAction: 'Click a patient row to expand details',
  },
  {
    slide: 'SHAP',
    duration: '8m',
    keyPoints: [
      'THIS IS THE BIG DIFFERENTIATOR',
      'Most AI is a black box - no explanation',
      'SHAP shows WHY patient is at risk',
      'Red bars = bad, Green bars = protective',
      'Nurses can take action on specific factors',
    ],
    demoAction: 'Walk through the waterfall chart',
    patentRef: 'Claims 4, 8 (KEY)',
  },
  {
    slide: 'Workflow',
    duration: '5m',
    keyPoints: [
      'AI informs, nurse decides - always',
      'Alert to nurse in about 3 minutes',
      'Suggests actions, nurse has final say',
      'Like GPS - suggests route, you drive',
    ],
    demoAction: 'Show the closed-loop feedback demo',
    patentRef: 'Claim 7 (KEY)',
  },
  {
    slide: 'Validation',
    duration: '5m',
    keyPoints: [
      'BE HONEST: 0.89 accuracy is from TEST DATA only',
      'NO clinical trial done yet',
      'Goals are TARGETS, not proven results',
      'Real hospital study is being planned',
    ],
  },
  {
    slide: 'ROI',
    duration: '4m',
    keyPoints: [
      'Falls cost ~$30K each',
      'Bed sores $20K-$150K each',
      'These are projections IF it works',
      'Strong financial case if validated',
    ],
  },
  {
    slide: 'Future',
    duration: '3m',
    keyPoints: [
      'Real hospital study planned 2026',
      'Want to work with more EHR systems',
      'Looking into FDA requirements',
      'NEED PARTNERS AND COLLABORATORS',
    ],
  },
  {
    slide: 'Conclusion',
    duration: '2m',
    keyPoints: [
      'AI predicts problems in real-time',
      'Shows nurses WHY (not just what)',
      'Helps nurses, does not replace them',
      'Thank everyone, take questions',
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
            Say This
          </span>
          {currentPoint.keyPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className={cn(
                "text-foreground",
                point.includes('KEY') || point.includes('DIFFERENTIATOR') || point.includes('HONEST') || point.includes('COMPETITIVE') ? "font-bold text-primary" : ""
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
              <span className="text-xs font-semibold text-primary">Do This</span>
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
            <strong>Remember:</strong> This is TEST DATA. Say "research prototype" and "patent pending" at the start. Be HONEST about validation status.
          </div>
        </div>
      </div>
    </div>
  );
};
