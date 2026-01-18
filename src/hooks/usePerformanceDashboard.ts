// Real-time performance monitoring dashboard hook
import { useState, useEffect, useCallback, useRef } from 'react';
import { performanceMonitor, type PerformanceMetric, type BudgetViolation } from '@/lib/performanceMonitor';

export interface HookMetrics {
  name: string;
  avgRenderTime: number;
  totalRenders: number;
  lastRenderTime: number;
  violations: number;
}

export interface WebVitals {
  pageLoad: number;
  fcp: number;
  tti: number;
}

export interface PerformanceSummary {
  totalMetrics: number;
  avgInteractionTime: number;
  budgetViolations: BudgetViolation[];
  hookMetrics: HookMetrics[];
  webVitals: WebVitals;
  memoryUsage: number | null;
  lastUpdated: number;
}

export interface UsePerformanceDashboardOptions {
  /** Refresh interval in ms (default: 1000) */
  refreshInterval?: number;
  /** Enable budget violation tracking (default: true) */
  trackViolations?: boolean;
  /** Max violations to keep (default: 50) */
  maxViolations?: number;
}

export interface UsePerformanceDashboardReturn {
  summary: PerformanceSummary;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  clearMetrics: () => void;
  exportReport: () => string;
}

/**
 * Hook for real-time performance monitoring dashboard
 */
export const usePerformanceDashboard = (
  options: UsePerformanceDashboardOptions = {}
): UsePerformanceDashboardReturn => {
  const {
    refreshInterval = 1000,
    trackViolations = true,
    maxViolations = 50,
  } = options;

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [violations, setViolations] = useState<BudgetViolation[]>([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate hook-specific metrics from raw metrics
  const calculateHookMetrics = useCallback((): HookMetrics[] => {
    const metrics = performanceMonitor.getMetrics();
    const hookNames = ['usePatients', 'usePatientSelection', 'useDemoScenarios', 'useTimeOffset'];
    
    return hookNames.map(hookName => {
      const hookMetrics = metrics.filter(m => 
        m.name.toLowerCase().includes(hookName.toLowerCase()) ||
        m.name.includes('render-count') && m.name.includes(hookName)
      );
      
      const renderMetrics = hookMetrics.filter(m => m.unit === 'ms');
      const renderCounts = hookMetrics.filter(m => m.unit === 'count');
      
      const avgRenderTime = renderMetrics.length > 0
        ? renderMetrics.reduce((sum, m) => sum + m.value, 0) / renderMetrics.length
        : 0;
      
      const totalRenders = renderCounts.length > 0
        ? Math.max(...renderCounts.map(m => m.value))
        : 0;
      
      const lastRenderTime = renderMetrics.length > 0
        ? renderMetrics[renderMetrics.length - 1].value
        : 0;
      
      const violationCount = violations.filter(v => 
        v.metric.name.toLowerCase().includes(hookName.toLowerCase())
      ).length;

      return {
        name: hookName,
        avgRenderTime,
        totalRenders,
        lastRenderTime,
        violations: violationCount,
      };
    });
  }, [violations]);

  // Calculate summary
  const calculateSummary = useCallback((): PerformanceSummary => {
    const metrics = performanceMonitor.getMetrics();
    const interactionMetrics = metrics.filter(m => m.category === 'interaction');
    const webVitals = performanceMonitor.getWebVitals();
    
    // Get memory usage if available
    let memoryUsage: number | null = null;
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      memoryUsage = (performance as any).memory?.usedJSHeapSize || null;
    }

    const avgInteractionTime = interactionMetrics.length > 0
      ? interactionMetrics.reduce((sum, m) => sum + m.value, 0) / interactionMetrics.length
      : 0;

    return {
      totalMetrics: metrics.length,
      avgInteractionTime,
      budgetViolations: violations,
      hookMetrics: calculateHookMetrics(),
      webVitals: {
        pageLoad: webVitals.pageLoad || 0,
        fcp: webVitals.firstContentfulPaint || 0,
        tti: webVitals.timeToInteractive || 0,
      },
      memoryUsage,
      lastUpdated,
    };
  }, [violations, lastUpdated, calculateHookMetrics]);

  const [summary, setSummary] = useState<PerformanceSummary>(calculateSummary);

  // Handle budget violations
  useEffect(() => {
    if (!trackViolations) return;

    performanceMonitor.enableBudgetAlerts(true);
    
    const unsubscribe = performanceMonitor.onBudgetViolation((violation) => {
      setViolations(prev => {
        const updated = [...prev, violation];
        return updated.slice(-maxViolations);
      });
    });

    return () => {
      unsubscribe();
      performanceMonitor.enableBudgetAlerts(false);
    };
  }, [trackViolations, maxViolations]);

  // Refresh summary periodically
  useEffect(() => {
    if (!isMonitoring) return;

    intervalRef.current = setInterval(() => {
      setLastUpdated(Date.now());
      setSummary(calculateSummary());
    }, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMonitoring, refreshInterval, calculateSummary]);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const clearMetrics = useCallback(() => {
    performanceMonitor.clear();
    setViolations([]);
    setSummary(calculateSummary());
  }, [calculateSummary]);

  const exportReport = useCallback((): string => {
    const report = performanceMonitor.generateReport();
    return JSON.stringify({
      ...report,
      summary: calculateSummary(),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }, [calculateSummary]);

  return {
    summary,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearMetrics,
    exportReport,
  };
};
