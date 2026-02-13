# Privacy Impact Assessment (PIA)
## VitaSignal Clinical Intelligence Platform
**Document ID:** HIPAA-PIA-001  
**Version:** 1.0  
**Date:** 2026-02-13  
**Standard:** 45 CFR Part 164 / NIST SP 800-122

---

## 1. System Description

VitaSignal is a clinical intelligence platform that analyzes temporal documentation patterns in ICU electronic health records to predict patient mortality risk and prioritize nursing interventions.

## 2. Data Inventory

### 2.1 Current Phase (Research)

| Data Element | Classification | Source | Storage |
|-------------|---------------|--------|---------|
| De-identified ICU records | Non-PHI | MIMIC-IV (PhysioNet) | Not stored; simulated in-browser |
| User account credentials | PII | User registration | Supabase Auth (encrypted) |
| User email addresses | PII | User registration | Supabase database (RLS-protected) |
| Audit logs | Metadata | System-generated | Supabase database (admin-only access) |
| Session data | Metadata | Browser sessions | Client-side only |
| Contact inquiries | PII | Contact form submissions | Supabase database (RLS-protected) |

### 2.2 Future Phase (Clinical Deployment)

| Data Element | Classification | Handling |
|-------------|---------------|----------|
| Patient demographics | PHI | Encrypted, RLS by organization |
| Clinical notes/documentation | PHI | Processed in-memory only, not stored |
| Risk predictions | PHI-derived | Stored with patient association, RLS-protected |
| SHAP explanations | PHI-derived | Generated on-demand, session-scoped |

## 3. Privacy Risk Assessment

### Risk 1: Unauthorized Access to User Data
- **Likelihood:** Low
- **Impact:** Medium
- **Mitigations:** RLS policies, RBAC, session timeout, audit logging
- **Residual Risk:** Low

### Risk 2: Re-identification of De-identified Data
- **Likelihood:** Very Low (MIMIC-IV meets Safe Harbor standards)
- **Impact:** High
- **Mitigations:** No linkage to external datasets, no demographic features in model
- **Residual Risk:** Very Low

### Risk 3: Insider Threat
- **Likelihood:** Low
- **Impact:** High
- **Mitigations:** RBAC, audit trail with IP tracking, rate limiting, principle of least privilege
- **Residual Risk:** Low

### Risk 4: Third-Party Data Exposure
- **Likelihood:** Low
- **Impact:** High
- **Mitigations:** No PHI transmitted to AI models, edge functions process data server-side, BAA framework for subcontractors
- **Residual Risk:** Low

## 4. Privacy Controls Summary

| Control | Status | Details |
|---------|--------|---------|
| Data minimization | ✅ Complete | Only documentation patterns used; no raw notes stored |
| Purpose limitation | ✅ Complete | Data used solely for risk prediction and clinical support |
| Access control | ✅ Complete | RBAC + RLS + session management |
| Encryption | ✅ Complete | AES-256 at rest, TLS 1.3 in transit |
| Audit trail | ✅ Complete | Full audit logging with IP tracking |
| Data retention policy | 📋 Planned | To be defined for clinical deployment phase |
| Consent management | ✅ Complete | Cookie consent + terms acceptance |
| Breach notification | ✅ Complete | IRP with 24-hour notification commitment |

## 5. Recommendations

1. Conduct updated PIA prior to any clinical deployment with PHI
2. Implement data retention and deletion policies
3. Establish data processing agreements with clinical partners
4. Perform annual PIA reviews

---

*This PIA covers the current research prototype phase. A comprehensive update will be performed prior to clinical deployment involving PHI.*
