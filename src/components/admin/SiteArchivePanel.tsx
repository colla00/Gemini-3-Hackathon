import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Archive, Camera, Clock, Hash, FileText, Download, RefreshCw, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SiteArchive {
  id: string;
  captured_at: string;
  page_url: string;
  page_title: string | null;
  content_hash: string;
  html_content: string | null;
  metadata: Record<string, unknown> | null;
  trigger_type: string;
  notes: string | null;
  created_at: string;
}

export const SiteArchivePanel = () => {
  const [archives, setArchives] = useState<SiteArchive[]>([]);
  const [loading, setLoading] = useState(true);
  const [capturing, setCapturing] = useState(false);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArchive, setSelectedArchive] = useState<SiteArchive | null>(null);

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_archives')
      .select('id, captured_at, page_url, page_title, content_hash, metadata, trigger_type, notes, created_at')
      .order('captured_at', { ascending: false })
      .limit(100);

    if (error) {
      toast.error('Failed to load archives');
      console.error(error);
    } else {
      setArchives((data as unknown as SiteArchive[]) || []);
    }
    setLoading(false);
  };

  const captureNow = async () => {
    setCapturing(true);
    try {
      const { data, error } = await supabase.functions.invoke('capture-site-archive', {
        body: { 
          trigger_type: 'manual',
          notes: notes || `Manual capture on ${new Date().toLocaleDateString()}`,
        },
      });

      if (error) throw error;

      toast.success(`Archived ${data.captured}/${data.total} pages successfully`);
      setNotes('');
      fetchArchives();
    } catch (err) {
      console.error('Capture error:', err);
      toast.error('Failed to capture site archive');
    } finally {
      setCapturing(false);
    }
  };

  const downloadArchive = async (archiveId: string) => {
    const { data, error } = await supabase
      .from('site_archives')
      .select('*')
      .eq('id', archiveId)
      .single();

    if (error || !data) {
      toast.error('Failed to download archive');
      return;
    }

    const archive = data as unknown as SiteArchive;
    const blob = new Blob([archive.html_content || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date(archive.captured_at).toISOString().split('T')[0];
    const pageName = new URL(archive.page_url).pathname.replace(/\//g, '-') || 'home';
    a.download = `vitasignal-archive-${pageName}-${dateStr}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Archive downloaded');
  };

  const exportEvidenceBundle = async () => {
    const { data, error } = await supabase
      .from('site_archives')
      .select('*')
      .order('captured_at', { ascending: false })
      .limit(50);

    if (error || !data) {
      toast.error('Failed to export evidence bundle');
      return;
    }

    const bundle = {
      export_date: new Date().toISOString(),
      purpose: 'Trademark Evidence - Site Archive Snapshots',
      owner: 'Dr. Alexis M. Collier',
      marks: ['VitaSignal™', 'ChartMinder™', 'Documentation Burden Score™'],
      total_snapshots: data.length,
      snapshots: (data as unknown as SiteArchive[]).map(a => ({
        captured_at: a.captured_at,
        page_url: a.page_url,
        page_title: a.page_title,
        content_hash: a.content_hash,
        content_length: (a.metadata as Record<string, unknown>)?.content_length,
        trigger_type: a.trigger_type,
        notes: a.notes,
        html_content: a.html_content,
        metadata: a.metadata,
      })),
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitasignal-trademark-evidence-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Evidence bundle exported');
  };

  const filteredArchives = archives.filter(a => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.page_url.toLowerCase().includes(q) ||
      a.page_title?.toLowerCase().includes(q) ||
      a.content_hash.includes(q) ||
      a.notes?.toLowerCase().includes(q)
    );
  });

  const getTriggerBadge = (type: string) => {
    switch (type) {
      case 'scheduled': return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Scheduled</Badge>;
      case 'milestone': return <Badge className="bg-primary/20 text-primary border-primary/30"><CheckCircle2 className="w-3 h-3 mr-1" />Milestone</Badge>;
      default: return <Badge variant="outline"><Camera className="w-3 h-3 mr-1" />Manual</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-primary" />
            <CardTitle>Site Archive — Trademark Evidence</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportEvidenceBundle}>
              <Download className="w-4 h-4 mr-2" />
              Export Evidence
            </Button>
            <Button variant="outline" size="sm" onClick={fetchArchives}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        <CardDescription>
          Periodic snapshots of clinicaldashboard.lovable.app with SHA-256 content hashes for trademark first-use evidence.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Manual Capture */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Capture Snapshot Now</span>
          </div>
          <Textarea
            placeholder="Optional notes (e.g., 'Pre-filing snapshot for VitaSignal™ trademark application')"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="text-sm"
          />
          <Button onClick={captureNow} disabled={capturing} size="sm">
            {capturing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Capturing all pages...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Capture All Pages
              </>
            )}
          </Button>
        </div>

        {/* Search */}
        <Input
          placeholder="Search archives by URL, title, hash, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-secondary/30 border border-border">
            <p className="text-xs text-muted-foreground">Total Snapshots</p>
            <p className="text-xl font-bold">{archives.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border">
            <p className="text-xs text-muted-foreground">Unique Pages</p>
            <p className="text-xl font-bold">{new Set(archives.map(a => a.page_url)).size}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border">
            <p className="text-xs text-muted-foreground">Latest Capture</p>
            <p className="text-sm font-medium">
              {archives[0] ? new Date(archives[0].captured_at).toLocaleDateString() : 'None'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border">
            <p className="text-xs text-muted-foreground">Unique Hashes</p>
            <p className="text-xl font-bold">{new Set(archives.map(a => a.content_hash)).size}</p>
          </div>
        </div>

        {/* Archive Table */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading archives...</div>
        ) : filteredArchives.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Archive className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No archives yet. Click "Capture All Pages" to create your first snapshot.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Captured</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Content Hash</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArchives.map((archive) => (
                  <TableRow key={archive.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {new Date(archive.captured_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium truncate max-w-[200px]">
                          {archive.page_title || archive.page_url}
                        </span>
                        <a 
                          href={archive.page_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-secondary/50 px-1.5 py-0.5 rounded font-mono">
                        {archive.content_hash.substring(0, 12)}...
                      </code>
                    </TableCell>
                    <TableCell>{getTriggerBadge(archive.trigger_type)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-[150px]">
                      {archive.notes || '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => downloadArchive(archive.id)}
                          title="Download HTML"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setSelectedArchive(archive)}
                              title="View details"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Archive Details</DialogTitle>
                            </DialogHeader>
                            {selectedArchive && (
                              <div className="space-y-3 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Page:</span>{' '}
                                  <a href={selectedArchive.page_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                    {selectedArchive.page_url}
                                  </a>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Title:</span> {selectedArchive.page_title}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Captured:</span>{' '}
                                  {new Date(selectedArchive.captured_at).toLocaleString()}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">SHA-256:</span>
                                  <code className="block mt-1 text-xs bg-secondary/50 p-2 rounded font-mono break-all">
                                    {selectedArchive.content_hash}
                                  </code>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Trigger:</span> {selectedArchive.trigger_type}
                                </div>
                                {selectedArchive.notes && (
                                  <div>
                                    <span className="text-muted-foreground">Notes:</span> {selectedArchive.notes}
                                  </div>
                                )}
                                {selectedArchive.metadata && (
                                  <div>
                                    <span className="text-muted-foreground">Metadata:</span>
                                    <pre className="mt-1 text-xs bg-secondary/50 p-2 rounded overflow-auto max-h-32">
                                      {JSON.stringify(selectedArchive.metadata, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
