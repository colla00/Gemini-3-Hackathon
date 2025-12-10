import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Settings, 
  Timer, ChevronDown, X, Maximize2, Minimize2, Volume2, VolumeX 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';

// Scenario Indicator Overlay Component
const ScenarioIndicatorOverlay = ({
  currentIndex,
  totalScenarios,
  scenarioLabel,
  scenarioDescription,
  progress,
  isPaused,
  elapsedTime,
  totalTime,
}: {
  currentIndex: number;
  totalScenarios: number;
  scenarioLabel: string;
  scenarioDescription: string;
  progress: number;
  isPaused: boolean;
  elapsedTime: number;
  totalTime: number;
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-4 left-4 z-50 animate-fade-in">
      <div className="bg-card/90 backdrop-blur-md border border-border rounded-xl shadow-2xl overflow-hidden min-w-[280px]">
        {/* Header with live indicator */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-primary/20 to-transparent border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full",
              isPaused ? "bg-risk-medium" : "bg-risk-high animate-pulse"
            )} />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {isPaused ? "Paused" : "Live Demo"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Timer className="w-3 h-3" />
            <span>{formatTime(elapsedTime)} / {formatTime(totalTime)}</span>
          </div>
        </div>

        {/* Scenario info */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
              {currentIndex + 1} / {totalScenarios}
            </span>
          </div>
          <h3 className="text-sm font-bold text-foreground mb-0.5">{scenarioLabel}</h3>
          <p className="text-xs text-muted-foreground">{scenarioDescription}</p>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-3">
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Timeline dots */}
        <div className="px-4 pb-3 flex gap-1">
          {Array.from({ length: totalScenarios }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i < currentIndex 
                  ? "bg-primary" 
                  : i === currentIndex 
                    ? "bg-primary/60" 
                    : "bg-border"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export interface DemoScenario {
  id: string;
  label: string;
  description: string;
  duration: number; // seconds
  action: () => void;
  highlight?: string;
}

interface DemoModeControllerProps {
  scenarios: DemoScenario[];
  onScenarioChange?: (scenario: DemoScenario, index: number) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  isFullscreen?: boolean;
  className?: string;
}

export const DemoModeController = ({ 
  scenarios, 
  onScenarioChange,
  onFullscreenChange,
  isFullscreen = false,
  className 
}: DemoModeControllerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const currentScenario = scenarios[currentIndex];
  const totalDuration = scenarios.reduce((acc, s) => acc + s.duration, 0);
  const elapsedDuration = scenarios.slice(0, currentIndex).reduce((acc, s) => acc + s.duration, 0);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  const executeScenario = useCallback((index: number) => {
    if (index >= scenarios.length) {
      // Demo complete
      setIsRunning(false);
      setIsPaused(false);
      setCurrentIndex(0);
      setProgress(0);
      clearTimers();
      return;
    }

    const scenario = scenarios[index];
    setCurrentIndex(index);
    setProgress(0);
    scenario.action();
    onScenarioChange?.(scenario, index);

    // Progress animation
    const progressInterval = 100; // ms
    const steps = (scenario.duration * 1000) / progressInterval;
    let currentStep = 0;

    progressRef.current = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
    }, progressInterval);

    // Schedule next scenario
    intervalRef.current = setTimeout(() => {
      clearTimers();
      executeScenario(index + 1);
    }, scenario.duration * 1000);
  }, [scenarios, onScenarioChange, clearTimers]);

  const startDemo = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    executeScenario(0);
  }, [executeScenario]);

  const stopDemo = useCallback(() => {
    clearTimers();
    setIsRunning(false);
    setIsPaused(false);
    setCurrentIndex(0);
    setProgress(0);
  }, [clearTimers]);

  const pauseDemo = useCallback(() => {
    clearTimers();
    setIsPaused(true);
  }, [clearTimers]);

  const resumeDemo = useCallback(() => {
    setIsPaused(false);
    // Resume from current progress
    const remainingTime = currentScenario.duration * (1 - progress / 100) * 1000;
    
    const progressInterval = 100;
    const remainingSteps = remainingTime / progressInterval;
    let currentStep = 0;

    progressRef.current = setInterval(() => {
      currentStep++;
      setProgress(prev => Math.min(prev + (100 / remainingSteps), 100));
    }, progressInterval);

    intervalRef.current = setTimeout(() => {
      clearTimers();
      executeScenario(currentIndex + 1);
    }, remainingTime);
  }, [currentScenario, progress, currentIndex, executeScenario, clearTimers]);

  const nextScenario = useCallback(() => {
    clearTimers();
    const nextIndex = Math.min(currentIndex + 1, scenarios.length - 1);
    if (isRunning && !isPaused) {
      executeScenario(nextIndex);
    } else {
      setCurrentIndex(nextIndex);
      setProgress(0);
      scenarios[nextIndex].action();
      onScenarioChange?.(scenarios[nextIndex], nextIndex);
    }
  }, [currentIndex, scenarios, isRunning, isPaused, executeScenario, clearTimers, onScenarioChange]);

  const prevScenario = useCallback(() => {
    clearTimers();
    const prevIndex = Math.max(currentIndex - 1, 0);
    if (isRunning && !isPaused) {
      executeScenario(prevIndex);
    } else {
      setCurrentIndex(prevIndex);
      setProgress(0);
      scenarios[prevIndex].action();
      onScenarioChange?.(scenarios[prevIndex], prevIndex);
    }
  }, [currentIndex, scenarios, isRunning, isPaused, executeScenario, clearTimers, onScenarioChange]);

  const jumpToScenario = useCallback((index: number) => {
    clearTimers();
    if (isRunning && !isPaused) {
      executeScenario(index);
    } else {
      setCurrentIndex(index);
      setProgress(0);
      scenarios[index].action();
      onScenarioChange?.(scenarios[index], index);
    }
  }, [scenarios, isRunning, isPaused, executeScenario, clearTimers, onScenarioChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (!isRunning) startDemo();
          else if (isPaused) resumeDemo();
          else pauseDemo();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextScenario();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevScenario();
          break;
        case 'Escape':
          if (isRunning) stopDemo();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, isPaused, startDemo, pauseDemo, resumeDemo, stopDemo, nextScenario, prevScenario]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isExpanded && !isRunning) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className={cn(
          "fixed bottom-20 right-4 z-50 gap-2 bg-card/95 backdrop-blur-sm border-primary/30 shadow-lg",
          className
        )}
      >
        <Play className="w-4 h-4 text-primary" />
        <span>Demo Mode</span>
      </Button>
    );
  }

  return (
    <>
    <div className={cn(
      "fixed bottom-20 right-4 z-50 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl transition-all duration-300",
      isExpanded ? "w-80" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isRunning && !isPaused ? "bg-risk-high animate-pulse" : "bg-muted-foreground"
          )} />
          <span className="text-sm font-semibold text-foreground">Demo Mode</span>
          {isRunning && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-risk-high/20 text-risk-high font-medium">
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onFullscreenChange?.(!isFullscreen)}
            className="p-1.5 rounded hover:bg-secondary transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-foreground" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded hover:bg-secondary transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-foreground" />
            )}
          </button>
          <button
            onClick={() => {
              if (isRunning) stopDemo();
              setIsExpanded(false);
              onFullscreenChange?.(false);
            }}
            className="p-1.5 rounded hover:bg-secondary transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Current Scenario */}
      <div className="p-3 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Scenario {currentIndex + 1} of {scenarios.length}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatTime(currentScenario.duration)}
          </span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">{currentScenario.label}</p>
        <p className="text-xs text-muted-foreground">{currentScenario.description}</p>
        
        {/* Progress bar */}
        <div className="mt-3">
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevScenario}
            disabled={currentIndex === 0}
            className="h-8 w-8 p-0"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          {!isRunning ? (
            <Button
              variant="default"
              size="sm"
              onClick={startDemo}
              className="h-8 px-4 gap-1.5"
            >
              <Play className="w-4 h-4" />
              Start
            </Button>
          ) : isPaused ? (
            <Button
              variant="default"
              size="sm"
              onClick={resumeDemo}
              className="h-8 px-4 gap-1.5"
            >
              <Play className="w-4 h-4" />
              Resume
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={pauseDemo}
              className="h-8 px-4 gap-1.5"
            >
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={nextScenario}
            disabled={currentIndex === scenarios.length - 1}
            className="h-8 w-8 p-0"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border">
            <DropdownMenuLabel className="text-xs">Jump to Scenario</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {scenarios.map((scenario, index) => (
              <DropdownMenuItem
                key={scenario.id}
                onClick={() => jumpToScenario(index)}
                className={cn(
                  "text-xs cursor-pointer",
                  currentIndex === index && "bg-primary/10 text-primary"
                )}
              >
                <span className="w-4 text-muted-foreground">{index + 1}.</span>
                {scenario.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={stopDemo}
              className="text-xs text-risk-high cursor-pointer"
            >
              Stop Demo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Timeline preview */}
      <div className="px-3 pb-3">
        <div className="flex gap-0.5">
          {scenarios.map((scenario, index) => (
            <button
              key={scenario.id}
              onClick={() => jumpToScenario(index)}
              className={cn(
                "h-1 rounded-full flex-1 transition-colors",
                index < currentIndex 
                  ? "bg-primary" 
                  : index === currentIndex 
                    ? "bg-primary/50" 
                    : "bg-border"
              )}
              title={scenario.label}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
          <span>{formatTime(elapsedDuration)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="px-3 pb-2 flex items-center justify-center gap-3 text-[9px] text-muted-foreground">
        <span><kbd className="px-1 py-0.5 rounded bg-secondary">Space</kbd> Play/Pause</span>
        <span><kbd className="px-1 py-0.5 rounded bg-secondary">←→</kbd> Navigate</span>
      </div>
    </div>

    {/* Scenario Indicator Overlay - shows in presentation mode */}
    {isFullscreen && isRunning && (
      <ScenarioIndicatorOverlay
        currentIndex={currentIndex}
        totalScenarios={scenarios.length}
        scenarioLabel={currentScenario.label}
        scenarioDescription={currentScenario.description}
        progress={progress}
        isPaused={isPaused}
        elapsedTime={elapsedDuration}
        totalTime={totalDuration}
      />
    )}
  </>
  );
};
