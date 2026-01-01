import { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Calendar, Loader2, AlertCircle,
  PieChart, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface AttestationAnalyticsProps {
  documentHash: string;
  className?: string;
}

interface AttestationRecord {
  id: string;
  witness_name: string;
  witness_title: string;
  organization: string | null;
  attested_at: string;
  claims_count: number;
}

interface DailyCount {
  date: string;
  count: number;
}

interface OrgCount {
  name: string;
  value: number;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const AttestationAnalytics = ({ documentHash, className }: AttestationAnalyticsProps) => {
  const [attestations, setAttestations] = useState<AttestationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAttestations();
  }, [documentHash]);

  const loadAttestations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('patent_attestations')
        .select('id, witness_name, witness_title, organization, attested_at, claims_count')
        .eq('document_hash', documentHash)
        .order('attested_at', { ascending: true });

      if (queryError) throw queryError;
      setAttestations((data || []) as AttestationRecord[]);
    } catch (err) {
      console.error('Failed to load attestation analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  // Process data for charts
  const dailyData: DailyCount[] = attestations.reduce((acc: DailyCount[], att) => {
    const date = new Date(att.attested_at).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []);

  const orgData: OrgCount[] = attestations.reduce((acc: OrgCount[], att) => {
    const org = att.organization || 'Unspecified';
    const existing = acc.find(d => d.name === org);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: org, value: 1 });
    }
    return acc;
  }, []);

  // Get unique witnesses
  const uniqueWitnesses = new Set(attestations.map(a => a.witness_name)).size;
  const uniqueOrgs = new Set(attestations.filter(a => a.organization).map(a => a.organization)).size;

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center gap-2 text-destructive text-sm py-4", className)}>
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-muted-foreground">Total Attestations</span>
          </div>
          <p className="text-2xl font-bold text-purple-500">{attestations.length}</p>
        </div>

        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Unique Witnesses</span>
          </div>
          <p className="text-2xl font-bold text-blue-500">{uniqueWitnesses}</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-muted-foreground">Organizations</span>
          </div>
          <p className="text-2xl font-bold text-emerald-500">{uniqueOrgs}</p>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Last 30 Days</span>
          </div>
          <p className="text-2xl font-bold text-amber-500">
            {attestations.filter(a => {
              const date = new Date(a.attested_at);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return date >= thirtyDaysAgo;
            }).length}
          </p>
        </div>
      </div>

      {attestations.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Attestations Over Time */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Attestations Over Time</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* By Organization */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">By Organization</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={orgData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name.length > 10 ? name.slice(0, 10) + '...' : name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {orgData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No attestations yet to analyze</p>
        </div>
      )}

      {/* Recent Activity Table */}
      {attestations.length > 0 && (
        <div className="p-4 rounded-xl bg-card border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Attestations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Witness</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Title</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Organization</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {attestations.slice(-10).reverse().map(att => (
                  <tr key={att.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-2 px-3 text-foreground">{att.witness_name}</td>
                    <td className="py-2 px-3 text-muted-foreground">{att.witness_title}</td>
                    <td className="py-2 px-3 text-muted-foreground">{att.organization || '-'}</td>
                    <td className="py-2 px-3 text-muted-foreground">
                      {new Date(att.attested_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
