import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Activity, Pill, Stethoscope, FlaskConical, ClipboardCheck, Bell, UserCheck, Syringe, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClinicalEvent {
  id: string;
  time: Date;
  icon: React.ReactNode;
  text: string;
  category: 'med' | 'assessment' | 'lab' | 'order' | 'alert' | 'intervention' | 'documentation';
}

const CATEGORY_STYLES: Record<ClinicalEvent['category'], string> = {
  med: 'text-blue-400',
  assessment: 'text-emerald-400',
  lab: 'text-amber-400',
  order: 'text-violet-400',
  alert: 'text-risk-high',
  intervention: 'text-primary',
  documentation: 'text-muted-foreground',
};

// Realistic clinical event templates
const EVENT_TEMPLATES: Array<{ icon: React.ReactNode; text: string; category: ClinicalEvent['category'] }> = [
  { icon: <Pill className="w-3 h-3" />, text: 'Metoprolol 25mg PO administered — Rm 405A', category: 'med' },
  { icon: <Pill className="w-3 h-3" />, text: 'Vancomycin 1g IV infusing — Rm 406A', category: 'med' },
  { icon: <Pill className="w-3 h-3" />, text: 'Heparin drip adjusted 1200 units/hr — Rm 403A', category: 'med' },
  { icon: <Pill className="w-3 h-3" />, text: 'Morphine 2mg IV push — Rm 412A pain 7/10', category: 'med' },
  { icon: <Pill className="w-3 h-3" />, text: 'Furosemide 40mg IV given — Rm 419B', category: 'med' },
  { icon: <Pill className="w-3 h-3" />, text: 'Insulin lispro 6 units subQ pre-meal — Rm 406A', category: 'med' },
  { icon: <Stethoscope className="w-3 h-3" />, text: 'Neurological assessment completed — Rm 402A CAM negative', category: 'assessment' },
  { icon: <Stethoscope className="w-3 h-3" />, text: 'Skin assessment documented — Rm 408B no new findings', category: 'assessment' },
  { icon: <Stethoscope className="w-3 h-3" />, text: 'Respiratory assessment — Rm 410B diminished bases bilateral', category: 'assessment' },
  { icon: <Stethoscope className="w-3 h-3" />, text: 'Fall risk reassessment — Rm 420A Morse score 55', category: 'assessment' },
  { icon: <Stethoscope className="w-3 h-3" />, text: 'Braden scale reassessment — Rm 403A score 11', category: 'assessment' },
  { icon: <Stethoscope className="w-3 h-3" />, text: 'Wound measurement documented — Rm 403A sacrum 3.8×2.9cm', category: 'assessment' },
  { icon: <FlaskConical className="w-3 h-3" />, text: 'CBC resulted — Rm 406A WBC 14.8 K/µL ↑', category: 'lab' },
  { icon: <FlaskConical className="w-3 h-3" />, text: 'BMP resulted — Rm 419B K+ 3.2 mEq/L ↓', category: 'lab' },
  { icon: <FlaskConical className="w-3 h-3" />, text: 'Troponin resulted — Rm 420A <0.01 ng/mL (normal)', category: 'lab' },
  { icon: <FlaskConical className="w-3 h-3" />, text: 'UA resulted — Rm 405A positive nitrites, >100K WBC', category: 'lab' },
  { icon: <FlaskConical className="w-3 h-3" />, text: 'Blood culture preliminary — Rm 406A GPC in clusters', category: 'lab' },
  { icon: <FlaskConical className="w-3 h-3" />, text: 'Lactate resulted — Rm 404B 1.8 mmol/L (normal)', category: 'lab' },
  { icon: <ClipboardCheck className="w-3 h-3" />, text: 'Diet order updated — Rm 403A cardiac/renal diet', category: 'order' },
  { icon: <ClipboardCheck className="w-3 h-3" />, text: 'PT/OT consult placed — Rm 400A gait assessment', category: 'order' },
  { icon: <ClipboardCheck className="w-3 h-3" />, text: 'Chest X-ray ordered — Rm 410B eval infiltrate', category: 'order' },
  { icon: <ClipboardCheck className="w-3 h-3" />, text: 'Foley removal order entered — Rm 411A void trial AM', category: 'order' },
  { icon: <Bell className="w-3 h-3" />, text: 'Bed alarm activated — Rm 402A patient attempting OOB', category: 'alert' },
  { icon: <Bell className="w-3 h-3" />, text: 'SpO₂ alert — Rm 410B desaturation to 89%', category: 'alert' },
  { icon: <Bell className="w-3 h-3" />, text: 'Call light — Rm 412A (3 min response)', category: 'alert' },
  { icon: <UserCheck className="w-3 h-3" />, text: 'Repositioning completed — Rm 408B left lateral', category: 'intervention' },
  { icon: <UserCheck className="w-3 h-3" />, text: 'Ambulation assist ×2 — Rm 420A 50ft hallway', category: 'intervention' },
  { icon: <Syringe className="w-3 h-3" />, text: 'IV site rotated — Rm 418A R antecubital', category: 'intervention' },
  { icon: <UserCheck className="w-3 h-3" />, text: 'Catheter care performed — Rm 401A meatal cleansing', category: 'intervention' },
  { icon: <FileText className="w-3 h-3" />, text: 'Shift assessment charted — RN J. Martinez 4N', category: 'documentation' },
  { icon: <FileText className="w-3 h-3" />, text: 'I&O totals documented — Rm 419B +1.2L net', category: 'documentation' },
  { icon: <FileText className="w-3 h-3" />, text: 'Pain reassessment — Rm 412A 4/10 post-medication', category: 'documentation' },
];

let eventCounter = 0;

const generateEvent = (): ClinicalEvent => {
  const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
  return {
    id: `evt-${++eventCounter}`,
    time: new Date(),
    icon: template.icon,
    text: template.text,
    category: template.category,
  };
};

const formatTime = (d: Date) =>
  d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

export const AmbientActivityFeed = () => {
  const [events, setEvents] = useState<ClinicalEvent[]>(() => {
    // Seed with 4 initial events
    return Array.from({ length: 4 }, () => {
      const evt = generateEvent();
      evt.time = new Date(Date.now() - Math.random() * 120_000);
      return evt;
    }).sort((a, b) => b.time.getTime() - a.time.getTime());
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // New event every 6–14 seconds (realistic for a busy unit)
    const scheduleNext = () => {
      const delay = 6000 + Math.random() * 8000;
      return setTimeout(() => {
        setEvents(prev => {
          const newEvt = generateEvent();
          return [newEvt, ...prev].slice(0, 20); // keep last 20
        });
        timerRef = scheduleNext();
      }, delay);
    };

    let timerRef = scheduleNext();
    return () => clearTimeout(timerRef);
  }, []);

  return (
    <div className="rounded-xl border border-border/30 bg-card/40 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/20 bg-secondary/20">
        <Activity className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Unit Activity
        </span>
        <span className="relative flex h-1.5 w-1.5 ml-auto">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-risk-low" />
        </span>
      </div>

      <div ref={scrollRef} className="max-h-[220px] overflow-y-auto scrollbar-thin">
        <AnimatePresence initial={false}>
          {events.map((evt) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="border-b border-border/10 last:border-0"
            >
              <div className="flex items-start gap-2.5 px-4 py-2">
                <span className="text-[10px] text-muted-foreground/70 font-mono tabular-nums whitespace-nowrap pt-0.5">
                  {formatTime(evt.time)}
                </span>
                <span className={cn('pt-0.5 flex-shrink-0', CATEGORY_STYLES[evt.category])}>
                  {evt.icon}
                </span>
                <span className="text-[11px] text-foreground/80 leading-snug">
                  {evt.text}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
