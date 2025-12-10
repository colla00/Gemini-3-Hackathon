import { cn } from '@/lib/utils';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { PRESENTATION_SLIDES, type SlideType, TOTAL_PRESENTATION_TIME } from './PresentationSlide';

interface PresentationTimeline45Props {
  currentSlide: SlideType;
  onNavigate: (slideId: SlideType) => void;
  completedSlides: SlideType[];
}

export const PresentationTimeline45 = ({
  currentSlide,
  onNavigate,
  completedSlides,
}: PresentationTimeline45Props) => {
  const currentIndex = PRESENTATION_SLIDES.findIndex(s => s.id === currentSlide);
  
  // Group slides by category
  const groups = [
    { label: 'Introduction', slides: ['title', 'agenda'] as SlideType[] },
    { label: 'Background', slides: ['problem', 'methodology', 'ehr-flow', 'alert-timeline'] as SlideType[] },
    { label: 'Demonstration', slides: ['dashboard', 'patients', 'shap', 'workflow'] as SlideType[] },
    { label: 'Conclusion', slides: ['validation', 'future', 'conclusion'] as SlideType[] },
  ];

  return (
    <div className="fixed top-20 left-4 z-50 print:hidden">
      <div className="bg-background/95 border border-border/30 rounded-lg p-3 backdrop-blur-sm shadow-lg w-[220px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/30">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-semibold text-foreground uppercase tracking-wide">
              45-Min Walkthrough
            </span>
          </div>
        </div>

        {/* Grouped chapters */}
        <div className="space-y-3">
          {groups.map((group) => {
            const groupSlides = PRESENTATION_SLIDES.filter(s => group.slides.includes(s.id));
            const isGroupActive = group.slides.includes(currentSlide);
            
            return (
              <div key={group.label}>
                <div className={cn(
                  "text-[9px] font-semibold uppercase tracking-wider mb-1.5 px-1",
                  isGroupActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {groupSlides.map((slide) => {
                    const slideIndex = PRESENTATION_SLIDES.findIndex(s => s.id === slide.id);
                    const isActive = slide.id === currentSlide;
                    const isCompleted = completedSlides.includes(slide.id);
                    const isPast = slideIndex < currentIndex;
                    
                    return (
                      <button
                        key={slide.id}
                        onClick={() => onNavigate(slide.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-all text-[10px]",
                          isActive 
                            ? "bg-primary/20 border border-primary/30 text-primary font-medium" 
                            : "hover:bg-secondary/50 text-foreground"
                        )}
                      >
                        {/* Status indicator */}
                        <div className={cn(
                          "w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0",
                          isActive ? "bg-primary text-primary-foreground" :
                          isCompleted || isPast ? "bg-risk-low/20 text-risk-low" :
                          "bg-secondary text-muted-foreground"
                        )}>
                          {isCompleted || isPast ? (
                            <CheckCircle className="w-2 h-2" />
                          ) : (
                            <span className="text-[7px] font-bold">{slideIndex + 1}</span>
                          )}
                        </div>

                        {/* Title */}
                        <span className="flex-1 truncate">{slide.title}</span>

                        {/* Duration */}
                        <span className="text-[8px] text-muted-foreground">{slide.duration}m</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-3 pt-2 border-t border-border/30">
          <div className="flex items-center justify-between text-[8px] text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{currentIndex + 1}/{PRESENTATION_SLIDES.length}</span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / PRESENTATION_SLIDES.length) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-1 mt-2 text-[9px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>~{TOTAL_PRESENTATION_TIME} minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
