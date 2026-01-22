# CareGuard — Figma Quick Reference

## 🎨 Colors

| Token | Light | Dark |
|-------|-------|------|
| Background | `#F7F9FB` | `#111827` |
| Card | `#FFFFFF` | `#1E293B` |
| Primary | `#1C7A72` | `#2DD4BF` |
| Border | `#C4CCD6` | `#374151` |
| Muted Text | `#4A5568` | `#9CA3AF` |
| Risk High | `#B72828` | `#EF4444` |
| Risk Medium | `#B45309` | `#F59E0B` |
| Risk Low | `#166534` | `#22C55E` |

## 🔤 Typography (Inter)

| Style | Size | Weight |
|-------|------|--------|
| Display | 48px | 800 |
| Headline | 24px | 700 |
| Title | 18px | 600 |
| Body | 14px | 400/500 |
| Caption | 12px | 400 |

## 📐 Spacing & Radius

- **Base unit:** 4px
- **Card padding:** 24px
- **Card radius:** 16px
- **Button radius:** 10px
- **Badge radius:** 9999px (pill)
- **Grid gutter:** 24px

## 🧩 Key Components

| Component | Size | Notes |
|-----------|------|-------|
| Header | 1440 × 64px | Logo left, actions right |
| Patient Card | 380 × 140px | 4px left border (risk color) |
| Stat Card | 320 × 100px | Icon + value + label |
| Risk Badge | auto × 28px | Pill shape, risk color bg/15% |
| Live Dot | 8 × 8px | Primary + pulse glow |
| Workflow Step | 40 × 40px circle | Connected by 2px lines |

## 🎭 Effects

```css
/* Card shadow */
box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);

/* Glass blur */
backdrop-filter: blur(16px);
background: rgba(255,255,255,0.8);

/* Hover lift */
transform: translateY(-2px);

/* Live pulse */
box-shadow: 0 0 10px → 25px rgba(45,212,191,0.3→0.6);
```

## 🎬 Animation

- **Hover:** 150ms ease-out
- **Transitions:** 300ms ease-out
- **Stagger delay:** +50ms per child

## 📊 Chart Colors

1. `#1C7A72` (teal)
2. `#104F78` (blue)
3. `#166534` (green)
4. `#7C3AED` (purple)
5. `#B45309` (amber)

---

*Icons: [Lucide](https://lucide.dev) • Font: [Inter](https://fonts.google.com/specimen/Inter)*
