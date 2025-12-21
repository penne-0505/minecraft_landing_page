---
title: LP UI Update Checklist
status: active
draft_status: n/a
created_at: 2025-12-20
updated_at: 2025-12-20
references:
  - _docs/guide/design/lp_image_bundling.md
related_issues: []
related_prs: []
---

## 概要
LP（Join / Home）のUI更新時に、表示崩れや白画面を防ぐための最小チェックリストをまとめる。

## 更新チェックリスト
- 画像差し替えがある場合は `_docs/guide/design/lp_image_bundling.md` の手順に従う。
- JSXで新しいアイコンを使った場合、`lucide-react` の import 一覧に追加する。
- セクション見出しのサイズを調整した場合、他セクションとの見出しバランスを確認する。
- `npm run dev` で Join / Home を表示し、コンソールエラーがないことを確認する。
- 変更が大きい場合は `npm run build` でビルド確認を行う。

## トラブルシューティング
- 画面が真っ白になる場合、ブラウザコンソールの `ReferenceError` を確認する。
  - 例: `Flame is not defined` のようなエラーは、アイコンの import 漏れが原因。
  - 対応: 使ったアイコン名を `lucide-react` の import に追加する。
