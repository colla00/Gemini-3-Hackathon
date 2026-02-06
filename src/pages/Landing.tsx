import { SkipLink } from '@/components/SkipLink';
import { TermsAcceptanceModal } from '@/components/TermsAcceptanceModal';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';
import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { WhatIsVitaSignal } from '@/components/landing/WhatIsVitaSignal';
import { PlatformComponents } from '@/components/landing/PlatformComponents';
import { KeyBenefits } from '@/components/landing/KeyBenefits';
import { AboutInventor } from '@/components/landing/AboutInventor';
import { RecognitionSection } from '@/components/landing/RecognitionSection';
import { LicensingCTA } from '@/components/landing/LicensingCTA';
import { ContactSection } from '@/components/landing/ContactSection';
import { DisclaimersSection } from '@/components/landing/DisclaimersSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { QuickStartLauncher } from '@/components/presentation/QuickStartLauncher';
import { useAuth } from '@/hooks/useAuth';

export const Landing = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <SkipLink targets={[{ id: 'main-content', label: 'Skip to main content' }]} />
      <TermsAcceptanceModal />
      <ResearchDisclaimer />
      <LandingNav />

      <main id="main-content">
        <HeroSection />

        {/* Admin Quick Start */}
        {isAdmin && (
          <section className="py-12 px-6 bg-gradient-to-b from-primary/5 to-transparent border-b border-primary/10">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Present?</h3>
                <p className="text-muted-foreground mb-4">
                  Launch your 45-minute presentation with one click.
                </p>
              </div>
              <QuickStartLauncher />
            </div>
          </section>
        )}

        <WhatIsVitaSignal />
        <PlatformComponents />
        <KeyBenefits />
        <AboutInventor />
        <RecognitionSection />
        <LicensingCTA />
        <ContactSection />
        <DisclaimersSection />
      </main>

      <LandingFooter />
    </div>
  );
};
