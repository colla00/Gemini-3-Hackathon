

# High-Value Features Audit

After reviewing all 44 pages and the full infrastructure, here are the gaps that would most increase VitaSignal's value — organized by impact.

---

## Already Strong
Landing funnel, investor deck, patent tools, trust center, pricing, careers, ROI calculator, demo, lead pipeline, FDA builder, client portal, evidence portal, integrations page.

## What's Missing (Ranked by Value)

### 1. Blog / Insights Section (`/blog`)
**Why it matters**: No content engine = no organic traffic = no inbound leads. Every competitor publishes. This is the single highest-ROI marketing asset you don't have.
- List page with article cards (title, date, category, read time)
- Article detail page with rich text rendering
- Categories: Clinical AI, Regulatory, Nursing Informatics, Company News
- Database table `blog_posts` with admin-only authoring
- SEO metadata per post (og:image, description, structured data)

### 2. Competitor Comparison Page (`/compare`)
**Why it matters**: Hospital buyers always ask "why not Epic Sepsis Model / Cerner / CLEW?" — this page answers before they ask.
- Side-by-side matrix: VitaSignal vs. Epic vs. CLEW vs. Philips
- Axes: hardware required, validation size, bias testing, cost, deployment time
- Highlight VitaSignal's unique differentiators (equipment-independent, equity-preserving)
- Static page, no database needed

### 3. Press Kit & Media Page (`/press`)
**Why it matters**: Journalists, conference organizers, and partners need assets fast. No press kit = missed coverage.
- Downloadable logos (SVG/PNG), headshots, product screenshots
- Approved boilerplate (50-word, 100-word, 250-word)
- Key facts sheet (auto-pulled from existing stats)
- Media contact info
- Uses existing `patent-screenshots` storage bucket for assets

### 4. Automated Lead Nurture Emails (Edge Function)
**Why it matters**: Leads submit forms and hear nothing. An auto-response within 60 seconds increases conversion 7x.
- Edge function triggered on `contact_inquiries` insert (database webhook)
- Sends branded confirmation email via Resend (already configured)
- Different templates per inquiry type (licensing, pilot, career, general)
- Includes relevant next-step links (ROI calculator, demo, pricing)

### 5. Changelog / Product Updates (`/changelog`)
**Why it matters**: Shows momentum. Investors check for activity signals. Hospital evaluators want to see the product is alive.
- Reverse-chronological list of updates
- Categories: Feature, Security, Regulatory, Research
- Database table `changelog_entries` with admin authoring
- Auto-linked from footer and investor page

---

## Implementation Summary

| Feature | New Pages | DB Tables | Edge Functions | Effort |
|---------|-----------|-----------|----------------|--------|
| Blog | 2 (list + detail) | `blog_posts` | None | Medium |
| Competitor Comparison | 1 | None | None | Small |
| Press Kit | 1 | None | None | Small |
| Lead Nurture Emails | 0 | None | 1 (`lead-nurture`) | Medium |
| Changelog | 1 | `changelog_entries` | None | Small |

Total: 5 new public pages, 2 new tables with RLS, 1 edge function. All routes added to App.tsx with lazy loading. Blog and Changelog get admin-only write access; public read access.

