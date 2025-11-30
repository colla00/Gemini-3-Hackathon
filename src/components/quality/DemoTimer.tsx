import { useState, useEffect } from 'react';
import { Timer, Pause, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoTimerProps {
  isRunning: boolean;
  totalDurationMs: number;
  currentViewIndex: number;
  totalViews: number;
  onStop: () => void;
}

export const DemoTimer = ({
  isRunning,
  totalDurationMs,
  currentViewIndex,
  totalViews,
  onStop,
}: DemoTimerProps) => {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!isRunning) {
      setElapsedMs(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  if (!isRunning) return null;

  const remainingMs = Math.max(0, totalDurationMs - elapsedMs);
  const remainingMin = Math.floor(remainingMs / 60000);
  const remainingSec = Math.floor((remainingMs % 60000) / 1000);
  const progress = Math.min(100, (elapsedMs / totalDurationMs) * 100);

  return (
    <div className="fixed top-32 right-4 z-50 print:hidden animate-fade-in">
      <div className="bg-background/95 border border-primary/30 rounded-lg p-3 backdrop-blur-sm shadow-lg min-w-[180px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
              5-Min Demo
            </span>
          </div>
          <button
            onClick={onStop}
            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Stop demo"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Timer display */}
        <div className="text-center mb-2">
          <span className="text-2xl font-mono font-bold text-foreground">
            {remainingMin}:{remainingSec.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-muted-foreground block">remaining</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Section indicator */}
        <div className="flex items-center justify-between text-[9px] text-muted-foreground">
          <span>Section {currentViewIndex + 1} of {totalViews}</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
            Auto-playing
          </span>
        </div>
      </div>
    </div>
  );
};
