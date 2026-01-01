import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const getVisitorId = (): string => {
  const key = "visitor_id";
  let visitorId = localStorage.getItem(key);
  
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  
  return visitorId;
};

export function usePageTracking(pagePath: string) {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const visitorId = getVisitorId();
        
        await supabase.from("page_views").insert({
          page_path: pagePath,
          visitor_id: visitorId,
        });
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    };

    trackPageView();
  }, [pagePath]);
}
