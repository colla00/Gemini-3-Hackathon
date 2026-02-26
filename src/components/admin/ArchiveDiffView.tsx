import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { diffLines, diffStats, DiffLine } from '@/lib/textDiff';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitCompareArrows, Plus, Minus, Equal, Loader2 } from 'lucide-react';

interface ArchiveDiffViewProps {
  currentArchiveId: string;
  pageUrl: string;
  capturedAt: string;
}

interface ArchiveSnapshot {
  id: string;
  captured_at: string;
  content_hash: string;
  markdown_content: string | null;
}

export const ArchiveDiffView = ({ currentArchiveId, pageUrl, capturedAt }: ArchiveDiffViewProps) => {
  const [loading, setLoading] = useState(false);
  const [diff, setDiff] = useState<DiffLine[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previousDate, setPreviousDate] = useState<string | null>(null);
  const [showUnchanged, setShowUnchanged] = useState(false);

  const loadDiff = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch current snapshot's markdown
      const { data: current, error: currentErr } = await supabase
        .from('site_archives')
        .select('id, captured_at, content_hash, markdown_content')
        .eq('id', currentArchiveId)
        .single();

      if (currentErr || !current) {
        setError('Failed to load current snapshot');
        return;
      }

      // Fetch previous snapshot for the same page
      const { data: previous, error: prevErr } = await supabase
        .from('site_archives')
        .select('id, captured_at, content_hash, markdown_content')
        .eq('page_url', pageUrl)
        .lt('captured_at', capturedAt)
        .order('captured_at', { ascending: false })
        .limit(1)
        .single();

      if (prevErr || !previous) {
        setError('No previous snapshot found for this page');
        return;
      }

      const cur = current as unknown as ArchiveSnapshot;
      const prev = previous as unknown as ArchiveSnapshot;

      setPreviousDate(prev.captured_at);

      if (cur.content_hash === prev.content_hash) {
        setDiff([]);
        return;
      }

      const oldText = prev.markdown_content || '';
      const newText = cur.markdown_content || '';
      const result = diffLines(oldText, newText);
      setDiff(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (diff === null && !loading && !error) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <Button variant="outline" size="sm" onClick={loadDiff}>
          <GitCompareArrows className="w-4 h-4 mr-2" />
          Compare with Previous Snapshot
        </Button>
        <p className="text-[10px] text-muted-foreground">Loads rendered markdown from the prior capture of this page</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-muted-foreground text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading diff...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">{error}</div>
    );
  }

  if (diff && diff.length === 0) {
    return (
      <div className="text-center py-4">
        <Badge variant="outline" className="text-xs">
          <Equal className="w-3 h-3 mr-1" />
          No changes from previous snapshot
        </Badge>
        {previousDate && (
          <p className="text-[10px] text-muted-foreground mt-1">
            Compared with {new Date(previousDate).toLocaleString()}
          </p>
        )}
      </div>
    );
  }

  const stats = diff ? diffStats(diff) : { added: 0, removed: 0, unchanged: 0 };
  const displayLines = showUnchanged ? diff! : diff!.filter(l => l.type !== 'same');

  return (
    <div className="space-y-2">
      {/* Stats bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="text-[10px] gap-1">
          <GitCompareArrows className="w-3 h-3" />
          vs {previousDate ? new Date(previousDate).toLocaleDateString() : '—'}
        </Badge>
        <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30 text-[10px]">
          <Plus className="w-3 h-3 mr-0.5" />{stats.added}
        </Badge>
        <Badge className="bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30 text-[10px]">
          <Minus className="w-3 h-3 mr-0.5" />{stats.removed}
        </Badge>
        <Badge variant="secondary" className="text-[10px]">
          {stats.unchanged} unchanged
        </Badge>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          className="text-[10px] h-6 px-2"
          onClick={() => setShowUnchanged(!showUnchanged)}
        >
          {showUnchanged ? 'Hide' : 'Show'} unchanged
        </Button>
      </div>

      {/* Diff lines */}
      <ScrollArea className="max-h-[300px] rounded border border-border">
        <div className="font-mono text-[11px] leading-5">
          {displayLines.map((line, i) => (
            <div
              key={i}
              className={`px-2 flex gap-2 ${
                line.type === 'added'
                  ? 'bg-green-500/10 text-green-800 dark:text-green-300'
                  : line.type === 'removed'
                  ? 'bg-red-500/10 text-red-800 dark:text-red-300 line-through'
                  : 'text-muted-foreground'
              }`}
            >
              <span className="w-4 flex-shrink-0 text-right select-none opacity-50">
                {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
              </span>
              <span className="whitespace-pre-wrap break-all">{line.content || '\u00A0'}</span>
            </div>
          ))}
          {displayLines.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              All lines unchanged. Click "Show unchanged" to see full content.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
