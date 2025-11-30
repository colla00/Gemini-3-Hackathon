import { Play, Pause, SkipForward, SkipBack, Zap, Printer, Keyboard, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DemoControlsProps {
  isRunning: boolean;
  progress: number;
  currentIndex: number;
  totalViews: number;
  intervalMs: number;
  liveUpdatesActive: boolean;
  onToggleDemo: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleLive: () => void;
  onPrint: () => void;
  onSpeedChange: (ms: number) => void;
}

export const DemoControls = ({
  isRunning,
  progress,
  currentIndex,
  totalViews,
  intervalMs,
  liveUpdatesActive,
  onToggleDemo,
  onNext,
  onPrev,
  onToggleLive,
  onPrint,
  onSpeedChange,
}: DemoControlsProps) => {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);

  const speeds = [
    { label: '5s', ms: 5000 },
    { label: '8s', ms: 8000 },
    { label: '12s', ms: 12000 },
    { label: '15s', ms: 15000 },
  ];

  const shortcuts = [
    { key: '1-4', desc: 'Switch views' },
    { key: '← →', desc: 'Navigate' },
    { key: 'D', desc: 'Auto-demo' },
    { key: 'L', desc: 'Live updates' },
    { key: 'Ctrl+P', desc: 'Print' },
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-16 right-4 z-40 flex items-center gap-2 opacity-0 animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
        {/* Keyboard Shortcuts Panel */}
        {showShortcuts && (
          <div className="glass-card rounded-lg p-3 animate-slide-in-right">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-foreground">Keyboard Shortcuts</span>
              <button onClick={() => setShowShortcuts(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1">
              {shortcuts.map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-4 text-[10px]">
                  <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground font-mono">{s.key}</kbd>
                  <span className="text-muted-foreground">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Speed Selector */}
        {showSpeed && (
          <div className="glass-card rounded-lg p-2 animate-scale-in">
            <div className="flex items-center gap-1">
              {speeds.map((s) => (
                <button
                  key={s.ms}
                  onClick={() => {
                    onSpeedChange(s.ms);
                    setShowSpeed(false);
                  }}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-medium transition-colors",
                    intervalMs === s.ms
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Control Panel */}
        <div className="glass-card rounded-full px-3 py-2 flex items-center gap-2">
          {/* Progress bar when running */}
          {isRunning && (
            <div className="w-20 h-1 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* View indicator */}
          <div className="flex items-center gap-1 px-2 text-[10px] text-muted-foreground">
            <span className="text-primary font-bold">{currentIndex + 1}</span>
            <span>/</span>
            <span>{totalViews}</span>
          </div>

          <div className="w-px h-4 bg-border/50" />

          {/* Navigation */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onPrev}
                className="p-1.5 rounded hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[10px]">Previous (←)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onToggleDemo}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  isRunning 
                    ? "bg-risk-high/20 text-risk-high hover:bg-risk-high/30" 
                    : "bg-primary/20 text-primary hover:bg-primary/30"
                )}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[10px]">{isRunning ? 'Pause (D)' : 'Auto-Demo (D)'}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onNext}
                className="p-1.5 rounded hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[10px]">Next (→)</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border/50" />

          {/* Speed */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => setShowSpeed(!showSpeed)}
                className="px-2 py-1 rounded hover:bg-secondary/50 text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                {intervalMs / 1000}s
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[10px]">Change speed</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border/50" />

          {/* Live Updates */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onToggleLive}
                className={cn(
                  "p-1.5 rounded transition-colors flex items-center gap-1",
                  liveUpdatesActive 
                    ? "bg-risk-low/20 text-risk-low" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <Zap className="w-3.5 h-3.5" />
                {liveUpdatesActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[10px]">Live Updates (L)</TooltipContent>
          </Tooltip>

          {/* Print */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onPrint}
                className="p-1.5 rounded hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[10px]">Print (Ctrl+P)</TooltipContent>
          </Tooltip>

          {/* Shortcuts */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => setShowShortcuts(!showShortcuts)}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  showShortcuts 
                    ? "bg-primary/20 text-primary" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <Keyboard className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[10px]">Shortcuts</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
