import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Badge } from '@/components/ui/badge';
import { Rocket, Shield, FileCheck, FlaskConical, History } from 'lucide-react';
import { format } from 'date-fns';

const categoryIcons: Record<string, React.ElementType> = {
  Feature: Rocket,
  Security: Shield,
  Regulatory: FileCheck,
  Research: FlaskConical,
};

const categoryColors: Record<string, string> = {
  Feature: 'bg-primary/10 text-primary border-primary/20',
  Security: 'bg-destructive/10 text-destructive border-destructive/20',
  Regulatory: 'bg-accent/10 text-accent border-accent/20',
  Research: 'bg-secondary text-secondary-foreground border-border',
};

const Changelog = () => {
  const { data: entries, isLoading } = useQuery({
    queryKey: ['changelog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('changelog_entries')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <Helmet>
        <title>Changelog & Product Updates | VitaSignal</title>
        <meta name="description" content="Track VitaSignal's latest features, security updates, regulatory milestones, and research developments." />
      </Helmet>
      <LandingNav />
      <main className="min-h-screen bg-background pb-24">
        <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-background border-b border-border/30">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <History className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">Product Updates</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">Changelog</h1>
            <p className="text-lg text-muted-foreground">
              Follow our progress — every feature, fix, and milestone.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-6 pt-10">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/4 mb-3" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              ))}
            </div>
          ) : entries && entries.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border hidden md:block" />

              <div className="space-y-6">
                {entries.map((entry) => {
                  const Icon = categoryIcons[entry.category] || Rocket;
                  const colorClass = categoryColors[entry.category] || categoryColors.Feature;
                  return (
                    <div key={entry.id} className="relative md:pl-14">
                      {/* Timeline dot */}
                      <div className="absolute left-3 top-6 w-5 h-5 rounded-full bg-card border-2 border-primary hidden md:flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>

                      <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className={`text-xs ${colorClass}`}>
                            <Icon className="w-3 h-3 mr-1" />
                            {entry.category}
                          </Badge>
                          {entry.version && (
                            <span className="text-xs font-mono text-muted-foreground">{entry.version}</span>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">
                            {format(new Date(entry.published_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{entry.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <History className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Updates Coming Soon</h3>
              <p className="text-muted-foreground">Our changelog will document every feature, security patch, and milestone as we build.</p>
            </div>
          )}
        </div>
      </main>
      <LandingFooter />
    </>
  );
};

export default Changelog;
