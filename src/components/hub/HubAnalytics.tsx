import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Globe, TrendingUp, Eye, Loader2 } from 'lucide-react';

interface PageView {
  id: string;
  page_path: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

interface TopPage {
  path: string;
  count: number;
}

interface DailyCount {
  date: string;
  count: number;
}

interface ReferrerSource {
  source: string;
  count: number;
}

const Card = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: '#151f35' }}>
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4" style={{ color: '#00c8b4' }} />
      <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">{title}</h3>
    </div>
    {children}
  </div>
);

const BarRow = ({ label, value, max }: { label: string; value: number; max: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-white/70 truncate max-w-[200px]">{label}</span>
      <span className="text-white/50 tabular-nums">{value}</span>
    </div>
    <div className="h-1.5 rounded-full bg-white/5">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.max((value / max) * 100, 2)}%`, background: '#00c8b4' }}
      />
    </div>
  </div>
);

const HubAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState<PageView[]>([]);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data, error: err } = await supabase
        .from('page_views')
        .select('*')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false })
        .limit(1000);

      if (err) {
        setError(err.message);
      } else {
        setViews((data as PageView[]) || []);
      }
      setLoading(false);
    };
    fetch();
  }, [days]);

  // Compute top pages
  const topPages: TopPage[] = (() => {
    const map: Record<string, number> = {};
    views.forEach(v => { map[v.page_path] = (map[v.page_path] || 0) + 1; });
    return Object.entries(map)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  })();

  // Compute daily visits
  const dailyCounts: DailyCount[] = (() => {
    const map: Record<string, number> = {};
    views.forEach(v => {
      const d = v.created_at.substring(0, 10);
      map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  })();

  // Compute referrer sources
  const referrers: ReferrerSource[] = (() => {
    const map: Record<string, number> = {};
    views.forEach(v => {
      let source = 'Direct';
      if (v.referrer) {
        try {
          source = new URL(v.referrer).hostname;
        } catch {
          source = v.referrer.substring(0, 40);
        }
      }
      map[source] = (map[source] || 0) + 1;
    });
    return Object.entries(map)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  })();

  const maxDaily = Math.max(...dailyCounts.map(d => d.count), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-white/30" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 p-6 text-red-400 text-sm" style={{ background: '#1a1020' }}>
        Failed to load analytics: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Page View Analytics</h2>
          <p className="text-xs text-white/40 mt-0.5">{views.length} views in last {days} days</p>
        </div>
        <div className="flex gap-1">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                days === d ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
              style={days === d ? { background: 'rgba(0,200,180,0.15)', color: '#00c8b4' } : undefined}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Views', value: views.length, icon: Eye },
          { label: 'Unique Pages', value: topPages.length, icon: BarChart3 },
          { label: 'Referrer Sources', value: referrers.length, icon: Globe },
          { label: 'Avg/Day', value: dailyCounts.length ? Math.round(views.length / dailyCounts.length) : 0, icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/10 p-4" style={{ background: '#151f35' }}>
            <s.icon className="w-4 h-4 mb-2" style={{ color: '#00c8b4' }} />
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-[10px] text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Pages */}
        <Card title="Top Pages" icon={BarChart3}>
          <div className="space-y-2.5">
            {topPages.length === 0 && <p className="text-xs text-white/30">No data yet</p>}
            {topPages.map(p => (
              <BarRow key={p.path} label={p.path} value={p.count} max={topPages[0]?.count || 1} />
            ))}
          </div>
        </Card>

        {/* Referrer Sources */}
        <Card title="Referrer Sources" icon={Globe}>
          <div className="space-y-2.5">
            {referrers.length === 0 && <p className="text-xs text-white/30">No data yet</p>}
            {referrers.map(r => (
              <BarRow key={r.source} label={r.source} value={r.count} max={referrers[0]?.count || 1} />
            ))}
          </div>
        </Card>
      </div>

      {/* Daily visits chart (simple bar chart) */}
      <Card title="Daily Visits" icon={TrendingUp}>
        {dailyCounts.length === 0 ? (
          <p className="text-xs text-white/30">No data yet</p>
        ) : (
          <div className="flex items-end gap-[2px] h-32 mt-2">
            {dailyCounts.map(d => (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <div
                  className="w-full rounded-t transition-all min-h-[2px]"
                  style={{
                    height: `${(d.count / maxDaily) * 100}%`,
                    background: '#00c8b4',
                    opacity: 0.8,
                  }}
                />
                <div className="absolute bottom-full mb-1 hidden group-hover:block px-2 py-1 rounded text-[10px] text-white bg-black/80 whitespace-nowrap z-10">
                  {d.date}: {d.count} views
                </div>
              </div>
            ))}
          </div>
        )}
        {dailyCounts.length > 0 && (
          <div className="flex justify-between text-[9px] text-white/30 mt-1">
            <span>{dailyCounts[0]?.date}</span>
            <span>{dailyCounts[dailyCounts.length - 1]?.date}</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HubAnalytics;
