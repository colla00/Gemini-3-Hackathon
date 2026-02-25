import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const PAGES_TO_ARCHIVE = [
  { url: 'https://clinicaldashboard.lovable.app/', label: 'Landing Page' },
  { url: 'https://clinicaldashboard.lovable.app/about', label: 'About' },
  { url: 'https://clinicaldashboard.lovable.app/patents', label: 'Patents' },
  { url: 'https://clinicaldashboard.lovable.app/licensing', label: 'Licensing' },
  { url: 'https://clinicaldashboard.lovable.app/contact', label: 'Contact' },
];

async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json().catch(() => ({}));
    const triggerType = body.trigger_type || 'manual';
    const notes = body.notes || null;
    const pagesToCapture = body.pages || PAGES_TO_ARCHIVE;

    const results = [];

    for (const page of pagesToCapture) {
      try {
        console.log(`Archiving: ${page.url}`);
        
        const response = await fetch(page.url, {
          headers: {
            'User-Agent': 'VitaSignal-Archiver/1.0 (Trademark Evidence)',
            'Accept': 'text/html',
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${page.url}: ${response.status}`);
          results.push({ url: page.url, success: false, error: `HTTP ${response.status}` });
          continue;
        }

        const htmlContent = await response.text();
        const contentHash = await hashContent(htmlContent);

        // Check if content has changed since last snapshot
        const { data: lastArchive } = await supabase
          .from('site_archives')
          .select('content_hash')
          .eq('page_url', page.url)
          .order('captured_at', { ascending: false })
          .limit(1)
          .single();

        const contentChanged = !lastArchive || lastArchive.content_hash !== contentHash;

        // Extract title from HTML
        const titleMatch = htmlContent.match(/<title[^>]*>(.*?)<\/title>/i);
        const pageTitle = titleMatch ? titleMatch[1].trim() : page.label;

        // Always store for scheduled, only store if changed for manual
        if (contentChanged || triggerType === 'scheduled') {
          const { error: insertError } = await supabase
            .from('site_archives')
            .insert({
              page_url: page.url,
              page_title: pageTitle,
              content_hash: contentHash,
              html_content: htmlContent,
              metadata: {
                label: page.label,
                content_length: htmlContent.length,
                content_changed: contentChanged,
                response_status: response.status,
                captured_by: 'VitaSignal-Archiver/1.0',
              },
              trigger_type: triggerType,
              notes: notes,
            });

          if (insertError) {
            console.error(`Failed to store archive for ${page.url}:`, insertError);
            results.push({ url: page.url, success: false, error: insertError.message });
          } else {
            results.push({ 
              url: page.url, 
              success: true, 
              content_changed: contentChanged,
              content_hash: contentHash,
            });
          }
        } else {
          results.push({ 
            url: page.url, 
            success: true, 
            skipped: true, 
            reason: 'Content unchanged',
          });
        }
      } catch (pageError) {
        console.error(`Error archiving ${page.url}:`, pageError);
        results.push({ url: page.url, success: false, error: String(pageError) });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`Archive complete: ${successCount}/${results.length} pages captured`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        captured: successCount,
        total: results.length,
        results,
        captured_at: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Archive error:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
