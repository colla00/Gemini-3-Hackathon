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

const BRAND_NAMES = ['VitaSignal', 'ChartMinder', 'Documentation Burden Score'];

async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Fetch page using Jina Reader API for full JS-rendered content.
 * Jina returns the SPA shell as HTML but the REAL rendered content as Markdown.
 * We use Markdown as the primary evidence artifact.
 */
async function fetchRenderedPage(url: string): Promise<{ html: string; markdown: string; rendered: boolean }> {
  try {
    console.log(`[Renderer] Fetching via Jina Reader: ${url}`);
    
    // Fetch HTML version (will be SPA shell but useful for meta tags)
    const htmlResponse = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        'Accept': 'text/html',
        'X-Return-Format': 'html',
        'X-Wait-For-Selector': 'h1',
        'User-Agent': 'VitaSignal-Archiver/4.0 (Trademark Evidence Collection)',
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!htmlResponse.ok) {
      console.log(`[Renderer] Jina HTML returned ${htmlResponse.status}, falling back`);
      await htmlResponse.text();
      throw new Error(`Jina HTML ${htmlResponse.status}`);
    }

    const htmlContent = await htmlResponse.text();

    // Fetch Markdown version (this is the REAL rendered content)
    console.log(`[Renderer] Fetching rendered Markdown: ${url}`);
    const mdResponse = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        'Accept': 'text/plain',
        'X-Wait-For-Selector': 'h1',
        'User-Agent': 'VitaSignal-Archiver/4.0 (Trademark Evidence Collection)',
      },
      signal: AbortSignal.timeout(30000),
    });

    const markdownContent = mdResponse.ok ? await mdResponse.text() : '';
    
    const isSubstantial = htmlContent.length > 2000 || markdownContent.length > 500;
    const hasBrands = BRAND_NAMES.some(b => 
      new RegExp(b, 'i').test(htmlContent) || new RegExp(b, 'i').test(markdownContent)
    );

    console.log(`[Renderer] HTML: ${htmlContent.length} chars, MD: ${markdownContent.length} chars, brands: ${hasBrands}`);

    if (isSubstantial) {
      return { html: htmlContent, markdown: markdownContent, rendered: true };
    }
    
    console.log(`[Renderer] Content too small, falling back`);
  } catch (err) {
    console.warn(`[Renderer] Jina Reader failed, falling back:`, err);
  }

  // Fallback: basic fetch (SPA shell only)
  console.log(`[Renderer] Using basic fetch for: ${url}`);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'VitaSignal-Archiver/4.0 (Trademark Evidence Collection; Fallback)',
      'Accept': 'text/html',
    },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  return { html, markdown: htmlToMarkdown(html), rendered: false };
}

/** Extract headings from markdown content (# H1, ## H2) */
function extractMarkdownHeadings(markdown: string): { h1: string[]; h2: string[] } {
  const h1s: string[] = [];
  const h2s: string[] = [];
  
  for (const line of markdown.split('\n')) {
    const trimmed = line.trim();
    // Match ## but not ### (h2 only)
    if (/^## (?!#)/.test(trimmed)) {
      const text = trimmed.replace(/^## /, '').replace(/\*\*/g, '').trim();
      if (text && !h2s.includes(text)) h2s.push(text);
    }
    // Match # but not ## (h1 only) — also handle === underline style
    else if (/^# (?!#)/.test(trimmed)) {
      const text = trimmed.replace(/^# /, '').replace(/\*\*/g, '').trim();
      if (text && !h1s.includes(text)) h1s.push(text);
    }
  }

  // Also check for underline-style headings (text followed by ===)
  const lines = markdown.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    if (/^={3,}\s*$/.test(lines[i + 1].trim()) && lines[i].trim().length > 0) {
      const text = lines[i].trim().replace(/\*\*/g, '');
      if (text && !h1s.includes(text)) h1s.push(text);
    }
  }

  return { h1: h1s, h2: h2s };
}

/** Count brand name mentions in text */
function countBrandMentions(text: string): { brandMentions: Record<string, number>; totalBrandMentions: number } {
  const normalized = text
    .replace(/&trade;/g, '™')
    .replace(/&#8482;/g, '™');

  const brandMentions: Record<string, number> = {};
  for (const brand of BRAND_NAMES) {
    const re = new RegExp(brand, 'gi');
    const matches = normalized.match(re);
    if (matches && matches.length > 0) {
      brandMentions[brand] = matches.length;
    }
  }
  const totalBrandMentions = Object.values(brandMentions).reduce((a, b) => a + b, 0);
  return { brandMentions, totalBrandMentions };
}

/** Extract metadata from HTML <head> for OG tags, meta description, etc. */
function extractHtmlMeta(html: string) {
  const get = (pattern: RegExp): string | null => {
    const m = html.match(pattern);
    return m ? m[1].trim() : null;
  };

  const title = get(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = get(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i)
    || get(/<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["'][^>]*\/?>/i);
  const canonical = get(/<link[^>]*rel=["']canonical["'][^>]*href=["']([\s\S]*?)["'][^>]*\/?>/i);

  const ogTitle = get(/<meta[^>]*property=["']og:title["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);
  const ogDescription = get(/<meta[^>]*property=["']og:description["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);
  const ogImage = get(/<meta[^>]*property=["']og:image["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);
  const ogType = get(/<meta[^>]*property=["']og:type["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);
  const ogUrl = get(/<meta[^>]*property=["']og:url["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);

  const twitterCard = get(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);
  const twitterTitle = get(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/i);

  const hasJsonLd = /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html);
  const jsonLdBlocks: string[] = [];
  const jsonLdPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jm: RegExpExecArray | null;
  while ((jm = jsonLdPattern.exec(html)) !== null) {
    try {
      JSON.parse(jm[1].trim());
      jsonLdBlocks.push(jm[1].trim());
    } catch { /* skip invalid */ }
  }

  const copyrightPattern = /©\s*\d{4}[^<]*/g;
  const copyrightMatches = html.match(copyrightPattern) || [];

  return {
    title,
    description,
    canonical,
    open_graph: { title: ogTitle, description: ogDescription, image: ogImage, type: ogType, url: ogUrl },
    twitter: { card: twitterCard, title: twitterTitle },
    has_structured_data: hasJsonLd,
    json_ld_blocks: jsonLdBlocks,
    copyright_notices: copyrightMatches.map(c => c.replace(/<[^>]*>/g, '').trim()),
  };
}

/** Convert HTML to a basic markdown representation */
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
        
        const { html: htmlContent, markdown: markdownContent, rendered } = await fetchRenderedPage(page.url);
        
        // FIX #1: Hash the markdown (real content) instead of HTML shell
        // Combine both for a comprehensive hash, but markdown is the primary signal
        const contentToHash = markdownContent.length > 100 ? markdownContent : htmlContent;
        const contentHash = await hashContent(contentToHash);
        
        // FIX #2: Extract headings from markdown (not HTML shell)
        const mdHeadings = extractMarkdownHeadings(markdownContent);
        
        // Also try HTML headings as fallback
        const htmlMeta = extractHtmlMeta(htmlContent);
        const headings = {
          h1: mdHeadings.h1.length > 0 ? mdHeadings.h1 : (htmlMeta.has_structured_data ? [] : []),
          h2: mdHeadings.h2.length > 0 ? mdHeadings.h2 : [],
          source: mdHeadings.h1.length > 0 || mdHeadings.h2.length > 0 ? 'markdown' : 'html',
        };

        // FIX #3: brand_mentions is the primary trademark metric
        // Search across both HTML + markdown for comprehensive coverage
        const searchText = htmlContent + '\n' + markdownContent;
        const { brandMentions, totalBrandMentions } = countBrandMentions(searchText);
        
        // Also extract copyright notices from markdown
        const mdCopyrights: string[] = [];
        const cpMatch = markdownContent.match(/©\s*\d{4}[^\n]*/g);
        if (cpMatch) mdCopyrights.push(...cpMatch.map(c => c.trim()));
        const allCopyrights = [...new Set([...htmlMeta.copyright_notices, ...mdCopyrights])];

        // Check if content has changed since last snapshot
        const { data: lastArchive } = await supabase
          .from('site_archives')
          .select('content_hash')
          .eq('page_url', page.url)
          .order('captured_at', { ascending: false })
          .limit(1)
          .single();

        const contentChanged = !lastArchive || lastArchive.content_hash !== contentHash;
        const pageTitle = htmlMeta.title || page.label;

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
                captured_by: 'VitaSignal-Archiver/4.0',
                rendering_method: rendered ? 'headless-browser' : 'basic-fetch',
                js_rendered: rendered,
                hash_source: markdownContent.length > 100 ? 'markdown' : 'html',
                page_meta: {
                  description: htmlMeta.description,
                  canonical: htmlMeta.canonical,
                  has_structured_data: htmlMeta.has_structured_data,
                  json_ld_count: htmlMeta.json_ld_blocks.length,
                },
                open_graph: htmlMeta.open_graph,
                twitter_card: htmlMeta.twitter,
                trademark_evidence: {
                  brand_mentions: brandMentions,
                  total_brand_mentions: totalBrandMentions,
                },
                headings,
                copyright_notices: allCopyrights,
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
              hash_source: markdownContent.length > 100 ? 'markdown' : 'html',
              js_rendered: rendered,
              brand_mentions: totalBrandMentions,
              brand_detail: brandMentions,
              headings_found: mdHeadings.h1.length + mdHeadings.h2.length,
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
    const totalBrandMentions = results.reduce((sum, r) => sum + (r.brand_mentions || 0), 0);
    const uniqueHashes = new Set(results.filter(r => r.content_hash).map(r => r.content_hash)).size;
    console.log(`Archive complete: ${successCount}/${results.length} pages (${renderedCount} JS-rendered), ${uniqueHashes} unique hashes, ${totalBrandMentions} brand mentions`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        captured: successCount,
        total: results.length,
        js_rendered_count: renderedCount,
        unique_content_hashes: uniqueHashes,
        total_brand_mentions: totalBrandMentions,
        results,
        captured_at: new Date().toISOString(),
        archiver_version: '4.0',
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
