import { useState, useEffect, useCallback, createContext, useContext } from 'react';

export interface SessionEvent {
  timestamp: string;
  type: 'session_start' | 'page_view' | 'interaction' | 'feature_use' | 'session_end';
  details: string;
  route?: string;
}

export interface SessionData {
  sessionId: string;
  startTime: string;
  lastActivity: string;
  events: SessionEvent[];
  deviceInfo: {
    userAgent: string;
    screenResolution: string;
    timezone: string;
  };
}

// Global session tracking context for use across components
interface SessionContextType {
  logInteraction: (details: string) => void;
  logFeatureUse: (feature: string) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  return context;
};

export { SessionContext };

const STORAGE_KEY = 'patent_evidence_sessions';
const CURRENT_SESSION_KEY = 'current_session_id';

const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `SES-${timestamp}-${random}`.toUpperCase();
};

const getStoredSessions = (): SessionData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveSession = (session: SessionData) => {
  try {
    const sessions = getStoredSessions();
    const existingIndex = sessions.findIndex(s => s.sessionId === session.sessionId);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    // Keep last 100 sessions for evidence
    const trimmed = sessions.slice(-100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Failed to save session data:', e);
  }
};

export const useSessionTracking = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize session
  useEffect(() => {
    const existingSessionId = sessionStorage.getItem(CURRENT_SESSION_KEY);
    const sessions = getStoredSessions();
    const existingSession = existingSessionId 
      ? sessions.find(s => s.sessionId === existingSessionId)
      : null;

    if (existingSession) {
      setSession(existingSession);
    } else {
      const newSession: SessionData = {
        sessionId: generateSessionId(),
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        events: [{
          timestamp: new Date().toISOString(),
          type: 'session_start',
          details: 'Session initiated',
          route: window.location.pathname
        }],
        deviceInfo: {
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      
      sessionStorage.setItem(CURRENT_SESSION_KEY, newSession.sessionId);
      saveSession(newSession);
      setSession(newSession);
    }
    
    setIsInitialized(true);
  }, []);

  // Track page views
  useEffect(() => {
    if (!session || !isInitialized) return;

    const handleRouteChange = () => {
      logEvent('page_view', `Viewed ${window.location.pathname}`, window.location.pathname);
    };

    // Log initial page view
    handleRouteChange();

    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [isInitialized, session?.sessionId]);

  // Update last activity periodically
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      setSession(prev => {
        if (!prev) return prev;
        const updated = { ...prev, lastActivity: new Date().toISOString() };
        saveSession(updated);
        return updated;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [session?.sessionId]);

  // Log session end on unload
  useEffect(() => {
    if (!session) return;

    const handleUnload = () => {
      const endEvent: SessionEvent = {
        timestamp: new Date().toISOString(),
        type: 'session_end',
        details: 'Session ended',
        route: window.location.pathname
      };
      
      const updated = {
        ...session,
        lastActivity: new Date().toISOString(),
        events: [...session.events, endEvent]
      };
      
      // Use sendBeacon for reliable logging on page unload
      const blob = new Blob([JSON.stringify(updated)], { type: 'application/json' });
      navigator.sendBeacon?.('data:application/json', blob);
      
      // Also try localStorage as backup
      saveSession(updated);
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [session]);

  const logEvent = useCallback((
    type: SessionEvent['type'],
    details: string,
    route?: string
  ) => {
    setSession(prev => {
      if (!prev) return prev;
      
      const newEvent: SessionEvent = {
        timestamp: new Date().toISOString(),
        type,
        details,
        route: route || window.location.pathname
      };
      
      const updated = {
        ...prev,
        lastActivity: new Date().toISOString(),
        events: [...prev.events, newEvent]
      };
      
      saveSession(updated);
      return updated;
    });
  }, []);

  const logInteraction = useCallback((details: string) => {
    logEvent('interaction', details);
  }, [logEvent]);

  const logFeatureUse = useCallback((feature: string) => {
    logEvent('feature_use', `Used feature: ${feature}`);
  }, [logEvent]);

  const getAllSessions = useCallback((): SessionData[] => {
    return getStoredSessions();
  }, []);

  const exportEvidence = useCallback((): string => {
    const sessions = getStoredSessions();
    const evidence = {
      exportedAt: new Date().toISOString(),
      totalSessions: sessions.length,
      sessions: sessions.map(s => ({
        ...s,
        eventCount: s.events.length,
        duration: s.events.length > 1 
          ? `${Math.round((new Date(s.lastActivity).getTime() - new Date(s.startTime).getTime()) / 1000 / 60)} minutes`
          : 'N/A'
      }))
    };
    return JSON.stringify(evidence, null, 2);
  }, []);

  return {
    session,
    sessionId: session?.sessionId || null,
    startTime: session?.startTime || null,
    eventCount: session?.events.length || 0,
    logInteraction,
    logFeatureUse,
    getAllSessions,
    exportEvidence
  };
};
