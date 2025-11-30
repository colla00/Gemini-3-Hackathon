import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type TourStep } from '@/hooks/useGuidedTour';

interface GuidedTourProps {
  isActive: boolean;
  currentStep: TourStep | undefined;
  currentStepIndex: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  targetRect: DOMRect | null;
  onNext: () => void;
  onPrev: () => void;
  onEnd: () => void;
  onGoToStep: (index: number) => void;
}

export const GuidedTour = ({
  isActive,
  currentStep,
  currentStepIndex,
  totalSteps,
  isFirstStep,
  isLastStep,
  targetRect,
  onNext,
  onPrev,
  onEnd,
  onGoToStep,
}: GuidedTourProps) => {
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!targetRect || !currentStep) return;

    const padding = 16;
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    let top = 0;
    let left = 0;

    switch (currentStep.position) {
      case 'bottom':
        top = targetRect.bottom + padding;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case 'top':
        top = targetRect.top - tooltipHeight - padding;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.left - tooltipWidth - padding;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.right + padding;
        break;
    }

    // Keep tooltip within viewport
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding));

    setTooltipStyle({ top, left, width: tooltipWidth });
  }, [targetRect, currentStep]);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onEnd();
          break;
        case 'ArrowRight':
        case 'Enter':
          onNext();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onEnd, onNext, onPrev]);

  if (!isActive || !currentStep) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && currentStep.spotlight && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="8"
                fill="black"
                className={cn(isAnimating && "animate-pulse")}
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
          onClick={onEnd}
        />
      </svg>

      {/* Spotlight border/glow */}
      {targetRect && currentStep.spotlight && (
        <div
          className="absolute border-2 border-primary rounded-lg pointer-events-none transition-all duration-300 shadow-[0_0_20px_rgba(0,180,216,0.5)]"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className={cn(
          "absolute glass-card rounded-xl p-4 pointer-events-auto transition-all duration-300 border border-primary/30",
          isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
        style={tooltipStyle}
      >
        {/* Close button */}
        <button
          onClick={onEnd}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-sm font-bold text-foreground mb-2">{currentStep.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {currentStep.description}
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => onGoToStep(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === currentStepIndex
                  ? "bg-primary w-4"
                  : i < currentStepIndex
                  ? "bg-primary/50"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={isFirstStep}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors",
              isFirstStep
                ? "text-muted-foreground/50 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </button>

          <button
            onClick={onEnd}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip Tour
          </button>

          <button
            onClick={onNext}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            {isLastStep ? 'Finish' : 'Next'}
            {!isLastStep && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-center gap-3 text-[9px] text-muted-foreground">
          <span>
            <kbd className="px-1 py-0.5 rounded bg-secondary font-mono">←</kbd>
            <kbd className="px-1 py-0.5 rounded bg-secondary font-mono ml-0.5">→</kbd>
            {' '}Navigate
          </span>
          <span>
            <kbd className="px-1 py-0.5 rounded bg-secondary font-mono">Esc</kbd>
            {' '}Exit
          </span>
        </div>
      </div>
    </div>
  );
};

// Tour start button component
export const TourButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
    title="Start guided tour"
  >
    <HelpCircle className="w-3.5 h-3.5" />
    <span className="hidden sm:inline">Tour</span>
  </button>
);
