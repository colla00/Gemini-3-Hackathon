import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  meta: string;
  priority: 'urgent' | 'high' | 'routine';
  dueMin: number; // minutes until due
  room: string;
  estMin: number;
}

const generateTasks = (): { urgent: Task[]; high: Task[]; routine: Task[] } => {
  const now = new Date();
  const fmt = (min: number) => {
    const d = new Date(now.getTime() + min * 60000);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return {
    urgent: [
      { id: 'u1', title: 'Pain reassessment — Patient C00', meta: `Due: ${fmt(12)} (12 min) | Est: 5 min | Rm 405A`, priority: 'urgent', dueMin: 12, room: '405A', estMin: 5 },
      { id: 'u2', title: 'Vancomycin IV piggyback — Patient Q15', meta: `Due: ${fmt(18)} (18 min) | Est: 8 min | Rm 406A`, priority: 'urgent', dueMin: 18, room: '406A', estMin: 8 },
      { id: 'u3', title: 'Neuro check — Patient G07', meta: `Due: ${fmt(5)} (5 min) | Est: 3 min | Rm 402A`, priority: 'urgent', dueMin: 5, room: '402A', estMin: 3 },
    ],
    high: [
      { id: 'h1', title: 'Admission assessment — New admit Rm 414B', meta: `Due: ${fmt(45)} | Est: 20 min | Rm 414B`, priority: 'high', dueMin: 45, room: '414B', estMin: 20 },
      { id: 'h2', title: 'Wound care & photo — Patient M12', meta: `Due: ${fmt(60)} | Est: 15 min | Rm 403A`, priority: 'high', dueMin: 60, room: '403A', estMin: 15 },
      { id: 'h3', title: 'Discharge teaching — Patient J09', meta: `Due: ${fmt(90)} | Est: 12 min | Rm 416A`, priority: 'high', dueMin: 90, room: '416A', estMin: 12 },
      { id: 'h4', title: 'Foley removal & void trial — Patient N13', meta: `Due: ${fmt(75)} | Est: 10 min | Rm 411A`, priority: 'high', dueMin: 75, room: '411A', estMin: 10 },
    ],
    routine: [
      { id: 'r1', title: 'Routine vitals batch (6 patients)', meta: `Suggested: ${fmt(30)}–${fmt(50)} | Est: 18 min total`, priority: 'routine', dueMin: 30, room: 'Multiple', estMin: 18 },
      { id: 'r2', title: 'Daily flow sheets (5 patients)', meta: `Suggested: ${fmt(120)}–${fmt(150)} | Est: 25 min total`, priority: 'routine', dueMin: 120, room: 'Multiple', estMin: 25 },
      { id: 'r3', title: 'I&O totals documentation', meta: `Due: End of shift | Est: 8 min total`, priority: 'routine', dueMin: 180, room: 'Unit', estMin: 8 },
    ],
  };
};

const priorityStyles = {
  urgent: { border: 'border-l-destructive', badge: 'bg-destructive/15 text-destructive', label: 'URGENT' },
  high: { border: 'border-l-warning', badge: 'bg-warning/15 text-warning', label: 'HIGH' },
  routine: { border: 'border-l-[hsl(var(--risk-low))]', badge: 'bg-risk-low/15 text-risk-low', label: 'ROUTINE' },
};

const TaskGroup = ({ label, color, tasks, onComplete }: { label: string; color: string; tasks: Task[]; onComplete: (id: string) => void }) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const handleCheck = (id: string, title: string) => {
    setChecked(prev => {
      const newState = { ...prev, [id]: !prev[id] };
      if (newState[id]) {
        onComplete(id);
        toast.success(`Completed: ${title.split('—')[0].trim()}`, { duration: 2000 });
      }
      return newState;
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className={`text-sm font-semibold ${color}`}>{label}</h3>
        <Badge variant="outline" className="text-[9px] h-4">{tasks.filter(t => !checked[t.id]).length} remaining</Badge>
      </div>
      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} className={cn(
            `border-l-4 ${priorityStyles[t.priority].border} bg-card rounded-lg p-3.5 flex items-start gap-3 hover:bg-muted/50 transition-all border border-border/40`,
            checked[t.id] && 'opacity-50'
          )}>
            <Checkbox
              checked={checked[t.id] || false}
              onCheckedChange={() => handleCheck(t.id, t.title)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('font-medium text-sm', checked[t.id] && 'line-through text-muted-foreground')}>
                  {t.title}
                </span>
                <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded uppercase', priorityStyles[t.priority].badge)}>
                  {priorityStyles[t.priority].label}
                </span>
                {t.dueMin <= 15 && !checked[t.id] && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-destructive/20 text-destructive animate-pulse">
                    DUE SOON
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 tabular-nums">{t.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TaskPrioritization = () => {
  const [tasks, setTasks] = useState(generateTasks);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalEstMin, setTotalEstMin] = useState(0);

  useEffect(() => {
    const all = [...tasks.urgent, ...tasks.high, ...tasks.routine];
    setTotalEstMin(all.reduce((acc, t) => acc + t.estMin, 0));
  }, [tasks]);

  // Simulate new tasks arriving
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newTask: Task = {
          id: `dyn-${Date.now()}`,
          title: `Call light response — Rm ${400 + Math.floor(Math.random() * 25)}${Math.random() > 0.5 ? 'A' : 'B'}`,
          meta: `Just now | Est: 3 min`,
          priority: 'urgent',
          dueMin: 2,
          room: '',
          estMin: 3,
        };
        setTasks(prev => ({ ...prev, urgent: [newTask, ...prev.urgent].slice(0, 5) }));
        toast.info('New task added to queue', { duration: 2000 });
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = useCallback(() => {
    setCompletedCount(prev => prev + 1);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>AI-Prioritized Task Queue</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Tasks ranked by clinical urgency, time sensitivity, and proximity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-risk-low/10 border border-risk-low/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
              </span>
              <span className="text-[10px] font-semibold text-risk-low">LIVE</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary strip */}
          <div className="flex items-center gap-4 mb-5 p-3 rounded-lg bg-muted/40 border border-border/30 text-[11px]">
            <div>
              <span className="text-muted-foreground">Pending: </span>
              <span className="font-bold text-foreground tabular-nums">
                {tasks.urgent.length + tasks.high.length + tasks.routine.length - completedCount}
              </span>
            </div>
            <div className="w-px h-4 bg-border/30" />
            <div>
              <span className="text-muted-foreground">Completed: </span>
              <span className="font-bold text-risk-low tabular-nums">{completedCount}</span>
            </div>
            <div className="w-px h-4 bg-border/30" />
            <div>
              <span className="text-muted-foreground">Est. remaining: </span>
              <span className="font-bold text-foreground tabular-nums">{totalEstMin} min</span>
            </div>
          </div>

          <div className="space-y-6">
            <TaskGroup label="⚡ Urgent — Next 30 Minutes" color="text-destructive" tasks={tasks.urgent} onComplete={handleComplete} />
            <TaskGroup label="⬆ High Priority" color="text-warning" tasks={tasks.high} onComplete={handleComplete} />
            <TaskGroup label="↔ Routine — Batch When Possible" color="text-risk-low" tasks={tasks.routine} onComplete={handleComplete} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
