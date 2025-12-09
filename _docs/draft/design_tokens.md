---
title: Design Tokens (Draft)
status: proposed
draft_status: exploring
created_at: 2025-12-07
updated_at: 2025-12-07
references:
  - ../plan/Membership/roadmap/plan.md
  - design_request.md
---

## Palette (from current UI)
- **Base**  
  - Background: `#f0f9ff` (page), `#ffffff` (cards), Dark overlay: `#1e293b` (text)  
  - Card shadow base: rgba(0,0,0,0.05) / rgba(50,60,90,0.05)
- **Accent / Brand**  
  - Clover Green: `#5fbb4e` (primary accent, selection)  
  - Clover Dark: `#4a9a3d` (hover/active suggestion)  
  - Discord Purple (CTA): `#5865F2`, Hover shadow: `#4752C4`
- **Neutral**  
  - Text primary: `#1e293b`  
  - Text secondary: `#64748b`  
  - Border: `#e2e8f0` / `#cbd5e1`  
  - Surface dark (hero overlay/cards): `#313338`, `#2b2d31`
- **Status**  
  - Success: `#34d399` (emerald-400) / bg `#ecfdf3`  
  - Warning: `#f59e0b` / bg `#fef9c3`  
  - Error (placeholder): `#f43f5e` / bg `#fef2f2`

## Typography
- Display / Headings: `Outfit`, fallback sans; weights 700/900 for hero, 700 for section titles.  
- Body: `M PLUS Rounded 1c`, fallback sans; weights 400/700.  
- Scales (rem): h1 2.5–3.2, h2 1.8–2.2, h3 1.4–1.6, body 1.0–1.05, small 0.85.  
- Letter spacing: headings tight (-0.01em), caps tags +0.08em.

## Spacing & Layout
- Base unit: 4px grid. Common stacks: 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64.  
- Section paddings: 24–32px (mobile), 48–64px (desktop).  
- Card padding: 16–20px; CTA button padding: 10–12px vertical, 16–20px horizontal.

## Radius
- Small: 8px (chips/pills), Medium: 12px (buttons/cards), Large: 20–24px (hero containers).

## Shadows
- Card: `0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(50,60,90,0.05)` + inset top highlight.  
- Hover/Focus: elevate +2px depth; CTA “push” shadow `0 4px 0 #4752C4` (discord).

## Motion
- Default easing: cubic-bezier(0.4, 0, 0.2, 1).  
- Durations: 200–300ms for hover/tap, 600–800ms for hero/section fade-up.  
- Stagger: 0.15–0.2s for lists/grids.

## Breakpoints (mobile-first)
- sm: 640px, md: 768px, lg: 1024px, xl: 1280px.  
- Hero uses aspect `[4/5]` mobile → `[21/9]` desktop; ensure image covers and overlay gradients remain.

## Components (tokens適用の要所)
- Buttons: primary (Discord) uses accent purple; secondary/ghost uses border `#e2e8f0`; radius 12px; hover scale 1.03, active translateY 4px for “push” style.  
- Pills/Tags: uppercase, letter-spacing +0.08em, bg accent with 10–20% opacity.  
- Cards: radius 20px, shadow as above, border `#e2e8f0`, light gradient or glass for hero.  
- Alerts (checkout result): success = emerald bg/border, warning = amber bg/border; icon 20px; close button ghost style.

## Assets & Imagery
- Hero carousel: keep dark overlay `rgba(0,0,0,0.4)` + top gradient.  
- Avatar fallbacks: Twemoji bust icon `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg`.

## Token export例 (CSS var 提案)
```css
:root {
  --color-bg: #f0f9ff;
  --color-surface: #ffffff;
  --color-text: #1e293b;
  --color-accent: #5fbb4e;
  --color-accent-strong: #4a9a3d;
  --color-cta: #5865f2;
  --color-cta-shadow: #4752c4;
  --color-border: #e2e8f0;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --shadow-card: 0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(50,60,90,0.05);
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 200ms;
  --duration-base: 300ms;
}
```

## Next Steps
- デザイナーに渡して値の微調整とフォント/色の最終決定を依頼。  
- 確定後、`_docs/plan/` または `guide/` に昇格し、CSS vars または design tokens (JSON) を本番に適用。  
- 主要コンポーネント（CTA, Card, Alert, Navbar, Pricingカード）のリファレンス図を追記予定。 
