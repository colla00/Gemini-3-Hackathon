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

/** Extract metadata from HTML: title, description, OG tags, canonical, structured data refs */
function extractMetadata(html: string, url: string) {
  const get = (pattern: RegExp): string | null => {
    const m = html.match(pattern);
    return m ? m[1].trim() : null;
  };

  const getAll = (pattern: RegExp): string[] => {
    const results: string[] = [];
    let m: RegExpExecArray | null;
    const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
    while ((m = re.exec(html)) !== null) results.push(m[1].trim());
    return results;
  };

  // Core meta
  const title = get(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = get(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i)
    || get(/<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["'][^>]*\/?>/i);
  const canonical = get(/<link[^>]*rel=["']canonical["'][^>]*href=["']([\s\S]*?)["'][^>]*\/?>/i);

  // Open Graph
  const ogTitle = get(/<meta[^>]*property=["']og:title["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);
  const ogDescription = get(/<meta[^>]*property=["']og:description["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);
  const ogImage = get(/<meta[^>]*property=["']og:image["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);
  const ogType = get(/<meta[^>]*property=["']og:type["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);
  const ogUrl = get(/<meta[^>]*property=["']og:url["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);

  // Twitter card
  const twitterCard = get(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);
  const twitterTitle = get(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);

  // Trademark mentions
  const trademarkPattern = /(?:VitaSignal|ChartMinder|Documentation Burden Score)™/g;
  const trademarkMentions: string[] = [];
  let tm: RegExpExecArray | null;
  while ((tm = trademarkPattern.exec(html)) !== null) {
    if (!trademarkMentions.includes(tm[0])) trademarkMentions.push(tm[0]);
  }
  const trademarkCount = (html.match(/(?:VitaSignal|ChartMinder|Documentation Burden Score)™/g) || []).length;

  // Headings structure
  const h1s = getAll(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h2s = getAll(/<h2[^>]*>([\s\S]*?)<\/h2>/i);

  // JSON-LD structured data presence
  const hasJsonLd = /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html);

  // Copyright notices
  const copyrightPattern = /©\s*\d{4}[^<]*/g;
  const copyrightNotices = getAll(copyrightPattern);

  return {
    title,
    description,
    canonical,
    open_graph: { title: ogTitle, description: ogDescription, image: ogImage, type: ogType, url: ogUrl },
    twitter: { card: twitterCard, title: twitterTitle },
    trademark_evidence: { marks_found: trademarkMentions, total_mentions: trademarkCount },
    headings: { h1: h1s.map(h => h.replace(/<[^>]*>/g, '').trim()), h2: h2s.map(h => h.replace(/<[^>]*>/g, '').trim()) },
    has_structured_data: hasJsonLd,
    copyright_notices: copyrightNotices.map(c => c.replace(/<[^>]*>/g, '').trim()),
  };
}

/** Convert HTML to a basic markdown representation for evidence readability */
function htmlToMarkdown(html: string): string {
  // Strip script/style
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

  // Headings
  text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  text = text.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');

  // Paragraphs and breaks
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<p[^>]*>/gi, '');

  // Lists
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');

  // Links
  text = text.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Bold / italic
  text = text.replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, '**$1**');
  text = text.replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, '*$1*');

  // Images
  text = text.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![$1]($2)');
  text = text.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)');

  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, '');

  // Decode common entities
  text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'").replace(/&#8482;/g, '™').replace(/&trade;/g, '™')
    .replace(/&copy;/g, '©').replace(/&#169;/g, '©');

  // Clean up whitespace
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}

/** Extract HTTP headers relevant to evidence (server, cache, content-type) */
function extractResponseHeaders(response: Response): Record<string, string> {
  const relevant = ['server', 'content-type', 'x-powered-by', 'cache-control', 'etag', 'last-modified', 'x-frame-options', 'content-security-policy'];
  const headers: Record<string, string> = {};
  for (const key of relevant) {
    const val = response.headers.get(key);
    if (val) headers[key] = val;
  }
  return headers;
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
            'User-Agent': 'VitaSignal-Archiver/2.0 (Trademark Evidence Collection)',
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
        const markdownContent = htmlToMarkdown(htmlContent);
        const pageMeta = extractMetadata(htmlContent, page.url);
        const responseHeaders = extractResponseHeaders(response);

        // Check if content has changed since last snapshot
        const { data: lastArchive } = await supabase
          .from('site_archives')
          .select('content_hash')
          .eq('page_url', page.url)
          .order('captured_at', { ascending: false })
          .limit(1)
          .single();

        const contentChanged = !lastArchive || lastArchive.content_hash !== contentHash;

        const pageTitle = pageMeta.title || page.label;

        // Always store for manual/scheduled triggers
        if (contentChanged || triggerType === 'scheduled' || triggerType === 'manual') {
          const { error: insertError } = await supabase
            .from('site_archives')
            .insert({
              page_url: page.url,
              page_title: pageTitle,
              content_hash: contentHash,
              html_content: htmlContent,
              markdown_content: markdownContent,
              metadata: {
                label: page.label,
                content_length: htmlContent.length,
                markdown_length: markdownContent.length,
                content_changed: contentChanged,
                response_status: response.status,
                response_headers: responseHeaders,
                captured_by: 'VitaSignal-Archiver/2.0',
                // Structured evidence metadata
                page_meta: {
                  description: pageMeta.description,
                  canonical: pageMeta.canonical,
                  has_structured_data: pageMeta.has_structured_data,
                },
                open_graph: pageMeta.open_graph,
                twitter_card: pageMeta.twitter,
                trademark_evidence: pageMeta.trademark_evidence,
                headings: pageMeta.headings,
                copyright_notices: pageMeta.copyright_notices,
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
              trademark_mentions: pageMeta.trademark_evidence.total_mentions,
              marks_found: pageMeta.trademark_evidence.marks_found,
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
    const totalTrademarkMentions = results.reduce((sum, r) => sum + (r.trademark_mentions || 0), 0);
    console.log(`Archive complete: ${successCount}/${results.length} pages, ${totalTrademarkMentions} trademark mentions`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        captured: successCount,
        total: results.length,
        total_trademark_mentions: totalTrademarkMentions,
        results,
        captured_at: new Date().toISOString(),
        archiver_version: '2.0',
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
