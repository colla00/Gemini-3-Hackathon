import { useState, useEffect, createContext, useContext } from 'react';
import { Monitor, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ZoomModeContextType {
  isZoomMode: boolean;
  toggleZoomMode: () => void;
}

const ZoomModeContext = createContext<ZoomModeContextType>({
  isZoomMode: false,
  toggleZoomMode: () => {},
});

export const useZoomMode = () => useContext(ZoomModeContext);

export const ZoomModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isZoomMode, setIsZoomMode] = useState(false);

  useEffect(() => {
    // Apply Zoom-optimized styles to document
    if (isZoomMode) {
      document.documentElement.classList.add('zoom-mode');
    } else {
      document.documentElement.classList.remove('zoom-mode');
    }
  }, [isZoomMode]);

  const toggleZoomMode = () => setIsZoomMode(prev => !prev);

  return (
    <ZoomModeContext.Provider value={{ isZoomMode, toggleZoomMode }}>
      {children}
    </ZoomModeContext.Provider>
  );
};

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
