# Incident Response Plan
## VitaSignal Clinical Intelligence Platform
**Document ID:** SEC-IRP-001  
**Version:** 1.0  
**Date:** 2026-02-13  
**Standard:** FDA Cybersecurity Guidance / NIST SP 800-61

---

## 1. Purpose

Establish procedures for detecting, responding to, and recovering from security incidents and system failures.

## 2. Incident Classification

| Level | Description | Examples | Response Time |
|-------|-------------|----------|---------------|
| **P1 — Critical** | Active compromise or data breach | Unauthorized data access, RLS bypass, credential leak | Immediate (< 1 hour) |
| **P2 — High** | Security vulnerability with exploit potential | Unpatched CVE in dependency, authentication bypass | 4 hours |
| **P3 — Medium** | Degraded security posture | Rate limit evasion, unusual access patterns | 24 hours |
| **P4 — Low** | Minor security improvement | Configuration hardening, log enhancement | 1 week |

## 3. Detection Sources

- **Automated:** Rate limit violation monitoring, audit log anomalies, edge function error spikes
- **Manual:** User reports, security researcher disclosures, code review findings
- **External:** Dependency vulnerability advisories (GitHub Dependabot, npm audit)

## 4. Response Procedures

### 4.1 Identification
1. Triage incoming report — classify severity level
2. Assign incident lead
3. Create incident record with timestamp, source, and initial assessment

### 4.2 Containment
**Immediate (P1/P2):**
- Revoke compromised credentials/tokens
- Enable additional RLS restrictions if needed
- Disable affected edge functions
- Block offending IP addresses via rate limiting

**Short-term:**
- Deploy hotfix to address vulnerability
- Enable enhanced audit logging for affected area
- Notify affected users if data exposure confirmed

### 4.3 Eradication
1. Identify root cause
2. Remove malicious artifacts or fix vulnerability
3. Update dependencies if CVE-related
4. Verify fix with targeted testing

### 4.4 Recovery
1. Restore normal operations
2. Monitor for recurrence (30-day observation)
3. Verify all security controls functioning

### 4.5 Post-Incident Review
1. Conduct post-mortem within 72 hours
2. Document lessons learned
3. Update risk management file (ISO 14971)
4. Create CAPA record for preventive measures
5. Update this IRP if process gaps identified

## 5. Communication Matrix

| Audience | P1 | P2 | P3 | P4 |
|----------|----|----|----|----|
| Development Team | Immediate | 4 hours | Daily standup | Weekly review |
| Stakeholders/Investors | 24 hours | 48 hours | Monthly report | Quarterly report |
| Affected Users | 48 hours (if data exposed) | As needed | N/A | N/A |
| Regulatory Bodies | Per MDR requirements (post-market) | As required | N/A | N/A |

## 6. Contact Information

| Role | Contact | Backup |
|------|---------|--------|
| Incident Lead | info@alexiscollier.com | — |
| Technical Lead | Development Team | — |

## 7. Testing & Maintenance

- Tabletop exercise: Annually
- IRP review and update: Annually or after any P1/P2 incident
- Staff training: Upon onboarding and annually

---

*This plan becomes effective immediately and will be tested via tabletop exercises.*
