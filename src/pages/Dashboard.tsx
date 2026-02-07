import { useState } from 'react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { AcknowledgmentModal } from '@/components/demo/AcknowledgmentModal';
import { PatentHeroSection } from '@/components/demo/PatentHeroSection';
import { IDIFeaturesSection } from '@/components/demo/IDIFeaturesSection';
import { DesignPhaseComponents } from '@/components/demo/DesignPhaseComponents';
import { PatentPublicationInfo } from '@/components/demo/PatentPublicationInfo';
import { DemoFooterDisclaimer } from '@/components/demo/DemoFooterDisclaimer';
import heroBg from '@/assets/hero-bg.jpg';

const STORAGE_KEY = 'vitasignal-demo-acknowledged';

export const Dashboard = () => {
  const [acknowledged, setAcknowledged] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === 'true'
  );

  const handleAccept = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setAcknowledged(true);
  };

  return (
    <SiteLayout
      title="Technology Demo"
      description="Interactive demonstration of VitaSignal's patent-protected clinical intelligence platform using simulated data."
    >
      <AcknowledgmentModal open={!acknowledged} onAccept={handleAccept} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-primary/20 border border-primary/30 text-sm animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
            <span className="text-primary font-medium">Interactive Research Prototype</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-[1.05] max-w-4xl animate-fade-in">
            Technology
            <br />
            <span className="text-primary">Demonstration</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 opacity-80 leading-relaxed animate-fade-in">
            Explore the validated IDI features, patent portfolio, and platform components
            powering VitaSignal's clinical intelligence. All data shown is simulated.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary-foreground/10 rounded-xl overflow-hidden animate-fade-in">
            {[
              { value: '9', label: 'IDI Features', detail: 'Temporal predictors' },
              { value: '0.684', label: 'AUC', detail: 'Validated performance' },
              { value: '5', label: 'Patents Filed', detail: '175+ claims' },
              { value: 'n=26,153', label: 'Cohort', detail: 'ICU admissions' },
            ].map((s) => (
              <div key={s.label} className="bg-foreground/80 backdrop-blur-sm p-5 text-center">
                <p className="font-display text-2xl md:text-3xl text-primary mb-1">{s.value}</p>
                <p className="text-sm font-semibold opacity-90">{s.label}</p>
                <p className="text-xs opacity-50 mt-0.5">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Validated Technology - Light section */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <PatentHeroSection />
        </div>
      </section>

      {/* IDI Features - Dark section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, hsl(173 58% 29% / 0.4) 0%, transparent 50%),
                             radial-gradient(circle at 70% 50%, hsl(217 91% 35% / 0.3) 0%, transparent 50%)`,
          }}
        />
        <div className="relative max-w-5xl mx-auto">
          <IDIFeaturesSection />
        </div>
      </section>

      {/* Design Phase - Light section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <DesignPhaseComponents />
        </div>
      </section>

      {/* Publication - Dark section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 60% 40%, hsl(173 58% 29% / 0.3) 0%, transparent 50%)`,
          }}
        />
        <div className="relative max-w-5xl mx-auto">
          <PatentPublicationInfo />
        </div>
      </section>

      {/* Disclaimer - Light section */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <DemoFooterDisclaimer />
        </div>
      </section>
    </SiteLayout>
  );
};