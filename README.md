# VitaSignal™

## Gemini 3 Hackathon 2026 Submission

**Submitted by:** Dr. Alexis Collier, DHA, MHA
**Hackathon:** Google Gemini 3 Hackathon 2026
**Deadline:** February 9, 2026

---

## 🏆 Project Overview

VitaSignal™ is an **AI-powered clinical decision support system** that predicts ICU patient deterioration and nursing documentation burden using temporal patterns in electronic health record data — without requiring physiological sensors, lab values, or additional medical devices.

This submission integrates **Google Gemini 3** to enhance clinical workflows with natural language understanding and reasoning capabilities.

### Core Features (Pre-Hackathon)
- Intensive Documentation Index (IDI): 9-feature temporal EHR pattern analysis for ICU mortality prediction
- SHAP explainability for transparent risk factor visualization
- Temporal forecasting with bootstrap confidence intervals
- **11 U.S. Provisional Patent Applications Filed (February 28, 2026)**
- Presented at Stanford AI+Health 2025

### Validation Summary

| Cohort | N | AUROC | Model |
|--------|---|-------|-------|
| MIMIC-IV (Internal, USA) | 26,153 | 0.683 | IDI |
| HiRID (External, Switzerland) | 33,897 | 0.906 | IDI |
| eICU-CRD (External, USA) | 5,107 | 0.665 | IDI |
| **Total IDI Cohort** | **65,157** | — | — |

*Manuscripts under review: JAMIA (IDI — Paper 1) and npj Digital Medicine (Multinational IDI — Paper 2)*

### New Gemini 3 Features (Hackathon Integration)

| Feature | Model | Description |
|---------|-------|-------------|
| **Clinical Notes Analyzer** | Gemini 3 Flash | Extracts early warning signs from free-text nurse observations in real time |
| **Explainable Risk Narratives** | Gemini 3 Flash | Converts technical SHAP outputs to plain-language bedside explanations |
| **Intervention Recommender** | Gemini 3 Pro | Suggests evidence-based nursing interventions prioritized by clinical urgency |
| **Health Equity Analyzer** | Gemini 3 Pro | Detects demographic disparities in AI risk predictions (NIH AIM-AHEAD aligned) |

---

## 🚀 Gemini 3 Integration Details

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│  │ Clinical    │ │ Risk        │ │ Intervention        │ │
│  │ Notes UI    │ │ Narrative   │ │ Recommender         │ │
│  └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘ │
└─────────┼───────────────┼──────────────────┼────────────┘
          │               │                  │
          ▼               ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase Edge Functions                     │
│  ┌─────────────────┐  ┌────────────────────────────────┐ │
│  │ analyze-clinical│  │ generate-risk-narrative        │ │
│  │ -notes          │  │ suggest-interventions          │ │
│  │                 │  │ analyze-health-equity          │ │
│  └────────┬────────┘  └───────────────┬────────────────┘ │
└───────────┼───────────────────────────┼────────────────┘
            │                           │
            ▼                           ▼
┌─────────────────────────────────────────────────────────┐
│              Secure AI Gateway (Gemini 3)                │
│  ┌───────────────────┐  ┌──────────────────────────────┐ │
│  │ gemini-3-flash-   │  │ gemini-3-pro-preview         │ │
│  │ preview           │  │ (Complex reasoning)          │ │
│  │ (Fast analysis)   │  │                              │ │
│  └───────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### API Key Handling

All AI requests are routed through a **secure server-side gateway** to protect API credentials. No API keys are exposed in client-side code. Access tokens are provisioned and managed server-side.

---

## 📁 File Structure (Gemini Integration)

```
src/
├── components/
│   └── ai/
│       ├── index.ts                    # Barrel exports
│       ├── ClinicalNotesAnalyzer.tsx   # Feature 1: Notes analysis
│       ├── RiskNarrative.tsx           # Feature 2: SHAP explanations
│       ├── InterventionRecommender.tsx # Feature 3: Intervention suggestions
│       └── HealthEquityAnalyzer.tsx    # Feature 4: Equity analysis
├── data/
│   └── geminiDemoScenarios.ts          # Demo patient scenarios
└── components/dashboard/
    └── AIToolsPanel.tsx                # AI Tools tab UI

supabase/functions/
├── analyze-clinical-notes/index.ts     # Edge function for notes analysis
├── generate-risk-narrative/index.ts    # Edge function for narratives
├── suggest-interventions/index.ts      # Edge function for interventions
└── analyze-health-equity/index.ts      # Edge function for equity analysis
```

---

## 💡 Prompt Engineering

### Clinical Notes Analyzer
```
You are a clinical AI assistant analyzing nurse observations to detect
early warning signs of patient deterioration. Your role is to help nurses
identify patterns that may indicate CAUTI, sepsis, respiratory distress,
or other deterioration.

IMPORTANT: You are a decision-support tool, not a diagnostic system.
All findings must be verified by clinical staff.
```

### Risk Narrative Generator
```
Clinical prompt templates are maintained in a private repository 
to protect proprietary clinical reasoning frameworks.
```

---

## 🎬 Demo Scenarios

The project includes 3 realistic demo scenarios in `src/data/geminiDemoScenarios.ts`:

1. **Respiratory Distress** — Post-operative hip replacement patient
2. **Early Sepsis** — UTI patient with catheter (CAUTI risk)
3. **Cardiac Event** — Heart failure decompensation

Each scenario includes:
- Baseline vitals and notes
- 4-hour deterioration update
- 12-hour critical update
- Expected AI detections at each stage
- Comparison of outcomes with/without AI intervention

---

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vitasignal    # or whatever the actual folder name is

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Configure the following environment variables in your `.env` file:
- `VITE_SUPABASE_URL` — Backend URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Public API key
- `AI_GATEWAY_KEY` — Gemini 3 gateway access (server-side only, never in client)

---

## 🛡️ Security & Compliance

- **No API keys in client code** — All AI calls routed through secure server-side gateway
- **Credentials never exposed** — Gateway keys managed server-side only
- **Input validation** — All user inputs sanitized before AI processing
- **Rate limiting** — Built-in protection against abuse
- **HIPAA considerations** — No real patient data; synthetic demonstrations only
- **FDA classification** — Designed for compliance with FDA Non-Device CDS guidelines 
under the 21st Century Cures Act

---

## 📊 Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui, Radix UI |
| Backend | Supabase Edge Functions (Deno) |
| AI | Google Gemini 3 (via secure server-side gateway) |
| State Management | React Query, React Hooks |
| Charts | Recharts |
| Deployment | Cloud-hosted (production) |

---

## 🏅 Hackathon Highlights

1. **Real Clinical Use Case** — Addresses ICU nursing documentation burden and patient deterioration, validated across 65,157 ICU patients in 3 international databases across 2 countries
2. **Multiple Gemini 3 Features** — 4 distinct AI-powered capabilities integrated into a production-ready clinical dashboard
3. **Explainable AI** — SHAP + Gemini 3 narratives for transparent, bedside-ready reasoning nurses can act on
4. **Health Equity Focus** — Health Equity Analyzer aligned with NIH AIM-AHEAD initiative (Grant 1OT2OD032581)
5. **Patent Protected** — 11 U.S. Provisional Patent Applications Filed (February 28, 2026)
6. **Production Ready** — Full error handling, loading states, accessibility, HIPAA-safe synthetic data only

---

## 📞 Contact

**Dr. Alexis Collier, DHA, MHA**
Founder & CEO, VitaSignal LLC
Email: info@alexiscollier.com
Website: [dralexis.ceo](https://dralexis.ceo)
AIM-AHEAD CLINAQ Fellow (NIH 1OT2OD032581) | Independent Researcher

---

© 2026 VitaSignal LLC. All rights reserved.
Core IDI and DBS algorithms patent pending (USPTO).
*Submitted to Gemini 3 Hackathon 2026 | Powered by Google Gemini 3 API*
