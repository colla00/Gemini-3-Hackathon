import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Physiologically coherent vital sign simulation.
 * Vitals drift naturally using Brownian motion with mean-reversion,
 * respecting clinical ranges and inter-vital correlations.
 */

export interface RealisticVitals {
  hr: number;          // Heart rate (bpm)
  sbp: number;         // Systolic BP (mmHg)
  dbp: number;         // Diastolic BP (mmHg)
  spo2: number;        // SpO2 (%)
  rr: number;          // Respiratory rate (breaths/min)
  temp: number;        // Temperature (°F)
  map: number;         // Mean arterial pressure
  lastTaken: Date;
}

interface PatientProfile {
  // Baseline "home" values this patient reverts toward
  baseHR: number;
  baseSBP: number;
  baseDBP: number;
  baseSPO2: number;
  baseRR: number;
  baseTemp: number;
  // Volatility — how much this patient's vitals fluctuate
  volatility: number; // 0.3 = stable, 1.0 = unstable
}

// Seeded profiles for each patient so they're consistent across sessions
const patientProfiles: Record<string, PatientProfile> = {
  'Patient C00': { baseHR: 96, baseSBP: 132, baseDBP: 86, baseSPO2: 96, baseRR: 20, baseTemp: 100.8, volatility: 0.8 },
  'Patient A01': { baseHR: 78, baseSBP: 138, baseDBP: 82, baseSPO2: 96, baseRR: 16, baseTemp: 98.4, volatility: 0.5 },
  'Patient B02': { baseHR: 72, baseSBP: 124, baseDBP: 76, baseSPO2: 97, baseRR: 15, baseTemp: 98.6, volatility: 0.3 },
  'Patient C03': { baseHR: 68, baseSBP: 118, baseDBP: 74, baseSPO2: 98, baseRR: 14, baseTemp: 98.2, volatility: 0.2 },
  'Patient D04': { baseHR: 76, baseSBP: 142, baseDBP: 88, baseSPO2: 95, baseRR: 18, baseTemp: 98.8, volatility: 0.6 },
  'Patient E05': { baseHR: 74, baseSBP: 132, baseDBP: 78, baseSPO2: 96, baseRR: 16, baseTemp: 98.4, volatility: 0.4 },
  'Patient F06': { baseHR: 82, baseSBP: 122, baseDBP: 76, baseSPO2: 94, baseRR: 22, baseTemp: 99.8, volatility: 0.5 },
  'Patient G07': { baseHR: 92, baseSBP: 108, baseDBP: 62, baseSPO2: 95, baseRR: 20, baseTemp: 100.2, volatility: 0.9 },
  'Patient H08': { baseHR: 78, baseSBP: 128, baseDBP: 80, baseSPO2: 92, baseRR: 24, baseTemp: 98.6, volatility: 0.4 },
  'Patient J09': { baseHR: 66, baseSBP: 120, baseDBP: 72, baseSPO2: 99, baseRR: 14, baseTemp: 98.2, volatility: 0.2 },
  'Patient K10': { baseHR: 84, baseSBP: 116, baseDBP: 68, baseSPO2: 97, baseRR: 18, baseTemp: 99.2, volatility: 0.5 },
  'Patient L11': { baseHR: 88, baseSBP: 126, baseDBP: 74, baseSPO2: 97, baseRR: 18, baseTemp: 99.8, volatility: 0.7 },
  'Patient M12': { baseHR: 94, baseSBP: 98, baseDBP: 58, baseSPO2: 94, baseRR: 22, baseTemp: 98.4, volatility: 0.8 },
  'Patient N13': { baseHR: 72, baseSBP: 134, baseDBP: 82, baseSPO2: 98, baseRR: 16, baseTemp: 98.4, volatility: 0.3 },
  'Patient P14': { baseHR: 70, baseSBP: 118, baseDBP: 72, baseSPO2: 99, baseRR: 14, baseTemp: 98.6, volatility: 0.2 },
  'Patient Q15': { baseHR: 98, baseSBP: 104, baseDBP: 62, baseSPO2: 96, baseRR: 20, baseTemp: 100.8, volatility: 0.9 },
  'Patient R16': { baseHR: 82, baseSBP: 108, baseDBP: 64, baseSPO2: 95, baseRR: 18, baseTemp: 98.0, volatility: 0.5 },
  'Patient S17': { baseHR: 76, baseSBP: 116, baseDBP: 74, baseSPO2: 99, baseRR: 14, baseTemp: 98.4, volatility: 0.2 },
  'Patient T18': { baseHR: 80, baseSBP: 138, baseDBP: 78, baseSPO2: 93, baseRR: 22, baseTemp: 99.4, volatility: 0.7 },
};

const defaultProfile: PatientProfile = {
  baseHR: 78, baseSBP: 125, baseDBP: 78, baseSPO2: 97, baseRR: 16, baseTemp: 98.6, volatility: 0.4,
};

// Ornstein-Uhlenbeck step: mean-reverting random walk
function ouStep(current: number, mean: number, theta: number, sigma: number): number {
  const noise = (Math.random() - 0.5) * 2; // uniform [-1, 1]
  return current + theta * (mean - current) + sigma * noise;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function createInitialVitals(profile: PatientProfile): RealisticVitals {
  const sbp = profile.baseSBP + (Math.random() - 0.5) * 4;
  const dbp = profile.baseDBP + (Math.random() - 0.5) * 3;
  return {
    hr: Math.round(profile.baseHR + (Math.random() - 0.5) * 4),
    sbp: Math.round(sbp),
    dbp: Math.round(dbp),
    spo2: Math.round(clamp(profile.baseSPO2 + (Math.random() - 0.5) * 2, 85, 100)),
    rr: Math.round(profile.baseRR + (Math.random() - 0.5) * 2),
    temp: parseFloat((profile.baseTemp + (Math.random() - 0.5) * 0.3).toFixed(1)),
    map: Math.round((sbp + 2 * dbp) / 3),
    lastTaken: new Date(),
  };
}

function stepVitals(current: RealisticVitals, profile: PatientProfile): RealisticVitals {
  const v = profile.volatility;
  const theta = 0.15; // reversion speed

  const hr = clamp(Math.round(ouStep(current.hr, profile.baseHR, theta, 2 * v)), 40, 180);
  // When HR goes up, SBP tends to follow (baroreceptor reflex simplified)
  const hrDelta = hr - current.hr;
  const sbpBias = hrDelta * 0.3;
  const sbp = clamp(Math.round(ouStep(current.sbp + sbpBias, profile.baseSBP, theta, 3 * v)), 70, 220);
  const dbp = clamp(Math.round(ouStep(current.dbp, profile.baseDBP, theta, 2 * v)), 40, 130);
  // SpO2 moves slowly and is sticky at the top
  const spo2Raw = ouStep(current.spo2, profile.baseSPO2, theta * 0.5, 0.5 * v);
  const spo2 = clamp(Math.round(spo2Raw), 85, 100);
  const rr = clamp(Math.round(ouStep(current.rr, profile.baseRR, theta, 1 * v)), 8, 40);
  // Temp drifts very slowly
  const temp = clamp(parseFloat(ouStep(current.temp, profile.baseTemp, theta * 0.3, 0.1 * v).toFixed(1)), 95, 106);

  return {
    hr, sbp, dbp, spo2, rr, temp,
    map: Math.round((sbp + 2 * dbp) / 3),
    lastTaken: new Date(),
  };
}

export function getVitalStatus(vital: string, value: number): 'normal' | 'warning' | 'critical' {
  switch (vital) {
    case 'hr':
      if (value < 50 || value > 130) return 'critical';
      if (value < 60 || value > 100) return 'warning';
      return 'normal';
    case 'sbp':
      if (value < 80 || value > 180) return 'critical';
      if (value < 90 || value > 140) return 'warning';
      return 'normal';
    case 'spo2':
      if (value < 90) return 'critical';
      if (value < 94) return 'warning';
      return 'normal';
    case 'rr':
      if (value < 8 || value > 30) return 'critical';
      if (value < 12 || value > 22) return 'warning';
      return 'normal';
    case 'temp':
      if (value > 103 || value < 96) return 'critical';
      if (value > 100.4 || value < 97) return 'warning';
      return 'normal';
    default:
      return 'normal';
  }
}

export const useRealisticVitals = (patientIds: string[], enabled = true, intervalMs = 3000) => {
  const [vitalsMap, setVitalsMap] = useState<Map<string, RealisticVitals>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize all patients
  useEffect(() => {
    const map = new Map<string, RealisticVitals>();
    for (const id of patientIds) {
      const profile = patientProfiles[id] || defaultProfile;
      map.set(id, createInitialVitals(profile));
    }
    setVitalsMap(map);
  }, [patientIds.join(',')]);

  // Tick vitals forward
  useEffect(() => {
    if (!enabled) return;
    
    intervalRef.current = setInterval(() => {
      setVitalsMap(prev => {
        const next = new Map(prev);
        for (const [id, vitals] of next) {
          const profile = patientProfiles[id] || defaultProfile;
          next.set(id, stepVitals(vitals, profile));
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, intervalMs]);

  const getVitals = useCallback((id: string) => vitalsMap.get(id), [vitalsMap]);

  return { vitalsMap, getVitals };
};
