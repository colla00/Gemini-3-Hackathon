import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PageSpeedRequest {
  url: string;
  strategy?: 'mobile' | 'desktop';
  categories?: string[];
}

interface LighthouseAudit {
  id: string;
  title: string;
  score: number;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
}

interface LighthouseResult {
  scores: {
    performance: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
  };
  audits: LighthouseAudit[];
  metrics: {
    fcp: number;
    lcp: number;
    cls: number;
    tbt: number;
    speedIndex: number;
    tti: number;
  };
  fetchTime: string;
  finalUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, strategy = 'mobile', categories = ['performance'] }: PageSpeedRequest = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid URL format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build PageSpeed Insights API URL
    const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    apiUrl.searchParams.set('url', url);
    apiUrl.searchParams.set('strategy', strategy);
    categories.forEach(cat => apiUrl.searchParams.append('category', cat));

    // Optional: Add API key for higher quotas
    const apiKey = Deno.env.get('GOOGLE_PAGESPEED_API_KEY');
    if (apiKey) {
      apiUrl.searchParams.set('key', apiKey);
    }

    console.log(`Fetching PageSpeed data for: ${url} (${strategy})`);

    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('PageSpeed API error:', errorText);
      return new Response(
        JSON.stringify({ error: `PageSpeed API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;

    if (!lighthouse) {
      return new Response(
        JSON.stringify({ error: "No Lighthouse data returned" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract scores
    const scores = {
      performance: Math.round((lighthouse.categories?.performance?.score || 0) * 100),
      accessibility: lighthouse.categories?.accessibility 
        ? Math.round(lighthouse.categories.accessibility.score * 100) 
        : undefined,
      bestPractices: lighthouse.categories?.['best-practices']
        ? Math.round(lighthouse.categories['best-practices'].score * 100)
        : undefined,
      seo: lighthouse.categories?.seo
        ? Math.round(lighthouse.categories.seo.score * 100)
        : undefined,
    };

    // Extract key metrics
    const audits = lighthouse.audits || {};
    const metrics = {
      fcp: audits['first-contentful-paint']?.numericValue || 0,
      lcp: audits['largest-contentful-paint']?.numericValue || 0,
      cls: audits['cumulative-layout-shift']?.numericValue || 0,
      tbt: audits['total-blocking-time']?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue || 0,
      tti: audits['interactive']?.numericValue || 0,
    };

    // Extract detailed audits
    const detailedAudits: LighthouseAudit[] = [
      'first-contentful-paint',
      'largest-contentful-paint',
      'cumulative-layout-shift',
      'total-blocking-time',
      'speed-index',
      'interactive',
      'first-meaningful-paint',
      'max-potential-fid',
    ].map(id => {
      const audit = audits[id];
      if (!audit) return null;
      return {
        id,
        title: audit.title,
        score: Math.round((audit.score || 0) * 100),
        displayValue: audit.displayValue,
        numericValue: audit.numericValue,
        numericUnit: audit.numericUnit,
      };
    }).filter(Boolean) as LighthouseAudit[];

    const result: LighthouseResult = {
      scores,
      audits: detailedAudits,
      metrics,
      fetchTime: lighthouse.fetchTime,
      finalUrl: lighthouse.finalUrl,
    };

    console.log(`PageSpeed complete for ${url}: Performance ${scores.performance}`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("PageSpeed error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
