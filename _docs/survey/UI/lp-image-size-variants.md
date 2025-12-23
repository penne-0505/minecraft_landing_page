---
title: LP Image Size Variant Survey
status: active
draft_status: n/a
created_at: 2025-12-23
updated_at: 2025-12-23
references: ["_docs/guide/design/lp_image_bundling.md", "perf_insight.md"]
related_issues: []
related_prs: []
---

## Background
LighthouseでLP画像が「適切なサイズの画像ではない」と指摘され、特に小さな表示領域で大きな画像バリアントが選択されていた。

## Purpose
LPの表示幅に合わせた小さなバリアントを追加し、転送量とデコード負荷を抑える。

## Method
- `src/assets/images/landing/` のベース画像から 320 / 480 のWebPバリアントを生成する。
- `src/data/lpImages.js` の`srcset`に320/480を追加し、既存の640/1024/1600と併用する。
- `sizes` の指定は既存のレイアウトに合わせて維持する。

## Results
- LPのHero / Gallery / CTAでより小さなバリアントが選択可能になり、モバイル幅での過大配信を抑制できる。

## Considerations
- 追加バリアントが増えるため、アセット数は増加する。
- 画像品質は既存ルール（quality 82）を踏襲する。

## Recommended Actions
- LP画像の320/480バリアントを追加し、`srcset`に反映する。
- Lighthouseで「適切なサイズの画像」の改善を確認する。
