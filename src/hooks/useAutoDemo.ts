import { useState, useEffect, useCallback, useRef } from 'react';

export type ViewType = 'dashboard' | 'patients' | 'shap' | 'workflow' | 'ehr-flow' | 'alert-timeline' | 'comparison' | 'patient-journey' | 'roi' | 'ml-features' | 'video-demo' | 'research-validation' | 'patent-portfolio' | 'patent-trust-alerts' | 'patent-equity' | 'patent-dbs-breakdown' | 'patent-neural-reasoning' | 'patent-cognitive-load' | 'patent-trust-score' | 'patent-performance' | 'patent-validation-charts';

interface AutoDemoConfig {
  views: ViewType[];
  intervalMs: number;
  enabled: boolean;
}

export const useAutoDemo = (onViewChange: (view: ViewType) => void) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [config, setConfig] = useState<AutoDemoConfig>({
    views: ['dashboard', 'patients', 'shap', 'workflow'],
    intervalMs: 8000,
    enabled: false,
  });
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  const startDemo = useCallback(() => {
    if (config.views.length === 0) return;
    
    setIsRunning(true);
    setProgress(0);
    
    // Progress bar animation
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / (config.intervalMs / 100));
      });
    }, 100);

    // View switching
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = (prev + 1) % config.views.length;
        onViewChange(config.views[nextIndex]);
        setProgress(0);
        return nextIndex;
      });
    }, config.intervalMs);
  }, [config.views, config.intervalMs, onViewChange]);

  const stopDemo = useCallback(() => {
    clearTimers();
    setIsRunning(false);
    setProgress(0);
  }, [clearTimers]);

  const toggleDemo = useCallback(() => {
    if (isRunning) {
      stopDemo();
    } else {
      startDemo();
    }
  }, [isRunning, startDemo, stopDemo]);

  const nextView = useCallback(() => {
    setCurrentIndex(prev => {
      const nextIndex = (prev + 1) % config.views.length;
      onViewChange(config.views[nextIndex]);
      setProgress(0);
      return nextIndex;
    });
  }, [config.views, onViewChange]);

  const prevView = useCallback(() => {
    setCurrentIndex(prev => {
      const prevIndex = prev === 0 ? config.views.length - 1 : prev - 1;
      onViewChange(config.views[prevIndex]);
      setProgress(0);
      return prevIndex;
    });
  }, [config.views, onViewChange]);

  const setSpeed = useCallback((ms: number) => {
    setConfig(prev => ({ ...prev, intervalMs: ms }));
    if (isRunning) {
      stopDemo();
      setTimeout(() => startDemo(), 100);
    }
  }, [isRunning, stopDemo, startDemo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    isRunning,
    progress,
    currentIndex,
    currentView: config.views[currentIndex],
    totalViews: config.views.length,
    intervalMs: config.intervalMs,
    toggleDemo,
    startDemo,
    stopDemo,
    nextView,
    prevView,
    setSpeed,
  };
};
