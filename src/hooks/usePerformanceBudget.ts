import { useEffect, useCallback } from 'react';
import { performanceMonitor, type BudgetViolation } from '@/lib/performanceMonitor';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to enable performance budget alerts with toast notifications
 */
export function usePerformanceBudget(enabled: boolean = false) {
  const { toast } = useToast();

  const handleViolation = useCallback((violation: BudgetViolation) => {
    const { metric, budget, exceeded } = violation;
    
    // Format the metric name for display
    const displayName = metric.name
      .replace(/-/g, ' ')
      .replace(/^Dashboard /, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    toast({
      title: '⚠️ Performance Budget Exceeded',
      description: `${displayName}: ${metric.value.toFixed(0)}ms (budget: ${budget}ms, +${exceeded.toFixed(0)}ms)`,
      variant: 'destructive',
      duration: 3000,
    });
  }, [toast]);

  useEffect(() => {
    performanceMonitor.enableBudgetAlerts(enabled);
    
    if (enabled) {
      const unsubscribe = performanceMonitor.onBudgetViolation(handleViolation);
      return () => {
        unsubscribe();
        performanceMonitor.enableBudgetAlerts(false);
      };
    }
  }, [enabled, handleViolation]);

  const toggleBudgetAlerts = useCallback((enable: boolean) => {
    performanceMonitor.enableBudgetAlerts(enable);
  }, []);

  return { toggleBudgetAlerts };
}
