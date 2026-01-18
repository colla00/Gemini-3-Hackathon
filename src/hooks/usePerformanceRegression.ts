// Performance regression detection system
import { useState, useEffect, useCallback, useRef } from 'react';
import { performanceMonitor } from '@/lib/performanceMonitor';
import { toast } from 'sonner';

export interface BaselineMetrics {
  avgRenderTime: number;
  avgInteractionTime: number;
  pageLoad: number;
  fcp: number;
  tti: number;
  memoryUsage: number | null;
  timestamp: number;
  sampleCount: number;
}

export interface RegressionAlert {
  id: string;
  metric: string;
  baseline: number;
  current: number;
  degradation: number; // percentage
  severity: 'warning' | 'critical';
  timestamp: number;
  acknowledged: boolean;
}

export interface RegressionThresholds {
  warningThreshold: number; // percentage (e.g., 20 = 20%)
  criticalThreshold: number; // percentage (e.g., 50 = 50%)
  minSamples: number; // minimum samples before alerting
}

export interface UsePerformanceRegressionOptions {
  /** Check interval in ms (default: 5000) */
  checkInterval?: number;
  /** Custom thresholds */
  thresholds?: Partial<RegressionThresholds>;
  /** Enable toast notifications (default: true) */
  enableNotifications?: boolean;
  /** Storage key for baselines (default: 'perf-baseline') */
  storageKey?: string;
}

export interface UsePerformanceRegressionReturn {
  baseline: BaselineMetrics | null;
  alerts: RegressionAlert[];
  isMonitoring: boolean;
  hasRegression: boolean;
  captureBaseline: () => void;
  clearBaseline: () => void;
  acknowledgeAlert: (alertId: string) => void;
  acknowledgeAllAlerts: () => void;
  clearAlerts: () => void;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  getStatus: () => 'healthy' | 'warning' | 'critical';
}

const DEFAULT_THRESHOLDS: RegressionThresholds = {
  warningThreshold: 20,
  criticalThreshold: 50,
  minSamples: 5,
};

const STORAGE_KEY_PREFIX = 'lovable-perf-';

/**
 * Hook for detecting performance regressions against established baselines
 */
export const usePerformanceRegression = (
  options: UsePerformanceRegressionOptions = {}
): UsePerformanceRegressionReturn => {
  const {
    checkInterval = 5000,
    thresholds: customThresholds,
    enableNotifications = true,
    storageKey = 'baseline',
  } = options;

  const thresholds = { ...DEFAULT_THRESHOLDS, ...customThresholds };
  const fullStorageKey = `${STORAGE_KEY_PREFIX}${storageKey}`;

  const [baseline, setBaseline] = useState<BaselineMetrics | null>(null);
  const [alerts, setAlerts] = useState<RegressionAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sampleCountRef = useRef(0);

  // Load baseline from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(fullStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as BaselineMetrics;
        setBaseline(parsed);
      }
    } catch (error) {
      console.warn('Failed to load performance baseline:', error);
    }
  }, [fullStorageKey]);

  // Get current metrics
  const getCurrentMetrics = useCallback((): Omit<BaselineMetrics, 'timestamp' | 'sampleCount'> => {
    const metrics = performanceMonitor.getMetrics();
    const webVitals = performanceMonitor.getWebVitals();
    
    // Filter for render-related metrics by checking name patterns
    const renderMetrics = metrics.filter(m => 
      m.unit === 'ms' && (m.name.includes('render') || m.name.includes('Render'))
    );
    const interactionMetrics = metrics.filter(m => m.category === 'interaction' && m.unit === 'ms');
    
    const avgRenderTime = renderMetrics.length > 0
      ? renderMetrics.reduce((sum, m) => sum + m.value, 0) / renderMetrics.length
      : 0;
    
    const avgInteractionTime = interactionMetrics.length > 0
      ? interactionMetrics.reduce((sum, m) => sum + m.value, 0) / interactionMetrics.length
      : 0;

    let memoryUsage: number | null = null;
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      memoryUsage = (performance as any).memory?.usedJSHeapSize || null;
    }

    return {
      avgRenderTime,
      avgInteractionTime,
      pageLoad: webVitals.pageLoad || 0,
      fcp: webVitals.firstContentfulPaint || 0,
      tti: webVitals.timeToInteractive || 0,
      memoryUsage,
    };
  }, []);

  // Capture current metrics as baseline
  const captureBaseline = useCallback(() => {
    const current = getCurrentMetrics();
    const newBaseline: BaselineMetrics = {
      ...current,
      timestamp: Date.now(),
      sampleCount: sampleCountRef.current,
    };
    
    setBaseline(newBaseline);
    setAlerts([]); // Clear alerts when new baseline is set
    
    try {
      localStorage.setItem(fullStorageKey, JSON.stringify(newBaseline));
    } catch (error) {
      console.warn('Failed to save performance baseline:', error);
    }

    if (enableNotifications) {
      toast.success('Performance baseline captured', {
        description: `Avg render: ${current.avgRenderTime.toFixed(2)}ms, FCP: ${current.fcp.toFixed(0)}ms`,
      });
    }
  }, [getCurrentMetrics, fullStorageKey, enableNotifications]);

  // Clear stored baseline
  const clearBaseline = useCallback(() => {
    setBaseline(null);
    setAlerts([]);
    try {
      localStorage.removeItem(fullStorageKey);
    } catch (error) {
      console.warn('Failed to clear performance baseline:', error);
    }
  }, [fullStorageKey]);

  // Calculate degradation percentage
  const calculateDegradation = useCallback((current: number, baseline: number): number => {
    if (baseline === 0) return 0;
    return ((current - baseline) / baseline) * 100;
  }, []);

  // Check for regressions
  const checkForRegressions = useCallback(() => {
    if (!baseline) return;
    
    sampleCountRef.current++;
    
    if (sampleCountRef.current < thresholds.minSamples) return;

    const current = getCurrentMetrics();
    const newAlerts: RegressionAlert[] = [];

    const metricsToCheck: Array<{ name: string; current: number; baseline: number }> = [
      { name: 'Average Render Time', current: current.avgRenderTime, baseline: baseline.avgRenderTime },
      { name: 'Average Interaction Time', current: current.avgInteractionTime, baseline: baseline.avgInteractionTime },
      { name: 'Page Load', current: current.pageLoad, baseline: baseline.pageLoad },
      { name: 'First Contentful Paint', current: current.fcp, baseline: baseline.fcp },
      { name: 'Time to Interactive', current: current.tti, baseline: baseline.tti },
    ];

    // Check memory separately (if available)
    if (current.memoryUsage !== null && baseline.memoryUsage !== null) {
      metricsToCheck.push({
        name: 'Memory Usage',
        current: current.memoryUsage,
        baseline: baseline.memoryUsage,
      });
    }

    metricsToCheck.forEach(({ name, current: currentVal, baseline: baselineVal }) => {
      if (baselineVal === 0) return;
      
      const degradation = calculateDegradation(currentVal, baselineVal);
      
      if (degradation >= thresholds.criticalThreshold) {
        newAlerts.push({
          id: `${name}-${Date.now()}`,
          metric: name,
          baseline: baselineVal,
          current: currentVal,
          degradation,
          severity: 'critical',
          timestamp: Date.now(),
          acknowledged: false,
        });
      } else if (degradation >= thresholds.warningThreshold) {
        newAlerts.push({
          id: `${name}-${Date.now()}`,
          metric: name,
          baseline: baselineVal,
          current: currentVal,
          degradation,
          severity: 'warning',
          timestamp: Date.now(),
          acknowledged: false,
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => {
        // Deduplicate by metric name, keeping the most recent
        const existingMetrics = new Set(newAlerts.map(a => a.metric));
        const filtered = prev.filter(a => !existingMetrics.has(a.metric));
        return [...filtered, ...newAlerts].slice(-20); // Keep last 20 alerts
      });

      if (enableNotifications) {
        const criticalCount = newAlerts.filter(a => a.severity === 'critical').length;
        const warningCount = newAlerts.filter(a => a.severity === 'warning').length;
        
        if (criticalCount > 0) {
          toast.error(`${criticalCount} critical performance regression(s) detected`, {
            description: newAlerts
              .filter(a => a.severity === 'critical')
              .map(a => `${a.metric}: +${a.degradation.toFixed(0)}%`)
              .join(', '),
          });
        } else if (warningCount > 0) {
          toast.warning(`${warningCount} performance warning(s) detected`, {
            description: newAlerts
              .filter(a => a.severity === 'warning')
              .map(a => `${a.metric}: +${a.degradation.toFixed(0)}%`)
              .join(', '),
          });
        }
      }
    }
  }, [baseline, getCurrentMetrics, calculateDegradation, thresholds, enableNotifications]);

  // Start monitoring
  useEffect(() => {
    if (!isMonitoring || !baseline) return;

    intervalRef.current = setInterval(checkForRegressions, checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMonitoring, baseline, checkInterval, checkForRegressions]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, acknowledged: true } : a
    ));
  }, []);

  const acknowledgeAllAlerts = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    sampleCountRef.current = 0;
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const getStatus = useCallback((): 'healthy' | 'warning' | 'critical' => {
    const unacknowledged = alerts.filter(a => !a.acknowledged);
    if (unacknowledged.some(a => a.severity === 'critical')) return 'critical';
    if (unacknowledged.some(a => a.severity === 'warning')) return 'warning';
    return 'healthy';
  }, [alerts]);

  const hasRegression = alerts.some(a => !a.acknowledged);

  return {
    baseline,
    alerts,
    isMonitoring,
    hasRegression,
    captureBaseline,
    clearBaseline,
    acknowledgeAlert,
    acknowledgeAllAlerts,
    clearAlerts,
    startMonitoring,
    stopMonitoring,
    getStatus,
  };
};
