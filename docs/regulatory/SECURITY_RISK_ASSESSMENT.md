# Security Risk Assessment
## VitaSignal Clinical Intelligence Platform
**Document ID:** HIPAA-SRA-001  
**Version:** 1.0  
**Date:** 2026-03-10  
**Standard:** NIST SP 800-30 Rev. 1 / 45 CFR §164.308(a)(1)(ii)(A)

---

## 1. Purpose

This Security Risk Assessment (SRA) identifies, evaluates, and prioritizes risks to the confidentiality, integrity, and availability of electronic Protected Health Information (ePHI) processed by the VitaSignal platform, in accordance with the HIPAA Security Rule.

## 2. Scope

- All systems processing, storing, or transmitting ePHI or PII
- Current research prototype phase (de-identified data)
- Future clinical deployment considerations
- Third-party services and integrations

## 3. Assessment Methodology

- **Framework:** NIST SP 800-30 Rev. 1 (Guide for Conducting Risk Assessments)
- **Approach:** Qualitative risk analysis using likelihood × impact matrix
- **Likelihood Scale:** Very Low (1), Low (2), Moderate (3), High (4), Very High (5)
- **Impact Scale:** Negligible (1), Low (2), Moderate (3), High (4), Critical (5)
- **Risk Level:** Likelihood × Impact → Low (1-6), Moderate (7-12), High (13-19), Critical (20-25)

## 4. Asset Inventory

| Asset | Classification | Location | Owner |
|-------|---------------|----------|-------|
| User credentials | PII | Lovable Cloud Auth | Platform Admin |
| User email addresses | PII | Database (RLS-protected) | Platform Admin |
| Audit logs | Metadata | Database (admin-only) | Platform Admin |
| De-identified ICU records | Non-PHI | Simulated in-browser | N/A |
| Encryption keys | Critical | Database (SECURITY DEFINER only) | Platform Admin |
| Session tokens | Sensitive | Client-side (TTL-managed) | User |
| API keys (vendor) | Critical | Database (hashed) | Platform Admin |
| Patent documentation | Confidential | Database + Storage | Platform Admin |
| Contact/licensing inquiries | PII | Database (RLS-protected) | Platform Admin |

## 5. Threat Identification

### 5.1 External Threats

| Threat | Source | Description |
|--------|--------|-------------|
| T-01 | Malicious actors | Unauthorized access via credential stuffing |
| T-02 | Malicious actors | SQL injection / XSS attacks |
| T-03 | Malicious actors | API abuse / DDoS |
| T-04 | Malicious actors | Data exfiltration via compromised accounts |
| T-05 | Nation-state | Advanced persistent threats targeting health data |

### 5.2 Internal Threats

| Threat | Source | Description |
|--------|--------|-------------|
| T-06 | Insider | Unauthorized data access by privileged user |
| T-07 | Human error | Accidental data exposure or misconfiguration |
| T-08 | System | Software bugs leading to data leakage |

### 5.3 Environmental Threats

| Threat | Source | Description |
|--------|--------|-------------|
| T-09 | Infrastructure | Cloud service outage |
| T-10 | Third-party | Supply chain vulnerability in dependencies |

## 6. Vulnerability Assessment

| Vuln ID | Vulnerability | Related Threat | Current Controls |
|---------|--------------|----------------|------------------|
| V-01 | Weak passwords | T-01 | HIBP breach check enabled |
| V-02 | Injection flaws | T-02 | Zod validation, parameterized queries, HTML escaping |
| V-03 | Excessive API access | T-03 | Rate limiting (120 req/min), abuse detection |
| V-04 | Over-privileged accounts | T-06 | RBAC with 3 roles, RLS on all 37+ tables |
| V-05 | Stale sessions | T-04 | 30-min session timeout with TTL |
| V-06 | Unpatched dependencies | T-10 | Dependency scanning |
| V-07 | Unencrypted PII | T-04 | pgcrypto encryption for witness data |
| V-08 | Missing audit trail | T-06 | Comprehensive audit logging with IP tracking |
| V-09 | Anonymous access | T-02 | Explicit deny-by-default RLS for anon role |
| V-10 | Insecure data disposal | T-07 | Data retention policies (newly implemented) |

## 7. Risk Analysis Matrix

| Risk ID | Threat | Vulnerability | Likelihood | Impact | Risk Level | Status |
|---------|--------|--------------|------------|--------|------------|--------|
| R-01 | T-01 | V-01 | Low (2) | High (4) | Moderate (8) | Mitigated |
| R-02 | T-02 | V-02 | Low (2) | High (4) | Moderate (8) | Mitigated |
| R-03 | T-03 | V-03 | Moderate (3) | Moderate (3) | Moderate (9) | Mitigated |
| R-04 | T-06 | V-04 | Low (2) | High (4) | Moderate (8) | Mitigated |
| R-05 | T-04 | V-05 | Low (2) | High (4) | Moderate (8) | Mitigated |
| R-06 | T-10 | V-06 | Moderate (3) | High (4) | High (12) | Monitored |
| R-07 | T-04 | V-07 | Very Low (1) | Critical (5) | Low (5) | Mitigated |
| R-08 | T-06 | V-08 | Low (2) | High (4) | Moderate (8) | Mitigated |
| R-09 | T-02 | V-09 | Low (2) | High (4) | Moderate (8) | Mitigated |
| R-10 | T-07 | V-10 | Moderate (3) | Moderate (3) | Moderate (9) | Mitigated |

## 8. Risk Mitigation Summary

### 8.1 Administrative Safeguards (§164.308)

| Control | Implementation | Status |
|---------|---------------|--------|
| Security management process | Risk assessment + policies | ✅ Complete |
| Assigned security responsibility | Platform admin role | ✅ Complete |
| Workforce security | RBAC + RLS | ✅ Complete |
| Information access management | Role-based, least privilege | ✅ Complete |
| Security awareness training | HIPAA training tracker | ✅ Complete |
| Security incident procedures | Incident response plan + breach tracking | ✅ Complete |
| Contingency plan | Documented in IRP | ✅ Complete |
| Evaluation | Annual risk assessment schedule | ✅ Complete |
| BAA management | Framework documented | 📋 Pending execution |

### 8.2 Technical Safeguards (§164.312)

| Control | Implementation | Status |
|---------|---------------|--------|
| Access control | RBAC + RLS + session management | ✅ Complete |
| Audit controls | Comprehensive logging | ✅ Complete |
| Integrity controls | Input validation, immutable audit logs | ✅ Complete |
| Transmission security | TLS 1.3 enforced | ✅ Complete |
| Encryption | AES-256 at rest, pgcrypto for PII | ✅ Complete |

### 8.3 Physical Safeguards (§164.310)

| Control | Implementation | Status |
|---------|---------------|--------|
| Facility access | Managed by cloud provider | ✅ Inherited |
| Workstation security | N/A (cloud-native) | ✅ N/A |
| Device/media controls | No local PHI storage | ✅ Complete |

## 9. Residual Risk Summary

| Category | Count | Overall Level |
|----------|-------|--------------|
| Critical risks | 0 | — |
| High risks | 1 (dependency management) | Monitored |
| Moderate risks | 7 | Mitigated |
| Low risks | 2 | Accepted |
| **Overall residual risk** | — | **Low-Moderate** |

## 10. Recommendations

1. Activate HIPAA-eligible infrastructure tier before clinical deployment
2. Execute BAAs with all subprocessors
3. Conduct penetration testing prior to PHI processing
4. Establish automated dependency vulnerability scanning in CI/CD
5. Schedule quarterly review of RLS policies
6. Conduct annual SRA updates (next: 2027-03-10)

## 11. Review Schedule

| Activity | Frequency | Next Due |
|----------|-----------|----------|
| Full risk assessment | Annual | 2027-03-10 |
| Policy review | Semi-annual | 2026-09-10 |
| Control effectiveness testing | Quarterly | 2026-06-10 |
| Incident review | After each incident | Ongoing |

---

*This assessment covers the current research prototype phase. A comprehensive reassessment is required prior to any clinical deployment involving PHI.*

**Assessor:** Platform Security Team  
**Date:** 2026-03-10  
**Next Review:** 2027-03-10
