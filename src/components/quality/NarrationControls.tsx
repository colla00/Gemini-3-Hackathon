import { useState } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Loader2, Play, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
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

const PREVIEW_TEXT = "Hello, I'm ready to narrate your presentation.";

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
  const [previewingVoice, setPreviewingVoice] = useState<VoiceOption | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  const stopPreview = () => {
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
      setPreviewAudio(null);
    }
    setPreviewingVoice(null);
  };

  const previewVoice = async (voice: VoiceOption, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If already previewing this voice, stop it
    if (previewingVoice === voice) {
      stopPreview();
      return;
    }

    // Stop any current preview
    stopPreview();
    setPreviewingVoice(voice);

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text: PREVIEW_TEXT, voice }
      });

      if (error) throw error;

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audio.onended = () => {
        setPreviewingVoice(null);
        setPreviewAudio(null);
      };
      audio.onerror = () => {
        setPreviewingVoice(null);
        setPreviewAudio(null);
      };
      
      setPreviewAudio(audio);
      await audio.play();
    } catch (error) {
      console.error('Error previewing voice:', error);
      setPreviewingVoice(null);
    }
  };

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
                <SelectItem key={voice.value} value={voice.value} className="text-xs pr-1">
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{voice.label}</span>
                      <span className="text-[10px] text-muted-foreground">{voice.description}</span>
                    </div>
                    <button
                      onClick={(e) => previewVoice(voice.value, e)}
                      className={cn(
                        "p-1 rounded hover:bg-secondary transition-colors shrink-0",
                        previewingVoice === voice.value && "bg-primary/20 text-primary"
                      )}
                      title={previewingVoice === voice.value ? 'Stop preview' : 'Preview voice'}
                    >
                      {previewingVoice === voice.value ? (
                        <Square className="w-3 h-3 fill-current" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Speaking indicator */}
        {(isNarrating || isLoading || previewingVoice) && (
          <div className="flex items-center gap-1 ml-1">
            {isLoading ? (
              <span className="text-[10px] text-muted-foreground animate-pulse">Generating...</span>
            ) : previewingVoice ? (
              <span className="text-[10px] text-primary animate-pulse">Previewing...</span>
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
