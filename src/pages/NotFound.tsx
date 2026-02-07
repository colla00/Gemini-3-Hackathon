import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, FileText, AlertTriangle } from 'lucide-react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import heroBg from '@/assets/hero-bg.jpg';

const suggestedLinks = [
  { to: '/', icon: Home, label: 'Home', description: 'Return to landing page' },
  { to: '/about', icon: FileText, label: 'About', description: 'About Dr. Collier' },
  { to: '/patents', icon: FileText, label: 'Patents', description: 'Technology portfolio' },
  { to: '/contact', icon: FileText, label: 'Contact', description: 'Get in touch' },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <SiteLayout title="Page Not Found" description="The page you're looking for doesn't exist.">
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-24 md:pb-20 text-center">
          <div className="relative mb-8">
            <div className="text-[180px] font-bold text-primary/10 leading-none select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4">Page Not Found</h1>
          <p className="opacity-70 max-w-md mx-auto">
            The page <code className="px-1.5 py-0.5 rounded bg-primary-foreground/10 text-sm">{location.pathname}</code> doesn't exist or has been moved.
          </p>
        </div>
      </section>

      {/* Suggested Links */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-sm text-muted-foreground text-center">Try one of these pages:</p>
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
          <p className="text-xs text-muted-foreground text-center">
            Think this is a bug?{' '}
            <a
              href={`mailto:info@alexiscollier.com?subject=Broken Link Report&body=I found a broken link:%0A%0APath: ${location.pathname}%0AReferrer: ${document.referrer || 'Direct'}`}
              className="text-primary hover:underline"
            >
              Report this issue
            </a>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default NotFound;
