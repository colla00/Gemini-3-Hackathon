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

/**
 * Fetch page using Jina Reader API for full JS-rendered DOM.
 * Falls back to basic fetch if Jina is unavailable.
 */
async function fetchRenderedPage(url: string): Promise<{ html: string; markdown: string; rendered: boolean }> {
  // Try Jina Reader for JS-rendered HTML
  try {
    console.log(`[Renderer] Fetching rendered HTML via Jina Reader: ${url}`);
    const htmlResponse = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        'Accept': 'text/html',
        'X-Return-Format': 'html',
        'X-Wait-For-Selector': 'h1', // Wait for main content to render
        'User-Agent': 'VitaSignal-Archiver/3.0 (Trademark Evidence Collection)',
      },
      signal: AbortSignal.timeout(30000),
    });

    if (htmlResponse.ok) {
      const renderedHtml = await htmlResponse.text();
      
      // Also get markdown version (default Jina format)
      console.log(`[Renderer] Fetching rendered Markdown via Jina Reader: ${url}`);
      const mdResponse = await fetch(`https://r.jina.ai/${url}`, {
        headers: {
          'Accept': 'text/plain',
          'X-Wait-For-Selector': 'h1',
          'User-Agent': 'VitaSignal-Archiver/3.0 (Trademark Evidence Collection)',
        },
        signal: AbortSignal.timeout(30000),
      });

      const renderedMarkdown = mdResponse.ok ? await mdResponse.text() : htmlToMarkdown(renderedHtml);

      // Validate: accept if content is substantial (>2KB means real rendered page vs empty shell)
      // Also check for trademark keywords (with or without ™ symbol — Jina may use plain text)
      const isSubstantial = renderedHtml.length > 2000;
      const hasTrademarks = /VitaSignal|ChartMinder|Documentation Burden Score/i.test(renderedHtml) || 
                            /VitaSignal|ChartMinder|Documentation Burden Score/i.test(renderedMarkdown);
      
      console.log(`[Renderer] Jina response: ${renderedHtml.length} chars HTML, ${renderedMarkdown.length} chars MD, trademarks: ${hasTrademarks}`);
      
      if (isSubstantial) {
        console.log(`[Renderer] ✓ Got JS-rendered content (${renderedHtml.length} chars, trademarks: ${hasTrademarks})`);
        return { html: renderedHtml, markdown: renderedMarkdown, rendered: true };
      } else {
        console.log(`[Renderer] Jina content too small (${renderedHtml.length} chars), falling back`);
      }
    } else {
      console.log(`[Renderer] Jina returned ${htmlResponse.status}, falling back to basic fetch`);
      await htmlResponse.text(); // consume body
    }
  } catch (err) {
    console.warn(`[Renderer] Jina Reader failed, falling back to basic fetch:`, err);
  }

  // Fallback: basic fetch (SPA shell only)
  console.log(`[Renderer] Using basic fetch for: ${url}`);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'VitaSignal-Archiver/3.0 (Trademark Evidence Collection; Fallback)',
      'Accept': 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  return { html, markdown: htmlToMarkdown(html), rendered: false };
}

/** Extract metadata from HTML + markdown: title, description, OG tags, canonical, structured data refs */
function extractMetadata(html: string, url: string, markdown?: string) {
  // Combine HTML + markdown for trademark searching (Jina may have trademarks in MD but not HTML)
  const searchText = markdown ? html + '\n' + markdown : html;
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

  // Trademark mentions — search both HTML and markdown content
  // Handle ™ as literal char, &trade; entity, &#8482; numeric entity
  const tmSearchText = searchText
    .replace(/&trade;/g, '™')
    .replace(/&#8482;/g, '™');
  
  // Find formal ™ marked mentions
  const formalPattern = /(?:VitaSignal|ChartMinder|Documentation Burden Score)™/g;
  const trademarkMentions: string[] = [];
  let tm: RegExpExecArray | null;
  while ((tm = formalPattern.exec(tmSearchText)) !== null) {
    if (!trademarkMentions.includes(tm[0])) trademarkMentions.push(tm[0]);
  }
  const trademarkCount = (tmSearchText.match(/(?:VitaSignal|ChartMinder|Documentation Burden Score)™/g) || []).length;

  // Also count brand name mentions (with or without ™) for comprehensive evidence
  const brandNames = ['VitaSignal', 'ChartMinder', 'Documentation Burden Score'];
  const brandMentions: Record<string, number> = {};
  for (const brand of brandNames) {
    const re = new RegExp(brand, 'gi');
    const matches = tmSearchText.match(re);
    if (matches && matches.length > 0) {
      brandMentions[brand] = matches.length;
    }
  }
  const totalBrandMentions = Object.values(brandMentions).reduce((a, b) => a + b, 0);

  // Headings structure
  const h1s = getAll(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h2s = getAll(/<h2[^>]*>([\s\S]*?)<\/h2>/i);

  // JSON-LD structured data presence
  const hasJsonLd = /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html);

  // Extract JSON-LD content for evidence
  const jsonLdBlocks: string[] = [];
  const jsonLdPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jm: RegExpExecArray | null;
  while ((jm = jsonLdPattern.exec(html)) !== null) {
    try {
      JSON.parse(jm[1].trim()); // validate it's real JSON
      jsonLdBlocks.push(jm[1].trim());
    } catch { /* skip invalid */ }
  }

  // Copyright notices
  const copyrightPattern = /©\s*\d{4}[^<]*/g;
  const copyrightNotices = getAll(copyrightPattern);

  return {
    title,
    description,
    canonical,
    open_graph: { title: ogTitle, description: ogDescription, image: ogImage, type: ogType, url: ogUrl },
    twitter: { card: twitterCard, title: twitterTitle },
    trademark_evidence: { marks_found: trademarkMentions, total_mentions: trademarkCount, brand_mentions: brandMentions, total_brand_mentions: totalBrandMentions },
    headings: { h1: h1s.map(h => h.replace(/<[^>]*>/g, '').trim()), h2: h2s.map(h => h.replace(/<[^>]*>/g, '').trim()) },
    has_structured_data: hasJsonLd,
    json_ld_blocks: jsonLdBlocks,
    copyright_notices: copyrightNotices.map(c => c.replace(/<[^>]*>/g, '').trim()),
  };
}

/** Convert HTML to a basic markdown representation for evidence readability */
function htmlToMarkdown(html: string): string {
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

  text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  text = text.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');

  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<p[^>]*>/gi, '');

  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  text = text.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
  text = text.replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, '**$1**');
  text = text.replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, '*$1*');

  text = text.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![$1]($2)');
  text = text.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)');

  text = text.replace(/<[^>]+>/g, '');

  text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'").replace(/&#8482;/g, '™').replace(/&trade;/g, '™')
    .replace(/&copy;/g, '©').replace(/&#169;/g, '©');

  text = text.replace(/\n{3,}/g, '\n\n').trim();
  return text;
}

/** Extract HTTP headers relevant to evidence */
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
        
        // Use headless rendering via Jina Reader with basic fetch fallback
        const { html: htmlContent, markdown: markdownContent, rendered } = await fetchRenderedPage(page.url);
        
        const contentHash = await hashContent(htmlContent);
        const pageMeta = extractMetadata(htmlContent, page.url, markdownContent);

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
                captured_by: 'VitaSignal-Archiver/3.0',
                rendering_method: rendered ? 'headless-browser' : 'basic-fetch',
                js_rendered: rendered,
                // Structured evidence metadata
                page_meta: {
                  description: pageMeta.description,
                  canonical: pageMeta.canonical,
                  has_structured_data: pageMeta.has_structured_data,
                  json_ld_count: pageMeta.json_ld_blocks.length,
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
              js_rendered: rendered,
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
    const renderedCount = results.filter(r => r.js_rendered).length;
    const totalTrademarkMentions = results.reduce((sum, r) => sum + (r.trademark_mentions || 0), 0);
    console.log(`Archive complete: ${successCount}/${results.length} pages (${renderedCount} JS-rendered), ${totalTrademarkMentions} trademark mentions`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        captured: successCount,
        total: results.length,
        js_rendered_count: renderedCount,
        total_trademark_mentions: totalTrademarkMentions,
        results,
        captured_at: new Date().toISOString(),
        archiver_version: '3.0',
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
