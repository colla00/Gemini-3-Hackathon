import { useState, useCallback, useEffect } from 'react';
import { setWithExpiry, getWithExpiry, removeManaged } from '@/lib/storageManager';

const TOUR_COMPLETED_KEY = 'nso_guided_tour_completed';

export interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  spotlight?: boolean;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '[data-tour="hero"]',
    title: 'Welcome to VitaSignal™',
    description: 'This interactive technology demo showcases 11 patent-pending clinical AI systems. Let\'s take a quick tour of the key features.',
    position: 'bottom',
    spotlight: false,
  },
  {
    id: 'status-badges',
    target: '[data-tour="status-badges"]',
    title: 'Demo Status Indicators',
    description: 'These badges show which patents are validated vs. design phase. Patent #1 and #5 have been externally validated on real clinical data.',
    position: 'bottom',
    spotlight: true,
  },
  {
    id: 'stats',
    target: '[data-tour="stats"]',
    title: 'Key Research Metrics',
    description: 'At-a-glance performance metrics: AUROC scores, patient cohort sizes, and total patent claims across the portfolio.',
    position: 'bottom',
    spotlight: true,
  },
  {
    id: 'census-strip',
    target: '[data-tour="census-strip"]',
    title: 'Live Census Strip',
    description: 'Simulated real-time unit census showing patient risk distribution, bed availability, and EHR connection status.',
    position: 'bottom',
    spotlight: true,
  },
  {
    id: 'sidebar',
    target: '[data-tour="sidebar"]',
    title: 'Patent Navigation',
    description: 'Browse all 11 patent systems organized by family. Click any group to expand and explore its interactive demos and calculators.',
    position: 'right',
    spotlight: true,
  },
  {
    id: 'content-area',
    target: '[data-tour="content-area"]',
    title: 'Interactive Content',
    description: 'Each patent tab loads an interactive demo — from ICU mortality prediction to the DBS calculator, FHIR integration, and more.',
    position: 'left',
    spotlight: true,
  },
  {
    id: 'disclaimer',
    target: '[data-tour="disclaimer"]',
    title: 'Research Prototype',
    description: 'Remember: This is a research demonstration using synthetic data. All predictions require human clinical verification before any clinical use.',
    position: 'bottom',
    spotlight: true,
  },
];

export const useGuidedTour = (autoStartForNewVisitors: boolean = true) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [hasSeenTour, setHasSeenTour] = useState<boolean | null>(null);

  const currentStep = tourSteps[currentStepIndex];
  const totalSteps = tourSteps.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  useEffect(() => {
    const tourCompleted = getWithExpiry<string>(TOUR_COMPLETED_KEY);
    const seen = tourCompleted === 'true';
    setHasSeenTour(seen);
    
    if (autoStartForNewVisitors && !seen) {
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [autoStartForNewVisitors]);

  const updateTargetRect = useCallback(() => {
    if (!isActive || !currentStep) return;
    
    const element = document.querySelector(currentStep.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [isActive, currentStep]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('scroll', updateTargetRect, true);
    window.addEventListener('resize', updateTargetRect);
    return () => {
      window.removeEventListener('scroll', updateTargetRect, true);
      window.removeEventListener('resize', updateTargetRect);
    };
  }, [updateTargetRect]);

  const startTour = useCallback(() => {
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setTargetRect(null);
    setWithExpiry(TOUR_COMPLETED_KEY, 'true');
    setHasSeenTour(true);
  }, []);

  const resetTourHistory = useCallback(() => {
    removeManaged(TOUR_COMPLETED_KEY);
    setHasSeenTour(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      endTour();
    }
  }, [currentStepIndex, totalSteps, endTour]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStepIndex(index);
    }
  }, [totalSteps]);

  return {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    targetRect,
    hasSeenTour,
    startTour,
    endTour,
    nextStep,
    prevStep,
    resetTourHistory,
    goToStep,
  };
};

export { tourSteps };
