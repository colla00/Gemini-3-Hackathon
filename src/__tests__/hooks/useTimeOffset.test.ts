import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTimeOffset } from '@/hooks/useTimeOffset';

// Mock the time formatters
vi.mock('@/utils/timeFormatters', () => ({
  formatRelativeTime: vi.fn((minutes: number) => {
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `~${minutes}m`;
    return `~${Math.floor(minutes / 60)}h`;
  }),
}));

describe('useTimeOffset', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should have initial offset of 0 by default', () => {
      const { result } = renderHook(() => useTimeOffset());
      
      expect(result.current.timeOffset).toBe(0);
    });

    it('should respect custom initial offset', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ initialOffset: 5 })
      );
      
      expect(result.current.timeOffset).toBe(5);
    });

    it('should be running by default', () => {
      const { result } = renderHook(() => useTimeOffset());
      
      expect(result.current.isRunning).toBe(true);
    });

    it('should not be running when autoStart is false', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ autoStart: false })
      );
      
      expect(result.current.isRunning).toBe(false);
    });
  });

  describe('automatic updates', () => {
    it('should increment offset after interval', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ intervalMs: 1000 })
      );
      
      expect(result.current.timeOffset).toBe(0);
      
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      expect(result.current.timeOffset).toBe(1);
    });

    it('should increment multiple times', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ intervalMs: 1000 })
      );
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(result.current.timeOffset).toBe(3);
    });

    it('should use default 30 second interval', () => {
      const { result } = renderHook(() => useTimeOffset());
      
      act(() => {
        vi.advanceTimersByTime(30000);
      });
      
      expect(result.current.timeOffset).toBe(1);
      
      act(() => {
        vi.advanceTimersByTime(30000);
      });
      
      expect(result.current.timeOffset).toBe(2);
    });

    it('should not update when stopped', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ intervalMs: 1000, autoStart: false })
      );
      
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      
      expect(result.current.timeOffset).toBe(0);
    });
  });

  describe('getDisplayTime', () => {
    it('should format time with offset', () => {
      const { result } = renderHook(() => useTimeOffset());
      
      const displayTime = result.current.getDisplayTime(30);
      
      expect(displayTime).toBe('~30m');
    });

    it('should include offset in calculation', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ initialOffset: 10 })
      );
      
      const displayTime = result.current.getDisplayTime(30);
      
      expect(displayTime).toBe('~40m');
    });

    it('should update as offset changes', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ intervalMs: 1000 })
      );
      
      expect(result.current.getDisplayTime(5)).toBe('~5m');
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(result.current.getDisplayTime(5)).toBe('~8m');
    });
  });

  describe('manual controls', () => {
    it('should increment offset manually', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ autoStart: false })
      );
      
      expect(result.current.timeOffset).toBe(0);
      
      act(() => {
        result.current.incrementOffset();
      });
      
      expect(result.current.timeOffset).toBe(1);
      
      act(() => {
        result.current.incrementOffset();
        result.current.incrementOffset();
      });
      
      expect(result.current.timeOffset).toBe(3);
    });

    it('should reset offset to initial value', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ initialOffset: 5, intervalMs: 1000 })
      );
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(result.current.timeOffset).toBe(8);
      
      act(() => {
        result.current.resetOffset();
      });
      
      expect(result.current.timeOffset).toBe(5);
    });

    it('should set specific offset value', () => {
      const { result } = renderHook(() => useTimeOffset());
      
      act(() => {
        result.current.setTimeOffset(42);
      });
      
      expect(result.current.timeOffset).toBe(42);
    });
  });

  describe('start and stop', () => {
    it('should start the timer', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ autoStart: false, intervalMs: 1000 })
      );
      
      expect(result.current.isRunning).toBe(false);
      
      act(() => {
        result.current.start();
      });
      
      expect(result.current.isRunning).toBe(true);
      
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      expect(result.current.timeOffset).toBe(2);
    });

    it('should stop the timer', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ intervalMs: 1000 })
      );
      
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      expect(result.current.timeOffset).toBe(2);
      
      act(() => {
        result.current.stop();
      });
      
      expect(result.current.isRunning).toBe(false);
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      // Should not have incremented
      expect(result.current.timeOffset).toBe(2);
    });

    it('should resume after stop and start', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ intervalMs: 1000 })
      );
      
      act(() => {
        vi.advanceTimersByTime(2000);
        result.current.stop();
        vi.advanceTimersByTime(3000);
      });
      
      expect(result.current.timeOffset).toBe(2);
      
      act(() => {
        result.current.start();
        vi.advanceTimersByTime(2000);
      });
      
      expect(result.current.timeOffset).toBe(4);
    });
  });

  describe('cleanup', () => {
    it('should clean up interval on unmount', () => {
      const { result, unmount } = renderHook(() => 
        useTimeOffset({ intervalMs: 1000 })
      );
      
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      expect(result.current.timeOffset).toBe(2);
      
      unmount();
      
      // Interval should be cleared, no errors should occur
      act(() => {
        vi.advanceTimersByTime(5000);
      });
    });
  });
});
