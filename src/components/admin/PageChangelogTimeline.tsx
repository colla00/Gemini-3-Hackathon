import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { History, ArrowRight, Equal, GitCompareArrows, Shield, Loader2, Heading1 } from 'lucide-react';
import { ArchiveDiffView } from './ArchiveDiffView';

interface TimelineSnapshot {
  id: string;
  captured_at: string;
  content_hash: string;
  trigger_type: string;
  notes: string | null;
  metadata: Record<string, unknown> | null;
}

interface PageChangelogTimelineProps {
  pageUrl: string;
  pageLabel: string;
}

type TmEvidence = {
  brand_mentions?: Record<string, number>;
  total_brand_mentions?: number;
};

type Headings = {
  h1?: string[];
  h2?: string[];
  h3?: string[];
  h4?: string[];
};

export const PageChangelogTimeline = ({ pageUrl, pageLabel }: PageChangelogTimelineProps) => {
  const [snapshots, setSnapshots] = useState<TimelineSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_archives')
      .select('id, captured_at, content_hash, trigger_type, notes, metadata')
      .eq('page_url', pageUrl)
      .order('captured_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setSnapshots(data as unknown as TimelineSnapshot[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [pageUrl]);

  // Compute change markers — compare each snapshot to the one after it (older)
  const entries = snapshots.map((snap, idx) => {
    const older = idx < snapshots.length - 1 ? snapshots[idx + 1] : null;
    const changed = older ? snap.content_hash !== older.content_hash : null; // null = first ever
    return { ...snap, changed, olderHash: older?.content_hash ?? null };
  });

  const changeCount = entries.filter(e => e.changed === true).length;
  const totalSnapshots = entries.length;

  const getTriggerLabel = (type: string) => {
    switch (type) {
      case 'scheduled': return 'Scheduled';
      case 'milestone': return 'Milestone';
      default: return 'Manual';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs h-7 px-2 gap-1" title={`View changelog for ${pageLabel}`}>
          <History className="w-3.5 h-3.5" />
          Changelog
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <History className="w-4 h-4 text-primary" />
            Changelog — {pageLabel}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading snapshots...
          </div>
        ) : totalSnapshots === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No snapshots found for this page.</p>
        ) : (
          <div className="space-y-3">
            {/* Summary */}
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">{totalSnapshots} snapshots</Badge>
              <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                {changeCount} content change{changeCount !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {totalSnapshots - changeCount - (entries.some(e => e.changed === null) ? 1 : 0)} unchanged
              </Badge>
            </div>

            <Separator />

            {/* Timeline */}
            <ScrollArea className="max-h-[55vh]">
              <div className="relative pl-6 space-y-0">
                {/* Vertical line */}
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />

                {entries.map((entry, idx) => {
                  const meta = entry.metadata;
                  const tm = meta?.trademark_evidence as TmEvidence | undefined;
                  const brandCount = tm?.total_brand_mentions ?? 0;
                  const headings = meta?.headings as Headings | undefined;
                  const headingTotal = (headings?.h1?.length ?? 0) + (headings?.h2?.length ?? 0) + (headings?.h3?.length ?? 0) + (headings?.h4?.length ?? 0);
                  const isExpanded = expandedId === entry.id;
                  const isFirst = entry.changed === null;

                  return (
                    <div key={entry.id} className="relative pb-4">
                      {/* Dot */}
                      <div className={`absolute -left-6 top-1 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                        isFirst
                          ? 'border-primary bg-primary/20'
                          : entry.changed
                          ? 'border-primary bg-primary/20'
                          : 'border-muted-foreground/30 bg-background'
                      }`}>
                        {isFirst ? (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        ) : entry.changed ? (
                          <ArrowRight className="w-2.5 h-2.5 text-primary" />
                        ) : (
                          <Equal className="w-2.5 h-2.5 text-muted-foreground/50" />
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className={`rounded-lg border p-3 cursor-pointer transition-colors hover:bg-secondary/30 ${
                          entry.changed ? 'border-primary/30 bg-primary/5' : 'border-border'
                        }`}
                        onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium">
                              {new Date(entry.captured_at).toLocaleDateString(undefined, {
                                month: 'short', day: 'numeric', year: 'numeric',
                              })}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(entry.captured_at).toLocaleTimeString(undefined, {
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {isFirst && (
                              <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] px-1 py-0">
                                First
                              </Badge>
                            )}
                            {entry.changed === true && (
                              <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] px-1 py-0">
                                Changed
                              </Badge>
                            )}
                            {entry.changed === false && (
                              <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                Same
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Meta row */}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <code className="text-[10px] bg-secondary/50 px-1 py-0.5 rounded font-mono text-muted-foreground">
                            {entry.content_hash.substring(0, 10)}…
                          </code>
                          <Badge variant="outline" className="text-[10px] px-1 py-0">
                            {getTriggerLabel(entry.trigger_type)}
                          </Badge>
                          {brandCount > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 gap-0.5">
                              <Shield className="w-2.5 h-2.5" />{brandCount}
                            </Badge>
                          )}
                          {headingTotal > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 gap-0.5">
                              <Heading1 className="w-2.5 h-2.5" />{headingTotal}
                            </Badge>
                          )}
                        </div>

                        {entry.notes && (
                          <p className="text-[10px] text-muted-foreground mt-1 truncate">{entry.notes}</p>
                        )}

                        {/* Expanded: show diff */}
                        {isExpanded && !isFirst && (
                          <div className="mt-3 border-t border-border pt-3">
                            <ArchiveDiffView
                              currentArchiveId={entry.id}
                              pageUrl={pageUrl}
                              capturedAt={entry.captured_at}
                            />
                          </div>
                        )}

                        {isExpanded && isFirst && (
                          <p className="mt-3 text-[10px] text-muted-foreground italic border-t border-border pt-2">
                            This is the earliest snapshot — no previous version to compare.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
