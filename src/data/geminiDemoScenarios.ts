/**
 * Gemini 3 Hackathon 2026 - Demo Scenarios
 * 
 * Realistic patient scenarios for demonstrating AI-powered clinical decision support
 * These are synthetic, de-identified cases for demonstration purposes only
 */

export interface DemoVitalSigns {
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  respiratoryRate: number;
  temperature: number;
  spO2: number;
  painLevel: number;
}

export interface DemoTimepoint {
  time: string;
  vitals: DemoVitalSigns;
  clinicalNotes: string;
  riskScore: number;
  aiDetection: string[];
}

export interface DemoScenario {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  riskType: string;
  timeline: {
    baseline: DemoTimepoint;
    fourHours: DemoTimepoint;
    twelveHours: DemoTimepoint;
  };
  expectedInterventions: string[];
  outcomeWithoutAI: string;
  outcomeWithAI: string;
}

export const geminiDemoScenarios: DemoScenario[] = [
  {
    id: "DEMO-001",
    name: "Respiratory Distress Case",
    age: 68,
    diagnosis: "Post-operative hip replacement",
    riskType: "Respiratory",
    timeline: {
      baseline: {
        time: "08:00",
        vitals: {
          heartRate: 78,
          systolicBP: 128,
          diastolicBP: 82,
          respiratoryRate: 16,
          temperature: 98.4,
          spO2: 97,
          painLevel: 4
        },
        clinicalNotes: "Post-op day 1. Patient resting comfortably. Surgical site clean and dry. Ambulated to chair with assistance. No acute distress. Lung sounds clear bilaterally. Patient using incentive spirometer as instructed.",
        riskScore: 0.22,
        aiDetection: ["Baseline stable", "No concerning patterns"]
      },
      fourHours: {
        time: "12:00",
        vitals: {
          heartRate: 92,
          systolicBP: 134,
          diastolicBP: 88,
          respiratoryRate: 20,
          temperature: 99.1,
          spO2: 94,
          painLevel: 5
        },
        clinicalNotes: "Patient reports feeling 'a bit winded' after walking to bathroom. Noted increased respiratory effort. Using accessory muscles slightly. SpO2 dropped from 97% to 94% during ambulation. Coughing occasionally, non-productive. Encouraged deep breathing exercises.",
        riskScore: 0.58,
        aiDetection: [
          "SpO2 declining trend detected",
          "Respiratory rate increasing",
          "Elevated heart rate pattern",
          "Accessory muscle use noted"
        ]
      },
      twelveHours: {
        time: "20:00",
        vitals: {
          heartRate: 108,
          systolicBP: 142,
          diastolicBP: 94,
          respiratoryRate: 26,
          temperature: 100.2,
          spO2: 89,
          painLevel: 6
        },
        clinicalNotes: "Patient increasingly dyspneic. Now requiring 4L O2 via nasal cannula to maintain SpO2 above 90%. Lung sounds diminished in right lower lobe. Patient anxious, sitting upright, using accessory muscles prominently. Productive cough with frothy sputum. Rapid response team notified.",
        riskScore: 0.87,
        aiDetection: [
          "CRITICAL: Acute respiratory deterioration",
          "Hypoxemia despite supplemental O2",
          "Pattern consistent with pulmonary embolism or aspiration",
          "Immediate intervention required"
        ]
      }
    },
    expectedInterventions: [
      "Elevate head of bed to 45 degrees",
      "Increase O2 monitoring to continuous",
      "Obtain stat chest X-ray",
      "Consider DVT prophylaxis assessment",
      "Notify rapid response team"
    ],
    outcomeWithoutAI: "Patient transferred to ICU with acute respiratory failure. Required intubation.",
    outcomeWithAI: "AI flagged declining trend at 4-hour mark. Early intervention prevented ICU transfer."
  },
  {
    id: "DEMO-002",
    name: "Early Sepsis Case",
    age: 54,
    diagnosis: "Urinary tract infection, indwelling catheter",
    riskType: "Sepsis",
    timeline: {
      baseline: {
        time: "06:00",
        vitals: {
          heartRate: 82,
          systolicBP: 118,
          diastolicBP: 72,
          respiratoryRate: 14,
          temperature: 98.6,
          spO2: 98,
          painLevel: 2
        },
        clinicalNotes: "Admitted for UTI management. Foley catheter in place. Started on oral antibiotics yesterday. Patient comfortable, no complaints. Urine output adequate. No signs of systemic infection.",
        riskScore: 0.35,
        aiDetection: ["Catheter present - CAUTI risk factor", "Monitor for infection progression"]
      },
      fourHours: {
        time: "10:00",
        vitals: {
          heartRate: 96,
          systolicBP: 108,
          diastolicBP: 68,
          respiratoryRate: 18,
          temperature: 100.8,
          spO2: 96,
          painLevel: 4
        },
        clinicalNotes: "Patient reports feeling 'off' this morning. Noted mild confusion when asked about date. Temperature elevated. Urine appears more cloudy than yesterday. Decreased appetite. Patient seems more fatigued than baseline. Skin warm to touch.",
        riskScore: 0.62,
        aiDetection: [
          "Subtle mental status change detected",
          "Temperature trending upward",
          "Heart rate variability decreasing",
          "Early sepsis pattern emerging"
        ]
      },
      twelveHours: {
        time: "18:00",
        vitals: {
          heartRate: 118,
          systolicBP: 88,
          diastolicBP: 54,
          respiratoryRate: 24,
          temperature: 102.4,
          spO2: 92,
          painLevel: 6
        },
        clinicalNotes: "Patient acutely deteriorated. Now hypotensive, tachycardic, febrile. Altered mental status - oriented only to self. Skin mottled on extremities. Urine output decreased to <30ml/hr. Lactate 4.2. Blood cultures drawn. Broad spectrum antibiotics started. Sepsis protocol initiated.",
        riskScore: 0.91,
        aiDetection: [
          "CRITICAL: Septic shock criteria met",
          "Hemodynamic instability",
          "End-organ dysfunction developing",
          "Aggressive resuscitation required"
        ]
      }
    },
    expectedInterventions: [
      "Blood cultures before antibiotics",
      "Upgrade to IV antibiotics",
      "Fluid resuscitation per sepsis protocol",
      "Lactate monitoring q2h",
      "Foley catheter removal if possible"
    ],
    outcomeWithoutAI: "Septic shock developed. Required vasopressors and ICU admission. 14-day hospitalization.",
    outcomeWithAI: "AI detected subtle changes at 4-hour mark. Early antibiotic escalation prevented septic shock."
  },
  {
    id: "DEMO-003",
    name: "Cardiac Event Case",
    age: 72,
    diagnosis: "Heart failure exacerbation",
    riskType: "Cardiac",
    timeline: {
      baseline: {
        time: "07:00",
        vitals: {
          heartRate: 72,
          systolicBP: 122,
          diastolicBP: 76,
          respiratoryRate: 16,
          temperature: 98.2,
          spO2: 95,
          painLevel: 2
        },
        clinicalNotes: "Admitted for CHF management. Stable overnight. Dry weight achieved. No peripheral edema noted. Lung sounds with mild bibasilar crackles, baseline for patient. Patient ambulating to bathroom independently. Taking medications as prescribed.",
        riskScore: 0.28,
        aiDetection: ["Known CHF - monitoring for decompensation", "Currently stable"]
      },
      fourHours: {
        time: "11:00",
        vitals: {
          heartRate: 88,
          systolicBP: 138,
          diastolicBP: 86,
          respiratoryRate: 20,
          temperature: 98.4,
          spO2: 93,
          painLevel: 3
        },
        clinicalNotes: "Patient complaining of mild chest discomfort, describes as 'pressure'. Denies radiation. Heart rate irregular, occasional PVCs on telemetry. Lung crackles slightly increased. Patient prefers to remain in semi-Fowler position. 1+ pitting edema noted in ankles. Intake exceeding output.",
        riskScore: 0.55,
        aiDetection: [
          "Heart rate variability change detected",
          "PVC frequency increasing",
          "Fluid overload signs emerging",
          "Chest discomfort concerning"
        ]
      },
      twelveHours: {
        time: "19:00",
        vitals: {
          heartRate: 112,
          systolicBP: 156,
          diastolicBP: 98,
          respiratoryRate: 28,
          temperature: 98.6,
          spO2: 88,
          painLevel: 7
        },
        clinicalNotes: "Patient in acute distress. Severe dyspnea, unable to lie flat. Chest pain 7/10, radiating to left arm. Diaphoretic, pale. Lung sounds with diffuse crackles to apices. 3+ pitting edema bilateral LE. Troponin elevated. 12-lead ECG shows ST changes. Code STEMI called.",
        riskScore: 0.94,
        aiDetection: [
          "CRITICAL: Acute coronary syndrome pattern",
          "Flash pulmonary edema",
          "Hemodynamic instability",
          "Immediate cardiology consultation needed"
        ]
      }
    },
    expectedInterventions: [
      "Stat 12-lead ECG",
      "Serial troponins",
      "Cardiology consult",
      "IV diuretics for fluid overload",
      "Prepare for possible catheterization"
    ],
    outcomeWithoutAI: "STEMI with cardiogenic shock. Emergent catheterization with prolonged recovery.",
    outcomeWithAI: "AI detected early decompensation. Pre-emptive cardiology consult prevented full STEMI."
  }
];

export const getSampleClinicalNotes = (): string[] => [
  "Patient showing increased respiratory effort, decreased responsiveness to verbal stimuli, SpO2 dropped from 96% to 91% over the past 2 hours. Skin slightly mottled on extremities.",
  "Noted temperature spike to 101.2°F. Patient complaining of chills. Urine output decreased. Mental status slightly altered - oriented to person only. Foley catheter in place for 5 days.",
  "Post-cardiac surgery day 2. Patient reports chest heaviness, different from incisional pain. Heart rate irregular on monitor. Blood pressure trending upward. Patient appears anxious."
];
