import { useState, useEffect } from 'react';
import { Cookie, X, Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const COOKIE_CONSENT_KEY = 'cookie_consent';
const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  functional: false,
};

export const CookieConsent = () => {
  const [isClient, setIsClient] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  // Ensure we only run on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    } else {
      const storedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (storedPrefs) {
        try {
          setPreferences(JSON.parse(storedPrefs));
        } catch (e) {
          console.error('Failed to parse cookie preferences:', e);
        }
      }
    }
  }, [isClient]);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      functional: false,
    };
    setPreferences(essentialOnly);
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(essentialOnly));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'custom');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[100] p-4",
        "bg-card/95 backdrop-blur-lg border-t border-border shadow-lg"
      )}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-6xl mx-auto">
        {!showSettings ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">Cookie Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your experience, analyze site usage, and assist in our research documentation. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    Read our Privacy Policy
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSettings(true)}
                className="flex-1 md:flex-none"
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRejectNonEssential}
                className="flex-1 md:flex-none"
              >
                Reject Non-Essential
              </Button>
              <Button 
                size="sm"
                onClick={handleAcceptAll}
                className="flex-1 md:flex-none"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Cookie Settings
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium text-sm">Necessary Cookies</p>
                  <p className="text-xs text-muted-foreground">Required for the site to function properly</p>
                </div>
                <Switch checked={true} disabled aria-label="Necessary cookies (always on)" />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium text-sm">Analytics Cookies</p>
                  <p className="text-xs text-muted-foreground">Help us understand how you use the site</p>
                </div>
                <Switch 
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))}
                  aria-label="Analytics cookies"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium text-sm">Functional Cookies</p>
                  <p className="text-xs text-muted-foreground">Enable enhanced functionality and personalization</p>
                </div>
                <Switch 
                  checked={preferences.functional}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, functional: checked }))}
                  aria-label="Functional cookies"
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleRejectNonEssential}>
                Reject All Optional
              </Button>
              <Button onClick={handleSavePreferences}>
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
