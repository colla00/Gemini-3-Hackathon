// Hook for tracking metric history over time for sparkline visualization
import { useState, useEffect, useCallback, useRef } from 'react';

export interface MetricDataPoint {
  timestamp: number;
  value: number;
}

export interface MetricHistory {
  avgRenderTime: MetricDataPoint[];
  avgInteractionTime: MetricDataPoint[];
  pageLoad: MetricDataPoint[];
  fcp: MetricDataPoint[];
  tti: MetricDataPoint[];
  memoryUsage: MetricDataPoint[];
}

export interface UseMetricHistoryOptions {
  /** Maximum data points to keep (default: 60) */
  maxDataPoints?: number;
  /** Sample interval in ms (default: 1000) */
  sampleInterval?: number;
  /** Storage key for persistence (default: 'metric-history') */
  storageKey?: string;
  /** Enable persistence (default: false) */
  persist?: boolean;
}

export interface UseMetricHistoryReturn {
  history: MetricHistory;
  addDataPoint: (metric: keyof MetricHistory, value: number) => void;
  clearHistory: () => void;
  getSparklineData: (metric: keyof MetricHistory) => number[];
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

const STORAGE_KEY_PREFIX = 'lovable-metric-history-';

const createEmptyHistory = (): MetricHistory => ({
  avgRenderTime: [],
  avgInteractionTime: [],
  pageLoad: [],
  fcp: [],
  tti: [],
  memoryUsage: [],
});

/**
 * Hook for tracking and storing metric history for sparkline visualization
 */
export const useMetricHistory = (
  options: UseMetricHistoryOptions = {}
): UseMetricHistoryReturn => {
  const {
    maxDataPoints = 60,
    storageKey = 'default',
    persist = false,
  } = options;

  const fullStorageKey = `${STORAGE_KEY_PREFIX}${storageKey}`;
  const [history, setHistory] = useState<MetricHistory>(createEmptyHistory);
  const [isRecording, setIsRecording] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    if (!persist) return;
    
    try {
      const stored = localStorage.getItem(fullStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as MetricHistory;
        setHistory(parsed);
      }
    } catch (error) {
      console.warn('Failed to load metric history:', error);
    }
  }, [fullStorageKey, persist]);

  // Save to localStorage when history changes
  useEffect(() => {
    if (!persist) return;
    
    try {
      localStorage.setItem(fullStorageKey, JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save metric history:', error);
    }
  }, [history, fullStorageKey, persist]);

  const addDataPoint = useCallback((metric: keyof MetricHistory, value: number) => {
    if (!isRecording) return;
    
    const dataPoint: MetricDataPoint = {
      timestamp: Date.now(),
      value,
    };

    setHistory(prev => ({
      ...prev,
      [metric]: [...prev[metric], dataPoint].slice(-maxDataPoints),
    }));
  }, [isRecording, maxDataPoints]);

  const clearHistory = useCallback(() => {
    setHistory(createEmptyHistory());
    if (persist) {
      try {
        localStorage.removeItem(fullStorageKey);
      } catch (error) {
        console.warn('Failed to clear metric history:', error);
      }
    }
  }, [fullStorageKey, persist]);

  const getSparklineData = useCallback((metric: keyof MetricHistory): number[] => {
    return history[metric].map(dp => dp.value);
  }, [history]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  return {
    history,
    addDataPoint,
    clearHistory,
    getSparklineData,
    isRecording,
    startRecording,
    stopRecording,
  };
};
