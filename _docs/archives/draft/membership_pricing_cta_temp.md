---
title: Temporary wiring for membership pricing CTA
status: superseded
draft_status: n/a
created_at: 2025-12-09
updated_at: 2025-12-21
references: []
related_issues: []
related_prs: []
---

## Context
- Pricingセクションの「このプランで支援する」ボタンに暫定のAPI叩き処理を追加して、クリック動作を確認できる状態にした。
- 本実装では `onStartCheckout` 経由で正式なチェックアウトフローに接続し、暫定のテスト用フェッチを削除する必要がある。

## Follow-ups
- TODO.md に正式実装タスクを追加済み（Membership-Bug-6）。そこで本CTAを本番導線に置き換える。
