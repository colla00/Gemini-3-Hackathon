# ISO 13485 Quality Management System
## VitaSignal Clinical Intelligence Platform
**Document ID:** QMS-13485-001  
**Version:** 1.0  
**Date:** 2026-03-10  
**Standard:** ISO 13485:2016 (Medical Devices — Quality Management Systems)

---

## 1. Purpose

Establish and document the Quality Management System (QMS) for VitaSignal, ensuring consistent quality in the design, development, and maintenance of medical device software in accordance with ISO 13485:2016.

## 2. Scope

This QMS covers:
- Software design and development (IEC 62304)
- Risk management (ISO 14971)
- Document and record control
- Corrective and preventive actions (CAPA)
- Internal auditing
- Management review
- Supplier and subcontractor management
- Post-market surveillance

## 3. Quality Policy

VitaSignal is committed to:
- Developing safe, effective clinical intelligence software
- Meeting applicable regulatory requirements
- Continuously improving QMS effectiveness
- Ensuring patient safety through rigorous risk management
- Maintaining transparency in AI-driven clinical decision support

## 4. Quality Management System Structure

### 4.1 Document Hierarchy

| Level | Document Type | Examples |
|-------|-------------|----------|
| Level 1 | Quality Manual | This document (QMS-13485-001) |
| Level 2 | Procedures (SOPs) | CAPA procedures, change control, internal audit |
| Level 3 | Work Instructions | Development standards, testing protocols |
| Level 4 | Records & Forms | Test reports, audit findings, CAPA records |

### 4.2 Document Control

| Requirement | Implementation |
|-------------|---------------|
| Document identification | Unique document IDs with version numbers |
| Review and approval | CCB approval for Level 1–2; lead approval for Level 3–4 |
| Distribution | Centralized in `docs/regulatory/` repository |
| Change control | Git version control with full history |
| Obsolete document control | Archived versions retained; current version clearly marked |
| Record retention | Minimum 6 years per HIPAA; indefinite for design records |

### 4.3 QMS Document Register

| Document ID | Title | Version | Status |
|-------------|-------|---------|--------|
| QMS-13485-001 | Quality Management System | 1.0 | Active |
| DHF-001 | Design History File | 1.0 | Active |
| ISO14971-001 | Risk Management Report | 1.0 | Active |
| CAPA-001 | CAPA Procedures | 1.0 | Active |
| SLC-62304-001 | Software Lifecycle Documentation | 1.0 | Active |
| CCP-001 | Change Control Plan | 1.0 | Active |
| SBOM-001 | Software Bill of Materials | 1.0 | Active |
| SRA-001 | Security Risk Assessment | 1.0 | Active |
| HIPAA-BAA-001 | BAA Framework | 1.0 | Active |
| HIPAA-PIA-001 | Privacy Impact Assessment | 1.0 | Active |
| HIPAA-DRP-001 | Data Retention Policy | 1.0 | Active |
| HIPAA-TRN-001 | HIPAA Training Program | 1.0 | Active |
| HIPAA-BNP-001 | Breach Notification Procedures | 1.0 | Active |
| HIPAA-IRP-001 | Incident Response Plan | 1.0 | Active |
| HIPAA-CHK-001 | BAA Infrastructure Checklist | 1.0 | Active |
| MDR-001 | Medical Device Reporting Procedures | 1.0 | Active |
| PMCF-001 | Post-Market Clinical Follow-up Plan | 1.0 | Active |
| IAP-001 | Internal Audit Program | 1.0 | Active |

## 5. Management Responsibility

### 5.1 Management Commitment

Management commits to:
- Establishing and maintaining the QMS
- Ensuring regulatory compliance
- Providing adequate resources
- Conducting management reviews
- Communicating quality objectives

### 5.2 Organizational Roles

| Role | QMS Responsibility |
|------|-------------------|
| CEO | Ultimate QMS authority; resource allocation |
| CTO | Technical quality; software lifecycle oversight |
| Quality Manager | QMS maintenance; audit coordination; CAPA oversight |
| Regulatory Affairs | Compliance monitoring; submission management |
| Clinical Advisor | Clinical input validation; safety review |
| Privacy Officer | HIPAA compliance; data protection |

### 5.3 Management Review

| Element | Frequency | Inputs |
|---------|-----------|--------|
| QMS effectiveness review | Semi-annual | Audit results, CAPA status, customer feedback |
| Quality objectives review | Annual | Performance metrics, regulatory changes |
| Resource adequacy assessment | Annual | Staffing, tooling, training needs |
| Risk management review | Annual | Updated risk analysis, incident history |

## 6. Resource Management

### 6.1 Competence Requirements

| Role | Required Competencies |
|------|----------------------|
| Software developers | TypeScript/React proficiency, IEC 62304 awareness |
| ML engineers | Model development, validation methodology, bias detection |
| QA engineers | Testing methodology, regulatory testing requirements |
| Clinical advisors | ICU clinical experience, EHR documentation expertise |
| All staff | HIPAA training, security awareness |

### 6.2 Training Records

All training tracked in `hipaa_training_completions` database table with:
- Module identification and version
- Completion date and score
- Certificate number
- Annual renewal tracking

### 6.3 Infrastructure

| Component | Quality Impact | Maintenance |
|-----------|---------------|-------------|
| Development environment | Code quality | Automated CI/CD |
| Database platform | Data integrity | Managed service with backups |
| Testing infrastructure | Verification quality | Automated test suites |
| Monitoring systems | Operational quality | SLA metrics dashboard |

## 7. Product Realization

### 7.1 Design and Development

Governed by:
- **IEC 62304** — Software lifecycle processes (SLC-62304-001)
- **ISO 14971** — Risk management (ISO14971-001)
- **Design History File** — Design inputs, outputs, verification, validation (DHF-001)

### 7.2 Design Reviews

| Review | Timing | Participants | Outputs |
|--------|--------|-------------|---------|
| Requirements review | Before development | CTO, Clinical Advisor, Regulatory | Approved requirements spec |
| Design review | Before implementation | CTO, QA Lead | Approved architecture/design |
| Verification review | After testing | CTO, QA Lead | Test report approval |
| Validation review | Before release | CCB | Release authorization |

### 7.3 Purchasing and Supplier Control

| Supplier | Service | Quality Impact | Control Method |
|----------|---------|---------------|----------------|
| Lovable Cloud | Infrastructure | Critical | BAA, SLA monitoring |
| AI Model Providers | Inference | High | Output validation, no PHI exposure |
| npm Registry | Dependencies | Medium | SBOM tracking, vulnerability scanning |

## 8. Measurement, Analysis, and Improvement

### 8.1 Quality Metrics

| Metric | Target | Frequency | Owner |
|--------|--------|-----------|-------|
| CAPA closure rate | < 30 days (medium), < 7 days (critical) | Monthly | Quality Manager |
| Audit finding resolution | 100% within target dates | Quarterly | Quality Manager |
| Training compliance | 100% current | Monthly | HR |
| System uptime | ≥ 99.5% | Weekly | CTO |
| Security incident rate | 0 critical incidents | Monthly | CTO |
| Customer complaint resolution | < 5 business days | Monthly | Quality Manager |

### 8.2 Nonconformity Management

1. Nonconformity identified and documented
2. Immediate containment action taken
3. Root cause analysis performed
4. Corrective action implemented (CAPA-001)
5. Effectiveness verified after 30 days
6. Records retained for minimum 6 years

---

*This QMS will be maintained and improved continuously. Formal ISO 13485 certification is targeted post-seed funding as the platform transitions to clinical deployment.*
