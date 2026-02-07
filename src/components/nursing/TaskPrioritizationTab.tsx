import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

interface Task {
  id: string;
  title: string;
  meta: string;
  priority: 'urgent' | 'high' | 'routine';
}

const allTasks: Task[] = [
  { id: 'u1', title: 'Pain reassessment - Patient 4502', meta: 'Due: 2:45 PM (15 min) | Est. time: 5 min | Room 12-A', priority: 'urgent' },
  { id: 'u2', title: 'Medication administration - Patient 4387', meta: 'Due: 3:00 PM (30 min) | Est. time: 8 min | Room 10-B', priority: 'urgent' },
  { id: 'h1', title: 'Admission assessment - Patient 4521', meta: 'Due: 5:00 PM | Est. time: 20 min | Room 15-C', priority: 'high' },
  { id: 'h2', title: 'Wound care documentation - Patient 4403', meta: 'Due: 6:00 PM | Est. time: 12 min | Room 08-A', priority: 'high' },
  { id: 'h3', title: 'Discharge planning notes - Patient 4298', meta: 'Due: 7:00 PM | Est. time: 15 min | Room 05-B', priority: 'high' },
  { id: 'r1', title: 'Routine vital signs documentation (6 patients)', meta: 'Suggested batch: 4:00-4:30 PM | Est. time: 18 min total', priority: 'routine' },
  { id: 'r2', title: 'Daily flow sheet completion (5 patients)', meta: 'Suggested batch: 6:00-6:30 PM | Est. time: 25 min total', priority: 'routine' },
];

const priorityStyles = {
  urgent: { border: 'border-l-4 border-destructive', badge: 'bg-destructive/10 text-destructive', label: 'URGENT' },
  high: { border: 'border-l-4 border-warning', badge: 'bg-warning/10 text-warning', label: 'HIGH' },
  routine: { border: 'border-l-4 border-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600', label: 'ROUTINE' },
};

const TaskItem = ({ task, completed, onToggle }: { task: Task; completed: boolean; onToggle: () => void }) => {
  const style = priorityStyles[task.priority];
  return (
    <div className={`${style.border} ${completed ? 'bg-muted/50 opacity-60' : 'bg-muted/30'} rounded-lg p-4 mb-3 flex items-start gap-3 hover:bg-muted/50 transition-colors`}>
      <Checkbox className="mt-1" checked={completed} onCheckedChange={onToggle} />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-semibold text-sm ${completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</span>
          <Badge variant="outline" className={`${style.badge} text-[10px] font-bold`}>{style.label}</Badge>
          {completed && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">DONE</Badge>}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{task.meta}</p>
      </div>
    </div>
  );
};

const TaskGroup = ({ title, tasks, completedIds, onToggle, color }: { title: string; tasks: Task[]; completedIds: Set<string>; onToggle: (id: string) => void; color: string }) => {
  const done = tasks.filter(t => completedIds.has(t.id)).length;
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold ${color}`}>{title}</h3>
        <span className="text-xs text-muted-foreground">{done}/{tasks.length} completed</span>
      </div>
      {tasks.map(task => <TaskItem key={task.id} task={task} completed={completedIds.has(task.id)} onToggle={() => onToggle(task.id)} />)}
    </div>
  );
};

export const TaskPrioritizationTab = () => {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const groups = useMemo(() => ({
    urgent: allTasks.filter(t => t.priority === 'urgent'),
    high: allTasks.filter(t => t.priority === 'high'),
    routine: allTasks.filter(t => t.priority === 'routine'),
  }), []);

  const total = allTasks.length;
  const done = completedIds.size;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle>Prioritized Task Queue</CardTitle>
              <Badge variant="outline" className={`text-xs font-bold ${done === total ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : 'bg-primary/10 text-primary border-primary/30'}`}>
                {done}/{total} tasks complete
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">AI-powered task ordering based on urgency and workflow efficiency</p>
            <div className="mt-3 flex items-center gap-3">
              <Progress value={pct} className="flex-1 h-2" />
              <span className="text-xs font-medium text-muted-foreground w-10 text-right">{pct}%</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold ml-4 shrink-0">MOCK DATA</Badge>
        </CardHeader>
        <CardContent>
          <TaskGroup title="Urgent (Complete in next 30 min)" tasks={groups.urgent} completedIds={completedIds} onToggle={toggle} color="text-destructive" />
          <TaskGroup title="High Priority (Complete before end of shift)" tasks={groups.high} completedIds={completedIds} onToggle={toggle} color="text-warning" />
          <TaskGroup title="Routine (Batch when possible)" tasks={groups.routine} completedIds={completedIds} onToggle={toggle} color="text-emerald-600" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Workflow Optimization Suggestions</CardTitle>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold">MOCK DATA</Badge>
        </CardHeader>
        <CardContent>
          <div className="border-l-4 border-primary bg-primary/5 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-1">Batching Recommendation</p>
            <p className="text-sm text-muted-foreground">Combine routine vital signs documentation for Rooms 8-A, 10-B, 12-A, 14-C, 15-A, 16-B between 4:00-4:30 PM to save 12 minutes of transition time.</p>
          </div>
          <div className="border-l-4 border-primary bg-primary/5 p-4 rounded-lg">
            <p className="font-semibold text-sm mb-1">Geographic Clustering</p>
            <p className="text-sm text-muted-foreground">3 high-priority tasks in East Wing (Rooms 08-A, 10-B, 12-A). Suggested route: 08-A → 10-B → 12-A to minimize walking time.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
