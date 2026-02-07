import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Checkbox } from '@/components/ui/checkbox';
import { PasswordInput } from '@/components/PasswordInput';
import { toast } from 'sonner';
import { Activity, Shield, Users, ArrowLeft, Home } from 'lucide-react';
import { z } from 'zod';
import { ThemeToggle } from '@/components/ThemeToggle';

// Validation schemas
const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email is too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password is too long'),
});


const resetSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email is too long'),
});

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');


  // Reset password state
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error('Validation error', { description: firstError.message });
      return;
    }

    setIsLoading(true);

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
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = resetSchema.safeParse({ email: resetEmail });
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error('Validation error', { description: firstError.message });
      return;
    }

    setIsLoading(true);

    const { error } = await resetPassword(result.data.email);
    
    if (error) {
      toast.error('Reset failed', { description: error.message });
    } else {
      toast.success('Check your email', { description: 'We sent you a password reset link.' });
      setShowForgotPassword(false);
    }
    
    setIsLoading(false);
  };

  // Load remembered email on mount
  useState(() => {
    const remembered = localStorage.getItem('nso_remember_email');
    if (remembered) {
      setLoginEmail(remembered);
      setRememberMe(true);
    }
  });

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute top-4 left-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <main className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Activity className="h-8 w-8 text-primary" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-foreground">VitaSignal</h1>
            </div>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <form onSubmit={handleResetPassword}>
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                  Enter your email to receive a password reset link
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="nurse@hospital.org"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setShowForgotPassword(false)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                  Back to Sign In
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <main className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-8 w-8 text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-foreground">VitaSignal</h1>
          </div>
          <p className="text-muted-foreground">
            Clinical Intelligence Platform
          </p>
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
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="nurse@hospital.org"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <PasswordInput
                  id="login-password"
                  value={loginPassword}
                  onChange={setLoginPassword}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
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
            <Shield className="h-3 w-3" aria-hidden="true" />
            <span>Secure Authentication</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" aria-hidden="true" />
            <span>Role-Based Access</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
