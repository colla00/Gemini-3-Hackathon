import { useState, useEffect } from 'react';
import { Lock, ShieldCheck, AlertCircle, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEMO_PASSWORD = '413god!';
const AUTH_KEY = 'demo_authenticated';
const AUTH_EXPIRY_KEY = 'demo_auth_expiry';
const AUTH_EMAIL_KEY = 'demo_auth_email';
const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface PasswordGateProps {
  children: React.ReactNode;
}

export const PasswordGate = ({ children }: PasswordGateProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);

  // Check for existing authentication on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);
    
    if (stored === 'true' && expiry) {
      const expiryTime = parseInt(expiry, 10);
      if (Date.now() < expiryTime) {
        setIsAuthenticated(true);
      } else {
        // Clear expired auth
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(AUTH_EXPIRY_KEY);
        localStorage.removeItem(AUTH_EMAIL_KEY);
      }
    }
  }, []);

  // Handle lockout countdown
  useEffect(() => {
    if (lockCountdown > 0) {
      const timer = setTimeout(() => {
        setLockCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isLocked && lockCountdown === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [lockCountdown, isLocked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) return;

    if (password === DEMO_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(AUTH_EXPIRY_KEY, String(Date.now() + AUTH_DURATION));
      if (email) {
        localStorage.setItem(AUTH_EMAIL_KEY, email);
      }
      setError('');
      
      // Log authentication event with email
      const sessions = JSON.parse(localStorage.getItem('patent_evidence_sessions') || '[]');
      if (sessions.length > 0) {
        const currentSession = sessions[sessions.length - 1];
        currentSession.events.push({
          timestamp: new Date().toISOString(),
          type: 'interaction',
          details: `Successfully authenticated${email ? ` (${email})` : ''}`,
          route: window.location.pathname
        });
        // Store email in session for evidence
        if (email) {
          currentSession.identityInfo = {
            ...currentSession.identityInfo,
            email: email
          };
        }
        localStorage.setItem('patent_evidence_sessions', JSON.stringify(sessions));
      }
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError('Invalid access code');
      setPassword('');
      
      // Lock after 5 failed attempts
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockCountdown(30);
        setError('Too many failed attempts. Please wait 30 seconds.');
      }
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, hsl(var(--primary) / 0.05) 0%, transparent 50%)`,
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Protected Demo</h1>
            <p className="text-sm text-muted-foreground text-center">
              This prototype is patent pending and requires an access code to view.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email (optional, for identification) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email <span className="text-muted-foreground text-xs">(optional, for session tracking)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLocked}
                  placeholder="your@email.com"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-border/50",
                    isLocked && "opacity-50 cursor-not-allowed"
                  )}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Access Code
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                placeholder="Enter access code"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-secondary border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                  error ? "border-risk-high" : "border-border/50",
                  isLocked && "opacity-50 cursor-not-allowed"
                )}
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-2 mt-2 text-risk-high text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                  {isLocked && lockCountdown > 0 && (
                    <span className="ml-auto font-mono">{lockCountdown}s</span>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLocked || !password}
              className={cn(
                "w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                isLocked || !password
                  ? "bg-secondary text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Authenticate</span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">
              Patent Pending • Proprietary Technology
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © 2025 All Rights Reserved
            </p>
          </div>
        </div>

        {/* Hint for demo */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground/60">
            For Stanford AI+HEALTH presentation access, contact the presenter.
          </p>
        </div>
      </div>
    </div>
  );
};

// Export logout function for use elsewhere
export const logoutDemo = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_EXPIRY_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
  window.location.reload();
};
