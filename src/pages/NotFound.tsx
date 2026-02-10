import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, FileText, AlertTriangle, Activity, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import heroBg from '@/assets/hero-bg.jpg';

const suggestedLinks = [
  { to: '/', icon: Home, label: 'Home', description: 'Return to landing page' },
  { to: '/dashboard', icon: Activity, label: 'Dashboard', description: 'Clinical intelligence demo' },
  { to: '/patents', icon: FileText, label: 'Patents', description: 'Technology portfolio' },
  { to: '/contact', icon: FileText, label: 'Contact', description: 'Get in touch' },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-foreground text-primary-foreground flex flex-col">
      <Helmet>
        <title>Page Not Found | VitaSignal</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      {/* Full-screen dark hero 404 */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground" />

        <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10 opacity-60 hover:opacity-100 transition-opacity">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-display text-lg">VitaSignal</span>
          </Link>

          {/* 404 Number */}
          <div className="relative mb-8">
            <div className="text-[140px] sm:text-[180px] font-bold text-primary/10 leading-none select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl mb-3">Page Not Found</h1>
          <p className="text-primary-foreground/60 mb-10 text-sm">
            <code className="px-1.5 py-0.5 rounded bg-primary-foreground/10 text-xs">{location.pathname}</code>{' '}
            doesn't exist or has been moved.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button asChild variant="default" size="lg">
              <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" />Back to Home</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
            {suggestedLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 p-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 hover:border-primary/30 hover:bg-primary/10 transition-all text-sm"
              >
                <link.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-primary-foreground/70">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Bug report */}
          <p className="text-xs text-primary-foreground/30 mt-10">
            Think this is a bug?{' '}
            <a
              href={`mailto:info@alexiscollier.com?subject=Broken Link Report&body=Path: ${location.pathname}%0AReferrer: ${document.referrer || 'Direct'}`}
              className="text-primary/70 hover:text-primary hover:underline"
            >
              Report this issue
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
