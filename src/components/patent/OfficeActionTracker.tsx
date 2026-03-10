import { useState, useEffect, useCallback } from 'react';
import { Plus, Clock, AlertTriangle, CheckCircle2, FileWarning, Loader2, Calendar, User, BookOpen, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { differenceInDays, format, parseISO } from 'date-fns';

interface OfficeAction {
  id: string;
  patent_id: string;
  action_type: string;
  status: string;
  mailing_date: string | null;
  response_deadline: string | null;
  examiner_name: string | null;
  art_unit: string | null;
  summary: string | null;
  rejection_types: string[] | null;
  cited_references: string[] | null;
  response_notes: string | null;
  responded_at: string | null;
  created_at: string;
  patent_nickname?: string;
}

interface PatentOption {
  id: string;
  nickname: string;
  patent_number: string;
}

const ACTION_TYPES = [
  'Non-Final Rejection',
  'Final Rejection',
  'Restriction Requirement',
  'Notice of Allowance',
  'Advisory Action',
  'Ex Parte Quayle',
  'Notice of Non-Compliant',
  'Other',
];

const REJECTION_TYPES = [
  '§101 Subject Matter',
  '§102 Anticipation',
  '§103 Obviousness',
  '§112(a) Written Description',
  '§112(b) Indefiniteness',
  'Double Patenting',
];

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }> = {
  pending: { label: 'Pending Response', variant: 'destructive', icon: Clock },
  in_progress: { label: 'Drafting Response', variant: 'default', icon: FileWarning },
  responded: { label: 'Responded', variant: 'secondary', icon: CheckCircle2 },
  closed: { label: 'Closed', variant: 'outline', icon: CheckCircle2 },
};

export const OfficeActionTracker = () => {
  const [actions, setActions] = useState<OfficeAction[]>([]);
  const [patents, setPatents] = useState<PatentOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<OfficeAction | null>(null);
  const { toast } = useToast();

  // Form state
  const [form, setForm] = useState({
    patent_id: '',
    action_type: 'Non-Final Rejection',
    mailing_date: '',
    response_deadline: '',
    examiner_name: '',
    art_unit: '',
    summary: '',
    rejection_types: [] as string[],
    cited_references: '',
    response_notes: '',
    status: 'pending',
  });

  const resetForm = () => {
    setForm({
      patent_id: '',
      action_type: 'Non-Final Rejection',
      mailing_date: '',
      response_deadline: '',
      examiner_name: '',
      art_unit: '',
      summary: '',
      rejection_types: [],
      cited_references: '',
      response_notes: '',
      status: 'pending',
    });
    setEditingAction(null);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const [actionsRes, patentsRes] = await Promise.all([
      supabase.from('office_actions').select('*').order('created_at', { ascending: false }),
      supabase.from('patents').select('id, nickname, patent_number'),
    ]);

    if (patentsRes.data) setPatents(patentsRes.data);

    if (actionsRes.data && patentsRes.data) {
      const patentMap = Object.fromEntries(patentsRes.data.map(p => [p.id, p.nickname]));
      setActions(actionsRes.data.map(a => ({ ...a, patent_nickname: patentMap[a.patent_id] || a.patent_id })));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    if (!form.patent_id) {
      toast({ title: 'Select a patent', variant: 'destructive' });
      return;
    }

    const payload = {
      patent_id: form.patent_id,
      action_type: form.action_type,
      status: form.status,
      mailing_date: form.mailing_date || null,
      response_deadline: form.response_deadline || null,
      examiner_name: form.examiner_name || null,
      art_unit: form.art_unit || null,
      summary: form.summary || null,
      rejection_types: form.rejection_types.length > 0 ? form.rejection_types : null,
      cited_references: form.cited_references ? form.cited_references.split('\n').filter(Boolean) : null,
      response_notes: form.response_notes || null,
      responded_at: form.status === 'responded' ? new Date().toISOString() : null,
    };

    let error;
    if (editingAction) {
      ({ error } = await supabase.from('office_actions').update(payload).eq('id', editingAction.id));
    } else {
      ({ error } = await supabase.from('office_actions').insert(payload));
    }

    if (error) {
      toast({ title: 'Error saving', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: editingAction ? 'Office action updated' : 'Office action added' });
    setDialogOpen(false);
    resetForm();
    fetchData();
  };

  const openEdit = (action: OfficeAction) => {
    setEditingAction(action);
    setForm({
      patent_id: action.patent_id,
      action_type: action.action_type,
      mailing_date: action.mailing_date || '',
      response_deadline: action.response_deadline || '',
      examiner_name: action.examiner_name || '',
      art_unit: action.art_unit || '',
      summary: action.summary || '',
      rejection_types: action.rejection_types || [],
      cited_references: action.cited_references?.join('\n') || '',
      response_notes: action.response_notes || '',
      status: action.status,
    });
    setDialogOpen(true);
  };

  const getDaysUntilDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    return differenceInDays(parseISO(deadline), new Date());
  };

  const getUrgencyBadge = (days: number | null) => {
    if (days === null) return null;
    if (days < 0) return <Badge variant="destructive" className="text-[10px]">Overdue by {Math.abs(days)}d</Badge>;
    if (days <= 14) return <Badge variant="destructive" className="text-[10px]">{days}d remaining</Badge>;
    if (days <= 30) return <Badge className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">{days}d remaining</Badge>;
    return <Badge variant="outline" className="text-[10px]">{days}d remaining</Badge>;
  };

  const filtered = filterStatus === 'all' ? actions : actions.filter(a => a.status === filterStatus);

  const pendingCount = actions.filter(a => a.status === 'pending').length;
  const overdueCount = actions.filter(a => {
    const days = getDaysUntilDeadline(a.response_deadline);
    return days !== null && days < 0 && a.status !== 'responded' && a.status !== 'closed';
  }).length;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="text-2xl font-bold tabular-nums">{actions.length}</div>
            <p className="text-xs text-muted-foreground">Total Actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="text-2xl font-bold tabular-nums text-destructive">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Pending Response</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="text-2xl font-bold tabular-nums text-amber-600">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="text-2xl font-bold tabular-nums">{actions.filter(a => a.status === 'responded').length}</div>
            <p className="text-xs text-muted-foreground">Responded</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">Drafting Response</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> Log Office Action
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAction ? 'Edit Office Action' : 'Log New Office Action'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Patent Application</Label>
                  <Select value={form.patent_id} onValueChange={v => setForm(f => ({ ...f, patent_id: v }))}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {patents.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.nickname}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Action Type</Label>
                  <Select value={form.action_type} onValueChange={v => setForm(f => ({ ...f, action_type: v }))}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ACTION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Mailing Date</Label>
                  <Input type="date" className="h-9 text-xs" value={form.mailing_date} onChange={e => setForm(f => ({ ...f, mailing_date: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Response Deadline</Label>
                  <Input type="date" className="h-9 text-xs" value={form.response_deadline} onChange={e => setForm(f => ({ ...f, response_deadline: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Examiner Name</Label>
                  <Input className="h-9 text-xs" placeholder="e.g. John Smith" value={form.examiner_name} onChange={e => setForm(f => ({ ...f, examiner_name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Art Unit</Label>
                  <Input className="h-9 text-xs" placeholder="e.g. 3626" value={form.art_unit} onChange={e => setForm(f => ({ ...f, art_unit: e.target.value }))} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Rejection Types</Label>
                <div className="flex flex-wrap gap-1.5">
                  {REJECTION_TYPES.map(rt => (
                    <button
                      key={rt}
                      type="button"
                      onClick={() => setForm(f => ({
                        ...f,
                        rejection_types: f.rejection_types.includes(rt)
                          ? f.rejection_types.filter(r => r !== rt)
                          : [...f.rejection_types, rt],
                      }))}
                      className={cn(
                        'text-[10px] px-2 py-1 rounded-full border transition-colors',
                        form.rejection_types.includes(rt)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border hover:border-primary/50'
                      )}
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Summary</Label>
                <Textarea className="text-xs min-h-[60px]" placeholder="Brief summary of the office action..." value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Cited References (one per line)</Label>
                <Textarea className="text-xs min-h-[50px]" placeholder="US Patent 10,123,456&#10;Smith et al., 2023" value={form.cited_references} onChange={e => setForm(f => ({ ...f, cited_references: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Response Notes</Label>
                <Textarea className="text-xs min-h-[50px]" placeholder="Notes on how to respond..." value={form.response_notes} onChange={e => setForm(f => ({ ...f, response_notes: e.target.value }))} />
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingAction ? 'Update Office Action' : 'Save Office Action'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No office actions recorded yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Click "Log Office Action" to track a USPTO examiner response.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs w-[160px]">Patent</TableHead>
                <TableHead className="text-xs w-[140px]">Action Type</TableHead>
                <TableHead className="text-xs w-[100px]">Status</TableHead>
                <TableHead className="text-xs w-[110px]">Deadline</TableHead>
                <TableHead className="text-xs w-[100px]">Examiner</TableHead>
                <TableHead className="text-xs">Rejections</TableHead>
                <TableHead className="text-xs w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(action => {
                const days = getDaysUntilDeadline(action.response_deadline);
                const statusCfg = STATUS_CONFIG[action.status] || STATUS_CONFIG.pending;
                const StatusIcon = statusCfg.icon;

                return (
                  <TableRow
                    key={action.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openEdit(action)}
                  >
                    <TableCell className="text-xs font-medium">{action.patent_nickname}</TableCell>
                    <TableCell className="text-xs">{action.action_type}</TableCell>
                    <TableCell>
                      <Badge variant={statusCfg.variant} className="text-[10px] gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="space-y-0.5">
                        {action.response_deadline ? (
                          <>
                            <span>{format(parseISO(action.response_deadline), 'MMM d, yyyy')}</span>
                            <div>{getUrgencyBadge(days)}</div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{action.examiner_name || '—'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {action.rejection_types?.map(rt => (
                          <Badge key={rt} variant="outline" className="text-[9px] px-1.5">{rt}</Badge>
                        )) || <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); openEdit(action); }}>
                        <Calendar className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
