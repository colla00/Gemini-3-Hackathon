import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Save, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SiteLayout } from '@/components/layout/SiteLayout';

type SectionData = Record<string, string>;

const SECTIONS = [
  {
    id: 'device_info',
    title: '1. Device Information',
    guidance: 'Describe the software as a medical device, including its name, version, and classification.',
    fields: [
      { key: 'device_name', label: 'Device Trade Name', placeholder: 'e.g. VitaSignal Clinical AI Platform', default: 'VitaSignal™ Clinical AI Platform' },
      { key: 'device_class', label: 'Proposed Classification', placeholder: 'e.g. Class II SaMD', default: 'Class II Software as a Medical Device (SaMD)' },
      { key: 'product_code', label: 'Product Code / Predicate', placeholder: 'e.g. QAS (Clinical Decision Support)', default: 'QAS — Clinical Decision Support Software' },
      { key: 'regulatory_pathway', label: 'Regulatory Pathway', placeholder: 'e.g. De Novo, 510(k)', default: 'De Novo Classification Request' },
    ],
  },
  {
    id: 'intended_use',
    title: '2. Intended Use / Indications for Use',
    guidance: 'This is the most critical section. FDA will evaluate your entire submission against this statement.',
    fields: [
      { key: 'intended_use', label: 'Intended Use Statement', placeholder: 'Describe what the device does and for whom', default: 'VitaSignal is intended to assist clinical decision-making by providing ICU mortality risk predictions derived from electronic health record (EHR) documentation patterns. The device is intended for use by healthcare professionals in critical care settings as a clinical decision support tool.' },
      { key: 'target_population', label: 'Target Patient Population', placeholder: 'e.g. Adult ICU patients', default: 'Adult patients (≥18 years) admitted to intensive care units in acute care hospitals.' },
      { key: 'clinical_setting', label: 'Clinical Setting', placeholder: 'e.g. Inpatient ICU', default: 'Inpatient intensive care units (Medical ICU, Surgical ICU, Cardiac Care Unit) within U.S. acute care hospitals.' },
      { key: 'user_profile', label: 'Intended User Profile', placeholder: 'e.g. Physicians, nurses', default: 'Licensed healthcare professionals including physicians, nurse practitioners, physician assistants, and registered nurses with ICU training.' },
    ],
  },
  {
    id: 'cds_classification',
    title: '3. CDS vs SaMD Classification Analysis',
    guidance: 'Analyze whether the device meets the four CDS criteria under 21st Century Cures Act §3060(a).',
    fields: [
      { key: 'criterion_1', label: 'Criterion 1 — Not intended to acquire, process, or analyze a medical image/signal', placeholder: 'Explain why your device meets or does not meet this', default: 'VitaSignal does not acquire, process, or analyze medical images or physiological signals. All inputs are derived from structured and unstructured EHR documentation.' },
      { key: 'criterion_2', label: 'Criterion 2 — Intended for displaying, analyzing, or printing medical information', placeholder: '', default: 'VitaSignal displays risk scores, clinical feature importance, and trend analyses derived from EHR data to support clinical assessment.' },
      { key: 'criterion_3', label: 'Criterion 3 — Intended for use by healthcare professionals', placeholder: '', default: 'VitaSignal is designed exclusively for use by licensed healthcare professionals in supervised clinical environments.' },
      { key: 'criterion_4', label: 'Criterion 4 — Enables the HCP to independently review the basis of recommendations', placeholder: '', default: 'VitaSignal provides explainable AI factor breakdowns and transparent feature importance scores, enabling clinicians to independently evaluate each recommendation against their clinical judgment.' },
      { key: 'classification_conclusion', label: 'Classification Conclusion', placeholder: '', default: 'VitaSignal meets all four CDS criteria. However, given the clinical severity of ICU mortality prediction, we are seeking FDA guidance on whether the device should be classified as CDS (exempt from device regulation) or as a Class II SaMD requiring premarket authorization.' },
    ],
  },
  {
    id: 'technology',
    title: '4. Technology & Performance',
    guidance: 'Summarize the algorithm methodology and validation performance.',
    fields: [
      { key: 'algorithm_type', label: 'Algorithm Description', placeholder: 'ML methodology overview', default: 'Gradient-boosted ensemble model trained on temporal EHR documentation patterns including clinical note characteristics, care process timing, and structured data elements.' },
      { key: 'training_data', label: 'Training Data', placeholder: 'Dataset description', default: 'MIMIC-IV (Beth Israel Deaconess Medical Center) — de-identified critical care records.' },
      { key: 'validation_data', label: 'External Validation', placeholder: 'Validation datasets', default: 'External validation performed on HiRID (Switzerland) and eICU-CRD (multi-center U.S.) datasets, totaling 55,000+ patient encounters.' },
      { key: 'performance_summary', label: 'Performance Summary', placeholder: 'Key metrics', default: 'Clinically validated mortality prediction with consistent performance across international datasets and zero statistically significant racial disparities in equalized odds analysis.' },
    ],
  },
  {
    id: 'questions',
    title: '5. Questions for FDA',
    guidance: 'The Q-Sub should include specific questions you want FDA to address.',
    fields: [
      { key: 'q1', label: 'Question 1', placeholder: '', default: 'Given the four CDS criteria analysis above, does FDA agree that VitaSignal meets the CDS exemption criteria, or should we pursue a De Novo classification request?' },
      { key: 'q2', label: 'Question 2', placeholder: '', default: 'What clinical evidence would FDA require for premarket authorization of an EHR-based ICU mortality prediction tool?' },
      { key: 'q3', label: 'Question 3', placeholder: '', default: 'Does FDA have guidance on appropriate predicate devices or product codes for documentation-pattern-based clinical decision support software?' },
      { key: 'q4', label: 'Question 4', placeholder: '', default: 'What ongoing post-market surveillance requirements would FDA recommend for a continuously learning clinical AI system?' },
    ],
  },
];

const FDAPreSubBuilder = () => {
  const { toast } = useToast();
  const [expandedSection, setExpandedSection] = useState<string>('device_info');
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('VitaSignal Q-Sub Pre-Submission');
  const [sections, setSections] = useState<Record<string, SectionData>>(() => {
    const initial: Record<string, SectionData> = {};
    SECTIONS.forEach(s => {
      initial[s.id] = {};
      s.fields.forEach(f => { initial[s.id][f.key] = f.default || ''; });
    });
    return initial;
  });

  const updateField = (sectionId: string, key: string, value: string) => {
    setSections(prev => ({ ...prev, [sectionId]: { ...prev[sectionId], [key]: value } }));
  };

  const completionPercent = () => {
    let filled = 0, total = 0;
    SECTIONS.forEach(s => s.fields.forEach(f => { total++; if (sections[s.id]?.[f.key]?.trim()) filled++; }));
    return Math.round((filled / total) * 100);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('fda_presub_documents').insert({
        title,
        document_type: 'q_sub',
        sections: sections as any,
        status: 'draft',
      });
      if (error) throw error;
      toast({ title: 'Document saved!', description: 'Your Q-Sub draft has been saved.' });
    } catch {
      toast({ title: 'Save failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const pct = completionPercent();
  const inputClass = "bg-white/5 border-white/10 text-white placeholder:text-white/30";

  return (
    <SiteLayout title="FDA Pre-Submission Builder | VitaSignal">
      <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
        <section className="pt-28 pb-6 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white font-['DM_Serif_Display'] flex items-center gap-3">
                  <FileText className="w-7 h-7 text-blue-400" /> FDA Q-Sub Builder
                </h1>
                <p className="text-sm text-white/50 mt-1">Pre-Submission (Q-Sub) document assembly for FDA guidance request.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{pct}%</p>
                  <p className="text-[10px] text-white/30">Complete</p>
                </div>
                <div className="w-16 h-16 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(220,20%,20%)" strokeWidth="2" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#3b82f6'}
                      strokeWidth="2" strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Title */}
        <section className="px-4 pb-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-2">
              <Label className="text-white/70 text-sm">Document Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="px-4 pb-8">
          <div className="max-w-4xl mx-auto space-y-3">
            {SECTIONS.map(section => {
              const expanded = expandedSection === section.id;
              const sectionData = sections[section.id] || {};
              const filledCount = section.fields.filter(f => sectionData[f.key]?.trim()).length;
              const complete = filledCount === section.fields.length;
              return (
                <div key={section.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <button onClick={() => setExpandedSection(expanded ? '' : section.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      {complete ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      <span className="text-sm font-medium text-white">{section.title}</span>
                      <span className="text-[10px] text-white/30">{filledCount}/{section.fields.length}</span>
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                  </button>
                  {expanded && (
                    <div className="px-4 pb-5 space-y-4 border-t border-white/5 pt-4">
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-300/70">{section.guidance}</p>
                      </div>
                      {section.fields.map(field => (
                        <div key={field.key} className="space-y-1.5">
                          <Label className="text-white/70 text-xs">{field.label}</Label>
                          {(field.key.includes('use') || field.key.includes('conclusion') || field.key.includes('criterion') || field.key.includes('summary') || field.key.includes('algorithm') || field.key.startsWith('q')) ? (
                            <Textarea value={sectionData[field.key] || ''} onChange={e => updateField(section.id, field.key, e.target.value)}
                              placeholder={field.placeholder} className={`${inputClass} min-h-[80px] text-xs`} />
                          ) : (
                            <Input value={sectionData[field.key] || ''} onChange={e => updateField(section.id, field.key, e.target.value)}
                              placeholder={field.placeholder} className={`${inputClass} text-xs`} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Save */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleSave} disabled={saving} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button onClick={() => window.print()} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Export for Review
            </Button>
          </div>
          <p className="text-[10px] text-white/20 text-center mt-4 max-w-xl mx-auto">
            This tool assists in assembling Q-Sub documentation. It does not constitute legal or regulatory advice. 
            Consult a regulatory affairs specialist before FDA submission.
          </p>
        </section>
      </main>
    </SiteLayout>
  );
};

export default FDAPreSubBuilder;
