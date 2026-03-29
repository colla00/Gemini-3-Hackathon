import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ArrowRight, ArrowDown, DollarSign, Clock, FileCheck, ShieldAlert, FileX, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// ---------------------------------------------------------------------------
// Budget-line ROI model
// Each line item maps to a real cost center a CFO or CNO can verify
// ---------------------------------------------------------------------------

interface BudgetLineResult {
  id: string;
  budgetLine: string;
  icon: typeof DollarSign;
  before: string;
  after: string;
  annualImpact: number;
  methodology: string;
  metricLabel: string;
}

interface ROISummary {
  totalAnnualImpact: number;
  implementationCost: number;
  paybackMonths: number;
  threeYearNet: number;
  lines: BudgetLineResult[];
}

const calculate = (
  beds: number,
  icuBeds: number,
  avgLOS: number,
  currentDocCompleteness: number,
  currentDenialRate: number,
): ROISummary => {
  const annualAdmissions = Math.round(beds * 365 * 0.7 / avgLOS);
  const icuAdmissions = Math.round(icuBeds * 365 * 0.65 / (avgLOS * 1.8));

  // 1. Clinician documentation time
  const minutesSavedPerNursePerShift = 34; // from validated SEDR model
  const shiftsPerDay = 3;
  const nurseFTE = icuBeds * 1.2; // typical ICU nurse-to-bed ratio
  const annualMinutesSaved = nurseFTE * minutesSavedPerNursePerShift * shiftsPerDay * 365;
  const annualHoursSaved = Math.round(annualMinutesSaved / 60);
  const nurseHourlyRate = 52; // BLS median RN wage
  const clinicianTimeSavings = Math.round(annualHoursSaved * nurseHourlyRate);

  // 2. Chart review burden reduction
  const avgReviewMinutesPerPatient = 12;
  const reviewReduction = 0.35; // 35% reduction via documentation-native signals
  const reviewMinutesSaved = annualAdmissions * avgReviewMinutesPerPatient * reviewReduction;
  const reviewHoursSaved = Math.round(reviewMinutesSaved / 60);
  const reviewBurdenSavings = Math.round(reviewHoursSaved * 65); // physician-level rate

  // 3. Documentation completeness → CMS quality
  const completenessGain = Math.min(98, currentDocCompleteness + 14) - currentDocCompleteness;
  const qualityPenaltyAtRisk = beds * 420; // avg CMS penalty exposure per bed
  const qualityRecovery = Math.round(qualityPenaltyAtRisk * (completenessGain / 100) * 0.6);

  // 4. Safety event reduction (failure-to-rescue)
  const baselineFTRRate = 0.032; // 3.2% national avg
  const ftrReduction = 0.18; // 18% projected reduction
  const preventedEvents = Math.round(icuAdmissions * baselineFTRRate * ftrReduction);
  const costPerEvent = 42000; // avg cost of failure-to-rescue event
  const safetyEventSavings = preventedEvents * costPerEvent;

  // 5. Denial / rework avoidance
  const currentDenials = annualAdmissions * (currentDenialRate / 100);
  const denialReduction = 0.22; // 22% reduction via completeness improvement
  const preventedDenials = Math.round(currentDenials * denialReduction);
  const avgDenialCost = 4200; // avg cost to rework + lost revenue per denial
  const denialSavings = preventedDenials * avgDenialCost;

  // 6. Reimbursement integrity (CMI accuracy)
  const cmiLift = 0.015; // 1.5% CMI accuracy improvement from better documentation
  const avgReimbursementPerAdmission = 12800;
  const reimbursementGain = Math.round(annualAdmissions * avgReimbursementPerAdmission * cmiLift);

  const lines: BudgetLineResult[] = [
    {
      id: 'clinician-time',
      budgetLine: 'Nursing Labor — Documentation Time',
      icon: Clock,
      before: `${Math.round(minutesSavedPerNursePerShift * nurseFTE * shiftsPerDay / 60)}h/day spent on documentation`,
      after: `${Math.round(minutesSavedPerNursePerShift * nurseFTE * shiftsPerDay * 0.65 / 60)}h/day (34 min saved/nurse/shift)`,
      annualImpact: clinicianTimeSavings,
      methodology: 'Based on SEDR-validated 34-minute reduction per nurse per shift. Nurse hourly rate from BLS median ($52/hr).',
      metricLabel: `${annualHoursSaved.toLocaleString()} nurse-hours recovered annually`,
    },
    {
      id: 'review-burden',
      budgetLine: 'Physician Labor — Chart Review Burden',
      icon: FileCheck,
      before: `${avgReviewMinutesPerPatient} min avg chart review per patient`,
      after: `${Math.round(avgReviewMinutesPerPatient * (1 - reviewReduction))} min avg (35% reduction via signal extraction)`,
      annualImpact: reviewBurdenSavings,
      methodology: 'Documentation-native signals surface relevant patterns without full chart re-review. Physician time valued at $65/hr.',
      metricLabel: `${reviewHoursSaved.toLocaleString()} physician-hours recovered`,
    },
    {
      id: 'doc-completeness',
      budgetLine: 'Quality — CMS Penalty Exposure',
      icon: Award,
      before: `${currentDocCompleteness}% documentation completeness`,
      after: `${Math.min(98, currentDocCompleteness + 14)}% completeness (+${completenessGain}pp lift)`,
      annualImpact: qualityRecovery,
      methodology: 'Improved documentation completeness reduces CMS quality penalty risk. Based on $420/bed avg penalty exposure.',
      metricLabel: `${completenessGain}pp documentation completeness improvement`,
    },
    {
      id: 'safety-events',
      budgetLine: 'Patient Safety — Failure-to-Rescue Avoidance',
      icon: ShieldAlert,
      before: `${(baselineFTRRate * 100).toFixed(1)}% failure-to-rescue rate (national avg)`,
      after: `${((baselineFTRRate * (1 - ftrReduction)) * 100).toFixed(1)}% projected rate (18% reduction)`,
      annualImpact: safetyEventSavings,
      methodology: 'Projected from IDI mortality signal detection model. $42K avg cost per failure-to-rescue event (AHRQ).',
      metricLabel: `${preventedEvents} safety events projected avoided`,
    },
    {
      id: 'denials',
      budgetLine: 'Revenue Cycle — Denial Rework Avoidance',
      icon: FileX,
      before: `${currentDenialRate}% denial rate (${Math.round(currentDenials).toLocaleString()} denials/yr)`,
      after: `${(currentDenialRate * (1 - denialReduction)).toFixed(1)}% projected rate (${preventedDenials} fewer denials)`,
      annualImpact: denialSavings,
      methodology: 'Better documentation completeness reduces clinical denials. $4,200 avg rework + lost revenue per denial.',
      metricLabel: `${preventedDenials} denials avoided annually`,
    },
    {
      id: 'reimbursement',
      budgetLine: 'Revenue Integrity — CMI Accuracy',
      icon: DollarSign,
      before: 'Baseline CMI capture rate',
      after: '+1.5% CMI accuracy from documentation improvement',
      annualImpact: reimbursementGain,
      methodology: 'Improved documentation captures acuity more accurately, lifting Case Mix Index. Based on avg $12,800 reimbursement/admission.',
      metricLabel: '1.5% CMI accuracy improvement',
    },
  ];

  const totalAnnualImpact = lines.reduce((sum, l) => sum + l.annualImpact, 0);
  const implementationCost = beds * 850 + 75000;
  const paybackMonths = Math.round((implementationCost / totalAnnualImpact) * 12 * 10) / 10;
  const threeYearNet = totalAnnualImpact * 3 - implementationCost;

  return { totalAnnualImpact, implementationCost, paybackMonths, threeYearNet, lines };
};

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const ROICalculator = () => {
  const [beds, setBeds] = useState('');
  const [icuBeds, setIcuBeds] = useState('');
  const [avgLOS, setAvgLOS] = useState('4.5');
  const [docCompleteness, setDocCompleteness] = useState('78');
  const [denialRate, setDenialRate] = useState('8.5');
  const [facilityType, setFacilityType] = useState('community');
  const [result, setResult] = useState<ROISummary | null>(null);
  const [expandedLine, setExpandedLine] = useState<string | null>(null);

  const handleCalculate = () => {
    const b = parseInt(beds);
    const icu = parseInt(icuBeds);
    const los = parseFloat(avgLOS);
    const dc = parseFloat(docCompleteness);
    const dr = parseFloat(denialRate);
    if (b > 0 && icu > 0 && los > 0 && dc > 0 && dr > 0) {
      setResult(calculate(b, icu, los, dc, dr));
      setExpandedLine(null);
    }
  };

  return (
    <SiteLayout
      title="ROI Calculator | VitaSignal — Budget-Line Savings Model"
      description="Map VitaSignal's impact to the budget lines your CFO and CNO actually buy on: nursing labor, chart review burden, CMS penalties, denials, and reimbursement integrity."
    >
      <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
        {/* Hero */}
        <section className="pt-28 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
                <Calculator className="w-4 h-4" /> Budget-Line Savings Model
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-['DM_Serif_Display']">
                Map Savings to the Lines <span className="text-emerald-400">Your CFO Reviews</span>
              </h1>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Not abstract "AI value." Specific, auditable projections tied to nursing labor, chart review time, CMS penalties, claim denials, and reimbursement accuracy.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Inputs */}
        <section className="pb-8 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-10"
            >
              <h2 className="text-xl font-semibold text-white mb-2">Your Facility Profile</h2>
              <p className="text-sm text-white/40 mb-6">We use these inputs to project savings across six specific budget categories.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Total Licensed Beds</Label>
                  <Input type="number" placeholder="e.g. 350" value={beds} onChange={e => setBeds(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">ICU / Critical Care Beds</Label>
                  <Input type="number" placeholder="e.g. 48" value={icuBeds} onChange={e => setIcuBeds(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Average Length of Stay (days)</Label>
                  <Input type="number" step="0.1" placeholder="4.5" value={avgLOS} onChange={e => setAvgLOS(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Current Documentation Completeness (%)</Label>
                  <Input type="number" step="1" placeholder="78" value={docCompleteness} onChange={e => setDocCompleteness(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Current Claim Denial Rate (%)</Label>
                  <Input type="number" step="0.1" placeholder="8.5" value={denialRate} onChange={e => setDenialRate(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Facility Type</Label>
                  <Select value={facilityType} onValueChange={setFacilityType}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="community">Community Hospital</SelectItem>
                      <SelectItem value="academic">Academic Medical Center</SelectItem>
                      <SelectItem value="safety_net">Safety-Net Hospital</SelectItem>
                      <SelectItem value="va">VA / Military</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleCalculate} size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8"
                disabled={!beds || !icuBeds}
              >
                Calculate Budget-Line Impact <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }} className="pb-20 px-4"
            >
              <div className="max-w-5xl mx-auto space-y-6">
                {/* Summary bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Total Annual Impact</p>
                    <p className="text-2xl md:text-3xl font-bold text-emerald-400">{fmt(result.totalAnnualImpact)}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Payback Period</p>
                    <p className="text-2xl md:text-3xl font-bold text-white">{result.paybackMonths} months</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">3-Year Net Value</p>
                    <p className="text-2xl md:text-3xl font-bold text-white">{fmt(result.threeYearNet)}</p>
                  </div>
                </div>

                {/* Budget-line breakdown */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                  <div className="p-5 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Budget-Line Breakdown</h3>
                    <p className="text-xs text-white/40 mt-1">Each line maps to a cost center your finance team can verify. Click any row for methodology.</p>
                  </div>

                  {result.lines.map((line, i) => {
                    const Icon = line.icon;
                    const isExpanded = expandedLine === line.id;
                    const pctOfTotal = Math.round((line.annualImpact / result.totalAnnualImpact) * 100);

                    return (
                      <div key={line.id}>
                        {i > 0 && <Separator className="bg-white/5" />}
                        <button
                          onClick={() => setExpandedLine(isExpanded ? null : line.id)}
                          className="w-full text-left p-4 md:p-5 hover:bg-white/[0.03] transition-colors"
                        >
                          <div className="flex items-start gap-3 md:gap-4">
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0 mt-0.5">
                              <Icon className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <p className="text-sm font-semibold text-white truncate">{line.budgetLine}</p>
                                <Badge variant="outline" className="shrink-0 text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-xs">
                                  {fmt(line.annualImpact)}/yr
                                </Badge>
                              </div>

                              {/* Before → After */}
                              <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-1 sm:gap-3 items-center text-xs mb-2">
                                <div className="text-white/40">
                                  <span className="text-[10px] uppercase text-white/30 mr-1">Before:</span>
                                  {line.before}
                                </div>
                                <ArrowRight className="w-3 h-3 text-emerald-500/50 hidden sm:block" />
                                <div className="text-emerald-400/80">
                                  <span className="text-[10px] uppercase text-emerald-400/50 mr-1">After:</span>
                                  {line.after}
                                </div>
                              </div>

                              {/* Contribution bar */}
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pctOfTotal}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="h-full bg-emerald-500/60 rounded-full"
                                  />
                                </div>
                                <span className="text-[10px] text-white/30 w-8 text-right">{pctOfTotal}%</span>
                              </div>

                              <p className="text-[11px] text-white/30 mt-1">{line.metricLabel}</p>
                            </div>

                            <ArrowDown className={`w-3.5 h-3.5 text-white/30 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-4 pl-16">
                                <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                                  <p className="text-[11px] text-white/50 leading-relaxed">
                                    <span className="text-white/70 font-medium">Methodology: </span>
                                    {line.methodology}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Implementation cost note */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white/70">Implementation Investment</p>
                      <p className="text-xs text-white/40 mt-1">
                        Estimated at {fmt(result.implementationCost)} ({beds} beds × $850/bed + $75K setup).
                        Includes integration, training, and 90-day optimization support.
                        Payback projected at {result.paybackMonths} months based on the six budget lines above.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <a href="/contact">Request a Custom Analysis</a>
                  </Button>
                  <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    <a href="/pilot-request">Discuss a Pilot Assessment <ArrowRight className="w-4 h-4 ml-2" /></a>
                  </Button>
                </div>

                {/* Disclaimer */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] text-white/30 text-center max-w-3xl mx-auto leading-relaxed">
                    All figures are forward-looking projections based on published benchmarks (BLS, AHRQ, CMS) and VitaSignal's validated models (IDI, DBS, SEDR).
                    Actual results depend on baseline performance, implementation scope, and clinical workflow integration.
                    VitaSignal is a pre-market research prototype — not FDA cleared or approved.
                  </p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </SiteLayout>
  );
};

export default ROICalculator;
