import { Helmet } from 'react-helmet-async';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Download, Mail, FileText, Image, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import vitasignalIcon from '@/assets/vitasignal-icon.jpg';

const boilerplates = [
  {
    length: '50-word',
    text: 'VitaSignal™ is a patent-pending clinical AI platform that predicts ICU mortality using equipment-independent algorithms, reduces nursing documentation burden, and embeds health equity bias testing — delivering AUROC > 0.90 accuracy at a fraction of the cost of legacy clinical decision support systems.',
  },
  {
    length: '100-word',
    text: 'VitaSignal™ is a patent-pending clinical AI and decision-support platform designed for acute care settings. Using equipment-independent machine learning algorithms, VitaSignal predicts ICU mortality with AUROC > 0.90 accuracy while actively reducing nursing documentation burden through automated workflows. The platform is the first to embed health equity bias testing directly into its clinical pipeline, ensuring equitable care across patient populations. Built on FHIR R4-native architecture, VitaSignal integrates with existing EHR systems in under two weeks. With 11 U.S. provisional patent applications filed, VitaSignal represents a new standard in responsible, transparent clinical AI.',
  },
  {
    length: '250-word',
    text: `VitaSignal™ is a patent-pending clinical artificial intelligence platform engineered for acute and critical care environments. Founded by Dr. Alexis Collier — an NIH AIM-AHEAD CLINAQ Fellow, health informaticist, and AI researcher — VitaSignal addresses three systemic challenges in healthcare: unreliable early warning systems, unsustainable nursing documentation burden, and algorithmic bias in clinical AI.

The platform's core mortality prediction engine achieves AUROC > 0.90 without requiring proprietary bedside hardware, making it accessible to hospitals of all sizes. VitaSignal is the first clinical AI system to embed health equity bias testing directly into its prediction pipeline, proactively identifying and mitigating disparities across race, age, sex, and socioeconomic status.

For nurses, VitaSignal introduces the Documentation Burden Score™ (DBS) and Intervention Documentation Index™ (IDI), patent-pending metrics that quantify and reduce the administrative workload that contributes to burnout and turnover. The platform's FHIR R4-native architecture enables integration with Epic, Cerner, and other major EHR systems in under two weeks.

VitaSignal's intellectual property portfolio includes 11 U.S. provisional patent applications covering mortality prediction, bias detection, documentation optimization, and clinical workflow automation. The company is pursuing FDA De Novo classification and has initiated pilot discussions with health systems across the United States.

Headquartered in the U.S., VitaSignal is backed by research supported in part by NIH Award No. 1OT2OD032581 (AIM-AHEAD). The platform represents a new paradigm in clinical AI: one that prioritizes transparency, equity, and the clinician experience alongside predictive accuracy.`,
  },
];

const keyFacts = [
  { label: 'Patent Applications Filed', value: '11 U.S. Provisional' },
  { label: 'DBS External AUROC', value: '0.758' },
  { label: 'DBS Validation', value: '28,362 patients · 172 hospitals' },
  { label: 'IDI Validation', value: '65,157 patients · MIMIC-IV + HiRID' },
  { label: 'Architecture', value: 'FHIR R4 Native' },
];

const PressKit = () => (
  <>
    <Helmet>
      <title>Press Kit & Media | VitaSignal</title>
      <meta name="description" content="VitaSignal press kit: logos, boilerplate text, key facts, and media contact information for journalists and partners." />
    </Helmet>
    <LandingNav />
    <main className="min-h-screen bg-background pb-24">
      <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-background border-b border-border/30">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Media Resources</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">Press Kit</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything journalists, conference organizers, and partners need to cover VitaSignal.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pt-10 space-y-12">
        {/* Logo & Brand Assets */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" /> Brand Assets
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-border">
                <img src={vitasignalIcon} alt="VitaSignal Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-medium text-foreground">VitaSignal Icon</span>
              <a href={vitasignalIcon} download="vitasignal-icon.jpg">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" /> Download JPG
                </Button>
              </a>
            </div>
            <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">VS</span>
              </div>
              <span className="text-sm font-medium text-foreground">Wordmark</span>
              <span className="text-xs text-muted-foreground">VitaSignal™</span>
            </div>
          </div>
        </section>

        {/* Key Facts */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Key Facts
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {keyFacts.map((fact) => (
              <div key={fact.label} className="rounded-lg border border-border bg-card p-4 text-center">
                <div className="text-xl font-bold text-primary">{fact.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{fact.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Boilerplates */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Quote className="w-5 h-5 text-primary" /> Approved Boilerplate
          </h2>
          <div className="space-y-6">
            {boilerplates.map((bp) => (
              <div key={bp.length} className="rounded-xl border border-border bg-card p-6">
                <Badge variant="secondary" className="mb-3">{bp.length}</Badge>
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{bp.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Media Contact */}
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Media Contact</h2>
          <p className="text-muted-foreground mb-4 text-sm">For press inquiries, interviews, and media requests:</p>
          <a href="mailto:info@vitasignal.ai">
            <Button variant="default" size="lg">
              <Mail className="w-4 h-4 mr-2" /> info@vitasignal.ai
            </Button>
          </a>
        </section>
      </div>
    </main>
    <LandingFooter />
  </>
);

export default PressKit;
