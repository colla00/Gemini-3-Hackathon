import { useState, useEffect, useCallback, useRef } from 'react';

interface SyncState {
  currentSlide: string;
  isLive: boolean;
  elapsedMinutes: number;
  timestamp: number;
}

const getInitialState = (isPresenter: boolean): SyncState => {
  // For audience, try to restore from localStorage immediately
  if (!isPresenter) {
    try {
      const stored = localStorage.getItem('presenter-sync');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
  }
  return {
    currentSlide: 'title',
    isLive: true,
    elapsedMinutes: 0,
    timestamp: Date.now(),
  };
};

export const usePresenterSync = (isPresenter: boolean = true) => {
  const [syncState, setSyncState] = useState<SyncState>(() => getInitialState(isPresenter));
  const broadcastChannel = useRef<BroadcastChannel | null>(null);
  const audienceWindow = useRef<Window | null>(null);

  // Initialize BroadcastChannel for cross-window communication
  useEffect(() => {
    broadcastChannel.current = new BroadcastChannel('presenter-sync');

    broadcastChannel.current.onmessage = (event) => {
      if (!isPresenter) {
        // Audience receives updates
        console.log('[AudienceSync] Received broadcast:', event.data);
        setSyncState(event.data);
      }
    };

    // Also listen to localStorage for fallback (works across tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'presenter-sync' && !isPresenter && e.newValue) {
        try {
          console.log('[AudienceSync] Received localStorage update');
          setSyncState(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // For audience: poll localStorage as backup (handles same-origin popups)
    let pollInterval: NodeJS.Timeout | undefined;
    if (!isPresenter) {
      pollInterval = setInterval(() => {
        try {
          const stored = localStorage.getItem('presenter-sync');
          if (stored) {
            const parsed = JSON.parse(stored);
            // Only update if timestamp is newer
            setSyncState(prev => {
              if (parsed.timestamp > prev.timestamp) {
                console.log('[AudienceSync] Poll detected update:', parsed.currentSlide);
                return parsed;
              }
              return prev;
            });
          }
        } catch {}
      }, 500);
    }

    return () => {
      broadcastChannel.current?.close();
      window.removeEventListener('storage', handleStorage);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isPresenter]);

  // Presenter broadcasts updates
  const broadcast = useCallback((updates: Partial<SyncState>) => {
    if (!isPresenter) return;

    const newState = {
      ...syncState,
      ...updates,
      timestamp: Date.now(),
    };
    setSyncState(newState);
    
    // Broadcast via BroadcastChannel
    broadcastChannel.current?.postMessage(newState);
    
    // Also update localStorage for fallback
    localStorage.setItem('presenter-sync', JSON.stringify(newState));
    console.log('[PresenterSync] Broadcast:', newState.currentSlide);
  }, [isPresenter, syncState]);

  // Open audience window
  const openAudienceWindow = useCallback(() => {
    const url = `${window.location.origin}/presentation?mode=audience`;
    audienceWindow.current = window.open(
      url,
      'audience-view',
      'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
    );
    
    // Initial sync after window loads
    setTimeout(() => {
      broadcast({ currentSlide: syncState.currentSlide });
    }, 1500);

    return audienceWindow.current;
  }, [broadcast, syncState.currentSlide]);

  // Close audience window
  const closeAudienceWindow = useCallback(() => {
    audienceWindow.current?.close();
    audienceWindow.current = null;
  }, []);

  // Check if audience window is open
  const isAudienceWindowOpen = useCallback(() => {
    return audienceWindow.current && !audienceWindow.current.closed;
  }, []);

  return {
    syncState,
    broadcast,
    openAudienceWindow,
    closeAudienceWindow,
    isAudienceWindowOpen,
  };
};
