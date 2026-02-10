import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuditLog } from '@/hooks/useAuditLog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { Presentation, CheckCircle, XCircle, Clock, RefreshCw, Mail, ChevronDown, ChevronRight, Building, Briefcase, MessageSquare } from 'lucide-react';

interface DemoRequest {
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
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { logAction } = useAuditLog();

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
    
    const request = requests.find(r => r.id === id);

    try {
      const { data, error } = await supabase.functions.invoke('approve-demo-access', {
        body: {
          requestId: id,
          action: status,
        },
      });

      if (error) {
        toast.error(`Failed to ${status} request: ${error.message}`);
        setProcessingId(null);
        return;
      }

      await logAction({
        action: status === 'approved' ? 'approve' : 'reject',
        resource_type: 'walkthrough_request',
        resource_id: id,
        details: {
          requester_email: request?.email || '',
          requester_name: request?.name || '',
          new_status: status,
          account_created: data?.accountCreated || false,
        }
      });
      
      if (status === 'approved') {
        toast.success(
          data?.accountCreated 
            ? 'Approved! Account created and credentials emailed.' 
            : 'Approved! Credentials emailed.'
        );
      } else {
        toast.success('Request denied. Notification sent.');
      }
      
      fetchRequests();
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
    
    setProcessingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-primary/20 text-primary border-primary/30"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
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
            <Presentation className="h-5 w-5 text-primary" />
            <CardTitle>Demo Access Requests</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
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
          Review and manage demo access requests. Approved users can access the interactive technology demonstration. Click a row for details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No demo access requests yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {requests.map((request) => (
              <Collapsible
                key={request.id}
                open={expandedId === request.id}
                onOpenChange={() => setExpandedId(expandedId === request.id ? null : request.id)}
              >
                <div className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 hover:bg-secondary/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-muted-foreground">
                          {expandedId === request.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                          <div>
                            <p className="font-medium text-foreground">{request.name}</p>
                            <a 
                              href={`mailto:${request.email}`} 
                              className="text-sm text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {request.email}
                            </a>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request.organization || '-'}
                          </div>
                          <div>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-primary hover:bg-primary/10"
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
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-0 border-t bg-secondary/30">
                      <div className="grid md:grid-cols-3 gap-4 pt-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            <Building className="w-3 h-3" />
                            Organization
                          </div>
                          <p className="text-sm text-foreground">
                            {request.organization || 'Not provided'}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            <Briefcase className="w-3 h-3" />
                            Role
                          </div>
                          <p className="text-sm text-foreground">
                            {request.role || 'Not provided'}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            <Clock className="w-3 h-3" />
                            Timeline
                          </div>
                          <p className="text-sm text-foreground">
                            Requested: {new Date(request.created_at).toLocaleString()}
                          </p>
                          {request.reviewed_at && (
                            <p className="text-sm text-muted-foreground">
                              Reviewed: {new Date(request.reviewed_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {request.reason && (
                        <div className="mt-4 space-y-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            <MessageSquare className="w-3 h-3" />
                            Interest
                          </div>
                          <p className="text-sm text-foreground bg-background/50 p-3 rounded-md border">
                            {request.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
