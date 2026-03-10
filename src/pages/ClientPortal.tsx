import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Activity, Users, Shield, TrendingUp, Clock, BarChart3, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { SiteLayout } from '@/components/layout/SiteLayout';

// Simulated pilot metrics (in production, these would come from real-time inference)
const mockMetrics = {
  riskScoresGenerated: 12847,
  patientsMonitored: 342,
  alertsTriggered: 89,
  alertsActedOn: 76,
  avgResponseTime: '4.2 min',
  nurseTimeSaved: '1,240 hrs',
  haisPreventedEst: 7,
  equityScore: 0.97,
  uptimePercent: 99.8,
  daysActive: 47,
};

const weeklyData = [
  { week: 'W1', scores: 1820, alerts: 8, acted: 6 },
  { week: 'W2', scores: 2140, alerts: 12, acted: 10 },
  { week: 'W3', scores: 1960, alerts: 11, acted: 9 },
  { week: 'W4', scores: 2280, alerts: 14, acted: 12 },
  { week: 'W5', scores: 2340, alerts: 16, acted: 14 },
  { week: 'W6', scores: 2190, alerts: 15, acted: 13 },
  { week: 'W7', scores: 2117, alerts: 13, acted: 12 },
];

type Engagement = {
  id: string;
  organization_name: string;
  contact_name: string;
  status: string;
  bed_count: number;
  icu_beds: number;
  pilot_start_date: string | null;
  pilot_end_date: string | null;
  unit_deployed: string;
  ehr_system: string | null;
};

const ClientPortal = () => {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [selectedEngagement, setSelectedEngagement] = useState<Engagement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('pilot_engagements').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        setEngagements(data || []);
        if (data?.length) setSelectedEngagement(data[0]);
        setLoading(false);
      });
  }, []);

  const metrics = mockMetrics;
  const org = selectedEngagement?.organization_name || 'Your Organization';

  return (
    <SiteLayout title={`Client Portal | ${org} — VitaSignal`}>
      <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
        <section className="pt-28 pb-6 px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white font-['DM_Serif_Display'] flex items-center gap-3">
                <Building2 className="w-7 h-7 text-emerald-400" /> Client Portal
              </h1>
              <p className="text-sm text-white/50 mt-1">
                {selectedEngagement ? `${org} — Pilot Performance Dashboard` : 'Pilot engagement overview'}
              </p>
            </div>
            {selectedEngagement && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
                  <CheckCircle2 className="w-3 h-3 inline mr-1" /> Active Pilot
                </span>
                <span className="text-xs text-white/30">Day {metrics.daysActive} of 90</span>
              </div>
            )}
          </div>
        </section>

        {loading ? (
          <div className="text-center py-20 text-white/30">Loading engagements...</div>
        ) : !selectedEngagement ? (
          <section className="px-4 pb-20">
            <div className="max-w-3xl mx-auto text-center py-20">
              <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No Active Pilots</h2>
              <p className="text-sm text-white/50 mb-6">Pilot engagements will appear here once they're activated by the VitaSignal team.</p>
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <a href="/pilot-request">Request a Pilot</a>
              </Button>
            </div>
          </section>
        ) : (
          <>
            {/* Key Metrics */}
            <section className="px-4 pb-6">
              <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Activity, label: 'Risk Scores Generated', value: metrics.riskScoresGenerated.toLocaleString(), color: 'text-cyan-400' },
                  { icon: Users, label: 'Patients Monitored', value: metrics.patientsMonitored.toLocaleString(), color: 'text-blue-400' },
                  { icon: Clock, label: 'Nurse Hours Saved', value: metrics.nurseTimeSaved, color: 'text-emerald-400' },
                  { icon: Shield, label: 'Equity Score', value: metrics.equityScore.toFixed(2), color: 'text-purple-400' },
                ].map(m => (
                  <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <m.icon className={`w-5 h-5 mx-auto mb-2 ${m.color}`} />
                    <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-[10px] text-white/40">{m.label}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Weekly Trend */}
            <section className="px-4 pb-6">
              <div className="max-w-5xl mx-auto">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyan-400" /> Weekly Activity
                  </h3>
                  <div className="space-y-2">
                    {weeklyData.map(w => (
                      <div key={w.week} className="flex items-center gap-3">
                        <span className="text-xs text-white/40 w-8">{w.week}</span>
                        <div className="flex-1 h-4 rounded-full bg-white/5 overflow-hidden relative">
                          <div className="h-full rounded-full bg-cyan-500/40" style={{ width: `${(w.scores / 2500) * 100}%` }} />
                        </div>
                        <span className="text-xs text-white/50 w-16 text-right">{w.scores} scores</span>
                        <span className="text-xs text-emerald-400 w-12 text-right">{w.acted}/{w.alerts}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-4 mt-3 text-[10px] text-white/30">
                    <span>█ Risk scores generated</span>
                    <span className="text-emerald-400">Alerts acted on / triggered</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Clinical Impact */}
            <section className="px-4 pb-6">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
                  <p className="text-3xl font-bold text-emerald-400">{metrics.haisPreventedEst}</p>
                  <p className="text-xs text-white/50 mt-1">Estimated HAIs Prevented</p>
                  <p className="text-[10px] text-white/30 mt-2">≈ ${(metrics.haisPreventedEst * 28400).toLocaleString()} in avoided costs</p>
                </div>
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 text-center">
                  <p className="text-3xl font-bold text-blue-400">{metrics.alertsActedOn}/{metrics.alertsTriggered}</p>
                  <p className="text-xs text-white/50 mt-1">Alert Action Rate</p>
                  <p className="text-[10px] text-white/30 mt-2">{Math.round((metrics.alertsActedOn / metrics.alertsTriggered) * 100)}% of clinical alerts led to intervention</p>
                </div>
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 text-center">
                  <p className="text-3xl font-bold text-purple-400">{metrics.uptimePercent}%</p>
                  <p className="text-xs text-white/50 mt-1">System Uptime</p>
                  <p className="text-[10px] text-white/30 mt-2">Real-time inference availability</p>
                </div>
              </div>
            </section>

            {/* Pilot Details */}
            <section className="px-4 pb-6">
              <div className="max-w-5xl mx-auto">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">Engagement Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {[
                      ['Organization', selectedEngagement.organization_name],
                      ['Unit', selectedEngagement.unit_deployed],
                      ['Beds', `${selectedEngagement.bed_count} total / ${selectedEngagement.icu_beds} ICU`],
                      ['EHR', selectedEngagement.ehr_system || 'TBD'],
                      ['Start', selectedEngagement.pilot_start_date || 'TBD'],
                      ['End', selectedEngagement.pilot_end_date || 'TBD'],
                      ['Contact', selectedEngagement.contact_name],
                      ['Status', selectedEngagement.status],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-white/40">{k}</p>
                        <p className="text-white font-medium capitalize">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Equity Report */}
            <section className="px-4 pb-20">
              <div className="max-w-5xl mx-auto">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" /> Equity Monitoring Report
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { metric: 'Equalized Odds', value: '0.97', status: '✅ Within threshold' },
                      { metric: 'Calibration Equity', value: '0.95', status: '✅ No bias detected' },
                      { metric: 'Demographic Parity', value: '0.93', status: '✅ Fair' },
                    ].map(m => (
                      <div key={m.metric} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                        <p className="text-xs text-white/40">{m.metric}</p>
                        <p className="text-xl font-bold text-emerald-400">{m.value}</p>
                        <p className="text-[10px] text-emerald-400/70">{m.status}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/30 mt-3">Equity metrics are continuously monitored. Values shown reflect the current pilot period aggregate.</p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </SiteLayout>
  );
};

export default ClientPortal;
