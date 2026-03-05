import { useState, useCallback, useEffect } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, ChevronRight, Maximize, Minimize, 
  Download, Grid3X3, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_SLIDES = 31;
const slides = Array.from({ length: TOTAL_SLIDES }, (_, i) => ({
  id: i + 1,
  src: `/slides/slide-${String(i + 1).padStart(2, "0")}.jpg`,
}));

function InvestorDeck() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, TOTAL_SLIDES - 1)), []);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

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
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape" && showGrid) { e.preventDefault(); setShowGrid(false); }
      if (e.key === "g" || e.key === "G") { setShowGrid((v) => !v); }
      if (e.key === "f" || e.key === "F") { toggleFullscreen(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, showGrid, toggleFullscreen]);

  // Fullscreen presentation mode
  if (isFullscreen) {
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
                Present
              </Button>
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <a href="/vitasignal-investor-deck.pdf" download>
                  <Download className="w-4 h-4" />
                  PDF
                </a>
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

                    {/* Click zones */}
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
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" size="sm" onClick={prev} disabled={current === 0} className="gap-1.5">
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground font-mono">
                      {current + 1} / {TOTAL_SLIDES}
                    </span>
                  </div>
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

          {/* Keyboard hints */}
          <p className="text-center text-[10px] text-muted-foreground mt-6">
            ← → Navigate · Space Next · F Fullscreen · G Grid · Esc Close
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

export default InvestorDeck;
