import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor } from '@/lib/performanceMonitor';

/**
 * Hook to measure component mount/unmount and render times
 */
export function usePerformanceTracking(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();
    performanceMonitor.startMark(`mount-${componentName}`);
    
    return () => {
      const lifetime = performance.now() - mountTime.current;
      performanceMonitor.addMetric({
        name: `lifetime-${componentName}`,
        value: lifetime,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'custom',
      });
      performanceMonitor.endMark(`mount-${componentName}`);
    };
  }, [componentName]);

  useEffect(() => {
    renderCount.current += 1;
    performanceMonitor.addMetric({
      name: `render-count-${componentName}`,
      value: renderCount.current,
      unit: 'count',
      timestamp: Date.now(),
      category: 'custom',
    });
  });

  const trackInteraction = useCallback((interactionName: string) => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      performanceMonitor.recordInteraction(`${componentName}-${interactionName}`, duration);
    };
  }, [componentName]);

  return { trackInteraction, renderCount: renderCount.current };
}

/**
 * Hook to measure data fetching performance
 */
export function useFetchPerformance(queryName: string) {
  const startFetch = useCallback(() => {
    performanceMonitor.startMark(`fetch-${queryName}`);
  }, [queryName]);

  const endFetch = useCallback((success: boolean) => {
    const duration = performanceMonitor.endMark(`fetch-${queryName}`);
    performanceMonitor.addMetric({
      name: `fetch-${queryName}-${success ? 'success' : 'error'}`,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'resource',
    });
    return duration;
  }, [queryName]);

  return { startFetch, endFetch };
}

/**
 * Hook to track scroll performance
 */
export function useScrollPerformance() {
  const lastScrollTime = useRef<number>(0);
  const scrollCount = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = performance.now();
      if (lastScrollTime.current > 0) {
        const delta = now - lastScrollTime.current;
        if (delta < 16.67) { // Less than 60fps
          performanceMonitor.addMetric({
            name: 'scroll-jank',
            value: delta,
            unit: 'ms',
            timestamp: Date.now(),
            category: 'interaction',
          });
        }
      }
      lastScrollTime.current = now;
      scrollCount.current += 1;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollCount: scrollCount.current };
}

/**
 * Hook to measure input responsiveness
 */
export function useInputPerformance(inputName: string) {
  const handleChange = useCallback((handler: (e: React.ChangeEvent<HTMLInputElement>) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const start = performance.now();
      handler(e);
      const duration = performance.now() - start;
      
      if (duration > 50) { // Slow input handling
        performanceMonitor.addMetric({
          name: `slow-input-${inputName}`,
          value: duration,
          unit: 'ms',
          timestamp: Date.now(),
          category: 'interaction',
        });
      }
    };
  }, [inputName]);

  return { handleChange };
}
