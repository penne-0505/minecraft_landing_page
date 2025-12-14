---
title: Legal Pages Public Route & Rendering Plan
status: proposed
draft_status: n/a
created_at: 2025-12-14
updated_at: 2025-12-14
references: []
related_issues: []
related_prs: []
---

## Overview
既存のタブ型 `/legal` プレースホルダを、実務的な固定URL（/legal/terms, /legal/privacy, /legal/refund）で公開し、MarkdownソースをSPA内でレンダリングできるようにする。目次・印刷対応・改定履歴を備え、Contract/フッター等から常に同じURLを参照できる状態を作る。

## Scope
- 新ルート追加：`/legal/terms`, `/legal/privacy`, `/legal/refund`。`/legal` は現行タブページを残しつつ新コンポーネントを呼び出す（選択肢1:A）。
- Markdownレンダリング：`react-markdown` + `remark-gfm` ではなく、依存追加は `react-markdown` と `remark-gfm` のみ。見出しID付与と目次生成は軽量自作（選択肢3:A）。
- ソース：`_docs/guide/legal/*.md` を `?raw` import で参照し、同文面を公開用に利用。
- 改定履歴：各MD末尾に履歴セクションを追加（選択肢2:A、直近3件まで記載）。
- 導線：フッターおよび Contract/Checkout 導線から3リンクを常設。
- 印刷対応：共通CSSに `@media print` を追加（白背景・余白・リンクURL表示）。

## Non-Goals
- 特商法ページ本文の更新（別タスク扱い）。
- 多言語化。
- Cookie同意バナー実装（別タスク）。

## Requirements
- **Functional**
  - 各URLに直接アクセスしてもSPA内で本文が表示される。
  - タブページ `/legal` からも各文書へ遷移できる。
  - 目次（h2/h3ベース）リンクでページ内ジャンプが機能する。
  - 改定履歴セクションが本文に含まれる（手入力）。
  - フッターと Contract ページの同意文言に3リンクを配置。
- **Non-Functional**
  - 追加依存は `react-markdown` + `remark-gfm` のみ。
  - ビルド時にMDを静的取り込みし、SSR不要。
  - 印刷スタイルで白背景・A4想定余白・リンクURL表示。

## Tasks
1. 依存追加: `react-markdown`, `remark-gfm`。
2. `src/legal/config.ts` を作成し、文書メタ（key, title, description, filePath）を定義。
3. `LegalDocPage` コンポーネントを実装：`?raw` でMD読込 → `react-markdown` で描画 → h2/h3抽出で目次生成 → 見出しID付与。
4. 改定履歴セクションを `_docs/guide/legal/terms-of-service.md`, `privacy-policy.md`, `refund-policy.md` 末尾に追記（直近履歴3件まで）。
5. ルーティング追加：`/legal/terms|privacy|refund` を `App.jsx` に定義。`/legal` は現行タブを残しつつ、新ページへのリンクを明示。
6. フッター/Contract/Checkout導線に3リンクを追加し、同意文言を更新。
7. 共通CSSへ印刷用スタイルを追加（背景白・余白・リンクURL表示）。
8. 動作確認：各URL直アクセス、目次アンカー、印刷プレビュー、Contractリンク遷移を手動確認。

## Test Plan
- 手動: `/legal/terms`, `/legal/privacy`, `/legal/refund` へ直接アクセスし表示確認。
- 手動: 目次リンククリックで該当見出しにスクロールすることを確認。
- 手動: ブラウザの印刷プレビューで白背景・余白・リンクURL表示を確認。
- 手動: Contractページのリンクから各文書に遷移し、戻る動線が成立するか確認。

## Deployment / Rollout
- 通常の `npm run build` に含まれる。追加の環境変数なし。
- 公開後、ヘッダー/フッターからのリンクを案内。必要に応じてDiscord告知で周知。
