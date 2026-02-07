import { useState, useEffect } from 'react';
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
    const remembered = localStorage.getItem('nso_remember_email');
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
        localStorage.setItem('nso_remember_email', result.data.email);
      } else {
        localStorage.removeItem('nso_remember_email');
      }
      toast.success('Welcome back!');
    }
    setIsSigningIn(false);
  };

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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <main className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">VitaSignal</h1>
            </div>
            <p className="text-muted-foreground">Sign in to access the dashboard</p>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in with credentials provided by your administrator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gate-email">Email</Label>
                  <Input
                    id="gate-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gate-password">Password</Label>
                  <PasswordInput
                    id="gate-password"
                    value={loginPassword}
                    onChange={setLoginPassword}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="gate-remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="gate-remember" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isSigningIn}>
                  {isSigningIn ? 'Signing in...' : 'Sign In'}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/#request-demo" className="text-primary hover:underline">
                    Request demo access
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Secure Authentication</span>
            </div>
            <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
          </div>
        </main>
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
