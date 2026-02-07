import { useState } from "react";
import { Activity, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Helmet } from "react-helmet-async";

interface SiteLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const navLinks = [
  { to: "/about", label: "About" },
  { to: "/patents", label: "Patents" },
  { to: "/licensing", label: "Licensing" },
  { to: "/contact", label: "Contact" },
];

export const SiteLayout = ({ children, title, description }: SiteLayoutProps) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = title ? `${title} | VitaSignal` : "VitaSignal | Clinical Intelligence";
  const pageDescription = description || "Equipment-independent AI for ICU mortality prediction. 5 U.S. patents filed. Available for licensing.";

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
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:info@alexiscollier.com">Get in Touch</a>
              </Button>
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
            <nav className="md:hidden pt-4 pb-2 border-t border-border/40 mt-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm py-2 transition-colors ${
                    location.pathname === link.to
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="outline" size="sm" className="w-fit" asChild>
                <a href="mailto:info@alexiscollier.com">Get in Touch</a>
              </Button>
            </nav>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/30 bg-secondary/30">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">VitaSignal</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2025–2026 Dr. Alexis Collier, DHA. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/patents" className="hover:text-primary transition-colors">Patents</Link>
            <Link to="/licensing" className="hover:text-primary transition-colors">Licensing</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
