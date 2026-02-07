import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShieldX, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteLayout } from '@/components/layout/SiteLayout';
import heroBg from '@/assets/hero-bg.jpg';

interface DemoAccessGateProps {
  children: React.ReactNode;
}

type AccessStatus = 'loading' | 'approved' | 'pending' | 'denied' | 'none';

const DemoAccessGate = ({ children }: DemoAccessGateProps) => {
  const { user, loading, isAdmin } = useAuth();
  const [accessStatus, setAccessStatus] = useState<AccessStatus>('loading');

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    // Admins always have access
    if (isAdmin) {
      setAccessStatus('approved');
      return;
    }

    // Check if user has an approved demo access request
    const checkAccess = async () => {
      const { data, error } = await supabase
        .from('walkthrough_access_requests')
        .select('status')
        .eq('email', user.email ?? '')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error || !data || data.length === 0) {
        setAccessStatus('none');
        return;
      }

      const status = data[0].status;
      if (status === 'approved') {
        setAccessStatus('approved');
      } else if (status === 'pending') {
        setAccessStatus('pending');
      } else {
        setAccessStatus('denied');
      }
    };

    checkAccess();
  }, [user, loading, isAdmin]);

  if (loading || accessStatus === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (accessStatus === 'approved') {
    return <>{children}</>;
  }

  // Show access denied / pending page
  return (
    <SiteLayout title="Demo Access" description="Access to the technology demonstration requires approval.">
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
          {accessStatus === 'pending' ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl mb-4">Access Pending</h1>
              <p className="text-lg opacity-80 leading-relaxed mb-8 max-w-lg mx-auto">
                Your demo access request has been received and is awaiting review.
                You'll receive an email once your access has been approved.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-destructive/20 border border-destructive/30 flex items-center justify-center mx-auto mb-6">
                <ShieldX className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl mb-4">
                {accessStatus === 'denied' ? 'Access Denied' : 'Demo Access Required'}
              </h1>
              <p className="text-lg opacity-80 leading-relaxed mb-8 max-w-lg mx-auto">
                {accessStatus === 'denied'
                  ? 'Your demo access request was not approved. Please contact us for more information.'
                  : 'Access to the technology demo requires an approved request. Please request a demo walkthrough to get started.'}
              </p>
            </>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            {accessStatus !== 'pending' && (
              <Button asChild>
                <a href="mailto:info@alexiscollier.com">Contact for Access</a>
              </Button>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default DemoAccessGate;
