import { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Sunrise } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Real-time clinical clock with shift indicator, 
 * exactly like the top-bar of a hospital EHR system.
 */

function getShiftInfo(hour: number): { label: string; icon: React.ReactNode; color: string } {
  if (hour >= 7 && hour < 15) return { label: 'Day Shift', icon: <Sun className="w-3 h-3" />, color: 'text-amber-400' };
  if (hour >= 15 && hour < 23) return { label: 'Eve Shift', icon: <Sunrise className="w-3 h-3" />, color: 'text-orange-400' };
  return { label: 'Night Shift', icon: <Moon className="w-3 h-3" />, color: 'text-indigo-400' };
}

function getShiftProgress(now: Date): number {
  const hour = now.getHours();
  const min = now.getMinutes();
  const totalMin = hour * 60 + min;
  // Day: 07:00–15:00, Eve: 15:00–23:00, Night: 23:00–07:00
  if (hour >= 7 && hour < 15) return ((totalMin - 420) / 480) * 100;
  if (hour >= 15 && hour < 23) return ((totalMin - 900) / 480) * 100;
  // Night wraps midnight
  const nightMin = hour >= 23 ? totalMin - 1380 : totalMin + 60;
  return (nightMin / 480) * 100;
}

export const ClinicalClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const shift = getShiftInfo(now.getHours());
  const progress = Math.min(100, Math.max(0, getShiftProgress(now)));

  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/20">
      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
      <div className="flex flex-col">
        <span className="text-xs font-mono font-bold text-foreground tabular-nums tracking-wide">
          {timeStr}
        </span>
        <span className="text-[9px] text-muted-foreground">{dateStr}</span>
      </div>
      <div className="w-px h-6 bg-border/30" />
      <div className="flex flex-col items-start min-w-[72px]">
        <div className={cn('flex items-center gap-1 text-[10px] font-semibold', shift.color)}>
          {shift.icon}
          {shift.label}
        </div>
        <div className="w-full h-1 rounded-full bg-secondary mt-1 overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-1000', shift.color.replace('text-', 'bg-'))}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
