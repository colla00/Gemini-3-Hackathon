# IEC 62304 Software Lifecycle Documentation
## VitaSignal Clinical Intelligence Platform
**Document ID:** SLC-62304-001  
**Version:** 1.0  
**Date:** 2026-03-10  
**Standard:** IEC 62304:2006+AMD1:2015 (Medical Device Software – Software Life Cycle Processes)

---

## 1. Purpose

Define the software lifecycle processes for the VitaSignal Clinical Intelligence Platform in accordance with IEC 62304, establishing the software development, maintenance, risk management, and configuration management activities required for a Class B medical device software.

## 2. Software Safety Classification

### 2.1 Classification Determination

| Criterion | Assessment |
|-----------|-----------|
| Can the software cause or contribute to a hazardous situation? | Yes — incorrect risk scores could influence clinical decisions |
| Severity of potential harm | Serious (delayed intervention for high-risk patients) |
| Probability of harm occurrence | Low (clinician remains final decision-maker; Non-Device CDS classification) |
| **Software safety class** | **Class B** — Could contribute to a hazardous situation but not directly cause injury |

### 2.2 Classification Justification

VitaSignal is classified as Non-Device CDS under §520(o)(1)(E), meaning:
- It provides recommendations that clinicians independently review
- It does not replace clinical judgment
- It displays the basis for recommendations (SHAP explanations)
- Time-critical scenarios may rely on the system's risk prioritization

Class B is appropriate because the software could contribute to delayed clinical action if risk scores are inaccurate, but the clinician retains final decision authority.

## 3. Software Development Planning

### 3.1 Development Model

**Iterative/Incremental** development with continuous integration and deployment (CI/CD).

### 3.2 Development Activities

| Activity | IEC 62304 Ref | Description | Deliverables |
|----------|--------------|-------------|-------------|
| Requirements analysis | §5.2 | Capture clinical and technical requirements | Requirements specification |
| Architecture design | §5.3 | Define system architecture and interfaces | Architecture document |
| Detailed design | §5.4 | Component-level design and data flows | Design specifications |
| Implementation | §5.5 | Code development following standards | Source code, code reviews |
| Integration testing | §5.6 | Verify component interactions | Test reports |
| System testing | §5.7 | Validate against requirements | Validation report |
| Release | §5.8 | Version control and release management | Release notes |

### 3.3 Development Environment

| Component | Tool/Technology | Version |
|-----------|----------------|---------|
| Language | TypeScript | 5.x |
| Framework | React + Vite | 18.x / 5.x |
| Styling | Tailwind CSS | 3.x |
| Database | PostgreSQL (Lovable Cloud) | 15.x |
| Edge Functions | Deno Runtime | Latest |
| Version Control | Git (GitHub) | — |
| Testing | Vitest + Testing Library | Latest |
| CI/CD | Lovable Platform | Automated |

## 4. Software Requirements Specification

### 4.1 Functional Requirements

| ID | Requirement | Priority | Verification |
|----|------------|----------|-------------|
| FR-001 | System shall calculate mortality risk scores from documentation patterns | Critical | System test |
| FR-002 | System shall display SHAP-based feature attributions for each prediction | Critical | System test |
| FR-003 | System shall generate shift handoff reports with risk prioritization | High | System test |
| FR-004 | System shall enforce RBAC with admin, staff, and viewer roles | Critical | Security test |
| FR-005 | System shall log all user actions in audit trail | Critical | Security test |
| FR-006 | System shall enforce 30-minute session timeout | High | Security test |
| FR-007 | System shall display confidence intervals for all predictions | High | System test |
| FR-008 | System shall monitor demographic subgroup performance | High | Validation |
| FR-009 | System shall accept FHIR R4 resources via webhook endpoint | Medium | Integration test |
| FR-010 | System shall rate-limit API access (120 req/min per IP) | High | Load test |

### 4.2 Non-Functional Requirements

| ID | Requirement | Target | Verification |
|----|------------|--------|-------------|
| NFR-001 | Page load time | < 3 seconds (95th percentile) | Performance test |
| NFR-002 | API response time | < 500ms (95th percentile) | Performance test |
| NFR-003 | Availability | 99.5% uptime | SLA monitoring |
| NFR-004 | Data encryption at rest | AES-256 | Security audit |
| NFR-005 | Data encryption in transit | TLS 1.3 | Security audit |
| NFR-006 | Concurrent users | 100+ simultaneous | Load test |
| NFR-007 | WCAG 2.1 AA accessibility | Compliance | Accessibility audit |

## 5. Software Architecture

### 5.1 System Architecture

```
┌─────────────────────────────────────────────────┐
│                  Client Layer                     │
│  React SPA (TypeScript + Tailwind + Vite)        │
│  ├── Authentication (Auth Provider)               │
│  ├── Clinical Dashboard (Risk Visualization)      │
│  ├── SHAP Explainability Interface                │
│  ├── Equity Monitoring Dashboard                  │
│  └── Admin Panel (RBAC Management)                │
├─────────────────────────────────────────────────┤
│                  API Layer                         │
│  Supabase Client SDK (REST + Realtime)            │
│  ├── Row Level Security (RLS) Policies            │
│  ├── Database Functions (SECURITY DEFINER)        │
│  └── Edge Functions (Deno Runtime)                │
├─────────────────────────────────────────────────┤
│                  Data Layer                        │
│  PostgreSQL Database (Lovable Cloud)              │
│  ├── 37+ Tables with RLS                          │
│  ├── pgcrypto Extension (PII Encryption)          │
│  ├── pg_cron (Scheduled Tasks)                    │
│  └── pg_net (HTTP Requests)                       │
├─────────────────────────────────────────────────┤
│                  Storage Layer                     │
│  Object Storage (Private Buckets)                 │
│  ├── patent-screenshots                           │
│  ├── patent-figures                               │
│  └── dataroom                                     │
└─────────────────────────────────────────────────┘
```

### 5.2 Security Architecture

| Layer | Control | Implementation |
|-------|---------|---------------|
| Authentication | JWT-based session management | Supabase Auth |
| Authorization | Role-based access (3 roles) | `has_role()` SECURITY DEFINER |
| Data access | Row Level Security | Per-table policies (deny-by-default) |
| PII protection | Field-level encryption | pgcrypto triggers |
| API security | Rate limiting + signature verification | Edge function + database |
| Input validation | Schema validation | Zod (client + server) |
| Output encoding | HTML escaping | `escapeHtml()` utility |

### 5.3 Data Flow Architecture

```
User Input → Zod Validation → Supabase Client → RLS Check → Database
                                    ↓
                              Edge Functions → External APIs (rate-limited)
                                    ↓
                              Audit Logging → Immutable Audit Trail
```

## 6. Software Unit Verification

### 6.1 Testing Strategy

| Test Type | Tool | Scope | Coverage Target |
|-----------|------|-------|-----------------|
| Unit tests | Vitest | Components, utilities | 80% |
| Integration tests | Testing Library | User flows | Critical paths |
| Accessibility tests | axe-core | WCAG compliance | All pages |
| Security tests | Manual + automated | RLS, auth, input validation | All endpoints |
| End-to-end tests | Playwright | Complete workflows | Critical paths |

### 6.2 Test Environment

- Automated test execution via CI/CD pipeline
- Test database with isolated data
- Mock external dependencies for reproducibility

## 7. Software Configuration Management

### 7.1 Version Control

- **Repository:** GitHub (private)
- **Branching:** Main branch with feature branches
- **Reviews:** All changes reviewed before merge
- **Tagging:** Semantic versioning (MAJOR.MINOR.PATCH)

### 7.2 Change Control

All changes tracked through:
1. Version control commits with descriptive messages
2. Database migration files (sequential, immutable)
3. Audit logging of runtime configuration changes
4. Predetermined change control plan (see CHANGE_CONTROL_PLAN.md)

## 8. Software Maintenance

### 8.1 Problem Resolution

1. Issue reported via platform or direct communication
2. Severity classified (Critical, High, Medium, Low)
3. Root cause analysis performed
4. Fix implemented, tested, and deployed
5. CAPA initiated if systemic issue identified

### 8.2 Preventive Maintenance

- Dependency updates monitored and applied
- Security patches prioritized (< 24 hours for critical)
- Performance monitoring via SLA metrics
- Scheduled maintenance windows communicated

## 9. Traceability Matrix

| Requirement | Design Element | Implementation | Test | Risk Control |
|-------------|---------------|---------------|------|-------------|
| FR-001 | Risk scoring engine | Dashboard components | Unit + system | H-001, H-002 |
| FR-002 | SHAP visualization | Explainability panel | Unit + visual | H-003 |
| FR-003 | Handoff generator | Report components | System | H-004 |
| FR-004 | Auth + RBAC | AuthProvider + RLS | Security | H-005 |
| FR-005 | Audit system | Audit log edge function | Integration | H-006 |

*Full traceability matrix maintained in the Design History File (DHF).*

## 10. Document References

| Document | ID | Relevance |
|----------|-----|-----------|
| Design History File | DHF-001 | Design inputs/outputs |
| Risk Management Report | ISO14971-001 | Hazard analysis |
| CAPA Procedures | CAPA-001 | Corrective actions |
| SBOM | SBOM-001 | Software dependencies |
| Change Control Plan | CCP-001 | Algorithm updates |
| Security Risk Assessment | SRA-001 | Security controls |

---

*This document establishes the IEC 62304 software lifecycle framework for VitaSignal. It will be maintained alongside the codebase and updated with each significant release.*
