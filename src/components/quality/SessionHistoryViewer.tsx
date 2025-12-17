import { useState, useEffect } from 'react';
import { 
  History, X, Clock, Calendar, Activity, 
  ChevronDown, ChevronRight, Trash2, Eye, Mail, Globe, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type SessionData } from '@/hooks/useSessionTracking';

interface SessionHistoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'patent_evidence_sessions';

const formatDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const durationMs = end - start;
  
  if (durationMs < 60000) {
    return `${Math.round(durationMs / 1000)}s`;
  } else if (durationMs < 3600000) {
    return `${Math.round(durationMs / 60000)}m`;
  } else {
    const hours = Math.floor(durationMs / 3600000);
    const minutes = Math.round((durationMs % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }
};

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'session_start': return 'text-risk-low';
    case 'session_end': return 'text-risk-high';
    case 'page_view': return 'text-primary';
    case 'feature_use': return 'text-risk-medium';
    case 'interaction': return 'text-muted-foreground';
    default: return 'text-muted-foreground';
  }
};

export const SessionHistoryViewer = ({ isOpen, onClose }: SessionHistoryViewerProps) => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data: SessionData[] = stored ? JSON.parse(stored) : [];
      // Sort by most recent first
      data.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      setSessions(data);
    } catch {
      setSessions([]);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    const now = new Date();
    
    if (filter === 'today') {
      return sessionDate.toDateString() === now.toDateString();
    } else if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return sessionDate >= weekAgo;
    }
    return true;
  });
  const clearAllSessions = () => {
    if (confirm('Are you sure you want to clear all session history? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      setSessions([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border/50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Session History</h2>
              <p className="text-xs text-muted-foreground">Patent evidence tracking log</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-border/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filter:</span>
            {(['all', 'today', 'week'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1 rounded text-xs font-medium transition-colors",
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {f === 'all' ? 'All Time' : f === 'today' ? 'Today' : 'This Week'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAllSessions}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-risk-high/10 text-risk-high text-xs font-medium hover:bg-risk-high/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-3 grid grid-cols-4 gap-4 border-b border-border/30 bg-secondary/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{sessions.length}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {sessions.reduce((acc, s) => acc + s.events.length, 0)}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase">Total Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{filteredSessions.length}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Filtered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {sessions.length > 0 ? new Date(sessions[0].startTime).toLocaleDateString() : '-'}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase">Latest Session</div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <History className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">No sessions recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <div
                  key={session.sessionId}
                  className="border border-border/50 rounded-xl overflow-hidden bg-secondary/30"
                >
                  {/* Session Header */}
                  <button
                    onClick={() => setExpandedSession(
                      expandedSession === session.sessionId ? null : session.sessionId
                    )}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {expandedSession === session.sessionId ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-semibold text-primary">
                            {session.sessionId}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                            {session.events.length} events
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(session.startTime).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(session.startTime).toLocaleTimeString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {formatDuration(session.startTime, session.lastActivity)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {session.deviceInfo.screenResolution}
                    </div>
                  </button>

                  {/* Expanded Events */}
                  {expandedSession === session.sessionId && (
                    <div className="border-t border-border/30 px-4 py-3 bg-background/50">
                      {/* Identity Information */}
                      {session.identityInfo && (session.identityInfo.email || session.identityInfo.ipAddress) && (
                        <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="text-xs font-semibold text-primary mb-2">Identity Information</div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            {session.identityInfo.email && (
                              <div className="flex items-center gap-2 text-foreground">
                                <Mail className="w-3 h-3 text-primary" />
                                <span>{session.identityInfo.email}</span>
                              </div>
                            )}
                            {session.identityInfo.ipAddress && (
                              <div className="flex items-center gap-2 text-foreground">
                                <Globe className="w-3 h-3 text-primary" />
                                <span>{session.identityInfo.ipAddress}</span>
                              </div>
                            )}
                            {session.identityInfo.ipLocation && (
                              <div className="flex items-center gap-2 text-foreground">
                                <MapPin className="w-3 h-3 text-primary" />
                                <span>{session.identityInfo.ipLocation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        Event Timeline
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {session.events.map((event, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 text-xs py-1.5 border-l-2 border-border/50 pl-3"
                          >
                            <span className="text-muted-foreground font-mono whitespace-nowrap">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                            <span className={cn("font-medium uppercase", getEventTypeColor(event.type))}>
                              [{event.type.replace('_', ' ')}]
                            </span>
                            <span className="text-foreground flex-1">{event.details}</span>
                            {event.route && (
                              <span className="text-muted-foreground">{event.route}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border/30 bg-secondary/30 text-center">
          <p className="text-[10px] text-muted-foreground">
            All session data is stored locally for patent documentation purposes
          </p>
        </div>
      </div>
    </div>
  );
};

// Button to open session history
interface SessionHistoryButtonProps {
  onClick: () => void;
}

export const SessionHistoryButton = ({ onClick }: SessionHistoryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground text-[10px] font-medium transition-colors"
    >
      <History className="w-3 h-3" />
      Session History
    </button>
  );
};
