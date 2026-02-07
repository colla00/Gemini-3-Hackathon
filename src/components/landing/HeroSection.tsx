import { Link } from 'react-router-dom';
import { ArrowRight, Award, Activity } from 'lucide-react';
import { WalkthroughRequestModal } from '@/components/WalkthroughRequestModal';
import { PATENTS_FILED_COUNT } from '@/constants/patent';

export const HeroSection = () => (
  <header className="relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, hsl(var(--primary) / 0.08) 0%, transparent 50%)`,
      }} />
    </div>

    <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
      <div className="flex flex-col items-center text-center">
        {/* Stanford Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-[#8C1515]/10 to-[#8C1515]/5 border border-[#8C1515]/30">
          <Award className="w-4 h-4 text-[#8C1515]" aria-hidden="true" />
          <span className="text-sm font-medium text-[#8C1515]">
            Presented at Stanford AI+Health 2025
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#8C1515]/20 text-[#8C1515] font-medium">
            Dec 2025
          </span>
        </div>

        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Activity className="w-7 h-7 text-primary" aria-hidden="true" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">VitaSignal</h1>
            <span className="text-sm text-muted-foreground">Clinical Intelligence</span>
          </div>
        </div>

        {/* Tagline */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
          Detecting Life-Saving Signals
          <span className="text-primary"> Before Crisis</span>
        </h2>

        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-3">
          Equipment-Independent AI for ICU Mortality Prediction, Nursing Optimization,
          and Real-Time Risk Intelligence
        </p>

        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-8">
          {PATENTS_FILED_COUNT} U.S. provisional patent applications covering novel analytical methods
          for clinical documentation pattern analysis.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
          >
            <span>Learn More</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <a
            href="mailto:info@alexiscollier.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all border border-border"
          >
            <span>Licensing Inquiries</span>
          </a>
          <WalkthroughRequestModal
            trigger={
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-risk-low/10 text-risk-low rounded-xl font-semibold hover:bg-risk-low/20 transition-all border border-risk-low/30">
                <span>Request Walkthrough</span>
              </button>
            }
          />
        </div>
      </div>
    </div>
  </header>
);
