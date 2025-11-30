import { useState, useEffect, useCallback, useRef } from 'react';

interface VitalSigns {
  heartRate: number;
  bp: string;
  temp: string;
  o2Sat: string;
}

interface SimulatedPatient {
  id: string;
  fallsRisk: number;
  hapiRisk: number;
  cautiRisk: number;
  vitals: VitalSigns;
  lastUpdated: Date;
}

const randomInRange = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number, decimals: number = 1) => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const generateVitals = (): VitalSigns => ({
  heartRate: randomInRange(65, 110),
  bp: `${randomInRange(100, 145)}/${randomInRange(60, 95)}`,
  temp: `${randomFloat(36.5, 37.8)}°C`,
  o2Sat: `${randomInRange(94, 100)}%`,
});

const fluctuateRisk = (current: number, maxChange: number = 5): number => {
  const change = randomFloat(-maxChange, maxChange);
  const newValue = current + change;
  return Math.max(5, Math.min(95, Math.round(newValue)));
};

export const useLiveSimulation = (enabled: boolean = true, intervalMs: number = 5000) => {
  const [simulatedData, setSimulatedData] = useState<Map<string, SimulatedPatient>>(new Map());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [updateCount, setUpdateCount] = useState(0);
  const [isActive, setIsActive] = useState(enabled);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializePatient = useCallback((id: string, baseRisk: number = 50): SimulatedPatient => ({
    id,
    fallsRisk: baseRisk,
    hapiRisk: Math.max(10, baseRisk - randomInRange(5, 20)),
    cautiRisk: Math.max(10, baseRisk - randomInRange(10, 25)),
    vitals: generateVitals(),
    lastUpdated: new Date(),
  }), []);

  const updateSimulation = useCallback(() => {
    setSimulatedData(prev => {
      const updated = new Map(prev);
      updated.forEach((patient, id) => {
        updated.set(id, {
          ...patient,
          fallsRisk: fluctuateRisk(patient.fallsRisk, 3),
          hapiRisk: fluctuateRisk(patient.hapiRisk, 2),
          cautiRisk: fluctuateRisk(patient.cautiRisk, 2),
          vitals: {
            heartRate: fluctuateRisk(patient.vitals.heartRate, 5),
            bp: `${randomInRange(100, 145)}/${randomInRange(60, 95)}`,
            temp: `${randomFloat(36.5, 37.8)}°C`,
            o2Sat: `${randomInRange(94, 100)}%`,
          },
          lastUpdated: new Date(),
        });
      });
      return updated;
    });
    setLastUpdate(new Date());
    setUpdateCount(prev => prev + 1);
  }, []);

  const registerPatient = useCallback((id: string, baseRisk?: number) => {
    setSimulatedData(prev => {
      if (prev.has(id)) return prev;
      const updated = new Map(prev);
      updated.set(id, initializePatient(id, baseRisk));
      return updated;
    });
  }, [initializePatient]);

  const getPatientData = useCallback((id: string): SimulatedPatient | undefined => {
    return simulatedData.get(id);
  }, [simulatedData]);

  const toggle = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(updateSimulation, intervalMs);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, intervalMs, updateSimulation]);

  return {
    simulatedData,
    lastUpdate,
    updateCount,
    isActive,
    toggle,
    registerPatient,
    getPatientData,
    updateSimulation,
  };
};
