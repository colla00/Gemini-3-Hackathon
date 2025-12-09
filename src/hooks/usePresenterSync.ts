import { useState, useEffect, useCallback, useRef } from 'react';

interface SyncState {
  currentSlide: string;
  isLive: boolean;
  elapsedMinutes: number;
  timestamp: number;
}

const SYNC_CHANNEL = 'nso-presenter-sync';
const STORAGE_KEY = 'presenter-sync';
const POLL_INTERVAL = 300; // Faster polling for reliability

const getInitialState = (isPresenter: boolean): SyncState => {
  // For audience, try to restore from localStorage immediately
  if (!isPresenter) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('[AudienceSync] Restored initial state:', parsed.currentSlide);
        return parsed;
      }
    } catch (e) {
      console.warn('[AudienceSync] Failed to restore state:', e);
    }
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
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const broadcastChannel = useRef<BroadcastChannel | null>(null);
  const audienceWindow = useRef<Window | null>(null);
  const lastBroadcast = useRef<number>(0);

  // Initialize BroadcastChannel for cross-window communication
  useEffect(() => {
    try {
      broadcastChannel.current = new BroadcastChannel(SYNC_CHANNEL);
      console.log(`[${isPresenter ? 'Presenter' : 'Audience'}Sync] BroadcastChannel initialized`);

      broadcastChannel.current.onmessage = (event) => {
        if (!isPresenter) {
          // Audience receives updates
          console.log('[AudienceSync] Received broadcast:', event.data.currentSlide);
          setSyncState(event.data);
          setConnectionStatus('connected');
        }
      };

      broadcastChannel.current.onmessageerror = (e) => {
        console.error('[Sync] BroadcastChannel error:', e);
      };
    } catch (e) {
      console.warn('[Sync] BroadcastChannel not supported, using localStorage only');
    }

    // Also listen to localStorage for fallback (works across tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && !isPresenter && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          console.log('[AudienceSync] Received localStorage update:', parsed.currentSlide);
          setSyncState(parsed);
          setConnectionStatus('connected');
        } catch (err) {
          console.warn('[AudienceSync] Failed to parse storage event:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    // For audience: poll localStorage as backup (handles same-origin popups)
    let pollInterval: NodeJS.Timeout | undefined;
    if (!isPresenter) {
      setConnectionStatus('connecting');
      pollInterval = setInterval(() => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            // Only update if timestamp is newer
            setSyncState(prev => {
              if (parsed.timestamp > prev.timestamp) {
                console.log('[AudienceSync] Poll detected update:', parsed.currentSlide);
                setConnectionStatus('connected');
                return parsed;
              }
              return prev;
            });
          }
        } catch (err) {
          console.warn('[AudienceSync] Poll error:', err);
        }
      }, POLL_INTERVAL);
    }

    return () => {
      broadcastChannel.current?.close();
      window.removeEventListener('storage', handleStorage);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isPresenter]);

  // Presenter broadcasts updates with debouncing
  const broadcast = useCallback((updates: Partial<SyncState>) => {
    if (!isPresenter) return;

    // Debounce rapid updates
    const now = Date.now();
    if (now - lastBroadcast.current < 50) return;
    lastBroadcast.current = now;

    const newState: SyncState = {
      currentSlide: updates.currentSlide ?? syncState.currentSlide,
      isLive: updates.isLive ?? syncState.isLive,
      elapsedMinutes: updates.elapsedMinutes ?? syncState.elapsedMinutes,
      timestamp: now,
    };
    
    setSyncState(newState);
    
    // Broadcast via BroadcastChannel
    try {
      broadcastChannel.current?.postMessage(newState);
    } catch (e) {
      console.warn('[PresenterSync] BroadcastChannel send failed:', e);
    }
    
    // Also update localStorage for fallback
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn('[PresenterSync] localStorage save failed:', e);
    }
    
    console.log('[PresenterSync] Broadcast:', newState.currentSlide);
  }, [isPresenter, syncState]);

  // Open audience window
  const openAudienceWindow = useCallback(() => {
    const url = `${window.location.origin}/presentation?mode=audience`;
    
    // Close existing window first
    if (audienceWindow.current && !audienceWindow.current.closed) {
      audienceWindow.current.close();
    }
    
    audienceWindow.current = window.open(
      url,
      'audience-view',
      'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
    );
    
    // Monitor window status
    const checkWindow = setInterval(() => {
      if (audienceWindow.current?.closed) {
        clearInterval(checkWindow);
        console.log('[PresenterSync] Audience window closed');
      }
    }, 1000);
    
    // Initial sync after window loads
    setTimeout(() => {
      broadcast({ currentSlide: syncState.currentSlide });
      console.log('[PresenterSync] Initial sync sent to audience window');
    }, 1000);

    // Send another sync after a short delay for reliability
    setTimeout(() => {
      broadcast({ currentSlide: syncState.currentSlide });
    }, 2000);

    return audienceWindow.current;
  }, [broadcast, syncState.currentSlide]);

  // Close audience window
  const closeAudienceWindow = useCallback(() => {
    audienceWindow.current?.close();
    audienceWindow.current = null;
  }, []);

  // Check if audience window is open
  const isAudienceWindowOpen = useCallback(() => {
    return !!(audienceWindow.current && !audienceWindow.current.closed);
  }, []);

  // Force sync - useful for manual resync
  const forceSync = useCallback(() => {
    if (isPresenter) {
      broadcast({ currentSlide: syncState.currentSlide, isLive: syncState.isLive });
      console.log('[PresenterSync] Force sync triggered');
    }
  }, [isPresenter, broadcast, syncState]);

  return {
    syncState,
    connectionStatus,
    broadcast,
    openAudienceWindow,
    closeAudienceWindow,
    isAudienceWindowOpen,
    forceSync,
  };
};
