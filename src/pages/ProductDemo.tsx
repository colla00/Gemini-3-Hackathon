import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Activity, Users, ShieldCheck, BarChart3, AlertTriangle, ChevronRight, ChevronLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SiteLayout } from '@/components/layout/SiteLayout';

const syntheticPatients = [
  { id: 'PT-4821', name: 'Patient A', age: 67, unit: 'MICU', riskScore: 0.82, trend: 'rising', acuity: 'Critical', alerts: ['Sepsis risk elevated', 'Lactate trending ↑'], nurseLoad: 4.2 },
  { id: 'PT-3197', name: 'Patient B', age: 54, unit: 'SICU', riskScore: 0.45, trend: 'stable', acuity: 'Moderate', alerts: ['Post-op day 2'], nurseLoad: 2.8 },
  { id: 'PT-7634', name: 'Patient C', age: 78, unit: 'CCU', riskScore: 0.91, trend: 'rising', acuity: 'Critical', alerts: ['Deterioration detected', 'Multi-organ risk'], nurseLoad: 5.1 },
  { id: 'PT-2058', name: 'Patient D', age: 42, unit: 'MICU', riskScore: 0.23, trend: 'falling', acuity: 'Low', alerts: [], nurseLoad: 1.5 },
];

const demoSteps = [
  { title: 'Real-Time Risk Dashboard', icon: Activity, description: 'Live patient risk scores update every 15 minutes using only EHR data — no additional hardware required.' },
  { title: 'Nurse Workload Optimization', icon: Users, description: 'AI-powered staffing recommendations balance patient acuity across your nursing team.' },
  { title: 'Equity Monitoring', icon: ShieldCheck, description: 'Continuous bias detection ensures risk predictions remain fair across all demographic groups.' },
  { title: 'Clinical Decision Support', icon: BarChart3, description: 'Explainable AI provides transparent reasoning behind every risk score and recommendation.' },
];

const getRiskColor = (score: number) => {
  if (score >= 0.7) return 'text-red-400 bg-red-500/10 border-red-500/30';
  if (score >= 0.4) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
};

const getRiskBarColor = (score: number) => {
  if (score >= 0.7) return 'bg-red-500';
  if (score >= 0.4) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const ProductDemo = () => {
  const [step, setStep] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(syntheticPatients[0]);

  return (
    <SiteLayout
      title="Product Demo | VitaSignal — See Clinical AI in Action"
      description="Explore VitaSignal's clinical AI platform with synthetic patient data. See real-time risk scoring, nurse workload optimization, and equity monitoring."
    >
      <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
        {/* Hero */}
        <section className="pt-28 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6">
                <Play className="w-4 h-4" /> Interactive Demo — Synthetic Data Only
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-['DM_Serif_Display']">
                Experience VitaSignal's <span className="text-cyan-400">Clinical Intelligence</span>
              </h1>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Walk through our platform using simulated patient data. No login required. No real PHI involved.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Step Navigation */}
        <section className="px-4 pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {demoSteps.map((s, i) => (
                <button key={i} onClick={() => setStep(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                    step === i ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium' : 'text-white/50 hover:text-white/70 hover:bg-white/5 border border-transparent'
                  }`}>
                  <s.icon className="w-4 h-4" /> {s.title}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Content */}
        <section className="px-4 pb-20">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                {/* Step 0: Risk Dashboard */}
                {step === 0 && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Activity className="w-5 h-5 text-cyan-400" /> ICU Patient Risk Overview
                          <span className="text-xs text-white/30 font-normal ml-2">SIMULATED DATA</span>
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-emerald-400">
                          <Zap className="w-3 h-3" /> Live — Updates q15min
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {syntheticPatients.map(p => (
                          <button key={p.id} onClick={() => setSelectedPatient(p)}
                            className={`text-left rounded-lg border p-4 transition-all ${
                              selectedPatient.id === p.id ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-white font-medium text-sm">{p.id}</span>
                                <span className="text-white/40 text-xs ml-2">Age {p.age} · {p.unit}</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getRiskColor(p.riskScore)}`}>
                                {p.acuity}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-white/50">Risk Score</span>
                                  <span className="text-white font-mono">{(p.riskScore * 100).toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                  <div className={`h-2 rounded-full transition-all ${getRiskBarColor(p.riskScore)}`} style={{ width: `${p.riskScore * 100}%` }} />
                                </div>
                              </div>
                              <span className={`text-xs ${p.trend === 'rising' ? 'text-red-400' : p.trend === 'falling' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {p.trend === 'rising' ? '↑' : p.trend === 'falling' ? '↓' : '→'} {p.trend}
                              </span>
                            </div>
                            {p.alerts.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {p.alerts.map((a, i) => (
                                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20">
                                    <AlertTriangle className="w-2.5 h-2.5 inline mr-1" />{a}
                                  </span>
                                ))}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Nurse Workload */}
                {step === 1 && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" /> Nurse Workload Distribution
                      <span className="text-xs text-white/30 font-normal ml-2">SIMULATED</span>
                    </h3>
                    <div className="space-y-3">
                      {['Nurse Williams', 'Nurse Patel', 'Nurse Chen', 'Nurse Rodriguez'].map((nurse, i) => {
                        const load = [4.2, 3.1, 4.8, 2.5][i];
                        const patients = [3, 2, 3, 2][i];
                        const overloaded = load > 4;
                        return (
                          <div key={nurse} className={`rounded-lg p-4 border ${overloaded ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/10 bg-white/[0.02]'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-white text-sm font-medium">{nurse}</span>
                                <span className="text-white/40 text-xs ml-2">{patients} patients</span>
                              </div>
                              <span className={`text-xs font-medium ${overloaded ? 'text-amber-400' : 'text-emerald-400'}`}>
                                Acuity Score: {load}
                              </span>
                            </div>
                            <Progress value={load / 6 * 100} className="h-2" />
                            {overloaded && (
                              <p className="text-xs text-amber-400 mt-2">⚠ Consider redistribution — acuity exceeds recommended threshold</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-300">
                      💡 <strong>AI Recommendation:</strong> Transfer PT-2058 (Low acuity) from Nurse Williams to Nurse Rodriguez to balance workload.
                    </div>
                  </div>
                )}

                {/* Step 2: Equity Monitoring */}
                {step === 2 && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" /> Real-Time Equity Dashboard
                      <span className="text-xs text-white/30 font-normal ml-2">SIMULATED</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Equalized Odds Ratio', value: '0.98', status: '✅ Within threshold', desc: 'True positive rates balanced across groups' },
                        { label: 'Calibration Equity', value: '0.96', status: '✅ No significant bias', desc: 'Predicted vs. observed rates aligned' },
                        { label: 'Demographic Parity', value: '0.94', status: '✅ Fair', desc: 'Prediction distribution equitable' },
                      ].map(m => (
                        <div key={m.label} className="rounded-lg border border-white/10 p-4 bg-white/[0.02]">
                          <p className="text-xs text-white/50 mb-1">{m.label}</p>
                          <p className="text-3xl font-bold text-emerald-400 mb-1">{m.value}</p>
                          <p className="text-xs text-emerald-400 font-medium">{m.status}</p>
                          <p className="text-[11px] text-white/40 mt-2">{m.desc}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-300">
                      VitaSignal continuously monitors predictions for racial, ethnic, and socioeconomic disparities — validated across international datasets.
                    </div>
                  </div>
                )}

                {/* Step 3: Clinical Decision Support */}
                {step === 3 && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-400" /> Explainable AI — Risk Factor Breakdown
                      <span className="text-xs text-white/30 font-normal ml-2">SIMULATED</span>
                    </h3>
                    <p className="text-sm text-white/60">Patient {selectedPatient.id} — Risk Score: {(selectedPatient.riskScore * 100).toFixed(0)}%</p>
                    <div className="space-y-2">
                      {[
                        { factor: 'Vital Sign Trajectory', impact: 0.28, direction: 'risk' },
                        { factor: 'Lab Value Patterns', impact: 0.22, direction: 'risk' },
                        { factor: 'Medication Response', impact: -0.08, direction: 'protective' },
                        { factor: 'Clinical Documentation Signals', impact: 0.15, direction: 'risk' },
                        { factor: 'Care Process Timing', impact: 0.12, direction: 'risk' },
                        { factor: 'Patient History', impact: -0.05, direction: 'protective' },
                      ].map(f => (
                        <div key={f.factor} className="flex items-center gap-3">
                          <span className="text-sm text-white/70 w-52 shrink-0">{f.factor}</span>
                          <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1 bg-white/5 rounded-full h-3 relative overflow-hidden">
                              <div className={`h-full rounded-full ${f.direction === 'risk' ? 'bg-red-500/70' : 'bg-emerald-500/70'}`}
                                style={{ width: `${Math.abs(f.impact) * 200}%` }} />
                            </div>
                            <span className={`text-xs font-mono w-12 text-right ${f.direction === 'risk' ? 'text-red-400' : 'text-emerald-400'}`}>
                              {f.impact > 0 ? '+' : ''}{(f.impact * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-white/30">Factor names are generalized to protect proprietary feature engineering. Full clinical detail available under NDA.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                className="border-white/20 text-white hover:bg-white/10">
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <span className="text-xs text-white/40">{step + 1} / {demoSteps.length}</span>
              {step < demoSteps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <a href="/pilot-request">Request a Pilot <ChevronRight className="w-4 h-4 ml-1" /></a>
                </Button>
              )}
            </div>

            <p className="text-center text-xs text-white/30 mt-8">
              All data shown is synthetic and simulated. VitaSignal is a pre-market research prototype — not FDA cleared or approved.
            </p>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default ProductDemo;
