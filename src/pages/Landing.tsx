import { SiteLayout } from "@/components/layout/SiteLayout";
import { LandingHero } from "@/components/landing/LandingHero";
import { TechnologyPortfolio } from "@/components/landing/TechnologyPortfolio";
import { ValidationSection } from "@/components/landing/ValidationSection";
import { MarketOpportunitySection } from "@/components/landing/MarketOpportunitySection";
import { InventorSection } from "@/components/landing/InventorSection";
import { RecognitionSection } from "@/components/landing/RecognitionSection";
import { DemoRequestSection } from "@/components/landing/DemoRequestSection";
import { LicensingCTA } from "@/components/landing/LicensingCTA";

export const Landing = () => {
  return (
    <SiteLayout
      title="Equipment-Independent Clinical AI"
      description="Patent-pending AI for ICU mortality prediction using temporal documentation pattern analysis. 5 U.S. patent applications filed. Available for licensing."
    >
      <LandingHero />
      <TechnologyPortfolio />
      <ValidationSection />
      <MarketOpportunitySection />
      <DemoRequestSection />
      <InventorSection />
      <RecognitionSection />
      <LicensingCTA />
    </SiteLayout>
  );
};
