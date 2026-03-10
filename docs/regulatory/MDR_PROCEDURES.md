# Medical Device Reporting (MDR) Procedures
## VitaSignal Clinical Intelligence Platform
**Document ID:** MDR-001  
**Version:** 1.0  
**Date:** 2026-03-10  
**Standard:** 21 CFR Part 803 (Medical Device Reporting)

---

## 1. Purpose

Establish procedures for identifying, investigating, and reporting adverse events and product problems to the FDA in accordance with 21 CFR Part 803, as applicable to the VitaSignal clinical intelligence platform.

## 2. Current Regulatory Status

**VitaSignal is currently classified as Non-Device CDS under §520(o)(1)(E).** If this classification is maintained, formal MDR obligations under 21 CFR 803 do not apply. However, these procedures are established proactively for:
- Future regulatory pathway changes
- Voluntary adverse event tracking during research phase
- Best practice alignment with post-market surveillance expectations

## 3. Reportable Events

### 3.1 Mandatory Reports (if device classification applies)

| Event Type | Reporting Deadline | Report To |
|------------|-------------------|-----------|
| Death or serious injury that device may have caused or contributed to | 30 calendar days | FDA (MedWatch 3500A) |
| Malfunction likely to cause or contribute to death or serious injury if recurred | 30 calendar days | FDA (MedWatch 3500A) |
| Events requiring remedial action to prevent unreasonable risk | 5 work days | FDA (MedWatch 3500A) |

### 3.2 Voluntary Reports (current phase)

| Event Type | Action | Timeline |
|------------|--------|----------|
| Software malfunction affecting risk score accuracy | Internal investigation + CAPA | 5 business days |
| User-reported confusion leading to potential misinterpretation | Usability review + documentation update | 10 business days |
| System unavailability during critical period | Incident report + root cause analysis | 24 hours |
| AI bias detection (equity threshold violation) | Equity review + model adjustment | 5 business days |

## 4. Event Detection Sources

| Source | Monitoring Method | Responsibility |
|--------|------------------|---------------|
| User complaints/feedback | Feedback system + contact form | Quality Manager |
| Performance monitoring | Automated SLA metrics | CTO |
| Equity monitoring | Automated demographic analysis | ML Engineer |
| Audit log anomalies | Automated abuse detection | Security Officer |
| Clinical partner reports | Direct communication | Clinical Advisor |
| Post-market surveillance data | PMCF activities | Regulatory Affairs |

## 5. Investigation Process

### 5.1 Initial Assessment (0–48 hours)
1. Event received and logged in tracking system
2. Preliminary assessment of severity and reportability
3. Immediate containment actions if patient safety affected
4. Evidence preservation (logs, data snapshots, user reports)

### 5.2 Investigation (2–15 days)
1. Root cause analysis (5 Whys, fishbone diagram)
2. Impact assessment — scope of affected users/predictions
3. Risk evaluation per ISO 14971
4. Determine if CAPA is required
5. Determine if regulatory report is required

### 5.3 Resolution (15–30 days)
1. Corrective action implemented
2. Effectiveness verification planned
3. MDR report submitted (if applicable)
4. CAPA record updated
5. Documentation updated (DHF, risk analysis)

## 6. Reporting Procedures

### 6.1 Internal Reporting

| Audience | Timeline | Method |
|----------|----------|--------|
| Quality Manager | Immediately upon detection | Direct notification |
| CTO | Within 4 hours | Direct notification |
| CEO | Within 24 hours (serious events) | Incident report |
| Change Control Board | Next scheduled meeting or ad-hoc | Meeting agenda |

### 6.2 External Reporting (if applicable)

| Report | Form | Submission Method | Timeline |
|--------|------|------------------|----------|
| Individual adverse event | MedWatch 3500A | FDA eStar | 30 days |
| 5-day report | MedWatch 3500A | FDA eStar | 5 work days |
| Annual summary | — | Compiled from event log | January 31 |
| Covered Entity notification | Custom template | Secure email | Per BAA terms |

## 7. Complaint Handling

### 7.1 Complaint Categories

| Category | Priority | Response Target |
|----------|----------|----------------|
| Patient safety concern | Critical | 4 hours |
| Risk score accuracy issue | High | 24 hours |
| System availability/performance | High | 24 hours |
| Usability/UX issue | Medium | 5 business days |
| Feature request | Low | Next review cycle |

### 7.2 Complaint Record Requirements

Each complaint record must include:
- Date received and source
- Description of event/complaint
- Product version and configuration
- Investigation findings
- Corrective actions taken
- Determination of reportability
- Final disposition and closure date

## 8. Trending and Analysis

| Analysis | Frequency | Purpose |
|----------|-----------|---------|
| Complaint trending | Monthly | Identify patterns |
| Event type distribution | Quarterly | Focus improvement efforts |
| Resolution time analysis | Quarterly | Process efficiency |
| Reportability assessment review | Semi-annual | Ensure compliance |

## 9. Records Retention

All MDR-related records retained for the useful life of the device plus 2 years, or minimum 6 years, whichever is longer.

---

*These procedures will be activated upon any change in regulatory classification. During the current research phase, voluntary event tracking is active to establish process maturity.*
