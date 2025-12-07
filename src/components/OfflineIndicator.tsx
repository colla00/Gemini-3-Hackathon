import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swReady, setSwReady] = useState(false);
  const [isCaching, setIsCaching] = useState(false);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online!');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Cached content is available.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setSwReady(true);
      });
    }

    // Check if already cached
    if (localStorage.getItem('nso-cached') === 'true') {
      setIsCached(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCacheForOffline = async () => {
    if (!swReady) {
      toast.error('Service worker not ready. Please refresh and try again.');
      return;
    }

    setIsCaching(true);
    
    try {
      // Message the service worker to cache everything
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage('cacheAll');
      
      // Also cache the current page and its assets
      const cache = await caches.open('nso-dashboard-v1');
      
      // Cache key routes
      const urlsToCache = [
        window.location.href,
        '/dashboard',
        '/presentation',
        '/presentation?mode=presenter',
        '/presentation?mode=audience',
      ];
      
      await Promise.all(
        urlsToCache.map(url => 
          fetch(url).then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
          }).catch(() => {})
        )
      );

      localStorage.setItem('nso-cached', 'true');
      setIsCached(true);
      toast.success('Demo cached for offline use!');
    } catch (error) {
      console.error('Caching failed:', error);
      toast.error('Failed to cache. Try refreshing.');
    } finally {
      setIsCaching(false);
    }
  };

  // Don't show if not supported
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  return (
    <div className="fixed bottom-16 right-4 z-50 flex flex-col items-end gap-2">
      {/* Offline banner */}
      {!isOnline && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/90 text-amber-950 text-sm font-medium shadow-lg animate-fade-in">
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode</span>
        </div>
      )}

      {/* Cache button - only show when online and not cached */}
      {isOnline && !isCached && swReady && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCacheForOffline}
          disabled={isCaching}
          className="bg-background/90 backdrop-blur-sm shadow-lg"
        >
          {isCaching ? (
            <>
              <Download className="w-4 h-4 mr-2 animate-bounce" />
              Caching...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Save for Offline
            </>
          )}
        </Button>
      )}

      {/* Cached indicator */}
      {isCached && (
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
          isOnline 
            ? "bg-risk-low/20 text-risk-low border border-risk-low/30"
            : "bg-risk-low/30 text-risk-low border border-risk-low/50"
        )}>
          <CheckCircle className="w-3 h-3" />
          <span>Offline Ready</span>
        </div>
      )}
    </div>
  );
};
