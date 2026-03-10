# Internal Audit Program
## VitaSignal Clinical Intelligence Platform
**Document ID:** IAP-001  
**Version:** 1.0  
**Date:** 2026-03-10  
**Standard:** ISO 13485:2016 §8.2.4 / ISO 19011:2018

---

## 1. Purpose

Establish a systematic internal audit program to verify that the QMS conforms to ISO 13485, IEC 62304, ISO 14971, and HIPAA requirements, and is effectively implemented and maintained.

## 2. Audit Schedule

### 2.1 Annual Audit Calendar

| Quarter | Audit Area | Standard | Auditor |
|---------|-----------|----------|---------|
| Q1 (Jan–Mar) | Software Development Lifecycle | IEC 62304 | Quality Manager |
| Q1 (Jan–Mar) | Security Controls & HIPAA | 45 CFR 164 / NIST | CTO |
| Q2 (Apr–Jun) | Risk Management | ISO 14971 | Quality Manager |
| Q2 (Apr–Jun) | Document Control & Records | ISO 13485 §4.2 | Regulatory Affairs |
| Q3 (Jul–Sep) | CAPA Effectiveness | ISO 13485 §8.5 | Quality Manager |
| Q3 (Jul–Sep) | Supplier & Infrastructure | ISO 13485 §7.4 | CTO |
| Q4 (Oct–Dec) | Training & Competency | ISO 13485 §6.2 | HR / Quality Manager |
| Q4 (Oct–Dec) | Post-Market Surveillance | 21 CFR 803 | Regulatory Affairs |

### 2.2 Audit Frequency

| Area | Frequency | Justification |
|------|-----------|---------------|
| Core QMS processes | Annual | ISO 13485 requirement |
| HIPAA security controls | Annual | HIPAA §164.308(a)(8) |
| High-risk areas (CAPA, risk mgmt) | Semi-annual | Risk-based approach |
| Supplier assessments | Annual | Quality impact |
| Ad-hoc audits | As needed | Post-incident or regulatory change |

## 3. Audit Process

### 3.1 Planning Phase
1. Define audit scope, criteria, and objectives
2. Select audit team (ensure independence from audited area)
3. Prepare audit checklist based on applicable standards
4. Notify auditees at least 2 weeks in advance
5. Review previous audit findings and CAPA status

### 3.2 Execution Phase
1. Opening meeting — confirm scope, schedule, and logistics
2. Evidence collection — document review, interviews, observation
3. Finding classification:
   - **Major nonconformity:** Absence or total breakdown of a required process
   - **Minor nonconformity:** Isolated deviation that doesn't affect system effectiveness
   - **Observation:** Improvement opportunity, no nonconformity
4. Closing meeting — present preliminary findings

### 3.3 Reporting Phase
1. Audit report issued within 5 business days
2. Report includes: scope, findings, evidence, and recommendations
3. Report distributed to management and auditees
4. Findings entered into CAPA system if nonconformities identified

### 3.4 Follow-Up Phase
1. Corrective actions proposed within 10 business days
2. Root cause analysis required for major nonconformities
3. Action implementation verified by auditor
4. Effectiveness check after 30 days (minor) or 60 days (major)
5. Audit closed when all actions verified effective

## 4. Audit Checklists

### 4.1 IEC 62304 Software Lifecycle Audit

- [ ] Software safety classification documented and justified
- [ ] Requirements specification current and traceable
- [ ] Architecture design documented
- [ ] Code review process followed
- [ ] Unit and integration tests executed
- [ ] System testing against requirements completed
- [ ] Release process followed with version control
- [ ] Maintenance procedures documented
- [ ] Problem resolution process functional
- [ ] Configuration management effective

### 4.2 ISO 14971 Risk Management Audit

- [ ] Risk management plan current
- [ ] Hazard identification comprehensive
- [ ] Risk estimation documented (severity × probability)
- [ ] Risk evaluation against acceptability criteria
- [ ] Risk control measures implemented and verified
- [ ] Residual risk assessment documented
- [ ] Risk management report current
- [ ] Production/post-production information reviewed

### 4.3 HIPAA Security Audit

- [ ] RLS policies active on all tables (deny-by-default for anon)
- [ ] RBAC roles properly assigned and least-privilege enforced
- [ ] Audit logging functional and immutable
- [ ] Session management (30-min timeout) operational
- [ ] PII encryption (pgcrypto) functioning
- [ ] Password policy (HIBP check) enabled
- [ ] Data retention policies enforced
- [ ] Breach notification procedures tested
- [ ] Training completion records current
- [ ] BAA status documented for all subprocessors

### 4.4 CAPA Effectiveness Audit

- [ ] All CAPAs tracked with unique identifiers
- [ ] Root cause analysis performed for each CAPA
- [ ] Corrective actions implemented within target timeframes
- [ ] Effectiveness verification documented
- [ ] Recurring issues identified and addressed
- [ ] CAPA metrics reported to management

## 5. Auditor Qualifications

| Requirement | Detail |
|-------------|--------|
| Independence | Auditor must not audit their own work |
| Training | ISO 19011 audit methodology awareness |
| Competence | Knowledge of audited standard(s) |
| Experience | Minimum 1 year in relevant quality role |
| Objectivity | No conflicts of interest |

## 6. Management Review of Audit Program

| Input | Frequency |
|-------|-----------|
| Audit schedule completion status | Quarterly |
| Summary of findings by severity | Semi-annual |
| CAPA closure rates from audit findings | Semi-annual |
| Auditor performance and training needs | Annual |
| Audit program effectiveness | Annual |

## 7. Records

All audit records retained for minimum 6 years:
- Audit plans and schedules
- Audit checklists (completed)
- Audit reports
- Finding classifications and evidence
- CAPA records linked to audit findings
- Follow-up verification records
- Management review minutes

---

*The first full internal audit cycle will commence upon formal QMS activation. This program ensures continuous compliance and improvement.*
