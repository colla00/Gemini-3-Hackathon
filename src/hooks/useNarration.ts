import { useCallback, useRef, useState } from 'react';

export type ViewType = 'dashboard' | 'patients' | 'shap' | 'workflow';

interface NarrationScript {
  view: ViewType;
  text: string;
  duration?: number;
}

const narrationScripts: NarrationScript[] = [
  {
    view: 'dashboard',
    text: `Welcome to the NSO Quality Dashboard Overview. This view displays real-time risk monitoring for nurse-sensitive outcomes including falls, pressure injuries, and catheter-associated infections. Notice the risk category cards showing aggregate unit statistics, and the priority queue highlighting patients requiring immediate attention.`,
  },
  {
    view: 'patients',
    text: `This is the Patient Worklist view. Here nurses can see all patients sorted by risk level, with detailed risk scores for falls, HAPI, and CAUTI. Each row includes a 24-hour trend sparkline and confidence indicators. Click any patient to see detailed vitals and recommended interventions.`,
  },
  {
    view: 'shap',
    text: `The Risk Attribution view uses SHAP values to explain how the AI model calculates risk scores. Each bar shows how clinical factors either increase or decrease the patient's risk. Red bars indicate risk factors, while green bars show protective factors. This transparency helps nurses understand and validate AI predictions.`,
  },
  {
    view: 'workflow',
    text: `This Clinical Workflow view demonstrates a real intervention scenario. When the AI detected increased fall risk after sedation administration, the nurse was alerted within minutes. The timeline shows the assessment, interventions, and successful outcome. This human-in-the-loop approach combines AI prediction with nursing expertise.`,
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

export const useNarration = () => {
  const [isNarrating, setIsNarrating] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const soundEffects = useSoundEffects();

  const getVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    // Prefer a natural-sounding English voice
    const preferredVoices = [
      'Google UK English Female',
      'Google US English',
      'Samantha',
      'Karen',
      'Microsoft Zira',
      'Microsoft David',
    ];
    
    for (const name of preferredVoices) {
      const voice = voices.find(v => v.name.includes(name));
      if (voice) return voice;
    }
    
    // Fallback to first English voice
    return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    speechRef.current = utterance;

    // Configure voice
    const voice = getVoice();
    if (voice) utterance.voice = voice;
    
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsNarrating(true);
    };

    utterance.onend = () => {
      setIsNarrating(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsNarrating(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [getVoice]);

  const narrateView = useCallback((view: ViewType, onEnd?: () => void) => {
    const script = narrationScripts.find(s => s.view === view);
    if (script) {
      setCurrentView(view);
      soundEffects.playTransition();
      setTimeout(() => speak(script.text, onEnd), 300);
    }
  }, [speak, soundEffects]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsNarrating(false);
    setCurrentView(null);
  }, []);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
  }, []);

  return {
    isNarrating,
    currentView,
    speak,
    narrateView,
    stop,
    pause,
    resume,
    soundEffects,
  };
};
