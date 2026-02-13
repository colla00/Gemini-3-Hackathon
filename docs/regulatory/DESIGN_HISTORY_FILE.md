# Design History File (DHF)
## VitaSignal Clinical Intelligence Platform
**Document ID:** DHF-001  
**Version:** 1.0  
**Date:** 2026-02-13  
**Standard:** IEC 62304 / 21 CFR 820.30

---

## 1. Design Input Requirements

### 1.1 Intended Use
ICU mortality risk prediction system using temporal documentation pattern analysis from electronic health records.

### 1.2 User Needs
| ID | Need | Priority |
|----|------|----------|
| UN-001 | Early warning for patients at elevated mortality risk | Critical |
| UN-002 | Transparent explanation of risk factors | High |
| UN-003 | Equitable performance across demographic groups | High |
| UN-004 | Integration into existing clinical workflows | Medium |
| UN-005 | Minimal alert fatigue | High |
| UN-006 | Audit trail for regulatory compliance | High |

### 1.3 Design Requirements
| ID | Requirement | Traces To |
|----|-------------|-----------|
| DR-001 | AUC ≥ 0.65 on retrospective validation | UN-001 |
| DR-002 | SHAP explainability for every prediction | UN-002 |
| DR-003 | No demographic features as direct model inputs | UN-003 |
| DR-004 | Role-based access control | UN-006 |
| DR-005 | Trust-based alert filtering | UN-005 |
| DR-006 | Session timeout ≤ 30 minutes | UN-006 |

## 2. Design Output

### 2.1 Software Architecture
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Supabase (PostgreSQL + Edge Functions + Auth)
- **AI/ML:** Documentation-Based Severity (DBS) scoring algorithm
- **Visualization:** Recharts + SHAP attribution charts

### 2.2 Key Components
| Component | Purpose | Status |
|-----------|---------|--------|
| DBS Calculator | Core risk scoring engine | Complete |
| SHAP Charts | Feature attribution visualization | Complete |
| Health Equity Analyzer | Demographic disparity detection | Complete |
| Trust Score Algorithm | Clinician trust quantification | Complete |
| Cognitive Load Monitor | Alert fatigue detection | Complete |
| Adaptive Thresholds | Dynamic sensitivity adjustment | Complete |
| Audit Logging | Compliance trail with IP tracking | Complete |
| RLS Policies | Row-level data access control | Complete |

## 3. Design Verification

### 3.1 Testing Strategy
| Type | Tool | Coverage |
|------|------|----------|
| Unit Tests | Vitest | Risk calculations, utilities, hooks |
| Integration Tests | React Testing Library | Auth flows, dashboard, user journeys |
| E2E Tests | Playwright | Landing, auth, dashboard, performance |
| Accessibility | axe-core | WCAG 2.1 AA compliance |
| Performance | Lighthouse monitoring | Core Web Vitals tracking |

### 3.2 Validation Results
- **Retrospective Validation:** n=26,153 ICU admissions, MIMIC-IV, AUC 0.683
- **Accessibility:** Automated axe-core auditing integrated
- **Security:** RLS policies on all tables, rate limiting, input sanitization

## 4. Design Reviews

| Date | Review Type | Participants | Outcome |
|------|------------|-------------|---------|
| 2025-Q4 | Initial Architecture | Development Team | Approved |
| 2026-Q1 | Security Review | Development Team | RLS + RBAC implemented |
| 2026-Q1 | Accessibility Audit | Development Team | WCAG 2.1 AA target met |
| 2026-Q2 | Regulatory Readiness | Development Team | Compliance roadmap established |

## 5. Design Transfer

Not yet applicable — system is in pre-market research phase.

## 6. Document Index

| Document | Location |
|----------|----------|
| SBOM | `docs/regulatory/SBOM.md` |
| Risk Management (ISO 14971) | `docs/regulatory/ISO_14971_RISK_MANAGEMENT.md` |
| CAPA Procedures | `docs/regulatory/CAPA_PROCEDURES.md` |
| Fairness Metrics | `docs/regulatory/FAIRNESS_METRICS.md` |
| Incident Response Plan | `docs/regulatory/INCIDENT_RESPONSE_PLAN.md` |
| BAA Framework | `docs/regulatory/BAA_FRAMEWORK.md` |
| Privacy Impact Assessment | `docs/regulatory/PRIVACY_IMPACT_ASSESSMENT.md` |

---

*This DHF is a living document updated throughout the design and development lifecycle.*
