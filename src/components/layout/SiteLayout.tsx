import { useState, useEffect } from "react";
import { Menu, X, Linkedin, LogOut, LayoutGrid, FolderLock, Target, Presentation, ChevronDown } from "lucide-react";
import vitasignalIcon from "@/assets/vitasignal-icon.jpg";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { SkipLink } from "@/components/SkipLink";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ADMIN_EMAIL = 'colliera75@gmail.com';

interface SiteLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/demo", label: "Platform" },
  { to: "/research", label: "Research" },
  { to: "/security", label: "Security" },
  { to: "/for-leaders", label: "Use Cases" },
  { to: "/about", label: "About" },
];

export const SiteLayout = ({ children, title, description }: SiteLayoutProps) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  const pageTitle = title ? `${title} | VitaSignal™` : "VitaSignal™ | Clinical Intelligence";
  const pageDescription = description || "Equipment-independent AI for ICU mortality prediction. 11 U.S. patent applications filed. Available for licensing.";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SkipLink />
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link rel="canonical" href={`https://vitasignal.ai${location.pathname}`} />
      </Helmet>

      {/* Research Disclaimer */}
      <div className="bg-muted border-b border-border/40 px-4 py-1.5 text-center text-xs" role="status" aria-label="Regulatory disclaimer">
        <span className="text-muted-foreground">Pre-Market · Patent Pending · Not a Medical Device</span>
      </div>

      {/* Header */}
      <header className="border-b border-border/40 bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={vitasignalIcon} alt="VitaSignal" className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <p className="text-lg font-bold text-foreground">VitaSignal<sup className="text-[8px] align-super">™</sup></p>
                <p className="text-xs text-muted-foreground">Clinical Intelligence</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-5">
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
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Tools
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="text-xs text-muted-foreground">Internal Tools</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to="/hub" className="gap-2 cursor-pointer">
                          <Target className="w-3.5 h-3.5" /> Project Hub
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/dataroom" className="gap-2 cursor-pointer">
                          <FolderLock className="w-3.5 h-3.5" /> Data Room
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/patents/tracker" className="gap-2 cursor-pointer">
                          <Target className="w-3.5 h-3.5" /> Patent Tracker
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.email === ADMIN_EMAIL && (
                        <DropdownMenuItem asChild>
                          <Link to="/investor-deck" className="gap-2 cursor-pointer">
                            <Presentation className="w-3.5 h-3.5" /> Investor Deck
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link to="/licensing" className="gap-2 cursor-pointer">
                          <LayoutGrid className="w-3.5 h-3.5" /> Licensing Portal
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contact">Contact</Link>
                </Button>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
                {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
              </Button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <nav aria-label="Mobile navigation" className="md:hidden pt-4 pb-2 border-t border-border/40 mt-4 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200">
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
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pt-1">Internal Tools</p>
                    {[
                      { to: '/hub', label: 'Project Hub' },
                      { to: '/dataroom', label: 'Data Room' },
                      { to: '/patents/tracker', label: 'Patent Tracker' },
                      { to: '/licensing', label: 'Licensing Portal' },
                      ...(user.email === ADMIN_EMAIL ? [{ to: '/investor-deck', label: 'Investor Deck' }] : []),
                    ].map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={`block text-sm py-2.5 px-3 rounded-lg transition-colors ${
                          location.pathname === link.to
                            ? "text-primary font-medium bg-primary/10"
                            : "text-muted-foreground hover:text-primary hover:bg-muted"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => { setMobileOpen(false); handleSignOut(); }}>
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
                  </Button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Content */}
      <main id="main-content" className="flex-1">{children}</main>

      <ScrollToTopButton />

      {/* Footer */}
      <footer aria-label="Site footer" className="py-14 px-6 border-t border-border/30 bg-foreground text-primary-foreground">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img src={vitasignalIcon} alt="VitaSignal" className="w-6 h-6 rounded object-cover" />
                <span className="font-display text-lg">VitaSignal<sup className="text-[8px]">™</sup></span>
              </div>
              <p className="text-xs text-primary-foreground/40 leading-relaxed mb-4">
                Equipment-independent clinical AI. Patent-pending technology for ICU mortality prediction and nursing workflow optimization.
              </p>
              <div className="flex flex-col gap-1.5">
                <a
                  href="https://www.linkedin.com/company/vitasignal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  VitaSignal on LinkedIn
                </a>
                <a
                  href="https://www.linkedin.com/in/alexiscollier/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary-foreground/50 hover:text-primary transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  Dr. Alexis Collier
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">Product</p>
              <div className="space-y-2">
                <Link to="/demo" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Product Demo</Link>
                <Link to="/watch" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Watch</Link>
                <Link to="/pricing" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Pricing</Link>
                <Link to="/compare" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Compare</Link>
                <Link to="/roi-calculator" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">ROI Calculator</Link>
                <Link to="/integrations" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Integrations</Link>
                <Link to="/security" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Security</Link>
                <Link to="/trust" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Trust Center</Link>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <p className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">Solutions</p>
              <div className="space-y-2">
                <Link to="/solutions/hospitals" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">For Hospitals</Link>
                <Link to="/solutions/ehr-vendors" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">For EHR Vendors</Link>
                <Link to="/solutions/investors" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">For Investors</Link>
                <Link to="/solutions/military" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">DoD & Military</Link>
                <Link to="/for-leaders" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">By Role</Link>
                <Link to="/global-health" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Global Health</Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">Company</p>
              <div className="space-y-2">
                <Link to="/about" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">About</Link>
                <Link to="/research" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Research</Link>
                <Link to="/careers" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Careers</Link>
                <Link to="/blog" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Blog</Link>
                <Link to="/news" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">News & Events</Link>
                <Link to="/press" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Press</Link>
                <Link to="/press-kit" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Press Kit</Link>
                <Link to="/contact" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Contact</Link>
                <Link to="/changelog" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Changelog</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">Legal</p>
              <div className="space-y-2">
                <Link to="/terms" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Terms of Service</Link>
                <Link to="/privacy" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Privacy Policy</Link>
                <Link to="/patents" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Patents</Link>
                <Link to="/licensing" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Licensing</Link>
                <Link to="/conflict-of-interest" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">COI Policy</Link>
                <Link to="/pilot-request" className="block text-sm text-primary-foreground/50 hover:text-primary transition-colors">Pilot Request</Link>
                <span className="block text-[11px] text-primary-foreground/30 pt-1">We do not sell personal data.</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-primary-foreground/40">
              &copy; 2025-2026 VitaSignal LLC. All Rights Reserved.
            </p>
            <p className="text-[10px] text-primary-foreground/30">
              VitaSignal™, ChartMinder™, Documentation Burden Score™, and IDI™ are trademarks of VitaSignal LLC.
            </p>
            <p className="text-[10px] text-primary-foreground/30 mt-1">
              Pre-Market Research Prototype. Not FDA Cleared. Not a Medical Device.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
