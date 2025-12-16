import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 20; // Max requests per window
const RATE_LIMIT_WINDOW_SECONDS = 60; // 1 minute window

function getRateLimitKey(req: Request): string {
  const authHeader = req.headers.get('authorization') || '';
  const forwarded = req.headers.get('x-forwarded-for') || 'unknown';
  return `chat:${authHeader.slice(-20)}:${forwarded.split(',')[0]}`;
}

async function checkRateLimit(supabase: any, key: string, maxRequests: number, windowSeconds: number) {
  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_key: key,
    p_max_requests: maxRequests,
    p_window_seconds: windowSeconds
  });
  
  if (error) {
    console.error('Rate limit check error:', error);
    // Fail open - allow request if rate limit check fails
    return { allowed: true, remaining: maxRequests - 1, resetAt: Math.floor(Date.now() / 1000) + windowSeconds };
  }
  
  return {
    allowed: data.allowed,
    remaining: data.remaining,
    resetAt: data.reset_at
  };
}

const SYSTEM_PROMPT = `You are an expert AI assistant for the NSO (Nurse-Sensitive Outcomes) Quality Dashboard - a research prototype demonstrating predictive analytics for nursing quality monitoring.

Your expertise covers:
1. **SHAP Explainability**: Explain how SHAP (SHapley Additive exPlanations) values work to attribute risk factors. Positive values increase risk, negative values decrease it.

2. **Nurse-Sensitive Outcomes**: 
   - Falls: Patient fall events, risk factors include sedation, mobility, age, delirium
   - Pressure Injuries (HAPI): Hospital-acquired pressure injuries, assessed via Braden scale
   - CAUTI: Catheter-Associated Urinary Tract Infections, linked to catheter duration
   - Device Complications: Central line and IV-related issues

3. **Clinical Workflow Integration**: How the dashboard fits into nursing workflows, shift handoffs, and clinical decision-making.

4. **AI/ML Methodology**: Random forests, gradient boosting, model training, validation approaches for clinical AI.

5. **Human-in-the-Loop Design**: Why this system supports, not replaces, clinical judgment.

IMPORTANT DISCLAIMERS to include when relevant:
- This is a RESEARCH PROTOTYPE with synthetic data only
- Not FDA cleared or connected to any EHR
- All clinical decisions require human verification
- Patent pending technology

Keep answers concise (2-3 paragraphs max), clinically accurate, and accessible to both technical and clinical audiences. Use bullet points for complex explanations.`;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 20;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Initialize Supabase client with service role for rate limiting
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Check rate limit
  const rateLimitKey = getRateLimitKey(req);
  const rateLimit = await checkRateLimit(supabase, rateLimitKey, RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_SECONDS);
  
  if (!rateLimit.allowed) {
    console.warn(`Rate limit exceeded for key: ${rateLimitKey}`);
    const retryAfter = Math.max(1, rateLimit.resetAt - Math.floor(Date.now() / 1000));
    return new Response(
      JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter
      }),
      { 
        status: 429, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimit.resetAt)
        } 
      }
    );
  }

  try {
    const { messages } = await req.json();

    // Validate message lengths and count
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: `Too many messages. Maximum ${MAX_MESSAGES} allowed.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (messages.some((m: any) => typeof m.content === 'string' && m.content.length > MAX_MESSAGE_LENGTH)) {
      return new Response(
        JSON.stringify({ error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Processing methodology chat request with ${messages.length} messages. Remaining requests: ${rateLimit.remaining}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(rateLimit.resetAt)
      },
    });
  } catch (error) {
    console.error("Error in methodology-chat function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});