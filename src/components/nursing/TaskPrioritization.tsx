import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface Task {
  id: string;
  title: string;
  meta: string;
  priority: 'urgent' | 'high' | 'routine';
}

const urgentTasks: Task[] = [
  { id: 'u1', title: 'Pain reassessment - Patient 4502', meta: 'Due: 2:45 PM (15 min) | Est. time: 5 min | Room 12-A', priority: 'urgent' },
  { id: 'u2', title: 'Medication administration - Patient 4387', meta: 'Due: 3:00 PM (30 min) | Est. time: 8 min | Room 10-B', priority: 'urgent' },
];

const highTasks: Task[] = [
  { id: 'h1', title: 'Admission assessment - Patient 4521', meta: 'Due: 5:00 PM | Est. time: 20 min | Room 15-C', priority: 'high' },
  { id: 'h2', title: 'Wound care documentation - Patient 4403', meta: 'Due: 6:00 PM | Est. time: 12 min | Room 08-A', priority: 'high' },
  { id: 'h3', title: 'Discharge planning notes - Patient 4298', meta: 'Due: 7:00 PM | Est. time: 15 min | Room 05-B', priority: 'high' },
];

const routineTasks: Task[] = [
  { id: 'r1', title: 'Routine vital signs documentation (6 patients)', meta: 'Suggested batch: 4:00-4:30 PM | Est. time: 18 min total', priority: 'routine' },
  { id: 'r2', title: 'Daily flow sheet completion (5 patients)', meta: 'Suggested batch: 6:00-6:30 PM | Est. time: 25 min total', priority: 'routine' },
];

const priorityStyles = {
  urgent: { border: 'border-l-destructive', badge: 'bg-destructive/15 text-destructive' },
  high: { border: 'border-l-warning', badge: 'bg-warning/15 text-warning' },
  routine: { border: 'border-l-[hsl(var(--risk-low))]', badge: 'bg-[hsl(var(--risk-low))]/15 text-[hsl(var(--risk-low))]' },
};

const TaskGroup = ({ label, color, tasks }: { label: string; color: string; tasks: Task[] }) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <div>
      <h3 className={`text-sm font-semibold mb-3 ${color}`}>{label}</h3>
      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t.id} className={`border-l-4 ${priorityStyles[t.priority].border} bg-card rounded-lg p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border border-border/40`}>
            <Checkbox
              checked={checked[t.id] || false}
              onCheckedChange={(v) => setChecked((prev) => ({ ...prev, [t.id]: !!v }))}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-medium text-sm ${checked[t.id] ? 'line-through text-muted-foreground' : ''}`}>{t.title}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${priorityStyles[t.priority].badge}`}>{t.priority}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TaskPrioritization = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Prioritized Task Queue</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">AI-powered task ordering based on urgency and workflow efficiency</p>
          </div>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-[10px] font-semibold">MOCK DATA</Badge>
        </CardHeader>
        <CardContent className="space-y-8">
          <TaskGroup label="Urgent (Complete in next 30 min)" color="text-destructive" tasks={urgentTasks} />
          <TaskGroup label="High Priority (Complete before end of shift)" color="text-warning" tasks={highTasks} />
          <TaskGroup label="Routine (Batch when possible)" color="text-[hsl(var(--risk-low))]" tasks={routineTasks} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Workflow Optimization Suggestions</CardTitle>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-[10px] font-semibold">MOCK DATA</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border-l-4 border-l-primary bg-primary/10 p-4 rounded-lg">
            <div className="font-semibold text-sm mb-1">Batching Recommendation</div>
            <p className="text-sm text-muted-foreground">Combine routine vital signs documentation for Rooms 8-A, 10-B, 12-A, 14-C, 15-A, 16-B between 4:00-4:30 PM to save 12 minutes of transition time.</p>
          </div>
          <div className="border-l-4 border-l-accent bg-accent/10 p-4 rounded-lg">
            <div className="font-semibold text-sm mb-1">Geographic Clustering</div>
            <p className="text-sm text-muted-foreground">3 high-priority tasks in East Wing (Rooms 08-A, 10-B, 12-A). Suggested route: 08-A, 10-B, 12-A to minimize walking time.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
