# Risk Management File (ISO 14971:2019)
## VitaSignal Clinical Intelligence Platform
**Document ID:** RM-001  
**Version:** 1.0  
**Date:** 2026-02-13  
**Classification:** Pre-Market Research Prototype

---

## 1. Scope

This risk management file applies to the VitaSignal ICU mortality risk prediction system, classified as SaMD Category IIb under IMDRF framework.

## 2. Risk Management Plan

### 2.1 Risk Acceptability Criteria

| Severity | Negligible | Minor | Serious | Critical | Catastrophic |
|----------|-----------|-------|---------|----------|-------------|
| Frequent | Unacceptable | Unacceptable | Unacceptable | Unacceptable | Unacceptable |
| Probable | Acceptable | ALARP | Unacceptable | Unacceptable | Unacceptable |
| Occasional | Acceptable | Acceptable | ALARP | Unacceptable | Unacceptable |
| Remote | Acceptable | Acceptable | Acceptable | ALARP | Unacceptable |
| Improbable | Acceptable | Acceptable | Acceptable | Acceptable | ALARP |

ALARP = As Low As Reasonably Practicable

### 2.2 Verification Activities
- Unit testing (Vitest) with coverage reporting
- Integration testing (React Testing Library)
- End-to-end testing (Playwright)
- Accessibility auditing (axe-core)
- Performance monitoring and regression detection

## 3. Hazard Identification

### H-001: False Negative (Missed High-Risk Patient)
- **Hazard:** Algorithm fails to identify patient with high mortality risk
- **Severity:** Critical
- **Probability:** Occasional (AUC 0.683 indicates ~32% miss rate at optimal threshold)
- **Risk Level:** ALARP
- **Mitigation:**
  1. System is advisory only — never replaces clinical judgment
  2. Research disclaimers on every screen
  3. Confidence intervals displayed with every prediction
  4. SHAP explainability allows clinicians to verify reasoning
  5. Adaptive thresholds adjust sensitivity per unit acuity

### H-002: False Positive (Unnecessary Alert)
- **Hazard:** Algorithm generates alert for patient not at elevated risk
- **Severity:** Minor (alert fatigue, wasted clinical resources)
- **Probability:** Probable
- **Risk Level:** ALARP
- **Mitigation:**
  1. Trust-based alert system reduces redundant notifications
  2. Cognitive load monitoring detects alert fatigue
  3. Configurable alert thresholds per clinician preference
  4. Priority queue ranking prevents low-risk alerts from dominating

### H-003: Algorithm Bias Across Demographics
- **Hazard:** Differential performance across race, gender, or age groups
- **Severity:** Serious
- **Probability:** Occasional
- **Risk Level:** ALARP
- **Mitigation:**
  1. No demographic features used as direct model inputs
  2. Health Equity Analyzer monitors subgroup performance in real-time
  3. Equity monitoring engine tracks fairness metrics continuously
  4. Bias monitoring dashboard visible to all users

### H-004: Data Integrity Failure
- **Hazard:** Corrupted or incomplete input data leads to erroneous prediction
- **Severity:** Serious
- **Probability:** Remote
- **Risk Level:** Acceptable
- **Mitigation:**
  1. Input validation via Zod schemas
  2. Missing data handling with explicit indicators
  3. Confidence scores reduced for incomplete inputs

### H-005: Unauthorized Access to Clinical Data
- **Hazard:** PHI or clinical data accessed by unauthorized users
- **Severity:** Critical
- **Probability:** Remote
- **Risk Level:** ALARP
- **Mitigation:**
  1. Row Level Security (RLS) on all database tables
  2. Role-based access control (Admin/Staff/Viewer)
  3. Session timeout after 30 minutes of inactivity
  4. Audit logging with IP tracking
  5. Research phase uses only de-identified MIMIC-IV data

### H-006: System Unavailability During Critical Decision
- **Hazard:** Platform downtime prevents access to risk predictions
- **Severity:** Minor (system is advisory, not sole decision tool)
- **Probability:** Remote
- **Risk Level:** Acceptable
- **Mitigation:**
  1. Clear disclaimers that system supplements clinical judgment
  2. Graceful error handling with informative messages
  3. Edge function architecture provides independent scaling

## 4. Risk/Benefit Analysis

The VitaSignal system provides early warning signals for ICU mortality risk based on documentation patterns. Benefits include:
- Earlier identification of deteriorating patients
- Reduced cognitive burden through prioritized patient lists
- Transparent AI reasoning via SHAP explanations
- Equity monitoring to prevent disparate impact

Residual risks are mitigated by the advisory-only nature of the system and comprehensive disclaimers.

## 5. Post-Market Risk Monitoring

- Real-time AUC, sensitivity, and specificity tracking
- Model drift detection architecture
- Alert fatigue metrics
- Adaptive threshold visualization
- Incident reporting procedures (planned)

---

*This document will be updated as the system progresses through clinical validation and regulatory review.*
