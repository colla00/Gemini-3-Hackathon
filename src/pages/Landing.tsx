import { SiteLayout } from "@/components/layout/SiteLayout";
import { LandingHero } from "@/components/landing/LandingHero";
import { TechnologyPortfolio } from "@/components/landing/TechnologyPortfolio";
import { ValidationSection } from "@/components/landing/ValidationSection";
import { LicensingCTA } from "@/components/landing/LicensingCTA";

export const Landing = () => {
  return (
    <SiteLayout
      title="Equipment-Independent Clinical AI"
      description="Patent-pending AI for ICU mortality prediction using temporal documentation pattern analysis. 5 U.S. patent applications filed. Available for licensing."
    >
      <LandingHero />
      <ValidationSection />
      <TechnologyPortfolio />
      <LicensingCTA />
    </SiteLayout>
  );
};
