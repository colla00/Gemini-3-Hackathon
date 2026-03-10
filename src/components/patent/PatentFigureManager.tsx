import { useState, useEffect, useCallback } from 'react';
import { Upload, GripVertical, Trash2, Loader2, Image, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PATENT_PORTFOLIO } from '@/constants/patent';

interface PatentFigure {
  id: string;
  patent_id: string;
  figure_number: number;
  file_path: string;
  file_name: string;
  file_size: number | null;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export const PatentFigureManager = () => {
  const [selectedPatent, setSelectedPatent] = useState(PATENT_PORTFOLIO[0].id);
  const [figures, setFigures] = useState<PatentFigure[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionDraft, setCaptionDraft] = useState('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchFigures = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('patent_figures')
      .select('*')
      .eq('patent_id', selectedPatent)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching figures:', error);
    } else {
      setFigures((data as PatentFigure[]) || []);
      // Fetch signed URLs
      const urls: Record<string, string> = {};
      await Promise.all(
        (data || []).map(async (fig: PatentFigure) => {
          const { data: urlData } = await supabase.storage
            .from('patent-figures')
            .createSignedUrl(fig.file_path, 3600);
          if (urlData) urls[fig.id] = urlData.signedUrl;
        })
      );
      setSignedUrls(urls);
    }
    setIsLoading(false);
  }, [selectedPatent]);

  useEffect(() => {
    fetchFigures();
  }, [fetchFigures]);

  const getNextFigureNumber = () => {
    if (figures.length === 0) return 1;
    return Math.max(...figures.map(f => f.figure_number)) + 1;
  };

  const handleUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      toast({ title: 'Invalid files', description: 'Please upload image files only.', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    let nextNum = getNextFigureNumber();
    let nextOrder = figures.length;

    for (const file of fileArray) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: 'File too large', description: `${file.name} exceeds 10MB limit.`, variant: 'destructive' });
        continue;
      }

      const ext = file.name.split('.').pop();
      const filePath = `${selectedPatent}/fig-${nextNum}-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('patent-figures')
        .upload(filePath, file);

      if (uploadErr) {
        toast({ title: 'Upload failed', description: uploadErr.message, variant: 'destructive' });
        continue;
      }

      const { error: dbErr } = await supabase
        .from('patent_figures')
        .insert({
          patent_id: selectedPatent,
          figure_number: nextNum,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
          sort_order: nextOrder,
          caption: `FIG. ${nextNum}`,
        });

      if (dbErr) {
        toast({ title: 'DB error', description: dbErr.message, variant: 'destructive' });
        continue;
      }

      nextNum++;
      nextOrder++;
    }

    toast({ title: 'Figures uploaded', description: `${fileArray.length} figure(s) added.` });
    setIsUploading(false);
    fetchFigures();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) handleUpload(e.target.files);
  };

  const handleDeleteFigure = async (fig: PatentFigure) => {
    await supabase.storage.from('patent-figures').remove([fig.file_path]);
    await supabase.from('patent_figures').delete().eq('id', fig.id);
    toast({ title: 'Figure deleted' });
    fetchFigures();
  };

  const handleSaveCaption = async (figId: string) => {
    await supabase.from('patent_figures').update({ caption: captionDraft }).eq('id', figId);
    setEditingCaption(null);
    fetchFigures();
  };

  const handleReorder = async (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    const reordered = [...figures];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    // Renumber
    const updates = reordered.map((fig, i) => ({
      id: fig.id,
      sort_order: i,
      figure_number: i + 1,
      caption: fig.caption?.startsWith('FIG.') ? `FIG. ${i + 1}` : fig.caption,
    }));

    setFigures(reordered.map((fig, i) => ({
      ...fig,
      sort_order: i,
      figure_number: i + 1,
      caption: fig.caption?.startsWith('FIG.') ? `FIG. ${i + 1}` : fig.caption ?? null,
    })));

    for (const u of updates) {
      await supabase.from('patent_figures').update({
        sort_order: u.sort_order,
        figure_number: u.figure_number,
        caption: u.caption,
      }).eq('id', u.id);
    }
  };

  const selectedPatentInfo = PATENT_PORTFOLIO.find(p => p.id === selectedPatent);

  return (
    <div className="space-y-6">
      {/* Patent selector */}
      <div className="space-y-2">
        <Label>Select Patent Application</Label>
        <Select value={selectedPatent} onValueChange={setSelectedPatent}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PATENT_PORTFOLIO.map(p => (
              <SelectItem key={p.id} value={p.id}>
                {p.shortName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedPatentInfo && (
          <p className="text-xs text-muted-foreground">
            {selectedPatentInfo.title}
          </p>
        )}
      </div>

      {/* Upload area */}
      <div
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
          isUploading && 'pointer-events-none opacity-50'
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="figure-upload"
          disabled={isUploading}
        />
        <label htmlFor="figure-upload" className="cursor-pointer flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading figures...</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm font-medium">Drop figures here or click to upload</span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG, SVG up to 10MB each • Multiple files supported • Auto-numbered as FIG. 1, FIG. 2...
              </span>
            </>
          )}
        </label>
      </div>

      {/* Figures grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : figures.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No figures uploaded for this patent yet.</p>
          <p className="text-xs">Upload drawings, flowcharts, or system diagrams above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">
            {figures.length} figure{figures.length !== 1 ? 's' : ''} • Drag to reorder (auto-renumbers)
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {figures.map((fig, idx) => (
              <Card
                key={fig.id}
                draggable
                onDragStart={() => setDraggedIdx(idx)}
                onDragOver={e => { e.preventDefault(); setDragOverIdx(idx); }}
                onDragEnd={() => {
                  if (draggedIdx !== null && dragOverIdx !== null) {
                    handleReorder(draggedIdx, dragOverIdx);
                  }
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                className={cn(
                  'transition-all cursor-grab active:cursor-grabbing',
                  dragOverIdx === idx && draggedIdx !== idx && 'ring-2 ring-primary',
                  draggedIdx === idx && 'opacity-50'
                )}
              >
                <CardHeader className="p-3 pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-semibold">
                        FIG. {fig.figure_number}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteFigure(fig)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  <div className="aspect-[4/3] rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    {signedUrls[fig.id] ? (
                      <img
                        src={signedUrls[fig.id]}
                        alt={fig.caption || `FIG. ${fig.figure_number}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    )}
                  </div>

                  {/* Caption editor */}
                  {editingCaption === fig.id ? (
                    <div className="flex gap-1">
                      <Input
                        value={captionDraft}
                        onChange={e => setCaptionDraft(e.target.value)}
                        className="h-7 text-xs"
                        placeholder="Enter caption..."
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSaveCaption(fig.id);
                          if (e.key === 'Escape') setEditingCaption(null);
                        }}
                      />
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleSaveCaption(fig.id)}>
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingCaption(null)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingCaption(fig.id); setCaptionDraft(fig.caption || ''); }}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                    >
                      <Pencil className="w-3 h-3 shrink-0" />
                      <span className="truncate">{fig.caption || 'Add caption...'}</span>
                    </button>
                  )}

                  <p className="text-[10px] text-muted-foreground truncate">{fig.file_name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
