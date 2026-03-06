# VitaSignal™ LLC

## Gemini 3 Hackathon 2026 Submission

**Submitted by:** Dr. Alexis Collier, DHA, MHA  
**Hackathon:** Google Gemini 3 Hackathon 2026  
**Deadline:** February 9, 2026

---

## 🏆 Project Overview

VitaSignal™ LLC is an **AI-powered clinical decision support platform** that predicts ICU patient deterioration using temporal patterns in electronic health record data — without requiring physiological sensors, lab values, or additional medical devices.

This submission integrates **Google Gemini 3** to enhance clinical workflows with natural language understanding and reasoning capabilities.

### Core Features
- EHR-based temporal pattern analysis for ICU mortality prediction
- Nursing workload optimization using documentation signals
- SHAP explainability for transparent, bedside-ready AI reasoning
- **11 U.S. Provisional Patent Applications Filed — February 28, 2026**
- Validated across international ICU databases (USA & Switzerland)

### Gemini 3 Integration

| Feature | Description |
|---------|-------------|
| **Clinical Notes Analyzer** | Extracts early warning signs from free-text nurse observations |
| **Explainable Risk Narratives** | Converts SHAP outputs into plain-language bedside explanations |
| **Intervention Recommender** | Suggests evidence-based nursing interventions by clinical urgency |
| **Health Equity Analyzer** | Detects demographic disparities in AI risk predictions |

---

## 🛡️ Security & Compliance

- No API keys in client code — all AI calls routed through secure server-side gateway
- No real patient data — HIPAA-safe synthetic demonstrations only
- FDA Non-Device CDS compliant under the 21st Century Cures Act
- HIPAA & SOC 2 Type II current

---

## 🔧 Setup

```bash
git clone https://github.com/colla00/Gemini-3-Hackathon.git
cd Gemini-3-Hackathon
npm install
npm run dev
```

**Environment Variables** (`.env`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `AI_GATEWAY_KEY` — server-side only, never exposed to client

---

## 📊 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| UI | shadcn/ui, Radix UI |
| Backend | Supabase Edge Functions (Deno) |
| AI | Google Gemini 3 (secure server-side gateway) |
| Charts | Recharts |

---

## 📞 Contact

**Dr. Alexis Collier, DHA, MHA**  
Founder & CEO, VitaSignal LLC  
🌐 [vitasignal.ai](https://vitasignal.ai) | [dralexis.ceo](https://dralexis.ceo)  
📧 Alexis.Collier@ung.edu  
NIH AIM-AHEAD CLINAQ Fellow | Adjunct Faculty, University of North Georgia

---

© 2026 VitaSignal LLC. All rights reserved. Patent Pending — USPTO.  
*Powered by Google Gemini 3 API*
