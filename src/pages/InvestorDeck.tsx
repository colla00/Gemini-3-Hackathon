import { useState, useCallback, useEffect, useRef } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft, ChevronRight, Maximize, Minimize, 
  Grid3X3, X, Monitor, Clock, Play, Square,
  StickyNote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_SLIDES = 31;
const CHANNEL_NAME = "vitasignal-presenter";

const slides = Array.from({ length: TOTAL_SLIDES }, (_, i) => ({
  id: i + 1,
  src: `/slides/slide-${String(i + 1).padStart(2, "0")}.jpg`,
}));

const DEFAULT_NOTES: Record<number, string> = {
  0: `Welcome & Introduction\n• "Thank you for your time today."\n• VitaSignal is a clinical AI company — equipment-independent intelligence for hospitals.\n• 11 U.S. patent applications filed. NIH-funded research.`,
  1: `The Problem\n• Nurses spend 40%+ of their shift documenting, not at the bedside.\n• Alert fatigue: 85-99% of clinical alarms are false positives.\n• Burnout is driving nurses out of the profession — 100K+ left since 2020.`,
  2: `Our Insight\n• Predictive signals already exist inside the EHR — hidden in documentation timestamps.\n• No new hardware. No new sensors. Just smarter use of data hospitals already collect.\n• This is what "equipment-independent" means.`,
  3: `The VitaSignal Platform\n• Three integrated modules: IDI, DBS, and Trust-Based Alerts.\n• Each addresses a different dimension of clinical burden.\n• All work from existing EHR data — Epic, Cerner, Meditech compatible.`,
  4: `Intensive Documentation Index (IDI)\n• Patent #1 — ICU mortality prediction from documentation patterns.\n• 11 temporal features across 4 domains.\n• Works where traditional scoring systems require lab values we may not have.`,
  5: `IDI Validation Results\n• AUROC 0.9063 on external validation (HiRID dataset).\n• Outperforms APACHE IV and SAPS III (DeLong p < 0.001).\n• 65,157 patients validated across multiple databases.\n• Three manuscripts under review: JAMIA, npj Digital Medicine, JAMA Network Open.`,
  6: `Documentation Burden Score (DBS)\n• Patent #5 — quantifies nursing documentation workload.\n• Validated: 0.802 internal AUROC, 0.758 external (172 hospitals).\n• Enables data-driven staffing decisions — quartile-based recommendations.`,
  7: `Trust-Based Alert System\n• Reduces non-actionable alerts by up to 87% (design target).\n• Every alert includes SHAP explainability — nurses see WHY.\n• Built-in equity monitoring: <0.5% demographic disparity target.`,
  8: `Technical Architecture\n• Temporal feature extraction from EHR timestamps.\n• ML models trained on MIMIC-IV, validated on eICU and HiRID.\n• SHAP-based explainability for every prediction.\n• Closed-loop feedback improves accuracy over time.`,
  9: `Clinical Workflow Integration\n• Designed BY a clinician, FOR clinicians.\n• Integrates into existing EHR workflows — no new screens to learn.\n• Priority queue replaces chaotic alert streams with ranked, actionable items.`,
  10: `Market Opportunity\n• $12B clinical decision support market, growing 11% CAGR.\n• 6,000+ US hospitals, 1M+ ICU beds.\n• No competitor offers equipment-independent mortality prediction.`,
  11: `Competitive Landscape\n• Epic Sepsis Model: requires proprietary ecosystem, poor external validation.\n• APACHE/SAPS: requires manual data entry, not real-time.\n• VitaSignal: works across ANY EHR, real-time, no extra hardware.`,
  12: `Business Model\n• SaaS licensing to health systems — per-bed pricing.\n• Implementation: 4-6 week deployment timeline.\n• Revenue streams: software licenses, integration services, analytics.`,
  13: `Financial Impact\n• $2,847 savings per patient (reduced LOS, fewer adverse events).\n• 1,240% projected ROI for a 500-bed hospital.\n• 90 minutes saved per nursing shift from reduced documentation burden.`,
  14: `Intellectual Property\n• 11 U.S. provisional patent applications filed February 28, 2026.\n• Covers: IDI, DBS, Trust-Based Alerts, Equity Monitoring, Digital Twins.\n• Strong defensible moat — temporal documentation analysis is novel.`,
  15: `Regulatory Strategy\n• FDA: pursuing De Novo pathway for clinical decision support.\n• ISO 14971 risk management framework documented.\n• HIPAA-compliant architecture — all data de-identified for research.`,
  16: `Research Validation\n• Multi-database validation: MIMIC-IV, eICU, HiRID.\n• 382K+ total patients across 208+ hospitals.\n• Peer review in progress at top-tier journals.`,
  17: `NIH Funding & Recognition\n• NIH AIM-AHEAD CLINAQ Fellow — Award No. 1OT2OD032581.\n• ANIA 2026 conference presentation (Boston, March 26-28).\n• Stanford AI+Health Symposium (December 2025).`,
  18: `Equity & Fairness\n• Built-in bias detection across demographic subgroups.\n• Fairness metrics monitored in real-time.\n• Addresses known disparities in existing clinical scoring systems.`,
  19: `Digital Twins Vision\n• Future roadmap: patient digital twins for predictive simulation.\n• "What if" scenarios for staffing and intervention planning.\n• Patent applications cover this forward-looking capability.`,
  20: `Global Health Impact\n• Equipment-independent design enables deployment in resource-limited settings.\n• No expensive monitors needed — just an EHR connection.\n• Potential to improve ICU outcomes in developing nations.`,
  21: `Team & Leadership\n• Dr. Alexis Collier, DHA — Founder & CEO, Principal Investigator.\n• Background: clinical experience → health administration → AI research.\n• NIH fellow, adjunct faculty at University of North Georgia.`,
  22: `Traction & Milestones\n• 11 patents filed, 3 manuscripts under peer review.\n• Platform prototype live and demonstrable.\n• ANIA 2026 presentation scheduled.\n• Active licensing conversations with health systems.`,
  23: `Go-to-Market Strategy\n• Phase 1: Academic medical centers (validation partners).\n• Phase 2: Mid-size health systems (commercial launch).\n• Phase 3: International expansion and digital twins.`,
  24: `The Ask\n• Seeking strategic partners and investors.\n• Funding for: FDA submission, clinical trials, sales team buildout.\n• Goal: first commercial deployment within 12 months.`,
  25: `Why Now?\n• Nursing crisis is at peak — hospitals are desperate for solutions.\n• AI regulation is maturing — clear FDA pathway.\n• EHR adoption is near-universal — the data infrastructure exists.\n• First-mover advantage in equipment-independent clinical AI.`,
  26: `Key Differentiators\n• Only validated equipment-independent ICU mortality predictor.\n• AUROC 0.9063 — outperforms industry gold standards.\n• 11 patents create strong IP moat.\n• NIH-funded, peer-reviewed research.`,
  27: `Partnership Opportunities\n• Research collaborations with academic medical centers.\n• Licensing agreements with health systems.\n• Strategic investment for commercialization.`,
  28: `Contact & Next Steps\n• Email: info@alexiscollier.com\n• Website: alexiscollier.com\n• "We'd love to schedule a deeper technical dive or pilot discussion."`,
  29: `Appendix\n• Refer to supplementary materials for model architecture details.\n• De-identified demo available upon request.\n• All research data available for due diligence.`,
  30: `Thank You\n• "Thank you for your time and interest in VitaSignal."\n• Open for questions.\n• Materials will be shared after this session.`,
};

function InvestorDeck() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [notes, setNotes] = useState<Record<number, string>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("presenter-notes") || "{}");
      // Merge defaults with saved (saved takes priority)
      return { ...DEFAULT_NOTES, ...saved };
    } catch { return { ...DEFAULT_NOTES }; }
  });
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const audienceWindowRef = useRef<Window | null>(null);
  const currentRef = useRef(current);
  currentRef.current = current;

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, TOTAL_SLIDES - 1)), []);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  // Broadcast slide changes to audience window
  useEffect(() => {
    if (!isPresenting) return;
    const ch = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = ch;
    ch.onmessage = (e) => {
      if (e.data?.type === "audience-ready") {
        ch.postMessage({ type: "slide-change", slide: currentRef.current });
      }
    };
    return () => { ch.close(); channelRef.current = null; };
  }, [isPresenting]);

  useEffect(() => {
    if (isPresenting && channelRef.current) {
      channelRef.current.postMessage({ type: "slide-change", slide: current });
    }
  }, [current, isPresenting]);

  // Persist notes
  useEffect(() => {
    localStorage.setItem("presenter-notes", JSON.stringify(notes));
  }, [notes]);

  // Timer
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const startPresenting = useCallback(() => {
    const w = window.open("/audience", "audience-view", "width=1280,height=720,menubar=no,toolbar=no,location=no,status=no");
    audienceWindowRef.current = w;
    setIsPresenting(true);
    setTimerRunning(true);
    setElapsed(0);
  }, []);

  const stopPresenting = useCallback(() => {
    audienceWindowRef.current?.close();
    audienceWindowRef.current = null;
    setIsPresenting(false);
    setTimerRunning(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't capture when typing in notes
      if ((e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape" && showGrid) { e.preventDefault(); setShowGrid(false); }
      if (e.key === "Escape" && isPresenting) { e.preventDefault(); stopPresenting(); }
      if (e.key === "g" || e.key === "G") { setShowGrid((v) => !v); }
      if (e.key === "f" || e.key === "F") { toggleFullscreen(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, showGrid, toggleFullscreen, isPresenting, stopPresenting]);

  // Fullscreen solo mode (no audience window)
  if (isFullscreen && !isPresenting) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]" onClick={next}>
        <img
          src={slides[current].src}
          alt={`Slide ${current + 1}`}
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); prev(); }} className="text-white hover:bg-white/20 h-8 w-8 p-0">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-white/80 text-sm font-mono min-w-[4rem] text-center">
            {current + 1} / {TOTAL_SLIDES}
          </span>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); next(); }} className="text-white hover:bg-white/20 h-8 w-8 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="text-white hover:bg-white/20 h-8 w-8 p-0">
            <Minimize className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // PRESENTER MODE — like Zoom/Teams presenter view
  if (isPresenting) {
    return (
      <div className="fixed inset-0 bg-background z-[9999] flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border/40 shrink-0">
          <div className="flex items-center gap-3">
            <Badge className="bg-destructive/20 border-destructive/40 text-destructive animate-pulse text-xs">
              <div className="w-2 h-2 rounded-full bg-destructive mr-1.5" />
              PRESENTING
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">
              Slide {current + 1} / {TOTAL_SLIDES}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
              <Clock className="w-4 h-4" />
              {formatTime(elapsed)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTimerRunning((r) => !r)}
              className="h-8 w-8 p-0"
            >
              {timerRunning ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotes((v) => !v)}
              className={`h-8 w-8 p-0 ${showNotes ? "text-primary" : ""}`}
            >
              <StickyNote className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={stopPresenting} className="gap-1.5">
              <Square className="w-3 h-3" />
              End
            </Button>
          </div>
        </div>

        {/* Main presenter layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Current + Next slide */}
          <div className="flex-1 flex flex-col p-4 gap-4 min-w-0">
            {/* Current slide (large) */}
            <div className="flex-[3] relative rounded-xl overflow-hidden bg-black border border-border/30">
              <img
                src={slides[current].src}
                alt={`Current: Slide ${current + 1}`}
                className="w-full h-full object-contain"
              />
              {/* Navigation overlay */}
              <button
                onClick={prev}
                className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize opacity-0"
                aria-label="Previous slide"
              />
              <button
                onClick={next}
                className="absolute inset-y-0 right-0 w-1/3 cursor-e-resize opacity-0"
                aria-label="Next slide"
              />
            </div>

            {/* Thumbnail strip for quick navigation */}
            <div className="shrink-0 border-t border-border/30 bg-card/50 px-2 py-2">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    ref={i === current ? (el) => el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }) : undefined}
                    onClick={() => setCurrent(i)}
                    className={`relative shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      i === current
                        ? "border-primary ring-2 ring-primary/30 scale-105"
                        : "border-border/30 hover:border-primary/50 opacity-70 hover:opacity-100"
                    }`}
                    style={{ width: 96, height: 54 }}
                    aria-label={`Go to slide ${i + 1}`}
                  >
                    <img
                      src={slide.src}
                      alt={`Slide ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className={`absolute bottom-0 right-0 text-[9px] font-mono px-1 ${
                      i === current ? "bg-primary text-primary-foreground" : "bg-black/60 text-white/80"
                    }`}>
                      {i + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Notes panel */}
          {showNotes && (
            <div className="w-80 border-l border-border/40 bg-card flex flex-col shrink-0">
              <div className="px-4 py-3 border-b border-border/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Presenter Notes — Slide {current + 1}
                </p>
              </div>
              <Textarea
                className="flex-1 border-0 rounded-none resize-none text-sm focus-visible:ring-0 bg-transparent"
                placeholder="Type notes for this slide..."
                value={notes[current] || ""}
                onChange={(e) => setNotes((prev) => ({ ...prev, [current]: e.target.value }))}
              />
              {/* Thumbnail strip */}
              <div className="border-t border-border/30 p-2 overflow-x-auto">
                <div className="flex gap-1.5 min-w-max">
                  {slides.map((slide, i) => (
                    <button
                      key={slide.id}
                      onClick={() => setCurrent(i)}
                      className={`relative rounded overflow-hidden border-2 transition-all shrink-0 w-14 ${
                        i === current
                          ? "border-primary shadow-sm"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img src={slide.src} alt={`Slide ${i + 1}`} className="w-full aspect-video object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // DEFAULT VIEW — browsing mode
  return (
    <SiteLayout title="Investor Deck" description="VitaSignal™ investor presentation — confidential.">
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-display text-3xl text-foreground">Investor Deck</h1>
              <p className="text-sm text-muted-foreground mt-1">
                VitaSignal™ Platform Overview
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Confidential
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setShowGrid((v) => !v)} className="gap-1.5">
                {showGrid ? <X className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                {showGrid ? "Close" : "Grid"}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFullscreen} className="gap-1.5">
                <Maximize className="w-4 h-4" />
                Fullscreen
              </Button>
              <Button variant="default" size="sm" onClick={startPresenting} className="gap-1.5">
                <Monitor className="w-4 h-4" />
                Present
              </Button>
            </div>
          </div>

          {/* Grid View */}
          <AnimatePresence mode="wait">
            {showGrid ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
              >
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    onClick={() => { setCurrent(i); setShowGrid(false); }}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.03] ${
                      i === current
                        ? "border-primary shadow-lg shadow-primary/20"
                        : "border-border/40 hover:border-primary/50"
                    }`}
                  >
                    <img src={slide.src} alt={`Slide ${i + 1}`} className="w-full aspect-video object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                      <span className="text-white text-[10px] font-mono">{i + 1}</span>
                    </div>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="viewer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Main slide */}
                <div className="relative rounded-xl overflow-hidden bg-black border border-border/30 shadow-xl">
                  <div className="aspect-video relative">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={current}
                        src={slides[current].src}
                        alt={`Slide ${current + 1} of ${TOTAL_SLIDES}`}
                        className="w-full h-full object-contain"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      />
                    </AnimatePresence>
                    <button onClick={prev} className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize opacity-0" aria-label="Previous slide" />
                    <button onClick={next} className="absolute inset-y-0 right-0 w-1/3 cursor-e-resize opacity-0" aria-label="Next slide" />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" size="sm" onClick={prev} disabled={current === 0} className="gap-1.5">
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground font-mono">
                    {current + 1} / {TOTAL_SLIDES}
                  </span>
                  <Button variant="outline" size="sm" onClick={next} disabled={current === TOTAL_SLIDES - 1} className="gap-1.5">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Thumbnail strip */}
                <div className="mt-6 overflow-x-auto pb-2">
                  <div className="flex gap-2 min-w-max">
                    {slides.map((slide, i) => (
                      <button
                        key={slide.id}
                        onClick={() => setCurrent(i)}
                        className={`relative rounded-md overflow-hidden border-2 transition-all shrink-0 w-20 ${
                          i === current
                            ? "border-primary shadow-md shadow-primary/20 scale-105"
                            : "border-transparent opacity-60 hover:opacity-100 hover:border-border"
                        }`}
                      >
                        <img src={slide.src} alt={`Slide ${i + 1}`} className="w-full aspect-video object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-[10px] text-muted-foreground mt-6">
            ← → Navigate · Space Next · F Fullscreen · G Grid · Esc Close
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

export default InvestorDeck;
