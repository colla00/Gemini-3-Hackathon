import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface Task {
  title: string;
  meta: string;
  priority: 'urgent' | 'high' | 'routine';
}

const urgentTasks: Task[] = [
  { title: 'Pain reassessment - Patient 4502', meta: 'Due: 2:45 PM (15 min) | Est. time: 5 min | Room 12-A', priority: 'urgent' },
  { title: 'Medication administration - Patient 4387', meta: 'Due: 3:00 PM (30 min) | Est. time: 8 min | Room 10-B', priority: 'urgent' },
];

const highTasks: Task[] = [
  { title: 'Admission assessment - Patient 4521', meta: 'Due: 5:00 PM | Est. time: 20 min | Room 15-C', priority: 'high' },
  { title: 'Wound care documentation - Patient 4403', meta: 'Due: 6:00 PM | Est. time: 12 min | Room 08-A', priority: 'high' },
  { title: 'Discharge planning notes - Patient 4298', meta: 'Due: 7:00 PM | Est. time: 15 min | Room 05-B', priority: 'high' },
];

const routineTasks: Task[] = [
  { title: 'Routine vital signs documentation (6 patients)', meta: 'Suggested batch: 4:00-4:30 PM | Est. time: 18 min total', priority: 'routine' },
  { title: 'Daily flow sheet completion (5 patients)', meta: 'Suggested batch: 6:00-6:30 PM | Est. time: 25 min total', priority: 'routine' },
];

const priorityStyles = {
  urgent: { border: 'border-l-4 border-destructive', badge: 'bg-destructive/10 text-destructive', label: 'URGENT' },
  high: { border: 'border-l-4 border-warning', badge: 'bg-warning/10 text-warning', label: 'HIGH' },
  routine: { border: 'border-l-4 border-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600', label: 'ROUTINE' },
};

const TaskItem = ({ task }: { task: Task }) => {
  const style = priorityStyles[task.priority];
  return (
    <div className={`${style.border} bg-muted/30 rounded-lg p-4 mb-3 flex items-start gap-3 hover:bg-muted/50 transition-colors`}>
      <Checkbox className="mt-1" />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm">{task.title}</span>
          <Badge variant="outline" className={`${style.badge} text-[10px] font-bold`}>{style.label}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{task.meta}</p>
      </div>
    </div>
  );
};

const TaskGroup = ({ title, tasks, color }: { title: string; tasks: Task[]; color: string }) => (
  <div className="mb-6">
    <h3 className={`text-sm font-semibold mb-3 ${color}`}>{title}</h3>
    {tasks.map((task, i) => <TaskItem key={i} task={task} />)}
  </div>
);

export const TaskPrioritizationTab = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Prioritized Task Queue</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">AI-powered task ordering based on urgency and workflow efficiency</p>
        </div>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs font-semibold">MOCK DATA</Badge>
      </CardHeader>
      <CardContent>
        <TaskGroup title="Urgent (Complete in next 30 min)" tasks={urgentTasks} color="text-destructive" />
        <TaskGroup title="High Priority (Complete before end of shift)" tasks={highTasks} color="text-warning" />
        <TaskGroup title="Routine (Batch when possible)" tasks={routineTasks} color="text-emerald-600" />
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
