import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { performanceMonitor, measureAsync, measureSync } from '@/lib/performanceMonitor';

describe('Performance Monitor', () => {
  beforeEach(() => {
    performanceMonitor.clear();
    performanceMonitor.setEnabled(true);
  });

  afterEach(() => {
    performanceMonitor.clear();
  });

  describe('Mark and Measure', () => {
    it('should record timing between start and end marks', () => {
      performanceMonitor.startMark('test-operation');
      
      // Simulate some work
      const start = performance.now();
      while (performance.now() - start < 10) {
        // busy wait
      }
      
      const duration = performanceMonitor.endMark('test-operation');
      expect(duration).toBeGreaterThan(0);
    });

    it('should return 0 for non-existent marks', () => {
      const duration = performanceMonitor.endMark('non-existent');
      expect(duration).toBe(0);
    });

    it('should not record when disabled', () => {
      performanceMonitor.setEnabled(false);
      performanceMonitor.startMark('disabled-test');
      const duration = performanceMonitor.endMark('disabled-test');
      expect(duration).toBe(0);
    });
  });

  describe('Custom Metrics', () => {
    it('should add and retrieve metrics', () => {
      performanceMonitor.addMetric({
        name: 'test-metric',
        value: 100,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'custom',
      });

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.length).toBe(1);
      expect(metrics[0].name).toBe('test-metric');
      expect(metrics[0].value).toBe(100);
    });

    it('should filter metrics by category', () => {
      performanceMonitor.addMetric({
        name: 'nav-metric',
        value: 50,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'navigation',
      });

      performanceMonitor.addMetric({
        name: 'custom-metric',
        value: 100,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'custom',
      });

      const navMetrics = performanceMonitor.getMetricsByCategory('navigation');
      expect(navMetrics.length).toBe(1);
      expect(navMetrics[0].name).toBe('nav-metric');
    });

    it('should limit metrics to prevent memory issues', () => {
      for (let i = 0; i < 150; i++) {
        performanceMonitor.addMetric({
          name: `metric-${i}`,
          value: i,
          unit: 'ms',
          timestamp: Date.now(),
          category: 'custom',
        });
      }

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Average Duration', () => {
    it('should calculate correct average', () => {
      performanceMonitor.addMetric({
        name: 'avg-test',
        value: 100,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'custom',
      });

      performanceMonitor.addMetric({
        name: 'avg-test',
        value: 200,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'custom',
      });

      const avg = performanceMonitor.getAverageDuration('avg-test');
      expect(avg).toBe(150);
    });

    it('should return 0 for non-existent metrics', () => {
      const avg = performanceMonitor.getAverageDuration('non-existent');
      expect(avg).toBe(0);
    });
  });

  describe('Interaction Recording', () => {
    it('should record interactions', () => {
      performanceMonitor.recordInteraction('button-click', 50);

      const interactions = performanceMonitor.getMetricsByCategory('interaction');
      expect(interactions.length).toBe(1);
      expect(interactions[0].name).toBe('button-click');
      expect(interactions[0].value).toBe(50);
    });
  });

  describe('Report Generation', () => {
    it('should generate a report with all metrics', () => {
      performanceMonitor.addMetric({
        name: 'test',
        value: 100,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'custom',
      });

      const report = performanceMonitor.generateReport();
      expect(report).toHaveProperty('pageLoad');
      expect(report).toHaveProperty('firstContentfulPaint');
      expect(report).toHaveProperty('customMetrics');
      expect(report).toHaveProperty('averages');
      expect(report.customMetrics.length).toBe(1);
    });
  });

  describe('Clear and Disconnect', () => {
    it('should clear all metrics', () => {
      performanceMonitor.addMetric({
        name: 'test',
        value: 100,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'custom',
      });

      performanceMonitor.clear();
      expect(performanceMonitor.getMetrics().length).toBe(0);
    });
  });
});

describe('Measure Utilities', () => {
  beforeEach(() => {
    performanceMonitor.clear();
  });

  describe('measureAsync', () => {
    it('should measure async operation duration', async () => {
      const result = await measureAsync('async-test', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'done';
      });

      expect(result).toBe('done');
      const metrics = performanceMonitor.getMetrics();
      expect(metrics.some(m => m.name === 'async-test')).toBe(true);
    });

    it('should record metric even on error', async () => {
      try {
        await measureAsync('error-test', async () => {
          throw new Error('Test error');
        });
      } catch (e) {
        // Expected
      }

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.some(m => m.name === 'error-test')).toBe(true);
    });
  });

  describe('measureSync', () => {
    it('should measure sync operation duration', () => {
      const result = measureSync('sync-test', () => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) sum += i;
        return sum;
      });

      expect(result).toBe(499500);
      const metrics = performanceMonitor.getMetrics();
      expect(metrics.some(m => m.name === 'sync-test')).toBe(true);
    });
  });
});
