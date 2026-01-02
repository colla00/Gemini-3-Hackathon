import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PresentationSession {
  id: string;
  session_key: string;
  started_at: string;
  is_live: boolean;
  slides_completed: number;
}

export const usePresentationSession = () => {
  const [session, setSession] = useState<PresentationSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createSession = useCallback(async (presenterName?: string) => {
    setIsLoading(true);
    
    // Get current user for creator_id (required for RLS - must be admin)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User must be authenticated to create a session');
      setIsLoading(false);
      return null;
    }

    const { data, error } = await supabase
      .from('presentation_sessions')
      .insert({
        presenter_name: presenterName,
        is_live: true,
        creator_id: user.id,
      })
      .select()
      .single();

    if (error) {
      // RLS will reject non-admin users
      console.error('Failed to create session (admin role required):', error.message);
      setIsLoading(false);
      return null;
    }

    if (data) {
      setSession(data);
      // Store session ID in localStorage for viewers
      localStorage.setItem('presentation_session_id', data.id);
    }
    setIsLoading(false);
    return data;
  }, []);

  const joinSession = useCallback(async (sessionKey: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('presentation_sessions')
      .select('*')
      .eq('session_key', sessionKey)
      .eq('is_live', true)
      .single();

    if (!error && data) {
      setSession(data);
      localStorage.setItem('presentation_session_id', data.id);
      
      // Increment audience size
      await supabase
        .from('presentation_sessions')
        .update({ audience_size: (data.audience_size || 0) + 1 })
        .eq('id', data.id);
    }
    setIsLoading(false);
    return data;
  }, []);

  const updateSlideProgress = useCallback(async (slidesCompleted: number) => {
    if (!session) return;
    
    await supabase
      .from('presentation_sessions')
      .update({ slides_completed: slidesCompleted })
      .eq('id', session.id);
  }, [session]);

  const endSession = useCallback(async () => {
    if (!session) return;
    
    await supabase
      .from('presentation_sessions')
      .update({ 
        is_live: false, 
        ended_at: new Date().toISOString() 
      })
      .eq('id', session.id);
    
    setSession(null);
    localStorage.removeItem('presentation_session_id');
  }, [session]);

  const trackViewerAnalytics = useCallback(async (slideId: string, timeOnSlide: number, interactions?: any[]) => {
    if (!session) return;

    const viewerId = localStorage.getItem('viewer_id') || (() => {
      const id = crypto.randomUUID();
      localStorage.setItem('viewer_id', id);
      return id;
    })();

    await supabase.from('viewer_analytics').insert({
      session_id: session.id,
      viewer_id: viewerId,
      slide_id: slideId,
      time_on_slide: timeOnSlide,
      interactions: interactions || [],
      device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    });
  }, [session]);

  // Try to restore session from localStorage on mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('presentation_session_id');
    if (storedSessionId && !session) {
      supabase
        .from('presentation_sessions')
        .select('*')
        .eq('id', storedSessionId)
        .eq('is_live', true)
        .single()
        .then(({ data }) => {
          if (data) setSession(data);
        });
    }
  }, [session]);

  return {
    session,
    isLoading,
    createSession,
    joinSession,
    updateSlideProgress,
    endSession,
    trackViewerAnalytics,
  };
};
