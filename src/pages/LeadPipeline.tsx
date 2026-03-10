import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Building2, Rocket, Clock, Filter, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SiteLayout } from '@/components/layout/SiteLayout';

type Inquiry = {
  id: string;
  created_at: string;
  inquiry_type: string;
  name: string;
  email: string;
  organization: string | null;
  role: string | null;
  message: string;
  status: string;
};

const statusColors: Record<string, string> = {
  new: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  contacted: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  qualified: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  pilot_signed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  closed: 'text-white/30 bg-white/5 border-white/10',
};

const typeLabels: Record<string, string> = {
  pilot_request: 'Pilot Request',
  career_application: 'Career App',
  general: 'General',
  licensing: 'Licensing',
  contact: 'Contact',
};

const LeadPipeline = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Failed to load leads', variant: 'destructive' });
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('contact_inquiries').update({ status }).eq('id', id);
    if (error) {
      toast({ title: 'Update failed', variant: 'destructive' });
    } else {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      toast({ title: `Status updated to ${status}` });
    }
  };

  const filtered = filter === 'all' ? leads : leads.filter(l => l.inquiry_type === filter);

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    pilots: leads.filter(l => l.inquiry_type === 'pilot_request').length,
    qualified: leads.filter(l => l.status === 'qualified' || l.status === 'pilot_signed').length,
  };

  const parseMessage = (msg: string) => {
    try { return JSON.parse(msg); } catch { return null; }
  };

  return (
    <SiteLayout title="Lead Pipeline | VitaSignal">
      <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
        <section className="pt-28 pb-6 px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-white font-['DM_Serif_Display'] flex items-center gap-3">
              <Users className="w-7 h-7 text-emerald-400" /> Lead Pipeline
            </h1>
            <p className="text-sm text-white/50 mt-1">Track inbound leads from pilot requests, contact forms, and career applications.</p>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 pb-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Leads', value: stats.total, color: 'text-white' },
              { label: 'New / Uncontacted', value: stats.new, color: 'text-blue-400' },
              { label: 'Pilot Requests', value: stats.pilots, color: 'text-purple-400' },
              { label: 'Qualified / Signed', value: stats.qualified, color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Filter */}
        <section className="px-4 pb-4">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <Filter className="w-4 h-4 text-white/30" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pilot_request">Pilot Requests</SelectItem>
                <SelectItem value="career_application">Career Apps</SelectItem>
                <SelectItem value="licensing">Licensing</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-white/30">{filtered.length} leads</span>
          </div>
        </section>

        {/* Lead List */}
        <section className="px-4 pb-20">
          <div className="max-w-5xl mx-auto space-y-2">
            {loading ? (
              <div className="text-center py-12 text-white/30">Loading leads...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-white/30">No leads found</div>
            ) : filtered.map(lead => {
              const expanded = expandedId === lead.id;
              const parsed = parseMessage(lead.message);
              const age = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
              return (
                <motion.div key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <button onClick={() => setExpandedId(expanded ? null : lead.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {lead.inquiry_type === 'pilot_request' ? <Rocket className="w-3.5 h-3.5 text-purple-400" /> :
                         lead.inquiry_type === 'career_application' ? <Users className="w-3.5 h-3.5 text-cyan-400" /> :
                         <Mail className="w-3.5 h-3.5 text-white/40" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-white truncate">{lead.name}</span>
                          {lead.organization && <span className="text-xs text-white/30 truncate">· {lead.organization}</span>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <span>{typeLabels[lead.inquiry_type] || lead.inquiry_type}</span>
                          <span>·</span>
                          <span>{age === 0 ? 'Today' : `${age}d ago`}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColors[lead.status] || statusColors.new}`}>
                        {lead.status}
                      </span>
                      {expanded ? <ChevronUp className="w-4 h-4 text-white/20" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
                    </div>
                  </button>
                  {expanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div><span className="text-white/40">Email:</span> <span className="text-white">{lead.email}</span></div>
                        {lead.role && <div><span className="text-white/40">Role:</span> <span className="text-white">{lead.role}</span></div>}
                        {lead.organization && <div><span className="text-white/40">Org:</span> <span className="text-white">{lead.organization}</span></div>}
                        <div><span className="text-white/40">Submitted:</span> <span className="text-white">{new Date(lead.created_at).toLocaleDateString()}</span></div>
                      </div>
                      {parsed && (
                        <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3 space-y-1.5">
                          {Object.entries(parsed).filter(([, v]) => v).map(([k, v]) => (
                            <div key={k} className="text-xs flex gap-2">
                              <span className="text-white/30 capitalize w-28 shrink-0">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                              <span className="text-white/60">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {!parsed && lead.message && (
                        <p className="text-xs text-white/50 bg-white/[0.03] rounded-lg p-3">{lead.message}</p>
                      )}
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-[10px] text-white/30">Update status:</span>
                        {['new', 'contacted', 'qualified', 'pilot_signed', 'closed'].map(s => (
                          <button key={s} onClick={() => updateStatus(lead.id, s)}
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all ${
                              lead.status === s ? statusColors[s] : 'border-white/10 text-white/20 hover:text-white/40'
                            }`}>
                            {s.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                      {lead.inquiry_type === 'pilot_request' && (
                        <Button asChild size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-xs">
                          <a href={`/proposal?lead=${lead.id}`}>
                            <Eye className="w-3 h-3 mr-1" /> Generate Proposal
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default LeadPipeline;
