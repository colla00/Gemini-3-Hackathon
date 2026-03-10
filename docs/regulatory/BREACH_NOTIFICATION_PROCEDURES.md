# Breach Notification Procedures
## VitaSignal Clinical Intelligence Platform
**Document ID:** HIPAA-BNP-001  
**Version:** 1.0  
**Date:** 2026-03-10  
**Standard:** 45 CFR §§164.400-414 (HITECH Breach Notification Rule)

---

## 1. Purpose

Establish procedures for identifying, reporting, and responding to breaches of unsecured Protected Health Information (PHI) in compliance with the HIPAA Breach Notification Rule.

## 2. Definitions

- **Breach:** Unauthorized acquisition, access, use, or disclosure of PHI that compromises its security or privacy
- **Unsecured PHI:** PHI not rendered unusable, unreadable, or indecipherable through encryption or destruction
- **Discovery:** The first day the breach is known or should reasonably have been known

## 3. Breach Assessment (4-Factor Test)

Per 45 CFR §164.402, assess:
1. **Nature and extent** of PHI involved (types and identifiers)
2. **Unauthorized person** who used or received the PHI
3. **Whether PHI was actually acquired or viewed** (vs. opportunity only)
4. **Extent of risk mitigation** applied

## 4. Notification Timeline

| Action | Deadline | Responsible Party |
|--------|----------|-------------------|
| Internal discovery report | Immediately | Discovering employee |
| Breach assessment (4-factor) | Within 24 hours | Privacy Officer |
| Covered Entity notification | Within 24 hours of confirmation | Privacy Officer |
| Individual notification | Within 60 days of discovery | Covered Entity |
| HHS notification (≥500) | Within 60 days of discovery | Covered Entity |
| HHS notification (<500) | Annual log submission | Covered Entity |
| Media notification (≥500 in state) | Within 60 days | Covered Entity |

## 5. Incident Response Workflow

### Phase 1: Detection & Containment (0-4 hours)
1. Identify the incident and assess scope
2. Contain the breach (revoke access, isolate systems)
3. Preserve evidence (audit logs, system logs)
4. Log incident in `breach_incidents` table

### Phase 2: Assessment (4-24 hours)
1. Conduct 4-factor breach assessment
2. Determine if notification is required
3. Identify affected individuals
4. Calculate notification deadline
5. Update incident status

### Phase 3: Notification (24-72 hours)
1. Notify Covered Entity (if acting as Business Associate)
2. Prepare individual notification letters
3. Prepare HHS breach report (if ≥500 individuals)
4. Prepare media notification (if ≥500 in single state)

### Phase 4: Remediation (1-30 days)
1. Implement corrective actions
2. Conduct root cause analysis
3. Update security controls
4. Document lessons learned
5. Update risk assessment

## 6. Notification Content (§164.404(c))

Individual notifications must include:
- Description of the breach (what happened, dates)
- Types of information involved
- Steps individuals should take to protect themselves
- What VitaSignal is doing to investigate, mitigate, and prevent recurrence
- Contact information for questions

## 7. Tabletop Exercise Program

### 7.1 Purpose
Regular tabletop exercises test the effectiveness of breach notification procedures and identify gaps in the response process.

### 7.2 Schedule
- **Frequency:** Semi-annual (every 6 months)
- **Duration:** 60-90 minutes per exercise
- **Participants:** All staff with access to the platform

### 7.3 Scenario Categories

| Scenario | Description | Focus Area |
|----------|-------------|------------|
| Credential compromise | Staff account compromised via phishing | Detection, containment, notification |
| Insider threat | Unauthorized data access by privileged user | Audit review, access revocation |
| Ransomware | System encryption by malware | Business continuity, recovery |
| Vendor breach | Third-party subprocessor compromised | BAA obligations, cascade notification |
| Accidental disclosure | PHI sent to wrong recipient | Assessment, individual notification |
| API exploitation | FHIR webhook endpoint abuse | Rate limiting, forensics |

### 7.4 Exercise Documentation
Each exercise is logged in the `tabletop_exercises` table with:
- Scenario description
- Participants
- Findings and gaps identified
- Action items and responsible parties
- Next exercise date

## 8. Record Keeping

All breach-related records retained for minimum 6 years per §164.530(j):
- Breach incident reports
- Risk assessments
- Notification records
- Tabletop exercise results
- Corrective action documentation

---

*These procedures will be validated through tabletop exercises and updated based on findings prior to clinical deployment.*
