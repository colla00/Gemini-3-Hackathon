import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import { format } from 'date-fns';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <SiteLayout title="Loading...">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading article...</div>
        </div>
      </SiteLayout>
    );
  }

  if (!post) {
    return (
      <SiteLayout title="Article Not Found">
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Article Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    author: { '@type': 'Person', name: post.author_name },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    publisher: {
      '@type': 'Organization',
      name: 'VitaSignal',
      url: 'https://vitasignal.ai',
      logo: { '@type': 'ImageObject', url: 'https://vitasignal.ai/favicon.png' },
    },
    image: post.og_image_url || post.cover_image_url,
    mainEntityOfPage: `https://vitasignal.ai/blog/${post.slug}`,
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vitasignal.ai' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://vitasignal.ai/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://vitasignal.ai/blog/${post.slug}` },
    ],
  };

  return (
    <SiteLayout
      title={post.title}
      description={post.meta_description || post.excerpt || ''}
    >
      <Helmet>
        {post.og_image_url && <meta property="og:image" content={post.og_image_url} />}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published_at || ''} />
        <meta property="article:author" content={post.author_name} />
        <meta property="article:section" content={post.category} />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <article className="max-w-3xl mx-auto px-6 pt-10 pb-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        <div className="flex items-center gap-3 mb-4">
          <Badge variant="secondary">{post.category}</Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{post.read_time_minutes} min read</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{post.published_at ? format(new Date(post.published_at), 'MMMM d, yyyy') : ''}</span>
          </div>
        </div>

        {post.cover_image_url && (
          <div className="rounded-xl overflow-hidden mb-10">
            <img src={post.cover_image_url} alt={post.title} className="w-full object-cover" loading="lazy" />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-foreground">
          {post.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-4 text-foreground/90 leading-relaxed">{paragraph}</p>
          ))}
        </div>

        {/* Related / Back */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>
      </article>
    </SiteLayout>
  );
};

export default BlogPost;
