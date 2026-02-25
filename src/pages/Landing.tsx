import { SiteLayout } from "@/components/layout/SiteLayout";
import { LandingHero } from "@/components/landing/LandingHero";
import { TechnologyPortfolio } from "@/components/landing/TechnologyPortfolio";
import { ValidationSection } from "@/components/landing/ValidationSection";
import { RecognitionSection } from "@/components/landing/RecognitionSection";
import { LicensingCTA } from "@/components/landing/LicensingCTA";
import { WhyNoHardware } from "@/components/landing/WhyNoHardware";
import { GlobalHealthSection } from "@/components/landing/GlobalHealthSection";
import { DigitalTwinsSection } from "@/components/landing/DigitalTwinsSection";
import { Helmet } from "react-helmet-async";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VitaSignal™",
  "url": "https://clinicaldashboard.lovable.app",
  "description": "Equipment-independent clinical AI for ICU mortality prediction and nursing documentation burden scoring. Validated on 321K+ patients across 208 hospitals.",
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
      title="Equipment-Independent Clinical AI | Nursing Documentation AI"
      description="The only validated clinical AI that works with nothing but a nurse and an EHR. Equipment-independent ICU mortality prediction and documentation burden scoring. 5 U.S. patent applications, 321K+ patients validated."
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <meta name="keywords" content="equipment-independent clinical AI, nursing documentation AI, EHR mortality prediction, documentation burden score, ICU patient safety, clinical decision support, healthcare AI licensing" />
      </Helmet>
      <LandingHero />
      <WhyNoHardware />
      <ValidationSection />
      <GlobalHealthSection />
      <TechnologyPortfolio />
      <DigitalTwinsSection />
      <RecognitionSection />
      <LicensingCTA />
    </SiteLayout>
  );
};
