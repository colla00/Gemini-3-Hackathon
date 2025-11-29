import { Dashboard } from '@/components/dashboard/Dashboard';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>EHR-Driven Quality Dashboard | Stanford AI+HEALTH 2025</title>
        <meta 
          name="description" 
          content="Interactive clinical risk monitoring dashboard for nurse-sensitive adverse events. Research prototype for educational demonstration at Stanford AI+HEALTH 2025." 
        />
      </Helmet>
      <Dashboard />
    </>
  );
};

export default Index;
