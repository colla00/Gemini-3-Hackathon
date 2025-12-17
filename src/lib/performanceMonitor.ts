// Performance Monitoring Utilities
// Tracks app responsiveness, load times, and user interactions

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 's' | 'count' | 'bytes';
  timestamp: number;
  category: 'navigation' | 'resource' | 'interaction' | 'custom';
}

export interface PerformanceReport {
  pageLoad: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  customMetrics: PerformanceMetric[];
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private marks: Map<string, number> = new Map();
  private observer: PerformanceObserver | null = null;
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObserver();
    }
  }

  /**
   * Enable or disable performance monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Initialize PerformanceObserver for Web Vitals
   */
  private initializeObserver(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      // Observe paint timing
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.addMetric({
            name: entry.name,
            value: entry.startTime,
            unit: 'ms',
            timestamp: Date.now(),
            category: 'navigation',
          });
        });
      });

      this.observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    } catch (e) {
      console.warn('PerformanceObserver not supported');
    }
  }

  /**
   * Start timing a custom operation
   */
  startMark(name: string): void {
    if (!this.isEnabled) return;
    this.marks.set(name, performance.now());
    
    if (typeof performance.mark === 'function') {
      performance.mark(`${name}-start`);
    }
  }

  /**
   * End timing and record the duration
   */
  endMark(name: string): number {
    if (!this.isEnabled) return 0;
    
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No start mark found for: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(name);

    if (typeof performance.mark === 'function') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    this.addMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'custom',
    });

    return duration;
  }

  /**
   * Add a custom metric
   */
  addMetric(metric: PerformanceMetric): void {
    if (!this.isEnabled) return;
    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory issues
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  /**
   * Record a user interaction timing
   */
  recordInteraction(name: string, duration: number): void {
    this.addMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'interaction',
    });
  }

  /**
   * Get Core Web Vitals
   */
  getWebVitals(): Partial<PerformanceReport> {
    if (typeof window === 'undefined') return {};

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    
    const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');
    
    return {
      pageLoad: navigation?.loadEventEnd - navigation?.startTime || 0,
      firstContentfulPaint: fcp?.startTime || 0,
      timeToInteractive: navigation?.domInteractive - navigation?.startTime || 0,
    };
  }

  /**
   * Get all custom metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by category
   */
  getMetricsByCategory(category: PerformanceMetric['category']): PerformanceMetric[] {
    return this.metrics.filter(m => m.category === category);
  }

  /**
   * Get average duration for a specific metric name
   */
  getAverageDuration(name: string): number {
    const matching = this.metrics.filter(m => m.name === name);
    if (matching.length === 0) return 0;
    return matching.reduce((sum, m) => sum + m.value, 0) / matching.length;
  }

  /**
   * Generate a full performance report
   */
  generateReport(): PerformanceReport & { averages: Record<string, number> } {
    const webVitals = this.getWebVitals();
    
    // Calculate averages for custom metrics
    const metricNames = [...new Set(this.metrics.map(m => m.name))];
    const averages: Record<string, number> = {};
    metricNames.forEach(name => {
      averages[name] = this.getAverageDuration(name);
    });

    return {
      pageLoad: webVitals.pageLoad || 0,
      firstContentfulPaint: webVitals.firstContentfulPaint || 0,
      largestContentfulPaint: 0, // Requires additional observer
      firstInputDelay: 0, // Requires user interaction
      cumulativeLayoutShift: 0, // Requires additional observer
      timeToInteractive: webVitals.timeToInteractive || 0,
      customMetrics: this.metrics,
      averages,
    };
  }

  /**
   * Clear all recorded metrics
   */
  clear(): void {
    this.metrics = [];
    this.marks.clear();
  }

  /**
   * Disconnect observer and cleanup
   */
  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.clear();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * HOC helper to measure component render time
 */
export function measureRender<T extends (...args: any[]) => any>(
  componentName: string,
  renderFn: T
): T {
  return ((...args: Parameters<T>) => {
    performanceMonitor.startMark(`render-${componentName}`);
    const result = renderFn(...args);
    // Schedule end mark for after render
    requestAnimationFrame(() => {
      performanceMonitor.endMark(`render-${componentName}`);
    });
    return result;
  }) as T;
}

/**
 * Utility to measure async operations
 */
export async function measureAsync<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  performanceMonitor.startMark(name);
  try {
    const result = await operation();
    return result;
  } finally {
    performanceMonitor.endMark(name);
  }
}

/**
 * Utility to measure sync operations
 */
export function measureSync<T>(name: string, operation: () => T): T {
  performanceMonitor.startMark(name);
  try {
    return operation();
  } finally {
    performanceMonitor.endMark(name);
  }
}
