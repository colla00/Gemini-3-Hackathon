import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Download, TrendingUp, DollarSign, Clock, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SiteLayout } from '@/components/layout/SiteLayout';

interface ROIResult {
  annualSavings: number;
  haiReduction: number;
  nurseTimeSaved: number;
  paybackMonths: number;
  fiveYearROI: number;
  mortalityReduction: number;
  readmissionReduction: number;
}

const calculateROI = (beds: number, icuBeds: number, avgLOS: number, currentHAIRate: number): ROIResult => {
  const avgCostPerHAI = 28400;
  const annualAdmissions = beds * 365 * 0.7 / avgLOS;
  const icuAdmissions = icuBeds * 365 * 0.65 / (avgLOS * 1.8);
  const currentHAIs = annualAdmissions * (currentHAIRate / 100);
  const haiReduction = 0.23;
  const preventedHAIs = currentHAIs * haiReduction;
  const haiSavings = preventedHAIs * avgCostPerHAI;

  const nurseHoursSavedPerShift = icuBeds * 0.45;
  const nurseSavingsAnnual = nurseHoursSavedPerShift * 365 * 3 * 45;

  const mortalityReduction = 0.15;
  const readmissionReduction = 0.12;
  const mortalitySavings = icuAdmissions * mortalityReduction * 42000 * 0.1;
  const readmissionSavings = annualAdmissions * readmissionReduction * 15200 * 0.08;

  const annualSavings = haiSavings + nurseSavingsAnnual + mortalitySavings + readmissionSavings;
  const implementationCost = beds * 850 + 75000;
  const paybackMonths = (implementationCost / annualSavings) * 12;
  const fiveYearROI = ((annualSavings * 5 - implementationCost) / implementationCost) * 100;

  return {
    annualSavings: Math.round(annualSavings),
    haiReduction: Math.round(preventedHAIs),
    nurseTimeSaved: Math.round(nurseHoursSavedPerShift * 365 * 3),
    paybackMonths: Math.round(paybackMonths * 10) / 10,
    fiveYearROI: Math.round(fiveYearROI),
    mortalityReduction: Math.round(mortalityReduction * 100),
    readmissionReduction: Math.round(readmissionReduction * 100),
  };
};

const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);

const ROICalculator = () => {
  const [beds, setBeds] = useState('');
  const [icuBeds, setIcuBeds] = useState('');
  const [avgLOS, setAvgLOS] = useState('4.5');
  const [haiRate, setHaiRate] = useState('3.2');
  const [hospitalType, setHospitalType] = useState('community');
  const [result, setResult] = useState<ROIResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = () => {
    const b = parseInt(beds);
    const icu = parseInt(icuBeds);
    const los = parseFloat(avgLOS);
    const hai = parseFloat(haiRate);
    if (b > 0 && icu > 0 && los > 0 && hai > 0) {
      setResult(calculateROI(b, icu, los, hai));
      setShowResult(true);
    }
  };

  const metrics = result ? [
    { icon: DollarSign, label: 'Projected Annual Savings', value: formatCurrency(result.annualSavings), color: 'text-emerald-400' },
    { icon: ShieldCheck, label: 'HAIs Prevented Per Year', value: formatNumber(result.haiReduction), color: 'text-cyan-400' },
    { icon: Users, label: 'Nurse Hours Saved Annually', value: formatNumber(result.nurseTimeSaved), color: 'text-blue-400' },
    { icon: Clock, label: 'Payback Period', value: `${result.paybackMonths} months`, color: 'text-amber-400' },
    { icon: TrendingUp, label: '5-Year ROI', value: `${formatNumber(result.fiveYearROI)}%`, color: 'text-purple-400' },
  ] : [];

  return (
    <SiteLayout
      title="ROI Calculator | VitaSignal — Project Your Hospital Savings"
      description="Calculate projected savings from VitaSignal's clinical AI platform. Enter your hospital metrics to see HAI reduction, nurse time saved, and payback period."
    >
      <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
        {/* Hero */}
        <section className="pt-28 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
                <Calculator className="w-4 h-4" /> Interactive Savings Estimator
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-['DM_Serif_Display']">
                What Could VitaSignal Save <span className="text-emerald-400">Your Hospital?</span>
              </h1>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Enter your facility metrics below to see projected annual savings, HAI prevention, and nurse workload reduction based on validated clinical models.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator */}
        <section className="pb-20 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-10"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Your Hospital Profile</h2>
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
                  <Label className="text-white/70 text-sm">Current HAI Rate (%)</Label>
                  <Input type="number" step="0.1" placeholder="3.2" value={haiRate} onChange={e => setHaiRate(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Facility Type</Label>
                  <Select value={hospitalType} onValueChange={setHospitalType}>
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
                Calculate Projected Savings <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Results */}
            {showResult && result && (
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {metrics.map((m, i) => (
                    <motion.div key={m.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                      className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
                    >
                      <m.icon className={`w-8 h-8 mx-auto mb-3 ${m.color}`} />
                      <p className="text-2xl md:text-3xl font-bold text-white mb-1">{m.value}</p>
                      <p className="text-xs text-white/50">{m.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Clinical Impact Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 rounded-lg bg-white/5">
                      <p className="text-white/50 mb-1">Projected Mortality Reduction</p>
                      <p className="text-2xl font-bold text-cyan-400">{result.mortalityReduction}%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5">
                      <p className="text-white/50 mb-1">Projected Readmission Reduction</p>
                      <p className="text-2xl font-bold text-blue-400">{result.readmissionReduction}%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5">
                      <p className="text-white/50 mb-1">Savings Per Patient</p>
                      <p className="text-2xl font-bold text-emerald-400">{formatCurrency(Math.round(result.annualSavings / (parseInt(beds) * 365 * 0.7 / parseFloat(avgLOS))))}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Download className="w-4 h-4 mr-2" /> Download PDF Report
                  </Button>
                  <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    <a href="/pilot-request">Request a Pilot Assessment <ArrowRight className="w-4 h-4 ml-2" /></a>
                  </Button>
                </div>

                <p className="text-[11px] text-white/30 text-center max-w-2xl mx-auto">
                  Projections are estimates based on published literature and VitaSignal's validated research models. Actual results may vary by institution. 
                  VitaSignal is a pre-market research prototype — not FDA cleared or approved.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default ROICalculator;
