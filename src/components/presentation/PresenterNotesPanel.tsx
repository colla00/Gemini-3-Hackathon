import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, ChevronRight, Clock, BookOpen, 
  Lightbulb, MessageSquare, Eye, EyeOff
} from 'lucide-react';
import { PRESENTATION_SLIDES, type SlideType, TOTAL_PRESENTATION_TIME } from './PresentationSlide';
import { Button } from '@/components/ui/button';

interface PresenterNotesPanelProps {
  currentSlide: SlideType;
  elapsedMinutes: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  onGoToSlide: (slideId: SlideType) => void;
}

export const PresenterNotesPanel = ({
  currentSlide,
  elapsedMinutes,
  onNavigate,
  onGoToSlide,
}: PresenterNotesPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNotes, setShowNotes] = useState(true);

  const currentIndex = PRESENTATION_SLIDES.findIndex(s => s.id === currentSlide);
  const slide = PRESENTATION_SLIDES[currentIndex];
  const nextSlide = PRESENTATION_SLIDES[currentIndex + 1];
  const prevSlide = PRESENTATION_SLIDES[currentIndex - 1];

  // Calculate expected vs actual time
  const expectedTimeAtSlide = PRESENTATION_SLIDES
    .slice(0, currentIndex)
    .reduce((acc, s) => acc + s.duration, 0);
  const timeDelta = elapsedMinutes - expectedTimeAtSlide;
  const isAhead = timeDelta < 0;
  const isBehind = timeDelta > 2;

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-lg bg-card border border-border shadow-lg hover:bg-secondary transition-colors print:hidden"
        title="Show presenter notes"
      >
        <BookOpen className="w-5 h-5 text-primary" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 w-96 max-h-[50vh] bg-card border-l border-t border-border shadow-2xl print:hidden overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-secondary/50">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-foreground">Presenter Notes</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title={showNotes ? "Hide notes" : "Show notes"}
          >
            {showNotes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timing Bar */}
      <div className="px-3 py-2 border-b border-border bg-background">
        <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Elapsed:</span>
            <span className="font-mono font-medium text-foreground">{elapsedMinutes}m</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Expected:</span>
            <span className="font-mono font-medium text-foreground">{expectedTimeAtSlide}m</span>
          </div>
          <div className={cn(
            "px-2 py-0.5 rounded text-[10px] font-medium",
            isAhead ? "bg-risk-low/20 text-risk-low" :
            isBehind ? "bg-risk-high/20 text-risk-high" :
            "bg-primary/20 text-primary"
          )}>
            {isAhead ? `${Math.abs(timeDelta)}m ahead` :
             isBehind ? `${timeDelta}m behind` :
             "On track"}
          </div>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(elapsedMinutes / TOTAL_PRESENTATION_TIME) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>0m</span>
          <span>{TOTAL_PRESENTATION_TIME}m total</span>
        </div>
      </div>

      {/* Current Slide Info */}
      <div className="px-3 py-2 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">
              Slide {currentIndex + 1} of {PRESENTATION_SLIDES.length}
            </div>
            <div className="font-semibold text-foreground">{slide.title}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Duration</div>
            <div className="font-mono font-medium text-foreground">{slide.duration}m</div>
          </div>
        </div>
      </div>

      {/* Notes Content */}
      {showNotes && (
        <div className="flex-1 overflow-auto p-3">
          <div className="space-y-2">
            {slide.notes.map((note, index) => (
              <div 
                key={index}
                className="flex items-start gap-2 text-sm"
              >
                <Lightbulb className="w-3.5 h-3.5 text-risk-medium mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{note}</span>
              </div>
            ))}
          </div>

          {/* Key talking points */}
          {slide.keyPoints && (
            <div className="mt-4 pt-3 border-t border-border">
              <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                Key Points
              </div>
              <ul className="space-y-1">
                {slide.keyPoints.map((point, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="p-3 border-t border-border bg-secondary/30">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('prev')}
            disabled={!prevSlide}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {prevSlide ? prevSlide.title.substring(0, 12) + '...' : 'Start'}
          </Button>
          
          <div className="flex gap-1">
            {PRESENTATION_SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => onGoToSlide(s.id)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  s.id === currentSlide ? "bg-primary w-4" :
                  i < currentIndex ? "bg-risk-low" :
                  "bg-muted hover:bg-muted-foreground"
                )}
                title={s.title}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('next')}
            disabled={!nextSlide}
            className="gap-1"
          >
            {nextSlide ? nextSlide.title.substring(0, 12) + '...' : 'End'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Up Next Preview */}
        {nextSlide && (
          <div className="mt-2 pt-2 border-t border-border/50 text-xs">
            <span className="text-muted-foreground">Up next: </span>
            <span className="text-foreground font-medium">{nextSlide.title}</span>
            <span className="text-muted-foreground"> ({nextSlide.duration}m)</span>
          </div>
        )}
      </div>
    </div>
  );
};
