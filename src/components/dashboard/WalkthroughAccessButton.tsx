import { useState, useEffect } from 'react';
import { Presentation, Send, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const requestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  organization: z.string().trim().max(200).optional(),
  role: z.string().trim().max(100).optional(),
  reason: z.string().trim().max(500).optional(),
});

type AccessStatus = 'loading' | 'none' | 'pending' | 'approved' | 'denied';

// Rate limiting: one request per email per hour
const RATE_LIMIT_KEY = 'walkthrough_request_last_submitted';
const RATE_LIMIT_MS = 60 * 60 * 1000; // 1 hour

const checkClientRateLimit = (): boolean => {
  const lastSubmitted = localStorage.getItem(RATE_LIMIT_KEY);
  if (!lastSubmitted) return true;
  
  const elapsed = Date.now() - parseInt(lastSubmitted, 10);
  return elapsed > RATE_LIMIT_MS;
};

const setClientRateLimit = () => {
  localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
};

export const WalkthroughAccessButton = () => {
  const { user } = useAuth();
  const [accessStatus, setAccessStatus] = useState<AccessStatus>('loading');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    reason: '',
  });

  // Check access status on mount
  useEffect(() => {
    checkAccessStatus();
  }, [user]);

  const checkAccessStatus = async () => {
    if (!user?.email) {
      setAccessStatus('none');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('walkthrough_access_requests')
        .select('status')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error checking access:', error);
        setAccessStatus('none');
        return;
      }

      if (!data) {
        setAccessStatus('none');
      } else if (data.status === 'approved') {
        setAccessStatus('approved');
      } else if (data.status === 'pending') {
        setAccessStatus('pending');
      } else {
        setAccessStatus('denied');
      }
    } catch (err) {
      console.error('Error checking access:', err);
      setAccessStatus('none');
    }
  };

  const handleSubmitRequest = async () => {
    // Client-side rate limiting
    if (!checkClientRateLimit()) {
      toast.error('Please wait before submitting another request. Try again in an hour.');
      return;
    }

    // Validate form
    const result = requestSchema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        name: formData.name.trim(),
        email: formData.email.trim() || user?.email || '',
        organization: formData.organization.trim() || null,
        role: formData.role.trim() || null,
        reason: formData.reason.trim() || null,
      };

      const { error } = await supabase
        .from('walkthrough_access_requests')
        .insert(requestData);

      if (error) {
        if (error.code === '23505') {
          toast.error('A request with this email already exists');
        } else {
          toast.error('Failed to submit request. Please try again.');
        }
        return;
      }

      // Send email notification to admin (fire and forget)
      supabase.functions.invoke('send-walkthrough-notification', {
        body: requestData,
      }).then(({ error: notifyError }) => {
        if (notifyError) {
          console.error('Failed to send notification email:', notifyError);
        }
      });

      // Set rate limit after successful submission
      setClientRateLimit();
      
      toast.success('Access request submitted! You will be notified when approved.');
      setShowRequestModal(false);
      setAccessStatus('pending');
    } catch (err) {
      toast.error('Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-fill email from user
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  // Loading state
  if (accessStatus === 'loading') {
    return (
      <Button variant="outline" size="sm" disabled className="gap-1.5 text-xs">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span className="hidden md:inline">Loading...</span>
      </Button>
    );
  }

  // Approved - show walkthrough button
  if (accessStatus === 'approved') {
    return (
      <Button
        onClick={() => window.location.href = '/presentation'}
        variant="outline"
        size="sm"
        className="gap-1.5 bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 text-xs"
      >
        <Presentation className="w-3.5 h-3.5" />
        <span className="hidden md:inline">45-Min Walkthrough</span>
        <span className="md:hidden">Demo</span>
      </Button>
    );
  }

  // Pending - show status
  if (accessStatus === 'pending') {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="gap-1.5 text-xs bg-amber-500/10 border-amber-500/30 text-amber-600"
      >
        <Clock className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Request Pending</span>
        <span className="md:hidden">Pending</span>
      </Button>
    );
  }

  // None or denied - show request button
  return (
    <>
      <Button
        onClick={() => setShowRequestModal(true)}
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs"
      >
        <Send className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Request Zoom Walkthrough</span>
        <span className="md:hidden">Request</span>
      </Button>

      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Presentation className="w-5 h-5 text-primary" />
              Request Walkthrough Access
            </DialogTitle>
            <DialogDescription>
              Submit a request to access the 45-minute guided walkthrough of the CareGuard Clinical Dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                placeholder="Hospital, University, etc."
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Input
                id="role"
                placeholder="Nurse, Researcher, Administrator, etc."
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Why are you interested? (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Brief description of your interest..."
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                maxLength={500}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRequestModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
