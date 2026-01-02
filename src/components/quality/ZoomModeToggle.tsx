import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Monitor, Wifi, ZoomOut, ZoomIn, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface ZoomModeContextType {
  isZoomMode: boolean;
  toggleZoomMode: () => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
}

const ZoomModeContext = createContext<ZoomModeContextType>({
  isZoomMode: false,
  toggleZoomMode: () => {},
  zoomLevel: 100,
  setZoomLevel: () => {},
});

export const useZoomMode = () => useContext(ZoomModeContext);

export const ZoomModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    // Apply Zoom-optimized styles to document
    if (isZoomMode) {
      document.documentElement.classList.add('zoom-mode');
    } else {
      document.documentElement.classList.remove('zoom-mode');
    }
  }, [isZoomMode]);

  // Keyboard shortcuts for zoom controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if Ctrl/Cmd is pressed
      if (!e.ctrlKey && !e.metaKey) return;

      switch (e.key) {
        case '-':
        case '_':
          e.preventDefault();
          setZoomLevel(prev => {
            const currentIndex = ZOOM_LEVELS.indexOf(prev);
            if (currentIndex > 0) return ZOOM_LEVELS[currentIndex - 1];
            return prev;
          });
          break;
        case '=':
        case '+':
          e.preventDefault();
          setZoomLevel(prev => {
            const currentIndex = ZOOM_LEVELS.indexOf(prev);
            if (currentIndex < ZOOM_LEVELS.length - 1) return ZOOM_LEVELS[currentIndex + 1];
            return prev;
          });
          break;
        case '0':
          e.preventDefault();
          setZoomLevel(100);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleZoomMode = () => setIsZoomMode(prev => !prev);

  return (
    <ZoomModeContext.Provider value={{ isZoomMode, toggleZoomMode, zoomLevel, setZoomLevel }}>
      {children}
    </ZoomModeContext.Provider>
  );
};

const ZOOM_LEVELS = [50, 60, 70, 80, 90, 100];

export const ZoomModeToggle = () => {
  const { isZoomMode, toggleZoomMode } = useZoomMode();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleZoomMode}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all",
              isZoomMode
                ? "bg-risk-low/20 text-risk-low border border-risk-low/30"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {isZoomMode ? (
              <>
                <Wifi className="w-3 h-3" />
                <span className="hidden sm:inline">Zoom</span>
              </>
            ) : (
              <>
                <Monitor className="w-3 h-3" />
                <span className="hidden sm:inline">Screen</span>
              </>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="text-xs">
            <p className="font-medium mb-1">{isZoomMode ? 'Zoom Mode Active' : 'Enable Zoom Mode'}</p>
            <p className="text-muted-foreground">
              {isZoomMode 
                ? 'Optimized for screen sharing: reduced animations, higher contrast, larger fonts'
                : 'Click to optimize for Zoom/video calls'}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ZoomScaleControl = () => {
  const { zoomLevel, setZoomLevel } = useZoomMode();

  const handleZoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
    if (currentIndex > 0) {
      setZoomLevel(ZOOM_LEVELS[currentIndex - 1]);
    }
  };

  const handleZoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      setZoomLevel(ZOOM_LEVELS[currentIndex + 1]);
    }
  };

  const handleReset = () => {
    setZoomLevel(100);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 bg-secondary/50 rounded-lg px-1 py-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= ZOOM_LEVELS[0]}
              className="h-6 w-6 p-0 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20 disabled:opacity-30"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Zoom out</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleReset}
              className="text-xs font-medium text-primary-foreground/80 hover:text-primary-foreground min-w-[3rem] text-center"
            >
              {zoomLevel}%
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Reset to 100%</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 100}
              className="h-6 w-6 p-0 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20 disabled:opacity-30"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Zoom in</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(70)}
              className={cn(
                "h-6 px-1.5 text-xs text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20",
                zoomLevel === 70 && "bg-primary-foreground/20"
              )}
            >
              <Maximize className="w-3 h-3 mr-1" />
              Fit
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Fit to screen (70%)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-7 w-7 p-0 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isFullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen (F11)'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ZoomableContent = ({ children }: { children: React.ReactNode }) => {
  const { zoomLevel } = useZoomMode();
  
  return (
    <div 
      className="origin-top-left transition-transform duration-200"
      style={{ 
        transform: `scale(${zoomLevel / 100})`,
        width: `${10000 / zoomLevel}%`,
      }}
    >
      {children}
    </div>
  );
};
