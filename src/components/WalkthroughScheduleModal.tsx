import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WalkthroughScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WalkthroughScheduleModal = ({ open, onOpenChange }: WalkthroughScheduleModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    preferredTime: '',
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setLoading(true);
    try {
      // Rate limit check
      const { data: rateCheck } = await supabase.rpc('check_rate_limit', {
        p_key: `walkthrough:${form.email}`,
        p_max_requests: 3,
        p_window_seconds: 3600,
      });

      if (rateCheck && !(rateCheck as any).allowed) {
        toast.error('Too many requests. Please try again later.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('walkthrough_access_requests').insert({
        name: form.name,
        email: form.email,
        organization: form.organization || null,
        role: form.role || null,
        reason: `Walkthrough requested. Preferred time: ${form.preferredTime || 'Flexible'}. Notes: ${form.reason || 'None'}`,
        status: 'pending',
      });

      if (error) throw error;

      // Send notification
      try {
        await supabase.functions.invoke('send-walkthrough-notification', {
          body: {
            name: form.name,
            email: form.email,
            organization: form.organization,
            role: form.role,
            reason: `Walkthrough request — Preferred: ${form.preferredTime || 'Flexible'}`,
          },
        });
      } catch {
        // Notification failure is non-critical
      }

      setSubmitted(true);
      toast.success('Walkthrough request submitted!');
    } catch (err) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (submitted) {
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', organization: '', role: '', preferredTime: '', reason: '' });
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-risk-low/10 border border-risk-low/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-risk-low" />
            </div>
            <DialogTitle className="text-lg">Walkthrough Request Received</DialogTitle>
            <p className="text-sm text-muted-foreground">
              We'll reach out to <strong>{form.email}</strong> to confirm a time.
              You'll receive a calendar invite with a secure meeting link.
            </p>
            <p className="text-xs text-muted-foreground">
              During the walkthrough, Dr. Collier will personally guide you through the VitaSignal™ platform and technology portfolio in a live session.
              This is separate from self-service dashboard access.
            </p>
            <Button onClick={handleClose} variant="outline" size="sm">Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-primary" />
                <DialogTitle className="text-base">Schedule a Walkthrough</DialogTitle>
              </div>
              <DialogDescription className="text-xs">
                Request a live guided walkthrough of the VitaSignal™ platform. You'll see the presentation while Dr. Collier provides commentary via your presenter screen.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="wt-name" className="text-xs">Full Name *</Label>
                  <Input
                    id="wt-name"
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Dr. Jane Smith"
                    required
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="wt-email" className="text-xs">Email *</Label>
                  <Input
                    id="wt-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="jane@hospital.org"
                    required
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="wt-org" className="text-xs">Organization</Label>
                  <Input
                    id="wt-org"
                    value={form.organization}
                    onChange={(e) => setForm(f => ({ ...f, organization: e.target.value }))}
                    placeholder="Mayo Clinic"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="wt-role" className="text-xs">Your Role</Label>
                  <Select value={form.role} onValueChange={(v) => setForm(f => ({ ...f, role: v }))}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investor">Investor</SelectItem>
                      <SelectItem value="licensing">Licensing Partner</SelectItem>
                      <SelectItem value="hospital-admin">Hospital Administrator</SelectItem>
                      <SelectItem value="cno">CNO / Nursing Executive</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="vendor">EHR / Health IT Vendor</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="wt-time" className="text-xs">Preferred Time</Label>
                <Select value={form.preferredTime} onValueChange={(v) => setForm(f => ({ ...f, preferredTime: v }))}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning-weekday">Weekday Mornings (9am–12pm ET)</SelectItem>
                    <SelectItem value="afternoon-weekday">Weekday Afternoons (1pm–5pm ET)</SelectItem>
                    <SelectItem value="evening-weekday">Weekday Evenings (5pm–7pm ET)</SelectItem>
                    <SelectItem value="flexible">Flexible — Any time works</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="wt-reason" className="text-xs">What interests you most?</Label>
                <Textarea
                  id="wt-reason"
                  value={form.reason}
                  onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Interested in licensing for our health system..."
                  rows={2}
                  className="text-sm resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <Button type="submit" disabled={loading} className="flex-1 gap-2">
                  <Clock className="w-4 h-4" />
                  {loading ? 'Submitting...' : 'Request Walkthrough'}
                </Button>
              </div>

              <p className="text-[10px] text-muted-foreground text-center">
                Walkthroughs are typically 30 minutes. A calendar invite will be sent upon confirmation.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
