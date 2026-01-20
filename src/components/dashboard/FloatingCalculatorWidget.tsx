// Floating Calculator Widget
// Stays visible while scrolling for quick access

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Calculator, X, ChevronUp, ChevronDown, DollarSign, FileText,
  Minimize2, Maximize2, GripVertical
} from 'lucide-react';
import { calculateDBS, getDBSQuartile, calculateROI, formatCurrency, formatCompactNumber } from '@/utils/dbsCalculations';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingCalculatorWidgetProps {
  onOpenFullCalculators: () => void;
}

export function FloatingCalculatorWidget({ onOpenFullCalculators }: FloatingCalculatorWidgetProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'dbs' | 'roi'>('dbs');

  // DBS state
  const [apache, setApache] = useState(18);
  const [sofa, setSofa] = useState(8);
  const [bedCount, setBedCount] = useState(50);
  const [occupancy, setOccupancy] = useState(85);

  const dbsScore = useMemo(() => 
    calculateDBS({ apache, sofa, comorbidities: 4, medications: 12, age: 62 }), 
    [apache, sofa]
  );
  const quartileInfo = useMemo(() => getDBSQuartile(dbsScore), [dbsScore]);
  const roi = useMemo(() => 
    calculateROI({ bedCount, avgOccupancy: occupancy, avgNurseHourlyRate: 45 }),
    [bedCount, occupancy]
  );

  const getScoreColor = (score: number) => {
    if (score < 25) return 'text-risk-low';
    if (score < 50) return 'text-warning';
    if (score < 75) return 'text-risk-medium';
    return 'text-risk-high';
  };

  const getComplexityLabel = (score: number) => {
    if (score < 25) return 'Low';
    if (score < 50) return 'Moderate';
    if (score < 75) return 'High';
    return 'Very High';
  };

  if (!isVisible) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setIsVisible(true)}
        aria-label="Open calculator widget"
      >
        <Calculator className="h-5 w-5" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        height: isMinimized ? 'auto' : isExpanded ? 'auto' : 'auto'
      }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "fixed bottom-6 right-6 z-50 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden",
        isExpanded ? "w-80" : "w-72"
      )}
      style={{ maxHeight: isMinimized ? '56px' : isExpanded ? '400px' : '280px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/30">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <Calculator className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Quick Calculator</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? "Expand widget" : "Minimize widget"}
          >
            {isMinimized ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse widget" : "Expand widget"}
          >
            {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive"
            onClick={() => setIsVisible(false)}
            aria-label="Close widget"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 space-y-3"
          >
            {/* Tab Switcher */}
            <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
              <button
                onClick={() => setActiveTab('dbs')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all",
                  activeTab === 'dbs' 
                    ? "bg-background shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileText className="h-3 w-3" />
                DBS
              </button>
              <button
                onClick={() => setActiveTab('roi')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all",
                  activeTab === 'roi' 
                    ? "bg-background shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <DollarSign className="h-3 w-3" />
                ROI
              </button>
            </div>

            {activeTab === 'dbs' ? (
              <div className="space-y-3">
                {/* DBS Result */}
                <div className="text-center p-3 rounded-lg bg-gradient-to-r from-risk-low/10 via-warning/10 to-risk-high/10">
                  <div className={cn("text-2xl font-bold", getScoreColor(dbsScore))}>
                    {getComplexityLabel(dbsScore)}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {quartileInfo.quartile} • Staffing: {quartileInfo.staffingRatio}
                  </div>
                </div>

                {/* Quick Sliders */}
                {isExpanded && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">APACHE II</span>
                        <span className="font-bold">{apache}</span>
                      </div>
                      <Slider 
                        value={[apache]} 
                        onValueChange={([v]) => setApache(v)} 
                        min={0} 
                        max={71}
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">SOFA Score</span>
                        <span className="font-bold">{sofa}</span>
                      </div>
                      <Slider 
                        value={[sofa]} 
                        onValueChange={([v]) => setSofa(v)} 
                        min={0} 
                        max={24}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* ROI Result */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded-lg bg-risk-low/10 border border-risk-low/20">
                    <div className="text-lg font-bold text-risk-low">
                      {formatCompactNumber(roi.annualSavings)}
                    </div>
                    <div className="text-[9px] text-muted-foreground">Annual</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-lg font-bold text-primary">
                      {roi.paybackMonths.toFixed(1)}mo
                    </div>
                    <div className="text-[9px] text-muted-foreground">Payback</div>
                  </div>
                </div>

                {/* Quick Sliders */}
                {isExpanded && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Bed Count</span>
                        <span className="font-bold">{bedCount}</span>
                      </div>
                      <Slider 
                        value={[bedCount]} 
                        onValueChange={([v]) => setBedCount(v)} 
                        min={10} 
                        max={200}
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Occupancy</span>
                        <span className="font-bold">{occupancy}%</span>
                      </div>
                      <Slider 
                        value={[occupancy]} 
                        onValueChange={([v]) => setOccupancy(v)} 
                        min={50} 
                        max={100}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Open Full View Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={onOpenFullCalculators}
            >
              Open Full Calculator View
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
