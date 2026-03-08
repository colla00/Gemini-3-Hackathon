import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useAuditLog } from '@/hooks/useAuditLog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload, FileText, Download, Trash2, Shield, Clock, Eye, Lock, FolderOpen, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface DataRoomDocument {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  uploaded_by: string | null;
  uploaded_at: string;
  is_confidential: boolean;
  sort_order: number;
}

interface AccessLog {
  id: string;
  document_id: string;
  user_id: string;
  user_email: string | null;
  action: string;
  created_at: string;
}

const CATEGORIES = [
  { value: 'patent-filings', label: 'Patent Filings' },
  { value: 'financial', label: 'Financial Documents' },
  { value: 'legal', label: 'Legal Agreements' },
  { value: 'technical', label: 'Technical Documentation' },
  { value: 'regulatory', label: 'Regulatory Submissions' },
  { value: 'investor-materials', label: 'Investor Materials' },
  { value: 'general', label: 'General' },
];

const categoryIcon = (cat: string) => {
  switch (cat) {
    case 'patent-filings': return '📋';
    case 'financial': return '💰';
    case 'legal': return '⚖️';
    case 'technical': return '🔬';
    case 'regulatory': return '🏥';
    case 'investor-materials': return '📊';
    default: return '📁';
  }
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DataRoom = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { logAction } = useAuditLog();

  const [documents, setDocuments] = useState<DataRoomDocument[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Upload form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isConfidential, setIsConfidential] = useState(true);

  const fetchDocuments = useCallback(async () => {
    const { data, error } = await supabase
      .from('dataroom_documents')
      .select('*')
      .order('category')
      .order('sort_order');
    if (!error && data) setDocuments(data as DataRoomDocument[]);
    setLoading(false);
  }, []);

  const fetchAccessLogs = useCallback(async () => {
    if (!isAdmin) return;
    const { data, error } = await supabase
      .from('dataroom_access_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error && data) setAccessLogs(data as AccessLog[]);
  }, [isAdmin]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    if (user) {
      fetchDocuments();
      fetchAccessLogs();
      logAction({ action: 'view', resource_type: 'about_page', details: { page: 'dataroom' } });
    }
  }, [user, authLoading, navigate, fetchDocuments, fetchAccessLogs]);

  const handleUpload = async () => {
    if (!newTitle || !newFile) {
      toast({ title: 'Missing fields', description: 'Title and file are required.', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      const fileExt = newFile.name.split('.').pop();
      const filePath = `${newCategory}/${Date.now()}-${newFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('dataroom')
        .upload(filePath, newFile, { contentType: newFile.type });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('dataroom_documents')
        .insert({
          title: newTitle,
          description: newDescription || null,
          category: newCategory,
          file_path: filePath,
          file_name: newFile.name,
          file_size: newFile.size,
          uploaded_by: user!.id,
          is_confidential: isConfidential,
        });

      if (insertError) throw insertError;

      toast({ title: 'Document uploaded', description: `"${newTitle}" added to data room.` });
      setUploadDialogOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewCategory('general');
      setNewFile(null);
      setIsConfidential(true);
      fetchDocuments();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: DataRoomDocument) => {
    if (!doc.file_path) return;

    // Log the access
    await supabase.from('dataroom_access_logs').insert({
      document_id: doc.id,
      user_id: user!.id,
      user_email: user!.email,
      action: 'download',
    });

    const { data, error } = await supabase.storage
      .from('dataroom')
      .createSignedUrl(doc.file_path, 60);

    if (error || !data?.signedUrl) {
      toast({ title: 'Download failed', description: 'Could not generate download link.', variant: 'destructive' });
      return;
    }

    window.open(data.signedUrl, '_blank');
  };

  const handleDelete = async (doc: DataRoomDocument) => {
    if (!confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;

    if (doc.file_path) {
      await supabase.storage.from('dataroom').remove([doc.file_path]);
    }
    await supabase.from('dataroom_documents').delete().eq('id', doc.id);
    toast({ title: 'Deleted', description: `"${doc.title}" removed.` });
    fetchDocuments();
  };

  // Group documents by category
  const grouped = documents.reduce<Record<string, DataRoomDocument[]>>((acc, doc) => {
    const cat = doc.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Secure Data Room</h1>
                <p className="text-sm text-muted-foreground">Confidential documents · VitaSignal IP Portfolio</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Lock className="h-3 w-3" />
                {isAdmin ? 'Admin Access' : 'View Only'}
              </Badge>
              {isAdmin && (
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                      <Upload className="h-4 w-4" /> Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload Document</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <Input
                        placeholder="Document title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <Textarea
                        placeholder="Description (optional)"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        rows={2}
                      />
                      <Select value={newCategory} onValueChange={setNewCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(c => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xlsx,.pptx"
                          onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                          className="w-full text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC, XLSX, PPTX · Max 20MB</p>
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={isConfidential}
                          onChange={(e) => setIsConfidential(e.target.checked)}
                          className="rounded"
                        />
                        Mark as confidential
                      </label>
                      <Button onClick={handleUpload} disabled={uploading || !newTitle || !newFile} className="w-full">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                        Upload
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                ← Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
        {/* NDA Warning */}
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-destructive">Confidential — NDA Required</p>
              <p className="text-muted-foreground">
                All documents in this data room are proprietary. Access is logged and monitored. 
                Unauthorized distribution is prohibited under applicable NDA terms.
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="documents">
          <TabsList>
            <TabsTrigger value="documents" className="gap-1">
              <FolderOpen className="h-4 w-4" /> Documents ({documents.length})
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="access-log" className="gap-1">
                <Eye className="h-4 w-4" /> Access Log ({accessLogs.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="documents" className="mt-6 space-y-6">
            {documents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">No documents uploaded yet.</p>
                  {isAdmin && <p className="text-sm text-muted-foreground mt-1">Use the "Upload Document" button to add files.</p>}
                </CardContent>
              </Card>
            ) : (
              Object.entries(grouped).map(([cat, docs]) => {
                const catLabel = CATEGORIES.find(c => c.value === cat)?.label || cat;
                return (
                  <div key={cat}>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span>{categoryIcon(cat)}</span> {catLabel}
                    </h2>
                    <div className="grid gap-3">
                      {docs.map(doc => (
                        <Card key={doc.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="flex items-center justify-between py-4 gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium truncate">{doc.title}</p>
                                  {doc.is_confidential && (
                                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                      <Lock className="h-2.5 w-2.5 mr-0.5" /> NDA
                                    </Badge>
                                  )}
                                </div>
                                {doc.description && (
                                  <p className="text-sm text-muted-foreground truncate">{doc.description}</p>
                                )}
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                  <span>{doc.file_name}</span>
                                  <span>{formatFileSize(doc.file_size)}</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(doc.uploaded_at), 'MMM d, yyyy')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {doc.file_path && (
                                <Button size="sm" variant="outline" onClick={() => handleDownload(doc)} className="gap-1">
                                  <Download className="h-3.5 w-3.5" /> Download
                                </Button>
                              )}
                              {isAdmin && (
                                <Button size="sm" variant="ghost" onClick={() => handleDelete(doc)} className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>

          {isAdmin && (
            <TabsContent value="access-log" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Document Access History</CardTitle>
                  <CardDescription>Track who accessed which documents and when</CardDescription>
                </CardHeader>
                <CardContent>
                  {accessLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No access events recorded yet.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Document</TableHead>
                          <TableHead>Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accessLogs.map(log => {
                          const doc = documents.find(d => d.id === log.document_id);
                          return (
                            <TableRow key={log.id}>
                              <TableCell className="text-sm">{log.user_email || log.user_id.slice(0, 8)}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-xs">{log.action}</Badge>
                              </TableCell>
                              <TableCell className="text-sm">{doc?.title || log.document_id.slice(0, 8)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default DataRoom;
