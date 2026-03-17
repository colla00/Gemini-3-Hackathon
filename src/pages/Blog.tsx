import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = ['All', 'Clinical AI', 'Regulatory', 'Nursing Informatics', 'Company News'] as const;

const blogListJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "VitaSignal Blog",
  "url": "https://vitasignal.ai/blog",
  "description": "Clinical AI insights, regulatory updates, and nursing informatics research from VitaSignal.",
  "publisher": { "@type": "Organization", "name": "VitaSignal", "url": "https://vitasignal.ai" },
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts', activeCategory],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (activeCategory !== 'All') {
        query = query.eq('category', activeCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout
      title="Blog & Insights"
      description="Clinical AI insights, regulatory updates, and nursing informatics research from VitaSignal."
    >
      <Helmet>
        <meta name="keywords" content="clinical AI blog, nursing informatics, healthcare AI insights, documentation burden, EHR AI, VitaSignal research" />
        <script type="application/ld+json">{JSON.stringify(blogListJsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-background border-b border-border/30">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">Insights & Research</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
            VitaSignal Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Clinical AI perspectives, regulatory developments, and nursing informatics research from our team.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {post.cover_image_url && (
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{post.read_time_minutes} min read</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : ''}</span>
                      <span>•</span>
                      <span>{post.author_name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">Our first articles are in the works. Check back soon for insights on clinical AI, regulatory strategy, and nursing informatics.</p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
};

export default Blog;
