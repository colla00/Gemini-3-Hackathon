# CareGuard Clinical Dashboard — Figma Design Specification

> Use this document to recreate the demo dashboard in Figma with pixel-perfect accuracy.

---

## 📐 Layout & Grid

| Property | Value |
|----------|-------|
| **Frame Width** | 1440px (Desktop), 1280px (Laptop), 768px (Tablet) |
| **Max Content Width** | 1400px, centered |
| **Container Padding** | 32px (2rem) |
| **Column Grid** | 12 columns, 24px gutter |
| **Base Spacing Unit** | 4px |
| **Border Radius (--radius)** | 10px (0.625rem) |

### Spacing Scale (Tailwind)
```
4px   → space-1
8px   → space-2
12px  → space-3
16px  → space-4
20px  → space-5
24px  → space-6
32px  → space-8
48px  → space-12
64px  → space-16
```

---

## 🎨 Color Palette

### Light Mode

| Token | HSL | Hex (approx) | Usage |
|-------|-----|--------------|-------|
| **Background** | `210 30% 98%` | #F7F9FB | Page background |
| **Foreground** | `215 25% 17%` | #232D3B | Primary text |
| **Card** | `0 0% 100%` | #FFFFFF | Card surfaces |
| **Primary** | `174 65% 32%` | #1C7A72 | CTA, links, brand |
| **Primary Foreground** | `0 0% 100%` | #FFFFFF | Text on primary |
| **Secondary** | `210 25% 93%` | #E8ECF0 | Secondary backgrounds |
| **Accent** | `199 80% 32%` | #104F78 | Accent elements |
| **Muted** | `210 20% 94%` | #EDF0F3 | Disabled, subtle bg |
| **Muted Foreground** | `215 20% 35%` | #4A5568 | Secondary text |
| **Border** | `215 20% 82%` | #C4CCD6 | Borders, dividers |
| **Destructive** | `0 72% 42%` | #B72828 | Errors, delete |

### Dark Mode

| Token | HSL | Hex (approx) | Usage |
|-------|-----|--------------|-------|
| **Background** | `210 40% 11%` | #111827 | Page background |
| **Foreground** | `210 20% 98%` | #F9FAFB | Primary text |
| **Card** | `210 35% 15%` | #1E293B | Card surfaces |
| **Primary** | `174 72% 46%` | #2DD4BF | CTA, links, brand |
| **Primary Foreground** | `210 40% 11%` | #111827 | Text on primary |
| **Secondary** | `210 30% 20%` | #283548 | Secondary backgrounds |
| **Accent** | `199 89% 48%` | #0EA5E9 | Accent elements |
| **Muted** | `210 25% 25%` | #374151 | Disabled, subtle bg |
| **Muted Foreground** | `210 15% 65%` | #9CA3AF | Secondary text |
| **Border** | `210 25% 25%` | #374151 | Borders, dividers |

### Risk Level Colors

| Level | Light Mode HSL | Dark Mode HSL | Usage |
|-------|----------------|---------------|-------|
| **High** | `0 72% 42%` | `0 84% 60%` | Critical alerts, high risk |
| **Medium** | `30 85% 35%` | `38 92% 50%` | Warnings, medium risk |
| **Low** | `152 60% 28%` | `152 69% 40%` | Success, low risk |
| **Warning** | `35 80% 32%` | `45 93% 47%` | Caution states |

### Chart Colors

| Token | Light HSL | Dark HSL |
|-------|-----------|----------|
| Chart 1 | `174 65% 38%` | `174 72% 55%` |
| Chart 2 | `199 80% 40%` | `199 89% 58%` |
| Chart 3 | `152 60% 35%` | `152 69% 50%` |
| Chart 4 | `280 60% 50%` | `280 70% 65%` |
| Chart 5 | `30 85% 42%` | `38 92% 55%` |

---

## 🔤 Typography

| Style | Font | Weight | Size | Line Height | Letter Spacing |
|-------|------|--------|------|-------------|----------------|
| **Display** | Inter | 800 | 48px (3rem) | 1.0 | -0.025em |
| **Headline** | Inter | 700 | 24px (1.5rem) | 1.2 | normal |
| **Title** | Inter | 600 | 18px | 1.4 | normal |
| **Body** | Inter | 400 | 14px | 1.5 | normal |
| **Body Medium** | Inter | 500 | 14px | 1.5 | normal |
| **Caption** | Inter | 400 | 12px | 1.4 | normal |
| **Label** | Inter | 500 | 12px | 1.4 | normal |
| **Overline** | Inter | 600 | 10px | 1.2 | 0.05em (uppercase) |

**Font Import:**
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap
```

---

## 🎭 Effects & Shadows

### Card Shadows
```css
/* Light Mode */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.06);

/* Dark Mode */
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
```

### Glow Effects
```css
/* Teal Glow (Light) */
box-shadow: 0 0 16px rgba(20, 130, 120, 0.12);

/* Teal Glow (Dark) */
box-shadow: 0 0 20px rgba(45, 212, 191, 0.25);

/* Live Pulse Glow */
box-shadow: 0 0 10px rgba(45, 212, 191, 0.3);
/* Pulsing to: */
box-shadow: 0 0 25px rgba(45, 212, 191, 0.6);
```

### Hover Lift Effect
```css
transform: translateY(-2px);
box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
```

### Glass Morphism (Cards)
```css
background: hsl(var(--card) / 0.8);
backdrop-filter: blur(16px);
border: 1px solid hsl(var(--border) / 0.3);
```

---

## 🧩 Component Specifications

### Button Variants

| Variant | Background | Text | Border | Border Radius |
|---------|------------|------|--------|---------------|
| **Primary** | Primary | Primary Foreground | none | 10px |
| **Secondary** | Secondary | Secondary Foreground | none | 10px |
| **Outline** | transparent | Foreground | 1px Border | 10px |
| **Ghost** | transparent | Muted Foreground | none | 10px |
| **Destructive** | Destructive | White | none | 10px |

**Button Sizes:**
- Default: `h-40px, px-16px, text-14px`
- Small: `h-36px, px-12px, text-14px`
- Large: `h-44px, px-32px, text-14px`
- Icon: `h-40px, w-40px`

### Cards

| Type | Background | Border | Radius | Padding |
|------|------------|--------|--------|---------|
| **Standard** | Card | 1px Border | 16px (rounded-2xl) | 24px |
| **Glass** | Card/80% + blur | 1px Border/30% | 16px | 24px |
| **Elevated** | Card | none | 16px | 24px + shadow-md |

### Badges / Pills

| Type | Background | Text | Padding | Radius |
|------|------------|------|---------|--------|
| **Risk High** | risk-high/15% | risk-high | `4px 12px` | 9999px |
| **Risk Medium** | risk-medium/15% | risk-medium | `4px 12px` | 9999px |
| **Risk Low** | risk-low/15% | risk-low | `4px 12px` | 9999px |
| **Live** | Primary | Primary Foreground | `4px 12px` | 9999px |

### Input Fields

| Property | Value |
|----------|-------|
| Height | 40px |
| Background | Input |
| Border | 1px Border |
| Border Radius | 10px |
| Padding | 12px 16px |
| Focus Ring | 2px Primary (offset 2px) |

---

## 📊 Data Visualization

### SHAP Chart Colors
- **Positive (increases risk):** `hsl(0 70% 45%)` light / `hsl(0 91% 71%)` dark
- **Negative (decreases risk):** `hsl(152 55% 32%)` light / `hsl(152 69% 50%)` dark

### Chart Gradients (Area fills)
```css
/* Primary gradient */
linear-gradient(180deg, 
  hsl(174 65% 38% / 0.25) 0%, 
  hsl(174 65% 38% / 0.02) 100%
);

/* Success gradient */
linear-gradient(180deg, 
  hsl(152 60% 35% / 0.25) 0%, 
  hsl(152 60% 35% / 0.02) 100%
);

/* Danger gradient */
linear-gradient(180deg, 
  hsl(0 72% 42% / 0.25) 0%, 
  hsl(0 72% 42% / 0.02) 100%
);
```

---

## 🎬 Animations

### Timing Functions
- **Ease Out:** `cubic-bezier(0.16, 1, 0.3, 1)` — entrances
- **Ease In Out:** `cubic-bezier(0.4, 0, 0.2, 1)` — state changes
- **Spring:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — bouncy feedback

### Durations
| Type | Duration |
|------|----------|
| Micro (hover states) | 150ms |
| Small (fade, scale) | 200-300ms |
| Medium (slide, expand) | 400ms |
| Large (page transitions) | 500ms |

### Key Animations

**Fade In Up:**
```
0%:   opacity: 0, translateY: 20px
100%: opacity: 1, translateY: 0
Duration: 500ms, ease-out
```

**Scale In:**
```
0%:   opacity: 0, scale: 0.95
100%: opacity: 1, scale: 1
Duration: 300ms, ease-out
```

**Pulse Glow (Live indicator):**
```
0%, 100%: box-shadow: 0 0 10px rgba(45, 212, 191, 0.3)
50%:      box-shadow: 0 0 25px rgba(45, 212, 191, 0.6)
Duration: 2s, ease-in-out, infinite
```

**Number Tick (metrics):**
```
0%:   translateY: -100%, opacity: 0
100%: translateY: 0, opacity: 1
Duration: 300ms, ease-out
```

### Stagger Delays
```
Child 1: 50ms
Child 2: 100ms
Child 3: 150ms
Child 4: 200ms
Child 5: 250ms
Child 6: 300ms
```

---

## 🏗️ Key UI Patterns

### Header Bar
- Height: 64px
- Background: Card with blur
- Border bottom: 1px Border
- Logo + Title left, Actions right
- Live badge with pulse animation

### Navigation Tabs
- Pill-shaped active state
- Active: Primary bg, Primary Foreground text
- Inactive: Ghost, Muted Foreground text
- Calculator tabs: Gradient backgrounds (purple/emerald)

### Patient Cards
- Left border accent (4px, risk color)
- Risk badge top-right
- Hover: lift + stronger shadow
- Grid: 1-3 columns responsive

### Workflow Bar
- Horizontal steps with connecting lines
- Active step: Primary color + glow
- Completed: Primary solid
- Upcoming: Muted/dashed

### Metrics Cards
- Icon in colored circle (24px)
- Large number (Display style)
- Trend indicator (arrow + percentage)
- Hover: subtle lift

### Priority Queue
- Sortable list with drag handles
- Risk color-coded left border
- Timer/countdown for urgent items
- Expandable detail view

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Columns |
|------------|-------|---------|
| Mobile | < 640px | 1 |
| Tablet | 768px | 2 |
| Laptop | 1024px | 3 |
| Desktop | 1280px | 4 |
| Wide | 1400px+ | 4 (max-width) |

---

## 🖼️ Iconography

**Library:** Lucide Icons (https://lucide.dev)

**Common Icons Used:**
- Activity, Heart, AlertTriangle, CheckCircle
- Users, User, UserCheck
- Clock, Timer, Calendar
- TrendingUp, TrendingDown, ArrowUp, ArrowDown
- Shield, ShieldCheck, ShieldAlert
- Settings, Bell, Search, Filter
- Play, Pause, SkipForward, SkipBack
- ChevronRight, ChevronDown, MoreVertical

**Icon Sizes:**
- Small: 16px
- Default: 20px
- Large: 24px
- XL: 32px

---

## 🎯 Figma Setup Checklist

1. **Create Color Styles** from the HSL values (convert to Hex for Figma)
2. **Create Text Styles** for each typography level
3. **Create Effect Styles** for shadows and glows
4. **Build Component Library:**
   - Buttons (all variants + states)
   - Cards (standard, glass, elevated)
   - Badges (risk levels, status)
   - Input fields
   - Navigation tabs
   - Patient cards
   - Metric cards
5. **Set up Auto Layout** with 4px base grid
6. **Create Light/Dark mode variants** using Variables

---

## 📦 Assets to Export

When building in Figma, export these key screens:
1. Dashboard Overview (full width)
2. Patient Worklist (list view)
3. Patient Detail / SHAP Analysis
4. Workflow Timeline
5. ROI Calculator
6. DBS Calculator
7. Mobile responsive views

---

*Last updated: January 2026*
*Design System Version: 2.0*
