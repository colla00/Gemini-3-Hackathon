import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const TRACKED_PATHS = ["/licensing", "/patents", "/investors", "/about", "/contact", "/"];

/**
 * Lightweight page-view tracker. Fires once per route change on tracked paths.
 * No PII collected — just path, referrer, and UA.
 */
export function usePageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (!TRACKED_PATHS.some(p => path === p || path.startsWith(p + "/"))) return;

    // Debounce: don't double-fire on rapid nav
    const timer = setTimeout(() => {
      supabase
        .from("page_views" as any)
        .insert({
          page_path: path,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent?.substring(0, 512) || null,
        } as any)
        .then(() => {}); // fire-and-forget
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);
}
