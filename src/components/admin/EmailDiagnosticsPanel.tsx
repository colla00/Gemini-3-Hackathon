import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Mail, Search, RefreshCw, Copy, ChevronLeft, ChevronRight } from 'lucide-react';

interface EmailLog {
  id: string;
  message_id: string | null;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 20;

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'outline' },
  queued: { label: 'Queued', variant: 'secondary' },
  sent: { label: 'Sent', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'default' },
  failed: { label: 'Failed', variant: 'destructive' },
  dlq: { label: 'Failed (DLQ)', variant: 'destructive' },
  rate_limited: { label: 'Rate Limited', variant: 'outline' },
  suppressed: { label: 'Suppressed', variant: 'outline' },
  bounced: { label: 'Bounced', variant: 'destructive' },
  complained: { label: 'Complained', variant: 'destructive' },
};

export function EmailDiagnosticsPanel() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);

    const now = new Date();
    const rangeMap: Record<string, number> = { '24h': 1, '7d': 7, '30d': 30, '90d': 90 };
    const days = rangeMap[timeRange] || 7;
    const since = new Date(now.getTime() - days * 86400000).toISOString();

    const { data, error } = await supabase
      .from('email_send_log')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      toast.error('Failed to load email logs');
      setLoading(false);
      return;
    }

    // Deduplicate by message_id, keeping latest row
    const seen = new Map<string, EmailLog>();
    for (const row of (data || []) as EmailLog[]) {
      const key = row.message_id || row.id;
      if (!seen.has(key)) {
        seen.set(key, row);
      }
    }
    setLogs(Array.from(seen.values()));
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [timeRange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, templateFilter]);

  const templates = useMemo(() => {
    const set = new Set(logs.map(l => l.template_name));
    return Array.from(set).sort();
  }, [logs]);

  const filtered = useMemo(() => {
    return logs.filter(log => {
      if (statusFilter !== 'all' && log.status !== statusFilter) return false;
      if (templateFilter !== 'all' && log.template_name !== templateFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          log.recipient_email.toLowerCase().includes(q) ||
          log.template_name.toLowerCase().includes(q) ||
          (log.message_id || '').toLowerCase().includes(q) ||
          getWorkflowId(log)?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, searchQuery, statusFilter, templateFilter]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = { total: filtered.length };
    for (const log of filtered) {
      counts[log.status] = (counts[log.status] || 0) + 1;
    }
    return counts;
  }, [filtered]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getWorkflowId = (log: EmailLog): string | null => {
    if (!log.metadata || typeof log.metadata !== 'object') return null;
    return (log.metadata as Record<string, string>).workflow_id || null;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle>Email Diagnostics</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Delivery status, provider workflow IDs, and error details for all outbound emails
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-foreground' },
            { label: 'Sent', value: stats.sent || 0, color: 'text-green-600' },
            { label: 'Queued', value: stats.queued || 0, color: 'text-yellow-600' },
            { label: 'Failed', value: (stats.failed || 0) + (stats.dlq || 0), color: 'text-destructive' },
            { label: 'Suppressed', value: stats.suppressed || 0, color: 'text-muted-foreground' },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-lg bg-secondary/50 border border-border text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search recipient, template, or workflow ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="queued">Queued</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="dlq">DLQ</SelectItem>
              <SelectItem value="suppressed">Suppressed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={templateFilter} onValueChange={setTemplateFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              {templates.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading email logs...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No emails match your filters</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Workflow ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map(log => {
                    const workflowId = getWorkflowId(log);
                    const cfg = STATUS_CONFIG[log.status] || { label: log.status, variant: 'outline' as const };
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">{log.template_name}</TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">{log.recipient_email}</TableCell>
                        <TableCell>
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        </TableCell>
                        <TableCell>
                          {workflowId ? (
                            <button
                              onClick={() => copyToClipboard(workflowId)}
                              className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors max-w-[180px]"
                              title={workflowId}
                            >
                              <span className="truncate">{workflowId.slice(-20)}</span>
                              <Copy className="w-3 h-3 shrink-0" />
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs text-destructive max-w-[200px] truncate">
                          {log.error_message || '—'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground">
                  {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
