import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NarrationControlsProps {
  isNarrating: boolean;
  soundEnabled: boolean;
  narrationEnabled: boolean;
  onToggleSound: () => void;
  onToggleNarration: () => void;
}

export const NarrationControls = ({
  isNarrating,
  soundEnabled,
  narrationEnabled,
  onToggleSound,
  onToggleNarration,
}: NarrationControlsProps) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {/* Sound Effects Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleSound}
              className={cn(
                "p-1.5 rounded transition-colors",
                soundEnabled
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-[10px]">
            {soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          </TooltipContent>
        </Tooltip>

        {/* Voice Narration Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleNarration}
              className={cn(
                "p-1.5 rounded transition-colors relative",
                narrationEnabled
                  ? "bg-risk-low/20 text-risk-low"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {narrationEnabled ? (
                <Mic className="w-3.5 h-3.5" />
              ) : (
                <MicOff className="w-3.5 h-3.5" />
              )}
              {isNarrating && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-risk-low animate-pulse" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-[10px]">
            {narrationEnabled ? 'Disable narration' : 'Enable voice narration'}
          </TooltipContent>
        </Tooltip>

        {/* Speaking indicator */}
        {isNarrating && (
          <div className="flex items-center gap-1 ml-1">
            <div className="flex items-end gap-0.5 h-3">
              <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0ms' }} />
              <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '70%', animationDelay: '150ms' }} />
              <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '100%', animationDelay: '300ms' }} />
              <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '60%', animationDelay: '450ms' }} />
              <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '30%', animationDelay: '600ms' }} />
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
