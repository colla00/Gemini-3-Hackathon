import { useState, useEffect } from 'react';
import { setWithExpiry, getWithExpiry, removeManaged } from '@/lib/storageManager';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShieldX, Clock, ArrowLeft, Activity, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordInput } from '@/components/PasswordInput';
import { Checkbox } from '@/components/ui/checkbox';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { toast } from 'sonner';
import heroBg from '@/assets/hero-bg.jpg';
import { z } from 'zod';

interface DemoAccessGateProps {
  children: React.ReactNode;
}

type AccessStatus = 'loading' | 'approved' | 'pending' | 'denied' | 'none';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

const DemoAccessGate = ({ children }: DemoAccessGateProps) => {
  const { user, loading, isAdmin, signIn } = useAuth();
  const [accessStatus, setAccessStatus] = useState<AccessStatus>('loading');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const remembered = getWithExpiry<string>('nso_remember_email');
    if (remembered) {
      setLoginEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setAccessStatus('none');
      return;
    }

    if (isAdmin) {
      setAccessStatus('approved');
      return;
    }

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
      if (status === 'approved') setAccessStatus('approved');
      else if (status === 'pending') setAccessStatus('pending');
      else setAccessStatus('denied');
    };

    checkAccess();
  }, [user, loading, isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!result.success) {
      toast.error('Validation error', { description: result.error.errors[0].message });
      return;
    }
    setIsSigningIn(true);
    const { error } = await signIn(result.data.email, result.data.password);
    if (error) {
      toast.error('Login failed', { description: error.message });
    } else {
      if (rememberMe) {
        setWithExpiry('nso_remember_email', result.data.email);
      } else {
        removeManaged('nso_remember_email');
      }
      toast.success('Welcome back!');
    }
    setIsSigningIn(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur text-center">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">VitaSignal<sup className="text-[8px] align-super">™</sup></span>
            </div>
            <CardTitle className="text-xl">Clinical Dashboard — Access Restricted</CardTitle>
            <CardDescription className="text-sm mt-2">
              This dashboard is available to licensed partners and credentialed researchers. To request access, please contact us.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3 pt-0">
            <Button className="w-full" asChild>
              <a href="mailto:info@vitasignal.ai">Request Dashboard Access</a>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
            <p className="text-xs text-muted-foreground">Pre-Market · Patent Pending · Not a Medical Device</p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (accessStatus === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (accessStatus === 'approved') {
    return <>{children}</>;
  }

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
                <a href="mailto:info@vitasignal.ai">Contact for Access</a>
              </Button>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default DemoAccessGate;
