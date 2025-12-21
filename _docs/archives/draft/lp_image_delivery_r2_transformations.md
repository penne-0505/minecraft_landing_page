---
title: LP Image Delivery via R2 + Image Transformations (Draft)
status: superseded
draft_status: n/a
created_at: 2025-12-20
updated_at: 2025-12-21
references:
  - _docs/plan/Membership/roadmap/plan.md
  - _docs/draft/design_request.md
  - _docs/draft/design_tokens.md
  - _docs/guide/design/lp_image_bundling.md
related_issues: []
related_prs: []
---

## Context
- LPで 1MB 級の画像を 20〜30 枚使用する前提のため、Vite バンドル同梱は初期転送量が大きい。
- Cloudflare Pages でホストする前提に合わせ、R2 + Images Transformations を採用して配信負荷と運用コストを抑える。

## Hypothesis
- R2 にオリジナル画像を保存し、Cloudflare Image Transformations を経由したレスポンシブ配信にすることで、
  初期表示速度を維持しつつ運用コストを最小化できる。

## 決定事項 (2025-12-20)
- 画像総量が 3MB 程度まで圧縮できたため、**R2運用ではなくバンドル配信**へ切り替えた。
- 実運用のガイドは `_docs/guide/design/lp_image_bundling.md` を参照。

## Options / Alternatives
- A: Cloudflare Images
  - 運用が簡単だが、配信枚数に比例して月額コストが増える。
- B: R2 + Image Transformations（採用）
  - 変換/配信は安価で、R2 のストレージ課金と読み取り課金のみ。
  - 運用にはバケット/ドメイン設定とコード側の URL 生成が必要。

## Required Changes (Infra / Ops)
- R2 バケット作成（オリジナル画像格納用）。
- R2 を公開配信可能にする（カスタムドメイン or Workers/Pages で配信）。
- Image Transformations を有効化（`/cdn-cgi/image/` または Workers `cf.image`）。
- キャッシュポリシー（長期キャッシュ + 変更時のファイル名バージョン付与）。
- 画像命名規則と更新フロー（差し替え時のバージョニング運用）。

## Required Changes (Code)
- 画像 URL を一元管理するユーティリティを追加。
  - 例: `IMAGE_BASE_URL` + `buildImageSrc(name, variant)` で URL を生成。
- `srcset` / `sizes` を全体適用し、画面幅に応じて最適サイズを配信。
- ヒーロー画像のみ `fetchpriority="high"` を付与、他は `loading="lazy"`。
- `width` / `height` を指定し、CLS を抑止。
- 外部依存（Imgur）を廃止し、R2 配信 URL に置換。

## Code Touch Points (予定)
- `src/pages/Join.jsx`: IMAGES 定義と `<img>` / `PhotoFrame` の src を R2 生成 URL に変更。
- `src/pages/Home.jsx`: heroImages を R2 生成 URL に変更。
- `src/components/layout/Header.jsx` / `src/pages/Contract.jsx`:
  - 影響範囲は最小化し、ユーザー/外部由来アバターは現状維持。

## Notes / Risks
- 変換キャッシュが効くまでは初回表示が重くなる可能性。
- 画像差し替え時は URL にバージョンを含め、CDN キャッシュを強制更新する。
- 画像の権利/提供元の確認を運用に組み込む。

## Open Questions
- 画像の配信ドメイン（例: `images.<domain>`）はどのドメインを使用するか。
- `srcset` のバリアント数（2/3/4段階）の決定。
- LQIP（ぼかしプレースホルダ）導入の要否。
