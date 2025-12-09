import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlideCountdownOverlayProps {
  slideElapsedSeconds: number;
  slideDurationSeconds: number;
  isVisible: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right';
}

export const SlideCountdownOverlay = ({
  slideElapsedSeconds,
  slideDurationSeconds,
  isVisible,
  position = 'bottom-right',
}: SlideCountdownOverlayProps) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const remainingSeconds = slideDurationSeconds - slideElapsedSeconds;
  const isOverTime = remainingSeconds < 0;
  const showWarning = remainingSeconds <= 60 && remainingSeconds > 0;
  const showCritical = remainingSeconds <= 30 && remainingSeconds > 0;
  const showUrgent = remainingSeconds <= 10 && remainingSeconds > 0;

  // Determine when to show the overlay
  useEffect(() => {
    // Show overlay when 60 seconds or less remaining, or overtime
    setShowOverlay(isVisible && (remainingSeconds <= 60 || isOverTime));
  }, [remainingSeconds, isVisible, isOverTime]);

  // Flash effect for critical timing
  useEffect(() => {
    if (showUrgent || isOverTime) {
      const interval = setInterval(() => {
        setIsFlashing(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setIsFlashing(false);
    }
  }, [showUrgent, isOverTime]);

  if (!showOverlay) return null;

  const formatTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    const sign = seconds < 0 ? '+' : '';
    return `${sign}${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-20 right-6',
  };

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-300 print:hidden",
        positionClasses[position],
        showOverlay ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border-2 backdrop-blur-sm transition-all",
          isOverTime && "bg-risk-high/90 border-risk-high text-white",
          showUrgent && !isOverTime && "bg-risk-high/90 border-risk-high text-white",
          showCritical && !showUrgent && !isOverTime && "bg-risk-medium/90 border-risk-medium text-white",
          showWarning && !showCritical && !isOverTime && "bg-risk-medium/80 border-risk-medium/60 text-white",
          isFlashing && "animate-pulse scale-105"
        )}
      >
        {isOverTime ? (
          <AlertTriangle className="w-6 h-6 animate-bounce" />
        ) : (
          <Clock className={cn("w-6 h-6", showUrgent && "animate-pulse")} />
        )}
        
        <div className="flex flex-col">
          <span className="text-xs font-medium opacity-80">
            {isOverTime ? 'OVER TIME' : 'Time Remaining'}
          </span>
          <span className={cn(
            "text-2xl font-mono font-bold",
            isFlashing && "animate-pulse"
          )}>
            {formatTime(remainingSeconds)}
          </span>
        </div>

        {/* Visual progress ring */}
        <div className="relative w-10 h-10">
          <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-20"
            />
            {/* Progress circle */}
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${Math.max(0, (remainingSeconds / 60) * 94)} 94`}
              className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {Math.max(0, Math.ceil(remainingSeconds))}
          </span>
        </div>
      </div>

      {/* Urgent message */}
      {showUrgent && !isOverTime && (
        <div className="mt-2 text-center text-xs font-medium text-risk-high bg-risk-high/10 rounded-lg py-1 px-2 border border-risk-high/30">
          Prepare to transition!
        </div>
      )}
      
      {isOverTime && (
        <div className="mt-2 text-center text-xs font-medium text-risk-high bg-risk-high/10 rounded-lg py-1 px-2 border border-risk-high/30 animate-pulse">
          Consider moving to next slide
        </div>
      )}
    </div>
  );
};
