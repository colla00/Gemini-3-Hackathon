// DBS (Documentation Burden Score) and ROI Calculation Utilities
// Copyright © Dr. Alexis Collier - U.S. Patent Application Filed
// Validated multi-variable ML model — details under NDA
// ANIA 2026 Presentation — Boston, MA — March 26-28, 2026

export interface DBSFactors {
  apache: number;
  sofa: number;
  comorbidities: number;
  medications: number;
  age: number;
}

export interface ROIParams {
  bedCount: number;
  avgOccupancy: number;
  avgNurseHourlyRate: number;
}

export interface ROIResult {
  annualSavings: number;
  overtimeSavings: number;
  transferSavings: number;
  mortalitySavings: number;
  paybackMonths: number;
  implementationCost: number;
}

/**
 * Calculate Documentation Burden Score based on weighted clinical factors
 * Proprietary model — weights redacted for IP protection
 * Illustrative calculation for demonstration purposes only
 */
export function calculateDBS(factors: DBSFactors): number {
  const { apache, sofa, comorbidities, medications, age } = factors;
  // Illustrative weighted calculation for demo — actual model weights are proprietary
  const score = (
    (apache / 71) * 0.20 +
    (sofa / 24) * 0.20 +
    (comorbidities / 10) * 0.20 +
    (medications / 30) * 0.20 +
    ((age - 18) / 82) * 0.20
  ) * 100;
  
  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Get DBS Quartile classification with staffing recommendation
 */
export function getDBSQuartile(score: number): {
  quartile: string;
  label: string;
  staffingRatio: string;
} {
  if (score < 25) {
    return { quartile: 'Q1', label: 'Low Burden', staffingRatio: '1:2' };
  }
  if (score < 50) {
    return { quartile: 'Q2', label: 'Moderate Burden', staffingRatio: '1:1' };
  }
  if (score < 75) {
    return { quartile: 'Q3', label: 'High Burden', staffingRatio: '1:1 Enhanced' };
  }
  return { quartile: 'Q4', label: 'Very High Burden', staffingRatio: '1:1 + Senior RN' };
}

/**
 * Calculate ROI for hospital implementation
 * Based on validated research data
 */
export function calculateROI(params: ROIParams): ROIResult {
  const { bedCount, avgOccupancy, avgNurseHourlyRate } = params;
  
  // Annual occupied bed-days
  const occupiedBedDays = bedCount * (avgOccupancy / 100) * 365;
  
  // Overtime savings (15-20% reduction, using 17.5% average)
  const overtimeHoursPerBed = 2.5; // hours per occupied bed per day
  const overtimeReduction = 0.175;
  const overtimeSavings = 
    occupiedBedDays * overtimeHoursPerBed * overtimeReduction * avgNurseHourlyRate * 1.5;
  
  // Transfer reduction savings (8-15% reduction, using 11.5% average)
  const avgTransferCost = 5000;
  const transferRate = 0.08; // 8% of patients transferred
  const transferReduction = 0.115;
  const transferSavings = 
    occupiedBedDays * transferRate * transferReduction * avgTransferCost;
  
  // Mortality reduction value (10-18% reduction, using 14% average)
  const sepsisRate = 0.10; // 10% of ICU patients
  const sepsisMortalityRate = 0.25;
  const mortalityReduction = 0.14;
  const mortalityValue = 50000; // statistical value
  const mortalitySavings = 
    occupiedBedDays * sepsisRate * sepsisMortalityRate * mortalityReduction * mortalityValue;
  
  const annualSavings = overtimeSavings + transferSavings + mortalitySavings;
  
  // Implementation cost estimate
  const implementationCost = bedCount * 2000; // $2k per bed
  const paybackMonths = (implementationCost / annualSavings) * 12;
  
  return {
    annualSavings,
    overtimeSavings,
    transferSavings,
    mortalitySavings,
    paybackMonths: Math.max(0.1, paybackMonths),
    implementationCost,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format percentage for display
 */
export function formatPercentage(num: number, decimals = 1): string {
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * Format large numbers with K/M suffix
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${Math.round(num / 1000)}K`;
  }
  return num.toString();
}
