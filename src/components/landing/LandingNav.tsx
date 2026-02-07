import { Link } from 'react-router-dom';
import { Lock, Mail, Activity } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { PATENTS_FILED_LABEL } from '@/constants/patent';

export const LandingNav = () => {
  const { isAdmin } = useAuth();

  return (
    <nav aria-label="Patent and user information" className="bg-primary/5 border-b border-primary/20 py-2 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-primary">
          <Lock className="w-3 h-3" aria-hidden="true" />
          <span className="font-medium">{PATENTS_FILED_LABEL}</span>
          <span className="text-primary/60" aria-hidden="true">•</span>
          <a
            href="mailto:info@alexiscollier.com"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30 transition-colors font-medium"
          >
            <Mail className="w-3 h-3" aria-hidden="true" />
            Licensing Inquiries
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/presentation" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
            Walkthrough
          </Link>
          <ThemeToggle />
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-risk-low/20 border border-risk-low/30 hover:bg-risk-low/30 transition-colors"
              >
                <Activity className="w-3 h-3 text-risk-low" />
                <span className="text-xs font-medium text-risk-low">Dashboard</span>
              </Link>
              <Link
                to="/auth"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={async (e) => {
                  e.preventDefault();
                  const { supabase } = await import('@/integrations/supabase/client');
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
              >
                Sign Out
              </Link>
            </div>
          ) : (
            <Link to="/auth" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
