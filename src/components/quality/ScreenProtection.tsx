import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ShieldAlert, Clock, FileText } from 'lucide-react';
import { useSessionTracking } from '@/hooks/useSessionTracking';

interface ScreenProtectionProps {
  enabled?: boolean;
  watermarkText?: string;
  showDynamicInfo?: boolean;
}

export const ScreenProtection = ({ 
  enabled = true, 
  watermarkText = 'PATENT PENDING • DO NOT COPY',
  showDynamicInfo = true 
}: ScreenProtectionProps) => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());
  const { session, sessionId, startTime, eventCount, exportEvidence } = useSessionTracking();

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
      if (document.hidden) {
        setIsBlurred(true);
      }
    };

    const handleBlur = () => {
      setIsBlurred(true);
    };

    const handleFocus = () => {
      // Small delay before unblurring for extra protection
      setTimeout(() => setIsBlurred(false), 300);
    };

    // Detect print attempts
    const handleBeforePrint = () => {
      setIsBlurred(true);
    };

    const handleAfterPrint = () => {
      setTimeout(() => setIsBlurred(false), 500);
    };

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
    };
  }, [enabled]);

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
              This prototype is patent pending and proprietary intellectual property. 
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

      {/* Session Tracking Panel - Bottom corner */}
      {showDynamicInfo && (
        <div 
          className="fixed bottom-20 right-4 z-[101] select-none print:hidden"
          aria-hidden="true"
        >
          <div className="bg-background/95 border border-primary/20 rounded-lg px-4 py-3 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-primary/10">
              <Clock className="w-3 h-3 text-primary/60" />
              <span className="text-[10px] font-semibold text-primary/70 uppercase tracking-wider">
                Patent Evidence Tracker
              </span>
            </div>
            <div className="text-[10px] font-mono text-foreground/70 space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Session ID:</span>
                <span className="font-semibold text-primary">{sessionId || 'Initializing...'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Started:</span>
                <span>{startTime ? new Date(startTime).toLocaleString() : '-'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Current:</span>
                <span className="text-green-500">{new Date(currentTime).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Events Logged:</span>
                <span className="font-semibold">{eventCount}</span>
              </div>
            </div>
            <button
              onClick={() => {
                const evidence = exportEvidence();
                const blob = new Blob([evidence], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `patent-evidence-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="mt-3 w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-[9px] font-medium rounded transition-colors pointer-events-auto"
            >
              <FileText className="w-3 h-3" />
              Export Evidence Log
            </button>
            <div className="mt-2 pt-2 border-t border-primary/10 text-[8px] text-muted-foreground text-center">
              All interactions timestamped for patent documentation
            </div>
          </div>
        </div>
      )}

      {/* Corner watermarks */}
      <div className="fixed top-2 left-2 z-[101] pointer-events-none select-none print:hidden" aria-hidden="true">
        <div className="text-[10px] font-semibold text-primary/20 tracking-wider">
          PATENT PENDING
        </div>
      </div>
      <div className="fixed top-2 right-2 z-[101] pointer-events-none select-none print:hidden" aria-hidden="true">
        <div className="text-[10px] font-semibold text-primary/20 tracking-wider">
          © 2025
        </div>
      </div>

      {/* Global styles to prevent selection */}
      <style>{`
        /* Prevent text selection on sensitive areas */
        [data-protected="true"],
        .protected-content {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Make watermark visible in screenshots but subtle during use */
        @media print {
          .print\\:hidden {
            display: none !important;
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
      `}</style>
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