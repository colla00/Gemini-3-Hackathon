import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ShieldAlert } from 'lucide-react';

interface ScreenProtectionProps {
  enabled?: boolean;
  watermarkText?: string;
  showDynamicInfo?: boolean;
}

export const ScreenProtection = ({ 
  enabled = true, 
  watermarkText = 'DEMO • CONFIDENTIAL',
  showDynamicInfo = true 
}: ScreenProtectionProps) => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());

  // Update timestamp periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toISOString());
    }, 60000);
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
              This demonstration contains confidential research data. 
              Content is hidden when the window is not in focus.
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

      {/* Dynamic Info Watermark - Bottom corner */}
      {showDynamicInfo && (
        <div 
          className="fixed bottom-20 right-4 z-[101] pointer-events-none select-none print:hidden"
          aria-hidden="true"
        >
          <div className="bg-primary/5 border border-primary/10 rounded px-3 py-2 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-primary/40 space-y-0.5">
              <div>Session: {sessionId}</div>
              <div>Generated: {timestamp.split('T')[0]}</div>
              <div className="text-primary/30">Research Use Only</div>
            </div>
          </div>
        </div>
      )}

      {/* Corner watermarks */}
      <div className="fixed top-2 left-2 z-[101] pointer-events-none select-none print:hidden" aria-hidden="true">
        <div className="text-[10px] font-semibold text-primary/20 tracking-wider">
          CONFIDENTIAL
        </div>
      </div>
      <div className="fixed top-2 right-2 z-[101] pointer-events-none select-none print:hidden" aria-hidden="true">
        <div className="text-[10px] font-semibold text-primary/20 tracking-wider">
          DEMO ONLY
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