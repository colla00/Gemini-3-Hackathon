import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { 
  Play, Pause, RotateCcw, Clock, AlertTriangle, 
  CheckCircle, ChevronRight, Timer, Volume2, VolumeX,
  ArrowRight, Target
} from 'lucide-react';
import { PRESENTATION_SLIDES, type SlideType, TOTAL_PRESENTATION_TIME } from './PresentationSlide';
import { Button } from '@/components/ui/button';

interface PracticeModeProps {
  currentSlide: SlideType;
  onNavigate: (direction: 'prev' | 'next') => void;
  onGoToSlide: (slideId: SlideType) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const PracticeMode = ({
  currentSlide,
  onNavigate,
  onGoToSlide,
  isVisible,
  onClose,
}: PracticeModeProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [slideStartTime, setSlideStartTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTransitionPrompt, setShowTransitionPrompt] = useState(false);

  const currentIndex = PRESENTATION_SLIDES.findIndex(s => s.id === currentSlide);
  const slide = PRESENTATION_SLIDES[currentIndex];
  const nextSlide = PRESENTATION_SLIDES[currentIndex + 1];

  // Calculate cumulative time at current slide start
  const expectedTimeAtSlide = PRESENTATION_SLIDES
    .slice(0, currentIndex)
    .reduce((acc, s) => acc + s.duration * 60, 0);

  // Time spent on current slide
  const slideElapsed = elapsedSeconds - slideStartTime;
  const slideDurationSeconds = slide.duration * 60;
  const slideProgress = Math.min((slideElapsed / slideDurationSeconds) * 100, 100);

  // Overall progress
  const overallProgress = (elapsedSeconds / (TOTAL_PRESENTATION_TIME * 60)) * 100;

  // Pacing status
  const expectedElapsed = expectedTimeAtSlide + slideElapsed;
  const timeDelta = elapsedSeconds - expectedElapsed;
  const isAhead = timeDelta < -30;
  const isBehind = timeDelta > 60;
  const isNearEnd = slideProgress >= 80;

  // Utility functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playChime = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Audio not available');
    }
  };

  // Handlers (defined before effects that use them)
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setSlideStartTime(0);
    setShowTransitionPrompt(false);
    onGoToSlide('title');
  }, [onGoToSlide]);

  const handleNextSlide = useCallback(() => {
    setShowTransitionPrompt(false);
    onNavigate('next');
  }, [onNavigate]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Keyboard shortcuts (Space=play/pause, R=reset, N=next)
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsRunning(prev => !prev);
          break;
        case 'KeyR':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            handleReset();
          }
          break;
        case 'KeyN':
          e.preventDefault();
          handleNextSlide();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleReset, handleNextSlide]);

  // Track slide changes
  useEffect(() => {
    setSlideStartTime(elapsedSeconds);
    setShowTransitionPrompt(false);
  }, [currentSlide]);

  // Show transition prompt when slide time is almost up
  useEffect(() => {
    if (isRunning && slideProgress >= 90 && !showTransitionPrompt && nextSlide) {
      setShowTransitionPrompt(true);
      if (soundEnabled) {
        playChime();
      }
    }
  }, [slideProgress, isRunning, showTransitionPrompt, nextSlide, soundEnabled]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 print:hidden">
      <div className="bg-card/95 backdrop-blur-lg border border-border rounded-2xl shadow-2xl p-4 min-w-[500px]">
        {/* Transition Prompt Overlay */}
        {showTransitionPrompt && nextSlide && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-fade-in">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              <span className="text-sm font-medium">Time to move to: {nextSlide.title}</span>
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={handleNextSlide}
                className="ml-2 h-7"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Main Timer Display */}
        <div className="flex items-center justify-between gap-6 mb-3">
          {/* Elapsed Time */}
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-foreground">
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Elapsed
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant={isRunning ? "destructive" : "default"}
              onClick={() => setIsRunning(!isRunning)}
              className="w-12 h-12 rounded-full"
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleReset}
              className="w-10 h-10 rounded-full"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-10 h-10 rounded-full"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>

          {/* Target Time */}
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-muted-foreground">
              {formatTime(TOTAL_PRESENTATION_TIME * 60)}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Target
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isBehind ? "bg-risk-high" : isAhead ? "bg-risk-low" : "bg-primary"
              )}
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Current Slide Progress */}
        <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
          {/* Slide Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-foreground">
                {slide.title}
              </span>
              <span className="text-[10px] text-muted-foreground">
                ({currentIndex + 1}/{PRESENTATION_SLIDES.length})
              </span>
            </div>
            <div className="h-1.5 bg-background rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  isNearEnd ? "bg-risk-medium" : "bg-primary"
                )}
                style={{ width: `${slideProgress}%` }}
              />
            </div>
          </div>

          {/* Slide Timing */}
          <div className="text-right">
            <div className="font-mono text-sm font-bold text-foreground">
              {formatTime(slideElapsed)}
            </div>
            <div className="text-[10px] text-muted-foreground">
              / {slide.duration}:00
            </div>
          </div>

          {/* Status Indicator */}
          <div className={cn(
            "px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1",
            isBehind ? "bg-risk-high/20 text-risk-high" :
            isAhead ? "bg-risk-low/20 text-risk-low" :
            "bg-primary/20 text-primary"
          )}>
            {isBehind ? (
              <>
                <AlertTriangle className="w-3 h-3" />
                Behind
              </>
            ) : isAhead ? (
              <>
                <Timer className="w-3 h-3" />
                Ahead
              </>
            ) : (
              <>
                <Target className="w-3 h-3" />
                On Pace
              </>
            )}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div className="flex gap-1">
            {PRESENTATION_SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => onGoToSlide(s.id)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  s.id === currentSlide ? "w-6 bg-primary" :
                  i < currentIndex ? "w-2 bg-risk-low" :
                  "w-2 bg-muted hover:bg-muted-foreground"
                )}
                title={`${s.title} (${s.duration}m)`}
              />
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
