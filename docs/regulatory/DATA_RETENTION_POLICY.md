# Data Retention & Deletion Policy
## VitaSignal Clinical Intelligence Platform
**Document ID:** HIPAA-DRP-001  
**Version:** 1.0  
**Date:** 2026-03-10  
**Standard:** 45 CFR §164.530(j) / NIST SP 800-88

---

## 1. Purpose

Establish data retention periods and secure deletion procedures for all data categories processed by VitaSignal, ensuring compliance with HIPAA requirements and data minimization principles.

## 2. Retention Schedule

| Data Category | Retention Period | Justification | Deletion Method |
|--------------|-----------------|---------------|-----------------|
| Audit logs | 6 years | HIPAA §164.530(j) minimum | Automated purge |
| User accounts (active) | Duration of account | Operational necessity | On deletion request |
| User accounts (inactive) | 2 years after last login | Data minimization | Automated purge |
| Session data | 30 minutes | Security requirement | TTL expiration |
| Contact inquiries | 2 years | Business operations | Automated purge |
| Licensing inquiries | 3 years | Business/legal records | Automated purge |
| Rate limit records | 24 hours | Operational monitoring | Automated cleanup |
| Rate limit violations | 30 days | Security monitoring | Automated cleanup |
| FHIR webhook events | 1 year | Integration testing/audit | Automated purge |
| Presentation sessions | 1 year | Analytics | Automated purge |
| Patent records | Indefinite | Legal requirement | Manual only |
| Attestation records | Indefinite | Legal requirement | Manual only |
| Breach incident records | 6 years | HIPAA requirement | Manual only |
| Training completion records | 6 years | Compliance documentation | Manual only |
| Risk assessments | 6 years | Compliance documentation | Manual only |

## 3. Data Deletion Request Procedures

### 3.1 Individual Rights Requests

Individuals may request deletion of their personal data by:
1. Submitting a request through the platform (authenticated users)
2. Contacting the designated privacy officer via email

### 3.2 Request Processing

1. **Receipt:** Request logged in `data_deletion_requests` table
2. **Verification:** Identity verified (authenticated session or email confirmation)
3. **Review:** Admin reviews within 5 business days
4. **Execution:** Data deleted within 30 days of verified request
5. **Confirmation:** Written confirmation provided to requester
6. **Exceptions:** Legally required records (audit logs, attestations) retained per schedule

### 3.3 Deletion Exceptions

The following data cannot be deleted upon request:
- Audit logs (HIPAA retention requirement)
- Patent attestation records (legal evidence)
- Active breach incident records
- Data required for ongoing legal proceedings

## 4. Secure Disposal Methods

| Method | Application | Standard |
|--------|-------------|----------|
| Database record deletion | Structured data | SQL DELETE with verification |
| Storage file deletion | Uploaded documents | Bucket object removal |
| Key destruction | Encryption keys | Cryptographic erasure |
| Account deletion | User accounts | Auth provider removal + cascade |

## 5. Automated Cleanup

The platform implements automated data lifecycle management:
- **Rate limits:** Cleaned every 24 hours via `cleanup_rate_limits()` function
- **Rate limit violations:** Cleaned every 30 days via `cleanup_rate_limit_violations()` function
- **Session storage:** TTL-based expiration (30 min sessions, 7 day preferences)
- **Retention policies:** Configurable per-table via admin dashboard

## 6. Verification & Audit

- All deletion actions are logged in the audit trail
- Quarterly verification that retention policies are being enforced
- Annual review of retention schedule for regulatory changes

---

*This policy will be updated prior to clinical deployment to address PHI-specific retention requirements.*
