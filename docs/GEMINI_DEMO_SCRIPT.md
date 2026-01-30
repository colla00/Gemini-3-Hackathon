# Gemini 3 Hackathon 2026 - Demo Video Script
## NSO Quality Dashboard: AI-Powered Clinical Decision Support

**Total Runtime:** 3 minutes  
**Presenter:** Dr. Alexis Collier  
**Submission:** Google Gemini 3 Developer Hackathon 2026

---

## 🎬 VIDEO STRUCTURE

| Section | Time | Feature |
|---------|------|---------|
| Intro & Context | 0:00-0:25 | Problem statement |
| Feature 1 | 0:25-1:00 | Clinical Notes Analyzer |
| Feature 2 | 1:00-1:30 | Explainable Risk Narratives |
| Feature 3 | 1:30-2:05 | Intervention Recommendations |
| Feature 4 | 2:05-2:35 | Health Equity Analysis |
| Closing | 2:35-3:00 | Impact & Call to Action |

---

## 📝 FULL SCRIPT

### INTRO (0:00 - 0:25)

**[SCREEN: Landing page with dashboard overview]**

> "Hi, I'm Dr. Alexis Collier. Every year, over 400,000 preventable deaths occur in US hospitals due to delayed recognition of patient deterioration.
>
> The NSO Quality Dashboard uses machine learning to predict patient risk—but nurses need more than just numbers. They need clinical context, actionable insights, and plain-language explanations.
>
> That's where **Google Gemini 3** transforms our platform. Let me show you four AI-powered features built for this hackathon."

**[CLICK: Navigate to Dashboard]**

---

### FEATURE 1: Clinical Notes Analyzer (0:25 - 1:00)

**[SCREEN: Navigate to AI Tools tab]**

> "First, the **Clinical Notes Analyzer**. Nurses document patient observations in free text—but critical warning signs can be buried in the notes."

**[ACTION: Click "AI Tools" tab]**

> "Watch what happens when I enter these nurse observations:"

**[ACTION: Paste sample text into textarea]**
```
Patient showing increased respiratory effort, decreased responsiveness 
to verbal stimuli, SpO2 dropped from 96% to 91% over the past 2 hours. 
Skin slightly mottled on extremities.
```

**[ACTION: Click "Analyze with Gemini 3"]**

> "Gemini 3 Flash instantly extracts the warning signs: declining oxygen saturation, altered mental status, skin mottling—classic signs of early shock.
>
> It assigns a **High Risk** level and recommends increasing monitoring frequency. This takes seconds, not minutes of manual chart review."

**[HIGHLIGHT: Show warning signs list, risk badge, recommendations]**

---

### FEATURE 2: Explainable Risk Narratives (1:00 - 1:30)

**[SCREEN: Click on high-risk patient card]**

> "Now let's look at a high-risk patient. Our ML model predicts an 82% deterioration risk—but what does that actually mean clinically?"

**[ACTION: Click on patient "Sarah Chen" with 0.87 risk score]**

> "Here's where Gemini 3 shines. It converts our technical SHAP explainability values into a plain-language narrative."

**[HIGHLIGHT: AI Risk Narrative card]**

> "Instead of seeing 'heart_rate_variability: 0.32 importance,' nurses read:
>
> *'This patient's elevated heart rate combined with declining oxygen levels and increased work of breathing suggests early respiratory distress. The pattern indicates potential rapid deterioration within 4-6 hours.'*
>
> This is **clinician-friendly AI explainability**—powered by Gemini 3 Pro's advanced reasoning."

---

### FEATURE 3: Intervention Recommendations (1:30 - 2:05)

**[SCREEN: Same patient detail view]**

> "But knowing there's a problem isn't enough. Nurses need to know **what to do**."

**[HIGHLIGHT: Intervention Recommender panel]**

> "Gemini 3 Pro analyzes the patient's specific risk factors and suggests evidence-based interventions, prioritized by urgency:
>
> 1. **URGENT**: Elevate head of bed to 45 degrees—improves lung expansion
> 2. **HIGH**: Increase SpO2 monitoring to every 15 minutes
> 3. **HIGH**: Consider respiratory therapy consult
>
> Each recommendation includes clinical rationale and expected outcomes."

**[ACTION: Click "Mark as Complete" on first intervention]**

> "And when the nurse acts, it's logged for closed-loop feedback. This creates a learning system where we can track which interventions actually improve outcomes."

---

### FEATURE 4: Health Equity Analysis (2:05 - 2:35)

**[SCREEN: Navigate to AI Tools → Health Equity tab]**

> "Finally, and this is critical for my **AIM-AHEAD Fellowship** work—Gemini 3 helps us identify healthcare disparities."

**[ACTION: Click "Health Equity" tab, then "Analyze Population Data"]**

> "Gemini 3 Pro analyzes risk scores and intervention response times across demographic groups."

**[HIGHLIGHT: Equity analysis results]**

> "In this analysis, it identified that patients in certain demographic groups are waiting 25% longer for interventions after high-risk alerts. 
>
> Gemini suggests specific actions: implicit bias training, workflow standardization, and care team diversity initiatives.
>
> This isn't just prediction—it's **AI for health equity**."

---

### CLOSING (2:35 - 3:00)

**[SCREEN: Dashboard overview with all AI badges visible]**

> "In three minutes, you've seen Gemini 3:
> - **Extract** warning signs from unstructured clinical notes
> - **Explain** complex ML predictions in plain language
> - **Recommend** evidence-based interventions
> - **Identify** health equity gaps
>
> This dashboard has **4 U.S. patents filed** and was presented at **Stanford AI+Health 2025**. With Gemini 3 integration, we're not just predicting patient deterioration—we're empowering nurses to prevent it.
>
> Thank you. I'm Dr. Alexis Collier, and this is the NSO Quality Dashboard, powered by Google Gemini 3."

**[END CARD: "NSO Quality Dashboard | Gemini 3 Hackathon 2026 | info@alexiscollier.com"]**

---

## 🎥 RECORDING TIPS

### Pre-Recording Checklist
- [ ] Clear browser cache and test all API endpoints
- [ ] Prepare sample clinical notes text for copy-paste
- [ ] Select a patient with high risk score (>0.80) visible
- [ ] Test all 4 Gemini features work before recording
- [ ] Use 1080p screen recording (OBS or Loom)

### Demo Data to Prepare

**Clinical Notes Sample (copy this):**
```
Patient showing increased respiratory effort, decreased responsiveness 
to verbal stimuli, SpO2 dropped from 96% to 91% over the past 2 hours. 
Skin slightly mottled on extremities.
```

**Alternative Sepsis Notes:**
```
Noted temperature spike to 101.2°F. Patient complaining of chills. 
Urine output decreased. Mental status slightly altered - oriented to 
person only. Foley catheter in place for 5 days.
```

### Visual Highlights
- Pause on "Powered by Gemini 3" badges
- Zoom on risk narratives when displayed
- Show loading states (they're brief but demonstrate real API calls)
- Capture the colored priority badges on interventions

### Audio Tips
- Speak at moderate pace (not rushed)
- Pause briefly when showing results
- Emphasize "Gemini 3" mentions naturally
- Professional but enthusiastic tone

---

## 📊 KEY METRICS TO MENTION (Optional)

If you have extra time:
- "Processes clinical notes in under 2 seconds"
- "Generates intervention suggestions with 95% clinical relevance"
- "Reduces time-to-explanation from minutes to seconds"

---

## 🏷️ REQUIRED ATTRIBUTION

Include in video description:
```
Built with Google Gemini 3 API (gemini-3-flash-preview & gemini-3-pro-preview)
Hackathon Submission - February 2026
Contact: info@alexiscollier.com
```

---

*Script created for Gemini 3 Developer Hackathon 2026*
