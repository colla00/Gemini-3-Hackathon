import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  UserCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
  FileText,
  Loader2,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Attestation {
  id: string;
  witness_name: string;
  witness_title: string;
  organization: string | null;
  attested_at: string;
  document_hash: string;
  document_version: string;
  claims_count: number;
  signature: string;
  ip_address: string | null;
  created_at: string;
}

export const PatentAttestationsAdmin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!data) {
        toast({
          title: 'Access Denied',
          description: 'You need admin privileges to access this page.',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      loadAttestations();
    };

    checkAdminRole();
  }, [user, navigate, toast]);

  const loadAttestations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patent_attestations')
        .select('*')
        .order('attested_at', { ascending: false });

      if (error) throw error;
      setAttestations(data || []);
    } catch (error: any) {
      console.error('Error loading attestations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load attestations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAttestations = attestations.filter((a) => {
    const query = searchQuery.toLowerCase();
    return (
      a.witness_name.toLowerCase().includes(query) ||
      a.witness_title.toLowerCase().includes(query) ||
      (a.organization?.toLowerCase().includes(query) ?? false)
    );
  });

  const exportCSV = () => {
    const headers = ['Witness Name', 'Title', 'Organization', 'Date', 'Document Hash', 'Claims'];
    const rows = filteredAttestations.map((a) => [
      a.witness_name,
      a.witness_title,
      a.organization || '',
      new Date(a.attested_at).toLocaleString(),
      a.document_hash,
      a.claims_count.toString()
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attestations-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Patent Attestations Admin | NSO Quality Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Patent Attestations Admin</span>
              </div>
            </div>
            <Badge variant="outline" className="gap-1">
              <UserCheck className="w-3 h-3" />
              {attestations.length} Total
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <UserCheck className="w-4 h-4" />
              <span className="text-sm">Total Attestations</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{attestations.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">Organizations</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {new Set(attestations.map((a) => a.organization).filter(Boolean)).size}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Last 30 Days</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {attestations.filter((a) => {
                const date = new Date(a.attested_at);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return date > thirtyDaysAgo;
              }).length}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Document Versions</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {new Set(attestations.map((a) => a.document_version)).size}
            </p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, title, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredAttestations.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No attestations found</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Witness</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Document Hash</TableHead>
                  <TableHead>Claims</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttestations.map((attestation) => (
                  <TableRow key={attestation.id}>
                    <TableCell className="font-medium">{attestation.witness_name}</TableCell>
                    <TableCell>{attestation.witness_title}</TableCell>
                    <TableCell>{attestation.organization || '-'}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(attestation.attested_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-secondary px-2 py-1 rounded">
                        {attestation.document_hash}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{attestation.claims_count}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatentAttestationsAdmin;
