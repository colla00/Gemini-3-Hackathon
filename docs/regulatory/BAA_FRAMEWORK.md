# Business Associate Agreement (BAA) Framework
## VitaSignal Clinical Intelligence Platform
**Document ID:** HIPAA-BAA-001  
**Version:** 1.0  
**Date:** 2026-02-13  
**Standard:** 45 CFR §164.502(e), §164.504(e)

---

## 1. Purpose

Provide a BAA template framework for deployment partnerships where VitaSignal may process, store, or transmit Protected Health Information (PHI) on behalf of Covered Entities.

## 2. Current Status

**VitaSignal is currently in pre-market research phase using only de-identified data (MIMIC-IV).** No BAA is required for current operations. This framework is prepared for future clinical deployment.

## 3. BAA Key Terms

### 3.1 Permitted Uses of PHI
- Processing EHR documentation patterns for mortality risk scoring
- Generating SHAP-based explainability reports
- Producing clinical handoff reports
- Audit logging for compliance purposes

### 3.2 Prohibited Uses
- Marketing or sales activities
- Sharing with unauthorized third parties
- De-identification and re-sale of data
- Training of general-purpose AI models

### 3.3 Safeguards Committed

| Safeguard | Implementation |
|-----------|---------------|
| Encryption at rest | AES-256 (Supabase managed) |
| Encryption in transit | TLS 1.3 |
| Access control | RBAC with has_role() security definer |
| Audit trail | Comprehensive logging with user, action, IP |
| Session management | 30-minute timeout with warning |
| Data segregation | Row Level Security per organization |
| Incident notification | Within 24 hours of confirmed breach (per §164.410) |

### 3.4 Breach Notification
- VitaSignal will notify Covered Entity within **24 hours** of discovering a confirmed breach of unsecured PHI
- Notification will include: nature of breach, types of information involved, steps taken, mitigation recommendations

### 3.5 Termination & Data Return
- Upon termination, VitaSignal will return or destroy all PHI within **30 days**
- Certification of destruction provided upon request
- Retained data limited to de-identified aggregates for quality improvement (with Covered Entity consent)

## 4. Subcontractors

| Service | Provider | BAA Status |
|---------|----------|------------|
| Database & Auth | Supabase (via Lovable Cloud) | BAA-eligible tier available |
| Edge Functions | Supabase Edge Runtime | Included in platform BAA |
| AI Processing | Lovable AI | No PHI transmitted to AI models |

## 5. Implementation Checklist

- [ ] Legal counsel review of BAA template
- [ ] Supabase HIPAA-eligible tier activation
- [ ] PHI-specific RLS policies (organization-scoped)
- [ ] Staff HIPAA training documentation
- [ ] Annual BAA review schedule established
- [ ] Breach notification testing (tabletop exercise)

---

*This framework will be finalized with legal counsel prior to any clinical deployment involving PHI.*
