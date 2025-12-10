import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 10; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

// In-memory rate limit store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(req: Request): string {
  // Use Authorization header or IP as identifier
  const authHeader = req.headers.get('authorization') || '';
  const forwarded = req.headers.get('x-forwarded-for') || 'unknown';
  return `tts:${authHeader.slice(-20)}:${forwarded.split(',')[0]}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now >= entry.resetAt) {
    // New window
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  if (entry.count >= RATE_LIMIT_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }
  
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_REQUESTS - entry.count, resetIn: entry.resetAt - now };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const MAX_TEXT_LENGTH = 4096;
  const ALLOWED_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;

  try {
    // Check rate limit
    const rateLimitKey = getRateLimitKey(req);
    const rateLimit = checkRateLimit(rateLimitKey);
    
    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for key: ${rateLimitKey}`);
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil(rateLimit.resetIn / 1000)
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetIn / 1000))
          } 
        }
      );
    }

    const { text, voice = 'alloy' } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Text exceeds ${MAX_TEXT_LENGTH} character limit` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!ALLOWED_VOICES.includes(voice)) {
      return new Response(
        JSON.stringify({ error: `Invalid voice. Must be one of: ${ALLOWED_VOICES.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating speech for text (${text.length} chars) with voice: ${voice}. Remaining requests: ${rateLimit.remaining}`);

    // Generate speech from text using OpenAI TTS
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        input: text,
        voice: voice,
        response_format: 'mp3',
        speed: 1.0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI TTS error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate speech', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log(`Successfully generated audio (${base64Audio.length} base64 chars)`);

    return new Response(
      JSON.stringify({ audioContent: base64Audio, format: 'mp3' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetIn / 1000))
        } 
      }
    );
  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
