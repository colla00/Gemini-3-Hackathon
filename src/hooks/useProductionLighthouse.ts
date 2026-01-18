// Hook for real Lighthouse CI scores via PageSpeed Insights API
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductionLighthouseScores {
  performance: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
}

export interface ProductionLighthouseMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  tbt: number;
  speedIndex: number;
  tti: number;
}

export interface ProductionLighthouseAudit {
  id: string;
  title: string;
  score: number;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
}

export interface ProductionLighthouseReport {
  scores: ProductionLighthouseScores;
  audits: ProductionLighthouseAudit[];
  metrics: ProductionLighthouseMetrics;
  fetchTime: string;
  finalUrl: string;
  strategy: 'mobile' | 'desktop';
  timestamp: number;
}

export interface UseProductionLighthouseOptions {
  /** Default URL to audit (defaults to current origin) */
  defaultUrl?: string;
  /** Default strategy (default: 'mobile') */
  defaultStrategy?: 'mobile' | 'desktop';
  /** Categories to include (default: ['performance']) */
  categories?: string[];
  /** Storage key for history (default: 'prod-lighthouse') */
  storageKey?: string;
  /** Max history entries (default: 20) */
  maxHistory?: number;
}

export interface UseProductionLighthouseReturn {
  currentReport: ProductionLighthouseReport | null;
  history: ProductionLighthouseReport[];
  isLoading: boolean;
  error: string | null;
  runAudit: (url?: string, strategy?: 'mobile' | 'desktop') => Promise<void>;
  clearHistory: () => void;
  getScoreRating: (score: number) => 'good' | 'needs-improvement' | 'poor';
}

const STORAGE_KEY_PREFIX = 'lovable-prod-lighthouse-';

/**
 * Hook for fetching real Lighthouse scores from PageSpeed Insights API
 */
export const useProductionLighthouse = (
  options: UseProductionLighthouseOptions = {}
): UseProductionLighthouseReturn => {
  const {
    defaultUrl = typeof window !== 'undefined' ? window.location.origin : '',
    defaultStrategy = 'mobile',
    categories = ['performance'],
    storageKey = 'history',
    maxHistory = 20,
  } = options;

  const fullStorageKey = `${STORAGE_KEY_PREFIX}${storageKey}`;
  const [currentReport, setCurrentReport] = useState<ProductionLighthouseReport | null>(() => {
    try {
      const stored = localStorage.getItem(fullStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as ProductionLighthouseReport[];
        return parsed.length > 0 ? parsed[parsed.length - 1] : null;
      }
    } catch {
      // Ignore
    }
    return null;
  });
  
  const [history, setHistory] = useState<ProductionLighthouseReport[]>(() => {
    try {
      const stored = localStorage.getItem(fullStorageKey);
      if (stored) {
        return JSON.parse(stored) as ProductionLighthouseReport[];
      }
    } catch {
      // Ignore
    }
    return [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getScoreRating = useCallback((score: number): 'good' | 'needs-improvement' | 'poor' => {
    if (score >= 90) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  }, []);

  const runAudit = useCallback(async (
    url: string = defaultUrl,
    strategy: 'mobile' | 'desktop' = defaultStrategy
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('pagespeed-audit', {
        body: { url, strategy, categories },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const report: ProductionLighthouseReport = {
        ...data,
        strategy,
        timestamp: Date.now(),
      };

      setCurrentReport(report);
      
      // Update history
      setHistory(prev => {
        const updated = [...prev, report].slice(-maxHistory);
        try {
          localStorage.setItem(fullStorageKey, JSON.stringify(updated));
        } catch (storageError) {
          console.warn('Failed to save Lighthouse history:', storageError);
        }
        return updated;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to run audit';
      setError(message);
      console.error('Lighthouse audit error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [defaultUrl, defaultStrategy, categories, maxHistory, fullStorageKey]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentReport(null);
    try {
      localStorage.removeItem(fullStorageKey);
    } catch {
      // Ignore
    }
  }, [fullStorageKey]);

  return {
    currentReport,
    history,
    isLoading,
    error,
    runAudit,
    clearHistory,
    getScoreRating,
  };
};
