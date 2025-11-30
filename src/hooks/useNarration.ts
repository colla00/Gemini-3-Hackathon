import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ViewType = 'dashboard' | 'patients' | 'shap' | 'workflow';

interface NarrationScript {
  view: ViewType;
  text: string;
  duration?: number;
}

// Enhanced narration scripts for guided tour
const narrationScripts: NarrationScript[] = [
  {
    view: 'dashboard',
    text: `Welcome to the NSO Quality Dashboard. This is your command center for real-time patient risk monitoring. 
    
    At the top, you'll see aggregate statistics across all nurse-sensitive outcomes: falls, pressure injuries, and catheter-associated infections. 
    
    The priority queue on the right highlights patients requiring immediate attention, automatically sorted by risk severity. 
    
    Each risk category card shows the current unit statistics and trending data. Green indicators mean stable, yellow requires monitoring, and red demands immediate action.
    
    This dashboard updates in real-time as new patient data flows in from the electronic health record system.`,
  },
  {
    view: 'patients',
    text: `This is the Patient Worklist view, designed for efficient clinical decision-making.
    
    Each row represents a patient with their individual risk scores displayed for falls, pressure injuries, and catheter infections. 
    
    Notice the 24-hour trend sparklines on the right side of each row. These micro-charts show how risk has changed over time, helping you identify patients whose condition is deteriorating.
    
    The confidence indicators show how certain the AI model is about each prediction. Higher confidence means more reliable assessments.
    
    Click any patient row to drill down into their detailed risk factors and recommended interventions.`,
  },
  {
    view: 'shap',
    text: `This is the Risk Attribution view, where artificial intelligence becomes transparent and explainable.
    
    We use SHAP values, which stands for Shapley Additive Explanations, to show exactly how the AI calculates each risk score.
    
    Each horizontal bar represents a clinical factor. Red bars pushing right indicate factors that increase the patient's risk. Green bars pushing left show protective factors that lower risk.
    
    For example, you might see that recent sedation medication is pushing fall risk higher, while the presence of a bed alarm is providing some protection.
    
    This transparency helps nurses understand and validate AI predictions, ensuring human expertise remains central to clinical decisions.`,
  },
  {
    view: 'workflow',
    text: `This Clinical Workflow view demonstrates a real intervention scenario from our pilot program.
    
    Follow the timeline from left to right. First, the AI detected increased fall risk after sedation was administered. Within 3 minutes, the system generated an alert to the primary nurse.
    
    The nurse acknowledged the alert and performed a bedside assessment. Based on clinical judgment combined with AI recommendations, enhanced fall precautions were implemented.
    
    The outcome: a potential fall was prevented through this human-AI collaboration. The patient remained safe, and the intervention was documented for quality reporting.
    
    This demonstrates our human-in-the-loop approach, where AI augments nursing expertise rather than replacing it.`,
  },
];

// Sound effects using Web Audio API
const createAudioContext = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

const playBeep = (frequency: number = 440, duration: number = 0.1, type: OscillatorType = 'sine') => {
  try {
    const ctx = createAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
};

export const useSoundEffects = () => {
  const playTransition = useCallback(() => {
    // Two-tone chime for view transitions
    playBeep(523, 0.1, 'sine'); // C5
    setTimeout(() => playBeep(659, 0.15, 'sine'), 100); // E5
  }, []);

  const playStart = useCallback(() => {
    // Rising three-tone for demo start
    playBeep(440, 0.1, 'sine'); // A4
    setTimeout(() => playBeep(554, 0.1, 'sine'), 100); // C#5
    setTimeout(() => playBeep(659, 0.15, 'sine'), 200); // E5
  }, []);

  const playStop = useCallback(() => {
    // Descending tone for stop
    playBeep(659, 0.1, 'sine');
    setTimeout(() => playBeep(440, 0.15, 'sine'), 100);
  }, []);

  const playAlert = useCallback(() => {
    // Quick alert beep
    playBeep(880, 0.05, 'square');
    setTimeout(() => playBeep(880, 0.05, 'square'), 100);
  }, []);

  const playSuccess = useCallback(() => {
    // Success chime
    playBeep(523, 0.1, 'sine');
    setTimeout(() => playBeep(659, 0.1, 'sine'), 100);
    setTimeout(() => playBeep(784, 0.2, 'sine'), 200);
  }, []);

  return {
    playTransition,
    playStart,
    playStop,
    playAlert,
    playSuccess,
  };
};

// OpenAI voice options
export type VoiceOption = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export const useNarration = () => {
  const [isNarrating, setIsNarrating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>('nova');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundEffects = useSoundEffects();
  const audioCache = useRef<Map<string, string>>(new Map());

  // Fallback to browser speech synthesis
  const speakWithBrowser = useCallback((text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google UK English Female') || 
      v.name.includes('Samantha') ||
      v.lang.startsWith('en')
    );
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsNarrating(true);
    utterance.onend = () => {
      setIsNarrating(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      setIsNarrating(false);
      onEnd?.();
    };
    
    window.speechSynthesis.speak(utterance);
  }, []);

  // Track if we've already shown the quota warning
  const quotaWarningShown = useRef(false);

  // Generate and play audio using OpenAI TTS
  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    const cacheKey = `${selectedVoice}:${text.substring(0, 100)}`;
    
    // Check if we have cached audio first
    let audioContent = audioCache.current.get(cacheKey);
    
    if (audioContent) {
      // Use cached audio
      try {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mp3' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onplay = () => setIsNarrating(true);
        audio.onended = () => {
          setIsNarrating(false);
          URL.revokeObjectURL(audioUrl);
          onEnd?.();
        };
        await audio.play();
        return;
      } catch {
        // If cached playback fails, continue to generate new
      }
    }

    // Try OpenAI TTS
    try {
      setIsLoading(true);
      console.log('Generating AI voiceover...');
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: selectedVoice }
      });

      if (error || !data?.audioContent) {
        // Check for quota error
        const errorStr = JSON.stringify(error || data);
        if (errorStr.includes('quota') || errorStr.includes('429')) {
          if (!quotaWarningShown.current) {
            quotaWarningShown.current = true;
            console.warn('OpenAI quota exceeded - using browser voice instead');
          }
        }
        throw new Error('TTS API unavailable');
      }

      audioCache.current.set(cacheKey, data.audioContent);

      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsNarrating(true);
        setIsLoading(false);
      };

      audio.onended = () => {
        setIsNarrating(false);
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
      };

      audio.onerror = () => {
        setIsNarrating(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
        speakWithBrowser(text, onEnd);
      };

      await audio.play();
    } catch {
      // Silently fall back to browser TTS without error logging
      setIsLoading(false);
      speakWithBrowser(text, onEnd);
    }
  }, [selectedVoice, speakWithBrowser]);

  const narrateView = useCallback((view: ViewType, onEnd?: () => void) => {
    const script = narrationScripts.find(s => s.view === view);
    if (script) {
      setCurrentView(view);
      soundEffects.playTransition();
      setTimeout(() => speak(script.text, onEnd), 300);
    }
  }, [speak, soundEffects]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
    setIsNarrating(false);
    setIsLoading(false);
    setCurrentView(null);
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    window.speechSynthesis?.pause();
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    window.speechSynthesis?.resume();
  }, []);

  // Preload audio for all views
  const preloadAll = useCallback(async () => {
    console.log('Preloading AI voiceovers...');
    for (const script of narrationScripts) {
      const cacheKey = `${selectedVoice}:${script.text.substring(0, 100)}`;
      if (!audioCache.current.has(cacheKey)) {
        try {
          const { data } = await supabase.functions.invoke('text-to-speech', {
            body: { text: script.text, voice: selectedVoice }
          });
          if (data?.audioContent) {
            audioCache.current.set(cacheKey, data.audioContent);
          }
        } catch (e) {
          console.warn(`Failed to preload ${script.view}:`, e);
        }
      }
    }
    console.log('Preloading complete');
  }, [selectedVoice]);

  return {
    isNarrating,
    isLoading,
    currentView,
    selectedVoice,
    setSelectedVoice,
    speak,
    narrateView,
    stop,
    pause,
    resume,
    preloadAll,
    soundEffects,
  };
};
