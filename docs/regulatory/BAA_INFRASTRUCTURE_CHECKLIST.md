# BAA & HIPAA Infrastructure Readiness Checklist
## VitaSignal Clinical Intelligence Platform
**Document ID:** HIPAA-CHK-001  
**Version:** 1.0  
**Date:** 2026-03-10

---

## 1. Business Associate Agreement (BAA) Execution

| # | Item | Status | Owner | Target Date | Notes |
|---|------|--------|-------|-------------|-------|
| 1.1 | Legal counsel engaged for BAA review | ⬜ Pending | CEO | Pre-deployment | |
| 1.2 | BAA template finalized with legal review | ⬜ Pending | Legal | Pre-deployment | Template in docs/regulatory/BAA_FRAMEWORK.md |
| 1.3 | Lovable Cloud HIPAA-eligible tier activated | ⬜ Pending | CTO | Pre-deployment | Required for PHI processing |
| 1.4 | BAA executed with cloud infrastructure provider | ⬜ Pending | Legal | Pre-deployment | |
| 1.5 | Subprocessor BAAs executed (all vendors) | ⬜ Pending | Legal | Pre-deployment | See BAA_FRAMEWORK.md §4 |
| 1.6 | BAA register created and maintained | ⬜ Pending | Compliance | Pre-deployment | Track all active BAAs |
| 1.7 | Annual BAA review schedule established | ⬜ Pending | Compliance | Post-execution | |

## 2. HIPAA-Eligible Infrastructure

| # | Item | Status | Owner | Target Date | Notes |
|---|------|--------|-------|-------------|-------|
| 2.1 | Upgrade to HIPAA-eligible hosting tier | ⬜ Pending | CTO | Pre-deployment | |
| 2.2 | Verify encryption-at-rest meets HIPAA standards | ✅ Done | CTO | — | AES-256 confirmed |
| 2.3 | Verify encryption-in-transit meets HIPAA standards | ✅ Done | CTO | — | TLS 1.3 confirmed |
| 2.4 | Configure HIPAA-compliant backup procedures | ⬜ Pending | CTO | Pre-deployment | |
| 2.5 | Verify HIPAA-compliant logging and monitoring | ✅ Done | CTO | — | Audit logging implemented |
| 2.6 | Storage buckets set to private | ✅ Done | CTO | — | All 3 buckets private |
| 2.7 | Verify HIPAA-compliant data center certifications | ⬜ Pending | CTO | Pre-deployment | SOC 2 Type II |

## 3. Staff Readiness

| # | Item | Status | Owner | Target Date | Notes |
|---|------|--------|-------|-------------|-------|
| 3.1 | HIPAA Privacy Officer designated | ⬜ Pending | CEO | Pre-deployment | |
| 3.2 | HIPAA Security Officer designated | ⬜ Pending | CEO | Pre-deployment | |
| 3.3 | All staff complete HIPAA training | ⬜ Pending | HR | Pre-deployment | Training tracker built |
| 3.4 | Staff acknowledgment forms signed | ⬜ Pending | HR | Pre-deployment | |
| 3.5 | Background checks completed | ⬜ Pending | HR | Pre-deployment | |

## 4. Operational Readiness

| # | Item | Status | Owner | Target Date | Notes |
|---|------|--------|-------|-------------|-------|
| 4.1 | Data retention policies activated | ✅ Done | CTO | — | Policies table created |
| 4.2 | Data deletion request workflow operational | ✅ Done | CTO | — | Request tracking built |
| 4.3 | Breach notification procedures documented | ✅ Done | Compliance | — | BNP-001 published |
| 4.4 | Tabletop exercise program established | ✅ Done | Compliance | — | Tracking table created |
| 4.5 | Security risk assessment completed | ✅ Done | CTO | — | SRA-001 published |
| 4.6 | Incident response plan documented | ✅ Done | CTO | — | IRP in docs/regulatory/ |
| 4.7 | Annual review schedule established | ✅ Done | Compliance | — | In SRA §11 |
| 4.8 | Penetration testing scheduled | ⬜ Pending | CTO | Pre-deployment | |

## 5. Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| CEO | | | |
| CTO | | | |
| Privacy Officer | | | |
| Legal Counsel | | | |

---

*This checklist must be completed and signed off before any clinical deployment involving PHI.*
