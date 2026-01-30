# NSO Quality Dashboard

## Gemini 3 Hackathon 2026 Submission

**Submitted by:** Dr. Alexis Collier  
**Hackathon:** Google Gemini 3 Hackathon 2026  
**Deadline:** February 9, 2026

---

## 🏆 Project Overview

The NSO Quality Dashboard is an **AI-powered clinical decision support system** that predicts patient deterioration in ICU/hospital settings. This submission integrates **Google Gemini 3** to enhance clinical workflows with natural language understanding and reasoning capabilities.

### Core Features (Pre-Hackathon)
- ML-based patient deterioration prediction
- SHAP explainability for risk factors
- Temporal forecasting with confidence intervals
- 4 U.S. Patents Filed
- Presented at Stanford AI+Health 2025

### New Gemini 3 Features (Hackathon Integration)

| Feature | Model Used | Description |
|---------|------------|-------------|
| **Clinical Notes Analyzer** | Gemini 3 Flash | Extracts warning signs from free-text nurse observations |
| **Explainable Risk Narratives** | Gemini 3 Flash | Converts technical SHAP outputs to plain-English explanations |
| **Intervention Recommender** | Gemini 3 Pro | Suggests evidence-based nursing interventions with rationale |
| **Health Equity Analyzer** | Gemini 3 Pro | Detects demographic disparities in AI predictions (AIM-AHEAD) |

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
│  ┌─────────────────┐  ┌─────────────────────────────────┐ │
│  │ analyze-clinical│  │ generate-risk-narrative        │ │
│  │ -notes          │  │ suggest-interventions          │ │
│  │                 │  │ analyze-health-equity          │ │
│  └────────┬────────┘  └────────────────┬────────────────┘ │
└───────────┼────────────────────────────┼────────────────┘
            │                            │
            ▼                            ▼
┌─────────────────────────────────────────────────────────┐
│           Lovable AI Gateway (Gemini 3)                  │
│  ┌───────────────────┐  ┌───────────────────────────────┐ │
│  │ gemini-3-flash-   │  │ gemini-3-pro-preview          │ │
│  │ preview           │  │ (Complex reasoning)           │ │
│  │ (Fast analysis)   │  │                               │ │
│  └───────────────────┘  └───────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### API Key Handling

This project uses **Lovable AI Gateway** which provides secure access to Gemini 3 models without requiring a separate Google API key. The `LOVABLE_API_KEY` is automatically provisioned by the platform.

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
You are a clinical AI assistant that converts technical ML risk predictions 
into clear, actionable explanations for nurses.

Your explanations should:
- Be written in plain clinical language nurses understand
- Focus on what the data means for patient care
- Be concise (under 100 words)
- Never provide diagnoses, only highlight patterns
```

### Intervention Recommender
```
You are a clinical nurse expert AI providing evidence-based nursing 
intervention suggestions. Your recommendations should be:
- Specific and actionable
- Based on established nursing practice guidelines
- Prioritized by urgency
- Include rationale for each intervention
```

---

## 🎬 Demo Scenarios

The project includes 3 realistic demo scenarios in `src/data/geminiDemoScenarios.ts`:

1. **Respiratory Distress** - Post-operative hip replacement patient
2. **Early Sepsis** - UTI patient with catheter (CAUTI risk)
3. **Cardiac Event** - Heart failure decompensation

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
cd nso-quality-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

The project uses Lovable Cloud which automatically provisions:
- `VITE_SUPABASE_URL` - Backend URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Public API key
- `LOVABLE_API_KEY` - Gemini 3 access (auto-provisioned)

---

## 🛡️ Security & Compliance

- **No API keys in client code** - All AI calls go through secure edge functions
- **Input validation** - All user inputs sanitized before AI processing
- **Rate limiting** - Built-in protection against abuse
- **HIPAA considerations** - No real patient data; synthetic demonstrations only

---

## 📊 Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui, Radix UI |
| Backend | Supabase Edge Functions (Deno) |
| AI | Google Gemini 3 (via Lovable AI Gateway) |
| State Management | React Query, React Hooks |
| Charts | Recharts |
| Deployment | Lovable Cloud |

---

## 🏅 Hackathon Highlights

1. **Real Clinical Use Case** - Addresses ICU patient deterioration, a critical healthcare problem
2. **Multiple Gemini 3 Features** - 4 distinct AI-powered capabilities
3. **Explainable AI** - Transparent reasoning for clinical trust
4. **Health Equity Focus** - Aligns with AIM-AHEAD initiative
5. **Patent Protection** - 4 U.S. Patents Filed
6. **Production Ready** - Full error handling, loading states, accessibility

---

## 📞 Contact

**Dr. Alexis Collier**  
Email: alexis.collier@ung.edu  
Stanford AI+Health 2025 Presenter  
AIM-AHEAD Fellowship

---

*Submitted to Gemini 3 Hackathon 2026 | Powered by Google Gemini 3 API*
