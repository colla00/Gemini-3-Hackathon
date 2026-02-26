// Hospital preset configurations for ROI calculations
// Copyright © Dr. Alexis Collier - U.S. Patent Application Filed

export interface HospitalPreset {
  id: string;
  name: string;
  description: string;
  bedCount: number;
  occupancy: number;
  hourlyRate: number;
}

export const HOSPITAL_PRESETS: HospitalPreset[] = [
  {
    id: 'small-community',
    name: 'Small Community',
    description: '25-bed rural hospital',
    bedCount: 25,
    occupancy: 70,
    hourlyRate: 38,
  },
  {
    id: 'rural-critical',
    name: 'Rural Critical Access',
    description: '15-bed CAH facility',
    bedCount: 15,
    occupancy: 60,
    hourlyRate: 35,
  },
  {
    id: 'mid-size-regional',
    name: 'Mid-Size Regional',
    description: '75-bed regional center',
    bedCount: 75,
    occupancy: 80,
    hourlyRate: 45,
  },
  {
    id: 'large-academic',
    name: 'Large Academic Center',
    description: '150-bed teaching hospital',
    bedCount: 150,
    occupancy: 90,
    hourlyRate: 55,
  },
  {
    id: 'urban-tertiary',
    name: 'Urban Tertiary',
    description: '200-bed metro hospital',
    bedCount: 200,
    occupancy: 95,
    hourlyRate: 60,
  },
  {
    id: 'specialty-cardiac',
    name: 'Specialty Cardiac',
    description: '40-bed cardiac center',
    bedCount: 40,
    occupancy: 85,
    hourlyRate: 52,
  },
];

// Color mappings for presets (kept separate for UI flexibility)
export const PRESET_COLORS: Record<string, string> = {
  'small-community': 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
  'rural-critical': 'bg-amber-500/20 text-amber-600 border-amber-500/30',
  'mid-size-regional': 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  'large-academic': 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  'urban-tertiary': 'bg-rose-500/20 text-rose-600 border-rose-500/30',
  'specialty-cardiac': 'bg-red-500/20 text-red-600 border-red-500/30',
};
