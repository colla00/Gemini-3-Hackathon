import { SiteLayout } from "@/components/layout/SiteLayout";
import { LandingHero } from "@/components/landing/LandingHero";
import { TechnologyPortfolio } from "@/components/landing/TechnologyPortfolio";
import { ValidationSection } from "@/components/landing/ValidationSection";
import { LicensingCTA } from "@/components/landing/LicensingCTA";
import { Helmet } from "react-helmet-async";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VitaSignal",
  "url": "https://clinicaldashboard.lovable.app",
  "description": "Equipment-independent AI for ICU mortality prediction using temporal documentation pattern analysis.",
  "founder": {
    "@type": "Person",
    "name": "Dr. Alexis Collier",
    "jobTitle": "DHA"
  },
  "sameAs": [
    "https://www.linkedin.com/in/alexiscollier/"
  ]
};

export const Landing = () => {
  return (
    <SiteLayout
      title="Equipment-Independent Clinical AI"
      description="Patent-pending AI for ICU mortality prediction using temporal documentation pattern analysis. 5 U.S. patent applications filed. Available for licensing."
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <LandingHero />
      <ValidationSection />
      <TechnologyPortfolio />
      <LicensingCTA />
    </SiteLayout>
  );
};
