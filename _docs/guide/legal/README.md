---
title: Legal Documents Placeholder
status: proposed
draft_status: n/a
created_at: 2025-12-07
updated_at: 2025-12-21
references:
  - ../../plan/Membership/roadmap/plan.md
related_issues: []
related_prs: []
---

## 概要
法的文書（利用規約・プライバシーポリシー・特商法表記）の開発者向け参照場所です。

本番表示で利用する文面は `src/legal/content/` を正とし、アプリはそちらを参照します。
`_docs/guide/legal/` 配下はレビュー・履歴参照用のコピーとして保持します。

## ファイル配置案
- `terms-of-service.md` : 利用規約
- `privacy-policy.md` : プライバシーポリシー
- `refund-policy.md` : 返金ポリシー
- `specified-commercial-transaction.md` : 特定商取引法に基づく表記

各ファイルは上記 front-matter 形式を踏襲し、更新時は `updated_at` を必ず変更してください。
