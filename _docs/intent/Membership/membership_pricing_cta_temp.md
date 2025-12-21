---
title: Membership Pricing CTA Wiring Intent
status: active
draft_status: n/a
created_at: 2025-12-21
updated_at: 2025-12-21
references:
  - ../../archives/draft/membership_pricing_cta_temp.md
related_issues: []
related_prs: []
---

## Overview
Pricing CTA の暫定実装を本番フローへ移行する判断を記録する。

## Decision
- CTA は `onStartCheckout` 経由で正式な Checkout フローへ接続する。
- 暫定のテスト用フェッチは本実装時に廃止する。

## Rationale
- テスト導線と本番導線の混在を避け、運用上の誤作動を防ぐため。

## Outcome
- CTA が正式フローに統一され、保守負債が解消される。

## Approval
- 承認: penne
