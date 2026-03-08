import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import {
  Loader2, Plus, LayoutGrid, ArrowLeft, GripVertical,
  AlertTriangle, ArrowUp, ArrowRight, ArrowDown, Minus,
  Scale, FlaskConical, Briefcase, Wrench, GraduationCap, Presentation
} from 'lucide-react';

interface HubTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  category: string;
  priority: string;
  assigned_to: string | null;
  due_date: string | null;
  sort_order: number;
}

const COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: 'bg-muted/50', border: 'border-muted-foreground/20' },
  { id: 'todo', label: 'To Do', color: 'bg-blue-500/5', border: 'border-blue-500/20' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-amber-500/5', border: 'border-amber-500/20' },
  { id: 'done', label: 'Done', color: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
];

const CATEGORIES = [
  { value: 'ip-legal', label: 'IP & Legal', icon: Scale, color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30' },
  { value: 'regulatory', label: 'Regulatory', icon: AlertTriangle, color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
  { value: 'engineering', label: 'Engineering', icon: Wrench, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  { value: 'business', label: 'Business', icon: Briefcase, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
  { value: 'research', label: 'Research', icon: FlaskConical, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
  { value: 'conference', label: 'Conference', icon: Presentation, color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30' },
  { value: 'general', label: 'General', icon: LayoutGrid, color: 'text-muted-foreground bg-muted' },
];

const PRIORITIES = [
  { value: 'critical', label: 'Critical', icon: AlertTriangle, className: 'text-red-600' },
  { value: 'high', label: 'High', icon: ArrowUp, className: 'text-orange-500' },
  { value: 'medium', label: 'Medium', icon: ArrowRight, className: 'text-yellow-500' },
  { value: 'low', label: 'Low', icon: ArrowDown, className: 'text-blue-400' },
];

const PriorityIcon = ({ priority }: { priority: string }) => {
  const p = PRIORITIES.find(pr => pr.value === priority);
  if (!p) return null;
  const Icon = p.icon;
  return <Icon className={`h-3.5 w-3.5 ${p.className}`} />;
};

const CategoryBadge = ({ category }: { category: string }) => {
  const cat = CATEGORIES.find(c => c.value === category);
  if (!cat) return <Badge variant="secondary" className="text-[10px]">{category}</Badge>;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${cat.color}`}>
      {cat.label}
    </span>
  );
};

const ProjectHub = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<HubTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // New task form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newPriority, setNewPriority] = useState('medium');
  const [newStatus, setNewStatus] = useState('backlog');

  const fetchTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from('hub_tasks')
      .select('*')
      .order('sort_order');
    if (!error && data) setTasks(data as HubTask[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) { navigate('/auth'); return; }
    if (user) fetchTasks();
  }, [user, authLoading, navigate, fetchTasks]);

  const moveTask = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from('hub_tasks')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', taskId);
    if (!error) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
  };

  const addTask = async () => {
    if (!newTitle.trim()) return;
    const { error } = await supabase.from('hub_tasks').insert({
      title: newTitle,
      description: newDesc || null,
      category: newCategory,
      priority: newPriority,
      status: newStatus,
      created_by: user!.id,
      sort_order: tasks.length + 1,
    });
    if (!error) {
      toast({ title: 'Task created' });
      setAddOpen(false);
      setNewTitle(''); setNewDesc(''); setNewCategory('general'); setNewPriority('medium'); setNewStatus('backlog');
      fetchTasks();
    } else {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    await supabase.from('hub_tasks').delete().eq('id', id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filtered = filterCategory === 'all' ? tasks : tasks.filter(t => t.category === filterCategory);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const stats = {
    total: tasks.length,
    critical: tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-[1400px] mx-auto px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <LayoutGrid className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Project Hub</h1>
                <p className="text-sm text-muted-foreground">VitaSignal · Commercialization Tracker</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Stats */}
              <div className="flex items-center gap-3 mr-4 text-xs">
                <span className="text-muted-foreground">{stats.total} tasks</span>
                <span className="text-red-500 font-semibold">{stats.critical} critical</span>
                <span className="text-amber-500">{stats.inProgress} active</span>
                <span className="text-emerald-500">{stats.done} done</span>
              </div>
              {/* Filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isAdmin && (
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1 h-8"><Plus className="h-3.5 w-3.5" /> Add Task</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
                    <div className="space-y-3 pt-2">
                      <Input placeholder="Task title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                      <Textarea placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2} />
                      <div className="grid grid-cols-3 gap-2">
                        <Select value={newCategory} onValueChange={setNewCategory}>
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Select value={newPriority} onValueChange={setNewPriority}>
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {PRIORITIES.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {COLUMNS.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={addTask} disabled={!newTitle.trim()} className="w-full">Create Task</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="outline" size="sm" className="h-8" onClick={() => navigate('/')}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-[1400px] mx-auto px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.id);
            return (
              <div key={col.id} className={`rounded-xl border ${col.border} ${col.color} p-3 min-h-[300px]`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                  <Badge variant="secondary" className="text-[10px] h-5">{colTasks.length}</Badge>
                </div>
                <div className="space-y-2">
                  {colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isAdmin={isAdmin}
                      columns={COLUMNS}
                      onMove={moveTask}
                      onDelete={deleteTask}
                    />
                  ))}
                  {colTasks.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8 opacity-50">No tasks</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({
  task, isAdmin, columns, onMove, onDelete
}: {
  task: HubTask;
  isAdmin: boolean;
  columns: typeof COLUMNS;
  onMove: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start gap-2">
          <PriorityIcon priority={task.priority} />
          <p className="text-sm font-medium leading-tight flex-1">{task.title}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <CategoryBadge category={task.category} />
          {task.priority === 'critical' && (
            <Badge variant="destructive" className="text-[10px] h-4 px-1">CRITICAL</Badge>
          )}
        </div>
        {expanded && (
          <div className="pt-2 border-t space-y-2">
            {task.description && (
              <p className="text-xs text-muted-foreground">{task.description}</p>
            )}
            {(isAdmin) && (
              <div className="flex items-center gap-1 flex-wrap">
                {columns.filter(c => c.id !== task.status).map(c => (
                  <Button
                    key={c.id}
                    size="sm"
                    variant="outline"
                    className="text-[10px] h-6 px-2"
                    onClick={(e) => { e.stopPropagation(); onMove(task.id, c.id); }}
                  >
                    → {c.label}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[10px] h-6 px-2 text-destructive hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectHub;
