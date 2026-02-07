import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home, Search, BarChart3, FileText, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SiteLayout } from '@/components/layout/SiteLayout';

const suggestedLinks = [
  { to: '/', icon: Home, label: 'Home', description: 'Return to landing page' },
  { to: '/about', icon: FileText, label: 'About', description: 'About Dr. Collier' },
  { to: '/patents', icon: FileText, label: 'Patents', description: 'Technology portfolio' },
  { to: '/contact', icon: FileText, label: 'Contact', description: 'Get in touch' },
];

const NotFound = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/dashboard?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <SiteLayout title="Page Not Found" description="The page you're looking for doesn't exist.">
      <div className="flex-1 flex items-center justify-center p-6 py-24">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Error Illustration */}
          <div className="relative">
            <div className="text-[180px] font-bold text-primary/10 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">Page Not Found</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              The page <code className="px-1.5 py-0.5 rounded bg-secondary text-sm">{location.pathname}</code> doesn't exist or has been moved.
            </p>
          </div>

          {/* Suggested Links */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Try one of these pages:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {suggestedLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <link.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{link.label}</h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Report Link */}
          <p className="text-xs text-muted-foreground">
            Think this is a bug?{' '}
            <a
              href={`mailto:info@alexiscollier.com?subject=Broken Link Report&body=I found a broken link:%0A%0APath: ${location.pathname}%0AReferrer: ${document.referrer || 'Direct'}`}
              className="text-primary hover:underline"
            >
              Report this issue
            </a>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
};

export default NotFound;
