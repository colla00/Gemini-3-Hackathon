// Risk-related formatting utilities
import type { RiskLevel, RiskType } from '@/types/patient';

/**
 * Returns the CSS class for a risk level background/badge color
 */
export const getRiskLevelColor = (level: RiskLevel): string => {
  switch (level) {
    case 'HIGH':
      return 'risk-high';
    case 'MEDIUM':
      return 'risk-medium';
    case 'LOW':
      return 'risk-low';
  }
};

/**
 * Returns the CSS text color class for a risk level
 */
export const getRiskLevelTextColor = (level: RiskLevel): string => {
  switch (level) {
    case 'HIGH':
      return 'text-risk-high';
    case 'MEDIUM':
      return 'text-risk-medium';
    case 'LOW':
      return 'text-risk-low';
  }
};

/**
 * Returns a human-readable label for a risk level and type
 */
export const getRiskLevelLabel = (level: RiskLevel, riskType: RiskType): string => {
  switch (level) {
    case 'HIGH':
      return `Elevated ${riskType} Risk`;
    case 'MEDIUM':
      return 'Moderate Risk - Monitor Closely';
    case 'LOW':
      return 'Low Risk - Standard Monitoring';
  }
};
