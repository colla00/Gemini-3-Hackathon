// Lighthouse-style performance scoring based on Core Web Vitals
import { useState, useEffect, useCallback, useRef } from 'react';

export interface LighthouseMetrics {
  // Core Web Vitals
  fcp: number; // First Contentful Paint (ms)
  lcp: number; // Largest Contentful Paint (ms)
  cls: number; // Cumulative Layout Shift (score)
  fid: number; // First Input Delay (ms) - approximated
  tbt: number; // Total Blocking Time (ms) - approximated
  tti: number; // Time to Interactive (ms)
  
  // Additional metrics
  speedIndex: number; // Speed Index (ms) - approximated
  totalByteWeight: number; // Total page weight (bytes)
}

export interface LighthouseScores {
  performance: number; // 0-100
  fcp: number;
  lcp: number;
  cls: number;
  tbt: number;
  speedIndex: number;
}

export interface LighthouseAudit {
  id: string;
  title: string;
  score: number;
  value: number;
  unit: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export interface LighthouseReport {
  scores: LighthouseScores;
  audits: LighthouseAudit[];
  metrics: LighthouseMetrics;
  timestamp: number;
}

export interface UseLighthouseMonitoringOptions {
  /** Auto-measure on mount (default: true) */
  autoMeasure?: boolean;
  /** Storage key for history (default: 'lighthouse-history') */
  storageKey?: string;
  /** Max history entries (default: 30) */
  maxHistory?: number;
}

export interface UseLighthouseMonitoringReturn {
  currentReport: LighthouseReport | null;
  history: LighthouseReport[];
  isLoading: boolean;
  runAudit: () => Promise<void>;
  clearHistory: () => void;
  getScoreRating: (score: number) => 'good' | 'needs-improvement' | 'poor';
  getOverallRating: () => 'good' | 'needs-improvement' | 'poor';
}

// Lighthouse scoring thresholds (based on official Lighthouse v10)
const THRESHOLDS = {
  fcp: { good: 1800, poor: 3000 }, // ms
  lcp: { good: 2500, poor: 4000 }, // ms
  cls: { good: 0.1, poor: 0.25 }, // score
  tbt: { good: 200, poor: 600 }, // ms
  speedIndex: { good: 3400, poor: 5800 }, // ms
  tti: { good: 3800, poor: 7300 }, // ms
  fid: { good: 100, poor: 300 }, // ms
};

// Lighthouse performance score weights (v10)
const WEIGHTS = {
  fcp: 0.10,
  lcp: 0.25,
  cls: 0.25,
  tbt: 0.30,
  speedIndex: 0.10,
};

const STORAGE_KEY_PREFIX = 'lovable-lighthouse-';

/**
 * Calculate a 0-100 score based on metric value and thresholds
 */
const calculateMetricScore = (value: number, thresholds: { good: number; poor: number }): number => {
  if (value <= thresholds.good) {
    // Good range: 90-100
    return 90 + (10 * (1 - value / thresholds.good));
  } else if (value <= thresholds.poor) {
    // Needs improvement: 50-89
    const range = thresholds.poor - thresholds.good;
    const position = (value - thresholds.good) / range;
    return 90 - (40 * position);
  } else {
    // Poor: 0-49
    const overage = value / thresholds.poor;
    return Math.max(0, 50 - (50 * (overage - 1)));
  }
};

/**
 * Get rating based on score
 */
const getScoreRating = (score: number): 'good' | 'needs-improvement' | 'poor' => {
  if (score >= 90) return 'good';
  if (score >= 50) return 'needs-improvement';
  return 'poor';
};

/**
 * Hook for Lighthouse-style performance monitoring
 */
export const useLighthouseMonitoring = (
  options: UseLighthouseMonitoringOptions = {}
): UseLighthouseMonitoringReturn => {
  const {
    autoMeasure = true,
    storageKey = 'history',
    maxHistory = 30,
  } = options;

  const fullStorageKey = `${STORAGE_KEY_PREFIX}${storageKey}`;
  const [currentReport, setCurrentReport] = useState<LighthouseReport | null>(null);
  const [history, setHistory] = useState<LighthouseReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasAutoMeasured = useRef(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(fullStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as LighthouseReport[];
        setHistory(parsed);
        if (parsed.length > 0) {
          setCurrentReport(parsed[parsed.length - 1]);
        }
      }
    } catch (error) {
      console.warn('Failed to load Lighthouse history:', error);
    }
  }, [fullStorageKey]);

  // Measure Core Web Vitals
  const measureMetrics = useCallback(async (): Promise<LighthouseMetrics> => {
    const metrics: LighthouseMetrics = {
      fcp: 0,
      lcp: 0,
      cls: 0,
      fid: 0,
      tbt: 0,
      tti: 0,
      speedIndex: 0,
      totalByteWeight: 0,
    };

    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      metrics.tti = navigation.domInteractive - navigation.startTime;
    }

    // Get paint timing
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
    if (fcpEntry) {
      metrics.fcp = fcpEntry.startTime;
    }

    // Approximate LCP using largest resource or FCP * 1.5
    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const largestResource = resourceEntries
      .filter(r => r.initiatorType === 'img' || r.initiatorType === 'video')
      .sort((a, b) => b.responseEnd - a.responseEnd)[0];
    
    if (largestResource) {
      metrics.lcp = largestResource.responseEnd;
    } else {
      metrics.lcp = metrics.fcp * 1.5;
    }

    // Approximate Speed Index (FCP + (LCP - FCP) / 2)
    metrics.speedIndex = metrics.fcp + (metrics.lcp - metrics.fcp) / 2;

    // Get CLS from LayoutShift entries if available
    try {
      const layoutShifts = performance.getEntriesByType('layout-shift') as (PerformanceEntry & { value: number; hadRecentInput: boolean })[];
      metrics.cls = layoutShifts
        .filter(entry => !entry.hadRecentInput)
        .reduce((sum, entry) => sum + entry.value, 0);
    } catch {
      metrics.cls = 0;
    }

    // Approximate TBT from long tasks
    try {
      const longTasks = performance.getEntriesByType('longtask') as PerformanceEntry[];
      metrics.tbt = longTasks.reduce((sum, task) => {
        const blockingTime = Math.max(0, task.duration - 50);
        return sum + blockingTime;
      }, 0);
    } catch {
      // Long task API not available, approximate from TTI
      metrics.tbt = Math.max(0, metrics.tti - 3800) * 0.3;
    }

    // Approximate FID (use first long task duration or 0)
    try {
      const firstLongTask = performance.getEntriesByType('longtask')[0];
      metrics.fid = firstLongTask ? Math.min(firstLongTask.duration, 300) : 0;
    } catch {
      metrics.fid = 0;
    }

    // Calculate total byte weight
    metrics.totalByteWeight = resourceEntries.reduce((sum, r) => {
      return sum + (r.transferSize || 0);
    }, 0);

    return metrics;
  }, []);

  // Calculate scores from metrics
  const calculateScores = useCallback((metrics: LighthouseMetrics): LighthouseScores => {
    const fcpScore = calculateMetricScore(metrics.fcp, THRESHOLDS.fcp);
    const lcpScore = calculateMetricScore(metrics.lcp, THRESHOLDS.lcp);
    const clsScore = calculateMetricScore(metrics.cls, THRESHOLDS.cls);
    const tbtScore = calculateMetricScore(metrics.tbt, THRESHOLDS.tbt);
    const speedIndexScore = calculateMetricScore(metrics.speedIndex, THRESHOLDS.speedIndex);

    // Weighted performance score
    const performance = Math.round(
      fcpScore * WEIGHTS.fcp +
      lcpScore * WEIGHTS.lcp +
      clsScore * WEIGHTS.cls +
      tbtScore * WEIGHTS.tbt +
      speedIndexScore * WEIGHTS.speedIndex
    );

    return {
      performance,
      fcp: Math.round(fcpScore),
      lcp: Math.round(lcpScore),
      cls: Math.round(clsScore),
      tbt: Math.round(tbtScore),
      speedIndex: Math.round(speedIndexScore),
    };
  }, []);

  // Generate audits from metrics
  const generateAudits = useCallback((metrics: LighthouseMetrics, scores: LighthouseScores): LighthouseAudit[] => {
    return [
      {
        id: 'first-contentful-paint',
        title: 'First Contentful Paint',
        score: scores.fcp,
        value: metrics.fcp,
        unit: 'ms',
        rating: getScoreRating(scores.fcp),
      },
      {
        id: 'largest-contentful-paint',
        title: 'Largest Contentful Paint',
        score: scores.lcp,
        value: metrics.lcp,
        unit: 'ms',
        rating: getScoreRating(scores.lcp),
      },
      {
        id: 'cumulative-layout-shift',
        title: 'Cumulative Layout Shift',
        score: scores.cls,
        value: metrics.cls,
        unit: '',
        rating: getScoreRating(scores.cls),
      },
      {
        id: 'total-blocking-time',
        title: 'Total Blocking Time',
        score: scores.tbt,
        value: metrics.tbt,
        unit: 'ms',
        rating: getScoreRating(scores.tbt),
      },
      {
        id: 'speed-index',
        title: 'Speed Index',
        score: scores.speedIndex,
        value: metrics.speedIndex,
        unit: 'ms',
        rating: getScoreRating(scores.speedIndex),
      },
      {
        id: 'time-to-interactive',
        title: 'Time to Interactive',
        score: calculateMetricScore(metrics.tti, THRESHOLDS.tti),
        value: metrics.tti,
        unit: 'ms',
        rating: getScoreRating(calculateMetricScore(metrics.tti, THRESHOLDS.tti)),
      },
    ];
  }, []);

  // Run a full audit
  const runAudit = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Wait a bit for metrics to stabilize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const metrics = await measureMetrics();
      const scores = calculateScores(metrics);
      const audits = generateAudits(metrics, scores);

      const report: LighthouseReport = {
        scores,
        audits,
        metrics,
        timestamp: Date.now(),
      };

      setCurrentReport(report);
      
      // Update history
      setHistory(prev => {
        const updated = [...prev, report].slice(-maxHistory);
        try {
          localStorage.setItem(fullStorageKey, JSON.stringify(updated));
        } catch (error) {
          console.warn('Failed to save Lighthouse history:', error);
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [measureMetrics, calculateScores, generateAudits, maxHistory, fullStorageKey]);

  // Auto-measure on mount
  useEffect(() => {
    if (autoMeasure && !hasAutoMeasured.current) {
      hasAutoMeasured.current = true;
      // Wait for page to fully load
      if (document.readyState === 'complete') {
        runAudit();
      } else {
        window.addEventListener('load', () => runAudit(), { once: true });
      }
    }
  }, [autoMeasure, runAudit]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentReport(null);
    try {
      localStorage.removeItem(fullStorageKey);
    } catch (error) {
      console.warn('Failed to clear Lighthouse history:', error);
    }
  }, [fullStorageKey]);

  const getOverallRating = useCallback((): 'good' | 'needs-improvement' | 'poor' => {
    if (!currentReport) return 'needs-improvement';
    return getScoreRating(currentReport.scores.performance);
  }, [currentReport]);

  return {
    currentReport,
    history,
    isLoading,
    runAudit,
    clearHistory,
    getScoreRating,
    getOverallRating,
  };
};
