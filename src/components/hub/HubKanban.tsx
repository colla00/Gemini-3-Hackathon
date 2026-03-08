import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, AlertTriangle, ArrowUp, ArrowRight, ArrowDown, Scale, FlaskConical, Briefcase, Wrench, GraduationCap, Presentation, LayoutGrid, Loader2 } from 'lucide-react';

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
  { id: 'backlog', label: 'Backlog', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)' },
  { id: 'todo', label: 'To Do', bg: 'rgba(59,130,246,0.05)', border: 'rgba(59,130,246,0.15)' },
  { id: 'in_progress', label: 'In Progress', bg: 'rgba(245,158,11,0.05)', border: 'rgba(245,158,11,0.15)' },
  { id: 'done', label: 'Done', bg: 'rgba(16,185,129,0.05)', border: 'rgba(16,185,129,0.15)' },
];

const CATEGORIES = [
  { value: 'ip-legal', label: 'IP & Legal', color: '#8b5cf6' },
  { value: 'regulatory', label: 'Regulatory', color: '#ef4444' },
  { value: 'engineering', label: 'Engineering', color: '#3b82f6' },
  { value: 'business', label: 'Business', color: '#10b981' },
  { value: 'research', label: 'Research', color: '#f59e0b' },
  { value: 'conference', label: 'Conference', color: '#ec4899' },
  { value: 'general', label: 'General', color: '#6b7280' },
];

const PRIORITIES = [
  { value: 'critical', label: 'Critical', icon: AlertTriangle, color: '#ef4444' },
  { value: 'high', label: 'High', icon: ArrowUp, color: '#f97316' },
  { value: 'medium', label: 'Medium', icon: ArrowRight, color: '#eab308' },
  { value: 'low', label: 'Low', icon: ArrowDown, color: '#60a5fa' },
];

const HubKanban = () => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState<HubTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
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
    if (user) fetchTasks();
    else setLoading(false);
  }, [user, fetchTasks]);

  const moveTask = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from('hub_tasks')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', taskId);
    if (!error) setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const addTask = async () => {
    if (!newTitle.trim() || !user) return;
    const { error } = await supabase.from('hub_tasks').insert({
      title: newTitle,
      description: newDesc || null,
      category: newCategory,
      priority: newPriority,
      status: newStatus,
      created_by: user.id,
      sort_order: tasks.length + 1,
    });
    if (!error) {
      setAddOpen(false);
      setNewTitle(''); setNewDesc(''); setNewCategory('general'); setNewPriority('medium'); setNewStatus('backlog');
      fetchTasks();
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    await supabase.from('hub_tasks').delete().eq('id', id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filtered = filterCategory === 'all' ? tasks : tasks.filter(t => t.category === filterCategory);
  const stats = {
    total: tasks.length,
    critical: tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#00c8b4' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40 text-sm">Sign in to your VitaSignal account to access task management.</p>
        <a href="/auth" className="text-sm mt-3 inline-block" style={{ color: '#00c8b4' }}>Sign In →</a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Project Tracker</h2>
        <p className="text-white/40 text-sm mt-1">Kanban board · Commercialization tasks</p>
      </div>

      {/* Stats & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 text-xs">
          <span className="text-white/40">{stats.total} tasks</span>
          <span style={{ color: '#ef4444' }}>{stats.critical} critical</span>
          <span style={{ color: '#f59e0b' }}>{stats.inProgress} active</span>
          <span style={{ color: '#10b981' }}>{stats.done} done</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="h-8 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#00c8b4]/50"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {isAdmin && (
            <button
              onClick={() => setAddOpen(!addOpen)}
              className="h-8 px-3 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
              style={{ background: '#00c8b4' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          )}
        </div>
      </div>

      {/* Add Task Form */}
      {addOpen && isAdmin && (
        <div className="rounded-xl border border-white/10 p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <input
            placeholder="Task title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#00c8b4]/50"
            autoFocus
          />
          <textarea
            placeholder="Description (optional)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#00c8b4]/50 resize-none"
          />
          <div className="grid grid-cols-3 gap-2">
            <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="h-8 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-white">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select value={newPriority} onChange={e => setNewPriority(e.target.value)} className="h-8 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-white">
              {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="h-8 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-white">
              {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addTask} disabled={!newTitle.trim()} className="h-9 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-40" style={{ background: '#00c8b4' }}>
              Create Task
            </button>
            <button onClick={() => setAddOpen(false)} className="h-9 px-4 rounded-lg text-sm text-white/50 border border-white/10 hover:bg-white/5">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const colTasks = filtered.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="rounded-xl border p-3 min-h-[250px]" style={{ background: col.bg, borderColor: col.border }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">{col.label}</h3>
                <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{colTasks.length}</span>
              </div>
              <div className="space-y-2">
                {colTasks.map(task => (
                  <TaskCard key={task.id} task={task} isAdmin={isAdmin} onMove={moveTask} onDelete={deleteTask} />
                ))}
                {colTasks.length === 0 && <p className="text-xs text-white/20 text-center py-8">No tasks</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TaskCard = ({ task, isAdmin, onMove, onDelete }: {
  task: HubTask; isAdmin: boolean;
  onMove: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORIES.find(c => c.value === task.category);
  const pri = PRIORITIES.find(p => p.value === task.priority);
  const PriIcon = pri?.icon;

  return (
    <div
      className="rounded-lg border border-white/8 p-3 space-y-2 cursor-pointer hover:border-white/15 transition-colors"
      style={{ background: 'rgba(255,255,255,0.03)' }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-2">
        {PriIcon && <PriIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: pri?.color }} />}
        <p className="text-sm font-medium text-white leading-tight flex-1">{task.title}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {cat && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ color: cat.color, background: `${cat.color}15` }}>
            {cat.label}
          </span>
        )}
        {task.priority === 'critical' && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">CRITICAL</span>
        )}
      </div>
      {expanded && (
        <div className="pt-2 border-t border-white/8 space-y-2">
          {task.description && <p className="text-xs text-white/40">{task.description}</p>}
          {isAdmin && (
            <div className="flex items-center gap-1 flex-wrap">
              {COLUMNS.filter(c => c.id !== task.status).map(c => (
                <button
                  key={c.id}
                  className="text-[10px] h-6 px-2 rounded border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors"
                  onClick={e => { e.stopPropagation(); onMove(task.id, c.id); }}
                >
                  → {c.label}
                </button>
              ))}
              <button
                className="text-[10px] h-6 px-2 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                onClick={e => { e.stopPropagation(); onDelete(task.id); }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HubKanban;
