// Hook for managing time offset with periodic updates
import { useState, useEffect, useCallback } from 'react';
import { formatRelativeTime } from '@/utils/timeFormatters';

export interface UseTimeOffsetOptions {
  /** Update interval in milliseconds (default: 30000 = 30 seconds) */
  intervalMs?: number;
  /** Initial offset value (default: 0) */
  initialOffset?: number;
  /** Whether to start the timer automatically (default: true) */
  autoStart?: boolean;
}

export interface UseTimeOffsetReturn {
  /** Current time offset value */
  timeOffset: number;
  /** Get display time formatted from base minutes + offset */
  getDisplayTime: (baseMinutes: number) => string;
  /** Manually increment the offset */
  incrementOffset: () => void;
  /** Reset the offset to initial value */
  resetOffset: () => void;
  /** Set a specific offset value */
  setTimeOffset: (value: number) => void;
  /** Whether the timer is currently running */
  isRunning: boolean;
  /** Start the timer */
  start: () => void;
  /** Stop the timer */
  stop: () => void;
}

/**
 * Hook to manage time offset with automatic periodic updates
 * Useful for displaying relative timestamps that update over time
 */
export const useTimeOffset = (
  options: UseTimeOffsetOptions = {}
): UseTimeOffsetReturn => {
  const {
    intervalMs = 30000,
    initialOffset = 0,
    autoStart = true,
  } = options;

  const [timeOffset, setTimeOffset] = useState(initialOffset);
  const [isRunning, setIsRunning] = useState(autoStart);

  // Periodic update effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeOffset(prev => prev + 1);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isRunning, intervalMs]);

  // Get formatted display time
  const getDisplayTime = useCallback((baseMinutes: number) => {
    return formatRelativeTime(baseMinutes + timeOffset);
  }, [timeOffset]);

  // Manually increment offset
  const incrementOffset = useCallback(() => {
    setTimeOffset(prev => prev + 1);
  }, []);

  // Reset to initial value
  const resetOffset = useCallback(() => {
    setTimeOffset(initialOffset);
  }, [initialOffset]);

  // Start the timer
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Stop the timer
  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  return {
    timeOffset,
    getDisplayTime,
    incrementOffset,
    resetOffset,
    setTimeOffset,
    isRunning,
    start,
    stop,
  };
};
