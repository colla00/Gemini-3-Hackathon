import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { calculateROI, ROIResult } from '@/utils/dbsCalculations';

interface ROIInputs {
  bedCount: number;
  occupancy: number;
  hourlyRate: number;
}

interface InvestorMetricsContextType {
  inputs: ROIInputs;
  roi: ROIResult;
  updateInputs: (inputs: Partial<ROIInputs>) => void;
  setInputs: (inputs: ROIInputs) => void;
  nurseTimeSaved: number;
  haiReduction: number;
}

const defaultInputs: ROIInputs = {
  bedCount: 50,
  occupancy: 85,
  hourlyRate: 45,
};

const InvestorMetricsContext = createContext<InvestorMetricsContextType | null>(null);

export function InvestorMetricsProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputsState] = useState<ROIInputs>(defaultInputs);

  const roi = useMemo(() => 
    calculateROI({
      bedCount: inputs.bedCount,
      avgOccupancy: inputs.occupancy,
      avgNurseHourlyRate: inputs.hourlyRate,
    }),
    [inputs.bedCount, inputs.occupancy, inputs.hourlyRate]
  );

  // Calculate nurse time saved (hours per shift based on bed count and occupancy)
  const nurseTimeSaved = useMemo(() => {
    // Base: 15 min saved per bed per shift, scaled by occupancy
    const baseMinutesPerBed = 15;
    const shiftsPerDay = 3;
    const occupancyFactor = inputs.occupancy / 100;
    const totalMinutes = inputs.bedCount * baseMinutesPerBed * occupancyFactor;
    // Convert to hours per shift
    return totalMinutes / 60 / shiftsPerDay;
  }, [inputs.bedCount, inputs.occupancy]);

  // Calculate HAI reduction percentage (based on research data)
  const haiReduction = useMemo(() => {
    // Base reduction is 35-55% depending on implementation scale
    // Larger hospitals with higher occupancy see better results
    const baseReduction = 0.35;
    const scaleBonus = Math.min(0.20, (inputs.bedCount / 200) * 0.20);
    const occupancyBonus = ((inputs.occupancy - 50) / 50) * 0.05;
    return Math.round((baseReduction + scaleBonus + occupancyBonus) * 100);
  }, [inputs.bedCount, inputs.occupancy]);

  const updateInputs = useCallback((partialInputs: Partial<ROIInputs>) => {
    setInputsState(prev => ({ ...prev, ...partialInputs }));
  }, []);

  const setInputs = useCallback((newInputs: ROIInputs) => {
    setInputsState(newInputs);
  }, []);

  return (
    <InvestorMetricsContext.Provider 
      value={{ 
        inputs, 
        roi, 
        updateInputs, 
        setInputs,
        nurseTimeSaved,
        haiReduction,
      }}
    >
      {children}
    </InvestorMetricsContext.Provider>
  );
}

export function useInvestorMetrics() {
  const context = useContext(InvestorMetricsContext);
  if (!context) {
    throw new Error('useInvestorMetrics must be used within an InvestorMetricsProvider');
  }
  return context;
}
