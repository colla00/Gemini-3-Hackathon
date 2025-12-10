import { useState, useEffect, useCallback, useRef } from 'react';
import { PRESENTATION_SLIDES, type SlideType } from '@/components/presentation/PresentationSlide';

interface AutoWalkthroughState {
  isRunning: boolean;
  isPaused: boolean;
  currentSlideIndex: number;
  progress: number; // 0-100 progress within current slide
  elapsedSeconds: number;
  totalSeconds: number;
}

export const useAutoWalkthrough = (
  onSlideChange: (slideId: SlideType) => void,
  autoStart: boolean = false
) => {
  const [state, setState] = useState<AutoWalkthroughState>({
    isRunning: false,
    isPaused: false,
    currentSlideIndex: 0,
    progress: 0,
    elapsedSeconds: 0,
    totalSeconds: PRESENTATION_SLIDES.reduce((acc, s) => acc + s.duration * 60, 0),
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slideStartTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  const currentSlide = PRESENTATION_SLIDES[state.currentSlideIndex];
  const slideDurationMs = currentSlide.duration * 60 * 1000; // Convert minutes to ms

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const calculateProgress = useCallback(() => {
    if (!slideStartTimeRef.current) return 0;
    const elapsed = Date.now() - slideStartTimeRef.current;
    return Math.min((elapsed / slideDurationMs) * 100, 100);
  }, [slideDurationMs]);

  const moveToSlide = useCallback((index: number) => {
    if (index >= PRESENTATION_SLIDES.length) {
      // Walkthrough complete
      clearTimer();
      setState(prev => ({
        ...prev,
        isRunning: false,
        isPaused: false,
        currentSlideIndex: 0,
        progress: 0,
      }));
      return;
    }

    const slide = PRESENTATION_SLIDES[index];
    onSlideChange(slide.id);
    slideStartTimeRef.current = Date.now();
    
    setState(prev => ({
      ...prev,
      currentSlideIndex: index,
      progress: 0,
    }));
  }, [onSlideChange, clearTimer]);

  const startWalkthrough = useCallback(() => {
    clearTimer();
    slideStartTimeRef.current = Date.now();
    
    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      currentSlideIndex: 0,
      progress: 0,
      elapsedSeconds: 0,
    }));

    // Move to first slide
    onSlideChange(PRESENTATION_SLIDES[0].id);

    // Progress update interval
    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.isPaused) return prev;

        const progress = calculateProgress();
        const newElapsed = prev.elapsedSeconds + 1;

        // Check if we should advance to next slide
        if (progress >= 100) {
          const nextIndex = prev.currentSlideIndex + 1;
          if (nextIndex < PRESENTATION_SLIDES.length) {
            moveToSlide(nextIndex);
            return {
              ...prev,
              currentSlideIndex: nextIndex,
              progress: 0,
              elapsedSeconds: newElapsed,
            };
          } else {
            // Walkthrough complete
            clearTimer();
            return {
              ...prev,
              isRunning: false,
              isPaused: false,
              progress: 100,
            };
          }
        }

        return {
          ...prev,
          progress,
          elapsedSeconds: newElapsed,
        };
      });
    }, 1000);
  }, [clearTimer, onSlideChange, calculateProgress, moveToSlide]);

  const stopWalkthrough = useCallback(() => {
    clearTimer();
    setState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      currentSlideIndex: 0,
      progress: 0,
      elapsedSeconds: 0,
    }));
  }, [clearTimer]);

  const pauseWalkthrough = useCallback(() => {
    pausedAtRef.current = Date.now();
    setState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeWalkthrough = useCallback(() => {
    // Adjust start time to account for pause duration
    const pauseDuration = Date.now() - pausedAtRef.current;
    slideStartTimeRef.current += pauseDuration;
    setState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const togglePause = useCallback(() => {
    if (state.isPaused) {
      resumeWalkthrough();
    } else {
      pauseWalkthrough();
    }
  }, [state.isPaused, pauseWalkthrough, resumeWalkthrough]);

  const nextSlide = useCallback(() => {
    const nextIndex = Math.min(state.currentSlideIndex + 1, PRESENTATION_SLIDES.length - 1);
    moveToSlide(nextIndex);
  }, [state.currentSlideIndex, moveToSlide]);

  const prevSlide = useCallback(() => {
    const prevIndex = Math.max(state.currentSlideIndex - 1, 0);
    moveToSlide(prevIndex);
  }, [state.currentSlideIndex, moveToSlide]);

  const jumpToSlide = useCallback((index: number) => {
    if (index >= 0 && index < PRESENTATION_SLIDES.length) {
      moveToSlide(index);
    }
  }, [moveToSlide]);

  // Auto-start on mount if enabled
  useEffect(() => {
    if (autoStart) {
      startWalkthrough();
    }
    return () => clearTimer();
  }, [autoStart, startWalkthrough, clearTimer]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    ...state,
    currentSlide,
    totalSlides: PRESENTATION_SLIDES.length,
    formattedElapsed: formatTime(state.elapsedSeconds),
    formattedTotal: formatTime(state.totalSeconds),
    formattedRemaining: formatTime(state.totalSeconds - state.elapsedSeconds),
    startWalkthrough,
    stopWalkthrough,
    pauseWalkthrough,
    resumeWalkthrough,
    togglePause,
    nextSlide,
    prevSlide,
    jumpToSlide,
  };
};
