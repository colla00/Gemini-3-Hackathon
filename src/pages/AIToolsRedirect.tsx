import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AIToolsRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard with ai-tools tab selected
    navigate('/dashboard?tab=ai-tools', { replace: true });
  }, [navigate]);
  
  return null;
};
