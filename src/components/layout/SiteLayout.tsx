import { useState } from "react";
import { Activity, Menu, X, Linkedin, LogOut } from "lucide-react";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SiteLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
  { to: "/patents", label: "Patents" },
  { to: "/licensing", label: "Licensing" },
  { to: "/contact", label: "Contact" },
];

export const SiteLayout = ({ children, title, description }: SiteLayoutProps) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  const pageTitle = title ? `${title} | VitaSignal` : "VitaSignal | Clinical Intelligence";
  const pageDescription = description || "Equipment-independent AI for ICU mortality prediction. 5 U.S. patent applications filed. Available for licensing.";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      {/* Research Disclaimer */}
      <div className="bg-muted border-b border-border/40 px-4 py-1.5 text-center text-xs">
        <span className="text-muted-foreground">Pre-Market · Patent Pending · Not a Medical Device</span>
      </div>

      {/* Header */}
      <header className="border-b border-border/40 bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">VitaSignal</p>
                <p className="text-xs text-muted-foreground">Clinical Intelligence</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm transition-colors ${
                    location.pathname === link.to
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <ThemeToggle />
              {user ? (
                <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:info@alexiscollier.com">Get in Touch</a>
                </Button>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <nav className="md:hidden pt-4 pb-2 border-t border-border/40 mt-4 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm py-2.5 px-3 rounded-lg transition-colors ${
                    location.pathname === link.to
                      ? "text-primary font-medium bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-1 border-t border-border/30">
                {user ? (
                  <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => { setMobileOpen(false); handleSignOut(); }}>
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="mailto:info@alexiscollier.com">Get in Touch</a>
                  </Button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      <ScrollToTopButton />

      {/* Footer */}
      <footer className="py-14 px-6 border-t border-border/30 bg-foreground text-primary-foreground">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-primary" />
                <span className="font-display text-lg text-primary-foreground">VitaSignal</span>
              </div>
              <p className="text-xs text-primary-foreground/50 leading-relaxed mb-4">
                Equipment-independent clinical AI. Patent-pending technology for ICU mortality prediction and nursing workflow optimization.
              </p>
              <a
                href="https://www.linkedin.com/in/alexiscollier/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <Linkedin className="w-3.5 h-3.5" />
                Dr. Alexis Collier
              </a>
            </div>

            {/* Technology */}
            <div>
              <p className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">Technology</p>
              <div className="space-y-2">
                <Link to="/patents" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Patent Portfolio</Link>
                <Link to="/regulatory" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Regulatory Readiness</Link>
                <Link to="/licensing" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Licensing</Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">Company</p>
              <div className="space-y-2">
                <Link to="/about" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">About</Link>
                <Link to="/contact" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Contact</Link>
                <a href="mailto:info@alexiscollier.com" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">info@alexiscollier.com</a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">Legal</p>
              <div className="space-y-2">
                <Link to="/terms" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Terms of Use</Link>
                <Link to="/privacy" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Privacy Policy</Link>
                <span className="block text-sm text-primary-foreground/50">5 U.S. Patents Pending</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-primary-foreground/40">
              &copy; 2025-2026 Dr. Alexis Collier, DHA. All Rights Reserved.
            </p>
            <p className="text-[10px] text-primary-foreground/30">
              Pre-Market Research Prototype. Not FDA Cleared. Not a Medical Device.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
