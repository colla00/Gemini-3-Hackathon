import { useState, useEffect } from 'react';
import { Mail, Send, Users, Clock, CheckCircle2, XCircle, Loader2, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Invitation {
  id: string;
  witness_email: string;
  witness_name: string | null;
  status: string;
  invited_at: string;
  expires_at: string;
  invitation_token: string;
  completed_at: string | null;
  invited_by: string | null;
}

interface WitnessInvitationPanelProps {
  documentHash: string;
  documentVersion: string;
}

export const WitnessInvitationPanel = ({ documentHash, documentVersion }: WitnessInvitationPanelProps) => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    witnessEmail: '',
    witnessName: '',
    inviterName: ''
  });

  // Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Load existing invitations
  useEffect(() => {
    const loadInvitations = async () => {
      try {
        const { data, error } = await supabase
          .from('witness_invitations')
          .select('*')
          .eq('document_hash', documentHash)
          .order('invited_at', { ascending: false });

        if (error) throw error;
        setInvitations(data || []);
      } catch (err) {
        console.error('Failed to load invitations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInvitations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('invitation-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'witness_invitations',
        filter: `document_hash=eq.${documentHash}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setInvitations(prev => [payload.new as Invitation, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setInvitations(prev => prev.map(inv => 
            inv.id === (payload.new as Invitation).id ? payload.new as Invitation : inv
          ));
        } else if (payload.eventType === 'DELETE') {
          setInvitations(prev => prev.filter(inv => inv.id !== (payload.old as Invitation).id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentHash]);

  const handleSendInvitation = async () => {
    if (!formData.witnessEmail || !currentUserId) {
      if (!currentUserId) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in to send invitations.',
          variant: 'destructive'
        });
      }
      return;
    }

    setIsSending(true);
    try {
      // Create invitation in database - invited_by must be current user ID for RLS
      const { data: invitation, error: dbError } = await supabase
        .from('witness_invitations')
        .insert({
          document_hash: documentHash,
          document_version: documentVersion,
          witness_email: formData.witnessEmail,
          witness_name: formData.witnessName || null,
          invited_by: currentUserId, // Must be user ID for RLS policy
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('send-witness-invitation', {
        body: {
          witnessEmail: formData.witnessEmail,
          witnessName: formData.witnessName || 'Witness',
          invitedBy: formData.inviterName || 'Patent Documentation Team',
          invitationToken: invitation.invitation_token,
          documentHash,
          expiresAt: invitation.expires_at
        }
      });

      if (emailError) {
        console.warn('Email sending failed:', emailError);
      }

      toast({
        title: 'Invitation Sent',
        description: `Invitation email sent to ${formData.witnessEmail}`
      });

      setFormData({ witnessEmail: '', witnessName: '', inviterName: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to send invitation:', err);
      toast({
        title: 'Error',
        description: 'Failed to send invitation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/patent-evidence?key=patent2025&invite=${token}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link Copied',
      description: 'Invitation link copied to clipboard'
    });
  };

  const cancelInvitation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('witness_invitations')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Invitation Cancelled',
        description: 'The invitation has been cancelled'
      });
    } catch (err) {
      console.error('Failed to cancel invitation:', err);
    }
  };

  const getStatusBadge = (invitation: Invitation) => {
    const isExpired = new Date(invitation.expires_at) < new Date();
    
    if (invitation.status === 'completed') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-risk-low/20 text-risk-low flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </span>
      );
    }
    if (invitation.status === 'cancelled') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Cancelled
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-destructive/20 text-destructive flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Expired
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-500 flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const pendingCount = invitations.filter(i => 
    i.status === 'pending' && new Date(i.expires_at) > new Date()
  ).length;
  const completedCount = invitations.filter(i => i.status === 'completed').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-foreground">Witness Invitations</h3>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-500">
              {pendingCount} pending
            </span>
          )}
          {completedCount > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-risk-low/20 text-risk-low">
              {completedCount} completed
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Send className="w-3 h-3" />
          {showForm ? 'Cancel' : 'Invite Witness'}
        </Button>
      </div>

      {/* Invitation Form */}
      {showForm && (
        <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 mb-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Witness Email *</label>
            <input
              type="email"
              value={formData.witnessEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, witnessEmail: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground"
              placeholder="witness@example.com"
              disabled={isSending}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Witness Name (optional)</label>
              <input
                type="text"
                value={formData.witnessName}
                onChange={(e) => setFormData(prev => ({ ...prev, witnessName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground"
                placeholder="Dr. Jane Smith"
                disabled={isSending}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Your Name (optional)</label>
              <input
                type="text"
                value={formData.inviterName}
                onChange={(e) => setFormData(prev => ({ ...prev, inviterName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground"
                placeholder="Your name (for email)"
                disabled={isSending}
              />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">
            The witness will receive an email with a secure link to review and attest to the patent claims. 
            The invitation expires in 7 days.
          </p>
          <Button
            onClick={handleSendInvitation}
            disabled={!formData.witnessEmail || isSending || !currentUserId}
            className="w-full gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Invitation...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Invitation Email
              </>
            )}
          </Button>
        </div>
      )}

      {/* Invitations List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : invitations.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No invitations sent yet. Click "Invite Witness" to send an invitation.
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className={cn(
                "p-3 rounded-lg border transition-colors",
                invitation.status === 'completed' 
                  ? "bg-risk-low/5 border-risk-low/30" 
                  : "bg-secondary/30 border-border/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {invitation.witness_name || invitation.witness_email}
                    </span>
                    {getStatusBadge(invitation)}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {invitation.witness_email}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Invited: {new Date(invitation.invited_at).toLocaleDateString()}
                    {invitation.status === 'completed' && invitation.completed_at && (
                      <> • Completed: {new Date(invitation.completed_at).toLocaleDateString()}</>
                    )}
                    {invitation.status === 'pending' && (
                      <> • Expires: {new Date(invitation.expires_at).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
                {invitation.status === 'pending' && new Date(invitation.expires_at) > new Date() && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyInviteLink(invitation.invitation_token)}
                      className="h-7 w-7 p-0"
                      title="Copy invite link"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelInvitation(invitation.id)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      title="Cancel invitation"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
