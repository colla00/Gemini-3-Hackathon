import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
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
      <>
        <LandingNav />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading article...</div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <LandingNav />
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Article Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
        <LandingFooter />
      </>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    author: { '@type': 'Person', name: post.author_name },
    datePublished: post.published_at,
    publisher: { '@type': 'Organization', name: 'VitaSignal' },
    image: post.og_image_url || post.cover_image_url,
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | VitaSignal Blog</title>
        <meta name="description" content={post.meta_description || post.excerpt || ''} />
        {post.og_image_url && <meta property="og:image" content={post.og_image_url} />}
        <meta property="og:title" content={post.title} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <LandingNav />
      <main className="min-h-screen bg-background pb-24">
        <article className="max-w-3xl mx-auto px-6 pt-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

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
              <img src={post.cover_image_url} alt={post.title} className="w-full object-cover" />
            </div>
          )}

          {/* Render content as paragraphs (safe text rendering) */}
          <div className="prose prose-lg max-w-none text-foreground">
            {post.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-4 text-foreground/90 leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </article>
      </main>
      <LandingFooter />
    </>
  );
};

export default BlogPost;
