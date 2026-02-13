# Corrective and Preventive Action (CAPA) Procedures
## VitaSignal Clinical Intelligence Platform
**Document ID:** QMS-CAPA-001  
**Version:** 1.0  
**Date:** 2026-02-13  
**Standard:** ISO 13485:2016 §8.5.2 / §8.5.3

---

## 1. Purpose

Establish systematic procedures for identifying, investigating, and resolving quality issues, and preventing their recurrence.

## 2. Scope

Applies to all software defects, security incidents, performance regressions, model accuracy deviations, and user-reported issues.

## 3. Definitions

| Term | Definition |
|------|-----------|
| **Corrective Action** | Action to eliminate the cause of a detected nonconformity |
| **Preventive Action** | Action to eliminate the cause of a potential nonconformity |
| **Nonconformity** | Non-fulfillment of a requirement |
| **Root Cause** | Fundamental reason for a nonconformity |

## 4. CAPA Process

### 4.1 Identification & Logging
**Sources of input:**
- Automated test failures (Vitest, Playwright)
- Performance regression alerts (Lighthouse monitoring)
- Model drift detection alerts
- User/clinician feedback
- Security vulnerability reports
- Audit log anomalies
- Rate limit violation patterns

**Logging:** All issues are logged with severity (Critical/Major/Minor), affected component, and date detected.

### 4.2 Evaluation & Prioritization

| Severity | Response Time | Example |
|----------|--------------|---------|
| Critical | 4 hours | Security breach, data integrity failure, false negative spike |
| Major | 24 hours | Performance regression, UI accessibility failure |
| Minor | 1 week | Cosmetic defects, non-critical feature requests |

### 4.3 Investigation & Root Cause Analysis
1. Reproduce the issue in a controlled environment
2. Analyze logs (audit logs, rate limit violations, edge function logs)
3. Perform root cause analysis using 5-Why or fishbone diagram
4. Document findings in CAPA record

### 4.4 Action Planning
1. Define corrective action (fix the immediate issue)
2. Define preventive action (prevent recurrence)
3. Assign responsibility and target completion date
4. Identify verification method

### 4.5 Implementation
1. Implement corrective/preventive actions
2. Run regression test suite
3. Deploy via standard release process
4. Update relevant documentation (risk management file, DHF)

### 4.6 Verification of Effectiveness
1. Confirm the nonconformity is resolved
2. Monitor for recurrence over 30-day observation period
3. Review automated test results
4. Close CAPA record with effectiveness determination

## 5. Records

All CAPA records are maintained with:
- Unique CAPA identifier
- Date opened / closed
- Description of nonconformity
- Root cause analysis
- Corrective and preventive actions taken
- Verification of effectiveness
- Responsible party

## 6. Management Review

CAPA trends are reviewed monthly, including:
- Number of open/closed CAPAs by severity
- Average time to resolution
- Recurring issue patterns
- Effectiveness of preventive actions

---

*This procedure is effective immediately and will be reviewed annually or upon significant process changes.*
