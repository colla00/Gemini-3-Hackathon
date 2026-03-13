import { Link } from 'react-router-dom';
import vitasignalIcon from '@/assets/vitasignal-icon.jpg';

export const LandingFooter = () => (
  <footer className="py-10 px-6 border-t border-border/30 bg-secondary/30" role="contentinfo">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center gap-6">
        <div>
          <div className="flex items-center gap-2 justify-center mb-2">
            <img src={vitasignalIcon} alt="VitaSignal" className="w-5 h-5 rounded object-cover" />
            <span className="font-bold text-foreground">VitaSignal<sup className="text-[8px] align-super">™</sup></span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2025–2026 VitaSignal LLC. All Rights Reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            NIH AIM-AHEAD CLINAQ Fellow | Health Informaticist & AI Researcher
          </p>
          <p className="text-xs text-primary font-medium mt-1">
            11 U.S. Provisional Patent Applications Filed
          </p>
        </div>

        {/* Product */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-6 text-left text-sm">
          <div>
            <h4 className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">Product</h4>
            <div className="flex flex-col gap-1.5">
              <Link to="/demo" className="text-muted-foreground hover:text-primary transition-colors">Product Demo</Link>
              <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
              <Link to="/compare" className="text-muted-foreground hover:text-primary transition-colors">Compare</Link>
              <Link to="/roi-calculator" className="text-muted-foreground hover:text-primary transition-colors">ROI Calculator</Link>
              <Link to="/integrations" className="text-muted-foreground hover:text-primary transition-colors">Integrations</Link>
              <Link to="/pilot-request" className="text-muted-foreground hover:text-primary transition-colors">Pilot Request</Link>
              <Link to="/changelog" className="text-muted-foreground hover:text-primary transition-colors">Changelog</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">Solutions</h4>
            <div className="flex flex-col gap-1.5">
              <Link to="/solutions/hospitals" className="text-muted-foreground hover:text-primary transition-colors">For Hospitals</Link>
              <Link to="/solutions/ehr-vendors" className="text-muted-foreground hover:text-primary transition-colors">For EHR Vendors</Link>
              <Link to="/solutions/investors" className="text-muted-foreground hover:text-primary transition-colors">For Investors</Link>
              <Link to="/solutions/military" className="text-muted-foreground hover:text-primary transition-colors">DoD & Military</Link>
              <Link to="/solutions/icu-mortality" className="text-muted-foreground hover:text-primary transition-colors">ICU Mortality</Link>
              <Link to="/solutions/nurse-workload" className="text-muted-foreground hover:text-primary transition-colors">Nurse Workload</Link>
              <Link to="/solutions/cms-compliance" className="text-muted-foreground hover:text-primary transition-colors">CMS Compliance</Link>
              <Link to="/evidence" className="text-muted-foreground hover:text-primary transition-colors">Evidence</Link>
              <Link to="/trust" className="text-muted-foreground hover:text-primary transition-colors">Trust Center</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">Company</h4>
            <div className="flex flex-col gap-1.5">
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link>
              <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link>
              <Link to="/press" className="text-muted-foreground hover:text-primary transition-colors">Press</Link>
              <Link to="/press-kit" className="text-muted-foreground hover:text-primary transition-colors">Press Kit</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">Legal</h4>
            <div className="flex flex-col gap-1.5">
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Use</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/patents" className="text-muted-foreground hover:text-primary transition-colors">Patents</Link>
              <Link to="/licensing" className="text-muted-foreground hover:text-primary transition-colors">Licensing</Link>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-muted-foreground/60 max-w-lg">
          <p>VitaSignal™, Documentation Burden Score™, and IDI™ are trademarks of VitaSignal LLC. All rights reserved.</p>
          <p className="mt-1">
            Research supported in part by NIH Award No. 1OT2OD032581 (AIM-AHEAD)
          </p>
        </div>
      </div>
    </div>
  </footer>
);
