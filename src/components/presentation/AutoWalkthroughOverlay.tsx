import { 
  Play, Pause, SkipForward, SkipBack, Square, 
  Timer, ChevronDown, X, Volume2, VolumeX 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PRESENTATION_SLIDES, type SlideType } from './PresentationSlide';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface AutoWalkthroughOverlayProps {
  isRunning: boolean;
  isPaused: boolean;
  currentSlideIndex: number;
  progress: number;
  formattedElapsed: string;
  formattedRemaining: string;
  currentSlide: typeof PRESENTATION_SLIDES[0];
  totalSlides: number;
  onStart: () => void;
  onStop: () => void;
  onTogglePause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onJumpTo: (index: number) => void;
  className?: string;
}

export const AutoWalkthroughOverlay = ({
  isRunning,
  isPaused,
  currentSlideIndex,
  progress,
  formattedElapsed,
  formattedRemaining,
  currentSlide,
  totalSlides,
  onStart,
  onStop,
  onTogglePause,
  onNext,
  onPrev,
  onJumpTo,
  className,
}: AutoWalkthroughOverlayProps) => {
  if (!isRunning) {
    return (
      <Button
        onClick={onStart}
        variant="outline"
        size="sm"
        className={cn(
          "fixed bottom-20 right-4 z-50 gap-2 bg-card/95 backdrop-blur-sm border-primary/30 shadow-lg hover:bg-primary hover:text-primary-foreground",
          className
        )}
      >
        <Play className="w-4 h-4" />
        <span>Auto Walkthrough</span>
      </Button>
    );
  }

  return (
    <>
      {/* Floating indicator at top-left */}
      <div className="fixed top-20 left-4 z-50 animate-fade-in">
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl overflow-hidden min-w-[300px]">
          {/* Header with live indicator */}
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-primary/20 to-transparent border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2.5 h-2.5 rounded-full",
                isPaused ? "bg-yellow-500" : "bg-green-500 animate-pulse"
              )} />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {isPaused ? "Paused" : "Auto Walkthrough"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Timer className="w-3 h-3" />
              <span>{formattedElapsed} / {formattedRemaining} remaining</span>
            </div>
          </div>

          {/* Slide info */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                Slide {currentSlideIndex + 1} / {totalSlides}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {currentSlide.duration} min
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground mb-0.5">{currentSlide.title}</h3>
            {currentSlide.subtitle && (
              <p className="text-xs text-muted-foreground">{currentSlide.subtitle}</p>
            )}
          </div>

          {/* Progress bar */}
          <div className="px-4 pb-2">
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Timeline dots */}
          <div className="px-4 pb-3 flex gap-0.5">
            {PRESENTATION_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => onJumpTo(i)}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors hover:opacity-80",
                  i < currentSlideIndex 
                    ? "bg-primary" 
                    : i === currentSlideIndex 
                      ? "bg-primary/60" 
                      : "bg-border"
                )}
                title={PRESENTATION_SLIDES[i].title}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controls at bottom-right */}
      <div className={cn(
        "fixed bottom-20 right-4 z-50 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl",
        className
      )}>
        <div className="p-3 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrev}
            disabled={currentSlideIndex === 0}
            className="h-8 w-8 p-0"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            variant={isPaused ? "default" : "secondary"}
            size="sm"
            onClick={onTogglePause}
            className="h-8 px-4 gap-1.5"
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            disabled={currentSlideIndex === totalSlides - 1}
            className="h-8 w-8 p-0"
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border max-h-80 overflow-y-auto">
              <DropdownMenuLabel className="text-xs">Jump to Slide</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {PRESENTATION_SLIDES.map((slide, index) => (
                <DropdownMenuItem
                  key={slide.id}
                  onClick={() => onJumpTo(index)}
                  className={cn(
                    "text-xs cursor-pointer",
                    currentSlideIndex === index && "bg-primary/10 text-primary"
                  )}
                >
                  <span className="w-5 text-muted-foreground">{index + 1}.</span>
                  <span className="truncate">{slide.title}</span>
                  <span className="ml-auto text-muted-foreground">{slide.duration}m</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={onStop}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
};
