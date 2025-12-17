// Risk Calculation Utilities
// Extracted for better testability and reusability

import type { RiskLevel, TrendDirection, Patient, RiskFactor } from '@/data/patients';

/**
 * Determines risk level based on score
 * HIGH: >= 70, MEDIUM: 40-69, LOW: < 40
 */
export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
};

/**
 * Calculates confidence interval based on risk level
 * Higher risk = wider confidence interval
 */
export const getConfidenceInterval = (riskLevel: RiskLevel): number => {
  switch (riskLevel) {
    case 'HIGH': return 8;
    case 'MEDIUM': return 6;
    case 'LOW': return 4;
  }
};

/**
 * Calculates total risk contribution from factors
 * Positive contributions increase risk, negative decrease it
 */
export const calculateTotalContribution = (factors: RiskFactor[]): number => {
  return factors.reduce((sum, factor) => sum + factor.contribution, 0);
};

/**
 * Gets protective factors (negative contribution)
 */
export const getProtectiveFactors = (factors: RiskFactor[]): RiskFactor[] => {
  return factors.filter(f => f.contribution < 0);
};

/**
 * Gets risk-increasing factors (positive contribution)
 */
export const getRiskFactors = (factors: RiskFactor[]): RiskFactor[] => {
  return factors.filter(f => f.contribution > 0);
};

/**
 * Validates a risk score is within valid range (0-100)
 */
export const isValidRiskScore = (score: number): boolean => {
  return typeof score === 'number' && score >= 0 && score <= 100 && !isNaN(score);
};

/**
 * Validates risk factor contributions sum to approximately the expected range
 */
export const validateContributions = (factors: RiskFactor[]): boolean => {
  const total = calculateTotalContribution(factors);
  // Total contribution should be between -1 and 1 (normalized)
  return total >= -1 && total <= 1;
};

/**
 * Calculates trend direction based on score history
 */
export const calculateTrendDirection = (
  previousScore: number,
  currentScore: number,
  threshold: number = 5
): TrendDirection => {
  const diff = currentScore - previousScore;
  if (diff > threshold) return 'up';
  if (diff < -threshold) return 'down';
  return 'stable';
};

/**
 * Calculates average risk across multiple outcomes
 */
export const calculateAverageRisk = (scores: number[]): number => {
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
};

/**
 * Counts high-risk outcomes
 */
export const countHighRiskOutcomes = (scores: number[], threshold: number = 70): number => {
  return scores.filter(s => s >= threshold).length;
};

/**
 * Validates patient data structure
 */
export const validatePatientData = (patient: Partial<Patient>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!patient.id) errors.push('Patient ID is required');
  if (!patient.riskLevel) errors.push('Risk level is required');
  if (patient.riskScore === undefined || !isValidRiskScore(patient.riskScore)) {
    errors.push('Valid risk score (0-100) is required');
  }
  if (!patient.riskType) errors.push('Risk type is required');
  if (!patient.trend) errors.push('Trend direction is required');
  if (!patient.riskFactors || patient.riskFactors.length === 0) {
    errors.push('At least one risk factor is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Normalizes risk score to ensure it's within bounds
 */
export const normalizeRiskScore = (score: number): number => {
  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Calculates risk score with confidence bounds
 */
export const calculateRiskBounds = (
  score: number,
  riskLevel: RiskLevel
): { low: number; high: number } => {
  const interval = getConfidenceInterval(riskLevel);
  return {
    low: Math.max(0, score - interval),
    high: Math.min(100, score + interval)
  };
};

/**
 * Determines priority level based on risk score and trend
 */
export const getPriorityLevel = (
  score: number,
  trend: TrendDirection
): 'critical' | 'high' | 'medium' | 'low' => {
  if (score >= 80 || (score >= 70 && trend === 'up')) return 'critical';
  if (score >= 70 || (score >= 60 && trend === 'up')) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

/**
 * Formats time since last update
 */
export const formatLastUpdated = (minutes: number): string => {
  if (minutes < 60) return `~${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `~${hours}h`;
};

/**
 * Sorts patients by risk priority
 */
export const sortByRiskPriority = (patients: Patient[]): Patient[] => {
  const priorityOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };
  const trendOrder = { 'up': 0, 'stable': 1, 'down': 2 };
  
  return [...patients].sort((a, b) => {
    // First by risk level
    const levelDiff = priorityOrder[a.riskLevel] - priorityOrder[b.riskLevel];
    if (levelDiff !== 0) return levelDiff;
    
    // Then by score (descending)
    const scoreDiff = b.riskScore - a.riskScore;
    if (scoreDiff !== 0) return scoreDiff;
    
    // Finally by trend
    return trendOrder[a.trend] - trendOrder[b.trend];
  });
};
