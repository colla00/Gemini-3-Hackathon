import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SlideType } from '@/components/presentation/PresentationSlide';

interface SlideAnalyticsData {
  slideId: string;
  slideTitle: string;
  timeSpentSeconds: number;
  viewCount: number;
  isPatentSlide: boolean;
}

interface UseSlideAnalyticsReturn {
  trackSlideView: (slideId: SlideType, slideTitle: string) => void;
  getAnalytics: () => Promise<SlideAnalyticsData[]>;
  currentSlideTime: number;
  isTracking: boolean;
}

const PATENT_SLIDE_PREFIXES = ['patent-'];

export const useSlideAnalytics = (sessionId: string | null): UseSlideAnalyticsReturn => {
  const [currentSlideTime, setCurrentSlideTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const currentSlideRef = useRef<{ id: string; title: string; startTime: number } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isPatentSlide = (slideId: string): boolean => {
    return PATENT_SLIDE_PREFIXES.some(prefix => slideId.startsWith(prefix));
  };

  const saveSlideTime = useCallback(async () => {
    if (!sessionId || !currentSlideRef.current) return;

    const { id, title, startTime } = currentSlideRef.current;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    if (timeSpent < 1) return;

    try {
      // Use upsert to handle both insert and update
      const { error } = await supabase
        .from('slide_analytics')
        .upsert(
          {
            session_id: sessionId,
            slide_id: id,
            slide_title: title,
            time_spent_seconds: timeSpent,
            is_patent_slide: isPatentSlide(id),
            last_viewed_at: new Date().toISOString(),
          },
          {
            onConflict: 'session_id,slide_id',
            ignoreDuplicates: false,
          }
        );

      if (error) {
        console.error('Error saving slide analytics:', error);
      }
    } catch (err) {
      console.error('Failed to save slide analytics:', err);
    }
  }, [sessionId]);

  const trackSlideView = useCallback((slideId: SlideType, slideTitle: string) => {
    // Save previous slide time
    if (currentSlideRef.current) {
      saveSlideTime();
    }

    // Start tracking new slide
    currentSlideRef.current = {
      id: slideId,
      title: slideTitle,
      startTime: Date.now(),
    };
    setCurrentSlideTime(0);
    setIsTracking(true);

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Update current time every second
    intervalRef.current = setInterval(() => {
      if (currentSlideRef.current) {
        const elapsed = Math.floor((Date.now() - currentSlideRef.current.startTime) / 1000);
        setCurrentSlideTime(elapsed);
      }
    }, 1000);

    // Record view in database
    if (sessionId) {
      supabase
        .from('slide_analytics')
        .upsert(
          {
            session_id: sessionId,
            slide_id: slideId,
            slide_title: slideTitle,
            is_patent_slide: isPatentSlide(slideId),
            first_viewed_at: new Date().toISOString(),
            last_viewed_at: new Date().toISOString(),
            view_count: 1,
            time_spent_seconds: 0,
          },
          {
            onConflict: 'session_id,slide_id',
          }
        )
        .then(({ error }) => {
          if (error) console.error('Error recording slide view:', error);
        });
    }
  }, [sessionId, saveSlideTime]);

  const getAnalytics = useCallback(async (): Promise<SlideAnalyticsData[]> => {
    if (!sessionId) return [];

    try {
      const { data, error } = await supabase
        .from('slide_analytics')
        .select('*')
        .eq('session_id', sessionId)
        .order('time_spent_seconds', { ascending: false });

      if (error) {
        console.error('Error fetching analytics:', error);
        return [];
      }

      return (data || []).map(row => ({
        slideId: row.slide_id,
        slideTitle: row.slide_title || row.slide_id,
        timeSpentSeconds: row.time_spent_seconds,
        viewCount: row.view_count,
        isPatentSlide: row.is_patent_slide || false,
      }));
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      return [];
    }
  }, [sessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      saveSlideTime();
    };
  }, [saveSlideTime]);

  // Save periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveSlideTime();
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [saveSlideTime]);

  return {
    trackSlideView,
    getAnalytics,
    currentSlideTime,
    isTracking,
  };
};
