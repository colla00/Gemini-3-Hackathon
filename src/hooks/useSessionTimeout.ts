import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  enabled?: boolean;
}

export const useSessionTimeout = ({
  timeoutMinutes = 30,
  warningMinutes = 5,
  enabled = true,
}: UseSessionTimeoutOptions = {}) => {
  const { signOut, session } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    clearTimers();
    setShowWarning(false);
    toast.info('Session expired', { description: 'You have been signed out due to inactivity.' });
    await signOut();
  }, [signOut, clearTimers]);

  const resetTimer = useCallback(() => {
    if (!enabled || !session) return;

    clearTimers();
    setShowWarning(false);

    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;

    // Set warning timer
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setRemainingTime(warningMinutes * 60);
      
      // Countdown for remaining time
      const countdownInterval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast.warning('Session expiring soon', {
        description: `Your session will expire in ${warningMinutes} minutes. Move your mouse or click to stay signed in.`,
        duration: 10000,
      });
    }, warningMs);

    // Set logout timer
    timeoutRef.current = setTimeout(handleLogout, timeoutMs);
  }, [enabled, session, timeoutMinutes, warningMinutes, clearTimers, handleLogout]);

  const extendSession = useCallback(() => {
    resetTimer();
    if (showWarning) {
      toast.success('Session extended', { description: 'Your session has been extended.' });
    }
  }, [resetTimer, showWarning]);

  useEffect(() => {
    if (!enabled || !session) return;

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    // Debounce activity detection
    let activityTimeout: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (activityTimeout) return;
      activityTimeout = setTimeout(() => {
        activityTimeout = null;
        resetTimer();
      }, 1000);
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimers();
      if (activityTimeout) clearTimeout(activityTimeout);
    };
  }, [enabled, session, resetTimer, clearTimers]);

  return {
    showWarning,
    remainingTime,
    extendSession,
    formatTime: (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
  };
};
