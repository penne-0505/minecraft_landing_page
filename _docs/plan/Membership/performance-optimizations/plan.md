---
title: LP Performance Optimization Plan
status: proposed
draft_status: n/a
created_at: 2025-12-22
updated_at: 2025-12-22
references:
  - perf_insight.md
  - _docs/guide/design/lp_image_bundling.md
  - _docs/guide/design/lp_ui_update_checklist.md
related_issues: []
related_prs: []
---

## Overview
perf_insight.md の指摘に基づき、LP（Join / Membership）で発生しているレンダリングブロック、不要 JS、画像サイズ過大、フォント読み込みの問題を解消し、FCP/LCP/TBT/Speed Index の改善を図る。

## Scope
- Tailwind CDN を廃止し、ビルド生成 CSS を配信する構成へ移行する。
- ルート単位のコード分割（React.lazy + Suspense）を導入し、初期バンドルを削減する。
- 画像のレスポンシブ配信を拡充し、ギャラリー/CTA 画像の `srcset` と `sizes` を適正化する。
- 折り返し以降の画像を `loading="lazy"` に切り替え、LCP 対象のみ `fetchpriority="high"` を維持する。
- Google Fonts の読み込みを head に集約し、不要なフォント指定を除外する。
- 必要なドキュメント（guide/reference/intent）を更新する。

## Non-Goals
- UI/レイアウトの再設計、デザイントークンの再定義。
- 画像配信基盤の変更（R2/Image Transformations など）。
- 全アニメーションの全面置き換え（framer-motion の全面削除）。
- GA/Sentry の仕様変更や計測設計の刷新。

## Requirements
- **Functional**:
  - Join / Membership / Supporters / Legal などの画面表示が既存と同等であること。
  - `src/data/lpImages.js` を画像参照の単一ソースとして維持すること。
- **Non-Functional**:
  - `npm run build` が成功し、`npm run preview` で表示崩れがないこと。
  - Tailwind クラスが欠落しないよう、動的クラスは safelist または明示定義で保証すること。
  - `@import` 由来のフォント読み込みを排除し、レンダリングブロックを減らすこと。

## Tasks
1. Tailwind ビルドパイプライン導入
   - Tailwind/PostCSS 関連依存を追加し、`tailwind.config.js` と `postcss.config.js` を作成。
   - `src/styles.css` に Tailwind directives を追加し、`index.html` から CDN スクリプトを削除。
   - 動的クラスの抽出漏れを防ぐため safelist を追加。
2. ルート単位のコード分割
   - `src/App.jsx` を `React.lazy` + `Suspense` 構成に変更し、ページ単位で動的 import を行う。
   - 初期表示で不要なページ JS を読み込まないことを確認。
3. 画像最適化
   - `src/assets/images/landing/gallery/` と `landing/bottom_cta/` に 640/1024/1600 のバリアントを追加。
   - `src/data/lpImages.js` を更新し、ギャラリー/CTA の `srcset` とサイズ情報を拡張。
   - `JoinLanding` の `loading`/`fetchpriority` 指定を整理（LCP 以外は `lazy`）。
4. フォント読み込み最適化
   - `index.html` へ `preconnect` + `stylesheet` を追加し、Google Fonts を集約。
   - 各ページの `<style>@import</style>` を削除し、フォント変数/クラスは必要最小限で残す。
5. ドキュメント更新
   - 画像差し替え手順やフォント読み込み方針が変わる場合、該当 guide を更新する。

## Test Plan
- `npm run dev` で Join / Membership を表示し、画像やフォントの欠落がないことを確認。
- `npm run build` → `npm run preview` で本番相当の表示を確認。
- Lighthouse または DevTools Performance で初期ロードの不要 JS/画像の削減を確認する。

## Deployment / Rollout
- 既存フロー通り Vite ビルドを実施し、Cloudflare Pages へデプロイ。
- デプロイ後に Join / Membership の初期表示と CTA 画像読み込みを確認する。
