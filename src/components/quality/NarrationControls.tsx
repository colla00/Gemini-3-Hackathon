import { Volume2, VolumeX, Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { VoiceOption } from '@/hooks/useNarration';

interface NarrationControlsProps {
  isNarrating: boolean;
  isLoading?: boolean;
  soundEnabled: boolean;
  narrationEnabled: boolean;
  selectedVoice?: VoiceOption;
  onToggleSound: () => void;
  onToggleNarration: () => void;
  onVoiceChange?: (voice: VoiceOption) => void;
}

const voiceOptions: { value: VoiceOption; label: string; description: string }[] = [
  { value: 'nova', label: 'Nova', description: 'Warm, professional' },
  { value: 'alloy', label: 'Alloy', description: 'Balanced, neutral' },
  { value: 'echo', label: 'Echo', description: 'Soft, calm' },
  { value: 'fable', label: 'Fable', description: 'Expressive, British' },
  { value: 'onyx', label: 'Onyx', description: 'Deep, authoritative' },
  { value: 'shimmer', label: 'Shimmer', description: 'Clear, energetic' },
];

export const NarrationControls = ({
  isNarrating,
  isLoading = false,
  soundEnabled,
  narrationEnabled,
  selectedVoice = 'nova',
  onToggleSound,
  onToggleNarration,
  onVoiceChange,
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
              disabled={isLoading}
              className={cn(
                "p-1.5 rounded transition-colors relative",
                narrationEnabled
                  ? "bg-risk-low/20 text-risk-low"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                isLoading && "opacity-50 cursor-wait"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : narrationEnabled ? (
                <Mic className="w-3.5 h-3.5" />
              ) : (
                <MicOff className="w-3.5 h-3.5" />
              )}
              {isNarrating && !isLoading && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-risk-low animate-pulse" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-[10px]">
            {isLoading ? 'Loading AI voice...' : narrationEnabled ? 'Disable AI narration' : 'Enable AI narration'}
          </TooltipContent>
        </Tooltip>

        {/* Voice Selection */}
        {narrationEnabled && onVoiceChange && (
          <Select value={selectedVoice} onValueChange={(v) => onVoiceChange(v as VoiceOption)}>
            <SelectTrigger className="h-6 w-[80px] text-[10px] border-none bg-secondary/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {voiceOptions.map((voice) => (
                <SelectItem key={voice.value} value={voice.value} className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium">{voice.label}</span>
                    <span className="text-[10px] text-muted-foreground">{voice.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Speaking indicator */}
        {(isNarrating || isLoading) && (
          <div className="flex items-center gap-1 ml-1">
            {isLoading ? (
              <span className="text-[10px] text-muted-foreground animate-pulse">Generating...</span>
            ) : (
              <div className="flex items-end gap-0.5 h-3">
                <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0ms' }} />
                <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '70%', animationDelay: '150ms' }} />
                <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '100%', animationDelay: '300ms' }} />
                <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '60%', animationDelay: '450ms' }} />
                <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '30%', animationDelay: '600ms' }} />
              </div>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
