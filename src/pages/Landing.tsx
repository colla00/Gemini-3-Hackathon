import { SiteLayout } from "@/components/layout/SiteLayout";
import { LandingHero } from "@/components/landing/LandingHero";
import { TechnologyPortfolio } from "@/components/landing/TechnologyPortfolio";
import { ValidationSection } from "@/components/landing/ValidationSection";

import { LicensingCTA } from "@/components/landing/LicensingCTA";
import { WhyNoHardware } from "@/components/landing/WhyNoHardware";
import { GlobalHealthSection } from "@/components/landing/GlobalHealthSection";
import { FairnessCommitment } from "@/components/landing/FairnessCommitment";
import { DigitalTwinsSection } from "@/components/landing/DigitalTwinsSection";
import { MilitaryHealthSection } from "@/components/landing/MilitaryHealthSection";
import { TrustLanguageSection } from "@/components/landing/TrustLanguageSection";

import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { ROISection } from "@/components/landing/ROISection";
import { BuyerPersonaSection } from "@/components/landing/BuyerPersonaSection";
import { EHRCompatibilitySection } from "@/components/landing/EHRCompatibilitySection";
import { ComparisonSlider } from "@/components/landing/ComparisonSlider";
import { RecognitionBar } from "@/components/landing/RecognitionBar";

import { Helmet } from "react-helmet-async";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VitaSignal",
  "url": "https://vitasignal.ai",
  "description": "Equipment-independent clinical AI for ICU mortality prediction, nursing documentation burden scoring, and syndromic surveillance. Three validated systems: IDI (65K+ patients), DBS (28K+ patients, 172 hospitals), and SEDR (94K+ ICU stays).",
  "founder": {
    "@type": "Person",
    "name": "Dr. Alexis Collier",
    "jobTitle": "DHA"
  },
  "sameAs": ["https://vitasignal.ai"]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is VitaSignal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "VitaSignal is an equipment-independent clinical AI platform that predicts ICU mortality and quantifies nursing documentation burden using only existing EHR timestamp data — no additional hardware, sensors, or wearables required."
      }
    },
    {
      "@type": "Question",
      "name": "How does VitaSignal work without hardware?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "VitaSignal extracts temporal features from the timing, rhythm, and frequency of routine EHR documentation entries. These documentation patterns carry a clinical signal comparable to bedside monitors, enabling mortality prediction and workload assessment from data already being generated."
      }
    },
    {
      "@type": "Question",
      "name": "Has VitaSignal been validated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The ICU Mortality Prediction system has been validated on 65K+ patients across international databases including MIMIC-IV and HiRID. The Documentation Burden Score has been validated on 28K+ patients across 172 hospitals in the eICU database. VitaSignal is a pre-market research prototype and is not FDA cleared."
      }
    },
    {
      "@type": "Question",
      "name": "Is VitaSignal FDA approved?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. VitaSignal is a pre-market research prototype classified as Non-Device CDS under §520(o)(1)(E) of the 21st Century Cures Act. It is not FDA cleared, approved, or authorized, and is not intended for clinical use."
      }
    },
    {
      "@type": "Question",
      "name": "How can I license VitaSignal technology?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "VitaSignal technology is available for licensing to EHR vendors, hospital systems, healthcare AI companies, and strategic investors. Contact licensing@vitasignal.ai or visit the Licensing page for more information."
      }
    }
  ]
};

const medicalWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "VitaSignal Clinical Intelligence Platform",
  "url": "https://vitasignal.ai",
  "description": "Equipment-independent clinical AI for ICU mortality prediction and nursing documentation burden scoring.",
  "specialty": {
    "@type": "MedicalSpecialty",
    "name": "Clinical Informatics"
  },
  "audience": {
    "@type": "MedicalAudience",
    "audienceType": "Clinician"
  },
  "lastReviewed": "2026-03-01",
  "medicalDisclaimer": "Pre-market research prototype. Not FDA cleared or approved. Not a medical device. Not for clinical use. All data shown is simulated.",
  "about": {
    "@type": "MedicalCondition",
    "name": "ICU Patient Deterioration"
  }
};

export const Landing = () => {
  return (
    <SiteLayout
      title="VitaSignal | Documentation-Driven Clinical Intelligence"
      description="VitaSignal builds documentation-driven clinical intelligence systems that turn routine EHR activity into actionable insight for risk prediction, workflow visibility, and equitable decision support — without requiring new hardware or adding burden to care teams."
    >
      <Helmet>
        <meta property="og:image" content="https://vitasignal.ai/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://vitasignal.ai/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(medicalWebPageJsonLd)}</script>
        <meta name="keywords" content="fairness-preserving clinical AI, documentation-driven intelligence, EHR mortality prediction, documentation burden score, ICU patient safety, clinical decision support, healthcare AI licensing, equitable clinical AI" />
      </Helmet>
      <LandingHero />
      <RecognitionBar />
      <WhyNoHardware />
      <ComparisonSlider />
      <DashboardPreview />
      <ROISection />
      <ValidationSection />
      
      <FairnessCommitment />
      <BuyerPersonaSection />
      <TrustLanguageSection />
      <EHRCompatibilitySection />
      <GlobalHealthSection />
      <MilitaryHealthSection />
      <TechnologyPortfolio />
      <DigitalTwinsSection />
      
      <LicensingCTA />
    </SiteLayout>
  );
};
