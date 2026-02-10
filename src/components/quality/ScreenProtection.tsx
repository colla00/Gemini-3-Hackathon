import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ShieldAlert, Clock, History, ChevronDown, ChevronUp, Printer } from 'lucide-react';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { SessionHistoryViewer } from './SessionHistoryViewer';

interface ScreenProtectionProps {
  enabled?: boolean;
  watermarkText?: string;
  showDynamicInfo?: boolean;
  /** Disable blur on window blur - useful during auto-walkthrough */
  disableBlurProtection?: boolean;
}

export const ScreenProtection = ({ 
  enabled = true, 
  watermarkText = '5 PATENTS FILED',
  showDynamicInfo = true,
  disableBlurProtection = false 
}: ScreenProtectionProps) => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [showPrintWarning, setShowPrintWarning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());
  const [showHistory, setShowHistory] = useState(false);
  const [trackerCollapsed, setTrackerCollapsed] = useState(true);
  const { session, sessionId, startTime, eventCount, exportEvidence, logInteraction } = useSessionTracking();

  // Update current time every second for live timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Blur on visibility change (tab switch, minimize, etc.)
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      // Only blur on visibility change (tab hidden), not on simple blur
      if (document.hidden && !disableBlurProtection) {
        setIsBlurred(true);
      }
    };

    const handleBlur = () => {
      // Skip blur protection during auto-walkthrough to prevent false triggers
      if (!disableBlurProtection) {
        setIsBlurred(true);
      }
    };

    const handleFocus = () => {
      // Small delay before unblurring for extra protection
      setTimeout(() => setIsBlurred(false), 300);
    };

    // Detect print attempts and show warning overlay
    const handleBeforePrint = () => {
      setShowPrintWarning(true);
      setIsBlurred(true);
      logInteraction('Print attempt blocked');
    };

    const handleAfterPrint = () => {
      setTimeout(() => {
        setShowPrintWarning(false);
        setIsBlurred(false);
      }, 500);
    };

    // Also detect Ctrl+P / Cmd+P keypress to show warning before browser dialog
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setShowPrintWarning(true);
        logInteraction('Print shortcut blocked (Ctrl+P)');
        // Auto-hide after 4 seconds
        setTimeout(() => setShowPrintWarning(false), 4000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, logInteraction]);

  // Prevent right-click context menu on protected content
  useEffect(() => {
    if (!enabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      // Allow context menu only on inputs and textareas
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Blur Overlay when tab loses focus */}
      <div
        className={cn(
          "fixed inset-0 z-[9999] pointer-events-none transition-all duration-300",
          isBlurred 
            ? "backdrop-blur-xl bg-background/80" 
            : "backdrop-blur-0 bg-transparent"
        )}
        style={{ pointerEvents: isBlurred ? 'auto' : 'none' }}
      >
      {isBlurred && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <ShieldAlert className="w-16 h-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Content Protected</h2>
            <p className="text-muted-foreground text-center max-w-md">
              This prototype is protected by 5 U.S. patent applications and proprietary intellectual property. 
              Content is protected when the window is not in focus.
            </p>
            <button
              onClick={() => setIsBlurred(false)}
              className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Click to Continue Viewing
            </button>
          </div>
        )}
      </div>

      {/* Print Warning Overlay */}
      {showPrintWarning && (
        <div className="fixed inset-0 z-[10000] bg-background/95 backdrop-blur-lg flex items-center justify-center animate-fade-in">
          <div className="max-w-md mx-auto text-center p-8 bg-card border border-destructive/30 rounded-2xl shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <Printer className="w-10 h-10 text-destructive" />
              <div className="absolute">
                <div className="w-24 h-1 bg-destructive rotate-45 rounded-full" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Printing Disabled
            </h2>
            <p className="text-muted-foreground mb-4">
              This content is protected intellectual property. Printing, copying, and 
              exporting are not permitted without explicit written authorization.
            </p>
            <div className="p-3 bg-secondary/50 rounded-lg border border-border mb-6">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">© Dr. Alexis Collier</span>
                <br />
                5 U.S. Patent Applications Filed • All Rights Reserved
              </p>
            </div>
            <button
              onClick={() => setShowPrintWarning(false)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Diagonal Watermark Pattern */}
      <div 
        className="fixed inset-0 z-[100] pointer-events-none overflow-hidden print:hidden"
        aria-hidden="true"
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 150px,
              rgba(var(--primary-rgb, 59, 130, 246), 0.03) 150px,
              rgba(var(--primary-rgb, 59, 130, 246), 0.03) 151px
            )`,
          }}
        />
        
        {/* Repeating watermark text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="whitespace-nowrap text-primary/[0.04] font-bold select-none"
            style={{
              fontSize: '120px',
              transform: 'rotate(-35deg)',
              letterSpacing: '0.1em',
            }}
          >
            {Array(5).fill(watermarkText).join('   •   ')}
          </div>
        </div>

        {/* Multiple rows of watermarks */}
        {[-300, -150, 0, 150, 300].map((offset) => (
          <div 
            key={offset}
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `translateY(${offset}px)` }}
          >
            <div 
              className="whitespace-nowrap text-primary/[0.03] font-semibold select-none"
              style={{
                fontSize: '48px',
                transform: 'rotate(-35deg)',
                letterSpacing: '0.15em',
              }}
            >
              {Array(8).fill(watermarkText).join('     ')}
            </div>
          </div>
        ))}
      </div>

      {/* Session Tracking Panel - Top right corner, collapsible */}
      {showDynamicInfo && (
        <div 
          className="fixed top-24 right-4 z-[60] select-none print:hidden"
          aria-hidden="true"
        >
          <div className={cn(
            "bg-background/90 border border-primary/20 rounded-lg backdrop-blur-sm shadow-lg transition-all duration-200",
            trackerCollapsed ? "px-2 py-1.5" : "px-3 py-2"
          )}>
            {/* Header - always visible */}
            <button
              onClick={() => setTrackerCollapsed(!trackerCollapsed)}
              className="flex items-center gap-1.5 w-full pointer-events-auto"
            >
              <Clock className="w-2.5 h-2.5 text-primary/60" />
              <span className="text-[8px] font-semibold text-primary/70 uppercase tracking-wider">
                Patent Tracker
              </span>
              <span className="text-[8px] font-mono text-muted-foreground ml-1">
                ({eventCount})
              </span>
              {trackerCollapsed ? (
                <ChevronDown className="w-2.5 h-2.5 text-muted-foreground ml-auto" />
              ) : (
                <ChevronUp className="w-2.5 h-2.5 text-muted-foreground ml-auto" />
              )}
            </button>
            
            {/* Expanded content */}
            {!trackerCollapsed && (
              <>
                <div className="text-[9px] font-mono text-foreground/70 space-y-0.5 mt-2 pt-2 border-t border-primary/10">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Session:</span>
                    <span className="font-medium text-primary truncate max-w-[100px]">{sessionId || '...'}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Events:</span>
                    <span className="font-semibold">{eventCount}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logInteraction('Opened session history viewer');
                    setShowHistory(true);
                  }}
                  className="w-full flex items-center justify-center gap-1 px-1.5 py-1 bg-secondary hover:bg-secondary/80 text-foreground text-[8px] font-medium rounded transition-colors pointer-events-auto mt-2"
                >
                  <History className="w-2.5 h-2.5" />
                  History
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Corner watermarks */}
      <div className="fixed top-2 left-2 z-[101] pointer-events-none select-none print:hidden" aria-hidden="true">
        <div className="text-[10px] font-semibold text-primary/20 tracking-wider">
          5 PATENTS FILED
        </div>
      </div>
      <div className="fixed top-2 right-2 z-[101] pointer-events-none select-none print:hidden" aria-hidden="true">
        <div className="text-[10px] font-semibold text-primary/20 tracking-wider">
          © 2026
        </div>
      </div>

      {/* Global styles to prevent selection and printing */}
      <style>{`
        /* Prevent text selection on sensitive areas */
        [data-protected="true"],
        .protected-content {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Completely block printing */
        @media print {
          body * {
            display: none !important;
            visibility: hidden !important;
          }
          body::before {
            content: "© Dr. Alexis Collier - 5 U.S. Patents Filed - Printing is disabled for this protected content.";
            display: block !important;
            visibility: visible !important;
            text-align: center;
            padding: 50px;
            font-size: 18px;
            color: #333;
          }
        }

        /* Disable drag on images */
        img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }

        /* Disable save as */
        body {
          -webkit-touch-callout: none;
        }
      `}</style>

      {/* Session History Modal */}
      <SessionHistoryViewer isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
};

// Toggle button to enable/disable protection (for demo purposes)
interface ProtectionToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export const ProtectionToggle = ({ enabled, onToggle }: ProtectionToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "p-1.5 rounded transition-colors",
        enabled 
          ? "bg-primary/20 text-primary" 
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      )}
      title={enabled ? "Disable screen protection" : "Enable screen protection"}
    >
      <ShieldAlert className="w-3.5 h-3.5" />
    </button>
  );
};