import { QualityDashboard } from '@/components/quality/QualityDashboard';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>EHR-Driven Quality Dashboard | Nurse-Sensitive Outcomes | Stanford AI+HEALTH 2025</title>
        <meta 
          name="description" 
          content="Predictive analytics dashboard for nurse-sensitive outcomes including Falls, HAPI, and CAUTI risk. Research prototype with SHAP explainability for Stanford AI+HEALTH 2025." 
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <QualityDashboard />
    </>
  );
};

export default Index;
