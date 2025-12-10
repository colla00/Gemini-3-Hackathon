import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Presentation, CheckCircle, XCircle, Clock, RefreshCw, Mail } from 'lucide-react';

interface WalkthroughRequest {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  role: string | null;
  reason: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
}

export const WalkthroughRequestsPanel = () => {
  const [requests, setRequests] = useState<WalkthroughRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('walkthrough_access_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load requests');
      console.error('Error fetching requests:', error);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  const updateRequestStatus = async (id: string, status: 'approved' | 'denied') => {
    setProcessingId(id);
    
    const { error } = await supabase
      .from('walkthrough_access_requests')
      .update({ 
        status, 
        reviewed_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      toast.error(`Failed to ${status} request`);
      console.error('Error updating request:', error);
    } else {
      toast.success(`Request ${status}`);
      fetchRequests();
    }
    setProcessingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'denied':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Denied</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Presentation className="h-5 w-5 text-emerald-500" />
            <CardTitle>Walkthrough Access Requests</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 border-amber-500/30">
                {pendingCount} pending
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        <CardDescription>
          Review and manage walkthrough access requests from potential users
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No walkthrough requests yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>
                    <a 
                      href={`mailto:${request.email}`} 
                      className="text-primary hover:underline"
                    >
                      {request.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {request.organization || '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {request.role || '—'}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(request.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {request.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-600 hover:bg-emerald-500/10"
                          onClick={() => updateRequestStatus(request.id, 'approved')}
                          disabled={processingId === request.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => updateRequestStatus(request.id, 'denied')}
                          disabled={processingId === request.id}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Deny
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {request.reviewed_at 
                          ? `Reviewed ${new Date(request.reviewed_at).toLocaleDateString()}`
                          : '—'
                        }
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
