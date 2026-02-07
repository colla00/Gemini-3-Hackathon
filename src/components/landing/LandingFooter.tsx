import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export const LandingFooter = () => (
  <footer className="py-10 px-6 border-t border-border/30 bg-secondary/30" role="contentinfo">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center gap-6">
        <div>
          <div className="flex items-center gap-2 justify-center mb-2">
            <Activity className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="font-bold text-foreground">VitaSignal</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2025–2026 Dr. Alexis M. Collier, DHA. All Rights Reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            NIH CLINAQ Fellow (K12 HL138039-06) | AIM-AHEAD Researcher (1OT2OD032581)
          </p>
          <p className="text-xs text-primary font-medium mt-1">
            5 U.S. Provisional Patent Applications Filed
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
          <span className="text-border">|</span>
          <Link to="/presentation" className="text-muted-foreground hover:text-primary transition-colors">Walkthrough</Link>
          <span className="text-border">|</span>
          <a href="mailto:info@alexiscollier.com" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
          <span className="text-border">|</span>
          <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Use</Link>
          <span className="text-border">|</span>
          <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
        </div>

        <div className="text-[10px] text-muted-foreground/60 max-w-lg">
          <p>VitaSignal and associated marks are property of Dr. Alexis M. Collier.</p>
          <p className="mt-1">
            Research supported by NIH CLINAQ Fellowship (K12 HL138039-06)
            and AIM-AHEAD Program (1OT2OD032581)
          </p>
        </div>
      </div>
    </div>
  </footer>
);
