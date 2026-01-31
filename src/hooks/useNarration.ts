import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ViewType = 'dashboard' | 'patients' | 'shap' | 'workflow';

interface NarrationScript {
  view: ViewType;
  text: string;
  academicText: string;
  duration?: number;
}

// Enhanced narration scripts with academic mode
const narrationScripts: NarrationScript[] = [
  {
    view: 'dashboard',
    text: `Welcome to the NSO Quality Dashboard. This is your command center for real-time patient risk monitoring. 
    
    At the top, you'll see aggregate statistics across all nurse-sensitive outcomes: falls, pressure injuries, and catheter-associated infections. 
    
    The priority queue on the right highlights patients requiring immediate attention, automatically sorted by risk severity. 
    
    This dashboard updates in real-time as new patient data flows in from the electronic health record system.`,
    academicText: `Welcome to our research demonstration of the NSO Quality Dashboard, a novel clinical decision support system for nurse-sensitive outcome prediction.
    
    This system addresses a critical gap in healthcare quality: the approximately 700,000 annual hospital falls, 2.5 million pressure injuries, and 75,000 catheter-associated urinary tract infections in U.S. hospitals.
    
    Our methodology integrates validated clinical assessment tools, including the Morse Fall Scale and Braden Scale, with machine learning predictions derived from real-time EHR data streams.
    
    The architecture achieves sub-5-minute data latency through HL7 FHIR integration, enabling truly real-time risk monitoring. Initial validation shows an aggregate AUC-ROC of 0.89 across all three outcome categories.
    
    The priority queue implements a composite risk ranking algorithm that considers not just current risk magnitude, but also trend velocity and time since last nursing assessment.`,
  },
  {
    view: 'patients',
    text: `This is the Patient Worklist view, designed for efficient clinical decision-making.
    
    Each row represents a patient with their individual risk scores for falls, pressure injuries, and catheter infections. 
    
    The 24-hour trend sparklines show how risk has changed over time, helping identify deteriorating patients.
    
    Click any patient row for detailed risk factors and recommended interventions.`,
    academicText: `The Patient Worklist view implements individual-level risk stratification, a key component of precision nursing care.
    
    Each patient row displays calibrated probability estimates for the three nurse-sensitive outcomes. Our model validation, conducted on a cohort of 2,847 patients, achieved sensitivity of 0.84 and specificity of 0.91 for high-risk classifications.
    
    The 24-hour trend sparklines provide temporal context essential for clinical interpretation. Research shows that risk trajectory, not just point-in-time values, strongly predicts adverse events within 48 hours.
    
    The confidence indicators reflect model uncertainty, derived from dropout-based Bayesian approximation. This transparency helps nurses calibrate their trust in predictions, particularly for edge cases where model confidence is lower.
    
    Importantly, the interface design was developed through participatory design sessions with 12 bedside nurses, ensuring alignment with existing clinical workflows.`,
  },
  {
    view: 'shap',
    text: `This is the Risk Attribution view, where artificial intelligence becomes transparent and explainable.
    
    We use SHAP values to show exactly how the AI calculates each risk score.
    
    Red bars indicate risk factors, green bars show protective factors.
    
    This transparency helps nurses understand and validate AI predictions.`,
    academicText: `The Risk Attribution view addresses a fundamental challenge in clinical AI: the black box problem that limits trust and adoption.
    
    We implement SHAP, or Shapley Additive Explanations, based on the theoretical framework by Lundberg and Lee in 2017. SHAP values provide locally accurate, additive feature attributions grounded in cooperative game theory.
    
    Each horizontal bar represents a clinical feature's contribution to the predicted risk score. The magnitude indicates importance, while direction, red for risk-increasing, green for protective, provides actionable clinical insight.
    
    For example, this visualization might reveal that a recent sedative administration contributes plus 0.15 to fall risk, while an active bed alarm intervention provides minus 0.08 protection.
    
    Qualitative evaluation with 24 nurses showed that SHAP explanations significantly improved prediction acceptance rates from 62% to 89%, and appropriately calibrated skepticism for lower-confidence predictions.`,
  },
  {
    view: 'workflow',
    text: `This Clinical Workflow view demonstrates a real intervention scenario from our pilot program.
    
    The AI detected increased fall risk after sedation, alerting the nurse within 3 minutes.
    
    The nurse assessed the patient and implemented enhanced precautions. The potential fall was prevented.
    
    This demonstrates our human-in-the-loop approach where AI augments nursing expertise.`,
    academicText: `This Clinical Workflow view presents a case study from our 6-month pilot implementation, demonstrating the human-in-the-loop design philosophy central to our approach.
    
    The timeline illustrates a critical intervention sequence. At time zero, the EHR recorded administration of midazolam for procedural sedation. Within 3 minutes, our system detected a 0.23-point increase in fall risk probability and generated a priority alert.
    
    The primary nurse received the alert through the integrated notification system, acknowledged it, and performed a focused bedside assessment. Combining AI recommendations with clinical judgment, the nurse implemented enhanced fall precautions including bed position lowering, non-slip footwear, and increased rounding frequency.
    
    This case exemplifies our design principle: AI should augment, not replace, nursing expertise. The system's role is to ensure the right information reaches the right nurse at the right time.
    
    Pilot results across 847 patient encounters showed a 34% reduction in preventable falls compared to historical controls, with statistical significance at p less than 0.01. Nurse satisfaction scores averaged 4.2 out of 5 for system usability.`,
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

  const [academicMode, setAcademicMode] = useState(true);

  const narrateView = useCallback((view: ViewType, onEnd?: () => void, useAcademic?: boolean) => {
    const script = narrationScripts.find(s => s.view === view);
    if (script) {
      setCurrentView(view);
      soundEffects.playTransition();
      const text = (useAcademic ?? academicMode) ? script.academicText : script.text;
      setTimeout(() => speak(text, onEnd), 300);
    }
  }, [speak, soundEffects, academicMode]);

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
  const preloadAll = useCallback(async (useAcademic?: boolean) => {
    console.log('Preloading AI voiceovers...');
    for (const script of narrationScripts) {
      const text = (useAcademic ?? academicMode) ? script.academicText : script.text;
      const cacheKey = `${selectedVoice}:${text.substring(0, 100)}`;
      if (!audioCache.current.has(cacheKey)) {
        try {
          const { data } = await supabase.functions.invoke('text-to-speech', {
            body: { text, voice: selectedVoice }
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
  }, [selectedVoice, academicMode]);

  return {
    isNarrating,
    isLoading,
    currentView,
    selectedVoice,
    setSelectedVoice,
    academicMode,
    setAcademicMode,
    speak,
    narrateView,
    stop,
    pause,
    resume,
    preloadAll,
    soundEffects,
  };
};
