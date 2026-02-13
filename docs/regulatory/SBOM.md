# Software Bill of Materials (SBOM)
## VitaSignal Clinical Intelligence Platform
**Version:** 1.0.0  
**Generated:** 2026-02-13  
**Format:** CycloneDX-compatible inventory  
**Classification:** Pre-Market Research Prototype

---

## 1. Purpose

This SBOM documents all software components, dependencies, and third-party libraries used in the VitaSignal platform per FDA cybersecurity guidance and NTIA minimum elements for SBOMs.

## 2. Primary Technology Stack

| Component | Version | License | Purpose |
|-----------|---------|---------|---------|
| React | ^18.3.1 | MIT | UI framework |
| TypeScript | ~5.x | Apache-2.0 | Type-safe development |
| Vite | ^5.x | MIT | Build tooling |
| Tailwind CSS | ^3.x | MIT | Utility-first styling |
| Supabase JS | ^2.86.0 | MIT | Backend client (auth, database, storage) |

## 3. UI Component Libraries

| Component | Version | License | Purpose |
|-----------|---------|---------|---------|
| Radix UI (multiple) | ^1.x–^2.x | MIT | Accessible primitives |
| shadcn/ui | N/A (vendored) | MIT | Design system components |
| Lucide React | ^0.462.0 | ISC | Icon library |
| Framer Motion | ^12.27.1 | MIT | Animation library |
| Recharts | ^2.15.4 | MIT | Data visualization |

## 4. Form & Validation

| Component | Version | License | Purpose |
|-----------|---------|---------|---------|
| React Hook Form | ^7.61.1 | MIT | Form state management |
| Zod | ^3.25.76 | MIT | Schema validation |
| @hookform/resolvers | ^3.10.0 | MIT | Zod-RHF integration |

## 5. Routing & State

| Component | Version | License | Purpose |
|-----------|---------|---------|---------|
| React Router DOM | ^6.30.1 | MIT | Client-side routing |
| @tanstack/react-query | ^5.83.0 | MIT | Server state management |
| next-themes | ^0.3.0 | MIT | Theme management |

## 6. Utilities

| Component | Version | License | Purpose |
|-----------|---------|---------|---------|
| date-fns | ^3.6.0 | MIT | Date manipulation |
| clsx | ^2.1.1 | MIT | Conditional classnames |
| tailwind-merge | ^2.6.0 | MIT | Tailwind class merging |
| class-variance-authority | ^0.7.1 | MIT | Component variants |
| jspdf | ^4.0.0 | MIT | PDF generation |
| qrcode.react | ^4.2.0 | ISC | QR code rendering |

## 7. Testing & Quality

| Component | Version | License | Purpose |
|-----------|---------|---------|---------|
| Vitest | ^4.0.16 | MIT | Unit/integration testing |
| @testing-library/react | ^16.3.1 | MIT | Component testing |
| Playwright | ^1.57.0 | Apache-2.0 | E2E testing |
| @axe-core/react | ^4.11.0 | MPL-2.0 | Accessibility auditing |
| jest-axe | ^10.0.0 | MIT | Accessibility test matchers |

## 8. Backend (Supabase Edge Functions)

| Component | Version | License | Purpose |
|-----------|---------|---------|---------|
| Deno | Latest stable | MIT | Edge function runtime |
| Supabase Edge Runtime | Managed | Apache-2.0 | Serverless functions |

## 9. Known Vulnerabilities

As of 2026-02-13, no critical or high-severity CVEs have been identified in direct dependencies. Dependency scanning is performed via automated tooling on each build.

## 10. Update Cadence

- **Critical patches:** Applied within 48 hours of disclosure
- **Minor updates:** Reviewed and applied monthly
- **Major version upgrades:** Evaluated quarterly with regression testing

---

*This document is maintained as part of VitaSignal's cybersecurity compliance program per FDA premarket cybersecurity guidance (2023).*
