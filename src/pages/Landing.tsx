import { SiteLayout } from "@/components/layout/SiteLayout";
import { LandingHero } from "@/components/landing/LandingHero";
import { TechnologyPortfolio } from "@/components/landing/TechnologyPortfolio";
import { ValidationSection } from "@/components/landing/ValidationSection";
import { InventorSection } from "@/components/landing/InventorSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { DemoRequestSection } from "@/components/landing/DemoRequestSection";
import { LicensingCTA } from "@/components/landing/LicensingCTA";

export const Landing = () => {
  return (
    <SiteLayout
      title="Equipment-Independent Clinical AI"
      description="Patent-protected AI for ICU mortality prediction using temporal documentation pattern analysis. 5 U.S. patents filed. Available for licensing."
    >
      <LandingHero />
      <TechnologyPortfolio />
      <ValidationSection />
      <DemoRequestSection />
      <InventorSection />
      <PartnersSection />
      <LicensingCTA />
    </SiteLayout>
  );
};
