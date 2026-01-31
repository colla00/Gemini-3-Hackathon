import { useState, useCallback, useEffect } from 'react';

const TOUR_COMPLETED_KEY = 'nso-dashboard-tour-completed';

export interface TourStep {
  id: string;
  target: string; // CSS selector for the element to highlight
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  spotlight?: boolean;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '[data-tour="header"]',
    title: 'Welcome to NSO Quality Dashboard',
    description: 'This prototype demonstrates AI-assisted nursing quality monitoring. Let\'s take a quick tour of the key features.',
    position: 'bottom',
    spotlight: false,
  },
  {
    id: 'unit-selector',
    target: '[data-tour="unit-selector"]',
    title: 'Unit Selection',
    description: 'Select the nursing unit you want to monitor. Each unit shows its own patient census and risk data.',
    position: 'bottom',
    spotlight: true,
  },
  {
    id: 'live-status',
    target: '[data-tour="live-status"]',
    title: 'Live Updates',
    description: 'When active, the dashboard simulates real-time data updates. Risk scores and vitals refresh automatically.',
    position: 'bottom',
    spotlight: true,
  },
  {
    id: 'nav-tabs',
    target: '[data-tour="nav-tabs"]',
    title: 'Navigation Tabs',
    description: 'Switch between Overview, Patient Worklist, Risk Attribution (SHAP), and Workflow Demo views. Use keyboard shortcuts 1-4 for quick access.',
    position: 'bottom',
    spotlight: true,
  },
  {
    id: 'quick-stats',
    target: '[data-tour="quick-stats"]',
    title: 'Quick Statistics',
    description: 'At-a-glance metrics showing patient census, risk distribution, and pending actions for the unit.',
    position: 'bottom',
    spotlight: true,
  },
  {
    id: 'risk-cards',
    target: '[data-tour="risk-cards"]',
    title: 'Risk Category Cards',
    description: 'Each card shows aggregate risk for Falls, Pressure Injuries (HAPI), and Catheter Infections (CAUTI). Confidence scores indicate prediction reliability.',
    position: 'bottom',
    spotlight: true,
  },
  {
    id: 'priority-queue',
    target: '[data-tour="priority-queue"]',
    title: 'Priority Queue',
    description: 'Patients sorted by risk level. High-risk patients appear at the top with visual indicators for immediate attention.',
    position: 'left',
    spotlight: true,
  },
  {
    id: 'demo-controls',
    target: '[data-tour="demo-controls"]',
    title: 'Demo Controls',
    description: 'Control the auto-demo mode, toggle live updates, enable voice narration, and access keyboard shortcuts. Perfect for presentations!',
    position: 'top',
    spotlight: true,
  },
  {
    id: 'disclaimer',
    target: '[data-tour="disclaimer"]',
    title: 'Research Prototype',
    description: 'Remember: This is a research demonstration using synthetic data. All predictions require human clinical verification.',
    position: 'top',
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

  // Check localStorage on mount for first-time visitor detection
  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
    const seen = tourCompleted === 'true';
    setHasSeenTour(seen);
    
    // Auto-start tour for first-time visitors after a short delay
    if (autoStartForNewVisitors && !seen) {
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1500); // Delay to let the page render first
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
    
    // Update on scroll/resize
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
    // Mark tour as completed in localStorage
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    setHasSeenTour(true);
  }, []);

  const resetTourHistory = useCallback(() => {
    localStorage.removeItem(TOUR_COMPLETED_KEY);
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
