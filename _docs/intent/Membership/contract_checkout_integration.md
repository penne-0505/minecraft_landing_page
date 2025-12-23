---
title: Contract Checkout Integration Intent
status: active
draft_status: n/a
created_at: 2025-12-21
updated_at: 2025-12-23
references:
  - ../../plan/Membership/contract_checkout_integration.md
  - ../../archives/draft/contract_checkout_integration.md
  - ../../archives/draft/contract_page_requirements.md
related_issues: []
related_prs: []
---

## Overview
Contract ページの同意・メタデータ・エラー挙動を整理し、Stripe Checkout フローへ統合する判断を記録する。

## Decision
- 同意項目（必須/任意）を Contract で明示し、metadata として Stripe に送信する。
- plan 未指定や OAuth 失敗時は Membership へ戻す導線を用意する。
- エラーダイアログは背景のクリックでも閉じられるようにする。
- OAuth 自動遷移中の表示は state 管理し、未定義参照によるレンダー失敗を避ける。

## Rationale
- UI モックの要件を実運用フローに落とし込む必要があったため。
- 支援者表示/ロール付与に関わる同意の取得が必須だったため。

## Outcome
- Contract/Checkout の導線が本番フローと一致し、同意情報が伝播する。

## Approval
- 承認: penne
