---
title: Design Tokens
status: active
draft_status: n/a
created_at: 2025-12-07
updated_at: 2025-12-07
references:
  - ../../plan/Membership/roadmap/plan.md
  - ../../draft/design_request.md
---

## Palette
- Base: `#f0f9ff` (page), `#ffffff` (cards), text `#1e293b`
- Accent: Clover Green `#5fbb4e`, Hover `#4a9a3d`; Discord CTA `#5865F2`, shadow `#4752C4`
- Neutral: Secondary text `#64748b`, border `#e2e8f0` / `#cbd5e1`, dark surface `#313338`/`#2b2d31`
- Status: Success `#34d399` bg `#ecfdf3`; Warning `#f59e0b` bg `#fef9c3`; Error `#f43f5e` bg `#fef2f2`

## Typography
- Headings: Outfit (700/900)  
- Body: M PLUS Rounded 1c (400/700)  
- Scale (rem): h1 2.5–3.2 / h2 1.8–2.2 / h3 1.4–1.6 / body 1.0–1.05 / small 0.85  
- Letter spacing: headings -0.01em, tags +0.08em

## Spacing & Radius
- 4px grid; common: 8/12/16/20/24/32/48/64  
- Section padding: 24–32px (mobile), 48–64px (desktop)  
- Card padding: 16–20px; Button padding: 10–12px x 16–20px  
- Radius: 8px chips, 12px buttons/cards, 20–24px large surfaces

## Shadows
- Card: `0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(50,60,90,0.05)` + inset top highlight  
- Hover/Push: elevate +2px, Discord CTA push shadow `0 4px 0 #4752C4`

## Motion
- Easing: cubic-bezier(0.4, 0, 0.2, 1)  
- Duration: 200–300ms hover/tap, 600–800ms hero/section  
- Stagger: 0.15–0.2s

## Breakpoints
- sm 640px / md 768px / lg 1024px / xl 1280px  
- Hero aspect: `[4/5]` mobile → `[21/9]` desktop

## Components 適用ガイド
- Buttons: primary (Discord) uses accent purple; secondary/ghost border `#e2e8f0`; radius 12px; hover scale 1.03, active translateY 4px  
- Pills/Tags: uppercase, +0.08em letter spacing, accent 10–20% opacity bg  
- Cards: radius 20px, border `#e2e8f0`, soft shadow、グラス風は薄い白bg+blur  
- Alerts (checkout result): success=emerald系、warning=amber系、icon 20px、ghost closeボタン

## Assets
- Hero overlay: `rgba(0,0,0,0.4)` + top gradient  
- Avatar fallback: `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg`

## CSS Variables 提案
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
- デザイナーに共有し微調整 → 確定後は UI 実装へ反映（CSS vars/ThemeProvider 等）。  
- コンポーネント別のサンプル（CTA, Card, Alert, Navbar, Pricing）を追加予定。 
